export const CITY_ARC_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/82914bed5_C-MlzitkoLINEA_CE70_couple1.png';

export const CITY_ARC_VARIANTS = [
  { id: 'arc-3', name: 'CITY Arc 3', nozzles: 3, height: '2 700 mm', width: '800 mm', price: 29900 },
  { id: 'arc-4', name: 'CITY Arc 4', nozzles: 4, height: '3 200 mm', width: '1 200 mm', price: 34900 },
  { id: 'arc-5', name: 'CITY Arc 5', nozzles: 5, height: '3 700 mm', width: '1 600 mm', price: 39900 },
];

export const CITY_ARC_ACCESSORIES = [
  { id: 'valve', name: 'Solenoidový ventil', detail: '24 V pro automatické spínání', price: 1090 },
  { id: 'anchor', name: 'Kotva do země', detail: 'Stabilní montáž do podkladu', price: 1490 },
  { id: 'extension', name: 'Prodlužovací trubka', detail: 'Nerez AISI 316L · 500 mm', price: 890 },
];

export const formatPrice = (price) => new Intl.NumberFormat('cs-CZ').format(price);