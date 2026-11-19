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
    'Před výběrem listů určete počet přesných výrobků/variant. K cenové nabídce 2/3/4 modelů použij výhradně ověřený souhrnný Canva DESIGN DAHbICZZIgU / DAHbINIjpZM / DAHbIO0bjWQ. Pro každý produkt lze přidat foto-list DAHbICVcThc. Vždy vytvoř samostatnou kopii originálu a nemanipuluj s jeho MASTER vrstvami.',
    'Legacy Brand Template EAHbBX1hTpE má prázdný Autofill dataset. Nové editovatelné A4 DESIGNY města DAHbIPt73-s, architekti DAHbIPfIgA8, gastro DAHbIAfsc1w, foto-list DAHbICVcThc a multi-modelové listy mají pojmenovaná pole; jejich datové typy ověř pomocí get_design_dataset a registru mlz-canva-autofill-registry.js. Existence polí není důkazem hotové integrace HubSpot→Canva ani exportovaného PDF.',
    'Každá nabídka obsahuje přesné fotografie a schválené vizualizace, specifikaci produktu, ověřenou cenu položek bez DPH, DPH a součet včetně DPH, případně samostatný list SUPLA, podmínky, platnost, číslo revize a dodavatele HolmTec.',
    'Základní nabídka zahrnuje jen samotné mlžítko; montáž a dopravu nekalkuluj, pokud je klient výslovně nepoptává. SUPLA pro chytrá města nabídni volitelně jako samostatnou konfigurovatelnou položku s orientační cenou od 29 800 Kč bez DPH pouze po ověření aktuálního cenového zdroje. Bez potvrzené konfigurace ji nezapočítávej do celku.',
    'Každý cenový list musí ukázat jednotlivé produkty, množství, výši veřejné ceny bez DPH a jejich součet; pro 1/2/3 kusy používej správné H/J/K sloupce z Kalkulace mlžítka 2026 v účtu meduna@holmtec.cz. Sloupec I je interní/partnerský a do zákaznických výstupů nesmí.',
    'Pro fotolist dej přednost skutečným produktovým fotografiím a katalogovým MASTER pohledům. Rozlišuj skutečnou realizaci, studio a ilustrační vizualizaci. Nesprávné ořezy, neúplné mlžítko a jiná varianta produktu blokují export. Oslovovací Canva DESIGNY nesměšuj s již hotovou osobní cenovou nabídkou.',
    'Připrav kompletní PDF cenovou nabídku a stručný koncept zprávy klientovi, ale pouze po úspěšné kontrole podkladů a skutečném exportu.',
    'Pro cenové nabídky a fakturační dokumenty používej HolmTec jako dodavatele a firemní identitu; MLŽIDLA.cz zůstává obchodní/prezentační značkou.',
    'Nabídku, PDF a vizualizace ulož na sdílený Mlžný disk.',
    'Po QA nastav pending_approval. approval_required musí zůstat true a send_allowed false, dokud uživatel nabídku výslovně neschválí.',
    'V HubSpotu propojuj pouze ověřený kontakt a konkrétní Deal; uchovej source inquiry ID a kontroluj duplicity.',
    'Gmail pouze meduna@holmtec.cz: najdi vlákno daného kontaktu/poptávky; připrav koncept s reálnou PDF přílohou a vizualizací, pokud je prokazatelně dostupná. Při chybějícím PDF vytvoř pouze návrh textu, nikoli falešnou přílohu.',
    'E-mail pouze připrav jako koncept. Nikdy ho zákazníkovi automaticky neodesílej.',
  ].join(' ');
}
