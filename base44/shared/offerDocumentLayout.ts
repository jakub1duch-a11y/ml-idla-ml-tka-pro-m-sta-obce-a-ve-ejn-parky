import QRCode from 'npm:qrcode@1.5.4';
import { pt } from './pdfHelpers.ts';
import { drawSuplaOfferPages } from './suplaOfferLayout.ts';
import { drawOfferPriceRows, drawOptionalControlSummary } from './offerPricingLayout.ts';
export const GREEN = '#007ACB', SOFT = '#EAF6FC', INK = '#071A2F', MUTE = '#607789', WHITE = '#F5FAFD';
const money = v => Number(v) > 0 ? `${new Intl.NumberFormat('cs-CZ').format(Number(v))} Kc` : 'K individualnimu naceneni';
const text = (doc, value, x, y, width = 182, size = 10, bold = false, color = INK) => {
  doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setFontSize(size); doc.setTextColor(color);
  const lines = doc.splitTextToSize(pt(String(value || '').replace(/[–—−]/g, '-').replace(/[µμ]/g, 'u').replace(/\u00a0/g, ' ')), width);
  doc.text(lines, x, y, { lineHeightFactor: 1.35 });
  return y + lines.length * size * 0.3528 * 1.35;
};
function header(doc, ctx, title, subtitle = '') {
  doc.setFillColor(WHITE); doc.rect(0, 0, 210, 297, 'F');
  if (ctx.brandLogo) image(doc, ctx.brandLogo, 14, 8, 42, 14);
  else text(doc, 'MLZIDLA.cz', 14, 17, 110, 15, true);
  text(doc, 'by HolmTec', 151, 17, 45, 8, false, MUTE);
  doc.setDrawColor('#D6EAF3'); doc.line(14, 27, 196, 27);
  doc.setFillColor('#00B7FF'); doc.rect(14, 34, 13, 1.2, 'F');
  let y = text(doc, title, 14, 48, 182, 27, true);
  if (subtitle) y = text(doc, subtitle, 14, y + 3, 182, 11, false, GREEN);
  text(doc, `${ctx.quoteNum || ''}  /  ${doc.getNumberOfPages()}`, 14, 289, 182, 7, false, MUTE);
  return y + 9;
}
function image(doc, img, x, y, w, h) {
  doc.setFillColor(SOFT); doc.rect(x, y, w, h, 'F');
  if (!img) { text(doc, 'Vizualizace k doplneni', x + 6, y + h / 2, w - 12, 9, false, MUTE); return; }
  const p = doc.getImageProperties(img.data), scale = Math.min(w / p.width, h / p.height);
  const dw = p.width * scale, dh = p.height * scale;
  doc.addImage(img.data, img.format, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh, undefined, 'FAST');
}
export function drawCoverPage(doc, c) {
  header(doc, c, c.productName, 'CESKA NEREZOVA MLZITKA / PRODUKTOVA NABIDKA');
  image(doc, c.scenes?.[0]?.img || c.productImg || c.imgs[0], 0, 72, 210, 158);
  doc.setFillColor(INK); doc.rect(0, 230, 210, 28, 'F');
  text(doc, c.product?.short_description || 'Nerezove reseni pro verejny i soukromy prostor.', 14, 241, 182, 11, true, WHITE);
  text(doc, c.clientName, 14, 269, 120, 12, true);
  if (c.clientCompany && c.clientCompany !== c.clientName) text(doc, c.clientCompany, 14, 277, 120, 8, false, MUTE);
  text(doc, 'Mlzitko funguje i bez SUPLA.', 139, 269, 57, 9, true, GREEN);
  text(doc, 'Chytre rizeni je volitelne.', 139, 279, 57, 8, false, MUTE);
}
export function drawSolutionPage(doc, c) {
  let y = header(doc, c, 'Reseni pro vas prostor', c.productName);
  const top = y;
  image(doc, c.scenes?.[0]?.img || c.imgs[0], 14, top, 87, 102);
  let right = text(doc, 'ZADANI', 109, top + 5, 87, 9, true, GREEN) + 3;
  right = text(doc, c.goal, 109, right, 87, 9, false, INK) + 7;
  right = text(doc, 'NAVRH RESENI', 109, right, 87, 9, true, GREEN) + 3;
  right = text(doc, c.solution, 109, right, 87, 9, false, INK);
  y = Math.max(top + 112, right + 10);
  if (y + 60 > 276) { doc.addPage(); y = header(doc, c, 'Reseni / detaily'); }
  const shots = c.scenes?.length ? c.scenes : c.imgs.filter(Boolean).map(img => ({img}));
  shots.slice(0, 3).forEach((s, i) => image(doc, s.img, 14 + i * 62, y, 58, 48));
  text(doc, 'Koncepcni navrh. Umisteni, kotveni a pripojeni potvrzuje technik pred realizaci.', 14, y + 57, 182, 9, false, MUTE);
}
export function drawTechPage(doc, c) {
  let y = header(doc, c, 'Technicke informace', c.productName);
  const top = y, p = c.product || {};
  image(doc, c.productImg || c.imgs[0], 108, top, 88, 157);
  for (const [label, value] of [['Material', p.material], ['Pracovni tlak', p.pressure], ['Spotreba vody', p.water_consumption], ['Velikost kapek', p.micron_size], ['Pokryti', p.coverage_area], ['Napajeni', p.power_supply]]) {
    doc.setFillColor(SOFT); doc.rect(14, y - 3, 87, 23, 'F');
    text(doc, label.toUpperCase(), 18, y + 3, 78, 8, true, GREEN);
    text(doc, value || 'K technickemu overeni', 18, y + 10, 78, 9, false, INK); y += 26;
  }
  text(doc, 'Produktova fotografie, nikoli vykres s kotami. Technicke hodnoty neodvozujeme z vizualizace. Kotveni, privod vody a servisni pristup vyzaduji projektovou kontrolu.', 14, Math.max(y, top + 157) + 8, 182, 9, false, MUTE);
}
export function drawPlacementPage(doc, c) {
  const scenes = c.scenes?.length ? c.scenes : c.imgs.filter(Boolean).map((img, i) => ({ img, title: `Vizualizace ${i + 1}`, caption: 'Koncepcni vizualizace ke kontrole' }));
  const groups = scenes.length ? scenes : [{ img: null, title: 'Navrh umisteni', caption: 'Vizualizace k doplneni' }];
  for (let i = 0; i < groups.length; i += 2) {
    if (i) doc.addPage();
    const y = header(doc, c, 'Produkt v prostoru', 'Puvodni produktove podklady / bez zmeny konstrukce');
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
  drawSuplaOfferPages(doc, c, { header, text, image, diagram, money });
}
const priceApi = { header, text, image, money, pt, ink: INK, soft: SOFT, accent: GREEN, mute: MUTE };
function priceRows(doc, c, title, compact = false) {
  return drawOfferPriceRows(doc, c, priceApi, title, compact);
}
export function drawPricePage(doc, c) {
  let y = priceRows(doc, c, 'Produkt. Popis. Cena.');
  y = drawOptionalControlSummary(doc, c, priceApi, y);
  if (y + 22 > 270) { doc.addPage(); y = header(doc, c, 'Rozsah ceny'); }
  y = text(doc, 'Rozhodujici je rozsah uvedenych polozek. Volitelne SUPLA varianty nejsou automaticky pricteny. Doprava, montaz, vykopy a stavebni prace nejsou zahrnuty; nacenime je po overeni mista.', 14, y + 5, 182, 10, false, MUTE) + 7;
  if (c.pricingNote) y = text(doc, c.pricingNote, 14, y, 182, 9, false, MUTE) + 7;
  if (c.alternatives?.length) {
    y = text(doc, 'Cenove usporne alternativy (1 ks, bez DPH)', 14, y, 182, 13, true, GREEN) + 5;
    for (const alternative of c.alternatives) y = text(doc, `${alternative.label}: ${money(alternative.total)}`, 14, y, 182, 10) + 4;
    text(doc, 'Alternativni produkty se nesctaji s doporucenym resenim.', 14, y, 182, 9, false, MUTE);
  }
}
export function drawDarkHeroPage(doc, c) {
  doc.setFillColor(INK); doc.rect(0, 0, 210, 297, 'F');
  image(doc, c.scenes?.[3]?.img || c.imgs[1] || c.imgs[0], 0, 0, 210, 249);
  text(doc, c.productName, 14, 266, 182, 24, true, WHITE);
  text(doc, 'Puvodni produktovy podklad / technicke provedeni k potvrzeni', 14, 280, 182, 9, false, '#B8C6CE');
}
export function drawPhotoHeroPage(doc, c) {
  const y = header(doc, c, 'Produktovy pohled', c.productName);
  image(doc, c.scenes?.[4]?.img || c.imgs[2] || c.imgs[0], 0, y, 210, 279 - y);
}
export function drawRecapPage(doc, c) {
  let y = priceRows(doc, c, 'Shrnuti nabidky', true);
  y = drawOptionalControlSummary(doc, c, priceApi, y, true);
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