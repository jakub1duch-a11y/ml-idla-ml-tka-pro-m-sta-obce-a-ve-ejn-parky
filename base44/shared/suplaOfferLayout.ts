import { SUPLA_VISUALS } from './suplaOfferVisuals.ts';
export const SUPLA_OFFER = { base: 29639, shaft: 18900, withShaft: 48539, image: SUPLA_VISUALS.valve };

export function drawSuplaOfferPages(doc, c, { header, text, image, money }) {
  const ink = '#071A2F', cyan = '#007ACB', pale = '#EAF6FC';
  const note = (value, y) => { doc.setFillColor(pale); doc.rect(14, y, 182, 23, 'F'); text(doc, value, 19, y + 7, 172, 9, false, ink); };
  let y = header(doc, c, 'Chytre rizeni SUPLA', 'WI-FI / MOBILNI APLIKACE / VOLITELNA AUTOMATIZACE');
  image(doc, c.suplaVisuals?.valve || c.suplaImage, 14, y, 182, 102); y += 110;
  y = text(doc, 'Ventil, moduly a aplikace. Jedna provozni vrstva.', 14, y, 182, 16, true, ink) + 4;
  y = text(doc, 'Zapnuti a vypnuti odkudkoli pri dostupnem internetu. Casove plany podle vyuziti prostoru. Senzory teploty a prutoku pouze s potvrzenou vybavou.', 14, y, 182, 10, false, ink) + 7;
  note(`Bez sachty: ${money(SUPLA_OFFER.base)}. Se sachtou: ${money(SUPLA_OFFER.withShaft)}. Ceny bez DPH, volitelne alternativy.`, y);
  text(doc, 'AI vizualizace technologie, nikoli presny model hardware ani montazni dokumentace.', 14, y + 31, 182, 8, false, cyan);
  doc.addPage(); y = header(doc, c, 'Moduly. Provoz. Prehled.', 'SUPLA / CHYTRY VENTIL / APP');
  image(doc, c.suplaVisuals?.modules || c.suplaImage, 14, y, 182, 86); y += 95;
  const benefits = [['Ovladani v aplikaci', 'Zapnuti a vypnuti pri dostupnem internetu.'], ['Casove scenare', 'Provozni okna a cykly podle vyuziti prostoru.'], ['Servisni pristup', 'Kontrola komponent a sezonni udrzba.'], ['Volitelna cidla', 'Teplota a prutok podle potvrzene konfigurace.']];
  benefits.forEach(([title, body], i) => {
    const x = 14 + (i % 2) * 94, top = y + Math.floor(i / 2) * 33;
    doc.setFillColor(pale); doc.rect(x, top, 88, 28, 'F');
    doc.setDrawColor(cyan); doc.circle(x + 7, top + 8, 3, 'S');
    text(doc, title, x + 14, top + 10, 70, 10, true, ink);
    text(doc, body, x + 5, top + 18, 78, 8, false, ink);
  });
  note('Overime vodu, Wi-Fi, internet, bezpecne napajeni a zazimovani. Zobrazeny hardware je ilustracni; rozsah dodavky urcuji potvrzene polozky.', y + 72);
  for (const shaft of [false, true]) {
    doc.addPage(); const total = shaft ? SUPLA_OFFER.withShaft : SUPLA_OFFER.base;
    y = header(doc, c, shaft ? 'Varianta B / servisni sachta' : 'Varianta A / chytry ventil', shaft ? 'CHYTRA TECHNOLOGIE POD POVRCHEM' : 'WI-FI A APP V CHRANENEM SERVISNIM PROSTORU');
    image(doc, shaft ? c.suplaVisuals?.shaft || c.suplaImage : c.suplaVisuals?.valve || c.suplaImage, 14, y, 182, 84); y += 90;
    text(doc, 'Koncepcni vizualizace. Hardware a rozvod potvrdi technik pred realizaci.', 14, y, 182, 8, false, cyan); y += 10;
    const rows = [['Rizeni SUPLA / Wi-Fi / aplikace', SUPLA_OFFER.base], ...(shaft ? [['Servisni sachta / box', SUPLA_OFFER.shaft]] : [])];
    for (const [label, price] of rows) { doc.setFillColor(pale); doc.rect(14, y, 182, 15, 'F'); text(doc, label, 19, y + 9, 112, 10, false, ink); text(doc, money(price), 143, y + 9, 48, 11, true, cyan); y += 18; }
    y = text(doc, `Automatizace: ${money(total)} bez DPH`, 14, y + 5, 182, 15, true, cyan) + 3;
    if (c.total > 0) y = text(doc, `Produkt + varianta ${shaft ? 'B' : 'A'}: ${money(c.total + total)} bez DPH`, 14, y, 182, 10, true, ink) + 6;
    note('Volitelne alternativy se nesctaji. Doprava, vykopy, stavebni prace, montaz v miste a dalsi senzory nejsou zahrnuty.', Math.min(y, 252));
  }
}