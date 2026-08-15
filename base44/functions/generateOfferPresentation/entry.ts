import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const DEEP = { red: 0.043, green: 0.282, blue: 0.376 };
const ACCENT = { red: 0.38, green: 0.835, blue: 0.898 };
const WHITE = { red: 1, green: 1, blue: 1 };
const INK = { red: 0.07, green: 0.11, blue: 0.14 };
const MUTED = { red: 0.36, green: 0.42, blue: 0.46 };
const LIGHT = { red: 0.95, green: 0.97, blue: 0.98 };

const fmt = (value) => new Intl.NumberFormat('cs-CZ').format(Number(value || 0));
const dateCs = (value) => new Date(value).toLocaleDateString('cs-CZ');
const toBase64 = (bytes) => {
  let binary = '';
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  arr.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
};

async function driveJson(url, accessToken, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!response.ok) throw new Error(`Google API ${response.status}: ${await response.text()}`);
  return response.json();
}

async function findOrCreateFolder(accessToken, name) {
  const q = encodeURIComponent(`name='${name.replace(/'/g, "\\'")}' and mimeType='application/vnd.google-apps.folder' and trashed=false`);
  const list = await driveJson(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)&pageSize=10`, accessToken);
  if (list.files?.[0]?.id) return list.files[0].id;
  const created = await driveJson('https://www.googleapis.com/drive/v3/files?fields=id,name', accessToken, {
    method: 'POST',
    body: JSON.stringify({ name, mimeType: 'application/vnd.google-apps.folder' }),
  });
  return created.id;
}

function shapeText(id, pageId, text, x, y, w, h, size = 16, color = INK, bold = false) {
  return [
    {
      createShape: {
        objectId: id,
        shapeType: 'TEXT_BOX',
        elementProperties: {
          pageObjectId: pageId,
          size: { width: { magnitude: w, unit: 'PT' }, height: { magnitude: h, unit: 'PT' } },
          transform: { scaleX: 1, scaleY: 1, translateX: x, translateY: y, unit: 'PT' },
        },
      },
    },
    { insertText: { objectId: id, text } },
    {
      updateTextStyle: {
        objectId: id,
        style: {
          fontFamily: 'Arial',
          fontSize: { magnitude: size, unit: 'PT' },
          foregroundColor: { opaqueColor: { rgbColor: color } },
          bold,
        },
        textRange: { type: 'ALL' },
        fields: 'fontFamily,fontSize,foregroundColor,bold',
      },
    },
  ];
}

function image(id, pageId, url, x, y, w, h) {
  return {
    createImage: {
      objectId: id,
      url,
      elementProperties: {
        pageObjectId: pageId,
        size: { width: { magnitude: w, unit: 'PT' }, height: { magnitude: h, unit: 'PT' } },
        transform: { scaleX: 1, scaleY: 1, translateX: x, translateY: y, unit: 'PT' },
      },
    },
  };
}

function background(pageId, color) {
  return {
    updatePageProperties: {
      objectId: pageId,
      pageProperties: { pageBackgroundFill: { solidFill: { color: { rgbColor: color }, alpha: 1 } } },
      fields: 'pageBackgroundFill',
    },
  };
}

function accentBar(id, pageId, x, y, w, h, color = ACCENT) {
  return [
    {
      createShape: {
        objectId: id,
        shapeType: 'RECTANGLE',
        elementProperties: {
          pageObjectId: pageId,
          size: { width: { magnitude: w, unit: 'PT' }, height: { magnitude: h, unit: 'PT' } },
          transform: { scaleX: 1, scaleY: 1, translateX: x, translateY: y, unit: 'PT' },
        },
      },
    },
    {
      updateShapeProperties: {
        objectId: id,
        shapeProperties: {
          shapeBackgroundFill: { solidFill: { color: { rgbColor: color }, alpha: 1 } },
          outline: { propertyState: 'NOT_RENDERED' },
        },
        fields: 'shapeBackgroundFill,outline',
      },
    },
  ];
}

async function uploadPdf(accessToken, folderId, bytes, filename) {
  const boundary = `mlzidla_${crypto.randomUUID()}`;
  const metadata = JSON.stringify({ name: filename, mimeType: 'application/pdf', parents: [folderId] });
  const prefix = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n--${boundary}\r\nContent-Type: application/pdf\r\n\r\n`;
  const suffix = `\r\n--${boundary}--`;
  const body = new Uint8Array(new TextEncoder().encode(prefix).length + bytes.length + new TextEncoder().encode(suffix).length);
  let offset = 0;
  const a = new TextEncoder().encode(prefix); body.set(a, offset); offset += a.length;
  body.set(bytes, offset); offset += bytes.length;
  body.set(new TextEncoder().encode(suffix), offset);
  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': `multipart/related; boundary=${boundary}` },
    body,
  });
  if (!res.ok) throw new Error(`PDF upload failed ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { id: data.id, url: data.webViewLink || `https://drive.google.com/file/d/${data.id}/view` };
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { inquiry = {}, product = {}, quote = {}, ar_capture_url: arCaptureUrl, ar_url: arUrl } = body;
    if (!product?.name) return Response.json({ error: 'Product data required' }, { status: 400 });

    const now = quote.issued_at ? new Date(quote.issued_at) : new Date();
    const validUntil = quote.valid_until ? new Date(quote.valid_until) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const quoteNumber = quote.quote_number || `MLZ-${now.getFullYear()}-${String(Date.now()).slice(-6)}`;
    const arQrImageUrl = product.slug === 'mlzitko-bendy'
      ? 'https://mlzidla.cz/qr/bendy-single-ar.png'
      : product.slug === 'mlzna-brana-gate'
        ? 'https://mlzidla.cz/qr/brana-gate-ar.png'
        : '';
    const portalQrImageUrl = 'https://mlzidla.cz/qr/muj-projekt.png';
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const folderId = await findOrCreateFolder(accessToken, 'MLŽIDLA — Nabídky');

    const pres = await driveJson('https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink', accessToken, {
      method: 'POST',
      body: JSON.stringify({
        name: `${quoteNumber} — ${product.name} — ${inquiry.name || 'klient'}`,
        mimeType: 'application/vnd.google-apps.presentation',
        parents: [folderId],
      }),
    });
    const presentationId = pres.id;

    // Google Drive may create a presentation with one default blank slide.
    // Read the presentation first and remove any existing slides so every generated
    // offer has exactly the intended 8-slide structure.
    const initialPresentation = await driveJson(`https://slides.googleapis.com/v1/presentations/${presentationId}`, accessToken);
    const s = Array.from({ length: 8 }, (_, i) => `offer_slide_${i + 1}`);
    const requests = [];
    (initialPresentation.slides || []).forEach((slide) => {
      if (slide?.objectId) requests.push({ deleteObject: { objectId: slide.objectId } });
    });
    for (const id of s) requests.push({ createSlide: { objectId: id, slideLayoutReference: { predefinedLayout: 'BLANK' } } });

    // 1 — cover
    requests.push(background(s[0], DEEP), ...accentBar('a1', s[0], 0, 0, 720, 8));
    requests.push(...shapeText('t1a', s[0], 'MLŽIDLA® / HOLMTEC', 42, 40, 360, 25, 13, ACCENT, true));
    requests.push(...shapeText('t1b', s[0], product.name, 42, 105, 360, 95, 34, WHITE, true));
    requests.push(...shapeText('t1c', s[0], `Návrh řešení pro ${inquiry.company || inquiry.name || 'váš projekt'}\nCenová nabídka ${quoteNumber}`, 42, 220, 355, 68, 16, WHITE, false));
    requests.push(...shapeText('t1d', s[0], `Platnost do ${dateCs(validUntil)}  ·  Ing. Radek Meduna  ·  +420 774 700 390`, 42, 350, 620, 28, 11, ACCENT, true));
    if (product.image_url) requests.push(image('img1', s[0], product.image_url, 430, 62, 245, 245));

    // 2 — product
    requests.push(background(s[1], WHITE), ...accentBar('a2', s[1], 0, 0, 14, 405, DEEP));
    requests.push(...shapeText('t2a', s[1], 'Vybrané řešení', 48, 38, 260, 28, 13, DEEP, true));
    requests.push(...shapeText('t2b', s[1], product.name, 48, 78, 330, 55, 28, INK, true));
    requests.push(...shapeText('t2c', s[1], product.short_description || 'Architektonické mlžení navržené pro konkrétní prostor.', 48, 145, 330, 100, 15, MUTED, false));
    requests.push(...shapeText('t2d', s[1], '• jemná mlha a lokální ochlazení\n• nerezové provedení pro venkovní provoz\n• konfigurace podle projektu\n• český návrh a výroba HolmTec', 48, 260, 330, 110, 14, INK, false));
    if (product.image_url) requests.push(image('img2', s[1], product.image_url, 420, 68, 255, 255));

    // 3 — specs
    const specs = [
      product.coverage_area && `Výška / dosah: ${product.coverage_area}`,
      product.material && `Materiál: ${product.material}`,
      product.pressure && `Provozní tlak: ${product.pressure}`,
      product.water_consumption && `Spotřeba vody: ${product.water_consumption}`,
      product.micron_size && `Mlžné trysky: ${product.micron_size}`,
      product.power_supply && `Řízení: ${product.power_supply}`,
    ].filter(Boolean).join('\n\n');
    requests.push(background(s[2], LIGHT), ...accentBar('a3', s[2], 0, 0, 720, 8));
    requests.push(...shapeText('t3a', s[2], 'Technické parametry', 48, 42, 400, 45, 26, DEEP, true));
    requests.push(...shapeText('t3b', s[2], specs || 'Přesná technická konfigurace bude potvrzena podle konkrétního místa instalace.', 48, 112, 620, 235, 15, INK, false));

    // 4 — smart control
    requests.push(background(s[3], DEEP), ...accentBar('a4', s[3], 0, 0, 720, 8));
    requests.push(...shapeText('t4a', s[3], 'Smart řízení', 48, 48, 360, 45, 27, WHITE, true));
    requests.push(...shapeText('t4b', s[3], 'Voda jen tehdy, když je potřeba.', 48, 105, 520, 50, 20, ACCENT, true));
    requests.push(...shapeText('t4c', s[3], 'Volitelná inteligentní vrstva pro řízení vodní větve a provozních scénářů. Konkrétní automatizace, čidla a způsob spouštění se navrhují podle projektu.', 48, 175, 610, 110, 16, WHITE, false));
    requests.push(...shapeText('t4d', s[3], 'Automatické scénáře  ·  vzdálené ovládání  ·  projektové nastavení', 48, 330, 610, 32, 12, ACCENT, true));

    // 5 — realizations
    const refs = (product.gallery_urls || []).filter(Boolean).slice(0, 3);
    requests.push(background(s[4], WHITE), ...accentBar('a5', s[4], 0, 0, 720, 8));
    requests.push(...shapeText('t5a', s[4], 'Realizace a kontext použití', 42, 34, 500, 40, 25, DEEP, true));
    requests.push(...shapeText('t5b', s[4], 'Ukázky produktu a souvisejících realizací. Finální řešení se vždy přizpůsobuje místu, provozu a požadovanému účinku.', 42, 79, 625, 52, 13, MUTED, false));
    refs.forEach((url, i) => requests.push(image(`ref${i + 1}`, s[4], url, 42 + i * 216, 150, 195, 185)));
    if (!refs.length) requests.push(...shapeText('t5c', s[4], 'Reference doplníme z databáze realizací MLŽIDLA® podle typu projektu.', 42, 170, 620, 55, 16, INK, false));

    // 6 — visualization / AR
    requests.push(background(s[5], LIGHT), ...accentBar('a6', s[5], 0, 0, 14, 405, ACCENT));
    requests.push(...shapeText('t6a', s[5], 'Vizualizace ve vašem prostoru', 48, 38, 520, 42, 25, DEEP, true));
    requests.push(...shapeText('t6b', s[5], 'Fotografie nebo AR návrh pomůže ověřit měřítko a umístění ještě před výrobou.', 48, 92, 600, 58, 15, MUTED, false));
    if (arCaptureUrl) requests.push(image('arcap', s[5], arCaptureUrl, 48, 170, 350, 190));
    if (arQrImageUrl) requests.push(image('arqr', s[5], arQrImageUrl, 445, 165, 115, 115));
    requests.push(...shapeText('t6c', s[5], arUrl ? `Naskenujte QR nebo otevřete:\n${arUrl}` : 'Mobilní AR / vizualizace bude k nabídce připojena podle dostupnosti 3D modelu produktu.', 430, 292, 245, 68, 12, INK, false));

    // 7 — price
    const price = quote.final_total ?? product.price_from;
    requests.push(background(s[6], WHITE), ...accentBar('a7', s[6], 0, 0, 720, 8));
    requests.push(...shapeText('t7a', s[6], 'Cenové shrnutí', 48, 44, 420, 45, 27, DEEP, true));
    requests.push(...shapeText('t7b', s[6], price ? `${fmt(price)} Kč bez DPH` : 'Cena dle finální konfigurace', 48, 123, 520, 62, 32, INK, true));
    requests.push(...shapeText('t7c', s[6], `Nabídka ${quoteNumber}\nVystaveno: ${dateCs(now)}\nPlatnost: 30 dní, do ${dateCs(validUntil)}\n\nCena a rozsah jsou závazné po potvrzení konkrétních položek v přiložené PDF cenové nabídce.`, 48, 205, 600, 135, 15, MUTED, false));

    // 8 — next step
    requests.push(background(s[7], DEEP), ...accentBar('a8', s[7], 0, 0, 720, 8));
    requests.push(...shapeText('t8a', s[7], 'Další krok', 48, 52, 300, 42, 26, WHITE, true));
    requests.push(...shapeText('t8b', s[7], 'Odpovězte na nabídku nebo ji potvrďte v zákaznickém portálu. Po odsouhlasení navážeme výrobní přípravou a upřesněním instalace.', 48, 118, 610, 105, 18, WHITE, false));
    requests.push(...shapeText('t8c', s[7], 'HolmTec s.r.o. — mlzidla.cz\nIng. Radek Meduna\n+420 774 700 390\nmeduna@holmtec.cz', 48, 267, 330, 105, 14, ACCENT, true));
    requests.push(image('portalqr', s[7], portalQrImageUrl, 500, 245, 115, 115));
    requests.push(...shapeText('t8d', s[7], 'Naskenujte pro otevření nabídky a potvrzení objednávky', 440, 365, 230, 28, 10, WHITE, false));

    const slideRes = await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ requests }),
    });
    if (!slideRes.ok) throw new Error(`Slides generation failed ${slideRes.status}: ${await slideRes.text()}`);

    const exportRes = await fetch(`https://www.googleapis.com/drive/v3/files/${presentationId}/export?mimeType=${encodeURIComponent('application/pdf')}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!exportRes.ok) throw new Error(`Slides export failed ${exportRes.status}: ${await exportRes.text()}`);
    const pdfBytes = new Uint8Array(await exportRes.arrayBuffer());
    const pdfFilename = `${quoteNumber}-${(product.slug || 'produkt')}-prezentace.pdf`;
    const pdf = await uploadPdf(accessToken, folderId, pdfBytes, pdfFilename);

    return Response.json({
      success: true,
      presentation_id: presentationId,
      presentation_url: pres.webViewLink || `https://docs.google.com/presentation/d/${presentationId}/edit`,
      presentation_pdf_url: pdf.url,
      presentation_pdf_base64: toBase64(pdfBytes),
      presentation_filename: pdfFilename,
      drive_folder_id: folderId,
      quote_number: quoteNumber,
      valid_until: validUntil.toISOString(),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
