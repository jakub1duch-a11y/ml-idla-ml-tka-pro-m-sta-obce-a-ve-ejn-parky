// MLŽIDLA.cz – canonical visual identity and Canva working templates.
// Authoritative media from user-supplied transparent Logo_full.png, not a redrawn wordmark.
// All Canva copies are WORKING DRAFTS until logo placements and price/data fields are reviewed.
export const MLZ_BRAND = Object.freeze({
  label: 'MLŽIDLA® by HolmTec',
  logoMaster: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/4ad6dc249_MLZIDLA_logo_original_tight.png',
  logoOriginal: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/151fce34e_Logo_full.png',
  logoCanvaAssetId: 'MAHa8en15Zg',
  canvaLogoAssetId: 'MAHa8SMqpOU',
  canvaBrandKitId: 'kAGJuqUZsdc',
  canvaBrandMasterId: 'DAHa8YIy0GA',
  palette: Object.freeze({ dark: '#082F42', teal: '#006879', aqua: '#1BA9CD', white: '#FFFFFF' }),
  typography: Object.freeze({ heading: 'Montserrat', body: 'Inter' }),
  logoRule: 'Every client-facing page must include the original approved logo asset; never type, trace, recolor or regenerate it.',
});
export const MLZ_CANVA_WORKING_TEMPLATES = Object.freeze({
  product_no_price: {
    designId: 'DAHa8bhukf8',
    sourceDesignId: 'DAHa8Rjjkv4',
    url: 'https://www.canva.com/d/mT4z_0LYe0G3j7u',
    title: 'Produktový list – bez ceny',
    pages: 2,
    approved: false,
  },
  product_with_price: {
    designId: 'DAHa8fqwRyo',
    sourceDesignId: 'DAHa7WN0zYc',
    url: 'https://www.canva.com/d/RvD5B1ZyIIfdynm',
    title: 'Produktový list – s cenou',
    pages: 4,
    approved: false,
  },
  project_offer: {
    designId: 'DAHa8cMG0Dg',
    sourceDesignId: 'DAHa7WN0zYc',
    url: 'https://www.canva.com/d/mOwJSRmVTSN6IV2',
    title: 'Projektová nabídka – vizualizace a ceny',
    pages: 4,
    approved: false,
  },
});
export const MLZ_WORKFLOW_BINDINGS = Object.freeze({
  base44AppId: '6a3ee88c10959cd3588c4d68',
  expectedHubspotPortalId: 149778217,
  expectedWorkspaceEmail: 'meduna@holmtec.cz',
  sourceOfInquiry: 'Base44 Poptavka / ContactInquiry',
  priceMaster: 'Schválená aktuální kalkulace 2026 na MLŽNÉM DISKU',
  destinationAfterApproval: 'Google Drive projektová složka → HubSpot Deal link → Gmail koncept',
  autoSend: false,
});
export const MLZ_OFFER_AUTOFILL_FIELDS = Object.freeze([
  'product_name', 'variant_code', 'client_name', 'project_name', 'site_location',
  'approved_logo', 'approved_product_image', 'approved_site_visualization',
  'material', 'dimensions', 'nozzle_count', 'anchoring', 'water_supply',
  'product_description', 'solution_summary',
  'unit_price_ex_vat', 'quantity', 'subtotal_ex_vat',
  'optional_supla_ex_vat', 'delivery_ex_vat', 'installation_ex_vat',
  'vat_rate', 'total_ex_vat', 'total_inc_vat',
  'price_source', 'price_revision', 'offer_number', 'valid_until', 'next_step',
]);
