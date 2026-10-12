// GATE70 — vysokotlaká mlžná brána. Prezentační nastavení scény a animace.
// Tlak, počet trysek a rychlost částic lze upravit zde — všechny hodnoty se propíší do 3D scény.

export const CONFIG = {
  NOZZLE_COUNT: 12,           // Počet mlžících trysek podél vnitřního oblouku brány
  WATER_PRESSURE: 70,         // Provozní tlak v barech (high-pressure mist)
  PARTICLE_SIZE: 0.016,       // Velikost bodového sprite ve scéně (mikro-kapka)
  PARTICLE_OPACITY: 0.03,     // Extrémně nízká viditelnost — jemný závoj, ne kouř
  PARTICLES_DESKTOP: 5000,    // Počet částic na desktopu
  PARTICLES_MOBILE: 1400,     // Počet částic na mobilu
  JET_SPEED: 0.28,            // Rychlost střiku z trysek (mapováno na scroll)
  JET_LENGTH: 1.35,           // Maximální délka střiku z mlžítka
  CONE_SPREAD: 0.14,          // Rozptyl kužele střiku
  SCROLL_DISTANCE: 6000,     // Celková výška scroll-sekce v px (čím více, tím pomalejší animace)
  RAINBOW_START: 0.42,        // Scroll pozice, kdy se objevuje duhový rozptyl
  RAINBOW_END: 0.62,          // Scroll pozice, kdy duhový rozptyl mizí
  EVAPORATION_START: 0.72,    // Scroll pozice, kdy mlha začíná odpařovat
  EXPLODE_START: 0.08,        // Scroll pozice, kdy se technologie rozkládá
  EXPLODE_END: 0.26,          // Scroll pozice, kdy se technologie skládá zpět
};

// Čtyři fáze scroll-driven vyprávění
export const STAGES = [
  ['01', 'Průchod do jiného mikroklimatu.', 'Architektonická nerezová brána. Čistá geometrie a jemná vodní mlha pro příjemnější městský prostor.'],
  ['02', 'Jemný závoj osvěžení.', 'Trysky míří dovnitř průchodu. Částice proudí do prostoru, nestoupají jako kouř — stříkají pod tlakem 70 barů.'],
  ['03', 'Světlo ve vodní mlze.', 'Barevný rozptyl názorně přibližuje optický efekt mikro-kapek. Duha vznikající ve vodní tříšti.'],
  ['04', 'Prostor znovu dýchá.', 'Mlžení utichá. Voda se okamžitě odpaří bez zanechání stop — prostor získá úlevu.'],
];

// Produktové fotografie pro Atlas sekci
export const PHOTOS = [
  {url:'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/17e1fc843_MlznabranaGATE70U.png',title:'GATE70-U · městský prostor',kind:'Produktová vizualizace'},
  {url:'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/7687747c7_MlznabranaGATE70V.png',title:'GATE70-V · průchod krajinou',kind:'Produktová vizualizace'},
  {url:'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6a116eb0b_mlnbranaGATE70U-mlzitkapromesta.png',title:'Architektura a mlžná clona',kind:'Produktová vizualizace'},
  {url:'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/f47023cbe_MlnbrnaGATE70V.png',title:'Brána v pobytovém prostoru',kind:'Produktová vizualizace'},
  {url:'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/60dab9091_mlnbrnaGATE70V2.png',title:'Geometrie GATE70-V',kind:'Produktová vizualizace'},
  {url:'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/aa26eeb6a_Mltko_GATE_70U.png',title:'Geometrie GATE70-U',kind:'Produktová vizualizace'},
];

// Technické parametry pro datové panely
export const SPECS = [
  { code: '01', label: 'TLAK', value: '70', unit: 'bar', note: 'Vysokotlaké mlžení pro mikro-kapky 5–10 μm. Jemná mlha, která se okamžitě odpařuje.' },
  { code: '02', label: 'SPOTŘEBA', value: '0.12', unit: 'l/h', note: 'Spotřeba vody na jednu trysku při 70 bar. Úspora až 70 % oproti postřikovačům.' },
  { code: '03', label: 'KAPKA', value: '5–10', unit: 'μm', note: 'Mikro-kapky vodního aerosolu. Suché mlžení — bez zvlhčování povrchů.' },
  { code: '04', label: 'DOSAH', value: '3–5', unit: 'm', note: 'Chladicí dosah ochlazovací zóny od brány. Záleží na proudění vzduchu.' },
];

// Smart řízení — ekosystém a kompatibilita
export const SMART_MODES = [
  ['Teplotní automatika', 'Aktivace mlžení pouze při překročení nastavené venkovní teploty. Nejúčinnější režim pro městský prostor.', 'Teplotní senzor → prahová hodnota → řídicí modul → ventil → GATE70'],
  ['Časový plán', 'Provoz v definovaných intervalech během dne. Předvídatelný a úsporný režim pro pobytové zóny.', 'Časovač → harmonogram → řídicí modul → ventil → GATE70'],
  ['Pohybový senzor', 'Okamžitý start po aktivaci bezkontaktním senzorem kolemjdoucím. Mlžení jen když je prostor využíván.', 'PIR senzor → detekce přítomnosti → řídicí modul → ventil → GATE70'],
  ['Smart City API', 'Integrace s meteostanicí a chytrými prvky města. Individuálně ověřujeme kompatibilitu rozhraní.', 'Meteostanice / API → ověření kompatibility → řídicí modul → GATE70'],
  ['Měření spotřeby', 'Měření průtoku vody, historie provozu a vzdálený přehled v SUPLA Cloud. Datová vrstva pro obce.', 'Průtokoměr → SUPLA Cloud → dashboard → reporty → optimalizace'],
];

// Cenové segmenty
export const SEGMENTS = [
  { title: 'Města a obce', desc: 'Náměstí, promenády a veřejný prostor. Podklady pro rozhodování, rozsah instalace a provozní režim.', price: 'Individuální nabídka', cta: 'Vyžádat nabídku' },
  { title: 'Parky a hřiště', desc: 'Pobytové a průchozí zóny. Řešení přívodu vody, bezpečného umístění a sezónního provozu.', price: 'Individuální nabídka', cta: 'Vyžádat nabídku' },
  { title: 'Architekti', desc: 'Geometrie U nebo V, rozměry na míru, návaznost na povrchy a koncepční vizualizace.', price: 'Individuální nabídka', cta: 'Vyžádat nabídku' },
  { title: 'Pronájem na eventy', desc: 'Krátkodobý pronájem pro letní akce, festivaly a venkovní programy. Rychlá montáž a demontáž.', price: 'Od 15 000 Kč / den', cta: 'Poptat pronájem' },
];