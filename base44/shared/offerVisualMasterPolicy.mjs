// MLŽIDLA.cz — offer media preflight. No IO, CRM writes, exports, or email sends.
// Keep approved catalog media separate from customer-site conceptual visualizations.
export const OFFER_CANVA_REV3 = Object.freeze({
  design_id: 'DAHbHrijg6I',
  edit_url: 'https://www.canva.com/d/r4hRReci7q1wlnQ',
  pages_in_single_product_master: 9,
  autofill_dataset_verified: false,
  prototype_source_drive_id: '1bkHcXRUtvGLKgQwGEXV-5D4J1HlgvU0w',
  preview_pdf_drive_id: '1VHKGcnPsL3jaRSzTiqatutaoiF01AW3y',
  brand_name: 'MLŽIDLA.cz',
  legal_supplier: 'HolmTec s.r.o.',
  customer_email_mode: 'draft_only',
  hubspot_portal_id: 149778217,
  hubspot_pipeline_id: '4351532258',
});

const norm = (v) => String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toUpperCase();
// Exact SKU comparison is deliberate; do not match by image filename or similarity.
export function selectApprovedOfferMedia({sku, variant = '', assets = []} = {}) {
  const requestedSku = norm(sku), requestedVariant = norm(variant);
  if (!requestedSku) return { status:'blocked', reason:'missing_sku', image_url:null };
  const filtered = (Array.isArray(assets) ? assets : []).filter((asset) =>
    norm(asset?.sku) === requestedSku &&
    norm(asset?.variant || '') === requestedVariant &&
    asset?.role === 'studio' &&
    asset?.approved_master === true &&
    asset?.geometry_checked === true &&
    asset?.nozzle_count_checked === true &&
    asset?.cropping_checked === true &&
    asset?.image_url?.startsWith('https://')
  );
  if (filtered.length !== 1)
    return { status:'blocked',reason:filtered.length?'ambiguous_master':'unverified_or_missing_master',image_url:null };
  return {
    status:'approved',image_url:filtered[0].image_url,
    image_id:String(filtered[0].id||''),
    crop: { fit:'contain', object_position:'center center', minimum_subject_visible_fraction:1 },
    watermark_required:false,
  };
}
export function offerProductPagePlan(items = []) {
  if (!Array.isArray(items) || items.length < 1 || items.length > 4)
    throw new Error('A quote requires 1–4 product rows; larger orders need page layout review.');
  const rows=items.map((v,i)=>{
    if(!norm(v?.sku) || !Number.isInteger(v?.quantity) || v.quantity < 1) throw new Error('SKU and positive integer quantity required.');
    const verified= v?.price_verified===true && Number.isFinite(v?.unit_price_czk) && v.unit_price_czk>0;
    return { position:i+1, sku:v.sku, quantity:v.quantity, unit_price_czk:verified?v.unit_price_czk:null,
      price_display:verified ? `${Math.round(v.unit_price_czk).toLocaleString('cs-CZ')} Kč`:'K nacenění',
      image_status:v?.approved_media?.status==='approved'?'approved':'needs_review' };
  });
  return {
    pages:['cover','summary',...rows.map(x=>`product:${x.position}`),'site_visualization','installation_realistic_concept','control_choices','media_comparison','price_table','printed_order'],
    rows, page_count: 8 + rows.length,
    draft_only:true,
    customer_send_allowed:false,
    requires_human_review:true,
    ready_to_attach_to_deal:false,
    canva_autofill_ready:false,
  };
}
