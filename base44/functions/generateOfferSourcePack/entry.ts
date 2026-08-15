import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

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

async function findOrCreateFolder(accessToken, folderName, parentFolderId = 'root') {
  const escaped = folderName.replace(/'/g, "\\'");
  const q = encodeURIComponent(`name='${escaped}' and '${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`);
  const list = await driveJson(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)&pageSize=10`, accessToken);
  if (list.files?.[0]?.id) return list.files[0].id;
  const created = await driveJson('https://www.googleapis.com/drive/v3/files?fields=id,name', accessToken, {
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
    '',
    metadata,
    `--${boundary}`,
    'Content-Type: text/markdown; charset=UTF-8',
    '',
    content,
    `--${boundary}--`,
    '',
  ].join('\r\n');
  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
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

    const { inquiry = {}, product = {}, quote = {}, presentation_url: presentationUrl, quote_pdf_url: quotePdfUrl, ar_url: arUrl } = await req.json();
    if (!product?.name) return Response.json({ error: 'Product data required' }, { status: 400 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const rootFolderId = await findOrCreateFolder(accessToken, 'MLŽIDLA — Nabídky');
    const sourceFolderId = await findOrCreateFolder(accessToken, 'NotebookLM zdroje', rootFolderId);

    const issuedAt = quote.issued_at ? new Date(quote.issued_at) : new Date();
    const validUntil = quote.valid_until ? new Date(quote.valid_until) : new Date(issuedAt.getTime() + 30 * 24 * 60 * 60 * 1000);
    const quoteNumber = quote.quote_number || `MLZ-${issuedAt.getFullYear()}-${String(Date.now()).slice(-6)}`;
    const gallery = (product.gallery_urls || []).filter(Boolean).slice(0, 10);

    const content = `# MLŽIDLA® — zdrojový balíček obchodní nabídky\n\n` +
`## Identifikace nabídky\n- Číslo nabídky: ${quoteNumber}\n- Vystaveno: ${issuedAt.toLocaleDateString('cs-CZ')}\n- Platnost do: ${validUntil.toLocaleDateString('cs-CZ')}\n- Standardní platnost: 30 dní\n\n` +
`## Žadatel / odběratel\n- Jméno: ${clean(inquiry.name) || 'neuvedeno'}\n- Firma / organizace: ${clean(inquiry.company) || 'neuvedeno'}\n- E-mail: ${clean(inquiry.email) || 'neuvedeno'}\n- Telefon: ${clean(inquiry.phone) || 'neuvedeno'}\n- Zadání: ${clean(inquiry.message) || 'neuvedeno'}\n\n` +
`## Dodavatel\n- HolmTec s.r.o. — mlzidla.cz\n- Kontaktní osoba: Ing. Radek Meduna\n- Telefon: +420 774 700 390\n- E-mail: meduna@holmtec.cz\n- Adresa: Horní Staré Město 698, 541 02 Trutnov\n- IČ: 27486893\n- DIČ: CZ27486893\n\n` +
`## Vybraný produkt\n- Název: ${product.name}\n- Slug: ${product.slug || ''}\n- Stručný popis: ${clean(product.short_description)}\n- Materiál: ${clean(product.material)}\n- Výška / dosah: ${clean(product.coverage_area)}\n- Provozní tlak: ${clean(product.pressure)}\n- Spotřeba vody: ${clean(product.water_consumption)}\n- Mlžné trysky / kapka: ${clean(product.micron_size)}\n- Napájení / řízení: ${clean(product.power_supply)}\n\n` +
`## Hlavní přínosy\n- jemná mlha a lokální ochlazení\n- nerezové provedení pro venkovní provoz\n- konfigurace podle konkrétního projektu\n- český návrh a výroba HolmTec\n- možnost doplnit Smart řízení\n\n` +
`## Smart řízení\nVoda jen tehdy, když je potřeba. Smart vrstva může řídit vodní větev a provozní scénáře. Konkrétní automatizace, senzory a způsob spouštění se vždy potvrzují podle projektu; nevymýšlej neověřené technické funkce.\n\n` +
`## Cena\n- Cena projektu bez DPH: ${quote.final_total ? `${Number(quote.final_total).toLocaleString('cs-CZ')} Kč` : 'dle potvrzené konfigurace'}\n- Cena produktu: ${quote.base_price ? `${Number(quote.base_price).toLocaleString('cs-CZ')} Kč` : 'neuvedeno'}\n- Instalace: ${quote.installation ? `${Number(quote.installation).toLocaleString('cs-CZ')} Kč` : 'neuvedeno'}\n- Sleva: ${quote.discount_percent ? `${quote.discount_percent} %` : '0 %'}\n\n` +
`## Odkazy\n- PDF cenová nabídka: ${quotePdfUrl || 'bude doplněna'}\n- Vizuální prezentace: ${presentationUrl || 'bude doplněna'}\n- AR / vizualizace: ${arUrl || 'není k dispozici'}\n- Zákaznický portál: https://mlzidla.cz/muj-projekt\n- Smart řízení: https://mlzidla.cz/smart-ovladani\n\n` +
`## Produktové a realizační obrázky\n${[product.image_url, ...gallery].filter(Boolean).map((url, index) => `${index + 1}. ${url}`).join('\n') || 'Nejsou připojeny.'}\n\n` +
`## Zadání pro NotebookLM Slide Deck\nVytvoř profesionální českou obchodní prezentaci pro konkrétního žadatele. Používej pouze fakta a parametry z tohoto zdrojového balíčku. Struktura: 1) titulní slide s klientem a produktem, 2) produkt a jeho přínosy, 3) technické parametry, 4) Smart řízení, 5) relevantní realizace, 6) AR/vizualizace, 7) cenové shrnutí a platnost 30 dní, 8) další krok a kontakt Ing. Radek Meduna. Vizuální styl: prémiový, čistý, architektonický, nerez + jemná mlha, minimum textu, žádné vymyšlené technické parametry. Cena a obchodní podmínky se řídí přiloženou PDF cenovou nabídkou.\n`;

    const filename = `${quoteNumber}-${(product.slug || 'produkt')}-notebooklm-source.md`;
    const uploaded = await uploadText(accessToken, sourceFolderId, filename, content);
    return Response.json({
      success: true,
      file_id: uploaded.id,
      source_url: uploaded.webViewLink || `https://drive.google.com/file/d/${uploaded.id}/view`,
      filename,
      root_folder_id: rootFolderId,
      source_folder_id: sourceFolderId,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
