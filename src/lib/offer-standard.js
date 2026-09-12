export const SOBESLAV_OFFER_STANDARD = {
  key: 'mlzidla_offer_system_v2',
  version: '2.0',
  source: 'Cenová nabídka MLŽIDLA Soběslav BT260 614_621',
  structure: [
    'titulní identifikace projektu a hlavní hodnota pro místo',
    'klientské shrnutí: lidé, komfort a účel prostoru',
    'navržené řešení s dominantní vizualizací konkrétního prostoru',
    'produkt jako součást architektury / funkční městská socha, pokud to odpovídá projektu',
    'ověřený technický rozsah a body k technickému potvrzení',
    'položková cenová rekapitulace a stav ceny',
    'Smart řízení SUPLA a provozní scénáře, pokud jsou relevantní',
    'rozsah, předpoklady, výluky, realizace a další krok',
  ],
  rules: [
    'A4 na výšku, světlý čistý základ, výrazná vizualizace a čitelná cenová tabulka.',
    'Use null when unknown / do not infer: neověřený parametr, cena, účinek, termín ani reference se nesmí dopočítat nebo odhadnout.',
    'U městských nabídek vést příběh přes živý veřejný prostor, komfort lidí a architektonické začlenění; technika má příběh podporovat, ne otevírat nabídku.',
    'U produktů a vizualizací zachovat skutečnou geometrii, proporce, počet ramen/trubek, trysky, materiálový charakter a kotvení podle schválených referencí.',
    'U více kusů ukázat samostatné nacenění a projektovou cenu; úsporu v Kč/% uvádět pouze pokud je skutečně potvrzená.',
    'SUPLA prezentovat jako modulární Smart řízení podle konkrétního provozu; neověřené ceny jednotlivých prvků se nezobrazují.',
    '9zónový zahradní ventil / rozbočení je pouze volitelná zahradní zavlažovací varianta; v městských instalacích jej nenabízet ani nezobrazovat jako doporučenou konfiguraci.',
    'Fotografie a vizualizace mohou být přílohou, ale v hlavním dokumentu nesmí chybět cena/stav ceny, rozsah a další krok.',
    'Přílohy řadit: vizualizace, zákres, kotvení, technický list, Smart řízení.',
    'Nabídku nikdy automaticky neodesílat; systém připraví PDF, prezentaci a koncept zprávy k ručnímu schválení.',
  ],
  attachmentRule: '[CISLO_NABIDKY]_[KLIENT]_[TYP]_[PORADI].[ext]',
};

const normalize = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-zA-Z0-9]+/g, '_')
  .replace(/^_+|_+$/g, '')
  .toUpperCase();

export function createOfferAttachmentName({ quoteNumber = 'NAVRH', clientName = 'KLIENT', type = 'PRILOHA', index = 1, originalName = '' }) {
  const extensionMatch = String(originalName).match(/\.([a-z0-9]{1,8})$/i);
  const extension = extensionMatch ? extensionMatch[1].toLowerCase() : 'pdf';
  return [normalize(quoteNumber), normalize(clientName), normalize(type), String(index).padStart(2, '0')]
    .filter(Boolean)
    .join('_') + '.' + extension;
}
