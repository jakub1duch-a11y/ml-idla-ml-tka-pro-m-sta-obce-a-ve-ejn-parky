// Prezentační nastavení, nikoli výrobní specifikace nebo fyzikální výpočet.
export const CONFIG = {
  NOZZLE_COUNT: 8, // Ilustrační rozmístění; skutečný počet určuje projekt.
  WATER_PRESSURE: 5, // Ilustrační bod v katalogovém rozsahu 2–8 bar, nikoli 70 bar.
  PARTICLE_SIZE: 0.02, // Velikost bodu ve scéně, ne průměr kapky v metrech.
  PARTICLES_DESKTOP: 3600,
  PARTICLES_MOBILE: 1000,
  SCROLL_DISTANCE: 5000,
};
export const STAGES = [
  ['01', 'Nerez. Světlo. Voda.', 'Světlo odhaluje broušený povrch. Lesk je výtvarným zobrazením kontaktu kovu s vodou.'],
  ['02', 'Jemný závoj osvěžení.', 'Trysky míří dovnitř průchodu. Částice proudí do prostoru, nestoupají jako kouř.'],
  ['03', 'Světlo ve vodní mlze.', 'Barevný rozptyl názorně přibližuje optický efekt. Nejde o měřenou ani ray-tracing simulaci.'],
  ['04', 'Prostor znovu dýchá.', 'Mlžení utichá. Skutečné odpařování závisí na vlhkosti, teplotě, větru a nastavení trysek.'],
];
export const PHOTOS = [
 {url:'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/17e1fc843_MlznabranaGATE70U.png',title:'GATE70-U · městský prostor',kind:'Produktová vizualizace'},
 {url:'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/7687747c7_MlznabranaGATE70V.png',title:'GATE70-V · průchod krajinou',kind:'Produktová vizualizace'},
 {url:'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6a116eb0b_mlnbranaGATE70U-mlzitkapromesta.png',title:'Architektura a mlžná clona',kind:'Produktová vizualizace'},
 {url:'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/f47023cbe_MlnbrnaGATE70V.png',title:'Brána v pobytovém prostoru',kind:'Produktová vizualizace'},
 {url:'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/60dab9091_mlnbrnaGATE70V2.png',title:'Geometrie GATE70-V',kind:'Produktová vizualizace'},
 {url:'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/aa26eeb6a_Mltko_GATE_70U.png',title:'Geometrie GATE70-U',kind:'Produktová vizualizace'},
];