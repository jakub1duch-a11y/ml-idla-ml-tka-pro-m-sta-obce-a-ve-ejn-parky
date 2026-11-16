import { buildOfferInstallationControlSummary } from './offerInstallationControl.mjs';

// Separate offer sheet: compare simple interval timer and optional SUPLA app.
// Hardware, shaft and installation costs are NOT inferred from old catalog numbers.
export function drawSuplaOfferPages(doc, c, { header, text, image, money }) {
  const ink = '#071A2F', accent = '#007ACB', soft = '#EAF6FC';
  const summary = buildOfferInstallationControlSummary({ product: c.product, supla: c.supla });
  const [basic, smart] = summary.control_modes;
  const priceLabel = (mode) => mode.price_ex_vat === null
    ? 'K individualnimu naceneni'
    : `${money(mode.price_ex_vat)} bez DPH`;
  const note = (message, y, height = 29) => {
    doc.setFillColor(soft);
    doc.rect(14, y, 182, height, 'F');
    text(doc, message, 19, y + 7, 172, 9, false, ink);
  };
  let y = header(doc, c, 'Rizeni mlzeni', 'INTERVALY BEZ APLIKACE / VOLITELNA SUPLA APP');

  text(doc, 'Dve moznosti automatickeho provozu', 14, y + 2, 182, 17, true, ink);
  y += 20;

  for (const [index, mode] of [basic, smart].entries()) {
    const cardH = 60;
    doc.setFillColor(soft); doc.rect(14, y, 182, cardH, 'F');
    text(doc, index === 0 ? 'A / Intervaly bez mobilni aplikace' : 'B / Chytre ovladani SUPLA', 19, y + 10, 172, 13, true, ink);
    text(
      doc,
      index === 0
        ? 'Mistni casovac ovlada cas mlzeni a pauzy. Je treba overit kompatibilni ventil, ovladani a napajeni.'
        : 'Zapnuti a casove plany pres aplikaci. Funkce zavisi na modulu, ventilu, napajeni a konektivite.',
      19, y + 21, 171, 10, false, ink
    );
    text(doc, priceLabel(mode), 19, y + 50, 172, 11, true, accent);
    y += cardH + 7;
  }
  note('Rizeni je volitelne. Neni automaticky v zakladni cene mlzitka. Vybrane varianty nelze scitat.', y + 3, 31);
  y += 43;
  text(doc, 'Pouziti v konkretnim prostoru', 14, y, 182, 13, true, accent);
  y += 8;
  text(doc, 'Vystup z trysek ovlivnuje slunce, vitr a vlhkost. Nizkotlake mlzitko nedoporucujeme instalovat primo mezi stoly nebo lavicky.', 14, y, 182, 10, false, ink);

  doc.addPage();
  y = header(doc, c, 'Chytra aplikace SUPLA', 'VOLITELNE RIDICI RESENI PODLE KONFIGURACE');
  image(doc, c.suplaVisuals?.valve || c.suplaImage, 14, y, 182, 91);
  y += 99;
  text(doc, 'Mobilni ovladani a casove plany', 14, y, 182, 16, true, ink);
  y += 13;
  text(doc, 'Vzdaleny pristup vyzaduje funkcni pripojeni. Pripojeni teplotnich cidel, vodomeru nebo prutokoveho snimace je volitelne a musi odpovidat skutecne sestave.', 14, y, 182, 10, false, ink);
  y += 33;
  note('Cena technologie: ' + priceLabel(smart) + '. Dalsi moduly, sachta a montaz nejsou automaticky soucasti teto polozky.', y, 33);
  y += 41;
  text(doc, 'Vizualizace hardwaru je pouze ilustracni. Skutecne prvky a provedeni potvrdi technik pred realizaci.', 14, y, 182, 9, false, accent);
}
