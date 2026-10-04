import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { jsPDF } from 'npm:jspdf@4.0.0';
import { OFFER_SECTIONS, OFFER_STANDARD_KEY, OFFER_STANDARD_VERSION, SUPPLIER, MISSING_DATA_LABEL, MANUAL_PRICE_LABEL, formatCzk, computeTotals, validUntil, missingRequiredSections } from '../../shared/offerB2gStructure.ts';

const toBase64 = (bytes) => { let binary = ''; bytes.forEach((byte) => { binary += String.fromCharCode(byte); }); return btoa(binary); };
const STEEL = '#0D2F4F'; const BLUE = '#0B5EA8'; const INK = '#192A32'; const MUTED = '#5B6C74'; const LIGHT = '#EAF5FB'; const WHITE = '#FFFFFF';
const W = 210; const M = 18; const CW = 174; const BOTTOM = 272;

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const { client = {}, content = {}, quote_number, product_name } = await req.json();
    if (!client.name) return Response.json({ error: 'client.name required' }, { status: 400 });

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const fontResponse = await fetch('https://github.com/google/fonts/raw/main/ofl/notosans/NotoSans%5Bwdth,wght%5D.ttf');
    if (!fontResponse.ok) throw new Error('Czech font could not be loaded');
    doc.addFileToVFS('NotoSans.ttf', toBase64(new Uint8Array(await fontResponse.arrayBuffer())));
    doc.addFont('NotoSans.ttf', 'NotoSans', 'normal', 'Identity-H');
    doc.setFont('NotoSans', 'normal');

    const issued = new Date(); const valid = validUntil(issued);
    const quoteNumber = quote_number || `ML-${issued.getFullYear()}-${String(Date.now()).slice(-5)}`;
    let page = 1; let y = 0;

    const header = () => {
      doc.setFillColor(STEEL); doc.rect(0, 0, W, 30, 'F'); doc.setFillColor(BLUE); doc.rect(0, 30, W, 2, 'F');
      doc.setTextColor(WHITE); doc.setFontSize(16); doc.text('MLŽIDLA®', M, 14);
      doc.setFontSize(7); doc.setTextColor('#BEE2E4'); doc.text('ARCHITEKTONICKÉ MLŽICÍ SYSTÉMY · HOLMTEC S.R.O.', M, 20);
      doc.setTextColor(WHITE); doc.setFontSize(8); doc.text(`PROJEKTOVÝ NÁVRH A CENOVÁ NABÍDKA ${quoteNumber}`, W - M, 14, { align: 'right' });
      doc.setTextColor('#BEE2E4'); doc.setFontSize(7); doc.text(`Vystaveno ${issued.toLocaleDateString('cs-CZ')} · Platnost do ${valid.toLocaleDateString('cs-CZ')}`, W - M, 20, { align: 'right' });
      doc.setDrawColor('#D5E1E2'); doc.line(M, 282, W - M, 282);
      doc.setTextColor(MUTED); doc.setFontSize(7); doc.text(`${SUPPLIER.name} · ${SUPPLIER.contact} · ${SUPPLIER.phone} · ${SUPPLIER.email}`, M, 288);
      doc.text(`Strana ${page} · standard ${OFFER_STANDARD_KEY} v${OFFER_STANDARD_VERSION}`, W - M, 288, { align: 'right' });
      y = 42;
    };
    const ensure = (needed) => { if (y + needed > BOTTOM) { doc.addPage(); page += 1; header(); } };
    const paragraph = (text, size = 9, color = INK) => {
      const lines = doc.splitTextToSize(String(text), CW); doc.setFontSize(size); doc.setTextColor(color);
      lines.forEach((line) => { ensure(size * 0.55); doc.text(line, M, y); y += size * 0.55; });
    };
    const sectionTitle = (index, label) => {
      ensure(18); doc.setFillColor(LIGHT); doc.rect(M, y, CW, 9, 'F'); doc.setFillColor(BLUE); doc.rect(M, y, 1.5, 9, 'F');
      doc.setTextColor(STEEL); doc.setFontSize(9); doc.text(`${String(index).padStart(2, '0')}  ${label.toUpperCase()}`, M + 5, y + 6); y += 14;
    };
    const tableRow = (cells, widths, fill) => {
      const cellLines = cells.map((cell, i) => doc.splitTextToSize(String(cell ?? ''), widths[i] - 4));
      const height = Math.max(...cellLines.map((lines) => lines.length)) * 4.6 + 3;
      ensure(height); if (fill) { doc.setFillColor('#F6FAFC'); doc.rect(M, y, CW, height, 'F'); }
      let x = M; doc.setFontSize(8);
      cellLines.forEach((lines, i) => { doc.setTextColor(i === 0 ? STEEL : INK); doc.text(lines, x + 2, y + 4.6); x += widths[i]; });
      y += height;
    };

    header();
    doc.setTextColor(STEEL); doc.setFontSize(20); doc.text(product_name ? `Ochlazení prostoru — ${product_name}` : 'Projektový návrh ochlazení veřejného prostoru', M, y); y += 10;
    doc.setTextColor(MUTED); doc.setFontSize(9);
    doc.text(`Pro: ${client.name}${client.company ? ` · ${client.company}` : ''}${client.location ? ` · ${client.location}` : ''}`, M, y); y += 5;
    if (client.email || client.phone) { doc.text([client.email, client.phone].filter(Boolean).join(' · '), M, y); y += 5; }
    y += 6;

    const totals = computeTotals(content.variants || []);

    for (const [i, section] of OFFER_SECTIONS.entries()) {
      const data = content[section.key];
      sectionTitle(i + 1, section.label);
      if (section.type === 'text') { paragraph(data || (section.required ? MISSING_DATA_LABEL : 'Není součástí této nabídky.')); }
      if (section.type === 'zones') {
        const zones = Array.isArray(data) ? data : [];
        if (!zones.length) paragraph(MISSING_DATA_LABEL);
        else { tableRow(['Zóna', 'Umístění', 'Řešení', 'Odůvodnění'], [30, 44, 44, 56], true); zones.forEach((z, k) => tableRow([z.zone, z.location, z.solution, z.reason], [30, 44, 44, 56], k % 2 === 1)); }
      }
      if (section.type === 'rows') {
        const rows = Array.isArray(data) ? data : [];
        if (!rows.length) paragraph(MISSING_DATA_LABEL);
        else rows.forEach((r, k) => tableRow([r.label, r.value || MISSING_DATA_LABEL], [60, 114], k % 2 === 1));
      }
      if (section.type === 'variants') {
        const variants = Array.isArray(data) ? data : [];
        if (!variants.length) paragraph(MANUAL_PRICE_LABEL);
        else {
          tableRow(['Varianta', 'Produkt', 'Ks', 'Cena/ks bez DPH', 'Celkem bez DPH'], [44, 56, 14, 30, 30], true);
          variants.forEach((v, k) => tableRow([`${v.label}${v.recommended ? ' ★ doporučeno' : ''}`, v.product_name, v.quantity, formatCzk(v.unit_price), formatCzk(v.total_price)], [44, 56, 14, 30, 30], k % 2 === 1));
        }
      }
      if (section.type === 'summary') {
        paragraph(totals.recommended ? `Rekapitulace — ${totals.recommended.label}` : 'Rekapitulace', 8, MUTED);
        tableRow(['Cena bez DPH', formatCzk(totals.base)], [120, 54], true);
        tableRow(['DPH 21 %', formatCzk(totals.vat)], [120, 54], false);
        tableRow(['Celkem s DPH', formatCzk(totals.withVat)], [120, 54], true);
        if (data) paragraph(data);
      }
      if (section.type === 'images') {
        const urls = Array.isArray(data) ? data.filter(Boolean).slice(0, 4) : [];
        if (!urls.length) paragraph('Vizualizace budou doplněny po schválení konceptu.');
        for (const url of urls) {
          try {
            const res = await fetchImage(url); ensure(88);
            doc.addImage(res.dataUrl, res.type, M, y, CW, 84); y += 88;
          } catch (_) { paragraph(`Vizualizace: ${url}`, 7, MUTED); }
        }
      }
      y += 6;
    }

    const missing = missingRequiredSections(content);
    const output = new Uint8Array(doc.output('arraybuffer'));
    return Response.json({ pdf_base64: toBase64(output), filename: `MLZIDLA-nabidka-${quoteNumber}.pdf`, quote_number: quoteNumber, valid_until: valid.toISOString(), missing_required_sections: missing, standard: `${OFFER_STANDARD_KEY} v${OFFER_STANDARD_VERSION}` });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}

async function fetchImage(url) {
  const response = await fetch(url);
  const bytes = new Uint8Array(await response.arrayBuffer());
  const mime = response.headers.get('content-type') || 'image/jpeg';
  return { dataUrl: `data:${mime};base64,${toBase64(bytes)}`, type: mime.includes('png') ? 'PNG' : 'JPEG' };
}