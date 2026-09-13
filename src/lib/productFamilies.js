// Struktura mlžných produktů — kolekce (families) → řady (lines) → produkty (slugs)
// Odpovídá struktuře sdíleného disku MLŽNÝ DISK / 01_PRODUKTOVY_KATALOG

export const LINES = {
  bendy: { label: 'BENDY®', family: 'prime', slugs: ['mlzitko-bendy', 'bendy-radius-s', 'bendy-radius-m', 'bendy-radius-l', 'bendy-field'], tagline: 'Ikonický ohyb. Zahrada, terasa i náměstí.' },
  steblo: { label: 'STÉBLO®', family: 'prime', slugs: ['mlzitko-steblo'], tagline: 'Organická silueta pro městský prostor.' },
  aura: { label: 'AURA', family: 'prime', slugs: ['aura-mlzitko', 'aura-duo'], tagline: 'Designové mlžítko pro zahrady a areály.' },
  linea: { label: 'LINEA', family: 'prime', slugs: ['linea-mlzitko', 'linea-solo'], tagline: 'Minimalistický nerezový sloup.' },
  yarmist: { label: 'Y‑ARMIST', family: 'prime', slugs: ['y-armist-tr60', 'y-armist-j70', 'ostrev-mlzitko'], tagline: 'Vícearmenné mlžítko pro parky a školy.' },
  ostrev: { label: 'OSTŘEV', family: 'prime', slugs: ['ostrev-city', 'mlzny-sloupost-ostrev'], tagline: 'Mlžný sloup s rozevřenými rameny.' },
  mrak: { label: 'MRAK', family: 'prime', slugs: ['mlzitko-mrak'], tagline: 'Mlžný oblak nad hlavou.' },
  teepee: { label: 'TEEPEE', family: 'prime', slugs: ['teepee'], tagline: 'Samostojící mlžiště pro eventy a slavnosti.' },
  spirala: { label: 'SPIRÁLA', family: 'prime', slugs: ['mlzna-spirála'], tagline: 'Skulpturální spirála mlhy.' },
  lizatko: { label: 'LÍZÁTKO', family: 'prime', slugs: ['mlzitko-lizatko'], tagline: 'Kruhové halo pro školky a hřiště.' },
  kruh: { label: 'KRUH', family: 'gates', slugs: ['mlzitko-kruh'], tagline: 'Kruhový mlžný portál pro průchozí zóny a veřejný prostor.' },
  mrkev: { label: 'MRKEV', family: 'prime', slugs: ['mlzitko-mrkev'], tagline: 'Hravá plastika z Polné.' },
  gate: { label: 'BRÁNA GATE', family: 'gates', slugs: ['mlzna-brana-gate', 'city-arc-3', 'city-arc-4', 'city-arc-5'], tagline: 'Průchozí mlžná brána pro náměstí a vjezdy.' },
  sestavy: { label: 'Sestavy & aleje', family: 'gates', slugs: ['brana-bendy', 'linea-gate', 'mlzitko-2-stebla', 'bendy-back-to-back', 'bendy-alej', 'linea-avenue', 'mlzitko-bendy-field', 'city-cooling-zone'], tagline: 'Brány, aleje a mlžiště z více prvků.' },
  animal: { label: 'ANIMAL', family: 'creative', slugs: ['mlzitko-kapr', 'mlzitko-pav', 'mlzitko-volavka'], tagline: 'Autorské tvary inspirované zvířaty.' },
  flora: { label: 'FLORA', family: 'creative', slugs: ['mlzitko-kvet-4'], tagline: 'Květy a listy z nerezu.' },
  funny: { label: 'FUNNY', family: 'creative', slugs: ['mlzitko-slunce'], tagline: 'Hravé motivy pro děti.' },
  smart: { label: 'Smart & příslušenství', family: 'smart', slugs: ['mlzici-tryska'], tagline: 'Trysky, řízení SUPLA, filtrace.' },
};

export const FAMILIES = [
  { id: 'prime', code: '01', label: 'PRIME kolekce', title: 'Mlžítka a mlžné sochy', description: 'Základní řada nerezových mlžítek pro města, parky, školy, zahrady a terasy. Ověřené tvary, sériová výroba HolmTec, dodání v týdnech.', accent: '#153863' },
  { id: 'gates', code: '02', label: 'Brány & sestavy', title: 'Mlžné brány, aleje a mlžiště', description: 'Průchozí brány a sestavy z více prvků pro náměstí, promenády, sportoviště a vstupní zóny. Projektový návrh rozmístění a řízení.', accent: '#06667a' },
  { id: 'creative', code: '03', label: 'CREATIVE kolekce', title: 'Autorské mlžné plastiky', description: 'Zakázkové tvary — zvířata, květy, hravé motivy. Pro zoo, hřiště, školky a místa, kde má mlha vyprávět příběh.', accent: '#0A1628' },
  { id: 'smart', code: '04', label: 'Smart & příslušenství', title: 'Řízení, trysky a moduly', description: 'Chytré řízení SUPLA, senzory, náhradní trysky a filtrace pro každé mlžítko.', accent: '#22D3EE' },
];

const SLUG_TO_LINE = Object.fromEntries(
  Object.entries(LINES).flatMap(([key, line]) => line.slugs.map((slug) => [slug, key]))
);

export function getLineKey(product) {
  if (!product) return 'smart';
  const direct = SLUG_TO_LINE[product.slug];
  if (direct) return direct;
  const s = `${product.slug || ''} ${product.name || ''}`.toLowerCase();
  if (s.includes('bendy')) return 'bendy';
  if (s.includes('stébl') || s.includes('steblo')) return 'steblo';
  if (s.includes('aura')) return 'aura';
  if (s.includes('linea')) return 'linea';
  if (s.includes('armist')) return 'yarmist';
  if (s.includes('ostrev') || s.includes('ostřev')) return 'ostrev';
  if (s.includes('mrak')) return 'mrak';
  if (s.includes('gate') || s.includes('brána') || s.includes('brana')) return 'gate';
  if (s.includes('spir')) return 'spirala';
  return 'smart';
}

export function getLine(product) {
  const key = getLineKey(product);
  return { key, ...LINES[key] };
}

export function getFamily(product) {
  const line = getLine(product);
  return FAMILIES.find((f) => f.id === line.family) || FAMILIES[0];
}

export function getFamilyById(id) {
  return FAMILIES.find((f) => f.id === id);
}

export function linesOfFamily(familyId) {
  return Object.entries(LINES).filter(([, l]) => l.family === familyId).map(([key, l]) => ({ key, ...l }));
}

// Pořadí: podle kolekce, pak podle řady, pak featured, pak název
export function sortByStructure(products) {
  const familyOrder = FAMILIES.map((f) => f.id);
  const lineOrder = Object.keys(LINES);
  return [...products].sort((a, b) => {
    const la = getLine(a); const lb = getLine(b);
    const fa = familyOrder.indexOf(la.family); const fb = familyOrder.indexOf(lb.family);
    if (fa !== fb) return fa - fb;
    const li = lineOrder.indexOf(la.key); const lj = lineOrder.indexOf(lb.key);
    if (li !== lj) return li - lj;
    return Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || (a.name || '').localeCompare(b.name || '', 'cs');
  });
}