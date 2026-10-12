import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { jsPDF } from 'npm:jspdf@4.2.1';
import { toBase64 } from '../../shared/pdfHelpers.ts';
import { loadOfferCtx } from '../../shared/offerPdfContext.ts';
import { buildOfferDocument } from '../../shared/offerPdfBuilder.ts';
import { generateOfferVisualScenes } from '../../shared/offerVisualScenes.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const body = await req.json();
    if (!body.project_order_id) return Response.json({ error: 'Missing project_order_id' }, { status: 400 });
    const order = await base44.asServiceRole.entities.ProjectOrder.get(body.project_order_id);
    const { ctx, quoteNum, sourcePhotos } = await loadOfferCtx(base44, order);
    const reused = Boolean(body.reuse_visuals && ctx.scenes?.length >= 5);
    const scenes = reused ? ctx.scenes : await generateOfferVisualScenes(base44, { product: ctx.product || { name: ctx.productName }, sourcePhotos, quantity: ctx.lines[0]?.quantity || 1, goal: ctx.goal });
    ctx.scenes = scenes;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    buildOfferDocument(doc, ctx);
    const bytes = new Uint8Array(doc.output('arraybuffer'));
    const up = await base44.asServiceRole.integrations.Core.UploadPublicFile({ file: new Blob([bytes], { type: 'application/pdf' }) });
    if (!up?.file_url) throw new Error('PDF se nepodarilo ulozit.');
    if (!reused) await base44.asServiceRole.entities.OfferAsset.bulkCreate(scenes.map(s => ({
      inquiry_id: order.inquiry_id, inquiry_type: order.inquiry_type, project_order_id: order.id,
      file_url: s.url, file_name: `nabidka-${quoteNum}-scene-${s.sort_order}.webp`, file_type: 'image/webp',
      asset_type: 'generated_visualization', title: s.title, description: s.caption, generated_by_ai: true, selected_for_offer: true,
    })));
    await base44.asServiceRole.entities.ProjectOrder.update(order.id, { quote_pdf_url: up.file_url });
    return Response.json({ ok: true, quote_number: quoteNum, pdf_url: up.file_url, pdf_base64: toBase64(bytes), pages: scenes.map(({ img, ...scene }) => scene), page_count: doc.getNumberOfPages(), note: 'Koncepcni vizualizace cekaji na rucni kontrolu. Texty, ceny, schema SUPLA a QR kod jsou vykresleny systemem.' });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}