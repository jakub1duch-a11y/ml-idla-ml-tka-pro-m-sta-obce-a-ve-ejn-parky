import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { jsPDF } from 'npm:jspdf@4.0.0';

const toBase64 = (bytes) => {
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
};
const formatPrice = (value) => new Intl.NumberFormat('cs-CZ').format(value);

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const { product, document_type: documentType, quote } = await req.json();
    if (!product?.name) return Response.json({ error: 'Product data required' }, { status: 400 });

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const fontResponse = await fetch('https://github.com/google/fonts/raw/main/ofl/notosans/NotoSans%5Bwdth,wght%5D.ttf');
    if (!fontResponse.ok) throw new Error('Czech font could not be loaded');
    doc.addFileToVFS('NotoSans.ttf', toBase64(new Uint8Array(await fontResponse.arrayBuffer())));
    doc.addFont('NotoSans.ttf', 'NotoSans', 'normal', 'Identity-H');
    doc.setFont('NotoSans', 'normal');

    const width = 210; const margin = 18; const contentWidth = 174;
    const steel = [6, 45, 59]; const teal = [76, 190, 190]; const ink = [25, 42, 50]; const muted = [91, 108, 116];
    const date = new Date().toLocaleDateString('cs-CZ');
    const finalPrice = quote?.final_total ?? product.price_from;
    const price = finalPrice ? `${formatPrice(finalPrice)} Kč bez DPH` : 'Cena na vyžádání';
    const label = quote?.final_total ? 'CENA PROJEKTU PO SLEVĚ' : 'ORIENTAČNÍ CENA OD';
    const orderUrl = `mailto:obchod1@holmtec.cz?subject=${encodeURIComponent(`Objednávka / dotaz – ${product.name}`)}`;

    doc.setFillColor(...steel); doc.rect(0, 0, width, 39, 'F');
    doc.setFillColor(...teal); doc.rect(0, 35, width, 4, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(19); doc.text('MLŽIDLA®', margin, 19);
    doc.setTextColor(190, 226, 228); doc.setFontSize(7.5); doc.text('ARCHITEKTONICKÉ MLŽICÍ SYSTÉMY', margin, 26);
    doc.setTextColor(255, 255, 255); doc.setFontSize(8); doc.text(documentType === 'offer' ? 'CENOVÁ NABÍDKA' : 'TECHNICKÝ LIST', width - margin, 19, { align: 'right' });
    doc.setTextColor(190, 226, 228); doc.text(`Vystaveno ${date}  ·  Platnost nabídky 30 dní`, width - margin, 26, { align: 'right' });

    let y = 55;
    doc.setTextColor(...steel); doc.setFontSize(23); doc.text(product.name, margin, y);
    y += 10;
    if (product.short_description) { doc.setTextColor(...muted); doc.setFontSize(9.5); doc.text(doc.splitTextToSize(product.short_description, contentWidth), margin, y); y += 13; }

    if (product.image_url) {
      try {
        const response = await fetch(product.image_url);
        const bytes = new Uint8Array(await response.arrayBuffer());
        const mime = response.headers.get('content-type') || 'image/jpeg';
        const type = mime.includes('png') ? 'PNG' : 'JPEG';
        doc.addImage(`data:${mime};base64,${toBase64(bytes)}`, type, margin, y, contentWidth, 63);
        doc.setFillColor(255, 255, 255); doc.roundedRect(margin + 5, y + 46, 73, 12, 1.5, 1.5, 'F');
        doc.setTextColor(...muted); doc.setFontSize(6.5); doc.text(label, margin + 8, y + 51);
        doc.setTextColor(...steel); doc.setFontSize(10); doc.text(price, margin + 8, y + 56);
        y += 74;
      } catch (_) { y += 2; }
    }

    const specs = [['Provozní tlak', product.pressure], ['Spotřeba vody', product.water_consumption], ['Materiál', product.material], ['Průměr kapky', product.micron_size], ['Dosah / plocha', product.coverage_area], ['Napájení a řízení', product.power_supply]].filter((item) => item[1]);
    if (specs.length) {
      doc.setFillColor(241, 247, 247); doc.rect(margin, y, contentWidth, 8, 'F'); doc.setTextColor(...steel); doc.setFontSize(8); doc.text('TECHNICKÉ PARAMETRY', margin + 5, y + 5.2); y += 8;
      specs.forEach(([name, value], index) => { if (index % 2 === 1) { doc.setFillColor(248, 250, 250); doc.rect(margin, y, contentWidth, 8, 'F'); } doc.setTextColor(...muted); doc.setFontSize(7.5); doc.text(name, margin + 5, y + 5.1); doc.setTextColor(...ink); doc.text(String(value), margin + 68, y + 5.1); y += 8; });
      y += 8;
    }

    if (product.description && y < 237) {
      const description = product.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      doc.setTextColor(...steel); doc.setFontSize(8); doc.text('O PRODUKTU', margin, y); y += 6;
      doc.setTextColor(...muted); doc.setFontSize(8); doc.text(doc.splitTextToSize(description.slice(0, 500), contentWidth), margin, y); y += 30;
    }
    const actionY = Math.min(Math.max(y, 245), 269);
    doc.setFillColor(...teal); doc.roundedRect(margin, actionY, contentWidth, 12, 1.5, 1.5, 'F');
    doc.setTextColor(...steel); doc.setFontSize(9); doc.text('OBJEDNAT / NAPSAT ZPRÁVU  →', margin + 8, actionY + 7.5); doc.link(margin, actionY, contentWidth, 12, { url: orderUrl });

    doc.setDrawColor(213, 225, 226); doc.line(margin, 282, width - margin, 282);
    doc.setTextColor(...muted); doc.setFontSize(7); doc.text('MLŽIDLA®  ·  HolmTec s.r.o.  ·  www.mlzidla.cz', margin, 288); doc.text('Česká výroba a návrh na míru', width - margin, 288, { align: 'right' });
    const output = new Uint8Array(doc.output('arraybuffer'));
    return Response.json({ pdf_base64: toBase64(output), filename: `MLZIDLA-${(product.slug || product.name).replace(/[^a-zA-Z0-9-_]/g, '-')}-nabidka.pdf` });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}