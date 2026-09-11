// Prezentační konfigurace detailu produktu.
// Neobsahuje výrobní parametry ani ceny — ty se vždy čtou z entity Product.
// Cílem je sjednotit UX a současně zabránit záměně produktu za prostorovou konfiguraci.

const DEFAULT_CONFIG = {
  tagline: 'Architektonické mlžítko pro příjemnější venkovní prostor',
  intro: 'Čistý design, funkční mlžení a projektové řešení podle konkrétního prostoru.',
  benefits: [
    ['Nízkotlaké mlžení', 'Provozní řešení se navrhuje podle konkrétní instalace.'],
    ['Nerezová konstrukce', 'Odolné provedení určené pro dlouhodobé venkovní použití.'],
    ['Čisté kotvení', 'Kotvení a přívod vody lze integrovat s důrazem na vzhled prostoru.'],
    ['Chytré řízení', 'Volitelné časové, teplotní nebo senzorické řízení podle projektu.'],
    ['Servisní řešení', 'Montáž a servis se řeší podle produktu, lokality a způsobu provozu.'],
  ],
  useCases: ['Městský prostor', 'Parky a zeleň', 'Pobytové zóny', 'Komerční areály'],
};

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
    intro: 'GATE® propojuje ochlazení při průchodu s výraznou architektonickou formou pro veřejné a komerční prostory.',
    useCases: ['Promenády', 'Vstupní zóny', 'Eventy', 'Městské areály'],
  },
  'y-armist-tr60': {
    tagline: 'Ikonická Y forma pro moderní veřejný prostor',
    intro: 'Y-ARMIST spojuje výraznou siluetu, nerezové provedení a jemné mlžení v jednom architektonickém prvku.',
    useCases: ['Náměstí', 'Parky', 'Dětské zóny', 'Architektonické projekty'],
  },
  'mlzitko-steblo': {
    tagline: 'Štíhlé mlžítko inspirované přírodou',
    intro: 'STÉBLO® pracuje s lehkou organickou siluetou a umožňuje citlivé začlenění do zeleně, promenád i veřejného prostoru.',
    useCases: ['Parky', 'Zahrady', 'Promenády', 'Veřejná zeleň'],
  },
  'mlzitko-mrak': {
    tagline: 'Mlžný oblak pro hravá a pobytová místa',
    intro: 'MLŽNÝ MRAK® vytváří prostorový efekt jemné vodní mlhy pro parky, hřiště, školní areály a veřejná prostranství.',
    useCases: ['Dětská hřiště', 'Parky', 'Školní areály', 'Veřejný prostor'],
  },
  'mlzna-spirála': {
    tagline: 'Skulpturální spirála s mlžným efektem',
    intro: 'MLŽNÁ SPIRÁLA kombinuje nerezovou sochařskou formu s ochlazením a možností výrazného večerního působení.',
    useCases: ['Parky', 'Náměstí', 'Eventy', 'Zážitkové instalace'],
  },
  'ostrev-mlzitko': {
    tagline: 'Organické stromové mlžítko se sedmi rameny',
    intro: 'OSTREV je výrazná vícearmenná mlžná socha pro rovnoměrné osvěžení větších veřejných a pobytových prostor.',
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
    ['Dětské hřiště', 'kompaktní provedení', 'Konfigurace pro dětské a školní areály.'],
    ['Velký', 'větší mlžná zóna', 'Konfigurace pro mlžiště a větší pobytové plochy.'],
    ['Parkový', 'otevřený prostor', 'Řešení určené pro parkové a promenádní prostředí.'],
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
