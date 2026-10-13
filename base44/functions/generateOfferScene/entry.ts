import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import OpenAI from 'npm:openai@6.45.0';
import { VARIANTS, ENVIRONMENTS } from '../../shared/imageOfferCatalog.ts';
import { driveImage } from '../../shared/imageOfferMedia.ts';

const MODEL = 'gpt_image_2_5_flare';

function buildPrompt(variant, env, product) {
  return [
    `Photorealistic architectural photograph for a premium B2B product offer. Place the exact stainless-steel misting element from the reference image into this setting: ${env.prompt}.`,
    'The reference photo is the master: reproduce the product silhouette, number of tubes, every bend and curve, tube profile, proportions, brushed stainless finish, nozzle positions and ground anchoring exactly as shown. Do not redesign, simplify, mirror, add or remove any tube, arm, bend, ring, nozzle, base plate or decoration. Ignore everything else in the reference photo (people, background, watermarks).',
    variant.scale ? `Real-world size: ${variant.scale}.` : 'Keep a realistic real-world scale.',
    'A light translucent cooling mist of micro water droplets comes only from the existing nozzles and catches the sunlight; it is fine aerosol, not smoke or steam.',
    'Composition: the product is the clear hero, eye-level 35 mm lens, natural summer daylight, realistic shadows and reflections, very high detail, calm and clean scene.',
    'Strictly no people, no children, no animals, no text, no letters, no logos, no watermarks.',
    product?.visual_geometry_lock ? `Geometry lock: ${product.visual_geometry_lock}` : '',
    product?.visual_negative_rules?.length ? `Forbidden changes: ${product.visual_negative_rules.join('; ')}.` : '',
  ].filter(Boolean).join('\n');
}

// Vygeneruje fotorealistickou vizualizaci produktu v prostoru podle originální fotografie. Výsledek čeká na ruční schválení.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const { project_order_id, variant_key, environment_key, dry_run } = await req.json();
    const variant = VARIANTS.find(v => v.key === variant_key);
    const env = ENVIRONMENTS.find(e => e.key === environment_key);
    if (!project_order_id || !variant || !env) return Response.json({ error: 'Neplatná nabídka, produkt nebo prostředí.' }, { status: 400 });
    const sr = base44.asServiceRole;
    const [order, products] = await Promise.all([sr.entities.ProjectOrder.get(project_order_id), sr.entities.Product.filter({ slug: variant.slug }, { limit: 1 })]);
    const product = products.items?.[0];
    let referenceUrl = '';
    if (variant.driveFiles.length) {
      const { accessToken } = await sr.connectors.getConnection('googledrive');
      const img = await driveImage(accessToken, variant.driveFiles[0]);
      const up = await sr.integrations.Core.UploadPrivateFile({ file: new File([img.bytes], `${variant.key}-reference.jpg`, { type: img.type }) });
      referenceUrl = (await sr.integrations.Core.CreateFileSignedUrl({ file_uri: up.file_uri, expires_in: 1800 })).signed_url;
    } else {
      const src = product?.visual_master_reference_url || product?.image_url || '';
      referenceUrl = src.startsWith('/') ? `https://mlzidla.cz${src}` : src;
    }
    if (!referenceUrl) return Response.json({ error: 'Chybí originální fotografie produktu.' }, { status: 400 });

    const { baseURL, token, headers } = sr.aiGateway.connection();
    const client = new OpenAI({ baseURL, apiKey: token, defaultHeaders: headers, maxRetries: 0, timeout: 280000 });
    const request = { model: MODEL, prompt: buildPrompt(variant, env, product), n: 1, response_format: 'url', aspect_ratio: '4:3', resolution: '2K', quality: 'medium', reference_image_urls: [referenceUrl] };
    if (dry_run) {
      const estimate = await client.images.generate({ ...request, dry_run: true });
      return Response.json({ ok: true, dry_run: true, credits: estimate.usage?.base44_credits });
    }
    const { data, usage } = await client.images.generate(request);
    const url = data?.[0]?.url;
    if (!url) throw new Error('Generátor nevrátil obrázek.');
    const asset = await sr.entities.OfferAsset.create({
      inquiry_id: order.inquiry_id || order.id, inquiry_type: order.inquiry_type, project_order_id: order.id,
      file_url: url, file_name: `${order.quote_number}-ai-scene-${variant.key}--${env.key}--${Date.now()}.png`, file_type: 'image/png',
      asset_type: 'generated_visualization', title: `${variant.title} · ${env.label}`,
      description: `Fotorealistická AI vizualizace prostředí (${MODEL}) podle originální fotografie produktu. Do nabídky až po ruční kontrole konstrukce.`,
      selected_for_offer: false, generated_by_ai: true,
    });
    return Response.json({ ok: true, asset: { id: asset.id, title: asset.title, file_url: url }, credits: usage?.base44_credits });
  } catch (error) { return Response.json({ error: error.message }, { status: 500 }); }
}