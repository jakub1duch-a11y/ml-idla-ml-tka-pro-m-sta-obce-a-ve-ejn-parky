// Aktivní produktová URL převzatá z Base44 Product (14. 11. 2026).
// Desktop a mobilní menu používají tuto jednu strukturu.
// Dlouhodobé aliasy jsou přesměrovány v src/App.jsx.
export const PRODUCT_MENU_GROUPS = [
  { title: 'MRAK · mlžné sochy', links: [
    { label: 'MRAK – přehled variant', path: '/produkt/mlzitko-mrak' },
    { label: 'MRAK 1413', path: '/produkt/mlzny-mrak-1413' },
    { label: 'MRAK 1414', path: '/produkt/mlzny-mrak-1414' },
    { label: 'MRAK 1480', path: '/produkt/mlzny-mrak-1480' },
    { label: 'MRAK 2424', path: '/produkt/mlzny-mrak-2424' },
  ] },
  { title: 'BENDY · ohýbané prvky', links: [
    { label: 'BENDY', path: '/produkt/mlzitko-bendy' },
    { label: 'BENDY RADIUS S', path: '/produkt/bendy-radius-s' },
    { label: 'BENDY RADIUS M', path: '/produkt/bendy-radius-m' },
    { label: 'BENDY RADIUS L', path: '/produkt/bendy-radius-l' },
    { label: 'BENDY FIELD', path: '/produkt/mlzitko-bendy-field' },
  ] },
  { title: 'STÉBLO · sestavy', links: [
    { label: 'STÉBLO', path: '/produkt/mlzitko-steblo' },
    { label: '2-STÉBLA', path: '/produkt/mlzitko-2-stebla' },
    { label: 'STÉBLO GATE', path: '/produkt/mlzna-brana-steblo' },
    { label: 'STÉBLO ALEJ', path: '/produkt/bendy-alej' },
    { label: 'STÉBLO BACK-TO-BACK', path: '/produkt/bendy-back-to-back' },
  ] },
  { title: 'LINEA a Y-ARMIST', links: [
    { label: 'LINEA', path: '/produkt/linea-mlzitko' },
    { label: 'LINEA CE', path: '/produkt/Linea-ce' },
    { label: 'LINEA CE GATE', path: '/produkt/linea-CE-gate' },
    { label: 'LINEA AVENUE', path: '/produkt/linea-avenue' },
    { label: 'Y-ARMIST TR60', path: '/produkt/y-armist-tr60' },
    { label: 'Y-ARMIST JEKL', path: '/produkt/y-armist-j70' },
  ] },
  { title: 'Mlžné brány', links: [
    { label: 'BRÁNA GATE', path: '/produkt/mlzna-brana-gate' },
    { label: 'KRUH', path: '/produkt/mlzitko-kruh' },
  ] },
  { title: 'Designové mlžné sochy', links: [
    { label: 'AURA GARDEN', path: '/produkt/aura-mlzitko' },
    { label: 'LÍZÁTKO', path: '/produkt/mlzitko-lizatko' },
    { label: 'KVĚT', path: '/produkt/mlzitko-kvet-4' },
    { label: 'SPIRÁLA', path: '/produkt/mlzna-spirála' },
    { label: 'MRKEV', path: '/produkt/mlzitko-mrkev' },
  ] },
  { title: 'Přírodní motivy a doplňky', links: [
    { label: 'VOLAVKA', path: '/produkt/mlzitko-volavka' },
    { label: 'KAPR', path: '/produkt/mlzitko-kapr' },
    { label: 'OSTREV', path: '/produkt/ostrev-city' },
    { label: 'TEEPEE', path: '/produkt/teepee' },
    { label: 'MLŽNÁ TRYSKA', path: '/produkt/mlzici-tryska' },
  ] },
  { title: 'Kolekce a služby', links: [
    { label: 'Všechny mlžné brány', path: '/mlzne-brany' },
    { label: 'Mlžiště a mlhoviště', path: '/mlhoviste' },
    { label: 'Zakázková výroba', path: '/zakazkova-mlzitka' },
    { label: 'Kompletní katalog', path: '/katalog-mlzitek' },
  ] },
];
