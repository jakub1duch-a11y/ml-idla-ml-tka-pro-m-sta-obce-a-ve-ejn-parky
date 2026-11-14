import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { jsPDF } from 'npm:jspdf@4.0.0';
import { uploadBytes } from '../../shared/offerDrive.ts';

const TARGET_FOLDER_ID = '1sqRwsZ5YOxs4y3pD4nV1Mpd8iznpdcsd';
const SHARED_DRIVE_ID = '0ACRsWxU90i5aUk9PVA';
const allowedTypes = new Set(['Poptavka', 'ContactInquiry']);
const clean = (value: unknown): string => String(value ?? '').replace(/<[^>]*>/g, ' ').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim();
const filenamePart = (value: unknown): string => clean(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60) || 'Zadatel';
function b64(bytes: Uint8Array): string {
  let result = '';
  for (let i = 0; i < bytes.length; i += 8192) result += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(result);
}
async function applyCzechFont(doc: any) {
  const url = 'https://github.com/google/fonts/raw/main/ofl/notosans/NotoSans%5Bwdth,wght%5D.ttf';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Czech font unavailable: ' + res.status);
  doc.addFileToVFS('NotoSans.ttf', b64(new Uint8Array(await res.arrayBuffer())));
  doc.addFont('NotoSans.ttf', 'NotoSans', 'normal', 'Identity-H');
  doc.setFont('NotoSans', 'normal');
}
async function existingFile(token: string, name: string) {
  const esc = name.replace(/'/g, "\\'");
  const q = encodeURIComponent("'" + TARGET_FOLDER_ID + "' in parents and name='" + esc + "' and trashed=false");
  const url = 'https://www.googleapis.com/drive/v3/files?q=' + q
    + '&fields=files(id,name,webViewLink)&pageSize=5&corpora=drive&driveId=' + SHARED_DRIVE_ID
    + '&includeItemsFromAllDrives=true&supportsAllDrives=true';
  const response = await fetch(url, { headers: { Authorization: 'Bearer ' + token } });
  if (!response.ok) throw new Error('Google Drive lookup ' + response.status);
  const files = (await response.json()).files || [];
  return files[0] || null;
}
function normalizeInquiry(source: any, type: string) {
  const name = clean(type === 'Poptavka' ? source.jmeno : source.name) || clean(source.email) || 'Neznamy zadatel';
  return {
    name, company: clean(source.firma), email: clean(source.email), phone: clean(source.telefon),
    product: clean(source.produkt || source.product_id), quantity: source.quantity,
    location: clean(source.installation_location), source: clean(source.service_type),
    status: clean(source.status), when: clean(source.created_date), message: clean(source.zprava || source.message),
    details: clean(source.description), shape: clean(source.custom_shape),
    attachments: Array.isArray(source.attachment_urls) ? source.attachment_urls : [],
    attachmentNames: Array.isArray(source.attachment_names) ? source.attachment_names : []
  };
}
function pdfContent(data: any, entity: string, inquiryId: string) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  return { doc, async draw() {
    await applyCzechFont(doc);
    const W = 210, L = 16, RIGHT = 194, BOTTOM = 278;
    let y = 17, page = 1;
    const heading = () => {
      doc.setFillColor(79, 107, 46); doc.rect(0, 0, W, 26, 'F');
      doc.setTextColor(255, 255, 255); doc.setFontSize(17);
      doc.text('MLŽIDLA.cz', L, 12);
      doc.setFontSize(9); doc.text('PŘÍCHOZÍ POPTÁVKA', L, 20);
      y = 35;
    };
    const newPage = () => { doc.addPage('a4', 'portrait'); page++; heading(); };
    const addText = (line: string, fontSize = 9, leading = 5) => {
      doc.setFontSize(fontSize);
      const rows: string[] = doc.splitTextToSize(line, RIGHT - L);
      for (const row of rows) {
        if (y + leading > BOTTOM) newPage();
        doc.setTextColor(24, 35, 43); doc.text(row || ' ', L, y);
        y += leading;
      }
    };
    const field = (label: string, value: unknown) => {
      if (value === undefined || value === null || clean(value) === '') return;
      addText(label + ': ' + clean(value), 9, 5);
    };
    heading();
    doc.setTextColor(79, 107, 46); doc.setFontSize(12);
    field('Žadatel', data.name); field('Organizace', data.company); field('E-mail', data.email);
    field('Telefon', data.phone); field('Produkt', data.product); field('Počet kusů', data.quantity);
    field('Místo instalace', data.location); field('Zdroj', data.source);
    field('Stav', data.status); field('Přijato', data.when); field('Evidence', entity + '/' + inquiryId);
    y += 7; addText('ZADÁNÍ ZÁKAZNÍKA', 12, 7);
    const message = data.message || 'Bez textového zadání';
    for (const line of message.split(/\r?\n/)) addText(line || ' ', 9, 5);
    if (data.details) { y += 4; addText('DOPLŇUJÍCÍ POPIS', 12, 7); for (const line of data.details.split(/\r?\n/)) addText(line || ' ', 9, 5); }
    if (data.shape) { y += 4; addText('POŽADOVANÝ TVAR', 12, 7); addText(data.shape); }
    if (data.attachments.length) {
      y += 4; addText('PŘÍLOHY', 12, 7);
      data.attachments.forEach((u: any, index: number) => addText((data.attachmentNames[index] || 'Příloha ' + (index + 1)) + ': ' + clean(u), 7, 4));
    }
    for (let i = 1; i <= page; i++) {
      doc.setPage(i); doc.setDrawColor(215, 223, 215); doc.line(L, 282, RIGHT, 282);
      doc.setTextColor(105, 111, 112); doc.setFontSize(7);
      doc.text('Archiv webových poptávek | MLŽIDLA.cz by HolmTec', L, 288);
      doc.text(i + ' / ' + page, RIGHT, 288, { align: 'right' });
    }
    return new Uint8Array(doc.output('arraybuffer'));
  } };
}
export default async function(req: Request) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Admin access required' }, { status: 403 });
    const payload = await req.json();
    const type = String(payload.inquiry_type || '');
    const id = String(payload.inquiry_id || '');
    if (!allowedTypes.has(type) || !/^[a-f0-9]{24}$/i.test(id)) return Response.json({ error: 'Invalid inquiry type or ID' }, { status: 400 });
    const source = await (base44.asServiceRole.entities as any)[type].get(id);
    if (!source) return Response.json({ error: 'Inquiry not found' }, { status: 404 });
    const data = normalizeInquiry(source, type);
    const date = clean(source.created_date).slice(0, 10) || new Date().toISOString().slice(0, 10);
    const filename = 'Poptavka_' + filenamePart(data.name) + '_' + date + '_' + id.slice(-6) + '.pdf';
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const prior = await existingFile(accessToken, filename);
    if (prior?.id) return Response.json({ success: true, existing: true, filename, file_id: prior.id, pdf_url: prior.webViewLink || ('https://drive.google.com/file/d/' + prior.id + '/view') });
    const bytes = await pdfContent(data, type, id).draw();
    const saved = await uploadBytes(accessToken, TARGET_FOLDER_ID, bytes, filename, 'application/pdf');
    return Response.json({ success: true, existing: false, filename, file_id: saved.id, pdf_url: saved.url });
  } catch (error: any) {
    return Response.json({ success: false, error: error?.message || 'Archive error' }, { status: 500 });
  }
}
