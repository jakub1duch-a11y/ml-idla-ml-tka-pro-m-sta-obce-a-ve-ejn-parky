import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { jsPDF } from 'npm:jspdf@4.0.0';

const toBase64 = (bytes) => {
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const { product, document_type: documentType } = await req.json();
    if (!product?.name) return Response.json({ error: 'Product data required' }, { status: 400 });

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const width = 210; const height = 297; const margin = 16; const contentWidth = width - margin * 2;
    doc.setFillColor(6, 45, 59); doc.rect(0, 0, width, 38, 'F');
    doc.setFillColor(76, 190, 190); doc.rect(0, 36, width, 2, 'F');
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.text('MLŽIDLA®', margin, 17);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(180, 220, 220); doc.text('ARCHITEKTONICKÉ MLŽICÍ SYSTÉMY', margin, 24);
    doc.setTextColor(255, 255, 255); doc.setFontSize(8); doc.text(documentType === 'offer' ? 'OBCHODNÍ NABÍDKA' : 'TECHNICKÝ LIST', width - margin, 17, { align: 'right' });
    doc.setTextColor(180, 220, 220); doc.text(new Date().toLocaleDateString('cs-CZ'), width - margin, 24, { align: 'right' });

    let y = 52;
    doc.setFont('helvetica', 'bold'); doc.setFontSize(25); doc.setTextColor(6, 45, 59); doc.text(product.name, margin, y);
    if (product.short_description) { y += 9; doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(72, 93, 102); doc.text(doc.splitTextToSize(product.short_description, contentWidth), margin, y); y += 14; }
    if (product.image_url) {
      try {
        const imageResponse = await fetch(product.image_url);
        const imageBytes = new Uint8Array(await imageResponse.arrayBuffer());
        const mime = imageResponse.headers.get('content-type') || 'image/jpeg';
        const imageType = mime.includes('png') ? 'PNG' : 'JPEG';
        doc.addImage(`data:${mime};base64,${toBase64(imageBytes)}`, imageType, margin, y, contentWidth, 76);
        y += 88;
      } catch (_) { y += 4; }
    }
    const price = product.price_from ? `${new Intl.NumberFormat('cs-CZ').format(product.price_from)} Kč bez DPH` : 'Cena na vyžádání';
    doc.setFillColor(232, 247, 247); doc.roundedRect(margin, y, contentWidth, 19, 2, 2, 'F');
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(47, 92, 100); doc.text('ORIENTAČNÍ CENA OD', margin + 5, y + 7);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(14); doc.setTextColor(6, 100, 108); doc.text(price, margin + 5, y + 14); y += 29;

    const specs = [['Provozní tlak', product.pressure], ['Spotřeba vody', product.water_consumption], ['Materiál', product.material], ['Průměr kapky', product.micron_size], ['Dosah / plocha', product.coverage_area], ['Napájení a řízení', product.power_supply]].filter((item) => item[1]);
    if (specs.length) {
      doc.setFillColor(6, 45, 59); doc.rect(margin, y, contentWidth, 8, 'F'); doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(255, 255, 255); doc.text('TECHNICKÉ PARAMETRY', margin + 4, y + 5.3); y += 8;
      specs.forEach(([label, value], index) => { if (index % 2 === 0) { doc.setFillColor(247, 250, 250); doc.rect(margin, y, contentWidth, 8, 'F'); } doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(47, 72, 81); doc.text(label, margin + 4, y + 5.3); doc.setFont('helvetica', 'normal'); doc.setTextColor(20, 50, 59); doc.text(String(value), margin + 72, y + 5.3); y += 8; });
    }
    if (product.description) { y += 12; doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(6, 45, 59); doc.text('O PRODUKTU', margin, y); y += 6; doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(72, 93, 102); const description = product.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(); doc.text(doc.splitTextToSize(description.slice(0, 850), contentWidth), margin, y); }
    doc.setFillColor(6, 45, 59); doc.rect(0, height - 18, width, 18, 'F'); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(188, 220, 220); doc.text('MLŽIDLA® / HolmTec s.r.o. · mlzidla.cz · +420 774 700 390 · obchod1@holmtec.cz', margin, height - 10);
    const output = new Uint8Array(doc.output('arraybuffer'));
    return Response.json({ pdf_base64: toBase64(output), filename: `MLZIDLA-${(product.slug || product.name).replace(/[^a-zA-Z0-9-_]/g, '-')}-nabidka.pdf` });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}