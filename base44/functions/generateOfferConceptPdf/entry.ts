import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { jsPDF } from 'npm:jspdf@4.2.1';
import { clean } from '../../shared/suplaPricing.ts';
import { ensureOfferCaseFolders, uploadBytes } from '../../shared/offerDrive.ts';
import { ensureSheet, ensureHeaders, appendRow } from '../../shared/googleSheets.ts';
import { toBase64 } from '../../shared/pdfHelpers.ts';
import { loadOfferCtx } from '../../shared/offerPdfContext.ts';
import { buildOfferDocument } from '../../shared/offerPdfBuilder.ts';

const OFFERS_SPREADSHEET_ID = '1MS4i00ekY3Pf3fY-AsUdCT7GtNiCk5XPDr8CLiwym6M';
const OFFERS_SHEET = 'Nabídky';
const OFFER_HEADERS = ['Datum', 'Číslo nabídky', 'Klient', 'Email', 'Firma', 'Projekt', 'Produkt', 'Mezisoučet bez DPH', 'DPH 21%', 'Celkem s DPH', 'Stav', 'PDF URL', 'Drive URL', 'ID projektu'];

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const inquiryId = body.inquiry_id;
    const projectOrderId = body.project_order_id;
    if (!inquiryId && !projectOrderId) return Response.json({ error: 'Missing inquiry_id or project_order_id' }, { status: 400 });

    let order: any = null;
    if (projectOrderId) order = await base44.asServiceRole.entities.ProjectOrder.get(projectOrderId);
    else { const orders = await base44.asServiceRole.entities.ProjectOrder.filter({ inquiry_id: inquiryId }); order = orders?.[0] || null; }
    if (!order) return Response.json({ error: 'Koncept nebyl nalezen. Nejprve připravte koncept nabídky.' }, { status: 404 });

    const { ctx, total: baseTotal, quoteNum } = await loadOfferCtx(base44, order, inquiryId);

    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    buildOfferDocument(doc, ctx);
    const pdfBytes = doc.output('arraybuffer');

    let pdfUrl = '';
    try {
      const uploadResult = await base44.asServiceRole.integrations.Core.UploadPublicFile({ file: new Blob([pdfBytes], { type: 'application/pdf' }) });
      pdfUrl = uploadResult?.file_url || '';
      if (pdfUrl) await base44.asServiceRole.entities.ProjectOrder.update(order.id, { quote_pdf_url: pdfUrl });
    } catch (e) { console.warn('PDF upload failed', e); }

    let driveUrl = '', driveFolderUrl = '';
    try {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
      const folders = await ensureOfferCaseFolders(accessToken, { quoteNumber: quoteNum, clientName: order.client_name || order.client_email || 'klient', issuedAt: new Date().toISOString() });
      const uploaded = await uploadBytes(accessToken, folders.offerFolderId, new Uint8Array(pdfBytes), `Koncept_${quoteNum}.pdf`, 'application/pdf');
      driveUrl = uploaded.url;
      driveFolderUrl = `https://drive.google.com/drive/folders/${folders.caseFolderId}`;
    } catch (e) { console.warn('Drive upload failed', e); }

    let sheetSynced = false;
    try {
      const { accessToken: st } = await base44.asServiceRole.connectors.getConnection('googlesheets');
      await ensureSheet(st, OFFERS_SPREADSHEET_ID, OFFERS_SHEET);
      await ensureHeaders(st, OFFERS_SPREADSHEET_ID, OFFERS_SHEET, OFFER_HEADERS);
      await appendRow(st, OFFERS_SPREADSHEET_ID, OFFERS_SHEET, OFFER_HEADERS.length, [
        new Date().toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' }), quoteNum,
        clean(order.client_name) || '—', clean(order.client_email) || '', clean(order.client_company) || '',
        clean(order.project_name) || 'Návrh řešení', clean(order.product_name) || '',
        Math.round(baseTotal), Math.round(baseTotal * 0.21), Math.round(baseTotal * 1.21),
        'Koncept', pdfUrl || '', driveUrl || '', order.id || '',
      ]);
      sheetSynced = true;
    } catch (e) { console.warn('Sheets sync failed', e); }

    if (pdfUrl) return Response.json({ ok: true, pdf_url: pdfUrl, drive_url: driveUrl, drive_folder_url: driveFolderUrl, quote_number: quoteNum, sheet_synced: sheetSynced });
    return Response.json({ ok: true, pdf_base64: toBase64(new Uint8Array(pdfBytes)), drive_url: driveUrl, drive_folder_url: driveFolderUrl, filename: `koncept-${quoteNum}.pdf`, quote_number: quoteNum, sheet_synced: sheetSynced });
  } catch (error) {
    console.error('PDF gen error:', error?.message || String(error));
    return Response.json({ error: error?.message || String(error) }, { status: 500 });
  }
}