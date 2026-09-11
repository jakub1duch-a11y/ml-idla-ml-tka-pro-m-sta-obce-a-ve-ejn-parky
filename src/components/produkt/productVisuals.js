// Pravidlo pro všechny vizualizace: průměr trubky mlžítka max. Ø70 mm (kulatá) / 70×70 mm (jekl).
const IMG = {
  bendyHero: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ded6a5d3f_generated_image.png',
  nozzleDetail: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/a937054fe_generated_image.png',
  install: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9e7d7a670_generated_image.png',
  ostrevHero: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/2a6c23aa2_generated_image.png',
  lineaPrague: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/c4c1b47a8_file_000000002440821082cc47cf9c186371.png',
  lineaPlaza: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/1cb5f9b18_file_000000005c8081f5ad3ec61cc9e1c7cb.png',
  lineaPraguePortrait: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/512446aa1_file_00000000ada8822fab4c3e868219c559.png',
  lineaSquare: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/de905f415_generated_image.png',
  anchorDetail: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6fed4704e_06_Detail_skryte_patky_a_privodu_vody.png',
  spiralAnchor: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/20aa9f5f9_09_Vizualizace_Mlzna_spirala_skryta_patka.png',
  kidsPool: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/63f7ce7ec_file_00000000817481f4a65e35df068e49fc.png',
  kidChild: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/97764c6a5_Bendymlznabrana.jpg',
  gatesStreet: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/dae0f65d1_Mlznebrany-gatemlznabrana.jpg',
  mistField: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/61b270214_Sportovisteamlznehristemlhoviste.jpg',
  trutnov: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/aff0ffe26_2026-08-31_Trutnov_Krakonosovo-namesti_04_Vizualizace_3x-LINEA.png'
};

// Technická sekce — skrytá patka a přívod vody (společná pro produkty s pevnou instalací).
export const ANCHOR_TECHNICAL = {
  eyebrow: 'Technický detail',
  title: 'Skrytá patka, přívod vody pod povrchem.',
  intro: 'V dlažbě zůstane vidět jen štíhlá nerezová trubka. Kotvení, přívod vody i ovládání jsou schované pod povrchem — bez viditelných rozvodů a bez překážky v pěší trase.',
  image: IMG.anchorDetail,
  alt: 'Řez instalací mlžítka: skrytá patka v betonu, přívod vody pod povrchem, detail trysky M2 a síly stěny 3 mm',
  secondaryImage: IMG.spiralAnchor,
  secondaryAlt: 'Vizualizace mlžné spirály se skrytou patkou v dlažbě',
  facts: [
    ['Profil trubky', 'max. Ø70 mm, síla stěny 3 mm'],
    ['Trysky', 'M2 nerez, 4–6 ks dle výšky'],
    ['Kotvení', 'Skrytá patka v betonovém bloku'],
    ['Přívod vody', 'Pod povrchem, napojení v šachtě']
  ]
};

export const USE_CASE_GALLERY = [
  { image: IMG.kidsPool, title: 'Koupaliště a brouzdaliště', alt: 'Děti se ochlazují u mlžítek u brouzdaliště' },
  { image: IMG.kidChild, title: 'Hřiště a školky', alt: 'Dítě si hraje pod mlžítkem na hřišti' },
  { image: IMG.trutnov, title: 'Náměstí a městské trasy', alt: 'Vizualizace tří mlžítek LINEA na Krakonošově náměstí v Trutnově' },
  { image: IMG.gatesStreet, title: 'Průchozí mlžné brány', alt: 'Cyklisté projíždějí mlžnými bránami v městské alej' },
  { image: IMG.mistField, title: 'Mlžiště a sportoviště', alt: 'Mlžiště se širokým mlžným oblakem u sportovního areálu' },
  { image: IMG.lineaPlaza, title: 'Moderní plazy a areály', alt: 'Mlžítko LINEA na moderní městské plaze' }
];

export const LINEA_VIDEO = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/91d5c8d84_IMG_20260830_183249.mp4';

export const LINEA_VARIANTS = [
  {
    key: 'round',
    name: 'LINEA R — kulatá trubka',
    profile: 'Ø 60–70 mm',
    desc: 'Klasický nerezový sloup z kulaté trubky. Měkčí silueta, která přirozeně zapadne do historických náměstí i parků.',
    image: IMG.lineaPraguePortrait,
    alt: 'LINEA s kulatou trubkou Ø70 mm na pražském náměstí',
    points: ['Broušený povrch AISI 316L', '3–6 trysek dle výšky', 'Skryté kotvení na patce']
  },
  {
    key: 'square',
    name: 'LINEA Q — hranatý jekl',
    profile: '60×60 až 70×70 mm',
    desc: 'Čtvercový profil s ostrou linkou pro současnou architekturu, administrativní areály a nové městské plochy.',
    image: IMG.lineaSquare,
    alt: 'LINEA s hranatým jeklovým profilem 70×70 mm na moderním náměstí',
    points: ['Ostré hrany, čistý detail svarů', 'Trysky v ose profilu', 'Kombinovatelná do řad a bran']
  }
];

const BENDY = {
  eyebrow: 'Městské mlžení BENDY',
  headline: 'Jeden ohnutý nerezový profil Ø70 mm. Celé náměstí o několik stupňů chladnější.',
  intro: 'BENDY je subtilní mlžný sloup s charakteristickým ohybem. Ve veřejném prostoru nepůsobí jako technika, ale jako městský prvek — a přitom ochladí procházející o několik stupňů, bez mokré dlažby.',
  hero: { url: IMG.bendyHero, alt: 'Mlžný sloup BENDY chladí lidi na městském náměstí v horkém dni', caption: 'Ochlazování městského prostoru', captionNote: 'Mlžná zóna v průchozí trase — lidé jí projdou a mlha se odpaří ve vzduchu.' },
  cards: [
    { icon: 'droplets', title: 'Detail mlžení', desc: 'Trubka Ø70 mm, trysky rozprášují vodu na mikrokapky 50–100 μm. Ty se odpaří dřív, než dopadnou — povrch zůstává suchý.', image: IMG.nozzleDetail, alt: 'Detail nerezové mlžící trysky na trubce Ø70 mm' },
    { icon: 'users', title: 'Lidé v mlžné zóně', desc: 'Zóna o průměru několika metrů, do které se lidé sami vracejí. Bez chemie, bez hluku, bez rizika uklouznutí.', image: IMG.bendyHero, alt: 'Lidé se ochlazují v mlžné zóně na městském náměstí' },
    { icon: 'wrench', title: 'Instalace BENDY', desc: 'Skryté kotvení do betonové patky, napojení na vodovodní řad v šachtě a kompaktní řídicí box. Instalace v jednom dni.', image: IMG.install, alt: 'Technici instalují štíhlý nerezový mlžný sloup BENDY na promenádě' }
  ]
};

const OSTREV = {
  eyebrow: 'Městské mlžení OSTŘEV',
  headline: 'Skulpturální mlžný prvek, který v parku vypadá jako strom.',
  intro: 'OSTŘEV rozvádí mlhu do několika větví z trubek do Ø70 mm, takže mlžný oblak je širší a jemnější. Nerezová socha, která ochlazuje pobytové plochy parků, promenád a školních areálů.',
  hero: { url: IMG.ostrevHero, alt: 'Skulpturální nerezové mlžítko OSTŘEV chladí lidi v městském parku', caption: 'Pobytová mlžná zóna', captionNote: 'Široký mlžný oblak nad lavičkami — chlazení tam, kde lidé skutečně sedí.' },
  cards: [
    { icon: 'droplets', title: 'Detail větvení', desc: 'Každá větev nese vlastní trysky. Mlha se rozprostře do většího objemu vzduchu a klesá pomaleji.', image: IMG.nozzleDetail, alt: 'Detail nerezové mlžící trysky na větvi mlžítka OSTŘEV' },
    { icon: 'users', title: 'Lidé pod OSTŘEVEM', desc: 'Přirozené místo k zastavení: rodiny, děti i senioři zůstávají v mlžné zóně delší dobu než u průchozích prvků.', image: IMG.ostrevHero, alt: 'Lidé odpočívají v mlžné zóně pod mlžítkem OSTŘEV' },
    { icon: 'wrench', title: 'Instalace a napojení', desc: 'Zemní patka, přívod vody v šachtě a volitelné smart řízení podle teploty a času. Vše podle dokumentace místa.', image: IMG.install, alt: 'Instalace nerezového mlžného prvku se skrytým kotvením' }
  ]
};

const LINEA = {
  eyebrow: 'Městské mlžení LINEA',
  headline: 'Přímá linka nerezu. Dvě varianty profilu, jeden účinek.',
  intro: 'LINEA je minimalistický mlžný sloup do Ø70 mm, který lze osadit jako kulatou trubku nebo hranatý jekl. Do historického centra i na moderní plazu — vždy jako tichý, čistý prvek, který v horku ochladí průchozí trasu.',
  hero: { url: IMG.lineaPrague, alt: 'Mlžítko LINEA chladí návštěvníky Staroměstského náměstí', caption: 'Ochlazování městského prostoru', captionNote: 'Kulatá trubka Ø70 mm s trojicí trysek v průchozí zóně náměstí.' },
  cards: [
    { icon: 'droplets', title: 'Detail trysek', desc: 'Precizní nerezové trysky v ose profilu. Mikrokapky 50–100 μm se odpaří ve vzduchu, dlažba zůstává suchá.', image: IMG.nozzleDetail, alt: 'Detail mlžící trysky na nerezové trubce Ø70 mm' },
    { icon: 'users', title: 'Lidé v mlžné zóně', desc: 'Sloup stojí přímo v pěší trase — ochlazení bez zastavení, bez mokrého oblečení.', image: IMG.lineaPlaza, alt: 'Mlžítko LINEA na moderní městské plaze' },
    { icon: 'wrench', title: 'Instalace LINEA', desc: 'Patka v dlažbě, přívod vody v šachtě a řídicí box. Sloupy lze řadit do alejí i bran.', image: IMG.install, alt: 'Instalace nerezového mlžného sloupu na promenádě' }
  ],
  variants: LINEA_VARIANTS,
  pageLink: '/linea'
};

export const LINEA_VISUALS = LINEA;

export const PRODUCT_VISUALS = {
  'mlzitko-bendy': BENDY, 'bendy-field': BENDY, 'bendy-radius-s': BENDY, 'bendy-radius-m': BENDY, 'bendy-radius-l': BENDY,
  'bendy-alej': BENDY, 'bendy-back-to-back': BENDY, 'mlzitko-bendy-field': BENDY,
  'mlzny-sloupost-ostrev': OSTREV, 'ostrev-city': OSTREV, 'ostrev-mlzitko': OSTREV,
  'linea-mlzitko': LINEA, 'linea-solo': LINEA, 'linea-avenue': LINEA, 'linea-gate': LINEA, 'linea-el70': LINEA
};

export const getProductVisuals = (slug) => PRODUCT_VISUALS[slug] || null;