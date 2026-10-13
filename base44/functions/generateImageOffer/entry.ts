import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { jsPDF } from 'npm:jspdf@4.2.1';
import { toBase64 } from '../../shared/pdfHelpers.ts';
import { loadOfferCtx } from '../../shared/offerPdfContext.ts';
import { buildOfferDocument } from '../../shared/offerPdfBuilder.ts';
import { generateOfferVisualScenes } from '../../shared/offerVisualScenes.ts';
import { fetchImageAsBase64 } from '../../shared/pdfHelpers.ts';
import { SUPLA_OFFER } from '../../shared/suplaOfferLayout.ts';
import { SUPLA_VISUALS } from '../../shared/suplaOfferVisuals.ts';
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
    const alternative1414 = body.alternative_variant === 'mrak1414';
    if (body.alternative_variant && !alternative1414) return Response.json({ error: 'Neznama alternativa produktu.' }, { status: 400 });
    const alternativePrice = Number(body.manual_product_price);
    if (alternative1414 && (order.product_slug !== 'mlzitko-mrak' || !Number.isFinite(alternativePrice) || alternativePrice <= 0)) return Response.json({ error: 'Alternativa MRAK 1414 vyzaduje projekt MRAKU a potvrzenou cenu produktu.' }, { status: 400 });
    const alternativeProduct = alternative1414 ? { name: 'MLZNY MRAK 1414', slug: 'mlzitko-mrak-1414', short_description: 'Samostatna tvarova varianta MRAK 1414 podle podkladu na Mlznem disku.', material: 'Nerezova ocel' } : null;
    const displayOrder = alternative1414 ? { ...order, product_name: alternativeProduct.name, total_price: alternativePrice, quote_number: `${order.quote_number}-1414` } : order;
    const { ctx, quoteNum, sourcePhotos } = await loadOfferCtx(base44, displayOrder, undefined, alternativeProduct);
    if (alternative1414) { ctx.total = alternativePrice; ctx.lines = [{ label: ctx.productName, description: alternativeProduct.short_description, quantity: 1, unit: 'ks', total: alternativePrice }]; ctx.pricingNote = 'Cena alternativy prevzata z predchoziho podkladu; pred objednanim potvrdit aktualnost a rozsah dodavky.'; }
    const revision = body.refresh_pricing && !alternative1414 ? await prepareOfferRevision(base44, order, ctx, body.manual_product_price) : null;
    const visualEntries = await Promise.all(Object.entries(SUPLA_VISUALS).map(async ([key, url]) => [key, await fetchImageAsBase64(url)]));
    ctx.suplaVisuals = Object.fromEntries(visualEntries);
    ctx.suplaImage = ctx.suplaVisuals.valve;
    [ctx.brandLogo, ctx.productImg] = await Promise.all([
      fetchImageAsBase64('https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/314f4a3ac_mlzidla_logo_bez_pozadi.png'),
      Promise.resolve(ctx.scenes?.[0]?.img || null),
    ]);
    if (visualEntries.some(([, img]) => !img)) throw new Error('Nelze nacist vizualizace automatizace SUPLA.');
    const reused = false;
    const scenes = ctx.scenes;
    ctx.productImg = scenes[0]?.img;
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
      file_url: s.file_uri || s.url, file_name: `nabidka-${quoteNum}-original-scene-${s.sort_order}`, file_type: s.img?.format === 'PNG' ? 'image/png' : 'image/jpeg',
      asset_type: 'product_reference', title: s.title, description: s.caption, generated_by_ai: false, selected_for_offer: true,
    })));
    await sr.OfferAsset.create({ inquiry_id: order.inquiry_id, inquiry_type: order.inquiry_type, project_order_id: order.id, file_url: up.file_url, file_name: filename, file_type: 'application/pdf', asset_type: 'quote_pdf', title: `${ctx.productName} / obrazova nabidka / volitelne SUPLA A a B`, description: ctx.pricingNote || 'Puvodni produktove podklady, zakladni dodavka a samostatne volitelne rizeni SUPLA.', selected_for_offer: true, generated_by_ai: false });
    if (revision) {
      const { items } = await sr.OfferVariant.filter({ project_order_id: order.id }, { sort: 'sort_order', limit: 1 });
      const variant = { inquiry_id: order.inquiry_id, inquiry_type: order.inquiry_type, project_order_id: order.id, product_id: order.product_id, product_slug: order.product_slug, product_name: ctx.productName, label: `${ctx.productName} — zakladni dodavka, SUPLA volitelne`, quantity: revision.quantity, unit_price: revision.unitPrice, total_price: ctx.total, recommended: true, sort_order: 1, price_status: revision.pricing.matched ? 'catalog' : 'manual_required', visualization_url: scenes[0]?.url };
      if (items[0]) await sr.OfferVariant.update(items[0].id, variant); else await sr.OfferVariant.create(variant);
    }
    if (!alternative1414) await sr.ProjectOrder.update(order.id, { quote_pdf_url: up.file_url, drive_case_folder_id: folders.caseFolderId, drive_case_folder_url: `https://drive.google.com/drive/folders/${folders.caseFolderId}`, ...(revision ? { total_price: ctx.total, smart_control_included: false } : {}) });
    return Response.json({ ok: true, project_order_id: order.id, quote_number: quoteNum, pdf_url: up.file_url, filename, ...(body.return_pdf_base64 === false ? {} : { pdf_base64: toBase64(bytes) }), pages: scenes.map(({ img, ...scene }) => scene), page_count: doc.getNumberOfPages(), product_total: ctx.total, supla_without_shaft: SUPLA_OFFER.base, supla_with_shaft: SUPLA_OFFER.withShaft, alternatives: ctx.alternatives || [], pricing_note: ctx.pricingNote || '', note: 'Produktove podklady pochazeji z katalogu a Mlzneho disku bez AI prekresleni konstrukce. SUPLA je volitelne. Nabidka je ulozena a nebyla odeslana klientovi.' });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}