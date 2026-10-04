import { createClientFromRequest } from 'npm:@base44/sdk@0.8.46';

const TEAM_RECIPIENTS = ['jakub1duch@gmail.com', 'info@mlzidla.cz', 'meduna@holmtec.cz'];
const clean = (value: unknown, max: number) => String(value || '').trim().slice(0, max);
const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[char] as string));

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const name = clean(body.name, 160);
    const phone = clean(body.phone, 80);
    const email = clean(body.email, 254).toLowerCase();
    const sourcePage = clean(body.source_page, 1000);
    const topic = clean(body.topic, 240);
    const summary = clean(body.summary, 3000);
    const transcript = clean(body.transcript, 12000);
    const consent = body.consent === true;
    const recommendedProducts = Array.isArray(body.recommended_products)
      ? body.recommended_products.map((item: unknown) => clean(item, 120)).filter(Boolean).slice(0, 8)
      : [];

    if (!name || !phone || !transcript || !consent) {
      return Response.json({ error: 'missing_required_fields' }, { status: 400 });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'invalid_email' }, { status: 400 });
    }

    const lead = await base44.asServiceRole.entities.WebAdvisorLead.create({
      name,
      phone,
      email,
      source_page: sourcePage,
      topic,
      summary,
      transcript,
      recommended_products: recommendedProducts,
      status: 'new',
      consent: true,
    });

    let inquiry = null;
    if (email) {
      inquiry = await base44.asServiceRole.entities.Poptavka.create({
        jmeno: name,
        email,
        telefon: phone,
        produkt: recommendedProducts[0] || 'AI poradce — výběr mlžítka',
        service_type: 'ai_misting_advisor',
        request_type: 'standard',
        zprava: [
          'Zdroj: AI poradce webu MLŽIDLA.cz',
          topic ? `Téma: ${topic}` : '',
          summary ? `Shrnutí: ${summary}` : '',
          recommendedProducts.length ? `Doporučené produkty: ${recommendedProducts.join(', ')}` : '',
          sourcePage ? `Stránka: ${sourcePage}` : '',
          '',
          'Přepis komunikace:',
          transcript,
        ].filter(Boolean).join('\n'),
        status: 'nova',
        offer_status: 'nova_poptavka',
        contact_source: 'manual',
        contact_confirmed_by_user: true,
        contact_confirmed_at: new Date().toISOString(),
        privacy_contact_consent: true,
        privacy_contact_consent_at: new Date().toISOString(),
      });
      await base44.asServiceRole.entities.WebAdvisorLead.update(lead.id, { inquiry_id: inquiry.id });
    }

    const subject = `AI poradce — nový kontakt: ${name} | MLŽIDLA®`;
    const bodyHtml = `
      <div style="font-family:Arial,sans-serif;max-width:720px;margin:0 auto;background:#eef3f4;padding:24px">
        <div style="background:#0d2d38;color:#fff;padding:24px;border-radius:18px 18px 0 0">
          <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#61d5e5">MLŽIDLA® · AI poradce 24/7</div>
          <h1 style="margin:8px 0 0;font-size:22px">Nový kontakt z webového chatu</h1>
        </div>
        <div style="background:#fff;padding:26px;border:1px solid #dbe5e7;border-top:0;border-radius:0 0 18px 18px">
          <p><strong>Jméno:</strong> ${escapeHtml(name)}</p>
          <p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>
          ${email ? `<p><strong>E-mail:</strong> ${escapeHtml(email)}</p>` : ''}
          ${topic ? `<p><strong>Téma:</strong> ${escapeHtml(topic)}</p>` : ''}
          ${recommendedProducts.length ? `<p><strong>Doporučené produkty:</strong> ${escapeHtml(recommendedProducts.join(', '))}</p>` : ''}
          ${sourcePage ? `<p><strong>Zdrojová stránka:</strong> ${escapeHtml(sourcePage)}</p>` : ''}
          <div style="margin-top:18px;padding:16px;border-radius:14px;background:#f5f8f8;white-space:pre-wrap;line-height:1.6">${escapeHtml(transcript)}</div>
          <p style="margin-top:18px;color:#667b82;font-size:12px">Klientovi bylo sděleno, že tým MLŽIDLA.cz naváže kontakt nejpozději do 24 hodin.</p>
        </div>
      </div>`;

    await Promise.all(TEAM_RECIPIENTS.map((to) =>
      base44.asServiceRole.integrations.Core.SendEmail({ to, subject, body: bodyHtml }).catch(() => null)
    ));

    return Response.json({
      ok: true,
      lead_id: lead.id,
      inquiry_id: inquiry?.id || null,
      portal_url: '/klientska-sekce',
    }, {
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    return Response.json({ error: error?.message || 'advisor_lead_failed' }, { status: 500 });
  }
}
