// Sdílené načtení dat nabídky pro PDF (generateOfferConceptPdf, generateImageOffer)
import { clean, fetchSuplaPricing } from './suplaPricing.ts';
import { fetchImageAsBase64 } from './pdfHelpers.ts';
import type { OfferCtx, PdfImg } from './offerPdfBuilder.ts';

export async function loadOfferCtx(base44: any, order: any, inquiryId?: string) {
  const sr = base44.asServiceRole.entities;
  const variants = await sr.OfferVariant.filter({ project_order_id: order.id }).catch(() => []);
  let product: any = null;
  if (order.product_id) { try { product = await sr.Product.get(order.product_id); } catch { /* bez produktu */ } }
  const assets = await sr.OfferAsset.filter({ inquiry_id: order.inquiry_id || inquiryId }).catch(() => []);
  let vizUrls: string[] = (assets || []).filter((a: any) => a.asset_type === 'generated_visualization' && a.file_url).map((a: any) => a.file_url);
  if (!vizUrls.length && variants?.length) vizUrls = variants.map((v: any) => v.visualization_url).filter(Boolean);
  const productUrls: string[] = [product?.image_url, ...(product?.gallery_urls || [])].filter(Boolean);
  const imgUrls = [...vizUrls.slice(0, 3), ...productUrls.slice(0, 4)].filter((v, i, a) => a.indexOf(v) === i);
  const imgResults = await Promise.all(imgUrls.map((url) => fetchImageAsBase64(url)));
  const imgs: (PdfImg | null)[] = imgResults.map((r) => (r ? { data: r.data, format: r.format } : null));

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
  if (supla && supla.standard_price_ex_vat > 0) {
    total += supla.standard_price_ex_vat;
    lines.push({ label: 'SUPLA Smart řízení (Standard)', quantity: 1, unit: 'set', total: supla.standard_price_ex_vat });
  }

  const quoteNum = order.quote_number || `HT-${new Date().getFullYear()}-${String(order.id || Date.now()).slice(-5)}`;
  const validUntil = new Date(order.valid_until || Date.now() + 30 * 86400000).toLocaleDateString('cs-CZ');
  const ctx: OfferCtx = {
    productName: clean(order.product_name) || 'Mlžítko',
    clientName: clean(order.client_name) || '—',
    clientCompany: clean(order.client_company) || '',
    goal: clean(order.description).slice(0, 600),
    solution: clean(order.production_notes || order.description).slice(0, 600),
    benefits: [], lines, total,
    smart: order.smart_control_included !== false,
    quoteNum, validUntil, today: new Date().toLocaleDateString('cs-CZ'), product, imgs,
  };
  return { ctx, vizUrls, productUrls, total, quoteNum };
}