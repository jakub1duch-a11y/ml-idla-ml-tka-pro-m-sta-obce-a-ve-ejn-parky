// Snapshot read from Google Sheets on 2026-10-22. No internal prices are exposed.
// Mlžítko / Technické zajištění, rows 25, 29–32, 52–55.
export const WATER_TARIFF = 126.52;
export const NOZZLE_TYPES = [
  { id: 'M1', diameter: '0,51', flows: { 5: 5.1 } },
  { id: 'M1.5', diameter: '0,51', flows: { 2: 4.8, 5: 7.6 } },
  { id: 'M2', diameter: '0,71', flows: { 2: 6.4, 5: 10.2 } },
  { id: 'M3', diameter: '0,71', flows: { 2: 9.7, 5: 15.3 } },
];
export const formatNumber = (n) => new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 2 }).format(n);
export function calculateWaterCost(count, flow, tariff, hours = 8) {
  if (![count, flow, tariff, hours].every(v => v !== '' && v != null && Number.isFinite(Number(v))) || !Number.isInteger(Number(count)) || count < 1 || flow <= 0 || tariff < 0 || hours <= 0) return null;
  const liters = Number(count) * Number(flow) * Number(hours);
  return { liters, cost: liters / 1000 * Number(tariff) };
}
const photo = (file) => `https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/${file}`;
export const MRAK_MODELS = [
  { id: 'maly', name: 'MRAK 10R 1414', height: '1 400 mm', dimensions: '1 400 × 1 400 mm (v × š)', count: 5, image: photo('df1b07980_63249829_1792550648424291.jpg'), description: 'Kompaktní varianta do zahrad a menších pobytových zón.', note: '5 trysek dle sloupce Počet trysek v katalogu 2026. Fotografie je podklad vzhledu, ne rozměrový výkres.', source: 'Katalog 2026, řádek 22' },
  { id: 'velky', name: 'MRAK 13R 2424', height: '2 400 mm', dimensions: '2 400 × 2 400 mm (v × š)', count: 9, image: photo('c29c4d36d_ef3414919_generated_image.webp'), description: 'Velká mlžná skulptura pro parky a veřejný prostor.', note: 'Výpočet používá 9 trysek ze samostatného sloupce katalogu. Slovní popis uvádí 8; konečné osazení je nutné potvrdit.', source: 'Katalog 2026, řádek 23' },
  { id: 'detsky', name: 'MRAK Dětský', height: '≈ 1 300 mm', dimensions: '≈ 1 300 × 550 mm (v × š)', count: 4, image: photo('a6217f1bd_e57570439_file_00000000435c8210815eed400ad1f021.png'), description: 'Návrh pro dětská hřiště, školy a školky; umístění a bezpečnost posoudíme pro konkrétní místo.', note: 'Návrhové měřítko, nikoli rozměry změřené z fotografie. Šířka odhadnuta z proporcí při navržené výšce 1 300 mm; 4 viditelné trysky. Bez potvrzení certifikace.', source: 'Návrh podle dodaného obrázku', concept: true },
  { id: 'design1414', name: 'MRAK 1414 Design', height: '≈ 1 400 mm', dimensions: '≈ 1 400 × 1 400 mm (v × š)', count: 5, image: photo('3ba1e6151_generated_image.png'), scene: photo('8a8521c75_8c1d5acee_generated_image.png'), description: 'Alternativní tvar řady 1414 podle dodané vizualizace v zahradě.', note: 'Návrhové rozměry převzaté z rámce 1414, ne změřené z fotografie. Pět trysek je návrh osazení, který musí potvrdit výrobce.', source: 'Designový návrh 1414', concept: true },
];
// Explicit model counts from Kalkulace mlžítka 2026 / 💧 Katalog produktů 2026, column G.
const models = {
  'mlzitko-bendy': [['BENDY 60', 3], ['BENDY 76', 5]],
  'aura-mlzitko': [['AURA 700', 5], ['AURA 900', 6]],
  'mlzna-brana-gate': [['BRÁNA 60_2115', 4], ['BRÁNA 60_2130', 7], ['BRÁNA 76_2130', 6]],
  'linea-mlzitko': [['LINEA TR 50', 4], ['LINEA TR 60', 4], ['LINEA TR 76', 3], ['LINEA JA 70', 3]],
  'teepee': [['TEEPEE 50', 6], ['TEEPEE 60', 10]],
  'mlzitko-steblo': [['STÉBLO', 5]],
  'ostrev-city': [['OSTREV', 7]],
  'mlzitko-lizatko': [['LÍZÁTKO', 5]],
  'mlzitko-kapr': [['KAPR', 4]],
  'mlzitko-mrkev': [['MRKEV', 8]],
  'mlzna-spirála': [['SPIRÁLA', 6]],
  'mlzitko-volavka': [['VOLAVKA Gracilis', 8], ['VOLAVKA Gigantea', 10]],
  'y-armist-tr60': [['Y-ARMIST TR60', 4]],
  'y-armist-j70': [['Y-ARMIST HR70', 4]],
  'mlzici-tryska': [['Samostatná tryska', 1]],
};
export function getNozzleModels(slug) {
  return (models[slug] || []).map(([name, count], i) => ({ id: String(i), name, count, source: 'Katalog produktů 2026 · Počet trysek' }));
}
export function getCatalogWaterLabel(slug) {
  const list = slug === 'mlzitko-mrak' ? MRAK_MODELS.filter(m => !m.concept) : getNozzleModels(slug);
  if (!list.length) return '';
  const rates = list.map(m => m.count * 6.4);
  const low = Math.min(...rates), high = Math.max(...rates);
  return `${formatNumber(low)}${low === high ? '' : `–${formatNumber(high)}`} l/h · M2 při 2 bar${list.length > 1 ? ', podle provedení' : ''}`;
}
export const GATE_DIRECTIONS = [
  { id: 'top', name: 'Shora', count: 3, image: photo('22b07f4a0_generated_image.png') },
  { id: 'side', name: 'Z boků', count: 4, image: photo('a2865a2ca_generated_image.png') },
  { id: 'both', name: 'Shora i z boků', count: 7, image: photo('4e33794f6_generated_image.png') },
];
export const MRAK_DETAILS = [
  { image: photo('544d3c390_generated_image.png'), label: 'Detail konstrukce, trysky a mlhy' },
  { image: photo('e0f874136_generated_image.png'), label: 'Detail návrhu kotvení' },
];