import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { jsPDF } from 'npm:jspdf@4.2.1';
import { toBase64 } from '../../shared/pdfHelpers.ts';
import { loadOfferCtx } from '../../shared/offerPdfContext.ts';
import { buildOfferDocument } from '../../shared/offerPdfBuilder.ts';
import { generateOfferVisualScenes } from '../../shared/offerVisualScenes.ts';
import { fetchImageAsBase64 } from '../../shared/pdfHelpers.ts';
import { SUPLA_OFFER } from '../../shared/suplaOfferLayout.ts';
import { prepareOfferRevision } from '../../shared/offerRevision.ts';
import { ensureOfferCaseFolders, uploadBytes } from '../../shared/offerDrive.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json();
    const sr = base44.asServiceRole.entities;
    if (!body.project_order_id && !body.inquiry_id) return Response.json({ error: 'Missing project_order_id or inquiry_id' }, { status: 400 });
    let order;
    if (body.project_order_id) order = await sr.ProjectOrder.get(body.project_order_id);
    else {
      const { items } = await sr.ProjectOrder.filter({ inquiry_id: body.inquiry_id }, { sort: '-created_date', limit: 1 });
      order = items[0];
      if (!order) {
        if (!body.product_id) return Response.json({ error: 'Missing product_id' }, { status: 400 });
        const [inquiry, product] = await Promise.all([sr.Poptavka.get(body.inquiry_id), sr.Product.get(body.product_id)]);
        order = { inquiry_id: inquiry.id, inquiry_type: 'poptavka', client_name: inquiry.jmeno, client_email: inquiry.email, client_company: inquiry.firma || '', client_phone: inquiry.telefon || '', product_id: product.id, product_slug: product.slug, product_name: product.name, project_name: `${product.name} — ${inquiry.firma || inquiry.jmeno}`, description: inquiry.zprava, quote_number: `MLZ-2026-${inquiry.id.slice(-6).toUpperCase()}`, issued_at: new Date().toISOString(), valid_until: new Date(Date.now() + 30 * 86400000).toISOString(), smart_control_included: false, status: 'draft', shared_token: crypto.randomUUID() };
        if (!body.preview_only) order = await sr.ProjectOrder.create(order);
      }
    }
    const { ctx, quoteNum, sourcePhotos } = await loadOfferCtx(base44, order);
    const revision = body.refresh_pricing ? await prepareOfferRevision(base44, order, ctx, body.manual_product_price) : null;
    ctx.suplaImage = await fetchImageAsBase64(SUPLA_OFFER.image);
    if (!ctx.suplaImage) throw new Error('Nelze nacist obrazek automatizace SUPLA.');
    const reused = Boolean(body.reuse_visuals && ctx.scenes?.length >= 5);
    const scenes = reused ? ctx.scenes : await generateOfferVisualScenes(base44, { product: ctx.product || { name: ctx.productName }, sourcePhotos, quantity: ctx.lines[0]?.quantity || 1, goal: ctx.goal });
    ctx.scenes = scenes;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    buildOfferDocument(doc, ctx);
    const bytes = new Uint8Array(doc.output('arraybuffer'));
    const filename = `${quoteNum}-vizualni-nabidka-SUPLA.pdf`;
    if (body.preview_only) return Response.json({ ok: true, page_count: doc.getNumberOfPages(), product_total: ctx.total, supla_without_shaft: SUPLA_OFFER.base, supla_with_shaft: SUPLA_OFFER.withShaft, scene_count: scenes.length, filename });
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const folders = await ensureOfferCaseFolders(accessToken, { quoteNumber: quoteNum, clientName: order.client_company || order.client_name, issuedAt: order.issued_at });
    const uploaded = await uploadBytes(accessToken, folders.offerFolderId, bytes, filename, 'application/pdf');
    const up = { file_url: uploaded.url };
    if (!reused) await base44.asServiceRole.entities.OfferAsset.bulkCreate(scenes.map(s => ({
      inquiry_id: order.inquiry_id, inquiry_type: order.inquiry_type, project_order_id: order.id,
      file_url: s.url, file_name: `nabidka-${quoteNum}-scene-${s.sort_order}.webp`, file_type: 'image/webp',
      asset_type: 'generated_visualization', title: s.title, description: s.caption, generated_by_ai: true, selected_for_offer: true,
    })));
    await sr.OfferAsset.create({ inquiry_id: order.inquiry_id, inquiry_type: order.inquiry_type, project_order_id: order.id, file_url: up.file_url, file_name: filename, file_type: 'application/pdf', asset_type: 'quote_pdf', title: 'Kompletni vizualni nabidka / SUPLA A a B', selected_for_offer: true, generated_by_ai: false });
    if (revision) {
      const { items } = await sr.OfferVariant.filter({ project_order_id: order.id }, { sort: 'sort_order', limit: 1 });
      const variant = { inquiry_id: order.inquiry_id, inquiry_type: order.inquiry_type, project_order_id: order.id, product_id: order.product_id, product_slug: order.product_slug, product_name: ctx.productName, label: `${ctx.productName} — zakladni dodavka, SUPLA volitelne`, quantity: revision.quantity, unit_price: revision.unitPrice, total_price: ctx.total, recommended: true, sort_order: 1, price_status: revision.pricing.matched ? 'catalog' : 'manual_required', visualization_url: scenes[0]?.url };
      if (items[0]) await sr.OfferVariant.update(items[0].id, variant); else await sr.OfferVariant.create(variant);
    }
    await sr.ProjectOrder.update(order.id, { quote_pdf_url: up.file_url, drive_case_folder_id: folders.caseFolderId, drive_case_folder_url: `https://drive.google.com/drive/folders/${folders.caseFolderId}`, ...(revision ? { total_price: ctx.total, smart_control_included: false } : {}) });
    return Response.json({ ok: true, project_order_id: order.id, quote_number: quoteNum, pdf_url: up.file_url, filename, ...(body.return_pdf_base64 === false ? {} : { pdf_base64: toBase64(bytes) }), pages: scenes.map(({ img, ...scene }) => scene), page_count: doc.getNumberOfPages(), product_total: ctx.total, supla_without_shaft: SUPLA_OFFER.base, supla_with_shaft: SUPLA_OFFER.withShaft, alternatives: ctx.alternatives || [], pricing_note: ctx.pricingNote || '', note: 'Koncepcni vizualizace cekaji na rucni kontrolu. Nabidka je ulozena na Mlznem disku a nebyla odeslana klientovi.' });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}