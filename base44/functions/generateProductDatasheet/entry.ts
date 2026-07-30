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

    const { product, document_type: documentType } = await req.json();
    if (!product?.name) return Response.json({ error: 'Product data required' }, { status: 400 });

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const width = 210;
    const height = 297;
    const margin = 16;
    const contentWidth = width - margin * 2;
    const brand = [6, 45, 59];
    const teal = [76, 190, 190];
    const ink = [25, 42, 50];
    const muted = [92, 108, 116];
    const date = new Date().toLocaleDateString('cs-CZ');
    const price = product.price_from ? `${formatPrice(product.price_from)} Kč` : 'Cena na vyžádání';
    const orderUrl = `mailto:obchod1@holmtec.cz?subject=${encodeURIComponent(`Objednávka / dotaz – ${product.name}`)}&body=${encodeURIComponent(`Dobrý den, mám zájem o produkt ${product.name}. Prosím o kontaktování a upřesnění nabídky.`)}`;

    doc.setFillColor(...brand);
    doc.rect(0, 0, 72, height, 'F');
    doc.setFillColor(251, 195, 28);
    doc.rect(0, 0, width, 5, 'F');
    doc.setFillColor(...teal);
    doc.rect(0, 292, 72, 5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(19);
    doc.setTextColor(255, 255, 255);
    doc.text('MLŽIDLA®', margin, 27);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(177, 218, 221);
    doc.text('ARCHITEKTONICKÉ MLŽICÍ SYSTÉMY', margin, 34);
    doc.setDrawColor(76, 190, 190);
    doc.setLineWidth(0.5);
    doc.line(margin, 43, 56, 43);

    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(['HolmTec s.r.o.', 'Česká republika', '', '+420 774 700 390', 'obchod1@holmtec.cz', 'www.mlzidla.cz'], margin, 59, { lineHeightFactor: 1.7 });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...teal);
    doc.text('PRECIZNOST V DETAILU', margin, 254);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(177, 218, 221);
    doc.text(['Nerezová ocel', 'Mikroklima bez kompromisů', 'Návrh, výroba, realizace'], margin, 263, { lineHeightFactor: 1.65 });

    const x = 87;
    let y = 28;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text(documentType === 'offer' ? 'CENOVÁ NABÍDKA' : 'TECHNICKÝ LIST', x, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(...brand);
    doc.text(product.name, x, y + 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...muted);
    doc.text(`Vystaveno ${date}  ·  Platnost nabídky 30 dní`, x, y + 24);

    y = 66;
    if (product.image_url) {
      try {
        const response = await fetch(product.image_url);
        const bytes = new Uint8Array(await response.arrayBuffer());
        const mime = response.headers.get('content-type') || 'image/jpeg';
        const type = mime.includes('png') ? 'PNG' : 'JPEG';
        doc.addImage(`data:${mime};base64,${toBase64(bytes)}`, type, x, y, 107, 66);
        doc.setFillColor(255, 255, 255);
        doc.setGState(new doc.GState({ opacity: 0.91 }));
        doc.roundedRect(x + 5, y + 49, 64, 12, 1.5, 1.5, 'F');
        doc.setGState(new doc.GState({ opacity: 1 }));
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...brand);
        doc.text('ORIENTAČNÍ CENA OD', x + 8, y + 54);
        doc.setFontSize(12);
        doc.text(price, x + 8, y + 59);
        y += 78;
      } catch (_) { y += 4; }
    }

    if (product.short_description) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(...ink);
      doc.text(doc.splitTextToSize(product.short_description, 107), x, y);
      y += 16;
    }

    const specs = [
      ['Provozní tlak', product.pressure],
      ['Spotřeba vody', product.water_consumption],
      ['Materiál', product.material],
      ['Průměr kapky', product.micron_size],
      ['Dosah / plocha', product.coverage_area],
      ['Napájení a řízení', product.power_supply]
    ].filter((item) => item[1]);

    if (specs.length) {
      doc.setFillColor(...brand);
      doc.rect(x, y, 107, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.text('TECHNICKÉ PARAMETRY', x + 5, y + 5.3);
      y += 8;
      specs.forEach(([label, value], index) => {
        if (index % 2 === 0) {
          doc.setFillColor(244, 248, 248);
          doc.rect(x, y, 107, 8.5, 'F');
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(...muted);
        doc.text(label, x + 5, y + 5.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...ink);
        doc.text(String(value), x + 48, y + 5.5);
        y += 8.5;
      });
      y += 11;
    }

    if (product.description) {
      const description = product.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...brand);
      doc.text('O PRODUKTU', x, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...muted);
      doc.text(doc.splitTextToSize(description.slice(0, 510), 107), x, y);
      y += 30;
    }

    const actionY = Math.min(Math.max(y, 240), 270);
    doc.setFillColor(...teal);
    doc.roundedRect(x, actionY, 107, 12, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...brand);
    doc.text('OBJEDNAT / NAPSAT ZPRÁVU  →', x + 7, actionY + 7.6);
    doc.link(x, actionY, 107, 12, { url: orderUrl });

    doc.setDrawColor(214, 225, 225);
    doc.setLineWidth(0.3);
    doc.line(87, 284, 194, 284);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...muted);
    doc.text('MLŽIDLA®  ·  HolmTec s.r.o.  ·  www.mlzidla.cz', 87, 289);
    doc.text('Strana 1 / 1', 194, 289, { align: 'right' });

    const output = new Uint8Array(doc.output('arraybuffer'));
    return Response.json({
      pdf_base64: toBase64(output),
      filename: `MLZIDLA-${(product.slug || product.name).replace(/[^a-zA-Z0-9-_]/g, '-')}-nabidka.pdf`
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}