import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { ensureOfferCaseFolders, upsertBytes } from '../../shared/offerDrive.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const { pdfBytes, pdf_base64: pdfBase64, filename, quoteNumber, inquiryEmail, inquiryName, issued_at: issuedAt, project_order_id: projectOrderId } = await req.json();
    if ((!pdfBytes && !pdfBase64) || !filename || !quoteNumber) return Response.json({ error: 'Missing PDF payload, filename or quoteNumber' }, { status: 400 });

    const bytes = pdfBase64 ? Uint8Array.from(atob(pdfBase64), (character) => character.charCodeAt(0)) : new Uint8Array(pdfBytes);
    const order = projectOrderId ? await base44.asServiceRole.entities.ProjectOrder.get(projectOrderId) : null;
    if (projectOrderId && (!order || order.quote_number !== quoteNumber)) return Response.json({ error: 'ProjectOrder does not match quoteNumber' }, { status: 400 });
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const folders = await ensureOfferCaseFolders(accessToken, { quoteNumber, clientName: order?.client_company || order?.client_name || inquiryName || inquiryEmail || 'klient', issuedAt: order?.issued_at || issuedAt || new Date().toISOString() });
    const uploaded = await upsertBytes(accessToken, folders.offerFolderId, bytes, filename, 'application/pdf');
    if (order) await base44.asServiceRole.entities.ProjectOrder.update(order.id, {
      quote_drive_file_url: uploaded.url,
      drive_case_folder_id: folders.caseFolderId,
      drive_case_folder_url: `https://drive.google.com/drive/folders/${folders.caseFolderId}`,
    });

    return Response.json({
      success: true,
      file_id: uploaded.id,
      drive_url: uploaded.url,
      drive_case_folder_id: folders.caseFolderId,
      drive_case_folder_url: `https://drive.google.com/drive/folders/${folders.caseFolderId}`,
      folder_name: `04_OBCHOD/00_NABIDKA_POPTAVKA_APP/01_AKTIVNI_PRIPADY/${new Date(issuedAt || Date.now()).getFullYear()}/${folders.caseName}/02_NABIDKA`,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
