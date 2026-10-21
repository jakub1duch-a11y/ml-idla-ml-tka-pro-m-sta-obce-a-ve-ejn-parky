// Prezentační konfigurace detailu produktu.
// Neobsahuje výrobní parametry ani ceny — ty se vždy čtou z entity Product.
// Cílem je sjednotit UX a současně zabránit záměně produktu za prostorovou konfiguraci.

const DEFAULT_CONFIG = {
  tagline: 'Architektonické mlžítko pro příjemnější venkovní prostor',
  intro: 'Čistý design, funkční mlžení a projektové řešení podle konkrétního prostoru.',
  benefits: [
    ['Návrh podle prostoru', 'Výběr produktu a jeho umístění se přizpůsobí rozměrům, pohybu lidí a charakteru místa.'],
    ['Parametry bez dohadů', 'Materiál, tlak, spotřebu i další technické údaje uvádíme jen tehdy, pokud jsou potvrzené u konkrétního produktu.'],
    ['Promyšlená instalace', 'Přívod vody, kotvení a servisní přístup se předem prověří podle skutečného provedení a podmínek na místě.'],
    ['Možnost projektové konfigurace', 'Požadované ovládání, počet prvků a jejich rozmístění se upřesní v technickém návrhu.'],
  ],
  useCases: ['Městský prostor', 'Parky a zeleň', 'Pobytové zóny', 'Komerční areály'],
};

// Produktové velikosti MRAK: malý 1 600 mm podle zadání (výrobně neověřeno), velký 2 400 mm podle kalkulace MRAK 13R 2424.
// Nezveřejňujeme cenu ani počet trysek, dokud není potvrzen aktuální výrobní výkres.
export const MRAK_VARIANTS = [
  {
    id: 'maly',
    name: 'Malý',
    height: '1 600 mm',
    description: 'Kompaktní mlžný prvek do zahrad, škol a dětských zón.',
    note: 'Návrhová výška 1 600 mm; výrobní provedení se potvrdí před nabídkou.',
  },
  {
    id: 'velky',
    name: 'Velký',
    height: '2 400 mm',
    description: 'Výrazná nerezová mlžná skulptura pro parky a větší mlžiště.',
    note: 'Výška odpovídá kalkulaci MRAK 13R 2424; přesné osazení trysek k potvrzení.',
  },
];

const CONFIG = {
  'teepee': {
    tagline: 'Mobilní mlžná zóna pro městské slavnosti, festivaly a eventy',
    intro: 'TEEPEE je samostojící nerezové mlžítko pro rychlé sezónní nasazení na náměstích, festivalech, eventech a v gastro zónách. Přináší jemnou nízkotlakou mlhu bez nutnosti trvalého betonování a lze jej doplnit chytrým řízením.',
    benefits: [
      ['Rychlá instalace', 'Samostojící konstrukce je navržená pro rychlé sezónní nebo dočasné nasazení.'],
      ['Bez betonování', 'Podle konkrétního řešení lze TEEPEE instalovat bez trvalého zásahu do povrchu.'],
      ['Nízkotlaká mlha', 'Jemné kapky 50–100 μm využívají dostupný tlak vody podle konfigurace.'],
      ['Smart řízení', 'Volitelně Wi‑Fi ventil nebo SUPLA pro časové a provozní scénáře.'],
      ['Nerez AISI 316L', 'Odolná konstrukce pro městské akce, veřejný prostor a sezónní provoz.'],
    ],
    useCases: ['Městské slavnosti', 'Festivaly', 'Eventy', 'Náměstí', 'Gastro zóny'],
  },
  'mlzitko-bendy': {
    tagline: 'Svěžest, která ladí s městem',
    intro: 'Sochařská nerezová forma BENDY® kombinuje výrazný design s funkčním ochlazením a možností různých prostorových sestav.',
    benefits: [
      ['Ikonický ohyb', 'Charakteristická geometrie BENDY® zůstává zachována v každé schválené sestavě.'],
      ['Nízkotlaké mlžení', 'Provozní tlak a osazení trysek vychází z technických dat produktu.'],
      ['Nerezové provedení', 'Materiál a profil odpovídají konkrétní výrobní specifikaci.'],
      ['Chytré řízení', 'Volitelné časové, teplotní nebo senzorické řízení podle projektu.'],
      ['Variabilní osazení', 'Single, Duo, Back-to-Back nebo Alej mění počet a rozmístění, nikoli geometrii prvku.'],
    ],
    useCases: ['Náměstí', 'Parky', 'Promenády', 'Rezidenční zahrady'],
  },
  'linea-mlzitko': {
    tagline: 'Vyšší minimalistická linie pro český veřejný prostor',
    intro: 'LINEA® je štíhlé vertikální mlžítko pro náměstí, promenády a pěší zóny. U této městské varianty zůstává spodní část zcela čistá: kotvení i přívod vody jsou skryté pod povrchem a všechny tři trysky jsou soustředěné pouze v horní části.',
    benefits: [
      ['Vyšší městská proporce', 'Štíhlý vertikální prvek je navržený přibližně ve výšce 2,7–3,0 m podle konkrétního projektu a měřítka prostoru.'],
      ['3 trysky pouze nahoře', 'Celkem tři mlžicí trysky jsou umístěné jen v horní části sloupu, střídavě po stranách. Spodní část zůstává bez trysek a armatur.'],
      ['Skrytá patka', 'Kotvení a přívod vody jsou integrovány pod dlažbou nebo finálním povrchem bez viditelné příruby a kotevních šroubů.'],
      ['Nerezová konstrukce', 'Čisté provedení z nerezové oceli pro dlouhodobé použití ve veřejném prostoru.'],
      ['Smart řízení', 'Volitelná automatizace podle času, teploty nebo provozní logiky.'],
    ],
    useCases: ['Česká náměstí', 'Promenády', 'Pěší zóny', 'Parky'],
  },
  'aura-mlzitko': {
    tagline: 'Jemná forma pro zahrady a rezidenční prostor',
    intro: 'AURA® je designové zahradní mlžítko pro terasy, zahrady a rezidenční zóny s nízkotlakým provozem.',
    benefits: [
      ['Jemný design', 'Forma je navržená tak, aby přirozeně doplnila zahradu a terasu.'],
      ['Nízkotlaký provoz', 'Produkt pracuje přímo s tlakem vodovodního řádu podle své technické konfigurace.'],
      ['Nerez AISI 316L', 'Odolný materiál pro venkovní rezidenční použití.'],
      ['Rezidenční komfort', 'Jemná mlha vytváří příjemnější mikroklima v pobytové části zahrady.'],
      ['Volitelné řízení', 'Manuální nebo smart spouštění podle zvoleného projektu.'],
    ],
    useCases: ['Zahrady', 'Terasy', 'Rezidence', 'Hotelové zahrady'],
  },
  'mlzna-brana-gate': {
    tagline: 'Průchozí mlžná brána s architektonickým efektem',
    intro: 'GATE® propojuje osvěžení při průchodu s výraznou architektonickou formou. Konkrétní tvar, napojení a provozní konfigurace se potvrzují podle schváleného provedení a místa instalace.',
    benefits: [
      ['Průchozí efekt', 'Mlžný prvek vytváří vstupní nebo průchozí bod, který lze začlenit do návštěvnické trasy.'],
      ['Volba geometrie', 'K dispozici jsou popsané varianty Straight a V; výsledné provedení se potvrzuje před výrobou.'],
      ['Návrh pro dané místo', 'Rozměry průchodu, návaznost na povrch a přívod vody se řeší podle konkrétní lokality.'],
      ['Technické ověření', 'Počet a umístění trysek i provozní parametry se potvrzují v technickém návrhu.'],
    ],
    useCases: ['Promenády', 'Vstupní zóny', 'Eventy', 'Městské areály'],
  },
  'y-armist-tr60': {
    tagline: 'Ikonická Y forma pro moderní veřejný prostor',
    intro: 'Y-ARMIST využívá výraznou siluetu ve tvaru Y jako architektonický prvek pro veřejné a pobytové plochy. Varianta profilu a technické provedení se volí podle potvrzené specifikace.',
    benefits: [
      ['Charakteristická silueta', 'Tvar Y vytváří čitelný orientační bod v prostoru.'],
      ['Volba profilu', 'Konfigurace rozlišuje variantu TUBE s kulatým profilem a JEKL s hranatým profilem.'],
      ['Umístění podle provozu', 'Rozmístění prvků se plánuje podle pohybu osob, pobytových míst a návaznosti na okolní architekturu.'],
      ['Parametry podle specifikace', 'Materiál, osazení trysek a provozní hodnoty se uvádějí po potvrzení konkrétního provedení.'],
    ],
    useCases: ['Náměstí', 'Parky', 'Dětské zóny', 'Architektonické projekty'],
  },
  'mlzitko-steblo': {
    tagline: 'Štíhlé mlžítko inspirované přírodou',
    intro: 'STÉBLO® pracuje s lehkou organickou siluetou a umožňuje citlivé začlenění do zeleně, promenád i veřejného prostoru. Konfigurace sestavy se volí podle konkrétního místa.',
    benefits: [
      ['Organická silueta', 'Štíhlý tvar přirozeně navazuje na zeleň a liniové prvky veřejného prostoru.'],
      ['Více způsobů osazení', 'Produkt lze plánovat jako samostatný prvek, dvojici, průchozí sestavu nebo alej.'],
      ['Prostorové plánování', 'Rozmístění a rozestupy se navrhují podle šířky trasy a požadovaného způsobu využití.'],
      ['Ověřené technické údaje', 'Materiál, napojení a parametry mlžení se potvrzují podle konkrétní výrobní konfigurace.'],
    ],
    useCases: ['Parky', 'Zahrady', 'Promenády', 'Veřejná zeleň'],
  },
  'mlzitko-mrak': {
    tagline: 'Mlžná skulptura pro zahrady i veřejný prostor',
    intro: 'MRAK je organicky tvarovaný mlžný prvek pro školní zahrady, dětská hřiště, parky a rezidenční zahrady. Volbu velikosti i konečné výrobní provedení potvrzujeme před naceněním.',
    benefits: [
      ['Výrazný prostorový prvek', 'Organická forma propojuje funkci mlžení s vizuálním akcentem v prostoru.'],
      ['Dvě návrhové velikosti', 'K dispozici jsou malá a velká varianta; jejich konečné rozměry a osazení se ověřují před výrobou.'],
      ['Pro pobytové zóny', 'Hodí se k návrhu školních zahrad, dětských hřišť, parků a dalších pobytových míst.'],
      ['Technické potvrzení před nabídkou', 'Počet a rozmístění trysek, napojení a další parametry se potvrdí v konkrétní konfiguraci.'],
    ],
    useCases: ['Školní zahrady', 'Dětská hřiště', 'Parky', 'Mlžiště', 'Rezidenční zahrady'],
  },
  'mlzitko-lizatko': [
    ['Single', '1 kruhový prvek', 'Samostatné LOLLI jako jasný ochlazovací bod pro děti, rodiny a veřejný prostor.'],
    ['Duo', '2 stejné prvky', 'Dvojice kruhových mlžítek pro širší pobytovou nebo průchozí zónu.'],
    ['Play Zone', 'více prvků v prostoru', 'Sestava více LOLLI prvků pro školky, hřiště a komunitní plochy.'],
  ],
  'lolli': [
    ['Single', '1 kruhový prvek', 'Samostatné LOLLI jako jasný ochlazovací bod pro děti, rodiny a veřejný prostor.'],
    ['Duo', '2 stejné prvky', 'Dvojice kruhových mlžítek pro širší pobytovou nebo průchozí zónu.'],
    ['Play Zone', 'více prvků v prostoru', 'Sestava více LOLLI prvků pro školky, hřiště a komunitní plochy.'],
  ],
  'mlzna-spirála': {
    tagline: 'Skulpturální spirála s mlžným efektem',
    intro: 'MLŽNÁ SPIRÁLA propojuje sochařsky pojatou spirálu s mlžným efektem pro parky, náměstí a zážitkové instalace. Materiálové a provozní detaily se řídí potvrzenou specifikací produktu.',
    benefits: [
      ['Sochařský tvar', 'Spirálová silueta funguje jako výrazný vizuální bod v pobytovém prostoru.'],
      ['Zážitek v prostoru', 'Mlha zvýrazňuje vnímání instalace a její vztah k okolnímu prostředí.'],
      ['Návrh podle lokality', 'Umístění, přístupové trasy a napojení se plánují s ohledem na konkrétní prostor.'],
      ['Potvrzení parametrů', 'Technické hodnoty a případné doplňkové prvky se uvádějí až podle schváleného provedení.'],
    ],
    useCases: ['Parky', 'Náměstí', 'Eventy', 'Zážitkové instalace'],
  },
  'ostrev-mlzitko': {
    tagline: 'Organické stromové mlžítko se sedmi rameny',
    intro: 'OSTŘEV je vícearmenný mlžný prvek pro větší veřejné a pobytové prostory. Konkrétní osazení, provozní parametry a rozmístění se potvrzují podle výrobní specifikace a projektu.',
    benefits: [
      ['Vícearmenná forma', 'Rozvětvená silueta vytváří výrazný prostorový prvek pro větší plochy.'],
      ['Návrh pro větší zóny', 'Rozmístění se plánuje podle velikosti prostoru, pěších tras a pobytových míst.'],
      ['Projektové napojení', 'Přívod vody, kotvení a servisní přístup se řeší podle konkrétní lokality.'],
      ['Bez neověřených hodnot', 'Počet trysek, dosah mlhy a spotřeba se uvádějí pouze z potvrzených technických podkladů.'],
    ],
    useCases: ['Města', 'Parky', 'Školy', 'Sportoviště'],
  },
};

export function getProductDetailConfig(product) {
  const custom = CONFIG[product?.slug] || {};
  return {
    ...DEFAULT_CONFIG,
    ...custom,
    benefits: custom.benefits || DEFAULT_CONFIG.benefits,
    useCases: custom.useCases || DEFAULT_CONFIG.useCases,
  };
}

const SPATIAL_CONFIGS = {
  'teepee': [
    ['Event', 'mobilní samostojící instalace', 'Rychlá konfigurace pro festivaly, slavnosti a krátkodobé akce.'],
    ['Sezónní', 'delší provoz bez trvalého betonování', 'Řešení pro letní gastro zóny, náměstí a dočasné pobytové plochy.'],
    ['Smart', 'TEEPEE + chytré řízení', 'Doplnění o Wi‑Fi ventil nebo SUPLA podle požadovaného provozního scénáře.'],
  ],
  'mlzitko-bendy': [
    ['Single', '1 samostatný prvek', 'Solitérní osazení se zachovanou geometrií BENDY®.'],
    ['Duo', '2 stejné prvky', 'Dvojice identických prvků rozmístěná podle konkrétního prostoru.'],
    ['Back-to-Back', '2 prvky zády k sobě', 'Oboustranná sestava bez změny základní geometrie výrobku.'],
    ['Alej', 'více prvků v linii', 'Opakování stejného výrobku v liniové sestavě.'],
  ],
  'mlzitko-steblo': [
    ['Single', '1 samostatný prvek', 'Samostatné STÉBLO® jako lehký solitér.'],
    ['Dvojice', '2 stejné prvky', 'Dva prvky pro širší pobytovou nebo průchozí zónu.'],
    ['Gate', '2 prvky proti sobě', 'Průchozí sestava vytvořená dvěma identickými prvky.'],
    ['Alej', 'více prvků v linii', 'Opakovaná řada stejného produktu v prostoru.'],
  ],
  'mlzitko-mrak': [
    ['Malý · h 1 600 mm', '1 samostatný prvek', 'Výška dle zadání. Výrobní provedení se potvrdí před naceněním.'],
    ['Velký · h 2 400 mm', '1 samostatný prvek', 'Kalkulovaný MRAK 13R 2424 pro větší mlžiště a parkové prostory.'],
  ],
  'mlzna-brana-gate': [
    ['Straight', 'rovná horní linie', 'Průchozí brána s rovnou horní geometrií.'],
    ['V', 'lomená horní linie', 'Průchozí varianta se schválenou V geometrií.'],
  ],
  'y-armist-tr60': [
    ['TUBE', 'kulatý profil', 'Varianta Y-ARMIST s kulatým trubkovým profilem.'],
    ['JEKL', 'hranatý profil', 'Varianta Y-ARMIST s hranatým profilem.'],
  ],
};

export function getProductSpatialConfigurations(product) {
  return SPATIAL_CONFIGS[product?.slug] || [
    ['Solitér', '1 produkt', 'Samostatné osazení podle charakteru místa.'],
    ['Dvojice', '2 produkty', 'Dva stejné prvky rozmístěné podle projektu.'],
    ['Sestava', 'více produktů', 'Víceprvkové osazení navržené pro konkrétní prostor.'],
  ];
}
