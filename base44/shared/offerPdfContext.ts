// Sdílené načtení dat nabídky pro PDF (generateOfferConceptPdf, generateImageOffer)
import { clean, fetchSuplaPricing } from './suplaPricing.ts';
import { fetchImageAsBase64 } from './pdfHelpers.ts';
import type { OfferCtx, PdfImg } from './offerPdfBuilder.ts';
import { loadOriginalProductScenes } from './offerProductReferences.ts';

export async function loadOfferCtx(base44: any, order: any, inquiryId?: string, productOverride: any = null) {
  const sr = base44.asServiceRole.entities;
  const { items: variants } = await sr.OfferVariant.filter({ project_order_id: order.id }, { sort: 'sort_order', limit: 1 });
  let product: any = productOverride;
  if (!product && order.product_id) { try { product = await sr.Product.get(order.product_id); } catch { /* bez produktu */ } }
  const { items: assets } = await sr.OfferAsset.filter({ project_order_id: order.id }, { sort: 'created_date', limit: 50 });
  const vizUrls: string[] = [];
  const productUrls: string[] = [product?.visual_master_reference_url || product?.image_url].filter(Boolean);
  const imgs: (PdfImg | null)[] = [];

  const supla = await fetchSuplaPricing(base44);
  let total = 0;
  const lines: any[] = [];
  (variants || []).forEach((v: any) => {
    const qty = Number(v.quantity || 1);
    const t = Number(v.total_price || Number(v.unit_price || 0) * qty);
    total += t;
    lines.push({ label: clean(v.product_name) || clean(v.label) || 'Produkt', quantity: qty, unit: 'ks', total: t });
  });
  if (!lines.length && order.product_name) {
    total = Number(order.total_price || 0);
    lines.push({ label: clean(order.product_name), quantity: 1, unit: 'ks', total });
  }
  // Alternativní varianty se nesčítají a volitelná SUPLA se nepřičítá podruhé.
  const selectedVariant = variants?.[0];
  total = Number(order.total_price || selectedVariant?.total_price || 0);
  lines.splice(0, lines.length, ...(selectedVariant?.line_items?.length
    ? selectedVariant.line_items.map(l => ({ ...l, label: clean(l.label) }))
    : [{ label: clean(order.product_name) || 'Produkt', quantity: selectedVariant?.quantity || 1, unit: 'ks', total }]));

  const quoteNum = order.quote_number || `HT-${new Date().getFullYear()}-${String(order.id || Date.now()).slice(-5)}`;
  const validUntil = new Date(order.valid_until || Date.now() + 30 * 86400000).toLocaleDateString('cs-CZ');
  const ctx: OfferCtx = {
    productName: clean(order.product_name) || 'Mlžítko',
    clientName: clean(order.client_name) || '—',
    clientCompany: clean(order.client_company) || '',
    goal: clean(order.description).slice(0, 600),
    solution: clean(order.production_notes || order.description).slice(0, 600),
    benefits: [], lines, total,
    smart: order.smart_control_included === true,
    quoteNum, validUntil, today: new Date().toLocaleDateString('cs-CZ'), product, imgs, supla,
  };
  let inquiry = null;
  if (order.inquiry_id || inquiryId) inquiry = await sr[order.inquiry_type === 'contact' ? 'ContactInquiry' : 'Poptavka'].get(order.inquiry_id || inquiryId);
  const attachmentPhotos = (inquiry?.attachment_urls || []).filter((url, i) => /\.(png|jpe?g|webp)(?:$|\?)/i.test(inquiry?.attachment_names?.[i] || url));
  const sourcePhotos = [...attachmentPhotos, ...assets.filter(a => a.asset_type === 'source_photo').map(a => a.file_url)].filter(Boolean);
  if (!product) { const master = assets.find(a => a.asset_type === 'product_reference'); ctx.product = { name: ctx.productName, image_url: master?.file_url || '' }; }
  ctx.scenes = await loadOriginalProductScenes(base44, ctx.product);
  ctx.productImg = ctx.scenes[0]?.img;
  ctx.imgs = ctx.scenes.map(s => s.img);
  return { ctx, vizUrls, productUrls, total, quoteNum, sourcePhotos };
}