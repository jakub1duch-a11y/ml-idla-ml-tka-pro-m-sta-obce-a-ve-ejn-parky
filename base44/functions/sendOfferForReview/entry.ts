import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { buildClientOfferEmail, loadOfferEmailData } from '../../shared/clientOfferEmail.ts';
import { sendViaGmail } from '../../shared/customerEmails.ts';

const clean = (v: unknown, max = 2000) => String(v || '').trim().slice(0, max);
const escapeHtml = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[c] as string));

// Interní e-mail pro kontrolu AI nabídky — odesílá se na Jakub1duch@gmail.com
// Není to odeslání zákazníkovi. Obsahuje náhled klientského e-mailu, PDF a vizualizace.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403, headers: { 'Cache-Control': 'no-store' } });

    const body = await req.json().catch(() => ({}));
    const projectId = clean(body.project_id || body.project_order_id);
    const dryRun = Boolean(body.dry_run);

    if (!projectId) return Response.json({ error: 'missing_project_id' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });

    const loaded = await loadOfferEmailData(base44, projectId);
    if (!loaded) return Response.json({ error: 'not_found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });

    const { data, project } = loaded;
    const clientEmail = buildClientOfferEmail(data);

    const reviewRecipient = 'jakub1duch@gmail.com';
    const quoteNumber = clean(project.quote_number);
    const clientName = clean(project.client_name);
    const productName = clean(project.product_name);
    const subject = `[AI-NABIDKA] [AI nabídka ke kontrole] ${quoteNumber} – ${clientName} – ${productName}`;

    // Build review email HTML — contains preview of client email + links to PDF and visualizations
    const pdfLinks = [
      project.quote_pdf_url ? `<li><a href="${escapeHtml(project.quote_pdf_url)}" style="color:#0B5FFF">Cenová nabídka ${escapeHtml(quoteNumber)}.pdf</a></li>` : '',
      project.presentation_pdf_url ? `<li><a href="${escapeHtml(project.presentation_pdf_url)}" style="color:#0B5FFF">Prezentace ${escapeHtml(quoteNumber)}.pdf</a></li>` : '',
    ].filter(Boolean).join('');

    const visualLinks = data.visualizations.map((url, i) => `<li><a href="${escapeHtml(url)}" style="color:#0B5FFF">Vizualizace ${i + 1}</a></li>`).join('');

    const reviewHtml = `<!doctype html><html lang="cs"><head><meta charset="utf-8"></head><body style="margin:0;padding:0;background:#f2f5f4;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f2f5f4"><tr><td align="center" style="padding:24px 14px">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#fff;border:1px solid #dfe7e7;border-radius:16px;overflow:hidden">
<tr><td style="background:#0B2034;padding:20px 28px;color:#fff">
<div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#00A8E8;font-weight:700">AI-NABIDKA · MLŽIDLA.cz</div>
<div style="font-size:18px;font-weight:700;margin-top:6px">Nabídka ke kontrole — ${escapeHtml(quoteNumber)}</div>
<div style="font-size:12px;color:rgba(255,255,255,.7);margin-top:4px">Tento e-mail je interní kontrolní kopie, NEBYL odeslán zákazníkovi.</div>
</td></tr>
<tr><td style="padding:24px 28px">
<p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#0B2034">Byla vygenerována nová AI nabídka. Před odesláním zákazníkovi ji prosím zkontrolujte v administraci.</p>

<div style="margin:18px 0;padding:16px 20px;background:#F8FBFC;border-radius:10px;border:1px solid #D3E2E8">
<div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#586A72;margin-bottom:8px">Detail nabídky</div>
<table cellpadding="4" cellspacing="0" style="font-size:13px;color:#0B2034;width:100%">
<tr><td style="color:#586A72;width:35%">Klient</td><td><strong>${escapeHtml(clientName)}</strong></td></tr>
<tr><td style="color:#586A72">E-mail klienta</td><td>${escapeHtml(project.client_email)}</td></tr>
<tr><td style="color:#586A72">Produkt</td><td>${escapeHtml(productName)}</td></tr>
<tr><td style="color:#586A72">Číslo nabídky</td><td><strong>${escapeHtml(quoteNumber)}</strong></td></tr>
<tr><td style="color:#586A72">Cena bez DPH</td><td>${data.totalPrice ? new Intl.NumberFormat('cs-CZ').format(data.totalPrice) + ' Kč' : 'dle nabídky'}</td></tr>
<tr><td style="color:#586A72">Smart řízení (SUPLA)</td><td>${data.smartControlIncluded ? 'Ano' : 'Ne'}</td></tr>
<tr><td style="color:#586A72">Vizualizace</td><td>${data.visualizations.length} ks</td></tr>
</table>
</div>

${pdfLinks ? `<div style="margin:18px 0"><div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#586A72;margin-bottom:8px">PDF podklady</div><ul style="font-size:13px;color:#0B2034;margin:0;padding-left:18px">${pdfLinks}</ul></div>` : ''}
${visualLinks ? `<div style="margin:18px 0"><div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#586A72;margin-bottom:8px">Vizualizace</div><ul style="font-size:13px;color:#0B2034;margin:0;padding-left:18px">${visualLinks}</ul></div>` : ''}

<div style="margin:24px 0;text-align:center">
<a href="https://mlzidla.cz/admin?tab=poptavky" style="display:inline-block;padding:12px 28px;border-radius:999px;background:#0B5FFF;color:#fff;text-decoration:none;font-weight:700;font-size:13px">Otevřít administraci</a>
</div>

<div style="margin:24px 0;border-top:1px solid #D3E2E8;padding-top:20px">
<div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#00A8E8;margin-bottom:12px;font-weight:700">Náhled klientského e-mailu</div>
<div style="border:1px solid #D3E2E8;border-radius:12px;overflow:hidden">${clientEmail.html}</div>
</div>
</td></tr>
<tr><td style="background:#0B2034;padding:14px 28px;color:rgba(255,255,255,.6);font-size:11px;text-align:center">MLŽIDLA® / HolmTec s.r.o. — interní notifikace AI nabídek</td></tr>
</table>
</td></tr></table>
</body></html>`;

    const reviewText = `AI-NABIDKA — Nabídka ke kontrole

Tento e-mail je interní kontrolní kopie, NEBYL odeslán zákazníkovi.

Detail nabídky:
Klient: ${clientName} (${project.client_email})
Produkt: ${productName}
Číslo nabídky: ${quoteNumber}
Cena bez DPH: ${data.totalPrice ? new Intl.NumberFormat('cs-CZ').format(data.totalPrice) + ' Kč' : 'dle nabídky'}
Smart řízení (SUPLA): ${data.smartControlIncluded ? 'Ano' : 'Ne'}
Vizualizace: ${data.visualizations.length} ks

${project.quote_pdf_url ? `PDF nabídka: ${project.quote_pdf_url}\n` : ''}${project.presentation_pdf_url ? `PDF prezentace: ${project.presentation_pdf_url}\n` : ''}
${data.visualizations.map((u, i) => `Vizualizace ${i + 1}: ${u}`).join('\n')}

Administrace: https://mlzidla.cz/admin?tab=poptavky

---
MLŽIDLA® / HolmTec s.r.o. — interní notifikace AI nabídek`;

    if (dryRun) {
      return Response.json({
        ok: true,
        dry_run: true,
        recipient: reviewRecipient,
        subject,
        project_id: projectId,
        quote_number: quoteNumber,
        visualizations_count: data.visualizations.length,
        has_pdf: Boolean(project.quote_pdf_url),
      }, { headers: { 'Cache-Control': 'no-store' } });
    }

    // Send internal review email via Gmail
    const result = await sendViaGmail(base44, {
      to: reviewRecipient,
      fromEmail: 'meduna@holmtec.cz',
      subject,
      text: reviewText,
      html: reviewHtml,
    });

    // Also send Slack admin notification with concept + next step
    try {
      await base44.functions.invoke('notifyAdminChannel', {
        event_type: 'inquiry_status_change',
        client_name: clientName,
        client_email: project.client_email,
        quote_number: quoteNumber,
        project_name: project.project_name || productName,
        total_price: data.totalPrice,
        message: `AI vygenerovala nabídku ${quoteNumber}. Čeká na kontrolu a ruční odeslání. Interní kopie odeslána na ${reviewRecipient}.`,
        admin_url: 'https://mlzidla.cz/admin?tab=poptavky',
      });
    } catch (_) { /* Slack best-effort */ }

    // Update OfferAgentRun if exists — mark as pending_approval
    try {
      const runs = await base44.asServiceRole.entities.OfferAgentRun.filter({ project_order_id: projectId });
      const latestRun = (runs || []).sort((a, b) => new Date(b.created_date || 0).getTime() - new Date(a.created_date || 0).getTime())[0];
      if (latestRun) {
        await base44.asServiceRole.entities.OfferAgentRun.update(latestRun.id, {
          run_status: 'pending_approval',
          approval_required: true,
          send_allowed: false,
        });
      }
    } catch (_) {}

    // Update ProjectOrder status to draft_ready_for_review
    try {
      if (project.status === 'draft') {
        await base44.asServiceRole.entities.ProjectOrder.update(projectId, { status: 'draft_ready_for_review' });
      }
    } catch (_) {}

    return Response.json({
      ok: result.ok,
      review_email_sent: result.ok,
      recipient: reviewRecipient,
      subject,
      error: result.error,
      project_id: projectId,
      quote_number: quoteNumber,
      status_updated: project.status === 'draft',
    }, { status: result.ok ? 200 : 500, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return Response.json({ error: error?.message || 'review_send_failed' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}