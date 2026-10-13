import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { VARIANTS, ENVIRONMENTS, ANGLES, COVER_INTRO } from '../../shared/imageOfferCatalog.ts';
import { driveImage, urlImage, toDataUrl } from '../../shared/imageOfferMedia.ts';

// Vrací data pro obrazové nabídky: klient, souhrn poptávky, ceny z ceníku a originální fotografie jako data URL.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const { project_order_id } = await req.json();
    if (!project_order_id) return Response.json({ error: 'Chybí project_order_id' }, { status: 400 });
    const sr = base44.asServiceRole.entities;
    const order = await sr.ProjectOrder.get(project_order_id);
    const [profiles, products, orderVariants] = await Promise.all([
      sr.ProductOfferProfile.filter({}, { limit: 100 }),
      sr.Product.filter({ slug: { $in: [...new Set(VARIANTS.map(v => v.slug))] } }, { limit: 20 }),
      sr.OfferVariant.filter({ project_order_id }, { limit: 30 }),
    ]);
    const { accessToken } = await base44.asServiceRole.connectors.getConnection('googledrive');
    const alt1414 = orderVariants.items.find(v => /1414/.test(`${v.label} ${v.product_name}`));
    const variants = await Promise.all(VARIANTS.map(async (v) => {
      const product = products.items.find(p => p.slug === v.slug) || products.items.find(p => p.slug === 'mlzitko-mrak');
      const profile = profiles.items.find(p => p.product_slug === v.slug);
      const price = v.fixedPrice || (v.priceFromOrderAlternative ? Number(alt1414?.total_price || 0) : Number(profile?.unit_price_ex_vat || 0));
      const images = [];
      for (const id of v.driveFiles) { try { images.push(toDataUrl(await driveImage(accessToken, id))); } catch (_) { /* přeskočit nedostupnou fotku */ } }
      if (!images.length && product) {
        const img = await urlImage(product.visual_master_reference_url || product.image_url);
        if (img) images.push(toDataUrl(img));
      }
      return { key: v.key, eyebrow: v.eyebrow, title: v.title, subtitle: v.subtitle, recommended: !!v.recommended, price, priceNote: v.priceNote || (price ? '' : 'Cena bude potvrzena po ověření rozsahu.'), spec: v.spec, tableSpec: v.tableSpec, fit: v.fit, material: product?.material || '', pressure: product?.pressure || '', water: product?.water_consumption || '', images };
    }));
    return Response.json({
      ok: true,
      intro: COVER_INTRO,
      summary: order.description || '',
      validUntil: order.valid_until,
      client: { name: order.client_name, company: order.client_company, quote: order.quote_number },
      environments: ENVIRONMENTS.map(({ key, label, note }) => ({ key, label, note })),
      angles: ANGLES.map(({ key, label }) => ({ key, label })),
      variants,
    });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}