import { createClientFromRequest } from 'npm:@base44/sdk@0.8.61';

// MLŽIDLA.cz → HubSpot: only the user's confirmed HolmTec portal.
// Never trust the portal ID supplied by a frontend caller.
const EXPECTED_PORTAL_ID = 149778217;
const HEADER = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
const clean = (value, max = 500) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
const normalize = (value) => clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const stripMarkup = (value) => clean(String(value ?? '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&'), 1600);
const isArchived = (p) => /^archived[-_]/i.test(p.slug || '') || /archiv/i.test(p.name || '');
const safeSlug = (value) => String(value || '').replace(/[^a-z0-9-]/gi, '-').toLowerCase().replace(/-+/g, '-').replace(/^-|-$/g, '');

function productCatalog(products) {
  const skuSet = new Set();
  const skipped = [];
  const entries = [];
  for (const product of products) {
    if (!product?.name || !product?.slug || isArchived(product)) {
      skipped.push({ name: clean(product?.name), reason: 'Neúplný nebo archivní záznam' });
      continue;
    }
    const sku = `MLZ-${safeSlug(product.slug)}`.slice(0, 90);
    if (!sku || skuSet.has(sku)) {
      skipped.push({ name: clean(product.name), reason: 'Duplicitní SKU' });
      continue;
    }
    skuSet.add(sku);
    const variants = Array.isArray(product.variants) ? product.variants.map((v) => clean(v?.name, 110)).filter(Boolean) : [];
    const text = [clean(product.short_description, 700) || stripMarkup(product.description).slice(0, 700),
      variants.length ? `Varianty: ${variants.join('; ')}` : '',
      `MLŽIDLA.cz • zdroj Base44 • slug: ${product.slug}`,
      'Cena a konfigurace pouze podle aktuální schválené kalkulace 2026.'
    ].filter(Boolean).join(' | ').slice(0, 1600);
    entries.push({
      name: clean(product.name, 250),
      sku,
      slug: clean(product.slug, 120),
      variants,
      properties: {
        name: clean(product.name, 250),
        hs_sku: sku,
        description: text,
        hs_url: `https://mlzidla.cz/produkt/${encodeURIComponent(product.slug)}`,
      },
    });
  }
  return { entries, skipped };
}

async function hubspotRequest(token, path, options = {}) {
  const response = await fetch(`https://api.hubapi.com${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}) },
    signal: AbortSignal.timeout(20000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(`hubspot_http_${response.status}`);
    err.status = response.status;
    throw err;
  }
  return data;
}

async function targetPortal(token) {
  const details = await hubspotRequest(token, '/integrations/v1/me');
  const portalId = Number(details.portalId || details.hubId || 0);
  if (!Number.isSafeInteger(portalId) || !portalId) throw new Error('hubspot_portal_unverified');
  return portalId;
}

async function existingProducts(token) {
  const existing = [];
  let after = '';
  for (let page = 0; page < 20; page++) {
    const qs = new URLSearchParams({ limit: '100', properties: 'name,hs_sku,hs_url' });
    if (after) qs.set('after', after);
    const data = await hubspotRequest(token, `/crm/v3/objects/products?${qs.toString()}`);
    existing.push(...(data.results || []));
    after = data.paging?.next?.after || '';
    if (!after) return existing;
  }
  throw new Error('hubspot_pagination_limit');
}

export default async function (req) {
  const base44 = createClientFromRequest(req);
  const actor = await base44.auth.me().catch(() => null);
  if (!actor) return Response.json({ ok: false, error: 'unauthorized' }, { status: 401, headers: HEADER });
  if (actor.role !== 'admin') return Response.json({ ok: false, error: 'forbidden' }, { status: 403, headers: HEADER });
  if (req.method !== 'POST') return Response.json({ ok: false, error: 'method_not_allowed' }, { status: 405, headers: HEADER });

  const input = await req.json().catch(() => ({}));
  const action = input.action === 'import' ? 'import' : 'preview';
  try {
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('hubspot');
    if (!accessToken) throw new Error('hubspot_oauth_missing');
    const portalId = await targetPortal(accessToken);
    if (portalId !== EXPECTED_PORTAL_ID) {
      return Response.json({ ok: false, error: 'hubspot_wrong_portal',
        expected_portal_id: EXPECTED_PORTAL_ID, connected_portal_id: portalId,
        message: 'Import byl zablokován: Base44 HubSpot je připojený k jinému účtu.' },
        { status: 409, headers: HEADER });
    }
    const products = await base44.asServiceRole.entities.Product.list('-updated_date', 500);
    const catalog = productCatalog(Array.isArray(products) ? products : []);
    const external = await existingProducts(accessToken);
    const skuMap = new Map(external.filter((p) => p.properties?.hs_sku)
      .map((p) => [normalize(p.properties.hs_sku), p]));
    const nameMap = new Map(external.filter((p) => p.properties?.name)
      .map((p) => [normalize(p.properties.name), p]));
    const ready = [], exists = [];
    for (const item of catalog.entries) {
      const match = skuMap.get(normalize(item.sku)) || nameMap.get(normalize(item.name));
      if (match) exists.push({ name: item.name, sku: item.sku, hubspot_id: match.id });
      else ready.push(item);
    }
    const base = {
      ok: true, action, portal_id: portalId, source: 'Base44 Product',
      source_count: products.length, eligible_count: catalog.entries.length,
      archived_or_invalid: catalog.skipped, hubspot_existing_count: external.length,
      existing: exists, pending: ready.map(({name,sku,variants}) => ({name,sku,variants})),
      pending_count: ready.length, existing_count: exists.length,
      pricing_mode: 'NEIMPORTOVAT — ceny vyžadují ověřenou Kalkulaci mlžítka 2026, sloupec H',
      can_import: ready.length > 0,
    };
    if (action !== 'import') return Response.json(base, { headers: HEADER });
    // Explicit human confirmation and snapshot count: do not blindly sync after preview.
    if (input.confirm !== 'NAHRAT_DO_HUBSPOT' || Number(input.portal_id) !== EXPECTED_PORTAL_ID ||
      Number(input.expected_pending_count) !== ready.length || ready.length > 100) {
      return Response.json({ ok: false, error: 'import_requires_fresh_preview_and_confirmation' },
        { status: 409, headers: HEADER });
    }
    const created = [], errors = [];
    for (const item of ready) {
      try {
        const result = await hubspotRequest(accessToken, '/crm/v3/objects/products', {
          method: 'POST', body: JSON.stringify({ properties: item.properties }),
        });
        created.push({ name: item.name, sku: item.sku, id: result.id });
      } catch (error) {
        errors.push({ name: item.name, sku: item.sku, error: String(error.message).slice(0, 100) });
        if (error.status === 401 || error.status === 403 || error.status === 429) break;
      }
    }
    return Response.json({ ...base, created, created_count: created.length, errors,
      success: errors.length === 0 }, { headers: HEADER });
  } catch (error) {
    const code = String(error?.message || 'unknown');
    const allowed = /^hubspot_(oauth_missing|portal_unverified|pagination_limit|http_\d{3})$/.test(code);
    return Response.json({ ok: false, error: allowed ? code : 'hubspot_sync_unavailable' },
      { status: 503, headers: HEADER });
  }
}
