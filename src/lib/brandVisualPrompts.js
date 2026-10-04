// Značkové promptové šablony pro generování ikon a vizuálních prvků MLŽIDLA®.
// Paleta i typografie odpovídají brand systému: Deep Navy #0A1628, Steel #153863, Signal Cyan #22D3EE, Mist #F4FAFC.

const BRAND_CORE =
  'Vizuální identita MLŽIDLA®: čistá, minimalistická, architektonická. Paleta výhradně: hluboká námořní modrá #0A1628, ocelová modrá #153863, signální cyan #22D3EE, mléčně světlá #F4FAFC. Žádné jiné barvy, žádné gradienty přes více odstínů, žádný text ani písmo, žádné vodoznaky, žádné 3D lesklé efekty. Ostré geometrické linie, hodně volného prostoru, pravé úhly, nulové zaoblení rámů.';

export const VISUAL_KINDS = [
  {
    id: 'line-icon',
    label: 'Liniová ikona',
    hint: 'Tenká vektorová ikona do sekcí a benefitů',
    aspect: '1:1',
    build: (subject) =>
      `Jedna plochá vektorová liniová ikona: ${subject}. Pouze obrysové linie o konstantní šířce 1,5 px v poměru k 24px mřížce, zakulacené konce linií, bez výplně, bez stínů. Barva linií #153863 na jednolitém pozadí #F4FAFC, ikona vycentrovaná s velkým okrajem, ideálně čitelná i v 24 px. ${BRAND_CORE}`,
  },
  {
    id: 'icon-set',
    label: 'Sada ikon (3×3)',
    hint: 'Devět konzistentních ikon na jedné mřížce',
    aspect: '1:1',
    build: (subject) =>
      `Mřížka 3×3 s devíti různými plochými liniovými ikonami na téma: ${subject}. Všech devět ikon má identickou šířku linky, stejný optický rozměr a stejný styl, rozestupy jsou pravidelné. Barva linií #153863 na jednolitém pozadí #F4FAFC, bez rámečků, bez popisků. ${BRAND_CORE}`,
  },
  {
    id: 'pictogram',
    label: 'Piktogram do karty',
    hint: 'Plný piktogram na cyanovém akcentu',
    aspect: '1:1',
    build: (subject) =>
      `Jeden geometrický piktogram: ${subject}. Plná plocha ve #0A1628 s jedním akcentním prvkem v #22D3EE, umístěný na jednolitém pozadí #F4FAFC. Redukovaný na základní geometrii, bez detailů, bez perspektivy. ${BRAND_CORE}`,
  },
  {
    id: 'tech-diagram',
    label: 'Technické schéma',
    hint: 'Blueprint linka pro technické sekce',
    aspect: '16:9',
    build: (subject) =>
      `Technické blueprintové schéma: ${subject}. Tenké cyanové linie #22D3EE a jemná měřicí mřížka na hlubokém pozadí #0A1628, kótovací linky bez čitelných čísel, styl inženýrského výkresu. ${BRAND_CORE}`,
  },
  {
    id: 'catalog-tile',
    label: 'Katalogová dlaždice',
    hint: 'Abstraktní vizuál nad produktovou kartu',
    aspect: '16:9',
    build: (subject) =>
      `Abstraktní katalogový vizuál pro produktovou kartu: ${subject}. Kompozice z čistých nerezových tvarů a jemné vodní mlhy, diagonální gradient z #0A1628 do #22D3EE, prázdné místo v levé dolní části pro text. Klidná, prémiová, architektonická atmosféra. ${BRAND_CORE}`,
  },
  {
    id: 'section-background',
    label: 'Pozadí sekce',
    hint: 'Jemná textura pod obsah',
    aspect: '16:9',
    build: (subject) =>
      `Velmi jemné pozadí sekce webu: ${subject}. Nízký kontrast, měkká mlžná textura a tenké linie ve #D3E2E8 na pozadí #F4FAFC, bez ohniska pozornosti, aby zůstal čitelný text položený navrch. ${BRAND_CORE}`,
  },
];

export function buildBrandPrompt({ kindId, subject, productName }) {
  const kind = VISUAL_KINDS.find((k) => k.id === kindId) || VISUAL_KINDS[0];
  const withProduct = productName ? `${subject} (kontext produktu: ${productName})` : subject;
  return kind.build(withProduct);
}

export function kindById(kindId) {
  return VISUAL_KINDS.find((k) => k.id === kindId) || VISUAL_KINDS[0];
}