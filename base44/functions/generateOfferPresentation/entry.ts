import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { ensureOfferCaseFolders, uploadBytes } from '../../shared/offerDrive.ts';
import { findSmartControlPricing } from '../../shared/pricingSheet.ts';

const DEEP = { red: 0.039, green: 0.086, blue: 0.157 };
const PETROL = { red: 0.043, green: 0.282, blue: 0.376 };
const ACCENT = { red: 0.169, green: 0.749, blue: 0.812 };
const WHITE = { red: 1, green: 1, blue: 1 };
const INK = { red: 0.07, green: 0.11, blue: 0.14 };
const MUTED = { red: 0.36, green: 0.42, blue: 0.46 };
const LIGHT = { red: 0.95, green: 0.97, blue: 0.98 };
const SHARED_DRIVE_NAMES = ['MLZNY DISK', 'MLŽNÝ DISK'];

const AUDIENCE = {
  city_public: {
    eyebrow: 'MĚSTA · OBCE · NÁMĚSTÍ · PARKY',
    problem: 'Horké veřejné plochy potřebují řešení, které zlepší pobytový komfort a současně respektuje architekturu, provoz a správu města.',
    promise: 'Více komfortu ve veřejném prostoru. Méně technického balastu.',
    benefits: ['lokální ochlazení pobytových zón', 'reprezentativní nerezový prvek', 'nízkotlaký provoz bez vysokotlakého čerpadla', 'Smart harmonogramy, senzory a kontrola provozu'],
    proof: 'Řešení je vhodné pro náměstí, parky, pěší zóny, hřiště a další veřejné prostory, kde je důležitá dlouhá životnost, servisovatelnost a vizuální kvalita.'
  },
  residential: {
    eyebrow: 'ZAHRADA · TERASA · VENKOVNÍ WELLBEING',
    problem: 'Venkovní prostor má být místem, kde chcete zůstat i během horkých dnů — bez hlučné techniky a bez vizuálního kompromisu.',
    promise: 'Osvěžení, které se stane součástí zahrady.',
    benefits: ['příjemnější terasa a pobytová zóna', 'čistý nerezový design', 'jednoduché napojení na vodovodní řad', 'volitelné ovládání z mobilu a časové scénáře'],
    proof: 'Produkt lze začlenit do zahrady, terasy, pergoly, okolí bazénu nebo relaxační zóny tak, aby technologie ustoupila prostoru a architektuře.'
  },
  wellness_hospitality: {
    eyebrow: 'WELLNESS · HOTEL · GASTRO · RESORT',
    problem: 'Host si pamatuje komfort, atmosféru a detaily. Venkovní zóna může být příjemná i v nejteplejší části dne.',
    promise: 'Vyšší komfort hostů. Silnější zážitek z prostoru.',
    benefits: ['ochlazení teras a relaxačních zón', 'prémiový vizuální detail', 'tichý provoz bez vysokotlakého agregátu', 'Smart řízení podle času a provozu'],
    proof: 'Vhodné pro hotelové terasy, wellness zahrady, restaurace, resorty, bazénové zóny a další místa, kde je design součástí služby.'
  },
  architecture_design: {
    eyebrow: 'ARCHITEKT · DEVELOPER · KRAJINÁŘ',
    problem: 'Mlha musí fungovat jako součást architektury, ne jako dodatečně přidaná technologie.',
    promise: 'Technicky čistý prvek připravený pro koordinaci s projektem.',
    benefits: ['variantní rozměry a kotvení podle projektu', 'vizualizace a možnost AR ověření', 'nerezové provedení a minimalistická silueta', 'možnost návaznosti na Smart moduly a projektovou dokumentaci'],
    proof: 'Řešení lze koordinovat s povrchy, rozvody, elektro, mobiliářem i krajinářským návrhem a upřesnit před výrobou.'
  },
  custom: {
    eyebrow: 'ZAKÁZKOVÝ PROJEKT',
    problem: 'Některé prostory vyžadují vlastní tvar, jinou konfiguraci nebo řešení, které v katalogu neexistuje.',
    promise: 'Od představy k vyrobitelnému řešení.',
    benefits: ['návrh tvaru podle zadání a prostoru', 'více vizualizačních variant pro výběr', 'technické dopracování kotvení, rozvodů a trysek', 'možnost Smart řízení, senzorů a dalších modulů'],
    proof: 'Zákazník může dodat fotografii, náčrt nebo dokumentaci. Návrh se následně dopracuje do technicky proveditelné podoby.'
  }
};

const fmt = (value) => new Intl.NumberFormat('cs-CZ').format(Number(value || 0));
const dateCs = (value) => new Date(value).toLocaleDateString('cs-CZ');
const toBase64 = (bytes) => { let binary = ''; const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes); arr.forEach((byte) => { binary += String.fromCharCode(byte); }); return btoa(binary); };

async function driveJson(url, accessToken, options = {}) {
  const response = await fetch(url, { ...options, headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', ...(options.headers || {}) } });
  if (!response.ok) throw new Error(`Google API ${response.status}: ${await response.text()}`);
  return response.json();
}

async function findSharedDrive(accessToken) {
  const drives = await driveJson('https://www.googleapis.com/drive/v3/drives?pageSize=100', accessToken);
  return (drives.drives || []).find((drive) => SHARED_DRIVE_NAMES.includes(String(drive.name || '').toUpperCase())) || null;
}

async function findOrCreateFolder(accessToken, name, parentId, driveId) {
  const q = encodeURIComponent(`name='${name.replace(/'/g, "\\'")}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`);
  const scope = driveId ? `&corpora=drive&driveId=${driveId}&includeItemsFromAllDrives=true&supportsAllDrives=true` : '&includeItemsFromAllDrives=true&supportsAllDrives=true';
  const list = await driveJson(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)&pageSize=20${scope}`, accessToken);
  if (list.files?.[0]?.id) return list.files[0].id;
  const created = await driveJson('https://www.googleapis.com/drive/v3/files?fields=id,name&supportsAllDrives=true', accessToken, {
    method: 'POST', body: JSON.stringify({ name, mimeType: 'application/vnd.google-apps.folder', parents: [parentId] })
  });
  return created.id;
}

function shapeText(id, pageId, text, x, y, w, h, size = 16, color = INK, bold = false) {
  return [
    { createShape: { objectId: id, shapeType: 'TEXT_BOX', elementProperties: { pageObjectId: pageId, size: { width: { magnitude: w, unit: 'PT' }, height: { magnitude: h, unit: 'PT' } }, transform: { scaleX: 1, scaleY: 1, translateX: x, translateY: y, unit: 'PT' } } } },
    { insertText: { objectId: id, text } },
    { updateTextStyle: { objectId: id, style: { fontFamily: 'Arial', fontSize: { magnitude: size, unit: 'PT' }, foregroundColor: { opaqueColor: { rgbColor: color } }, bold }, textRange: { type: 'ALL' }, fields: 'fontFamily,fontSize,foregroundColor,bold' } }
  ];
}

function image(id, pageId, url, x, y, w, h) {
  return { createImage: { objectId: id, url, elementProperties: { pageObjectId: pageId, size: { width: { magnitude: w, unit: 'PT' }, height: { magnitude: h, unit: 'PT' } }, transform: { scaleX: 1, scaleY: 1, translateX: x, translateY: y, unit: 'PT' } } } };
}
function background(pageId, color) { return { updatePageProperties: { objectId: pageId, pageProperties: { pageBackgroundFill: { solidFill: { color: { rgbColor: color }, alpha: 1 } } }, fields: 'pageBackgroundFill' } }; }
function accentBar(id, pageId, x, y, w, h, color = ACCENT) { return [
  { createShape: { objectId: id, shapeType: 'RECTANGLE', elementProperties: { pageObjectId: pageId, size: { width: { magnitude: w, unit: 'PT' }, height: { magnitude: h, unit: 'PT' } }, transform: { scaleX: 1, scaleY: 1, translateX: x, translateY: y, unit: 'PT' } } } },
  { updateShapeProperties: { objectId: id, shapeProperties: { shapeBackgroundFill: { solidFill: { color: { rgbColor: color }, alpha: 1 } }, outline: { propertyState: 'NOT_RENDERED' } }, fields: 'shapeBackgroundFill,outline' } }
]; }

async function uploadPdf(accessToken, folderId, bytes, filename) {
  const boundary = `mlzidla_${crypto.randomUUID()}`;
  const metadata = JSON.stringify({ name: filename, mimeType: 'application/pdf', parents: [folderId] });
  const prefix = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n--${boundary}\r\nContent-Type: application/pdf\r\n\r\n`;
  const suffix = `\r\n--${boundary}--`;
  const a = new TextEncoder().encode(prefix), b = new TextEncoder().encode(suffix);
  const body = new Uint8Array(a.length + bytes.length + b.length); body.set(a, 0); body.set(bytes, a.length); body.set(b, a.length + bytes.length);
  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true&fields=id,webViewLink', { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': `multipart/related; boundary=${boundary}` }, body });
  if (!res.ok) throw new Error(`PDF upload failed ${res.status}: ${await res.text()}`);
  const data = await res.json(); return { id: data.id, url: data.webViewLink || `https://drive.google.com/file/d/${data.id}/view` };
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { inquiry = {}, product = {}, quote = {}, ar_capture_url: arCaptureUrl, ar_url: arUrl, approved_visualizations: approvedVisualizations = [], ai_content: aiContent = {}, audience_variant: audienceVariant = 'custom', smart_scenarios: smartScenarios = [] } = body;
    if (!product?.name) return Response.json({ error: 'Product data required' }, { status: 400 });
    const audience = AUDIENCE[audienceVariant] || AUDIENCE.custom;
    const smartPricing = await findSmartControlPricing(base44);

    let realizationImages = [];
    let realizationLabel = 'Produktové reference';
    try {
      const realizations = await base44.asServiceRole.entities.Realizace.filter({ published: true });
      const productKey = `${product.name || ''} ${product.slug || ''}`.toLowerCase();
      const matched = (realizations || []).filter((item) => {
        const used = String(item.product_used || '').toLowerCase().trim();
        return used && (productKey.includes(used) || used.includes(String(product.name || '').toLowerCase()) || String(product.name || '').toLowerCase().includes(used));
      });
      const selected = (matched.length ? matched : (realizations || []).filter((item) => item.featured)).slice(0, 3);
      realizationImages = selected.map((item) => item.image_url).filter(Boolean);
      if (realizationImages.length) realizationLabel = 'Realizované projekty MLŽIDLA.cz';
    } catch (_) {}
    if (!realizationImages.length) realizationImages = (product.gallery_urls || []).filter(Boolean).slice(0, 3);

    const now = quote.issued_at ? new Date(quote.issued_at) : new Date();
    const validUntil = quote.valid_until ? new Date(quote.valid_until) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const quoteNumber = quote.quote_number || `MLZ-${now.getFullYear()}-${String(Date.now()).slice(-6)}`;
    const arQrImageUrl = product.slug === 'mlzitko-bendy' ? 'https://mlzidla.cz/qr/bendy-single-ar.png' : product.slug === 'mlzna-brana-gate' ? 'https://mlzidla.cz/qr/brana-gate-ar.png' : '';
    const portalQrImageUrl = 'https://mlzidla.cz/qr/muj-projekt.png';

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const folders = await ensureOfferCaseFolders(accessToken, {
      quoteNumber,
      clientName: inquiry.company || inquiry.name || inquiry.email || 'klient',
      issuedAt: now,
    });

    const pres = await driveJson('https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink&supportsAllDrives=true', accessToken, {
      method: 'POST', body: JSON.stringify({ name: `${quoteNumber} — ${product.name} — ${inquiry.name || 'klient'}`, mimeType: 'application/vnd.google-apps.presentation', parents: [folders.presentationFolderId] })
    });
    const presentationId = pres.id;
    const initialPresentation = await driveJson(`https://slides.googleapis.com/v1/presentations/${presentationId}`, accessToken);
    const s = Array.from({ length: 9 }, (_, i) => `offer_slide_${i + 1}`);
    const requests = [];
    (initialPresentation.slides || []).forEach((slide) => { if (slide?.objectId) requests.push({ deleteObject: { objectId: slide.objectId } }); });
    for (const id of s) requests.push({ createSlide: { objectId: id, slideLayoutReference: { predefinedLayout: 'BLANK' } } });

    // 1 — emotionally strong cover
    requests.push(background(s[0], DEEP), ...accentBar('a1', s[0], 0, 0, 720, 8));
    requests.push(...shapeText('t1a', s[0], `MLŽIDLA.cz  ·  by HolmTec\n${audience.eyebrow}`, 42, 38, 390, 48, 12, ACCENT, true));
    requests.push(...shapeText('t1b', s[0], audience.promise, 42, 112, 375, 105, 32, WHITE, true));
    requests.push(...shapeText('t1c', s[0], `${aiContent.presentation_title || product.name}\nNávrh řešení pro ${inquiry.company || inquiry.name || 'váš prostor'}`, 42, 245, 350, 74, 17, WHITE, false));
    requests.push(...shapeText('t1d', s[0], `Nabídka ${quoteNumber} · platnost do ${dateCs(validUntil)}`, 42, 353, 420, 25, 11, ACCENT, true));
    if (product.image_url) requests.push(image('img1', s[0], product.image_url, 430, 58, 245, 265));

    // 2 — client project goal
    requests.push(background(s[1], WHITE), ...accentBar('a2', s[1], 0, 0, 12, 405, PETROL));
    requests.push(...shapeText('t2a', s[1], 'Cíl projektu', 48, 42, 300, 40, 26, PETROL, true));
    requests.push(...shapeText('t2b', s[1], aiContent.project_goal || inquiry.message || audience.problem, 48, 105, 610, 115, 20, INK, true));
    requests.push(...shapeText('t2c', s[1], 'Návrh vychází z dodaných podkladů a je připraven jako klientský koncept pro rozhodnutí o dalším technickém dopracování.', 48, 255, 610, 80, 14, MUTED, false));

    // 3 — solution & benefits
    requests.push(background(s[2], LIGHT), ...accentBar('a3', s[2], 0, 0, 720, 8));
    requests.push(...shapeText('t3a', s[2], 'Navržené řešení', 48, 40, 330, 40, 25, PETROL, true));
    requests.push(...shapeText('t3b', s[2], product.name, 48, 92, 330, 50, 30, INK, true));
    requests.push(...shapeText('t3c', s[2], aiContent.solution_summary || product.short_description || 'Architektonické mlžení navržené pro konkrétní prostor.', 48, 150, 330, 85, 15, MUTED, false));
    const clientBenefits = Array.isArray(aiContent.benefits) && aiContent.benefits.length ? aiContent.benefits.slice(0, 4) : audience.benefits;
    requests.push(...shapeText('t3d', s[2], clientBenefits.map((b) => `• ${b}`).join('\n\n'), 48, 245, 330, 125, 14, INK, false));
    if (product.image_url) requests.push(image('img3', s[2], product.image_url, 410, 75, 265, 275));

    // 4 — technical confidence; only verified client-relevant data
    const specs = [product.coverage_area && `Rozměr / dosah: ${product.coverage_area}`, product.material && `Materiál: ${product.material}`, product.power_supply && `Napájení / řízení: ${product.power_supply}`].filter(Boolean).join('\n\n');
    requests.push(background(s[3], WHITE), ...accentBar('a4', s[3], 0, 0, 720, 8));
    requests.push(...shapeText('t4a', s[3], 'Technicky čisté řešení', 48, 42, 460, 45, 25, PETROL, true));
    requests.push(...shapeText('t4b', s[3], specs || 'Přesná technická konfigurace bude potvrzena podle konkrétního místa instalace.', 48, 110, 610, 205, 15, INK, false));
    requests.push(...shapeText('t4c', s[3], audience.proof, 48, 325, 610, 50, 12, MUTED, false));

    // 5 — Smart control
    requests.push(background(s[4], DEEP), ...accentBar('a5', s[4], 0, 0, 720, 8));
    requests.push(...shapeText('t5a', s[4], 'SUPLA — řídicí platforma mlžítek', 48, 46, 560, 42, 27, WHITE, true));
    requests.push(...shapeText('t5b', s[4], 'Automatizace, vzdálená správa a přehled o vodě.', 48, 104, 590, 50, 20, ACCENT, true));
    const waterManagementPrice = (smartPricing.component_water_meter_ex_vat || 0) + (smartPricing.component_liw01_ex_vat || 0);
    const smartPriceText = [
      smartPricing.component_wifi_valve_ex_vat > 0 && `PEVEKO SMART SUPLA Wi‑Fi ventil · ${fmt(smartPricing.component_wifi_valve_ex_vat)} Kč bez DPH`,
      smartPricing.component_row02_ex_vat > 0 && `SUPLA ROW‑02 · Wi‑Fi spínací modul · ${fmt(smartPricing.component_row02_ex_vat)} Kč bez DPH`,
      waterManagementPrice > 0 && `Měření a správa spotřeby vody · ENBRA + LIW‑01 · ${fmt(waterManagementPrice)} Kč bez DPH`,
      smartPricing.component_thw01_ex_vat > 0 && `Teplota + vlhkost · THW‑01 · ${fmt(smartPricing.component_thw01_ex_vat)} Kč bez DPH`,
      smartPricing.complete_supla_ex_vat > 0 && `Kompletní projektové SUPLA řízení · ${fmt(smartPricing.complete_supla_ex_vat)} Kč bez DPH`,
    ].filter(Boolean).join('\n');
    const scenarioText = (Array.isArray(smartScenarios) && smartScenarios.length ? smartScenarios : [
      { label: 'Scénář A · Teplotní automatika', value: '> 25 °C' },
      { label: 'Scénář B · Časový plán', value: 'intervaly a cykly dle provozu' },
      { label: 'Scénář C · Interaktivní sepnutí', value: 'bezkontaktní aktivace na nastavenou dobu' },
    ]).slice(0, 6).map((item) => `• ${item.label}: ${item.value || item.description || ''}`).join('\n');
    requests.push(...shapeText('t5c', s[4], `Doporučené provozní scénáře pro projekt:\n${scenarioText}\n\n${smartPriceText || 'Cena Smart varianty se doplní z aktuálního projektového ceníku.'}`, 48, 150, 610, 185, 13, WHITE, false));
    requests.push(...shapeText('t5d', s[4], audienceVariant === 'city_public' ? 'Doporučení: kompletní SUPLA řízení + monitoring spotřeby vody + klimatické čidlo.' : 'Smart řízení lze sestavit modulárně podle požadovaného komfortu a provozní logiky.', 48, 342, 610, 34, 12, ACCENT, true));

    // 6 — proof / references
    requests.push(background(s[5], WHITE), ...accentBar('a6', s[5], 0, 0, 720, 8));
    requests.push(...shapeText('t6a', s[5], realizationLabel, 42, 34, 500, 40, 25, PETROL, true));
    requests.push(...shapeText('t6b', s[5], 'Skutečné realizace a produktové fotografie pomáhají ověřit měřítko, materiál a charakter řešení.', 42, 78, 625, 45, 13, MUTED, false));
    realizationImages.forEach((url, i) => requests.push(image(`ref${i + 1}`, s[5], url, 42 + i * 216, 145, 195, 185)));
    if (!realizationImages.length) requests.push(...shapeText('t6c', s[5], 'Reference doplníme z databáze realizací MLŽIDLA.cz podle typu projektu.', 42, 170, 620, 55, 16, INK, false));

    // 7 — visualization before decision
    requests.push(background(s[6], LIGHT), ...accentBar('a7', s[6], 0, 0, 14, 405, ACCENT));
    requests.push(...shapeText('t7a', s[6], 'Než objednáte, můžete řešení vidět ve svém prostoru.', 48, 38, 610, 70, 25, PETROL, true));
    requests.push(...shapeText('t7b', s[6], 'Z fotografie, náčrtu nebo dokumentace lze připravit více vizualizačních variant. U zakázkových řešení slouží vizualizace jako první krok k výběru směru, který se následně technicky dopracuje do vyrobitelné podoby.', 48, 118, 610, 105, 15, MUTED, false));
    const presentationVisualUrl = (Array.isArray(approvedVisualizations) ? approvedVisualizations : []).find((item) => item?.approved_for_presentation && item?.is_primary_for_variant)?.image_url
      || (Array.isArray(approvedVisualizations) ? approvedVisualizations : []).find((item) => item?.approved_for_presentation)?.image_url
      || arCaptureUrl;
    if (presentationVisualUrl) requests.push(image('arcap', s[6], presentationVisualUrl, 48, 225, 355, 145));
    if (arQrImageUrl) requests.push(image('arqr', s[6], arQrImageUrl, 465, 230, 100, 100));
    requests.push(...shapeText('t7c', s[6], arUrl ? `AR / vizualizace:\n${arUrl}` : 'AR nebo vizualizace bude připojena podle dostupného modelu a podkladů.', 430, 335, 245, 40, 11, INK, false));

    // 8 — commercial summary
    const price = quote.final_total ?? product.price_from;
    const priceIsEstimate = Boolean(quote.price_is_estimate);
    requests.push(background(s[7], WHITE), ...accentBar('a8', s[7], 0, 0, 720, 8));
    requests.push(...shapeText('t8a', s[7], priceIsEstimate ? 'Orientační investice' : 'Investice do řešení', 48, 44, 420, 45, 27, PETROL, true));
    requests.push(...shapeText('t8b', s[7], price ? `${priceIsEstimate ? 'od ' : ''}${fmt(price)} Kč bez DPH` : 'Cena dle finální konfigurace', 48, 125, 540, 62, 32, INK, true));
    requests.push(...shapeText('t8c', s[7], `Nabídka ${quoteNumber}\nVystaveno: ${dateCs(now)}\nPlatnost: do ${dateCs(validUntil)}\n\n${priceIsEstimate ? 'Uvedená částka je orientační katalogová cena od. Finální cena bude potvrzena podle počtu prvků, rozsahu dodávky, instalace a technického řešení. ' : ''}Rozsah a cena se řídí přiloženou PDF cenovou nabídkou. Před výrobou potvrdíme technické návaznosti, kotvení, rozvody a termín.`, 48, 210, 600, 135, 15, MUTED, false));

    // 9 — next action
    requests.push(background(s[8], DEEP), ...accentBar('a9', s[8], 0, 0, 720, 8));
    requests.push(...shapeText('t9a', s[8], 'Jak chcete pokračovat?', 48, 48, 430, 45, 27, WHITE, true));
    requests.push(...shapeText('t9b', s[8], `${aiContent.next_step ? `${aiContent.next_step}\n\n` : ''}1. Potvrdit a objednat\n2. Požádat o prodloužení platnosti\n3. Uvést přibližný termín objednání\n4. Domluvit technické upřesnění nebo další vizualizaci`, 48, 112, 440, 155, 15, WHITE, false));
    requests.push(...shapeText('t9c', s[8], 'MLŽIDLA.cz by HolmTec\nIng. Radek Meduna\n+420 774 700 390\nmeduna@holmtec.cz · info@mlzidla.cz', 48, 280, 350, 95, 14, ACCENT, true));
    requests.push(image('portalqr', s[8], portalQrImageUrl, 510, 230, 115, 115));
    requests.push(...shapeText('t9d', s[8], 'Otevřít interaktivní nabídku a potvrdit další krok', 438, 350, 235, 30, 10, WHITE, false));

    const slideRes = await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, { method: 'POST', headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ requests }) });
    if (!slideRes.ok) throw new Error(`Slides generation failed ${slideRes.status}: ${await slideRes.text()}`);

    const exportRes = await fetch(`https://www.googleapis.com/drive/v3/files/${presentationId}/export?mimeType=${encodeURIComponent('application/pdf')}&supportsAllDrives=true`, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!exportRes.ok) throw new Error(`Slides export failed ${exportRes.status}: ${await exportRes.text()}`);
    const pdfBytes = new Uint8Array(await exportRes.arrayBuffer());
    const pdfFilename = `${quoteNumber}-${(product.slug || 'produkt')}-${audienceVariant}-prezentace.pdf`;
    const pdf = await uploadBytes(accessToken, folders.presentationFolderId, pdfBytes, pdfFilename, 'application/pdf');

    return Response.json({
      success: true,
      presentation_id: presentationId,
      presentation_url: pres.webViewLink || `https://docs.google.com/presentation/d/${presentationId}/edit`,
      presentation_pdf_url: pdf.url,
      presentation_pdf_base64: toBase64(pdfBytes),
      presentation_filename: pdfFilename,
      drive_folder_id: folders.presentationFolderId,
      drive_case_folder_id: folders.caseFolderId,
      drive_case_folder_url: `https://drive.google.com/drive/folders/${folders.caseFolderId}`,
      quote_number: quoteNumber,
      valid_until: validUntil.toISOString(),
      audience_variant: audienceVariant,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
