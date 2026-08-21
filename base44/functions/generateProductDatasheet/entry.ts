import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { jsPDF } from 'npm:jspdf@4.0.0';
import QRCode from 'npm:qrcode@1.5.4';
import { findPricingForProduct, findSmartControlPricing, validatedCatalogFallback } from '../../shared/pricingSheet.ts';

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
  const logoOk = await addRemoteImage(doc, LOGO_URL, M, 8, 62, 20, { fit: 'contain', alignX: 'left', background: [255, 255, 255], radius: 0 });
  if (!logoOk) addBrand(doc, M, 9, false);
  doc.setFillColor(...pale); doc.setDrawColor(...border); doc.roundedRect(132, 7, 64, 27, 3, 3, 'FD');
  const headerTitle = type === 'offer' ? 'CENOVÁ NABÍDKA' : type === 'product_offer' ? 'PRODUKTOVÁ NABÍDKA' : 'TECHNICKÝ LIST';
  doc.setTextColor(...navy); doc.setFontSize(8.5); doc.text(headerTitle, 191, 13, { align: 'right' });
  doc.setTextColor(...muted); doc.setFontSize(6.4);
  if (type === 'offer') {
    doc.text(`Č. ${quoteNumber}`, 191, 19, { align: 'right' });
    doc.text(`Vystaveno ${issued}`, 191, 25, { align: 'right' });
    doc.text(`Platnost do ${validUntil}`, 191, 31, { align: 'right' });
  } else if (type === 'product_offer') {
    doc.text('MLŽIDLA® / HolmTec', 191, 20, { align: 'right' });
    doc.text('Produktový obchodní podklad', 191, 27, { align: 'right' });
  }
  doc.setDrawColor(...border); doc.line(M, 40, W - M, 40);
}

function addFooter(doc) {
  const W = 210, M = 14;
  const navy = [13, 45, 56], muted = [103, 124, 131], accent = [43, 191, 207];
  doc.setDrawColor(222, 232, 234); doc.line(M, 280, W - M, 280);
  doc.setTextColor(...navy); doc.setFontSize(6.6); doc.text('MLŽIDLA® / HolmTec s.r.o. · Trutnov · Česká republika', M, 285);
  doc.setTextColor(...muted); doc.setFontSize(6.2); doc.text('+420 774 700 390 · meduna@holmtec.cz · info@mlzidla.cz', M, 290);
  doc.setTextColor(...accent); doc.setFontSize(6.5); doc.text('mlzidla.cz', W - M, 290, { align: 'right' });
}

async function addQr(doc, url, x, y, size = 24) {
  if (!url) return;
  try {
    const dataUrl = await QRCode.toDataURL(url, { width: 240, margin: 1, errorCorrectionLevel: 'M' });
    doc.addImage(dataUrl, 'PNG', x, y, size, size);
  } catch (_) {}
}

async function addRemoteImage(doc, url, x, y, w, h, options = {}) {
  if (!url) return false;
  try {
    const response = await fetch(url);
    if (!response.ok) return false;
    const bytes = new Uint8Array(await response.arrayBuffer());
    const mime = response.headers.get('content-type') || 'image/jpeg';
    const format = mime.includes('png') ? 'PNG' : mime.includes('webp') ? 'WEBP' : 'JPEG';
    const dataUrl = `data:${mime};base64,${toBase64(bytes)}`;
    const props = doc.getImageProperties(dataUrl);
    const sourceW = Number(props?.width || 0);
    const sourceH = Number(props?.height || 0);
    if (!(sourceW > 0 && sourceH > 0)) return false;

    const requestedFit = options.fit || 'contain';
    const sourceAspect = sourceW / sourceH;
    const frameAspect = w / h;
    const aspectDelta = Math.abs(sourceAspect - frameAspect) / frameAspect;
    const fit = requestedFit === 'smart' ? (aspectDelta <= 0.16 ? 'cover' : 'contain') : requestedFit;
    const alignX = options.alignX || 'center';
    const alignY = options.alignY || 'center';
    const bg = options.background || [247, 250, 250];
    const radius = Number(options.radius ?? 1.5);

    // Vždy zachovat skutečný poměr stran. Nikdy neroztahovat fotografii
    // na pevnou šířku i výšku současně – to byla příčina deformovaných PDF.
    doc.setFillColor(...bg);
    if (radius > 0) doc.roundedRect(x, y, w, h, radius, radius, 'F');
    else doc.rect(x, y, w, h, 'F');

    const scale = fit === 'cover'
      ? Math.max(w / sourceW, h / sourceH)
      : Math.min(w / sourceW, h / sourceH);
    const drawW = sourceW * scale;
    const drawH = sourceH * scale;
    const dx = alignX === 'left' ? x : alignX === 'right' ? x + w - drawW : x + (w - drawW) / 2;
    const dy = alignY === 'top' ? y : alignY === 'bottom' ? y + h - drawH : y + (h - drawH) / 2;

    if (fit === 'cover') {
      doc.saveGraphicsState();
      doc.rect(x, y, w, h);
      doc.clip();
      doc.discardPath();
      doc.addImage(dataUrl, format, dx, dy, drawW, drawH, undefined, 'MEDIUM');
      doc.restoreGraphicsState();
    } else {
      doc.addImage(dataUrl, format, dx, dy, drawW, drawH, undefined, 'MEDIUM');
    }
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
      visualization_urls: visualizationUrls = [],
      ai_content: aiContent = {},
      smart_scenarios: smartScenarios = [],
      offer_profile: offerProfile = {},
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
    const projectVisuals = Array.isArray(visualizationUrls) ? visualizationUrls.filter(Boolean).slice(0, 4) : [];
    const primaryVisual = projectVisuals[0] || product.image_url || '';
    const projectTitle = safe(aiContent.presentation_title) || `${safe(product.name)} — návrh řešení`;
    const solutionSummary = safe(aiContent.solution_summary) || safe(product.short_description) || audience.headline;
    const projectBenefits = Array.isArray(aiContent.benefits) ? aiContent.benefits.map(safe).filter(Boolean).slice(0, 3) : audience.benefits.slice(0, 3);
    const smartPricing = await findSmartControlPricing(base44);
    const smartVisualUrl = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/5c4b99749_Smartmlzitka-ovladanizmobilu.jpg';

    if (documentType === 'product_offer') {
      const profile = offerProfile || {};
      const productUrl = `https://mlzidla.cz/produkt/${product.slug || ''}`;
      const gallery = [product.image_url, ...(Array.isArray(product.gallery_urls) ? product.gallery_urls : [])]
        .filter(Boolean)
        .filter((url, index, all) => all.indexOf(url) === index)
        .slice(0, 5);
      let productPricing = null;
      try { productPricing = await findPricingForProduct(base44, product, ''); } catch (_) {}
      const profilePrice = Number(profile.unit_price_ex_vat || 0);
      const sheetPrice = productPricing?.matched ? Number(productPricing.offer_price_ex_vat || 0) : 0;
      const fallbackPrice = validatedCatalogFallback(product);
      const pricingStatus = safe(profile.pricing_status) || (profilePrice || sheetPrice || fallbackPrice ? 'ready' : 'manual_required');
      const verifiedPrice = pricingStatus === 'manual_required' ? 0 : (profilePrice || sheetPrice || fallbackPrice || 0);
      const priceMode = safe(profile.pricing_mode);
      const priceCaption = pricingStatus === 'manual_required'
        ? 'PROJEKTOVÁ KALKULACE'
        : priceMode === 'per_module'
          ? 'CENA ZA STANDARDNÍ MODUL'
          : pricingStatus === 'conditional'
            ? 'CENOVÝ ZÁKLAD PRO PROJEKT'
            : 'CENA STANDARDNÍHO PROVEDENÍ';
      const profileBenefits = Array.isArray(profile.benefits) ? profile.benefits.map(safe).filter(Boolean) : [];
      const benefits = (profileBenefits.length ? profileBenefits : audience.benefits).slice(0, 4);
      const configurations = Array.isArray(profile.recommended_configurations) ? profile.recommended_configurations.map(safe).filter(Boolean).slice(0, 6) : [];
      const offerHeadline = safe(profile.offer_headline) || safe(product.short_description) || audience.headline;
      const offerSummary = safe(profile.offer_summary) || safe(product.description) || offerHeadline;
      const priceNote = safe(profile.price_note);

      await addHeader(doc, { type: 'product_offer', quoteNumber, issued, validUntil });
      let y = 50;
      doc.setTextColor(...accent); doc.setFontSize(6.2); doc.text('ARCHITEKTONICKÉ MLŽENÍ / PRODUKTOVÁ ŘADA', M, y);
      doc.setTextColor(...navy); doc.setFontSize(24); doc.text(doc.splitTextToSize(safe(product.name), 150), M, y + 12);
      doc.setTextColor(...muted); doc.setFontSize(8.2); doc.text(doc.splitTextToSize(offerHeadline, 150), M, y + 27);
      const heroY = 88;
      const heroUrl = gallery[0] || product.image_url || '';
      const heroOk = await addRemoteImage(doc, heroUrl, M, heroY, CW, 103, { fit: gallery.length > 1 ? 'smart' : 'contain', background: [247, 250, 250] });
      if (!heroOk) {
        doc.setFillColor(...pale); doc.roundedRect(M, heroY, CW, 103, 2, 2, 'F');
        doc.setTextColor(...muted); doc.setFontSize(8); doc.text('Produktová vizualizace není k dispozici.', M + 8, heroY + 52);
      }
      y = 199;
      doc.setFillColor(...navy); doc.roundedRect(M, y, CW, 43, 2, 2, 'F');
      doc.setTextColor(...accent); doc.setFontSize(5.8); doc.text(priceCaption, M + 7, y + 8);
      doc.setTextColor(255, 255, 255); doc.setFontSize(16);
      doc.text(verifiedPrice > 0 ? `${formatPrice(verifiedPrice)} Kč` : 'Individuální nacenění', M + 7, y + 20);
      doc.setTextColor(190, 220, 224); doc.setFontSize(6.2); doc.text(verifiedPrice > 0 ? 'bez DPH' : 'po technickém upřesnění konfigurace', M + 7, y + 28);
      if (priceNote) doc.text(doc.splitTextToSize(priceNote, 96).slice(0, 2), M + 7, y + 35);
      doc.setFillColor(255, 255, 255); doc.roundedRect(M + 122, y + 7, 53, 29, 2, 2, 'F');
      doc.setTextColor(...petrol); doc.setFontSize(6); doc.text('STAV CENY', M + 128, y + 14);
      doc.setTextColor(...ink); doc.setFontSize(7.3);
      doc.text(pricingStatus === 'ready' ? 'Ověřená cena' : pricingStatus === 'conditional' ? 'Cena podmíněná rozsahem' : 'Projektová kalkulace', M + 128, y + 22);
      doc.setTextColor(...muted); doc.setFontSize(5.7); doc.text('Neověřené hodnoty se nedopočítávají.', M + 128, y + 29);
      y = 249;
      drawButton(doc, M, y, 68, 'DETAIL PRODUKTU', productUrl, petrol);
      drawButton(doc, M + 74, y, 68, 'NEZÁVAZNÁ POPTÁVKA', 'https://mlzidla.cz/poptavka', [13, 45, 56]);
      await addQr(doc, productUrl, W - M - 29, y - 1, 24);
      addFooter(doc);

      doc.addPage();
      await addHeader(doc, { type: 'product_offer', quoteNumber, issued, validUntil });
      y = 50;
      doc.setTextColor(...accent); doc.setFontSize(6.2); doc.text('DESIGN / TECHNIKA / KONFIGURACE', M, y);
      doc.setTextColor(...navy); doc.setFontSize(19); doc.text('Produkt v detailu.', M, y + 10);
      doc.setTextColor(...muted); doc.setFontSize(7.4); doc.text(doc.splitTextToSize(offerSummary, CW), M, y + 21);
      y = 82;
      const page2Images = gallery.slice(1, 4);
      if (page2Images.length) {
        for (let i = 0; i < page2Images.length; i += 1) {
          const count = Math.min(page2Images.length, 3);
          const gap = 4;
          const w = (CW - gap * (count - 1)) / count;
          await addRemoteImage(doc, page2Images[i], M + i * (w + gap), y, w, 62, { fit: 'smart', background: [247, 250, 250] });
        }
      } else {
        await addRemoteImage(doc, heroUrl, M, y, CW, 62, { fit: 'contain', background: [247, 250, 250] });
      }
      y = 153;
      const specs = [
        ['Materiál', product.material],
        ['Pracovní tlak', product.pressure],
        ['Spotřeba vody', product.water_consumption],
        ['Velikost kapek', product.micron_size],
        ['Dosah / plocha', product.coverage_area],
        ['Napájení / řízení', product.power_supply],
      ].filter((item) => safe(item[1]));
      doc.setFillColor(...pale); doc.roundedRect(M, y, 89, 83, 2, 2, 'F');
      doc.setTextColor(...petrol); doc.setFontSize(6.2); doc.text('OVĚŘENÉ TECHNICKÉ ÚDAJE', M + 6, y + 8);
      let specY = y + 18;
      if (specs.length) {
        specs.slice(0, 6).forEach(([label, value]) => {
          doc.setTextColor(...muted); doc.setFontSize(5.9); doc.text(label, M + 6, specY);
          doc.setTextColor(...ink); doc.setFontSize(6.4); doc.text(doc.splitTextToSize(safe(value), 49)[0], M + 38, specY);
          specY += 10;
        });
      } else {
        doc.setTextColor(...muted); doc.setFontSize(6.2); doc.text(doc.splitTextToSize('Technické parametry, které nejsou potvrzené ve zdrojových datech, záměrně nezobrazujeme. Use null when unknown / do not infer.', 76), M + 6, specY);
      }
      doc.setFillColor(248, 250, 250); doc.roundedRect(M + 95, y, 87, 83, 2, 2, 'F');
      doc.setTextColor(...petrol); doc.setFontSize(6.2); doc.text('HLAVNÍ PŘÍNOSY', M + 101, y + 8);
      let benefitY = y + 18;
      benefits.forEach((item) => {
        doc.setFillColor(...accent); doc.circle(M + 104, benefitY - 1.7, 1.2, 'F');
        doc.setTextColor(...ink); doc.setFontSize(6.4); doc.text(doc.splitTextToSize(item, 68), M + 109, benefitY);
        benefitY += 13;
      });
      if (configurations.length) {
        doc.setTextColor(...petrol); doc.setFontSize(6.2); doc.text('DOPORUČENÉ KONFIGURACE', M + 101, y + 62);
        doc.setTextColor(...muted); doc.setFontSize(6); doc.text(doc.splitTextToSize(configurations.join(' · '), 70), M + 101, y + 71);
      }
      doc.setTextColor(...muted); doc.setFontSize(5.8); doc.text('Pozn.: Neznámé technické hodnoty zůstávají prázdné a nejsou odvozovány z podobných produktů.', M, 247);
      addFooter(doc);

      doc.addPage();
      await addHeader(doc, { type: 'product_offer', quoteNumber, issued, validUntil });
      y = 50;
      doc.setTextColor(...accent); doc.setFontSize(6.2); doc.text('SMART COOLING / PROJEKTOVÁ PÉČE', M, y);
      doc.setTextColor(...navy); doc.setFontSize(19); doc.text('Od produktu k hotovému řešení.', M, y + 10);
      doc.setTextColor(...muted); doc.setFontSize(7.4); doc.text(doc.splitTextToSize('Produkt lze doplnit o chytré řízení, měření spotřeby a projektovou přípravu. Konkrétní sestava se volí podle prostoru, provozu a požadované úrovně automatizace.', 116), M, y + 21);
      await addRemoteImage(doc, smartVisualUrl, 139, 49, 57, 49, { fit: 'contain', background: [255, 255, 255] });
      y = 108;
      const smartItems = [
        ['Wi-Fi ventil SUPLA', smartPricing.component_wifi_valve_ex_vat, 'Vzdálené otevření, uzavření a časové řízení vodní větve.'],
        ['Měření spotřeby', Number(smartPricing.component_water_meter_ex_vat || 0) + Number(smartPricing.component_liw01_ex_vat || 0), 'Přehled spotřeby vody a provozních dat.'],
        ['Teplota + vlhkost', smartPricing.component_thw01_ex_vat, 'Automatizace podle klimatických podmínek.'],
        ['Kompletní SUPLA řízení', smartPricing.complete_supla_ex_vat, 'Projektové řízení, konfigurace a uvedení do provozu.'],
      ];
      smartItems.forEach((item, i) => {
        const x = M + (i % 2) * 94;
        const cy = y + Math.floor(i / 2) * 47;
        doc.setFillColor(i === 3 ? 238 : 248, i === 3 ? 248 : 250, i === 3 ? 249 : 250); doc.roundedRect(x, cy, 88, 42, 2, 2, 'F');
        doc.setTextColor(...navy); doc.setFontSize(8); doc.text(item[0], x + 5, cy + 10);
        doc.setTextColor(...petrol); doc.setFontSize(9.5); doc.text(Number(item[1] || 0) > 0 ? `${formatPrice(item[1])} Kč` : 'dle projektu', x + 5, cy + 20);
        doc.setTextColor(...muted); doc.setFontSize(5.8); doc.text(doc.splitTextToSize(item[2], 76), x + 5, cy + 29);
      });
      y = 210;
      doc.setFillColor(...navy); doc.roundedRect(M, y, CW, 50, 2, 2, 'F');
      doc.setTextColor(...accent); doc.setFontSize(6.1); doc.text('PROJEKTOVÝ POSTUP', M + 7, y + 9);
      const steps = ['01  Konzultace prostoru', '02  Volba produktu a konfigurace', '03  Vizualizace a technické upřesnění', '04  Nabídka, výroba a instalace'];
      steps.forEach((step, i) => {
        const x = M + 7 + (i % 2) * 86;
        const sy = y + 19 + Math.floor(i / 2) * 13;
        doc.setTextColor(255, 255, 255); doc.setFontSize(6.8); doc.text(step, x, sy);
      });
      doc.setTextColor(190, 220, 224); doc.setFontSize(5.9); doc.text('Technik projektu: Ing. Radek Meduna  |  +420 774 700 390  |  meduna@holmtec.cz', M + 7, y + 44);
      await addQr(doc, 'https://mlzidla.cz/poptavka', W - M - 30, 246, 25);
      doc.setTextColor(...petrol); doc.setFontSize(7); doc.text('Pošlete prostor nebo zadání.', M, 250);
      doc.setTextColor(...muted); doc.setFontSize(6.1); doc.text('Vyhodnotíme vhodnou konfiguraci, vyrobitelnost a připravíme cenovou nabídku.', M, 258);
      addFooter(doc);

      const output = new Uint8Array(doc.output('arraybuffer'));
      return Response.json({
        pdf_base64: toBase64(output),
        filename: `MLZIDLA-${(product.slug || product.name).replace(/[^a-zA-Z0-9-_]/g, '-')}-produktova-nabidka.pdf`,
        product_slug: product.slug || '',
        pricing_status: pricingStatus,
        unit_price_ex_vat: verifiedPrice,
      });
    }

    if (documentType !== 'offer') {
      await addHeader(doc, { type: 'datasheet', quoteNumber, issued, validUntil });
      let y = 56;
      doc.setTextColor(...navy); doc.setFontSize(23); doc.text(product.name, M, y); y += 10;
      if (product.short_description) { doc.setTextColor(...muted); doc.setFontSize(9.2); doc.text(doc.splitTextToSize(safe(product.short_description), CW), M, y); y += 17; }
      if (product.image_url) { const ok = await addRemoteImage(doc, product.image_url, M, y, CW, 72, { fit: 'contain', background: [255, 255, 255] }); if (ok) y += 81; }
      const specs = [['Materiál', product.material], ['Rozměr / dosah', product.coverage_area], ['Napájení a řízení', product.power_supply]].filter((item) => item[1]);
      if (specs.length) {
        doc.setFillColor(...pale); doc.rect(M, y, CW, 8, 'F'); doc.setTextColor(...petrol); doc.setFontSize(8); doc.text('TECHNICKÉ PARAMETRY', M + 5, y + 5.2); y += 8;
        specs.forEach(([name, value], i) => { if (i % 2) { doc.setFillColor(249, 251, 251); doc.rect(M, y, CW, 8, 'F'); } doc.setTextColor(...muted); doc.setFontSize(7.5); doc.text(name, M + 5, y + 5.1); doc.setTextColor(...ink); doc.text(doc.splitTextToSize(String(value), 105)[0], M + 70, y + 5.1); y += 8; });
      }
      addFooter(doc, 1, 1);
      const output = new Uint8Array(doc.output('arraybuffer'));
      return Response.json({ pdf_base64: toBase64(output), filename: `MLZIDLA-${(product.slug || product.name).replace(/[^a-zA-Z0-9-_]/g, '-')}-technicky-list.pdf` });
    }

    // A4 BOARD 1 — project proposal, visualization and investment
    // Pokud obchodník neposlal explicitní cenu, nabídka si ji ověří přímo proti
    // centrální tabulce Kalkulace 2026. Hodnoty 0/1 Kč z katalogu jsou pouze
    // placeholdery a nikdy se nesmí propsat do klientské nabídky.
    let resolvedPricing = null;
    try {
      resolvedPricing = await findPricingForProduct(base44, product, inquiry.project_goal || inquiry.message || '');
    } catch (_) {}
    const sheetPrice = resolvedPricing?.matched ? Number(resolvedPricing.offer_price_ex_vat || 0) : 0;
    const catalogFallback = validatedCatalogFallback(product);
    const suppliedBasePrice = Number(quote.base_price || 0);
    const basePrice = suppliedBasePrice > 0 ? suppliedBasePrice : (sheetPrice || catalogFallback || 0);
    const installation = Number(quote.installation || 0);
    const requestedQuantity = Math.max(1, Number(quote.quantity || 1));
    const requestedDiscountPercent = Number(quote.discount_percent || 0);
    const discountPercent = [2, 3].includes(requestedQuantity) ? Math.max(0, requestedDiscountPercent) : 0;
    const priceIsEstimate = Boolean(quote.price_is_estimate || (!sheetPrice && catalogFallback > 0));
    const beforeDiscount = basePrice + installation;
    const calculatedFinal = beforeDiscount * (1 - discountPercent / 100);
    const explicitFinalTotal = Number(quote.final_total || 0);
    const finalTotal = explicitFinalTotal > 0 ? explicitFinalTotal : calculatedFinal;

    await addHeader(doc, { type: 'offer', quoteNumber, issued, validUntil });
    let y = 48;
    doc.setTextColor(...accent); doc.setFontSize(6.4); doc.text('PROJEKTOVÝ NÁVRH · INVESTIČNÍ NABÍDKA', M, y);
    doc.setTextColor(...navy); doc.setFontSize(18.5); doc.text(doc.splitTextToSize(projectTitle, 150), M, y + 9);
    const clientLine = [safe(inquiry.company), safe(inquiry.name)].filter(Boolean).join(' · ') || 'Projekt klienta';
    doc.setTextColor(...muted); doc.setFontSize(7); doc.text(clientLine, M, y + 22);
    doc.setTextColor(...petrol); doc.text(audience.label.toUpperCase(), W - M, y + 22, { align: 'right' });

    const visualY = 76;
    const visualOk = await addRemoteImage(doc, primaryVisual, M, visualY, CW, 92, { fit: projectVisuals.length ? 'smart' : 'contain', background: [243, 248, 249] });
    if (!visualOk) {
      doc.setFillColor(...pale); doc.roundedRect(M, visualY, CW, 92, 2, 2, 'F');
      doc.setTextColor(...muted); doc.setFontSize(8); doc.text('Projektová vizualizace bude doplněna z podkladů projektu.', M + 8, visualY + 46);
    }
    doc.setFillColor(255, 255, 255); doc.roundedRect(M + 6, visualY + 72, 72, 14, 2, 2, 'F');
    doc.setTextColor(...petrol); doc.setFontSize(6.4); doc.text('NÁVRH ŘEŠENÍ', M + 11, visualY + 78);
    doc.setTextColor(...ink); doc.setFontSize(7.4); doc.text(product.name, M + 11, visualY + 83.5);

    y = 176;
    doc.setFillColor(248, 250, 250); doc.roundedRect(M, y, 112, 48, 2, 2, 'F');
    doc.setTextColor(...petrol); doc.setFontSize(6.5); doc.text('KONCEPT', M + 6, y + 8);
    doc.setTextColor(...ink); doc.setFontSize(7.5); doc.text(doc.splitTextToSize(solutionSummary, 100), M + 6, y + 16);
    doc.setTextColor(...muted); doc.setFontSize(6.5);
    projectBenefits.slice(0, 2).forEach((line, i) => doc.text(doc.splitTextToSize(`• ${line}`, 100), M + 6, y + 31 + i * 7));

    doc.setFillColor(238, 248, 249); doc.roundedRect(M + 118, y, 64, 48, 2, 2, 'F');
    doc.setTextColor(...petrol); doc.setFontSize(6.5); doc.text(priceIsEstimate ? 'ORIENTAČNÍ INVESTICE OD' : 'INVESTICE DO ŘEŠENÍ', M + 124, y + 8);
    doc.setTextColor(...navy); doc.setFontSize(15); doc.text(finalTotal ? `${formatPrice(finalTotal)} Kč` : 'dle konfigurace', M + 124, y + 20);
    doc.setTextColor(...muted); doc.setFontSize(6.3); doc.text('bez DPH', M + 124, y + 26);
    if (finalTotal) doc.text(`s DPH ${formatPrice(finalTotal * 1.21)} Kč`, M + 124, y + 33);
    doc.text(`platnost do ${validUntil}`, M + 124, y + 40);

    y = 232;
    drawButton(doc, M, y, 56, 'OTEVŘÍT MŮJ PROJEKT', portalUrl, petrol);
    drawButton(doc, M + 62, y, 55, 'POTVRDIT NABÍDKU', orderUrl, [13, 45, 56]);
    drawButton(doc, M + 123, y, 59, 'UPŘESNIT / PRODLOUŽIT', extensionUrl, [238, 244, 245], navy);
    doc.setTextColor(...muted); doc.setFontSize(6.4); doc.text(doc.splitTextToSize('Vizualizace je projektový návrh pro rozhodnutí o směru řešení. Finální umístění, kotvení a technické návaznosti se potvrzují před výrobou.', CW), M, y + 18);
    addFooter(doc);

    // A4 BOARD 2 — Smart control variants and verified pricing
    doc.addPage();
    await addHeader(doc, { type: 'offer', quoteNumber, issued, validUntil });
    y = 50;
    doc.setTextColor(...accent); doc.setFontSize(6.4); doc.text('SMART ŘÍZENÍ MLŽIDLA®', M, y);
    doc.setTextColor(...navy); doc.setFontSize(19); doc.text('Ovládání navržené pro konkrétní provoz.', M, y + 10);
    doc.setTextColor(...muted); doc.setFontSize(8); doc.text(doc.splitTextToSize('Od jednoduchého vzdáleného otevření vody po plně automatický systém SUPLA s časovými scénáři, teplotou, monitoringem spotřeby a správou v mobilní aplikaci.', 112), M, y + 20);
    await addRemoteImage(doc, smartVisualUrl, 137, 49, 59, 48, { fit: 'contain', background: [255, 255, 255] });

    y = 106;
    const smartCards = [
      { title: 'PEVEKO Wi‑Fi ventil', price: smartPricing.component_wifi_valve_ex_vat, tag: '01 · OVLÁDÁNÍ VODY', text: 'SMART SUPLA Wi‑Fi servomotorický ventil DN25. Vzdálené otevření a uzavření vodní větve.' },
      { title: 'Měření vody', price: (smartPricing.component_water_meter_ex_vat || 0) + (smartPricing.component_liw01_ex_vat || 0), tag: '02 · SPOTŘEBA A DATA', text: 'ENBRA vodoměr + SUPLA LIW‑01. Historie spotřeby, provozní přehled a vyhodnocení sezóny.' },
      { title: 'Teplota + vlhkost', price: smartPricing.component_thw01_ex_vat, tag: '03 · KLIMATICKÁ LOGIKA', text: 'SUPLA THW‑01 jako vstup pro automatické spouštění, blokaci a provozní scénáře podle podmínek.' },
      { title: 'Kompletní SUPLA', price: smartPricing.complete_supla_ex_vat, tag: audienceVariant === 'city_public' ? '04 · DOPORUČENO' : '04 · KOMPLETNÍ ŘÍZENÍ', text: 'Ventil, rozvaděč, Wi‑Fi, SUPLA, měření spotřeby, konfigurace, programování a uvedení do provozu.' },
    ];
    smartCards.forEach((card, i) => {
      const x = M + (i % 2) * 94;
      const cardY = y + Math.floor(i / 2) * 52;
      const featured = i === 3;
      doc.setFillColor(featured ? 238 : 248, featured ? 248 : 250, featured ? 249 : 250); doc.setDrawColor(221, 231, 233); doc.roundedRect(x, cardY, 88, 47, 2, 2, 'FD');
      doc.setTextColor(...accent); doc.setFontSize(5.3); doc.text(card.tag, x + 5, cardY + 7);
      doc.setTextColor(...navy); doc.setFontSize(9); doc.text(card.title, x + 5, cardY + 15);
      doc.setTextColor(...petrol); doc.setFontSize(10.5); doc.text(card.price ? `${formatPrice(card.price)} Kč` : 'cena dle projektu', x + 5, cardY + 25);
      doc.setTextColor(...muted); doc.setFontSize(5.7); doc.text(card.price ? 'bez DPH' : '', x + 5, cardY + 30);
      doc.setTextColor(...ink); doc.setFontSize(5.9); doc.text(doc.splitTextToSize(card.text, 78), x + 5, cardY + 36);
    });

    y = 214;
    doc.setFillColor(...navy); doc.roundedRect(M, y, CW, 43, 2, 2, 'F');
    doc.setTextColor(...accent); doc.setFontSize(6.5); doc.text('CO UMÍ APLIKACE SUPLA', M + 7, y + 8);
    doc.setTextColor(255, 255, 255); doc.setFontSize(7.2);
    const selectedScenarios = Array.isArray(smartScenarios) && smartScenarios.length ? smartScenarios.slice(0, 6) : [
      { label: 'Scénář A · Teplotní automatika', description: 'Aktivace mlžení pouze při překročení nastavené venkovní teploty.', value: '> 25 °C' },
      { label: 'Scénář B · Časový plán', description: 'Provoz v definovaných intervalech během dne.', value: 'čas a cykly dle provozu' },
      { label: 'Scénář C · Interaktivní sepnutí', description: 'Start mlžení po aktivaci bezkontaktním senzorem.', value: 'čas sepnutí dle projektu' },
    ];
    selectedScenarios.forEach((scenario, i) => {
      const x = M + 7 + (i > 2 ? 86 : 0);
      const sy = y + 15 + (i % 3) * 8;
      doc.setTextColor(255, 255, 255); doc.setFontSize(6.5); doc.text(`• ${safe(scenario.label)}`, x, sy);
      doc.setTextColor(190, 220, 224); doc.setFontSize(5.5); doc.text(doc.splitTextToSize(`${safe(scenario.value)} — ${safe(scenario.description)}`, 78), x + 3, sy + 3.7);
    });
    doc.setTextColor(...muted); doc.setFontSize(6.2); doc.text(doc.splitTextToSize(`Zdroj cen: ${smartPricing.source}. Ceny Smart prvků jsou volitelné a nejsou zahrnuté v základní ceně projektu, pokud není v nabídce uvedeno jinak.`, CW), M, 263);
    addFooter(doc);

    // A4 BOARD 3 — project information, visual variants and next step
    doc.addPage();
    await addHeader(doc, { type: 'offer', quoteNumber, issued, validUntil });
    y = 50;
    doc.setTextColor(...accent); doc.setFontSize(6.4); doc.text('PROJEKTOVÉ PODKLADY', M, y);
    doc.setTextColor(...navy); doc.setFontSize(19); doc.text('Řešení připravené k technickému dopracování.', M, y + 10);
    doc.setTextColor(...muted); doc.setFontSize(7.5); doc.text(doc.splitTextToSize(safe(inquiry.project_goal) || audience.headline, CW), M, y + 21);

    y = 82;
    const boardVisuals = projectVisuals.length ? projectVisuals.slice(0, 3) : [primaryVisual].filter(Boolean);
    if (boardVisuals.length === 1) {
      await addRemoteImage(doc, boardVisuals[0], M, y, 112, 72, { fit: 'smart', background: [243, 248, 249] });
      await addRemoteImage(doc, product.image_url, M + 118, y, 64, 72, { fit: 'contain', background: [255, 255, 255] });
    } else {
      for (let i = 0; i < boardVisuals.length; i += 1) await addRemoteImage(doc, boardVisuals[i], M + i * 61, y, 57, 70, { fit: 'smart', background: [243, 248, 249] });
    }

    y = 162;
    const specs = [['Materiál', product.material], ['Rozměr / dosah', product.coverage_area], ['Napájení / řízení', product.power_supply]].filter((item) => item[1]);
    doc.setFillColor(...pale); doc.roundedRect(M, y, 88, 50, 2, 2, 'F');
    doc.setTextColor(...petrol); doc.setFontSize(6.5); doc.text('OVĚŘENÉ PROJEKTOVÉ ÚDAJE', M + 6, y + 8);
    let sy = y + 17;
    specs.forEach(([label, value]) => { doc.setTextColor(...muted); doc.setFontSize(6.1); doc.text(label, M + 6, sy); doc.setTextColor(...ink); doc.text(doc.splitTextToSize(String(value), 50)[0], M + 35, sy); sy += 8; });
    if (!specs.length) { doc.setTextColor(...muted); doc.setFontSize(6.4); doc.text(doc.splitTextToSize('Technické hodnoty, které nejsou ověřené v projektových podkladech nebo tabulkách, v nabídce záměrně neuvádíme.', 76), M + 6, sy); }

    doc.setFillColor(248, 250, 250); doc.roundedRect(M + 94, y, 88, 50, 2, 2, 'F');
    doc.setTextColor(...petrol); doc.setFontSize(6.5); doc.text('DALŠÍ KROK', M + 100, y + 8);
    doc.setTextColor(...ink); doc.setFontSize(7.2); doc.text(doc.splitTextToSize(safe(aiContent.next_step) || 'Po odsouhlasení návrhu upřesníme umístění, kotvení, rozsah dodávky, Smart variantu a realizační návaznosti.', 76), M + 100, y + 17);

    y = 222;
    doc.setFillColor(238, 248, 249); doc.roundedRect(M, y, CW, 40, 2, 2, 'F');
    doc.setTextColor(...petrol); doc.setFontSize(7); doc.text('MŮJ PROJEKT', M + 7, y + 9);
    doc.setTextColor(...ink); doc.setFontSize(8.5); doc.text('Nabídka, vizualizace a dokumenty na jednom místě.', M + 7, y + 18);
    doc.setTextColor(...muted); doc.setFontSize(6.5); doc.text('Přihlášení číslem nabídky a ověřovacím kódem na klientský e-mail.', M + 7, y + 27);
    await addQr(doc, portalUrl, W - M - 33, y + 6, 27);
    doc.link(M, y, CW, 40, { url: portalUrl });
    addFooter(doc);
    const output = new Uint8Array(doc.output('arraybuffer'));
    return Response.json({
      pdf_base64: toBase64(output),
      filename: `${quoteNumber}-${(product.slug || product.name).replace(/[^a-zA-Z0-9-_]/g, '-')}-cenova-nabidka.pdf`,
      quote_number: quoteNumber,
      valid_until: validUntilDate.toISOString(),
      audience_variant: audienceVariant,
      smart_pricing: smartPricing,
      portal_url: portalUrl,
      order_url: orderUrl,
      extension_url: extensionUrl,
      timing_url: timingUrl,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
