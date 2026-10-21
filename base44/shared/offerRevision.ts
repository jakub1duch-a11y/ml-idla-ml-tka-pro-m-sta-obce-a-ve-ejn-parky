import { findPricingForProduct } from './pricingSheet.ts';

export async function prepareOfferRevision(base44, order, ctx, manualPrice) {
  const sr = base44.asServiceRole.entities;
  const inquiry = await sr[order.inquiry_type === 'contact' ? 'ContactInquiry' : 'Poptavka'].get(order.inquiry_id);
  const goal = inquiry.zprava || inquiry.message || order.description || '';
  const pricing = await findPricingForProduct(base44, ctx.product, goal);
  const manual = Number(manualPrice);
  if (!pricing.matched && !(Number.isFinite(manual) && manual >= 1000)) throw new Error('Produkt nema overenou cenikovou cenu. Zadejte cenu z posledni nabidky k obchodni kontrole.');
  const unitPrice = pricing.matched ? pricing.offer_price_ex_vat : manual;
  const quantity = Math.max(1, Number(inquiry.quantity || 1));
  ctx.total = unitPrice * quantity;
  ctx.lines = [{ label: ctx.productName, quantity, unit: 'ks', total: ctx.total }];
  ctx.smart = false;
  ctx.goal = goal.slice(0, 1200);
  ctx.solution = `${inquiry.installation_location || (/BRNO/i.test(goal) ? 'Mateřská škola v Brně' : 'Zahrada mateřské školy')}. Navrhujeme ${quantity} ks ${ctx.productName}. Vizualizace ukazují ilustrační prostředí, nikoli zaměření konkrétního místa. Volitelné řízení SUPLA je naceněno samostatně ve dvou alternativách. Umístění, kotvení, přívod vody, napájení, dopravu a montáž ověříme před realizací.`;
  ctx.pricingNote = pricing.matched ? `Cena dle aktuálního ceníku Kalkulace 2026. Provedení: ${pricing.sheet_spec || pricing.sheet_key}.` : 'Cena produktu převzata z poslední nabídky; ceník nemá vyplněnou cenu. Před odesláním musí obchodník potvrdit částku a rozsah dodávky.';
  ctx.alternatives = [];
  if (/MRAK/i.test(ctx.productName) && /dalš|podobn|nízko|cenov/i.test(goal)) {
    const { items } = await sr.Product.filter({ slug: { $in: ['mlzitko-bendy', 'mlzitko-lizatko', 'y-armist-tr60'] } }, { limit: 3 });
    ctx.alternatives = (await Promise.all(items.map(async product => { const p = await findPricingForProduct(base44, product, goal); return p.matched ? { label: product.name, total: p.offer_price_ex_vat, product_id: product.id, product_slug: product.slug } : null; }))).filter(Boolean);
  }
  return { inquiry, unitPrice, quantity, pricing, ctx };
}