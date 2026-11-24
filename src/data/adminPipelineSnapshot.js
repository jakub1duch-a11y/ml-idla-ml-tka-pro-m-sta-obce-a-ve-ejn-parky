/**
 * Verified read-only snapshot of the 0_BT_Poptavky / PIPELINE_PROJEKTY sheet.
 * The canonical source remains Google Sheets; this file is not a live integration.
 * Updated from the verified sheet read on 2026-11-23.
 */
export const PIPELINE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1zDl-j3xjKmAIvY3UmMq5D-SF2IkMUJznnuQhvgLRS_s/edit#gid=2026112392';
export const PIPELINE_SNAPSHOT_DATE = '23. 11. 2026';

export const PIPELINE_STAGES = [
  { id: 'inquiry', label: 'Nová poptávka', accent: '#8a9aa9' },
  { id: 'calculation', label: 'Kalkulace', accent: '#d49a32' },
  { id: 'offer', label: 'Nabídka odeslána', accent: '#248cc0' },
  { id: 'cooperation', label: 'U kooperanta', accent: '#8069bc' },
  { id: 'order', label: 'Objednávka', accent: '#349a76' },
];

export const PIPELINE_CASES = [
  {
    key: 'BT260-889', bt: 'BT260 889', quote: 'CN BT260 889', brand: 'mlzidla',
    customer: 'DŘEVOSLAV s.r.o.', project: 'Mateřská škola / Slavonice',
    product: 'MRAK 10R 1414', stage: 'offer', offerPrice: 49500, offerPriceNote: 'Odeslaná CN, bez DPH',
    date: '23. 11. 2026', nextStep: 'Ověřit rozdíl mezi kalkulací 49 440 Kč a odeslanou CN 49 500 Kč.',
    note: 'Gmail SENT ověřeno, starší poznámka v BT obsahuje rozpor.',
    gmail: 'https://mail.google.com/mail/u/?authuser=meduna%40holmtec.cz#all/1a208a4ae8c62276',
  },
  {
    key: 'BT260-890', bt: 'BT260 890', quote: '', brand: 'mlzidla',
    customer: 'ENVY SPORT SERVIS, s.r.o.', project: 'Park moderních sportů Suchdol nad Lužnicí',
    product: '3× LINEA Ø70', stage: 'calculation', basePrice: 53650, basePriceNote: 'Schválen pouze základ 3 výrobků, bez DPH',
    date: '23. 11. 2026', nextStep: 'Dopracovat opce, montáž a dopravu; ověřit údaj o odeslání.',
    note: 'V evidenci je pracovní koncept. Kompletní cena ani odeslání zatím nejsou ověřené.',
    gmail: 'https://mail.google.com/mail/u/?authuser=meduna%40holmtec.cz#all/1a209d1460821629',
  },
  {
    key: 'BT260-875', bt: 'BT260 875', quote: 'CN BT260 875', brand: 'holmtec',
    customer: 'INVEKTA', project: 'KOLO Ø470', product: 'Ohýbání 10 ks · výkres 02.27338A',
    stage: 'offer', date: '23. 11. 2026', nextStep: 'Sledovat odpověď zákazníka.',
    note: 'Odeslání zákazníkovi doloženo v Gmail SENT.',
    gmail: 'https://mail.google.com/mail/u/?authuser=meduna%40holmtec.cz#all/1a208a252109deb8',
  },
  {
    key: 'BT260-876-877', bt: 'BT260 876_877', quote: 'CN BT260 876_877', brand: 'holmtec',
    customer: 'SICO silicone / Trelleborg', project: 'Poptávka 114/26',
    product: 'Trny · 2 + 2 ks', stage: 'offer', date: '20. 11. 2026',
    nextStep: 'Sledovat vyjádření zákazníka.', note: 'Odeslaná nabídka doložena v Gmail SENT.',
    gmail: 'https://mail.google.com/mail/u/?authuser=meduna%40holmtec.cz#all/1a1f9648017b47f1',
  },
  {
    key: 'BT260-878', bt: 'BT260 878', quote: 'CN BT260 878', brand: 'holmtec',
    customer: 'SICO silicone / Trelleborg', project: 'Poptávka 116/26',
    product: 'Rovné nerezové trny · 2 ks', stage: 'offer', date: '20. 11. 2026',
    nextStep: 'Sledovat vyjádření zákazníka.', note: 'Odeslaná nabídka doložena v Gmail SENT.',
    gmail: 'https://mail.google.com/mail/u/?authuser=meduna%40holmtec.cz#all/1a1f9475a8d2dc6f',
  },
  {
    key: 'BT260-887', bt: 'BT260 887', quote: '', brand: 'holmtec',
    customer: 'REV IT CZECH', project: 'Rám buggy', product: 'CNC ohýbání trubek',
    stage: 'cooperation', date: '21. 11. 2026',
    nextStep: 'Vyžádat technické posouzení a cenu od Němečka.',
    note: 'Odesláno kooperantovi, nikoliv jako nabídka zákazníkovi.',
    gmail: 'https://mail.google.com/mail/u/?authuser=meduna%40holmtec.cz#all/1a1fdb96b684a695',
  },
  {
    key: 'BT260-884-886', bt: 'BT260 884_886', quote: '', brand: 'holmtec',
    customer: 'Zákazník k ověření', project: 'Sériové ohýbání',
    product: 'TR26,9 × 3,2 · 20 / 50 / 100 ks', stage: 'cooperation', date: '23. 11. 2026',
    nextStep: 'Ověřit zákazníka, cenu a technologické posouzení kooperanta.',
    note: 'Odpověď Němečka není v evidenci potvrzena.',
    gmail: 'https://mail.google.com/mail/u/?authuser=meduna%40holmtec.cz#all/1a207e8599ab1bea',
  },
  {
    key: 'BT260-880-883', bt: 'BT260 880_883', quote: '', brand: 'holmtec',
    customer: 'Zákazník k ověření', project: 'Výroba madel',
    product: 'TR30 × 2 · pravé / levé', stage: 'cooperation', date: '20. 11. 2026',
    nextStep: 'Čekat na nabídku Němečka.',
    note: 'Odeslána poptávka kooperantovi, nikoliv zákaznická nabídka.',
    gmail: 'https://mail.google.com/mail/u/?authuser=meduna%40holmtec.cz#all/1a1f8648a92b44fd',
  },
  {
    key: 'MICO-100-262685', bt: 'BT k ověření', quote: '', brand: 'holmtec',
    customer: 'MICO', project: 'Objednávka 100-262685',
    product: 'Potvrzení přijetí · aktualizovaná cena', stage: 'order', date: '23. 11. 2026',
    nextStep: 'Potvrdit výrobní termín po dodání materiálu.',
    note: 'Potvrzení objednávky odesláno. Příslušné BT zatím není spárováno.',
    gmail: 'https://mail.google.com/mail/u/?authuser=meduna%40holmtec.cz#all/1a208d2a297ef84d',
  },
  {
    key: 'EDI-NOBJ016621', bt: 'BT k ověření', quote: '', brand: 'holmtec',
    customer: 'European Data Industries', project: 'Objednávka NOBJ016621',
    product: 'Zálohová faktura 260800088', stage: 'order', date: '23. 11. 2026',
    nextStep: 'Prověřit úhradu zálohy a potvrdit reálný termín dodání.',
    note: 'Odpověď na poslední dotaz zákaznice existuje pouze jako koncept.',
    gmail: 'https://mail.google.com/mail/u/?authuser=meduna%40holmtec.cz#all/1a20832415c20107',
  },
];
