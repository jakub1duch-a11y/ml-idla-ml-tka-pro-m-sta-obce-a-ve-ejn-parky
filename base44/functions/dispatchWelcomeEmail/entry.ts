import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { buildEmailHtml, buildEmailText, sendViaGmail, BRAND } from '../../shared/customerEmails.ts';
import { dispatchNotification, buildDedupKey } from '../../shared/notificationQueue.ts';

const escapeHtml = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[c] as string));
const clean = (v: unknown, max = 2000) => String(v || '').trim().slice(0, max);

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const email = clean(body.email || body.user_email);
    const firstName = clean(body.first_name || body.user_name, 100);
    const dryRun = Boolean(body.dry_run);
    const previewOnly = Boolean(body.preview);

    if (!email) return Response.json({ error: 'missing_email' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });

    // Načti produkty z katalogu pro seznámení
    const productsPage = await base44.asServiceRole.entities.Product.filter(
      { featured: true },
      { sort: '-created_date', limit: 4, fields: ['name', 'slug', 'short_description', 'image_url', 'image_alt'] }
    ).catch(() => ({ items: [] }));
    const featuredProducts = (productsPage.items || []).slice(0, 4);

    // Načti kategorie
    const categoriesPage = await base44.asServiceRole.entities.ProductCategory.filter(
      {},
      { sort: 'order', limit: 6, fields: ['name', 'slug'] }
    ).catch(() => ({ items: [] }));
    const categories = (categoriesPage.items || []).slice(0, 6);

    const productCards = featuredProducts.map((p: any) => 
      `<a href="${BRAND.SITE_URL}/produkt/${escapeHtml(p.slug)}" style="display:block;text-decoration:none;color:inherit"><div style="border:1px solid #e1e9ea;border-radius:14px;overflow:hidden;margin-bottom:12px">${p.image_url ? `<img src="${escapeHtml(p.image_url)}" alt="${escapeHtml(p.image_alt || p.name)}" style="display:block;width:100%;height:140px;object-fit:cover">` : ''}<div style="padding:12px 14px"><div style="font-size:14px;font-weight:700;color:#0d2d38">${escapeHtml(p.name)}</div>${p.short_description ? `<div style="margin-top:4px;font-size:12px;line-height:1.5;color:#60777d">${escapeHtml(clean(p.short_description, 120))}</div>` : ''}</div></div></a>`
    ).join('');

    const categoryLinks = categories.map((c: any) => 
      `<a href="${BRAND.SITE_URL}/kolekce/${escapeHtml(c.slug)}" style="color:#0e7584;text-decoration:none;font-size:13px">${escapeHtml(c.name)}</a>`
    ).join(' · ');

    const bodyHtml = `
<p style="margin:0 0 14px;line-height:1.7;color:#50666c;font-size:14px">Váš klientský účet MLŽIDLA® byl úspěšně vytvořen. Nyní máte přístup ke všem funkcím pro správu vašich projektů, nabídek a komunikaci s naším týmem.</p>

<div style="margin:24px 0;padding:20px;background:#f5f8f8;border:1px solid #e1e9ea;border-radius:16px">
<div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#0e7584;font-weight:700;margin-bottom:14px">Co můžete v klientské sekci dělat</div>
<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr><td style="padding:6px 0;font-size:14px;color:#3f5560"><strong style="color:#0d2d38">Produkty a katalog</strong> — procházejte naše mlžítka, mlžné brány a rezidenční mlžení.</td></tr>
<tr><td style="padding:6px 0;font-size:14px;color:#3f5560"><strong style="color:#0d2d38">Zadání poptávky</strong> — pošlete nám nezávaznou poptávku přímo z webu nebo klientské sekce.</td></tr>
<tr><td style="padding:6px 0;font-size:14px;color:#3f5560"><strong style="color:#0d2d38">Zákaznický přehled</strong> — vidíte všechny své projekty, nabídky a dokumenty na jednom místě.</td></tr>
<tr><td style="padding:6px 0;font-size:14px;color:#3f5560"><strong style="color:#0d2d38">Zobrazení a reakce na nabídku</strong> — otevřete cenovou nabídku, prohlédněte vizualizace a potvrďte objednávku elektronicky.</td></tr>
<tr><td style="padding:6px 0;font-size:14px;color:#3f5560"><strong style="color:#0d2d38">Sledování stavu</strong> — aktuální stav vaší objednávky od potvrzení přes výrobu až po realizaci.</td></tr>
<tr><td style="padding:6px 0;font-size:14px;color:#3f5560"><strong style="color:#0d2d38">Komunikace a podpora</strong> — pište nám přímo z projektu, odpovídáme na technické dotazy i požadavky na úpravy.</td></tr>
</table>
</div>

${productCards ? `<div style="margin:24px 0"><div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#0e7584;font-weight:700;margin-bottom:12px">Doporučené produkty z katalogu</div>${productCards}</div>` : ''}

${categoryLinks ? `<div style="margin:18px 0;font-size:13px;color:#60777d">Procházet kategorie: ${categoryLinks}</div>` : ''}

<p style="margin:18px 0 0;line-height:1.7;color:#50666c;font-size:14px">Máte dotaz k produktu nebo projektu? Napište nám — jsme tu pro vás.</p>`;

    const htmlContent = {
      typeLabel: 'Vítejte v MLŽIDLA®',
      title: `Vítejte${firstName ? `, ${escapeHtml(firstName)}` : ''}!`,
      greeting: 'Děkujeme za registraci v klientské sekci MLŽIDLA.cz.',
      bodyHtml,
      ctaButtons: [
        { label: 'Přejít do klientské sekce', url: BRAND.PORTAL_URL, bg: '#0e5b67' },
        { label: 'Procházet katalog', url: BRAND.KATALOG_URL, bg: '#0e7584' },
        { label: 'Poslat poptávku', url: BRAND.POPTAVKA_URL, bg: '#dff7fa', color: '#0d2d38' },
      ],
    };

    const html = buildEmailHtml(htmlContent);
    const text = buildEmailText(htmlContent);
    const subject = `Vítejte v MLŽIDLA® — váš klientský účet je připraven | MLŽIDLA®`;

    if (previewOnly) {
      return Response.json({ ok: true, preview: true, subject, html, text, recipient: email }, { headers: { 'Cache-Control': 'no-store' } });
    }

    const dedupKey = buildDedupKey('welcome', email, '1', email);

    if (dryRun) {
      return Response.json({ ok: true, dry_run: true, would_send: true, recipient: email, subject, dedup_key: dedupKey, featured_products: featuredProducts.length }, { headers: { 'Cache-Control': 'no-store' } });
    }

    // Dedup — uvítací e-mail pouze jednou
    const existing = await base44.asServiceRole.entities.NotificationLog.filter({ dedup_key: dedupKey }, { limit: 1 }).catch(() => ({ items: [] }));
    if (existing?.items?.[0]?.status === 'sent') {
      return Response.json({ ok: true, deduplicated: true, dedup_key: dedupKey }, { headers: { 'Cache-Control': 'no-store' } });
    }

    const result = await dispatchNotification(base44, {
      dedupKey,
      eventType: 'welcome',
      channelType: 'email',
      recipient: email,
      entityId: email,
      entityType: 'User',
      subject,
      contentSummary: `Uvítací e-mail pro ${email}`,
      sendFn: () => sendViaGmail(base44, {
        to: email,
        fromEmail: BRAND.CONTACT_EMAIL,
        subject,
        text,
        html,
      }),
    });

    // Pošli i admin notifikaci o nové registraci
    if (result.status === 'sent') {
      try {
        await base44.functions.invoke('notifyAdminChannel', {
          event_type: 'registration',
          client_name: firstName,
          client_email: email,
          admin_url: `${BRAND.SITE_URL}/admin?tab=poptavky`,
        });
      } catch (_) { /* best-effort */ }
    }

    return Response.json({ ok: true, ...result }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return Response.json({ error: error?.message || 'welcome_failed' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}