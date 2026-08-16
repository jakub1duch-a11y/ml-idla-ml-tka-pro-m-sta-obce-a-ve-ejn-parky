import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

const SHARED_DRIVE_NAMES = ['MLZNY DISK', 'MLŽNÝ DISK'];

async function driveJson(url, accessToken, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!response.ok) throw new Error(`Google Drive ${response.status}: ${await response.text()}`);
  return response.json();
}

async function findSharedDrive(accessToken) {
  const drives = await driveJson('https://www.googleapis.com/drive/v3/drives?pageSize=100', accessToken);
  return (drives.drives || []).find((drive) => SHARED_DRIVE_NAMES.includes(String(drive.name || '').toUpperCase())) || null;
}

async function findOrCreateFolder(accessToken, folderName, parentFolderId, driveId) {
  const escaped = folderName.replace(/'/g, "\\'");
  const q = encodeURIComponent(`name='${escaped}' and '${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`);
  const scope = driveId ? `&corpora=drive&driveId=${driveId}&includeItemsFromAllDrives=true&supportsAllDrives=true` : '&includeItemsFromAllDrives=true&supportsAllDrives=true';
  const list = await driveJson(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)&pageSize=20${scope}`, accessToken);
  if (list.files?.[0]?.id) return list.files[0].id;
  const created = await driveJson('https://www.googleapis.com/drive/v3/files?fields=id,name&supportsAllDrives=true', accessToken, {
    method: 'POST',
    body: JSON.stringify({ name: folderName, mimeType: 'application/vnd.google-apps.folder', parents: [parentFolderId] }),
  });
  return created.id;
}

async function uploadText(accessToken, folderId, filename, content) {
  const boundary = `mlzidla_${crypto.randomUUID()}`;
  const metadata = JSON.stringify({ name: filename, mimeType: 'text/markdown', parents: [folderId] });
  const body = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '', metadata,
    `--${boundary}`,
    'Content-Type: text/markdown; charset=UTF-8',
    '', content,
    `--${boundary}--`, ''
  ].join('\r\n');
  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true&fields=id,name,webViewLink', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': `multipart/related; boundary=${boundary}` },
    body,
  });
  if (!response.ok) throw new Error(`Source pack upload failed ${response.status}: ${await response.text()}`);
  return response.json();
}

const clean = (value) => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { inquiry = {}, product = {}, quote = {}, presentation_url: presentationUrl, quote_pdf_url: quotePdfUrl, ar_url: arUrl, audience_variant: audienceVariant = 'custom' } = await req.json();
    if (!product?.name) return Response.json({ error: 'Product data required' }, { status: 400 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const sharedDrive = await findSharedDrive(accessToken);
    const rootId = sharedDrive?.id || 'root';
    const driveId = sharedDrive?.id || '';
    const rootFolderId = await findOrCreateFolder(accessToken, 'MLŽIDLA — Nabídky', rootId, driveId);
    const yearFolderId = await findOrCreateFolder(accessToken, String(new Date().getFullYear()), rootFolderId, driveId);
    const sourceFolderId = await findOrCreateFolder(accessToken, 'NotebookLM zdroje', yearFolderId, driveId);

    const issuedAt = quote.issued_at ? new Date(quote.issued_at) : new Date();
    const validUntil = quote.valid_until ? new Date(quote.valid_until) : new Date(issuedAt.getTime() + 30 * 24 * 60 * 60 * 1000);
    const quoteNumber = quote.quote_number || `MLZ-${issuedAt.getFullYear()}-${String(Date.now()).slice(-6)}`;
    const gallery = (product.gallery_urls || []).filter(Boolean).slice(0, 10);

    const content = `# MLŽIDLA.cz by HolmTec — zdrojový balíček obchodní nabídky\n\n` +
`## Identifikace nabídky\n- Číslo nabídky: ${quoteNumber}\n- Vystaveno: ${issuedAt.toLocaleDateString('cs-CZ')}\n- Platnost do: ${validUntil.toLocaleDateString('cs-CZ')}\n- Cílová varianta prezentace: ${audienceVariant}\n\n` +
`## Žadatel / odběratel\n- Jméno: ${clean(inquiry.name) || 'neuvedeno'}\n- Firma / organizace: ${clean(inquiry.company) || 'neuvedeno'}\n- E-mail: ${clean(inquiry.email) || 'neuvedeno'}\n- Telefon: ${clean(inquiry.phone) || 'neuvedeno'}\n- Zadání: ${clean(inquiry.message) || 'neuvedeno'}\n\n` +
`## Dodavatel\n- MLŽIDLA.cz by HolmTec\n- HolmTec s.r.o.\n- Kontaktní osoba: Ing. Radek Meduna\n- Telefon: +420 774 700 390\n- E-mail: meduna@holmtec.cz / info@mlzidla.cz\n- Adresa: Horní Staré Město 698, 541 02 Trutnov\n- IČ: 27486893\n- DIČ: CZ27486893\n\n` +
`## Vybraný produkt\n- Název: ${product.name}\n- Slug: ${product.slug || ''}\n- Stručný popis: ${clean(product.short_description)}\n- Materiál: ${clean(product.material)}\n- Výška / dosah: ${clean(product.coverage_area)}\n- Provozní tlak: ${clean(product.pressure)}\n- Spotřeba vody: ${clean(product.water_consumption)}\n- Mlžné trysky / kapka: ${clean(product.micron_size)}\n- Napájení / řízení: ${clean(product.power_supply)}\n\n` +
`## Smart řízení\nVolitelné řízení přes Wi-Fi / aplikaci, časové harmonogramy a podle projektu senzory, snímače, měřiče průtoku a další moduly. Neuváděj neověřené funkce.\n\n` +
`## Cena\n- Cena projektu bez DPH: ${quote.final_total ? `${Number(quote.final_total).toLocaleString('cs-CZ')} Kč` : 'dle potvrzené konfigurace'}\n- Cena produktu: ${quote.base_price ? `${Number(quote.base_price).toLocaleString('cs-CZ')} Kč` : 'neuvedeno'}\n- Instalace: ${quote.installation ? `${Number(quote.installation).toLocaleString('cs-CZ')} Kč` : 'neuvedeno'}\n- Sleva: ${quote.discount_percent ? `${quote.discount_percent} %` : '0 %'}\n\n` +
`## Odkazy\n- PDF cenová nabídka: ${quotePdfUrl || 'bude doplněna'}\n- Google prezentace: ${presentationUrl || 'bude doplněna'}\n- AR / vizualizace: ${arUrl || 'není k dispozici'}\n- Zákaznický portál: https://mlzidla.cz/muj-projekt\n- Smart řízení: https://mlzidla.cz/smart-ovladani\n\n` +
`## Produktové a realizační obrázky\n${[product.image_url, ...gallery].filter(Boolean).map((url, index) => `${index + 1}. ${url}`).join('\n') || 'Nejsou připojeny.'}\n\n` +
`## Zadání pro NotebookLM Slide Deck\nVytvoř profesionální českou obchodní prezentaci pro konkrétního žadatele. Má působit prémiově, důvěryhodně a emočně, ale bez nátlakového prodeje. Používej pouze fakta z tohoto podkladu. Přizpůsob argumentaci cílové variantě ${audienceVariant}. Struktura: 1) titulní slide klient + produkt, 2) potřeba prostoru a očekávaný přínos, 3) produkt a design, 4) technické řešení, 5) Smart řízení, 6) reference / fotografie, 7) vizualizace ve vlastním prostoru, 8) cena + platnost, 9) další krok: objednat / prodloužit platnost / uvést orientační termín. Branding MLŽIDLA.cz by HolmTec, tmavě modrá / petrol / tyrkysová, velké fotografie, minimum textu.\n`;

    const filename = `${quoteNumber}-${(product.slug || 'produkt')}-notebooklm-source.md`;
    const uploaded = await uploadText(accessToken, sourceFolderId, filename, content);
    return Response.json({
      success: true,
      file_id: uploaded.id,
      source_url: uploaded.webViewLink || `https://drive.google.com/file/d/${uploaded.id}/view`,
      filename,
      shared_drive_id: sharedDrive?.id || '',
      shared_drive_name: sharedDrive?.name || 'My Drive fallback',
      root_folder_id: rootFolderId,
      source_folder_id: sourceFolderId,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
