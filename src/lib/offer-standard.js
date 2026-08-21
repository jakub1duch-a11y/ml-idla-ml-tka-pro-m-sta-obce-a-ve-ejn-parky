export const SOBESLAV_OFFER_STANDARD = {
  key: 'sobeslav_city_offer_v1',
  version: '1.0',
  source: 'Cenová nabídka MLŽIDLA Soběslav BT260 614_621',
  structure: [
    'titulní identifikace projektu',
    'klientské shrnutí a přínosy',
    'produkty s vizualizací a technickým schématem',
    'položková cenová rekapitulace',
    'rozsah, předpoklady a výluky',
    'postup realizace a technické ověření',
    'obchodní podmínky, platnost a další krok',
  ],
  rules: [
    'A4 na výšku, světlý čistý základ a čitelná cenová tabulka.',
    'Uvádět pouze ověřené technické údaje, ceny, účinky a termíny.',
    'U více kusů ukázat samostatné nacenění, projektovou cenu a úsporu v Kč i procentech.',
    'Fotografie a vizualizace mohou být přílohou, ale v hlavním dokumentu nesmí chybět položková cena a rozsah.',
    'Přílohy řadit: vizualizace, zákres, kotvení, technický list, Smart řízení.',
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
