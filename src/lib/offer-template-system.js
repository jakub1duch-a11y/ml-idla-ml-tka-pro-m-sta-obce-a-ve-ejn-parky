/**
 * MLŽIDLA offer/technical-sheet contract.
 * Uploaded PDF scans and visual references are inspirations, NEVER price or geometry master.
 * Price source: verified current shared calculation sheet + reviewer revision.
 * No hidden fallback prices. This file is safe to import from browser or server.
 */
export const OFFER_TEMPLATE_KINDS = Object.freeze({
  PRODUCT_NO_PRICE: 'product_no_price',
  PRODUCT_WITH_PRICE: 'product_with_price',
  PROJECT_OFFER: 'project_offer',
});

export const OFFER_TEMPLATE_SECTIONS = Object.freeze({
  product_no_price: [
    'brand_and_product_identity',
    'verified_studio_product_photo',
    'visualization_in_real_environment',
    'verified_geometry_and_material',
    'nozzles_water_and_installation',
    'smart_control_optional',
    'client_cta_and_product_link',
  ],
  product_with_price: [
    'brand_and_product_identity',
    'verified_studio_product_photo',
    'visualization_in_real_environment',
    'verified_geometry_and_material',
    'itemized_verified_prices_ex_vat',
    'optional_supla_and_installation_pricing',
    'vat_and_total',
    'validity_source_revision_and_approval',
  ],
  project_offer: [
    'client_and_project_cover',
    'site_situation_and_proposal',
    'before_after_visualization',
    'proposed_products_and_technical_details',
    'verified_line_item_quote',
    'automation_and_supla_optional',
    'installation_and_utilities',
    'delivery_scope_conditions_and_exclusions',
    'client_approval_and_contact',
  ],
});

const truthyText = (v) => typeof v === 'string' && v.trim().length > 0;
const knownAmount = (v) => typeof v === 'number' && Number.isFinite(v) && v >= 0;

export function checkOfferTemplateReadiness(input = {}) {
  const kind = input.kind || OFFER_TEMPLATE_KINDS.PRODUCT_NO_PRICE;
  const blockers = [];
  const warnings = [];
  if (!Object.values(OFFER_TEMPLATE_KINDS).includes(kind)) blockers.push('Neznámý typ šablony.');
  if (!truthyText(input.productName)) blockers.push('Chybí přesný název produktu.');
  if (!truthyText(input.verifiedImageUrl)) warnings.push('Chybí ověřená katalogová fotografie produktu.');
  if (!truthyText(input.geometryRevision)) blockers.push('Chybí ověřená geometrie nebo revize produktového profilu.');
  if (input.visualizationUrl && !input.visualizationApproved) warnings.push('Vizualizace je koncept: čeká na kontrolu proporcí, trysek a umístění.');
  if (kind === OFFER_TEMPLATE_KINDS.PROJECT_OFFER && !truthyText(input.clientName)) blockers.push('Chybí identifikace klienta.');
  if (kind !== OFFER_TEMPLATE_KINDS.PRODUCT_NO_PRICE) {
    if (!knownAmount(input.priceExVat)) blockers.push('Chybí ověřená cena bez DPH.');
    if (!truthyText(input.priceSource)) blockers.push('Chybí zdroj aktuální ceny.');
    if (!truthyText(input.priceRevision)) blockers.push('Chybí revize kalkulace/ceníku.');
    if (input.priceConfirmed !== true) blockers.push('Cena zatím nebyla schválena odpovědnou osobou.');
    if (!knownAmount(input.vatRate)) blockers.push('Chybí ověřená sazba DPH.');
  }
  if (input.partnerPrice && !input.partnerAuthorized) blockers.push('Partnerskou cenu nelze použít bez ověřeného oprávnění.');
  if (input.autoSend === true) blockers.push('Automatické odeslání obchodní nabídky není povoleno.');
  return { ready: blockers.length === 0, kind, blockers, warnings, mode: 'DRAFT_REVIEW_ONLY' };
}

export const OFFER_TEMPLATE_DESIGN = Object.freeze({
  format: 'A4 portrait; landscape situation appendix only',
  palette: { ink: '#0A2736', teal: '#006B77', cyan: '#16ABD2', paper: '#FFFFFF', grey: '#EAF1F4' },
  logo: 'approved MLŽIDLA logotype only; no traced/redrawn logotype',
  photo: 'approved genuine product photo in studio; customer site photos only with rights',
  visualization: 'clearly label concept; never infer dimension/nozzle details from generated image',
  technical: 'drawings must match approved manufacturing profile and anchoring',
  prices: 'never infer from an illustrative image, previous quote, or historical PDF',
  delivery: 'client output after explicit human approval; draft creation only by default',
});
