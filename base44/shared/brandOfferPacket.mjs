// Side-effect-free, PUBLIC-only Canva offer packet builder.
// Intentionally never spreads Product or Sheet data into the response: both may include private pricing.
import { buildOfferInstallationControlSummary } from './offerInstallationControl.mjs';

export const MLZIDLA_CANVA_BRAND_TEMPLATE = 'EAHbBX1hTpE';
export const MLZIDLA_CANVA_BRAND_TEMPLATE_URL = 'https://www.canva.com/brand/brand-templates/EAHbBX1hTpE';

function key(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();
}

function validHttps(url) {
  try {
    const parsed = new URL(String(url || ''));
    return parsed.protocol === 'https:' && Boolean(parsed.hostname);
  } catch { return false; }
}

export function createBrandOfferPacket({ product, variant, price }) {
  const requested = String(variant || '').trim();
  const list = Array.isArray(product?.variants) ? product.variants : [];
  const matching = list.filter(item => key(item?.name) && key(item.name) === key(requested));
  const exactVariant = matching.length === 1 ? matching[0] : null;
  const samePricedVariant = exactVariant && key(price?.variant) === key(exactVariant.name);
  const priced = Boolean(samePricedVariant && price?.needs_review === false &&
    typeof price.price_ex_vat === 'number' && Number.isFinite(price.price_ex_vat) && price.price_ex_vat > 0);
  // A product-level MASTER can represent only a single-variant product.
  // Multi-variant products must carry separately approved variant-specific MASTER references.
  const variantMasterUrl = exactVariant?.visual_master_verified === true &&
    validHttps(exactVariant?.visual_master_reference_url) ? exactVariant.visual_master_reference_url : null;
  const singleVariantMasterUrl = list.length === 1 && product?.visual_master_verified === true &&
    validHttps(product?.visual_master_reference_url) ? product.visual_master_reference_url : null;
  const masterUrl = exactVariant ? (variantMasterUrl || singleVariantMasterUrl) : null;
  const media = Boolean(masterUrl);
  const blockers = [];
  if (!exactVariant) blockers.push('Není ověřena jednoznačná varianta produktu.');
  if (!priced) blockers.push('Chybí přesně spárovaná veřejná cena z aktuální kalkulace.');
  if (!media) blockers.push('Chybí lidsky ověřená MASTER fotografie přesné produktové varianty.');
  const amount = priced ? price.price_ex_vat : null;

  return {
    status: blockers.length ? 'needs_review' : 'ready_for_canva_draft',
    ready_for_canva: blockers.length === 0,
    blockers,
    brand: { name: 'MLŽIDLA.cz', supplier: 'HolmTec s.r.o.', canva_template_id: MLZIDLA_CANVA_BRAND_TEMPLATE, canva_template_url: MLZIDLA_CANVA_BRAND_TEMPLATE_URL, autofill_ready: false,
      working_offer_design_id: 'DAHbHrijg6I',
      working_offer_url: 'https://www.canva.com/d/r4hRReci7q1wlnQ',
      offer_generator_source_drive_id: '1bkHcXRUtvGLKgQwGEXV-5D4J1HlgvU0w',
      dynamic_product_pages: 'prototype_preflight_only',
      installation_page: 'realistic_concept_non_construction_drawing',
      logo: {
        name: 'MLŽIDLA.cz',
        source_component: 'src/components/brand/MlzidlaLogoSvg.jsx',
        on_light: '/brand/mlzidla-logo-2026-on-light.svg',
        on_dark: '/brand/mlzidla-logo-2026-on-dark.svg',
        avatar: '/brand/mlzidla-mark-2026.svg',
        canva_symbol_asset_id: 'MAHbHb5vvtw',
        visual_review_required: true,
        supplier_signature: 'HolmTec s.r.o.',
      } },
    product: {
      id: String(product?.id || ''),
      slug: String(product?.slug || ''),
      name: String(product?.name || ''),
      variant: exactVariant?.name || requested,
      profile: exactVariant ? String(exactVariant.profile || '') : '',
      dimensions: exactVariant ? String(exactVariant.dimensions || '') : '',
      nozzles: exactVariant ? String(exactVariant.nozzles || '') : '',
      image_url: media ? String(masterUrl) : null,
      price_ex_vat: amount,
      vat_percent: 21,
      price_inc_vat: amount === null ? null : Math.round(amount * 1.21 * 100) / 100,
      price_source: amount === null ? null : String(price.source || ''),
    },
    presentation: buildOfferInstallationControlSummary({ product }),
    supla: {
      required_sheet: true,
      price_ex_vat: null,
      source_status: 'requires_current_verified_supla_pricing',
      shaft_switchboard_required_to_define: true,
      note: 'Samostatný list Smart SUPLA včetně šachtového rozvaděče; konfiguraci a cenu ověřit.',
    },
    crm: {
      system: 'HubSpot',
      portal_id: 149778217,
      pipeline_id: '4351532258',
      identity_source: 'Base44 inquiry/source ID',
      match_required: true,
      verified_deal_id: null,
      sync_state: 'requires_authenticated_preflight',
      send_stage_evidence: 'Gmail SENT or verified CRM email timeline',
      offers_sent_automatically: false,
    },
    workflow: {
      email_mode: 'draft_only',
      publish_allowed: false,
      customer_send_allowed: false,
      human_approval_required: true,
      required_outputs: ['produktový list Canva se skutečnou MASTER fotografií a původním logem MLŽIDLA.cz', 'produkt + cenová nabídka + varianty ovládání', 'strana vizualizace s označeným původem', 'samostatný list SUPLA', 'PDF', 'WebP', 'archiv MLŽNÝ DISK'],
    },
  };
}
