export const OFFER_AGENT_CONFIG = Object.freeze({
  key: 'nabidkovy_super_agent',
  displayName: 'Nabídkový Super Agent',
  version: '1.1.0',
  description: 'Super Agent pro tvorbu nabídek — automaticky připraví kompletní, odbornou nabídku pro města a obce včetně zónování prostoru (mlžná zóna, stínění, zeleň, aktivní mlžení), vizualizací a náhledů produktů z konkrétního místa. Nikdy neodesílá nabídku automaticky.',
  mcpEndpoint: 'https://mlzidla-mlzitka-pro-mesta-obce-a-588c4d68.base44.app/api/mcp',
  entities: Object.freeze({
    run: 'OfferAgentRun',
    asset: 'OfferAsset',
  }),
  workflow: Object.freeze([
    'intake',
    'needs_input',
    'solution',
    'pricing',
    'visualization',
    'document',
    'qa',
    'pending_approval',
    'approved',
  ]),
  safety: Object.freeze({
    approvalRequired: true,
    sendAllowedByDefault: false,
    automaticCustomerSend: false,
    draftEmailOnly: true,
    verifiedPricingOnly: true,
    verifiedTechnicalDataOnly: true,
  }),
  storage: Object.freeze({
    saveOfferAssets: true,
    savePdf: true,
    saveVisualizations: true,
    sharedDriveLabel: 'Mlžný disk',
  }),
  visualization: Object.freeze({
    preserveExactProductDesign: true,
    forbidInventedConstruction: true,
    useClientLocationPhotoWhenAvailable: true,
    preferredTools: Object.freeze([
      'OpenAI image generation',
      'Adobe Express',
      'Fal',
      'Higgsfield',
      'Magnific',
    ]),
    freeFirst: true,
    requiredOutputs: Object.freeze([
      'produktový náhled',
      'vizualizace v konkrétním prostoru klienta',
      'minimálně 2 relevantní pohledy, pokud jsou podklady dostatečné',
    ]),
  }),
  branding: Object.freeze({
    commercialBrand: 'MLŽIDLA.cz',
    supplier: 'HolmTec s.r.o.',
    billingBrand: 'HolmTec',
    invoiceAndQuoteLogo: 'HolmTec',
  }),
});

export function buildOfferAgentSeedPrompt({ inquiryId, inquiryType } = {}) {
  if (!inquiryId) {
    return 'Jsem Nabídkový agent HolmTec / MLŽIDLA. Pro zpracování potřebuji ID poptávky a typ poptavka/contact, případně vyber poptávku v administraci. Všechny výstupy připravuji ke kontrole; nic zákazníkovi automaticky neodesílám.';
  }

  const type = inquiryType === 'contact' ? 'contact' : 'poptavka';
  return [
    `Načti poptávku ID ${inquiryId} (typ: ${type}).`,
    'Založ nebo aktualizuj OfferAgentRun a průběžně zapisuj stav workflow.',
    'Používej pouze ověřené ceny a technické údaje z projektových zdrojů; nic technického ani cenového nevymýšlej.',
    'Připoj zdrojové soubory a vytvořené výstupy přes OfferAsset.',
    'Zvol doporučené řešení. Pro městský prostor zpracuj podle relevance zónování: mlžná zóna, stínění, zeleň a aktivní mlžení.',
    'Připrav projektové vizualizace z konkrétního místa klienta. Vždy zachovej skutečný vzhled produktu podle referencí: proporce, geometrii, počet a polohu ramen/trubek, trysky, materiál, patku a ukotvení. Nevymýšlej neexistující konstrukční prvky.',
    'Pro vizualizace preferuj nejdříve dostupné bezplatné řešení; podle dostupnosti použij OpenAI image generation, Adobe Express, Fal, Higgsfield nebo Magnific.',
    'Připrav kompletní PDF cenovou nabídku a stručný koncept zprávy klientovi.',
    'Pro cenové nabídky a fakturační dokumenty používej HolmTec jako dodavatele a firemní identitu; MLŽIDLA.cz zůstává obchodní/prezentační značkou.',
    'Nabídku, PDF a vizualizace ulož na sdílený Mlžný disk.',
    'Po QA nastav pending_approval. approval_required musí zůstat true a send_allowed false, dokud uživatel nabídku výslovně neschválí.',
    'E-mail pouze připrav jako koncept. Nikdy ho zákazníkovi automaticky neodesílej.',
  ].join(' ');
}
