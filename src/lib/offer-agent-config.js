export const OFFER_AGENT_CONFIG = Object.freeze({
  key: 'nabidkovy_super_agent',
  displayName: 'Nabídkový agent HolmTec / MLŽIDLA',
  version: '1.0.0',
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
    'Zvol doporučené řešení, připrav odpovídající projektové vizualizace, kompletní PDF cenovou nabídku a stručný koncept zprávy klientovi.',
    'Pro cenové nabídky a fakturační dokumenty používej HolmTec jako dodavatele a firemní identitu; MLŽIDLA.cz zůstává obchodní/prezentační značkou.',
    'Nabídku, PDF a vizualizace ulož na sdílený Mlžný disk.',
    'Po QA nastav pending_approval. approval_required musí zůstat true a send_allowed false, dokud uživatel nabídku výslovně neschválí.',
    'E-mail pouze připrav jako koncept. Nikdy ho zákazníkovi automaticky neodesílej.',
  ].join(' ');
}
