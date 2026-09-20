// Statická prezentační vrstva pro portály a mlžné brány.
// Doplňuje katalog o brány, které mají být viditelné mezi portály i ve chvíli,
// kdy ještě nejsou založené jako samostatné Product záznamy v Base44 databázi.

export const PORTAL_GATE_PRODUCTS = [
  {
    id: 'static-mlzna-brana-gate',
    slug: 'mlzna-brana-gate',
    name: 'Mlžná brána Gate',
    short_description: 'Klasická nebo lomená V brána pro průchozí ochlazení náměstí, promenád a eventů.',
    description: 'Architektonická mlžná brána pro vstupy, náměstí, promenády a veřejné akce. Vytváří průchozí zónu jemné mlhy bez zbytečného vizuálního zatížení prostoru.',
    image_url: '/media/optimized/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.webp',
    material: 'Nerezová ocel',
    pressure: 'dle projektu',
    water_consumption: 'dle počtu trysek',
    featured: true,
    detail_path: '/mlzne-brany',
    offer_path: '/poptavka?produkt=Mlžná%20brána%20Gate',
  },
  {
    id: 'static-bendy-gate',
    slug: 'bendy-gate',
    name: 'Bendy Gate',
    short_description: 'Dvě mlžítka BENDY® jako hravá průchozí zóna pro parky, školy a veřejné prostory.',
    description: 'Dvojice prvků BENDY® tvoří měkce tvarovanou bránu vhodnou pro místa, kde má technologie působit přívětivě a živě.',
    image_url: '/media/optimized/03ba352a3_mlzitka-zahradni-hotely-restaurace.webp',
    material: 'Nerezová ocel',
    pressure: 'dle projektu',
    water_consumption: 'dle počtu trysek',
    featured: true,
    detail_path: '/mlzne-brany',
    offer_path: '/poptavka?produkt=Bendy%20Gate',
  },
  {
    id: 'static-steblo-gate',
    slug: 'steblo-gate',
    name: 'Stéblo Gate',
    short_description: 'Elegantní brána ze dvou prvků STÉBLO® pro parky, nábřeží a klidnější městské prostory.',
    description: 'Stéblo Gate zachovává organickou siluetu produktu a vytváří jemný průchod vodní mlhou v zeleni nebo u pobytových tras.',
    image_url: '/media/optimized/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.webp',
    material: 'Nerezová ocel',
    pressure: 'dle projektu',
    water_consumption: 'dle počtu trysek',
    featured: true,
    detail_path: '/mlzne-brany',
    offer_path: '/poptavka?produkt=Stéblo%20Gate',
  },
  {
    id: 'static-linea-gate',
    slug: 'linea-gate',
    name: 'Linea Gate',
    short_description: 'Sloupová brána ze dvou prvků LINEA® pro čisté architektonické vstupy a pěší zóny.',
    description: 'Minimalistická sloupová brána pro moderní náměstí, promenády a veřejné prostory, kde je důležitý klidný technický výraz.',
    image_url: '/media/optimized/3bd7f70e9_MlitkoAURA-zahradnimlzidlo.webp',
    material: 'Nerezová ocel',
    pressure: 'dle projektu',
    water_consumption: 'dle počtu trysek',
    featured: true,
    detail_path: '/mlzne-brany',
    offer_path: '/poptavka?produkt=Linea%20Gate',
  },
  {
    id: 'static-portal-linea-ce',
    slug: 'portal-linea-ce',
    name: 'Portál Linea CE',
    short_description: 'Dva prvky LINEA CE jako výrazný portál pro intenzivní průchozí ochlazení.',
    description: 'Portál Linea CE je určený pro vstupy do zón, náměstí, nábřeží a exponované pěší tahy, kde má mlžení zároveň navádět pohyb lidí.',
    image_url: '/media/optimized/81c84ca33_Mrakmlzitko-skolnizahrada.webp',
    material: 'Nerezová ocel',
    pressure: 'dle projektu',
    water_consumption: 'dle počtu trysek',
    featured: true,
    detail_path: '/mlzne-brany',
    offer_path: '/poptavka?produkt=Portál%20Linea%20CE',
  },
];

export function mergePortalGateProducts(products = []) {
  const existingSlugs = new Set(products.map((product) => product.slug));
  const missing = PORTAL_GATE_PRODUCTS.filter((product) => !existingSlugs.has(product.slug));
  return [...products, ...missing];
}
