import QRCode from 'npm:qrcode@1.5.4';
import { pt } from './pdfHelpers.ts';
export const GREEN = '#4f6b2e', SOFT = '#eef1e6', INK = '#111613', MUTE = '#4b524a', WHITE = '#fbfcf8';
const money = v => Number(v) > 0 ? `${new Intl.NumberFormat('cs-CZ').format(Number(v))} Kc` : 'K individualnimu naceneni';
const text = (doc, value, x, y, width = 182, size = 10, bold = false, color = INK) => {
  doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setFontSize(size); doc.setTextColor(color);
  const lines = doc.splitTextToSize(pt(value || ''), width);
  doc.text(lines, x, y, { lineHeightFactor: 1.35 });
  return y + lines.length * size * 0.3528 * 1.35;
};
function header(doc, ctx, title, subtitle = '') {
  doc.setFillColor(WHITE); doc.rect(0, 0, 210, 297, 'F');
  text(doc, 'MLZIDLA.cz', 14, 13, 120, 14, true);
  text(doc, 'by HolmTec', 14, 19, 120, 7, false, GREEN);
  doc.setDrawColor(GREEN); doc.line(14, 23, 196, 23);
  let y = text(doc, title, 14, 37, 182, 22, true);
  if (subtitle) y = text(doc, subtitle, 14, y + 3, 182, 11, false, GREEN);
  text(doc, `${ctx.quoteNum || ''}  |  ${doc.getNumberOfPages()}`, 14, 290, 182, 7, false, MUTE);
  return y + 8;
}
function image(doc, img, x, y, w, h) {
  doc.setFillColor(SOFT); doc.rect(x, y, w, h, 'F');
  if (!img) { text(doc, 'Vizualizace k doplneni', x + 6, y + h / 2, w - 12, 9, false, MUTE); return; }
  const p = doc.getImageProperties(img.data), scale = Math.min(w / p.width, h / p.height);
  const dw = p.width * scale, dh = p.height * scale;
  doc.addImage(img.data, img.format, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh, undefined, 'FAST');
}
export function drawCoverPage(doc, c) {
  let y = header(doc, c, 'Designova mlzitka.', 'Chytry provoz.');
  y = text(doc, c.productName, 14, y, 182, 18, true, GREEN);
  image(doc, c.scenes?.[0]?.img || c.imgs[0], 14, y + 4, 182, 146);
  y += 158;
  y = text(doc, c.clientCompany || c.clientName, 14, y, 182, 14, true);
  text(doc, 'Ceska nerezova reseni pro mesta, parky a zahrady. Koncept ke kontrole.', 14, y + 4, 182, 10, false, MUTE);
}
export function drawSolutionPage(doc, c) {
  let y = header(doc, c, 'Reseni pro vas prostor', c.productName);
  y = text(doc, c.goal, 14, y, 182, 10);
  y = text(doc, c.solution, 14, y + 5, 182, 10);
  image(doc, c.scenes?.[0]?.img || c.imgs[0], 14, Math.max(y + 5, 110), 182, 100);
  text(doc, 'Vizualizace je koncepcni navrh. Umisteni, kotveni a pripojeni potvrzuje technik pred realizaci.', 14, 230, 182, 10, false, MUTE);
}
export function drawTechPage(doc, c) {
  let y = header(doc, c, 'Technicke informace', c.productName);
  const p = c.product || {};
  for (const [label, value] of [['Material', p.material], ['Pracovni tlak', p.pressure], ['Spotreba vody', p.water_consumption], ['Velikost kapek', p.micron_size], ['Pokryti', p.coverage_area], ['Napajeni', p.power_supply]]) {
    y = text(doc, label, 14, y, 182, 11, true);
    y = text(doc, value || 'K technickemu overeni', 14, y + 1, 182, 10, false, MUTE) + 6;
  }
  text(doc, 'Technicke hodnoty nejsou odvozovany z fotografie. Kotveni, privod vody, ochrana elektroinstalace a servisni pristup vyzaduji projektovou kontrolu.', 14, y + 3, 182, 10, false, MUTE);
}
export function drawPlacementPage(doc, c) {
  const scenes = c.scenes?.length ? c.scenes : c.imgs.filter(Boolean).map((img, i) => ({ img, title: `Vizualizace ${i + 1}`, caption: 'Koncepcni vizualizace ke kontrole' }));
  const groups = scenes.length ? scenes : [{ img: null, title: 'Navrh umisteni', caption: 'Vizualizace k doplneni' }];
  for (let i = 0; i < groups.length; i += 2) {
    if (i) doc.addPage();
    const y = header(doc, c, 'Navrh umisteni', groups[i].source === 'client_space' ? 'Prostor klienta z ruznych uhlu' : 'Moznosti zacleneni do prostoru');
    groups.slice(i, i + 2).forEach((s, j) => {
      const top = y + j * 103;
      text(doc, s.title, 14, top, 182, 12, true, GREEN);
      image(doc, s.img, 14, top + 8, 182, 74);
      text(doc, s.caption, 14, top + 89, 182, 8, false, MUTE);
    });
  }
}
function diagram(doc, y, shaft) {
  doc.setFillColor(SOFT); doc.rect(14, y, 182, 42, 'F');
  if (shaft) { doc.setDrawColor(GREEN); doc.rect(44, y + 7, 123, 28, 'S'); text(doc, 'Servisni sachta (koncepcne)', 49, y + 12, 112, 7, false, GREEN); }
  const boxes = ['Privod vody', 'Filtr', 'SUPLA ventil', 'Mlzitko'];
  boxes.forEach((label, i) => {
    const x = 18 + i * 45;
    doc.setFillColor(WHITE); doc.rect(x, y + 18, 40, 12, 'F');
    text(doc, label, x + 3, y + 25, 35, 8, true);
    if (i < 3) { doc.setDrawColor(GREEN); doc.line(x + 40, y + 24, x + 45, y + 24); }
  });
}
export function drawSmartPage(doc, c) {
  let y = header(doc, c, 'Chytre rizeni SUPLA', 'Dve volitelne varianty provedeni');
  y = text(doc, 'Casove plany, ovladani z mobilu a volitelne senzory podle zvolene vybavy. Grafika je koncepcni schema, nikoli montazni dokumentace ani zive ovladani.', 14, y, 182, 10, false, MUTE) + 7;
  for (const shaft of [true, false]) {
    y = text(doc, shaft ? 'SUPLA se sachtou' : 'SUPLA bez sachty', 14, y, 182, 15, true, GREEN) + 3;
    diagram(doc, y, shaft); y += 50;
    y = text(doc, shaft ? 'Technologie v servisne pristupne sachte. Nutno overit odvodneni, ochranu proti zaplaveni, mrazu, signal a bezpecne napajeni.' : 'Technologie v chranenem servisnim prostoru nebo rozvadeci. Nutno overit kryti, privod vody, signal, napajeni a zazimovani.', 14, y, 182, 10);
    y = text(doc, 'Cena kompletni varianty: k individualnimu naceneni.', 14, y + 3, 182, 10, true) + 8;
  }
  text(doc, c.supla?.standard_price_ex_vat > 0 ? `Cenikovy zaklad rizeni SUPLA: ${money(c.supla.standard_price_ex_vat)} bez DPH. Nejde o cenu varianty se sachtou nebo bez sachty. Stavebni cast a sestava se nacenuji samostatne.` : 'Cenikovy zaklad neni dostupny. Cena, rozsah senzoru a konfigurace se potvrdi obchodnikem.', 14, y, 182, 9, false, MUTE);
}
function priceRows(doc, c, title) {
  let y = header(doc, c, title, c.clientCompany || c.clientName);
  for (const row of c.lines) {
    doc.setFontSize(10); const wrapped = doc.splitTextToSize(pt(row.label), 120);
    const height = Math.max(14, wrapped.length * 4.8 + 7);
    if (y + height > 255) { doc.addPage(); y = header(doc, c, `${title} - pokracovani`); }
    doc.setFillColor(SOFT); doc.rect(14, y - 4, 182, height, 'F');
    text(doc, row.label, 18, y + 2, 116, 10);
    text(doc, money(row.total), 143, y + 2, 49, 10, true, GREEN); y += height + 3;
  }
  if (y + 39 > 265) { doc.addPage(); y = header(doc, c, 'Cenova rekapitulace'); }
  y = text(doc, `Celkem bez DPH: ${money(c.total)}`, 14, y + 5, 182, 14, true, GREEN);
  if (c.total > 0) { y = text(doc, `DPH 21 %: ${money(Math.round(c.total * .21))}`, 14, y + 3, 182, 10); y = text(doc, `Celkem s DPH: ${money(Math.round(c.total * 1.21))}`, 14, y + 3, 182, 12, true); }
  return y;
}
export function drawPricePage(doc, c) {
  let y = priceRows(doc, c, 'Cenova nabidka');
  if (y + 22 > 270) { doc.addPage(); y = header(doc, c, 'Rozsah ceny'); }
  text(doc, 'Rozhodujici je rozsah uvedenych polozek. Volitelne SUPLA varianty nejsou automaticky pricteny. Neocenene polozky vyzaduji doplneni pred odeslanim.', 14, y + 5, 182, 10, false, MUTE);
}
export function drawDarkHeroPage(doc, c) { const y = header(doc, c, c.productName); image(doc, c.scenes?.[3]?.img || c.imgs[1] || c.imgs[0], 14, y, 182, 195); }
export function drawPhotoHeroPage(doc, c) { const y = header(doc, c, 'Vizualizace reseni', c.productName); image(doc, c.scenes?.[4]?.img || c.imgs[2] || c.imgs[0], 14, y, 182, 185); }
export function drawRecapPage(doc, c) {
  let y = priceRows(doc, c, 'Rekapitulace a podminky');
  const terms = `Platnost do ${c.validUntil}. Termin, platebni podminky a rozsah instalace budou potvrzeny. Vizualizace jsou koncepcni a vyzaduji kontrolu produktu a technicke proveditelnosti. Objednavku potvrdite po prihlaseni ve svem projektu; samotne otevreni odkazu nebo QR kodu neni objednavkou.`;
  doc.setFontSize(10); const height = doc.splitTextToSize(pt(terms), 182).length * 4.8 + 10;
  if (y + height > 190) { doc.addPage(); y = header(doc, c, 'Podminky a dalsi postup'); }
  text(doc, terms, 14, y + 6, 182, 10, false, MUTE);
  const url = 'https://mlzidla.cz/muj-projekt';
  doc.setFillColor(SOFT); doc.rect(14, 211, 182, 55, 'F');
  text(doc, 'Muj projekt', 20, 222, 126, 16, true, GREEN);
  text(doc, 'Sprava nabidky online a potvrzeni objednavky.', 20, 232, 126, 10);
  text(doc, 'mlzidla.cz/muj-projekt', 20, 244, 125, 11, true, GREEN);
  doc.link(20, 237, 125, 11, { url });
  text(doc, 'Prihlaste se uctem spojeneho klienta.', 20, 255, 126, 8, false, MUTE);
  const qr = QRCode.create(url, { errorCorrectionLevel: 'M' }), size = qr.modules.size, cell = 39 / (size + 8);
  doc.setFillColor('#ffffff'); doc.rect(151, 218, 39, 39, 'F'); doc.setFillColor('#000000');
  for (let r = 0; r < size; r++) for (let col = 0; col < size; col++) if (qr.modules.get(r, col)) doc.rect(151 + (col + 4) * cell, 218 + (r + 4) * cell, cell, cell, 'F');
  text(doc, 'Ing. Radek Meduna | HolmTec s.r.o.', 14, 276, 182, 10, true);
  text(doc, 'meduna@holmtec.cz | +420 774 700 390 | mlzidla.cz', 14, 283, 182, 9, false, MUTE);
}
export function buildOfferDocument(doc, c) {
  drawCoverPage(doc, c);
  for (const draw of [drawSolutionPage, drawTechPage, drawPlacementPage, drawSmartPage, drawPricePage, drawDarkHeroPage, drawPhotoHeroPage, drawRecapPage]) { doc.addPage(); draw(doc, c); }
}