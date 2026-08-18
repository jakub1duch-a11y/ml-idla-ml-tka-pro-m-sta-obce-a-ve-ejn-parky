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
const dateCs = (value) => new Date(value).toLocaleDateString('cs-CZ');
const LOGO_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/314f4a3ac_mlzidla_logo_bez_pozadi.png';

const AUDIENCE = {
  city_public: {
    label: 'Města · obce · náměstí · parky',
    headline: 'Ochlazení veřejného prostoru s důrazem na provoz, bezpečnost a dlouhou životnost.',
    benefits: [
      'Reprezentativní architektonický prvek pro veřejný prostor.',
      'Nízkotlaký provoz bez vysokotlakého čerpadla.',
      'Možnost Smart řízení, harmonogramů, senzorů a kontroly spotřeby.',
      'Projektové kotvení, servisní přístup a řešení vhodné pro dlouhodobý provoz.'
    ]
  },
  residential: {
    label: 'Rezidenční zahrady · terasy · venkovní prostory',
    headline: 'Příjemnější venkovní prostor, který se stane přirozenou součástí zahrady.',
    benefits: [
      'Designový nerezový prvek bez rušivé techniky v prostoru.',
      'Příjemné osvěžení terasy, zahrady nebo odpočinkové zóny.',
      'Jednoduché napojení na vodovodní řad a možnost sezónního řešení.',
      'Volitelné ovládání z mobilu, časové scénáře a automatizace.'
    ]
  },
  wellness_hospitality: {
    label: 'Wellness · hotel · gastro · resort',
    headline: 'Komfort hostů a výrazný detail, který podporuje zážitek z venkovního prostoru.',
    benefits: [
      'Prémiový vzhled vhodný pro wellness, hotely, restaurace a resorty.',
      'Ochlazení pobytových zón bez hlučného vysokotlakého agregátu.',
      'Smart provoz podle času a podmínek v místě.',
      'Možnost začlenění do architektury, terasy, zahrady nebo bazénové zóny.'
    ]
  },
  architecture_design: {
    label: 'Architekti · developeři · krajinářské projekty',
    headline: 'Technicky čistý prvek připravený pro koordinaci s architekturou a projektovou dokumentací.',
    benefits: [
      'Variantní rozměry, kotvení a konfigurace podle projektu.',
      'Podklady pro koordinaci, vizualizace a možnost 3D / AR ověření.',
      'Nerezové provedení a dlouhodobě čitelný minimalistický design.',
      'Možnost kombinace s řízením, senzory a dalšími technologickými moduly.'
    ]
  },
  custom: {
    label: 'Zakázkový projekt',
    headline: 'Řešení navržené podle konkrétního prostoru, funkce a požadovaného vizuálního charakteru.',
    benefits: [
      'Návrh vyrobitelného tvaru podle zadání zákazníka.',
      'Více vizualizačních variant pro výběr směru před výrobou.',
      'Technické dopracování kotvení, rozvodů, trysek a řízení.',
      'Možnost návaznosti na Smart systém, senzory a další moduly.'
    ]
  }
};

async function loadFont(doc) {
  const fontResponse = await fetch('https://github.com/google/fonts/raw/main/ofl/notosans/NotoSans%5Bwdth,wght%5D.ttf');
  if (!fontResponse.ok) throw new Error('Czech font could not be loaded');
  doc.addFileToVFS('NotoSans.ttf', toBase64(new Uint8Array(await fontResponse.arrayBuffer())));
  doc.addFont('NotoSans.ttf', 'NotoSans', 'normal', 'Identity-H');
  doc.setFont('NotoSans', 'normal');
}

function addBrand(doc, x, y, dark = true) {
  const teal = [43, 191, 207];
  const navy = [10, 22, 40];
  // Minimal brand mark inspired by the MLŽIDLA symbol.
  doc.setDrawColor(...teal); doc.setLineWidth(1.8);
  doc.roundedRect(x, y, 12, 15, 6, 6, 'S');
  doc.setFillColor(dark ? 255 : navy[0], dark ? 255 : navy[1], dark ? 255 : navy[2]);
  doc.circle(x + 6, y + 11.6, 1.7, 'F');
  doc.setTextColor(...teal); doc.setFontSize(16); doc.text('MLŽ', x + 17, y + 8.8);
  doc.setTextColor(dark ? 255 : navy[0], dark ? 255 : navy[1], dark ? 255 : navy[2]); doc.text('IDLA.cz', x + 31, y + 8.8);
  doc.setFontSize(6.5); doc.setTextColor(dark ? 185 : 85, dark ? 205 : 100, dark ? 212 : 110); doc.text('by HolmTec', x + 17, y + 14);
}

async function addHeader(doc, { type, quoteNumber, issued, validUntil }) {
  const W = 210, M = 14;
  const navy = [13, 45, 56], accent = [43, 191, 207], border = [222, 232, 234], pale = [247, 250, 250], muted = [103, 124, 131];
  doc.setFillColor(255, 255, 255); doc.rect(0, 0, W, 45, 'F');
  doc.setFillColor(...accent); doc.rect(0, 0, W, 2.2, 'F');
  const logoOk = await addRemoteImage(doc, LOGO_URL, M, 8, 62, 20);
  if (!logoOk) addBrand(doc, M, 9, false);
  doc.setFillColor(...pale); doc.setDrawColor(...border); doc.roundedRect(132, 7, 64, 27, 3, 3, 'FD');
  doc.setTextColor(...navy); doc.setFontSize(8.5); doc.text(type === 'offer' ? 'CENOVÁ NABÍDKA' : 'TECHNICKÝ LIST', 191, 13, { align: 'right' });
  doc.setTextColor(...muted); doc.setFontSize(6.4);
  if (type === 'offer') {
    doc.text(`Č. ${quoteNumber}`, 191, 19, { align: 'right' });
    doc.text(`Vystaveno ${issued}`, 191, 25, { align: 'right' });
    doc.text(`Platnost do ${validUntil}`, 191, 31, { align: 'right' });
  }
  doc.setDrawColor(...border); doc.line(M, 40, W - M, 40);
}

function addFooter(doc, page, totalPages = 1) {
  const W = 210, M = 14;
  const navy = [10, 22, 40], muted = [91, 108, 116], accent = [43, 191, 207];
  doc.setDrawColor(213, 225, 226); doc.line(M, 279, W - M, 279);
  doc.setTextColor(...navy); doc.setFontSize(6.8); doc.text('MLŽIDLA.cz by HolmTec · HolmTec s.r.o. · Horní Staré Město 698 · 541 02 Trutnov', M, 284);
  doc.setTextColor(...muted); doc.setFontSize(6.5); doc.text('IČ 27486893 · DIČ CZ27486893 · +420 774 700 390 · meduna@holmtec.cz · info@mlzidla.cz · mlzidla.cz', M, 289);
  doc.setTextColor(...accent); doc.text(`${page}/${totalPages}`, W - M, 289, { align: 'right' });
}

async function addQr(doc, url, x, y, size = 24) {
  if (!url) return;
  try {
    const dataUrl = await QRCode.toDataURL(url, { width: 240, margin: 1, errorCorrectionLevel: 'M' });
    doc.addImage(dataUrl, 'PNG', x, y, size, size);
  } catch (_) {}
}

async function addRemoteImage(doc, url, x, y, w, h) {
  if (!url) return false;
  try {
    const response = await fetch(url);
    if (!response.ok) return false;
    const bytes = new Uint8Array(await response.arrayBuffer());
    const mime = response.headers.get('content-type') || 'image/jpeg';
    doc.addImage(`data:${mime};base64,${toBase64(bytes)}`, mime.includes('png') ? 'PNG' : 'JPEG', x, y, w, h, undefined, 'FAST');
    return true;
  } catch (_) { return false; }
}

function drawButton(doc, x, y, w, label, url, fill, textColor = [255, 255, 255]) {
  doc.setFillColor(...fill); doc.roundedRect(x, y, w, 11, 2.5, 2.5, 'F');
  doc.setTextColor(...textColor); doc.setFontSize(7.3); doc.text(label, x + w / 2, y + 7, { align: 'center' });
  if (url) doc.link(x, y, w, 11, { url });
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const {
      product,
      document_type: documentType,
      quote = {},
      inquiry = {},
      quote_number: requestedQuoteNumber,
      valid_until: requestedValidUntil,
      portal_url: requestedPortalUrl,
      ar_url: requestedArUrl,
      audience_variant: audienceVariant = 'custom',
    } = await req.json();
    if (!product?.name) return Response.json({ error: 'Product data required' }, { status: 400 });

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    await loadFont(doc);

    const W = 210, M = 14, CW = 182;
    const navy = [10, 22, 40], petrol = [11, 72, 96], accent = [43, 191, 207], ink = [25, 42, 50], muted = [91, 108, 116], pale = [243, 248, 249];
    const issuedAt = new Date();
    const validUntilDate = requestedValidUntil ? new Date(requestedValidUntil) : new Date(issuedAt.getTime() + 30 * 24 * 60 * 60 * 1000);
    const issued = issuedAt.toLocaleDateString('cs-CZ');
    const validUntil = validUntilDate.toLocaleDateString('cs-CZ');
    const quoteNumber = requestedQuoteNumber || `MLZ-${issuedAt.getFullYear()}-${String(Date.now()).slice(-6)}`;
    const portalUrl = requestedPortalUrl || 'https://mlzidla.cz/muj-projekt';
    const orderUrl = `${portalUrl}?action=order&quote=${encodeURIComponent(quoteNumber)}`;
    const extensionUrl = `${portalUrl}?action=extend&quote=${encodeURIComponent(quoteNumber)}`;
    const timingUrl = `${portalUrl}?action=timing&quote=${encodeURIComponent(quoteNumber)}`;
    const arUrl = requestedArUrl || (product.slug === 'mlzitko-bendy'
      ? 'https://mlzidla.cz/ar/bendy-single'
      : product.slug === 'mlzna-brana-gate'
        ? 'https://mlzidla.cz/ar/gate'
        : `https://mlzidla.cz/produkt/${product.slug || ''}`);
    const audience = AUDIENCE[audienceVariant] || AUDIENCE.custom;

    if (documentType !== 'offer') {
      await addHeader(doc, { type: 'datasheet', quoteNumber, issued, validUntil });
      let y = 56;
      doc.setTextColor(...navy); doc.setFontSize(23); doc.text(product.name, M, y); y += 10;
      if (product.short_description) { doc.setTextColor(...muted); doc.setFontSize(9.2); doc.text(doc.splitTextToSize(safe(product.short_description), CW), M, y); y += 17; }
      if (product.image_url) { const ok = await addRemoteImage(doc, product.image_url, M, y, CW, 72); if (ok) y += 81; }
      const specs = [['Provozní tlak', product.pressure], ['Spotřeba vody', product.water_consumption], ['Materiál', product.material], ['Průměr kapky', product.micron_size], ['Dosah / plocha', product.coverage_area], ['Napájení a řízení', product.power_supply]].filter((item) => item[1]);
      if (specs.length) {
        doc.setFillColor(...pale); doc.rect(M, y, CW, 8, 'F'); doc.setTextColor(...petrol); doc.setFontSize(8); doc.text('TECHNICKÉ PARAMETRY', M + 5, y + 5.2); y += 8;
        specs.forEach(([name, value], i) => { if (i % 2) { doc.setFillColor(249, 251, 251); doc.rect(M, y, CW, 8, 'F'); } doc.setTextColor(...muted); doc.setFontSize(7.5); doc.text(name, M + 5, y + 5.1); doc.setTextColor(...ink); doc.text(doc.splitTextToSize(String(value), 105)[0], M + 70, y + 5.1); y += 8; });
      }
      addFooter(doc, 1, 1);
      const output = new Uint8Array(doc.output('arraybuffer'));
      return Response.json({ pdf_base64: toBase64(output), filename: `MLZIDLA-${(product.slug || product.name).replace(/[^a-zA-Z0-9-_]/g, '-')}-technicky-list.pdf` });
    }

    // PAGE 1 - executive commercial offer
    await addHeader(doc, { type: 'offer', quoteNumber, issued, validUntil });
    let y = 49;

    doc.setFillColor(247, 250, 250); doc.roundedRect(M, y, 88, 39, 2, 2, 'F');
    doc.setFillColor(247, 250, 250); doc.roundedRect(M + 94, y, 88, 39, 2, 2, 'F');
    doc.setTextColor(...accent); doc.setFontSize(6.8); doc.text('ŽADATEL / ODBĚRATEL', M + 5, y + 7);
    doc.setTextColor(...ink); doc.setFontSize(9.5); doc.text(safe(inquiry.name) || '—', M + 5, y + 15);
    doc.setTextColor(...muted); doc.setFontSize(7.0);
    const applicant = [safe(inquiry.company), safe(inquiry.email), safe(inquiry.phone)].filter(Boolean);
    doc.text(applicant.length ? applicant : ['Kontaktní údaje dle poptávky'], M + 5, y + 22);

    doc.setTextColor(...accent); doc.setFontSize(6.8); doc.text('DODAVATEL', M + 99, y + 7);
    doc.setTextColor(...ink); doc.setFontSize(9.2); doc.text('MLŽIDLA.cz by HolmTec', M + 99, y + 15);
    doc.setTextColor(...muted); doc.setFontSize(7.0);
    doc.text(['HolmTec s.r.o.', 'Ing. Radek Meduna · +420 774 700 390', 'meduna@holmtec.cz · info@mlzidla.cz'], M + 99, y + 22);
    y += 47;

    doc.setTextColor(...accent); doc.setFontSize(6.8); doc.text(audience.label.toUpperCase(), M, y);
    doc.setTextColor(...navy); doc.setFontSize(17.5); doc.text(product.name, M, y + 9);
    doc.setTextColor(...muted); doc.setFontSize(8.3); doc.text(doc.splitTextToSize(safe(inquiry.project_goal) || audience.headline, 105), M, y + 16);
    await addRemoteImage(doc, product.image_url, 133, y + 1, 61, 46);
    y += 53;

    doc.setFillColor(...petrol); doc.roundedRect(M, y, CW, 34, 2, 2, 'F');
    doc.setTextColor(...accent); doc.setFontSize(7); doc.text('PROČ TOTO ŘEŠENÍ', M + 5, y + 7);
    doc.setTextColor(255, 255, 255); doc.setFontSize(7.4);
    audience.benefits.slice(0, 4).forEach((line, i) => doc.text(`• ${line}`, M + 5, y + 14 + i * 5.2));
    y += 42;

    doc.setFillColor(...navy); doc.rect(M, y, CW, 9, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(7.5); doc.text('CENOVÁ KALKULACE', M + 5, y + 5.8); y += 9;
    const basePrice = Number(quote.base_price || 0);
    const installation = Number(quote.installation || 0);
    const discountPercent = Number(quote.discount_percent || 0);
    const priceIsEstimate = Boolean(quote.price_is_estimate);
    const beforeDiscount = basePrice + installation;
    const calculatedFinal = beforeDiscount * (1 - discountPercent / 100);
    const finalTotal = Number(quote.final_total ?? calculatedFinal ?? product.price_from ?? 0);
    const rows = [[priceIsEstimate ? 'Produkt / sestava — orientační cena od' : 'Produkt / sestava', basePrice || Number(product.price_from || 0)], ['Instalace / uvedení do provozu', installation]].filter(([, price]) => price > 0);
    rows.forEach(([label, price], index) => {
      if (index % 2 === 0) { doc.setFillColor(248, 250, 250); doc.rect(M, y, CW, 9, 'F'); }
      doc.setTextColor(...ink); doc.setFontSize(8); doc.text(label, M + 5, y + 5.8); doc.text(`${formatPrice(price)} Kč`, W - M - 5, y + 5.8, { align: 'right' }); y += 9;
    });
    if (discountPercent > 0) {
      doc.setTextColor(32, 145, 110); doc.setFontSize(8); doc.text(`Sleva ${discountPercent} %`, M + 5, y + 5.8);
      doc.text(`-${formatPrice(beforeDiscount - finalTotal)} Kč`, W - M - 5, y + 5.8, { align: 'right' }); y += 9;
    }
    doc.setFillColor(...accent); doc.rect(M, y, CW, 14, 'F');
    doc.setTextColor(...navy); doc.setFontSize(10); doc.text(priceIsEstimate ? 'ORIENTAČNÍ CENA OD · BEZ DPH' : 'CELKEM BEZ DPH', M + 5, y + 9.2);
    doc.setFontSize(12.5); doc.text(finalTotal ? `${formatPrice(finalTotal)} Kč` : 'Cena dle potvrzené konfigurace', W - M - 5, y + 9.2, { align: 'right' }); y += 17;
    if (finalTotal) { doc.setTextColor(...muted); doc.setFontSize(7); doc.text(`DPH 21 %: ${formatPrice(finalTotal * 0.21)} Kč · Celkem s DPH: ${formatPrice(finalTotal * 1.21)} Kč`, W - M, y + 2, { align: 'right' }); }
    y += 7;
    if (priceIsEstimate) { doc.setTextColor(...muted); doc.setFontSize(6.6); doc.text(doc.splitTextToSize('Orientační kalkulace vychází z aktuální katalogové ceny od. Finální cena bude potvrzena podle počtu prvků, rozsahu dodávky, instalace a technického řešení projektu.', CW), M, y); y += 12; }
    y += 2;

    doc.setTextColor(...navy); doc.setFontSize(8.2); doc.text('DALŠÍ KROK', M, y);
    y += 4;
    drawButton(doc, M, y, 57, 'OBJEDNAT NABÍDKU', orderUrl, petrol);
    drawButton(doc, M + 62, y, 57, 'PRODLOUŽIT PLATNOST', extensionUrl, [74, 91, 101]);
    drawButton(doc, M + 124, y, 58, 'UVÉST TERMÍN OBJEDNÁNÍ', timingUrl, [238, 244, 245], navy);
    y += 15;
    doc.setTextColor(...muted); doc.setFontSize(6.7); doc.text(doc.splitTextToSize(`Objednávka se stává závaznou až po elektronickém potvrzení nabídky a obchodních podmínek v zákaznickém portálu. Po potvrzení navazuje výrobní příprava, upřesnění realizace a termínu. Nabídka je platná do ${validUntil}.`, CW), M, y);

    addFooter(doc, 1, 2);

    // PAGE 2 - technical, Smart, terms, contacts
    doc.addPage();
    await addHeader(doc, { type: 'offer', quoteNumber, issued, validUntil });
    y = 52;
    doc.setTextColor(...navy); doc.setFontSize(18); doc.text('Technické a projektové informace', M, y); y += 10;

    const specs = [['Provozní tlak', product.pressure], ['Spotřeba vody', product.water_consumption], ['Materiál', product.material], ['Mlžné trysky / kapka', product.micron_size], ['Výška / dosah', product.coverage_area], ['Napájení / řízení', product.power_supply]].filter((item) => item[1]);
    if (specs.length) {
      doc.setFillColor(...pale); doc.rect(M, y, CW, 8, 'F'); doc.setTextColor(...petrol); doc.setFontSize(8); doc.text('PARAMETRY PRODUKTU', M + 5, y + 5.2); y += 8;
      specs.forEach(([label, value], i) => {
        if (i % 2 === 1) { doc.setFillColor(248, 250, 250); doc.rect(M, y, CW, 10, 'F'); }
        doc.setTextColor(...muted); doc.setFontSize(7.2); doc.text(label, M + 5, y + 6.2);
        doc.setTextColor(...ink); doc.text(doc.splitTextToSize(String(value), 105)[0], M + 66, y + 6.2); y += 10;
      });
      y += 7;
    }

    doc.setFillColor(...navy); doc.roundedRect(M, y, CW, 43, 2, 2, 'F');
    doc.setTextColor(...accent); doc.setFontSize(7.4); doc.text('SMART ŘÍZENÍ MLŽIDLA.CZ', M + 6, y + 8);
    doc.setTextColor(255, 255, 255); doc.setFontSize(10.5); doc.text('Voda jen tehdy, když je potřeba.', M + 6, y + 17);
    doc.setTextColor(210, 228, 232); doc.setFontSize(7.5);
    doc.text(doc.splitTextToSize('Volitelná inteligentní vrstva pro vzdálené ovládání, časové harmonogramy, senzory, snímače, měřiče průtoku a další moduly podle projektu.', CW - 12), M + 6, y + 25);
    y += 51;

    doc.setTextColor(...navy); doc.setFontSize(9); doc.text('ROZSAH A PODMÍNKY NABÍDKY', M, y); y += 7;
    const conditions = [
      `Platnost cenové nabídky: do ${validUntil}. O prodloužení lze požádat elektronicky v portálu.`,
      'Cena se vztahuje na specifikaci uvedenou v této nabídce; změna rozsahu může změnit cenu a termín.',
      'Přesné kotvení, rozměrové návaznosti, rozvody a režim řízení se potvrzují před výrobou podle místa instalace.',
      'Elektronické odsouhlasení nabídky potvrzuje objednávku a souhlas s aktuálními obchodními podmínkami MLŽIDLA.cz / HolmTec.',
      'Po přijetí objednávky navazuje výrobní příprava, potvrzení technických detailů a plán realizace nebo dodání.',
      'Dodavatel: HolmTec s.r.o. · značka MLŽIDLA.cz · kontaktní osoba Ing. Radek Meduna.'
    ];
    conditions.forEach((line) => { doc.setTextColor(...muted); doc.setFontSize(7.5); const lines = doc.splitTextToSize(line, CW - 10); doc.text('•', M + 2, y); doc.text(lines, M + 8, y); y += Math.max(8, lines.length * 4 + 3); });

    y += 2;
    doc.setFillColor(247, 250, 250); doc.roundedRect(M, y, CW, 44, 2, 2, 'F');
    doc.setTextColor(...petrol); doc.setFontSize(7.2); doc.text('INTERAKTIVNÍ NABÍDKA', M + 6, y + 8);
    doc.setTextColor(...ink); doc.setFontSize(9); doc.text('Objednat · požádat o prodloužení · uvést plánovaný termín', M + 6, y + 17);
    doc.setTextColor(...muted); doc.setFontSize(7.2); doc.text(doc.splitTextToSize('V portálu můžete nabídku projít, stáhnout PDF a prezentaci, potvrdit obchodní podmínky, závazně objednat nebo nám poslat orientační termín rozhodnutí.', 118), M + 6, y + 24);
    await addQr(doc, portalUrl, W - M - 34, y + 7, 27);
    doc.link(M, y, CW, 44, { url: portalUrl });

    addFooter(doc, 2, 2);
    const output = new Uint8Array(doc.output('arraybuffer'));
    return Response.json({
      pdf_base64: toBase64(output),
      filename: `${quoteNumber}-${(product.slug || product.name).replace(/[^a-zA-Z0-9-_]/g, '-')}-cenova-nabidka.pdf`,
      quote_number: quoteNumber,
      valid_until: validUntilDate.toISOString(),
      audience_variant: audienceVariant,
      portal_url: portalUrl,
      order_url: orderUrl,
      extension_url: extensionUrl,
      timing_url: timingUrl,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
