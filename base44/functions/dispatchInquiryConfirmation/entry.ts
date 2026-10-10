import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { buildEmailHtml, buildEmailText, sendViaGmail, BRAND, buildSummaryBlock } from '../../shared/customerEmails.ts';
import { dispatchNotification, buildDedupKey } from '../../shared/notificationQueue.ts';

const escapeHtml = (v: unknown) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[c] as string));
const clean = (v: unknown, max = 2000) => String(v || '').trim().slice(0, max);

const INSTALLATION_LABELS: Record<string, string> = {
  full_excavation: 'Kompletní výkop a instalace',
  prepared_water: 'Připravený přívod vody',
  temporary_manhole: 'Dočasný šachtový prostor',
  product_only: 'Pouze produkt (bez instalace)',
  unsure: 'Ještě nevím',
};

const WATER_LABELS: Record<string, string> = {
  unknown: 'Neznámý stav',
  ready_at_location: 'Připraven na místě',
  in_manhole: 'V šachtě',
  requires_route: 'Vyžaduje novou trasu',
};

const SURFACE_LABELS: Record<string, string> = {
  unknown: 'Neznámý',
  paving: 'Dlažba',
  asphalt: 'Asfalt',
  concrete: 'Beton',
  grass: 'Tráva / trávník',
  gravel: 'Štěrk',
  other: 'Jiný',
};

function buildSalutation(name: string): string {
  const trimmed = clean(name, 100);
  if (!trimmed) return '';
  const titles = ['ing', 'mgr', 'bc', 'bca', 'mga', 'rndr', 'phdr', 'thlic', 'th', 'arch', 'judr', 'doc', 'prof'];
  const parts = trimmed.split(/\s+/).filter(Boolean);
  const firstName = parts.find((p) => !titles.includes(p.toLowerCase().replace(/[,.;]/g, ''))) || parts[0] || '';
  return firstName ? `, ${firstName}` : '';
}

function buildReference(id: string): string {
  if (!id) return '';
  return id.replace(/-/g, '').slice(0, 8).toUpperCase();
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    return new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr));
  } catch { return ''; }
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    const inquiryId = clean(body.inquiry_id || body.entity_id || body?.event?.entity_id || body?.data?.id, 100);
    const dryRun = Boolean(body.dry_run);
    const previewOnly = Boolean(body.preview);

    if (!inquiryId) return Response.json({ error: 'missing_inquiry_id' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });

    const inquiry = await base44.asServiceRole.entities.Poptavka.get(inquiryId).catch(() => null);
    if (!inquiry) return Response.json({ error: 'inquiry_not_found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });

    const reference = buildReference(inquiry.id);
    const salutation = buildSalutation(inquiry.jmeno);
    const customerEmail = clean(inquiry.email, 254).toLowerCase();

    if (!customerEmail) return Response.json({ error: 'missing_customer_email' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });

    // Pokus o nalezení produktu pro vizuální náhled
    let visualBlock = '';
    let productMatched: any = null;
    const produktField = clean(inquiry.produkt, 200);

    if (produktField && produktField.length > 2) {
      // Extrahuj klíčová slova (přeskoč obecná slova) pro spolehlivější matching
      const stopWords = new Set(['mlzidlo', 'mlzitko', 'mlzne', 'mlzny', 'mlha', 'mlhou', 'mlzeni', 'pro', 'na', 'za', 'ai', 'the', 'collection', 'smart', 'ještě', 'nevím', 'návrh', 'projektu', 'projekt']);
      const keywords = produktField.toLowerCase().split(/[\s,\/\-_]+/).filter((w) => w.length > 2 && !stopWords.has(w));

      // Zkus přesný název, pak klíčová slova
      const attempts = [produktField, ...keywords];
      for (const term of attempts) {
        if (productMatched) break;
        const byName = await base44.asServiceRole.entities.Product.filter(
          { name: { $regex: term, $options: 'i' } },
          { limit: 1, fields: ['name', 'slug', 'image_url', 'image_alt', 'hero_product_image_url', 'hero_visual_verified'] }
        ).catch(() => ({ items: [] }));
        productMatched = byName.items?.[0];
        if (!productMatched) {
          const bySlug = await base44.asServiceRole.entities.Product.filter(
            { slug: { $regex: term, $options: 'i' } },
            { limit: 1, fields: ['name', 'slug', 'image_url', 'image_alt', 'hero_product_image_url', 'hero_visual_verified'] }
          ).catch(() => ({ items: [] }));
          productMatched = bySlug.items?.[0];
        }
      }
    }

    if (productMatched) {
      const isVerified = Boolean(productMatched.hero_visual_verified && productMatched.hero_product_image_url);
      const imageUrl = isVerified ? productMatched.hero_product_image_url : productMatched.image_url;
      const caption = isVerified
        ? 'Vizualizace navrženého řešení. Technické provedení a rozměry upřesníme v nabídce.'
        : 'Produktový náhled, nikoli vizualizace vaší instalace.';

      if (imageUrl) {
        visualBlock = `
        <div style="margin:22px 0;border:1px solid #e1e9ea;border-radius:16px;overflow:hidden;background:#f5f8f8">
          <img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(productMatched.image_alt || productMatched.name || 'Produktový náhled')}" style="display:block;width:100%;max-height:260px;object-fit:cover">
          <div style="padding:10px 16px;font-size:12px;line-height:1.5;color:#60777d">${escapeHtml(caption)}</div>
        </div>`;
      }
    }

    if (!visualBlock) {
      visualBlock = `
      <div style="margin:22px 0;padding:26px 20px;background:#f5f8f8;border:1px solid #e1e9ea;border-radius:16px;text-align:center">
        <div style="font-size:14px;color:#60777d;line-height:1.6">Vizuální návrh vašeho řešení připravujeme.</div>
      </div>`;
    }

    // Souhrn poptávky — pouze vyplněné hodnoty
    const summaryFields: Array<[string, string | undefined]> = [];
    if (reference) summaryFields.push(['Reference poptávky', `P-${reference}`]);
    if (inquiry.created_date) summaryFields.push(['Datum poptávky', formatDate(inquiry.created_date)]);
    if (inquiry.produkt) summaryFields.push(['Zájem o produkt', clean(inquiry.produkt, 200)]);
    if (inquiry.quantity && Number(inquiry.quantity) > 1) summaryFields.push(['Počet kusů', String(inquiry.quantity)]);
    if (inquiry.installation_location) summaryFields.push(['Lokalita instalace', clean(inquiry.installation_location, 200)]);
    if (inquiry.installation_option && INSTALLATION_LABELS[inquiry.installation_option]) summaryFields.push(['Rozsah instalace', INSTALLATION_LABELS[inquiry.installation_option]]);
    if (inquiry.water_connection_state && WATER_LABELS[inquiry.water_connection_state]) summaryFields.push(['Stav přívodu vody', WATER_LABELS[inquiry.water_connection_state]]);
    if (inquiry.surface_type && SURFACE_LABELS[inquiry.surface_type]) summaryFields.push(['Typ povrchu', SURFACE_LABELS[inquiry.surface_type]]);
    if (inquiry.needs_installation_quote) summaryFields.push(['Poptávka po instalaci', 'Ano']);
    if (inquiry.requested_visualization) summaryFields.push(['Požadavek na vizualizaci', 'Ano']);
    if (inquiry.custom_shape) summaryFields.push(['Vlastní tvar / představa', clean(inquiry.custom_shape, 300)]);
    if (inquiry.zprava) summaryFields.push(['Vaše zpráva', clean(inquiry.zprava, 500)]);
    if (inquiry.jmeno) summaryFields.push(['Jméno', clean(inquiry.jmeno, 160)]);
    if (inquiry.email) summaryFields.push(['E-mail', clean(inquiry.email, 254)]);
    if (inquiry.telefon) summaryFields.push(['Telefon', clean(inquiry.telefon, 60)]);
    if (inquiry.firma) summaryFields.push(['Firma / organizace', clean(inquiry.firma, 200)]);

    const summaryBlock = buildSummaryBlock(summaryFields);

    const bodyHtml = `
    <p style="margin:0 0 16px;line-height:1.7;color:#50666c;font-size:14px">Dobrý den${escapeHtml(salutation)}, děkujeme, že jste nás kontaktovali. Vaši poptávku jsme přijali a těší nás možnost spolupracovat s vámi na návrhu mlžného řešení.</p>

    <div style="margin:22px 0;padding:18px 20px;background:#f5f8f8;border:1px solid #e1e9ea;border-radius:16px">
      <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#6e858b;margin-bottom:10px;font-weight:700">Souhrn vaší poptávky</div>
      <div style="font-size:13px;line-height:1.75;color:#3f5560">${summaryBlock}</div>
    </div>

    <div style="margin:22px 0">
      <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#0e7584;font-weight:700;margin-bottom:0">Náhled navrženého řešení</div>
      ${visualBlock}
    </div>

    <div style="margin:22px 0;padding:18px 20px;background:#f0f6f6;border:1px solid #d1e3e3;border-radius:16px">
      <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#0e7584;font-weight:700;margin-bottom:8px">Co bude následovat</div>
      <p style="margin:0;font-size:14px;line-height:1.7;color:#3f5560">Do 24 hodin se vám náš tým ozve s připravenou nezávaznou cenovou nabídkou nebo s doplňujícími dotazy k upřesnění a odsouhlasení řešení.</p>
    </div>

    <p style="margin:18px 0 0;line-height:1.7;color:#50666c;font-size:14px">Děkujeme za důvěru a těšíme se na spolupráci.</p>`;

    const ctaButtons = [
      { label: 'Zobrazit poptávku', url: BRAND.PORTAL_URL, bg: '#0e5b67' },
      { label: 'Doplnit informace', url: `mailto:${BRAND.CONTACT_EMAIL}?subject=Popt%C3%A1vka%20P-${reference}`, bg: '#dff7fa', color: '#0d2d38' },
    ];

    const htmlContent = {
      typeLabel: 'Potvrzení poptávky',
      title: 'Vaše mlžné řešení začíná tady',
      greeting: `Dobrý den${salutation},`,
      bodyHtml,
      ctaButtons,
      summaryBlock: '',
    };

    const html = buildEmailHtml(htmlContent);
    const text = buildEmailText(htmlContent);
    const subject = reference ? `Děkujeme za poptávku č. P-${reference} | MLŽIDLA.cz` : 'Děkujeme za poptávku | MLŽIDLA.cz';

    if (previewOnly) {
      return Response.json({
        ok: true,
        preview: true,
        subject,
        html,
        text,
        recipient: customerEmail,
        has_visualization: Boolean(productMatched),
        product_matched: productMatched?.name || null,
      }, { headers: { 'Cache-Control': 'no-store' } });
    }

    const dedupKey = buildDedupKey('inquiry_created', inquiryId, '1', customerEmail);

    if (dryRun) {
      return Response.json({
        ok: true,
        dry_run: true,
        would_send: true,
        recipient: customerEmail,
        subject,
        dedup_key: dedupKey,
        has_visualization: Boolean(productMatched),
        product_matched: productMatched?.name || null,
        reference: `P-${reference}`,
      }, { headers: { 'Cache-Control': 'no-store' } });
    }

    // Dedup — potvrzení pouze jednou
    const existing = await base44.asServiceRole.entities.NotificationLog.filter({ dedup_key: dedupKey }, { limit: 1 }).catch(() => ({ items: [] }));
    if (existing?.items?.[0]?.status === 'sent') {
      return Response.json({ ok: true, deduplicated: true, dedup_key: dedupKey }, { headers: { 'Cache-Control': 'no-store' } });
    }

    // Odeslání potvrzovacího e-mailu zákazníkovi
    const result = await dispatchNotification(base44, {
      dedupKey,
      eventType: 'inquiry_created',
      channelType: 'email',
      recipient: customerEmail,
      entityId: inquiryId,
      entityType: 'Poptavka',
      subject,
      contentSummary: `Potvrzení poptávky pro ${clean(inquiry.jmeno, 100) || customerEmail}`,
      sendFn: () => sendViaGmail(base44, {
        to: customerEmail,
        fromEmail: BRAND.CONTACT_EMAIL,
        subject,
        text,
        html,
      }),
      metadata: JSON.stringify({ reference: `P-${reference}`, has_visualization: Boolean(productMatched) }),
    });

    // Interní oznámení admin týmu s termínem reakce (created_at + 24h)
    try {
      const createdAt = new Date(inquiry.created_date || Date.now());
      const reactionDeadline = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000);
      const deadlineStr = new Intl.DateTimeFormat('cs-CZ', {
        timeZone: 'Europe/Prague',
        day: 'numeric', month: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }).format(reactionDeadline);

      await base44.functions.invoke('notifyAdminChannel', {
        event_type: 'inquiry_created',
        client_name: inquiry.jmeno || '',
        client_email: customerEmail,
        project_name: inquiry.produkt || inquiry.installation_location || '',
        message: clean(inquiry.zprava, 500),
        admin_url: `${BRAND.SITE_URL}/admin?tab=poptavky`,
        reaction_deadline: deadlineStr,
      });
    } catch (_) { /* admin notifikace je best-effort */ }

    return Response.json({ ok: true, ...result }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return Response.json({ error: error?.message || 'inquiry_confirmation_failed' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}