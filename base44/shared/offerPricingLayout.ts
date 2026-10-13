import { SUPLA_OFFER } from './suplaOfferLayout.ts';
export function drawOfferPriceRows(doc, c, api, title, compact = false) {
  const { header, text, image, money, ink, soft, accent, mute } = api;
  let y = header(doc, c, title, c.clientCompany || c.clientName);
  if (!compact) {
    image(doc, c.productImg || c.scenes?.[0]?.img, 14, y, 54, 39);
    text(doc, c.productName, 75, y + 8, 121, 15, true, ink);
    text(doc, c.product?.short_description || 'Dodavka mlzitka ve zvolenem provedeni. SUPLA je volitelne.', 75, y + 20, 121, 9, false, mute);
    y += 47;
  }
  const tableHeader = () => {
    doc.setFillColor(ink); doc.rect(14, y, 182, 10, 'F');
    text(doc, 'PRODUKT', 18, y + 7, 44, 8, true, '#FFFFFF');
    text(doc, 'POPIS / ROZSAH DODAVKY', 65, y + 7, 87, 8, true, '#FFFFFF');
    text(doc, 'CENA BEZ DPH', 155, y + 7, 39, 7, true, '#FFFFFF'); y += 10;
  };
  tableHeader();
  c.lines.forEach((row, i) => {
    const description = String(row.description || (i === 0 ? c.product?.short_description || 'Nerezove mlzitko dle zvolene varianty. Bez chytreho rizeni SUPLA.' : 'Rozsah dle potvrzene polozky.')).replace(/<[^>]*>/g, ' ').slice(0, 220);
    // Measure using the same ASCII conversion/font as the renderer.
    doc.setFontSize(8);
    const height = Math.max(19, doc.splitTextToSize(api.pt(description), 85).length * 3.8 + 8, doc.splitTextToSize(api.pt(row.label), 43).length * 3.8 + 12);
    if (y + height > 250) { doc.addPage(); y = header(doc, c, title + ' / pokracovani'); tableHeader(); }
    doc.setFillColor(soft); doc.rect(14, y, 182, height, 'F');
    text(doc, row.label, 18, y + 6, 43, 8, true, ink);
    text(doc, `${row.quantity || 1} ${row.unit || 'ks'}`, 18, y + height - 4, 43, 7, false, mute);
    text(doc, description, 65, y + 6, 85, 8, false, mute);
    text(doc, money(row.total), 155, y + 7, 38, 9, true, accent); y += height + 2;
  });
  if (y + 27 > 270) { doc.addPage(); y = header(doc, c, 'Zakladni cenova rekapitulace'); }
  y = text(doc, `Zakladni dodavka bez DPH: ${money(c.total)}`, 14, y + 8, 182, compact ? 12 : 15, true, accent);
  if (c.total > 0) y = text(doc, `DPH 21 %: ${money(Math.round(c.total * .21))} | S DPH: ${money(Math.round(c.total * 1.21))}`, 14, y + 3, 182, 9, false, mute);
  return y + 6;
}
export function drawOptionalControlSummary(doc, c, api, y, compact = false) {
  const { header, text, money, ink, soft, accent, mute } = api;
  const height = compact ? 64 : 86;
  if (y + height > (compact ? 191 : 270)) { doc.addPage(); y = header(doc, c, 'Volitelne chytre rizeni'); }
  y = text(doc, 'Mlzitko funguje i bez chytreho rizeni.', 14, y + 3, 182, compact ? 10 : 12, true, ink) + 3;
  y = text(doc, 'SUPLA neni podminkou nakupu ani soucasti zakladni ceny.', 14, y, 182, 8, false, mute) + 5;
  [false, true].forEach((shaft, i) => {
    const x = 14 + i * 94, total = shaft ? SUPLA_OFFER.withShaft : SUPLA_OFFER.base;
    doc.setFillColor(soft); doc.rect(x, y, 88, compact ? 30 : 40, 'F');
    text(doc, shaft ? 'B / Se servisni sachtou' : 'A / Bez servisni sachty', x + 5, y + 7, 78, 9, true, ink);
    text(doc, shaft ? '29 639 Kc rizeni + 18 900 Kc\noteviratelna zemni sachta' : 'Wi-Fi rizeni SUPLA, aplikace\na casove plany.', x + 5, y + 14, 78, 8, false, mute);
    text(doc, `${money(total)} bez DPH`, x + 5, y + (compact ? 27 : 31), 78, compact ? 10 : 12, true, accent);
  });
  y += compact ? 35 : 45;
  if (!compact && c.total > 0) y = text(doc, `Zaklad + A: ${money(c.total + SUPLA_OFFER.base)} | Zaklad + B: ${money(c.total + SUPLA_OFFER.withShaft)} bez DPH`, 14, y, 182, 9, true, ink) + 3;
  return text(doc, 'Vyberte jednu alternativu. Varianty se nesctaji ani automaticky nepricitaji.', 14, y, 182, 8, false, mute) + 4;
}