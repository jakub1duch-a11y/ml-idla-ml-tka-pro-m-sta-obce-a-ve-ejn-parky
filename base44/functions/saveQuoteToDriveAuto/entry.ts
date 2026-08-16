import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SHARED_DRIVE_NAMES = ['MLZNY DISK', 'MLŽNÝ DISK'];

async function driveJson(url, accessToken, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  if (!response.ok) throw new Error(`Drive ${response.status}: ${await response.text()}`);
  return response.json();
}

async function findSharedDrive(accessToken) {
  const drives = await driveJson('https://www.googleapis.com/drive/v3/drives?pageSize=100', accessToken);
  const match = (drives.drives || []).find((drive) => SHARED_DRIVE_NAMES.includes(String(drive.name || '').toUpperCase()));
  return match || null;
}

async function findOrCreateFolder(accessToken, parentFolderId, folderName, driveId) {
  const q = encodeURIComponent(`'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false and name='${folderName.replace(/'/g, "\\'")}'`);
  const scope = driveId ? `&corpora=drive&driveId=${driveId}&includeItemsFromAllDrives=true&supportsAllDrives=true` : '&includeItemsFromAllDrives=true&supportsAllDrives=true';
  const list = await driveJson(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)&pageSize=20${scope}`, accessToken);
  if (list.files?.[0]?.id) return list.files[0].id;
  const created = await driveJson('https://www.googleapis.com/drive/v3/files?fields=id,name&supportsAllDrives=true', accessToken, {
    method: 'POST',
    body: JSON.stringify({ name: folderName, mimeType: 'application/vnd.google-apps.folder', parents: [parentFolderId] }),
  });
  return created.id;
}

async function uploadPdfToDrive(pdfBytes, filename, folderId, accessToken) {
  const boundary = `mlzidla_${crypto.randomUUID()}`;
  const metadata = JSON.stringify({ name: filename, mimeType: 'application/pdf', parents: [folderId] });
  const prefix = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n--${boundary}\r\nContent-Type: application/pdf\r\n\r\n`;
  const suffix = `\r\n--${boundary}--`;
  const prefixBytes = new TextEncoder().encode(prefix);
  const suffixBytes = new TextEncoder().encode(suffix);
  const body = new Uint8Array(prefixBytes.length + pdfBytes.length + suffixBytes.length);
  body.set(prefixBytes, 0); body.set(pdfBytes, prefixBytes.length); body.set(suffixBytes, prefixBytes.length + pdfBytes.length);
  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true&fields=id,webViewLink', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': `multipart/related; boundary=${boundary}` },
    body,
  });
  if (!res.ok) throw new Error(`Drive upload failed ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { fileId: data.id, driveUrl: data.webViewLink || `https://drive.google.com/file/d/${data.id}/view` };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { pdfBytes, pdf_base64: pdfBase64, filename, quoteNumber, inquiryEmail, inquiryName } = body;
    if ((!pdfBytes && !pdfBase64) || !filename) return Response.json({ error: 'Missing PDF payload or filename' }, { status: 400 });

    const normalizedPdfBytes = pdfBase64
      ? Uint8Array.from(atob(pdfBase64), (character) => character.charCodeAt(0))
      : new Uint8Array(pdfBytes);

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const sharedDrive = await findSharedDrive(accessToken);
    const rootFolderId = sharedDrive?.id || 'root';
    const driveId = sharedDrive?.id || '';

    const offersFolderId = await findOrCreateFolder(accessToken, rootFolderId, 'MLŽIDLA — Nabídky', driveId);
    const year = new Date().getFullYear().toString();
    const yearFolderId = await findOrCreateFolder(accessToken, offersFolderId, year, driveId);
    const quoteFolderName = `${quoteNumber || 'NABIDKA'} — ${inquiryName || inquiryEmail || 'klient'}`.slice(0, 120);
    const quoteFolderId = await findOrCreateFolder(accessToken, yearFolderId, quoteFolderName, driveId);

    const { fileId, driveUrl } = await uploadPdfToDrive(normalizedPdfBytes, filename, quoteFolderId, accessToken);

    return Response.json({
      success: true,
      file_id: fileId,
      drive_url: driveUrl,
      shared_drive_id: sharedDrive?.id || '',
      shared_drive_name: sharedDrive?.name || 'My Drive fallback',
      folder_id: quoteFolderId,
      folder_name: `${sharedDrive?.name || 'My Drive'}/MLŽIDLA — Nabídky/${year}/${quoteFolderName}`,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
