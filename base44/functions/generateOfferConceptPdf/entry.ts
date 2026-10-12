import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { jsPDF } from 'npm:jspdf@4.2.1';
import { clean, fetchSuplaPricing } from '../../shared/suplaPricing.ts';
import { ensureOfferCaseFolders, uploadBytes } from '../../shared/offerDrive.ts';
import { ensureSheet, ensureHeaders, appendRow } from '../../shared/googleSheets.ts';
import { toBase64, fetchImageAsBase64 } from '../../shared/pdfHelpers.ts';
import { drawCoverPage, drawSolutionPage, drawTechPage, drawPlacementPage, drawSmartPage, drawPricePage, drawDarkHeroPage, drawPhotoHeroPage, drawRecapPage, type OfferCtx, type PdfImg } from '../../shared/offerPdfBuilder.ts';

const OFFERS_SPREADSHEET_ID = '1MS4i00ekY3Pf3fY-AsUdCT7GtNiCk5XPDr8CLiwym6M';
const OFFERS_SHEET = 'Nabídky';
const OFFER_HEADERS = ['Datum', 'Číslo nabídky', 'Klient', 'Email', 'Firma', 'Projekt', 'Produkt', 'Mezisoučet bez DPH', 'DPH 21%', 'Celkem s DPH', 'Stav', 'PDF URL', 'Drive URL', 'ID projektu'];

const short = (value: unknown, max = 2000) => clean(value).slice(0, max);

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const inquiryId = body.inquiry_id;
    const inquiryType = body.inquiry_type === 'contact' ? 'contact' : 'poptavka';
    const projectOrderId = body.project_order_id;
    if (!inquiryId && !projectOrderId) return Response.json({ error: 'Missing inquiry_id or project_order_id' }, { status: 400 });

    // ── Load ProjectOrder ──
    let order: any = null;
    if (projectOrderId) order = await base44.asServiceRole.entities.ProjectOrder.get(projectOrderId);
    else { const orders = await base44.asServiceRole.entities.ProjectOrder.filter({ inquiry_id: inquiryId }); order = orders?.[0] || null; }
    if (!order) return Response.json({ error: 'Koncept nebyl nalezen. Nejprve připravte koncept nabídky.' }, { status: 404 });

    // ── Load OfferVariants + Product + Visualizations ──
    const variants = await base44.asServiceRole.entities.OfferVariant.filter({ project_order_id: order.id }).catch(() => []);
    let product: any = null;
    if (order.product_id) { try { product = await base44.asServiceRole.entities.Product.get(order.product_id); } catch {} }
    const effectiveInquiryId = order.inquiry_id || inquiryId;
    const assets = await base44.asServiceRole.entities.OfferAsset.filter({ inquiry_id: effectiveInquiryId }).catch(() => []);
    let vizUrls = (assets || []).filter((a) => a.asset_type === 'generated_visualization' && a.file_url).map((a) => a.file_url);
    if (!vizUrls.length && variants?.length) vizUrls = variants.map((v) => v.visualization_url).filter(Boolean);
    const galleryUrls = [product?.image_url, ...(product?.gallery_urls || [])].filter(Boolean);
    const allImgUrls = [...vizUrls.slice(0, 3), ...galleryUrls.slice(0, 4)].filter((v, i, a) => a.indexOf(v) === i);
    const imgResults = await Promise.all(allImgUrls.map((url) => fetchImageAsBase64(url)));
    const imgs: (PdfImg | null)[] = imgResults.map((r) => r ? { data: r.data, format: r.format } : null);

    // ── SUPLA pricing ──
    const suplaPricing = await fetchSuplaPricing(base44);

    // ── Compute line items ──
    let baseTotal = 0;
    const lineItems: any[] = [];
    (variants || []).forEach((v) => {
      const qty = Number(v.quantity || 1);
      const unit = Number(v.unit_price || 0);
      const total = Number(v.total_price || (unit * qty));
      baseTotal += total;
      lineItems.push({ label: clean(v.product_name) || clean(v.label) || 'Produkt', quantity: qty, unit: 'ks', total });
    });
    if (!lineItems.length && order.product_name) {
      baseTotal = Number(order.total_price || 0);
      lineItems.push({ label: clean(order.product_name), quantity: 1, unit: 'ks', total: baseTotal });
    }
    if (suplaPricing && suplaPricing.standard_price_ex_vat > 0) {
      baseTotal += suplaPricing.standard_price_ex_vat;
      lineItems.push({ label: 'SUPLA Smart řízení (Standard)', quantity: 1, unit: 'set', total: suplaPricing.standard_price_ex_vat });
    }

    const quoteNum = order.quote_number || `HT-${new Date().getFullYear()}-${String(order.id || Date.now()).slice(-5)}`;
    const validUntil = order.valid_until ? new Date(order.valid_until).toLocaleDateString('cs-CZ') : new Date(Date.now() + 30 * 86400000).toLocaleDateString('cs-CZ');

    const ctx: OfferCtx = {
      productName: clean(order.product_name) || 'Mlžítko',
      clientName: clean(order.client_name) || '—',
      clientCompany: clean(order.client_company) || '',
      goal: short(order.description, 600),
      solution: short(order.production_notes || order.description, 600),
      benefits: [],
      lines: lineItems,
      total: baseTotal,
      smart: order.smart_control_included !== false,
      quoteNum,
      validUntil,
      today: new Date().toLocaleDateString('cs-CZ'),
      product,
      imgs,
    };

    // ── Build 9-page PDF ──
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    drawCoverPage(doc, ctx);
    doc.addPage(); drawSolutionPage(doc, ctx);
    doc.addPage(); drawTechPage(doc, ctx);
    doc.addPage(); drawPlacementPage(doc, ctx);
    if (ctx.smart) { doc.addPage(); drawSmartPage(doc, ctx); }
    doc.addPage(); drawPricePage(doc, ctx);
    doc.addPage(); drawDarkHeroPage(doc, ctx);
    doc.addPage(); drawPhotoHeroPage(doc, ctx);
    doc.addPage(); drawRecapPage(doc, ctx);

    const pdfBytes = doc.output('arraybuffer');

    // ── Upload to storage ──
    let pdfUrl = '';
    try {
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const uploadResult = await base44.asServiceRole.integrations.Core.UploadPublicFile({ file: blob });
      pdfUrl = uploadResult?.file_url || '';
      if (pdfUrl) await base44.asServiceRole.entities.ProjectOrder.update(order.id, { quote_pdf_url: pdfUrl });
    } catch (e) { console.warn('PDF upload failed', e); }

    // ── Upload to Google Drive ──
    let driveUrl = '', driveFolderUrl = '';
    try {
      const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
      const folders = await ensureOfferCaseFolders(accessToken, { quoteNumber: quoteNum, clientName: order.client_name || order.client_email || 'klient', issuedAt: new Date().toISOString() });
      const uploaded = await uploadBytes(accessToken, folders.offerFolderId, new Uint8Array(pdfBytes), `Koncept_${quoteNum}.pdf`, 'application/pdf');
      driveUrl = uploaded.url;
      driveFolderUrl = `https://drive.google.com/drive/folders/${folders.caseFolderId}`;
    } catch (e) { console.warn('Drive upload failed', e); }

    // ── Sync to Google Sheet ──
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
    const base64 = toBase64(new Uint8Array(pdfBytes));
    return Response.json({ ok: true, pdf_base64: base64, drive_url: driveUrl, drive_folder_url: driveFolderUrl, filename: `koncept-${quoteNum}.pdf`, quote_number: quoteNum, sheet_synced: sheetSynced });
  } catch (error) {
    console.error('PDF gen error:', error?.message || String(error));
    return Response.json({ error: error?.message || String(error) }, { status: 500 });
  }
}