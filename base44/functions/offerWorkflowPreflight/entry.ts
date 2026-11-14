import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// Internal, read-only workflow preflight. Never uses app-user OAuth tokens,
// sends mail, uploads files, or exposes an unauthenticated endpoint.
const WORKFLOW = [
  ['inquiry', 'Nová poptávka'],
  ['superagent', 'Base44 Superagent'],
  ['product', 'Produkt / MASTER / schválené vizualizace'],
  ['pricing', 'Kalkulace 2026'],
  ['canva', 'Canva CP1 / CL1'],
  ['qa', 'Kontrola nabídky / PDF'],
  ['drive', 'Mlžný disk'],
  ['gmail', 'Gmail KONCEPT'],
  ['sites', 'Interní obchodní centrum'],
  ['approval', 'Ruční kontrola obchodníkem'],
];
const uniq = (items) => [...new Set(items.filter(Boolean))];
const getItems = async (entity, filter) => {
  try {
    const result = await entity.filter(filter);
    return Array.isArray(result) ? result : Array.isArray(result?.items) ? result.items : [];
  } catch (_) { return []; }
};
const keyOf = (value) => String(value || '').normalize('NFKC').toLowerCase().trim();
const isApproved = (item) => item?.approved_for_presentation === true && item?.approval_status !== 'rejected';
const isActive = (item) => item?.active !== false && item?.status !== 'archived';
const pickProduct = (items, inquiry) => {
  const candidates = [inquiry?.product_id, inquiry?.produkt, inquiry?.product_slug].filter(Boolean).map(keyOf);
  return items.find(p => candidates.includes(keyOf(p.id)) || candidates.includes(keyOf(p.slug)))
    || items.find(p => candidates.some(c => c.length > 4 && keyOf(p.name) === c)) || null;
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    if (req.method !== 'POST') return Response.json({ error: 'POST required' }, { status: 405 });
    const body = await req.json().catch(() => ({}));
    const inquiryId = String(body.inquiry_id || '');
    const type = body.inquiry_type === 'contact' ? 'contact' : 'poptavka';
    if (!inquiryId) return Response.json({ error: 'Missing inquiry_id' }, { status: 400 });

    const sr = base44.asServiceRole.entities;
    const entity = type === 'contact' ? sr.ContactInquiry : sr.Poptavka;
    const inquiry = await entity.get(inquiryId).catch(() => null);
    if (!inquiry) return Response.json({ error: 'Inquiry not found' }, { status: 404 });

    const [products, profiles, visualizations, assets, runs, integrations] = await Promise.all([
      sr.Product.list(), sr.ProductOfferProfile.list(),
      getItems(sr.VisualizationAsset, { source_inquiry_id: inquiryId }),
      getItems(sr.OfferAsset, { inquiry_id: inquiryId }),
      getItems(sr.OfferAgentRun, { inquiry_id: inquiryId }),
      getItems(sr.SuperAgentIntegration, { agent_key: 'mlzidla_superagent' }),
    ]);
    const product = pickProduct((products || []).filter(isActive), inquiry);
    const productSlug = product?.slug || '';
    const profile = (profiles || []).find(p => keyOf(p.product_slug) === keyOf(productSlug) && p.pricing_status === 'ready');
    const matchingScenes = visualizations.filter(v => keyOf(v.product_slug) === keyOf(productSlug) && isApproved(v));
    const sourcePhotos = uniq([product?.image_url, ...(Array.isArray(product?.gallery_urls) ? product.gallery_urls : [])]);
    const originalPhotosConfirmed = product?.visual_master_verified === true;
    const existingPdf = assets.filter(x => x.asset_type === 'quote_pdf' && x.file_url);
    const latestRun = [...runs].sort((a,b)=>String(b.updated_date||'').localeCompare(String(a.updated_date||'')))[0] || null;

    const link = (integrationType) => integrations.find(x => x.integration_type === integrationType && x.active !== false);
    const verified = (integrationType) => {
      const item = link(integrationType);
      return Boolean(item?.connected && /^active|^verified|^connected/.test(String(item?.status || '')));
    };
    const stages = {};
    const blockers = [];
    const set = (key, status, reason = '') => {
      stages[key] = { status, reason };
      if (status === 'blocked' && reason) blockers.push(reason);
    };
    set('inquiry', 'ready');
    set('superagent', 'ready');
    set('product', product && sourcePhotos.length && originalPhotosConfirmed ? 'ready' : 'blocked',
      !product ? 'Nepodařilo se jednoznačně spárovat produkt poptávky.' :
      !sourcePhotos.length ? 'Chybí produktová fotografie.' :
      !originalPhotosConfirmed ? 'MASTER geometrie produktu není schválena.' : '');
    if (matchingScenes.length === 0) blockers.push('Pro konkrétní produkt/poptávku zatím není schválená prostorová vizualizace; vizualizaci nelze vložit do klientské nabídky.');
    set('pricing', 'blocked', 'Cena musí být živě ověřena interní backendovou funkcí proti Kalkulaci 2026 v účtu meduna@holmtec.cz; lokální ProductOfferProfile nestačí.');
    set('canva', 'blocked', 'Canva CP1 DAHaVqf1LRo nemá autofill dataset; chybí ověřené interní serverové propojení.');
    set('qa', existingPdf.length ? 'needs_review' : 'blocked',
      existingPdf.length ? 'Existuje PDF, ale jeho ceny, geometrie a přílohy vyžadují QA.' : 'Neexistuje ověřený PDF export klientské nabídky.');
    set('drive', verified('mlzny_disk_offer_archive') ? 'needs_review' : 'blocked',
      !verified('mlzny_disk_offer_archive') ? 'Interní archivní integrace Mlžného disku není ověřená.' : 'Vyžaduje kontrolu produktové složky a zápisu.');
    set('gmail', 'blocked', 'Neověřené obchodní Gmail připojení meduna@holmtec.cz a role-scoped funkce drafts.create; pouze koncept, žádné send.');
    set('sites', verified('chatgpt_sites_internal_sync') ? 'needs_review' : 'blocked',
      !verified('chatgpt_sites_internal_sync') ? 'Není autorizovaný soukromý sync do ChatGPT Sites.' : 'Ověřit ochranu přístupu a synchronizaci.');
    set('approval', 'pending_review', 'Obchodník musí ručně zkontrolovat a schválit obsah, cenu, vizualizace a koncept.');

    return Response.json({
      ok: true, mode: 'read_only_preflight', draft_only: true, auto_send: false,
      inquiry_id: inquiryId, inquiry_type: type,
      product: product ? { id: product.id, slug: productSlug, name: product.name, master_verified: originalPhotosConfirmed, studio_photo_count: sourcePhotos.length } : null,
      price_profile: profile ? { status: 'ready_in_cache', source: profile.pricing_source || null, needs_live_check: true } : { status: 'manual_required', needs_live_check: true },
      approved_scene_count: matchingScenes.length, existing_quote_pdf_count: existingPdf.length,
      previous_offer_run_status: latestRun?.run_status || null,
      workflow: WORKFLOW.map(([key, title]) => ({ key, title, ...(stages[key] || { status: 'blocked' }) })),
      blockers: uniq(blockers),
      canva_template_id: 'DAHaVqf1LRo', next_step: 'Doplnit autorizované backend konektory a spustit samostatnou kontrolovanou implementaci exportu a Gmail konceptu.',
    });
  } catch (error) {
    return Response.json({ error: 'Workflow preflight failed', detail: String(error?.message || error) }, { status: 500 });
  }
});
