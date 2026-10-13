import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { VARIANTS } from '../../shared/imageOfferCatalog.ts';

// Vrací data pro obrazové nabídky: klient, ceny z ceníku a originální fotografie jako data URL (bez CORS problémů v canvasu).
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
    const toDataUrl = async (id) => {
      const meta = await (await fetch(`https://www.googleapis.com/drive/v3/files/${id}?fields=mimeType,thumbnailLink&supportsAllDrives=true`, { headers: { Authorization: `Bearer ${accessToken}` }, signal: AbortSignal.timeout(15000) })).json();
      const url = meta.thumbnailLink ? meta.thumbnailLink.replace(/=s\d+$/, '=s1600') : `https://www.googleapis.com/drive/v3/files/${id}?alt=media&supportsAllDrives=true`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` }, signal: AbortSignal.timeout(25000) });
      if (!res.ok) throw new Error(`Fotografii ${id} nelze načíst.`);
      const bytes = new Uint8Array(await res.arrayBuffer());
      let bin = ''; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      return `data:${res.headers.get('content-type') || meta.mimeType || 'image/jpeg'};base64,${btoa(bin)}`;
    };
    const toCatalogDataUrl = async (url) => {
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) return null;
      const bytes = new Uint8Array(await res.arrayBuffer());
      let bin = ''; for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
      return `data:${res.headers.get('content-type') || 'image/jpeg'};base64,${btoa(bin)}`;
    };
    const alt1414 = orderVariants.items.find(v => /1414/.test(`${v.label} ${v.product_name}`));
    const variants = await Promise.all(VARIANTS.map(async (v) => {
      const product = products.items.find(p => p.slug === v.slug) || products.items.find(p => p.slug === 'mlzitko-mrak');
      const profile = profiles.items.find(p => p.product_slug === v.slug);
      const price = v.fixedPrice || (v.priceFromOrderAlternative ? Number(alt1414?.total_price || 0) : Number(profile?.unit_price_ex_vat || 0));
      const images = [];
      for (const id of v.driveFiles) { try { images.push(await toDataUrl(id)); } catch (_) { /* přeskočit nedostupnou fotku */ } }
      if (!images.length && product) {
        const src = product.visual_master_reference_url || product.image_url;
        const full = src?.startsWith('/') ? `https://mlzidla.cz${src}` : src;
        const data = full ? await toCatalogDataUrl(full) : null;
        if (data) images.push(data);
      }
      return { key: v.key, title: v.title, subtitle: v.subtitle, recommended: !!v.recommended, price, priceNote: v.priceNote || (price ? '' : 'Cena bude potvrzena po ověření rozsahu.'), spec: v.spec, material: product?.material || '', pressure: product?.pressure || '', water: product?.water_consumption || '', images };
    }));
    const logo = await toCatalogDataUrl('https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/314f4a3ac_mlzidla_logo_bez_pozadi.png');
    return Response.json({ ok: true, logo, client: { name: order.client_name, company: order.client_company, quote: order.quote_number }, variants });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}