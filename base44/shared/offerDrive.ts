export const MLZNY_DRIVE_ID = '0ACRsWxU90i5aUk9PVA';
export const OFFER_APP_FOLDER_ID = '1AthLBVZXMZ0ag28wUvYw2yakPFRud-sK';
export const ACTIVE_CASES_FOLDER_ID = '126TCo80QwFFODHV0CGhB3TenjjQ0OMAJ';
export const CLOSED_ORDERS_FOLDER_ID = '1oJ7P3nxNZ3q-_XfU0w0bXzuoTA2c2bOy';
export const TEMPLATES_FOLDER_ID = '1ylUY_wWrOtr9haKF4pNM9rbOvvL6Kyn-';
export const REPORTS_FOLDER_ID = '16nSFN5H1v0C4zTYGBGzmY2AcQBL5vJaK';
export const NOTEBOOK_FOLDER_ID = '1G4JniOWPKCNwCiMZPnJ6ExLgGEd1l9dq';

const safeName = (value: unknown, fallback = 'klient') => String(value || fallback)
  .replace(/[\\/:*?"<>|#%{}~&]/g, '-')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, 90) || fallback;

async function driveJson(url: string, accessToken: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    },
  });
  if (!response.ok) throw new Error(`Google Drive ${response.status}: ${await response.text()}`);
  return response.json();
}

export async function findOrCreateFolder(accessToken: string, parentFolderId: string, folderName: string) {
  const escaped = folderName.replace(/'/g, "\\'");
  const q = encodeURIComponent(`name='${escaped}' and '${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`);
  const list = await driveJson(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)&pageSize=20&corpora=drive&driveId=${MLZNY_DRIVE_ID}&includeItemsFromAllDrives=true&supportsAllDrives=true`, accessToken);
  if (list.files?.[0]?.id) return list.files[0].id;
  const created = await driveJson('https://www.googleapis.com/drive/v3/files?fields=id,name&supportsAllDrives=true', accessToken, {
    method: 'POST',
    body: JSON.stringify({ name: folderName, mimeType: 'application/vnd.google-apps.folder', parents: [parentFolderId] }),
  });
  return created.id as string;
}

export async function ensureOfferCaseFolders(accessToken: string, args: { quoteNumber: string; clientName?: string; issuedAt?: string | Date; rootFolderId?: string }) {
  const date = args.issuedAt ? new Date(args.issuedAt) : new Date();
  const year = String(date.getFullYear());
  const root = args.rootFolderId || ACTIVE_CASES_FOLDER_ID;
  const yearFolderId = await findOrCreateFolder(accessToken, root, year);
  const caseName = `${safeName(args.quoteNumber, 'NABIDKA')} — ${safeName(args.clientName, 'klient')}`;
  const caseFolderId = await findOrCreateFolder(accessToken, yearFolderId, caseName);
  const [inquiryFolderId, offerFolderId, presentationFolderId, orderFolderId, communicationFolderId, sourceFolderId, visualizationFolderId] = await Promise.all([
    findOrCreateFolder(accessToken, caseFolderId, '01_POPTAVKA'),
    findOrCreateFolder(accessToken, caseFolderId, '02_NABIDKA'),
    findOrCreateFolder(accessToken, caseFolderId, '03_PREZENTACE'),
    findOrCreateFolder(accessToken, caseFolderId, '04_OBJEDNAVKA'),
    findOrCreateFolder(accessToken, caseFolderId, '05_KOMUNIKACE'),
    findOrCreateFolder(accessToken, caseFolderId, '06_PODKLADY'),
    findOrCreateFolder(accessToken, caseFolderId, '07_VIZUALIZACE'),
  ]);
  return { yearFolderId, caseFolderId, inquiryFolderId, offerFolderId, presentationFolderId, orderFolderId, communicationFolderId, sourceFolderId, visualizationFolderId, caseName };
}

export async function uploadBytes(accessToken: string, folderId: string, bytes: Uint8Array, filename: string, mimeType = 'application/pdf') {
  const boundary = `mlzidla_${crypto.randomUUID()}`;
  const metadata = JSON.stringify({ name: safeName(filename, 'soubor'), mimeType, parents: [folderId] });
  const prefix = new TextEncoder().encode(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n`);
  const suffix = new TextEncoder().encode(`\r\n--${boundary}--`);
  const body = new Uint8Array(prefix.length + bytes.length + suffix.length);
  body.set(prefix, 0); body.set(bytes, prefix.length); body.set(suffix, prefix.length + bytes.length);
  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true&fields=id,name,webViewLink', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': `multipart/related; boundary=${boundary}` },
    body,
  });
  if (!response.ok) throw new Error(`Drive upload ${response.status}: ${await response.text()}`);
  const file = await response.json();
  return { id: file.id as string, name: file.name as string, url: file.webViewLink || `https://drive.google.com/file/d/${file.id}/view` };
}

export async function moveCaseToClosedOrders(accessToken: string, caseFolderId: string) {
  const metadata = await driveJson(`https://www.googleapis.com/drive/v3/files/${caseFolderId}?fields=parents&supportsAllDrives=true`, accessToken);
  const currentParents = (metadata.parents || []).join(',');
  const yearFolderId = await findOrCreateFolder(accessToken, CLOSED_ORDERS_FOLDER_ID, String(new Date().getFullYear()));
  const query = new URLSearchParams({ addParents: yearFolderId, supportsAllDrives: 'true', fields: 'id,parents,webViewLink' });
  if (currentParents) query.set('removeParents', currentParents);
  return driveJson(`https://www.googleapis.com/drive/v3/files/${caseFolderId}?${query.toString()}`, accessToken, { method: 'PATCH', body: JSON.stringify({}) });
}
