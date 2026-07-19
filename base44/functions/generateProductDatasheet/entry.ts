import { jsPDF } from 'npm:jspdf@4.0.0';
import { PDF, addBrandFooters, addProductImage, cleanText, drawBrandHeader, drawSectionTitle, ensureSpace, pdfBase64, registerCzechFonts } from '../../shared/pdfBrand.js';

Deno.serve(async (req) => {
  try {
    const { product } = await req.json();
    if (!product?.name) return Response.json({ error: 'Product data required' }, { status: 400 });
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    await registerCzechFonts(doc);
    drawBrandHeader(doc, 'TECHNICKÝ LIST', `Aktualizováno ${new Date().toLocaleDateString('cs-CZ')}`);

    let y = 53;
    doc.setTextColor(...PDF.cyan); doc.setFont('DejaVu', 'bold'); doc.setFontSize(7.5); doc.text('PRODUKTOVÝ SHEET · TECHNICKÉ PARAMETRY', PDF.margin, y);
    y += 9; doc.setTextColor(...PDF.ink); doc.setFontSize(24); doc.text(product.name, PDF.margin, y);
    y += 8;
    const shortLines = doc.splitTextToSize(cleanText(product.short_description), 103);
    doc.setFont('DejaVu', 'normal'); doc.setFontSize(9); doc.setTextColor(...PDF.muted); doc.text(shortLines, PDF.margin, y);
    await addProductImage(doc, product.image_url, 130, 51, 65, 55);
    y = 116;

    const specs = [
      ['Provozní tlak', product.pressure], ['Velikost kapky', product.micron_size], ['Spotřeba vody', product.water_consumption],
      ['Materiál', product.material], ['Výška / dosah', product.coverage_area], ['Napájení a řízení', product.power_supply],
      ['Úhel rozstřiku', product.spray_angle], ['Rozsah průtoku', product.flow_range], ['Záruka', '24 měsíců'],
    ].filter(([, value]) => value);
    y = drawSectionTitle(doc, 'Technické parametry', y);
    specs.forEach(([label, value], index) => {
      y = ensureSpace(doc, y, 9);
      if (index % 2 === 0) { doc.setFillColor(248, 250, 252); doc.rect(PDF.margin, y - 4.5, 180, 8, 'F'); }
      doc.setFont('DejaVu', 'bold'); doc.setFontSize(7.8); doc.setTextColor(71, 85, 105); doc.text(label, PDF.margin + 3, y);
      doc.setFont('DejaVu', 'normal'); doc.setTextColor(...PDF.ink); doc.text(String(value), 82, y);
      y += 8;
    });

    if (product.nozzle_variants?.length) {
      y = ensureSpace(doc, y + 4, 42); y = drawSectionTitle(doc, 'Varianty trysek a průtok', y + 4);
      doc.setFillColor(...PDF.ink); doc.rect(PDF.margin, y - 4, 180, 8, 'F');
      doc.setTextColor(255, 255, 255); doc.setFont('DejaVu', 'bold'); doc.setFontSize(6.5);
      ['Varianta', '2 bar', '5 bar', '10 bar', '15/20 bar'].forEach((text, i) => doc.text(text, [18, 78, 105, 132, 160][i], y)); y += 8;
      product.nozzle_variants.forEach((item, index) => {
        if (index % 2 === 0) { doc.setFillColor(241, 245, 249); doc.rect(PDF.margin, y - 4, 180, 8, 'F'); }
        doc.setTextColor(...PDF.ink); doc.setFont('DejaVu', item.is_standard ? 'bold' : 'normal'); doc.setFontSize(6.5);
        [item.code, item.flow_2bar || '—', item.flow_5bar || '—', item.flow_10bar || '—', item.flow_15bar || '—'].forEach((text, i) => doc.text(String(text), [18, 78, 105, 132, 160][i], y)); y += 8;
      });
    }

    const description = cleanText(product.description);
    if (description) {
      y = ensureSpace(doc, y + 5, 46); y = drawSectionTitle(doc, 'Popis a použití', y + 5);
      doc.setFont('DejaVu', 'normal'); doc.setFontSize(8.2); doc.setTextColor(...PDF.muted);
      const lines = doc.splitTextToSize(description.slice(0, 1500), 180); doc.text(lines, PDF.margin, y); y += lines.length * 4.2;
    }

    y = ensureSpace(doc, y + 8, 32); y = drawSectionTitle(doc, 'Dokumentace a servis', y + 8);
    doc.setFillColor(230, 252, 255); doc.roundedRect(PDF.margin, y, 180, 19, 2, 2, 'F');
    doc.setFont('DejaVu', 'bold'); doc.setFontSize(8.5); doc.setTextColor(8, 145, 178); doc.text('Instalační a údržbový manuál je dostupný na produktové stránce.', PDF.margin + 5, y + 7);
    doc.setFont('DejaVu', 'normal'); doc.setFontSize(7.5); doc.text('Technická konzultace: mlzidla.cz · obchod1@holmtec.cz · +420 774 700 390', PDF.margin + 5, y + 13);

    addBrandFooters(doc);
    const filename = `mlzidla-cz-${(product.slug || product.name).replace(/[^a-zA-Z0-9-_]/g, '-')}-technicky-list.pdf`;
    return Response.json({ pdf_base64: pdfBase64(doc), filename });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});