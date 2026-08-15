import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { jsPDF } from 'npm:jspdf@4.0.0';
import QRCode from 'npm:qrcode@1.5.4';

const toBase64 = (bytes) => {
  let binary = '';
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  arr.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
};
const formatPrice = (value) => new Intl.NumberFormat('cs-CZ').format(Math.round(Number(value || 0)));
const safe = (value) => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

async function loadFont(doc) {
  const fontResponse = await fetch('https://github.com/google/fonts/raw/main/ofl/notosans/NotoSans%5Bwdth,wght%5D.ttf');
  if (!fontResponse.ok) throw new Error('Czech font could not be loaded');
  doc.addFileToVFS('NotoSans.ttf', toBase64(new Uint8Array(await fontResponse.arrayBuffer())));
  doc.addFont('NotoSans.ttf', 'NotoSans', 'normal', 'Identity-H');
  doc.setFont('NotoSans', 'normal');
}

function addHeader(doc, { type, quoteNumber, issued, validUntil }) {
  const W = 210, M = 16;
  const steel = [6, 45, 59], teal = [76, 190, 190];
  doc.setFillColor(...steel); doc.rect(0, 0, W, 39, 'F');
  doc.setFillColor(...teal); doc.rect(0, 35, W, 4, 'F');
  doc.setTextColor(255, 255, 255); doc.setFontSize(19); doc.text('MLŽIDLA®', M, 18);
  doc.setTextColor(190, 226, 228); doc.setFontSize(7.5); doc.text('HOLMTEC · ARCHITEKTONICKÉ MLŽICÍ SYSTÉMY', M, 26);
  doc.setTextColor(255, 255, 255); doc.setFontSize(9); doc.text(type === 'offer' ? 'CENOVÁ NABÍDKA' : 'TECHNICKÝ LIST', W - M, 16, { align: 'right' });
  doc.setTextColor(190, 226, 228); doc.setFontSize(7.2);
  if (type === 'offer') {
    doc.text(`Č. ${quoteNumber}`, W - M, 23, { align: 'right' });
    doc.text(`Vystaveno ${issued} · platnost do ${validUntil}`, W - M, 30, { align: 'right' });
  }
}

function addFooter(doc, page, totalPages = 1) {
  const W = 210, M = 16;
  doc.setDrawColor(213, 225, 226); doc.line(M, 282, W - M, 282);
  doc.setTextColor(91, 108, 116); doc.setFontSize(6.7);
  doc.text('HolmTec s.r.o. · Horní Staré Město 698 · 541 02 Trutnov · IČ 27486893 · DIČ CZ27486893', M, 287);
  doc.text(`Ing. Radek Meduna · +420 774 700 390 · meduna@holmtec.cz · mlzidla.cz`, M, 291);
  doc.text(`${page}/${totalPages}`, W - M, 291, { align: 'right' });
}

async function addQr(doc, url, x, y, size = 24) {
  if (!url) return;
  try {
    const dataUrl = await QRCode.toDataURL(url, { width: 240, margin: 1, errorCorrectionLevel: 'M' });
    doc.addImage(dataUrl, 'PNG', x, y, size, size);
  } catch (_) {}
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const {
      product,
      document_type: documentType,
      quote = {},
      inquiry = {},
      quote_number: requestedQuoteNumber,
      valid_until: requestedValidUntil,
      portal_url: requestedPortalUrl,
      ar_url: requestedArUrl,
    } = await req.json();
    if (!product?.name) return Response.json({ error: 'Product data required' }, { status: 400 });

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    await loadFont(doc);

    const W = 210, M = 16, CW = 178;
    const steel = [6, 45, 59], teal = [76, 190, 190], ink = [25, 42, 50], muted = [91, 108, 116], pale = [241, 247, 247];
    const issuedAt = new Date();
    const validUntilDate = requestedValidUntil ? new Date(requestedValidUntil) : new Date(issuedAt.getTime() + 30 * 24 * 60 * 60 * 1000);
    const issued = issuedAt.toLocaleDateString('cs-CZ');
    const validUntil = validUntilDate.toLocaleDateString('cs-CZ');
    const quoteNumber = requestedQuoteNumber || `MLZ-${issuedAt.getFullYear()}-${String(Date.now()).slice(-6)}`;
    const portalUrl = requestedPortalUrl || 'https://mlzidla.cz/muj-projekt';
    const arUrl = requestedArUrl || (product.slug === 'mlzitko-bendy'
      ? 'https://mlzidla.cz/ar/bendy-single'
      : product.slug === 'mlzna-brana-gate'
        ? 'https://mlzidla.cz/ar/gate'
        : `https://mlzidla.cz/produkt/${product.slug || ''}`);

    if (documentType !== 'offer') {
      addHeader(doc, { type: 'datasheet', quoteNumber, issued, validUntil });
      let y = 55;
      doc.setTextColor(...steel); doc.setFontSize(23); doc.text(product.name, M, y); y += 10;
      if (product.short_description) { doc.setTextColor(...muted); doc.setFontSize(9.5); doc.text(doc.splitTextToSize(product.short_description, CW), M, y); y += 17; }
      if (product.image_url) {
        try {
          const response = await fetch(product.image_url);
          const bytes = new Uint8Array(await response.arrayBuffer());
          const mime = response.headers.get('content-type') || 'image/jpeg';
          doc.addImage(`data:${mime};base64,${toBase64(bytes)}`, mime.includes('png') ? 'PNG' : 'JPEG', M, y, CW, 72);
          y += 82;
        } catch (_) {}
      }
      const specs = [['Provozní tlak', product.pressure], ['Spotřeba vody', product.water_consumption], ['Materiál', product.material], ['Průměr kapky', product.micron_size], ['Dosah / plocha', product.coverage_area], ['Napájení a řízení', product.power_supply]].filter((item) => item[1]);
      if (specs.length) {
        doc.setFillColor(...pale); doc.rect(M, y, CW, 8, 'F'); doc.setTextColor(...steel); doc.setFontSize(8); doc.text('TECHNICKÉ PARAMETRY', M + 5, y + 5.2); y += 8;
        specs.forEach(([name, value]) => { doc.setTextColor(...muted); doc.setFontSize(7.5); doc.text(name, M + 5, y + 5.1); doc.setTextColor(...ink); doc.text(doc.splitTextToSize(String(value), 100)[0], M + 68, y + 5.1); y += 8; });
      }
      addFooter(doc, 1, 1);
      const output = new Uint8Array(doc.output('arraybuffer'));
      return Response.json({ pdf_base64: toBase64(output), filename: `MLZIDLA-${(product.slug || product.name).replace(/[^a-zA-Z0-9-_]/g, '-')}-technicky-list.pdf` });
    }

    // PAGE 1 — obchodní a cenová část
    addHeader(doc, { type: 'offer', quoteNumber, issued, validUntil });
    let y = 49;

    // Žadatel / dodavatel
    doc.setFillColor(247, 250, 250); doc.roundedRect(M, y, 86, 40, 2, 2, 'F');
    doc.setFillColor(247, 250, 250); doc.roundedRect(M + 92, y, 86, 40, 2, 2, 'F');
    doc.setTextColor(...teal); doc.setFontSize(7.2); doc.text('ŽADATEL / ODBĚRATEL', M + 5, y + 7);
    doc.setTextColor(...ink); doc.setFontSize(10); doc.text(safe(inquiry.name) || '—', M + 5, y + 15);
    doc.setTextColor(...muted); doc.setFontSize(7.3);
    const applicant = [safe(inquiry.company), safe(inquiry.email), safe(inquiry.phone)].filter(Boolean);
    doc.text(applicant.length ? applicant : ['Kontaktní údaje dle poptávky'], M + 5, y + 22);

    doc.setTextColor(...teal); doc.setFontSize(7.2); doc.text('DODAVATEL', M + 97, y + 7);
    doc.setTextColor(...ink); doc.setFontSize(9.5); doc.text('HolmTec s.r.o. — mlzidla.cz', M + 97, y + 15);
    doc.setTextColor(...muted); doc.setFontSize(7.1);
    doc.text(['Ing. Radek Meduna', '+420 774 700 390', 'meduna@holmtec.cz'], M + 97, y + 22);
    y += 49;

    // Produkt + obrázek
    doc.setTextColor(...steel); doc.setFontSize(18); doc.text(product.name, M, y + 5);
    if (product.short_description) { doc.setTextColor(...muted); doc.setFontSize(8.5); doc.text(doc.splitTextToSize(safe(product.short_description), 103), M, y + 12); }
    if (product.image_url) {
      try {
        const response = await fetch(product.image_url);
        const bytes = new Uint8Array(await response.arrayBuffer());
        const mime = response.headers.get('content-type') || 'image/jpeg';
        doc.addImage(`data:${mime};base64,${toBase64(bytes)}`, mime.includes('png') ? 'PNG' : 'JPEG', 132, y, 62, 48);
      } catch (_) {}
    }
    y += 58;

    // Cenové položky
    doc.setFillColor(...steel); doc.rect(M, y, CW, 9, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(7.5); doc.text('CENOVÁ KALKULACE', M + 5, y + 5.8); y += 9;
    const basePrice = Number(quote.base_price || 0);
    const installation = Number(quote.installation || 0);
    const discountPercent = Number(quote.discount_percent || 0);
    const beforeDiscount = basePrice + installation;
    const calculatedFinal = beforeDiscount * (1 - discountPercent / 100);
    const finalTotal = Number(quote.final_total ?? calculatedFinal ?? product.price_from ?? 0);
    const rows = [
      ['Produkt / sestava', basePrice || Number(product.price_from || 0)],
      ['Instalace / uvedení do provozu', installation],
    ].filter(([, price]) => price > 0);
    rows.forEach(([label, price], index) => {
      if (index % 2 === 0) { doc.setFillColor(248, 250, 250); doc.rect(M, y, CW, 9, 'F'); }
      doc.setTextColor(...ink); doc.setFontSize(8.2); doc.text(label, M + 5, y + 5.8);
      doc.text(`${formatPrice(price)} Kč`, W - M - 5, y + 5.8, { align: 'right' }); y += 9;
    });
    if (discountPercent > 0) {
      doc.setTextColor(32, 145, 110); doc.setFontSize(8.2); doc.text(`Sleva ${discountPercent} %`, M + 5, y + 5.8);
      const discountValue = beforeDiscount - finalTotal;
      doc.text(`−${formatPrice(discountValue)} Kč`, W - M - 5, y + 5.8, { align: 'right' }); y += 9;
    }
    doc.setFillColor(...teal); doc.rect(M, y, CW, 14, 'F');
    doc.setTextColor(...steel); doc.setFontSize(10.5); doc.text('CELKEM BEZ DPH', M + 5, y + 9.2);
    doc.setFontSize(13); doc.text(finalTotal ? `${formatPrice(finalTotal)} Kč` : 'Cena dle potvrzené konfigurace', W - M - 5, y + 9.2, { align: 'right' }); y += 17;
    if (finalTotal) {
      doc.setTextColor(...muted); doc.setFontSize(7.5); doc.text(`DPH 21 %: ${formatPrice(finalTotal * 0.21)} Kč · Celkem s DPH: ${formatPrice(finalTotal * 1.21)} Kč`, W - M, y + 2, { align: 'right' });
    }
    y += 10;

    // QR + CTA
    await addQr(doc, arUrl, M, y, 24);
    await addQr(doc, portalUrl, M + 34, y, 24);
    doc.setTextColor(...muted); doc.setFontSize(6.3); doc.text('AR / produkt', M + 2, y + 28); doc.text('Potvrdit nabídku', M + 34, y + 28);
    doc.setFillColor(...steel); doc.roundedRect(86, y + 2, 108, 13, 2, 2, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(8.5); doc.text('SOUHLASÍM A OBJEDNÁVÁM  →', 93, y + 10.5);
    doc.link(86, y + 2, 108, 13, { url: portalUrl });
    doc.setTextColor(...muted); doc.setFontSize(6.7);
    doc.text(doc.splitTextToSize(`Nabídka je standardně platná 30 dní, do ${validUntil}. Elektronický souhlas v zákaznickém portálu potvrzuje objednávku dle nabídky a obchodních podmínek.`, 108), 86, y + 22);
    addFooter(doc, 1, 2);

    // PAGE 2 — technická část / Smart / podmínky
    doc.addPage();
    addHeader(doc, { type: 'offer', quoteNumber, issued, validUntil });
    y = 52;
    doc.setTextColor(...steel); doc.setFontSize(18); doc.text('Technické a projektové informace', M, y); y += 10;
    const specs = [
      ['Provozní tlak', product.pressure],
      ['Spotřeba vody', product.water_consumption],
      ['Materiál', product.material],
      ['Mlžné trysky / kapka', product.micron_size],
      ['Výška / dosah', product.coverage_area],
      ['Napájení / řízení', product.power_supply],
    ].filter((item) => item[1]);
    if (specs.length) {
      doc.setFillColor(...pale); doc.rect(M, y, CW, 8, 'F'); doc.setTextColor(...steel); doc.setFontSize(8); doc.text('PARAMETRY PRODUKTU', M + 5, y + 5.2); y += 8;
      specs.forEach(([label, value], i) => {
        if (i % 2 === 1) { doc.setFillColor(248, 250, 250); doc.rect(M, y, CW, 10, 'F'); }
        doc.setTextColor(...muted); doc.setFontSize(7.3); doc.text(label, M + 5, y + 6.2);
        doc.setTextColor(...ink); doc.text(doc.splitTextToSize(String(value), 102)[0], M + 65, y + 6.2); y += 10;
      });
      y += 7;
    }

    doc.setFillColor(6, 45, 59); doc.roundedRect(M, y, CW, 43, 2, 2, 'F');
    doc.setTextColor(...teal); doc.setFontSize(8); doc.text('SMART ŘÍZENÍ MLŽIDLA.CZ', M + 6, y + 8);
    doc.setTextColor(255, 255, 255); doc.setFontSize(10.5); doc.text('Voda jen tehdy, když je potřeba.', M + 6, y + 17);
    doc.setTextColor(210, 228, 232); doc.setFontSize(7.7);
    doc.text(doc.splitTextToSize('Volitelná inteligentní vrstva pro řízení vodní větve a provozních scénářů. Konkrétní automatizace, čidla a způsob spouštění se navrhují podle projektu.', CW - 12), M + 6, y + 25);
    y += 52;

    doc.setTextColor(...steel); doc.setFontSize(9); doc.text('ROZSAH A PODMÍNKY NABÍDKY', M, y); y += 7;
    const conditions = [
      `Platnost cenové nabídky: 30 dní od vystavení, do ${validUntil}.`,
      'Cena se vztahuje na specifikaci uvedenou v této nabídce; změna rozsahu může změnit cenu a termín.',
      'Přesné kotvení, rozměrové návaznosti, rozvody a režim řízení se potvrzují před výrobou podle místa instalace.',
      'Elektronické odsouhlasení nabídky v zákaznickém portálu představuje potvrzení objednávky a souhlas s obchodními podmínkami.',
      'Dodavatel: HolmTec s.r.o. — mlzidla.cz; kontaktní osoba Ing. Radek Meduna.',
    ];
    conditions.forEach((line) => { doc.setTextColor(...muted); doc.setFontSize(7.7); doc.text('•', M + 2, y); doc.text(doc.splitTextToSize(line, CW - 10), M + 8, y); y += 10; });

    if (product.description && y < 230) {
      y += 4; doc.setTextColor(...steel); doc.setFontSize(9); doc.text('O PRODUKTU', M, y); y += 7;
      doc.setTextColor(...muted); doc.setFontSize(7.5); doc.text(doc.splitTextToSize(safe(product.description).slice(0, 720), CW), M, y);
    }

    addFooter(doc, 2, 2);
    const output = new Uint8Array(doc.output('arraybuffer'));
    return Response.json({
      pdf_base64: toBase64(output),
      filename: `${quoteNumber}-${(product.slug || product.name).replace(/[^a-zA-Z0-9-_]/g, '-')}-cenova-nabidka.pdf`,
      quote_number: quoteNumber,
      valid_until: validUntilDate.toISOString(),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
