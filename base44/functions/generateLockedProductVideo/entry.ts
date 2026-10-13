import { createClientFromRequest } from 'npm:@base44/sdk@0.8.53';
import OpenAI from 'npm:openai@6.45.0';

// PRODUCT LOCK video: Seedance s referenčními fotkami skutečného produktu (MASTER + web mlzidla.cz + Mlžný disk).
// action: "prepare" (sestaví reference + prompt + odhad kreditů), "create" (spustí job), "retrieve" (stav jobu).

const MODEL = 'seedance_2_fast';
const MAX_REFS = 6;
const ASPECTS = ['16:9', '9:16', '1:1'];

const isImage = (url: string) => /^https?:\/\//i.test(url) && !/\.(mp4|webm|mov|gif)(\?|$)/i.test(url);
const abs = (url?: string) => (url?.startsWith('/') ? `https://mlzidla.cz${url}` : url || '');

const familyLock = (p: any) => {
  const key = `${p.name || ''} ${p.slug || ''}`.toLowerCase();
  if (key.includes('bendy')) return 'BENDY: jeden čistý svislý nerezový dřík přecházející do jednoho plynulého horního ohybu přesně podle fotografií. Žádné větvení, boční trubky ani sekundární oblouky.';
  if (key.includes('stéblo') || key.includes('steblo')) return 'STÉBLO: jedna souvislá organicky zakřivená nerezová silueta, beze změny délky, rádiusu, sklonu a zakončení.';
  if (key.includes('linea')) return 'LINEA: přesně ta varianta profilu, kterou ukazují fotografie; žádný další zlom ani druhé rameno.';
  if (key.includes('gate') || key.includes('brána') || key.includes('brana')) return 'GATE: přesná geometrie průchozí brány s oběma boky/oblouky; neměnit šířku průchodu ani počet nosných prvků.';
  if (key.includes('aura')) return 'AURA: stejná silueta, rádius oblouku/kruhu, výška, zakončení a poloha trysek jako na fotografiích.';
  if (key.includes('mrak')) return 'MRAK: stejná organická silueta a počet konstrukčních částí; žádné nové smyčky.';
  if (key.includes('teepee')) return 'TEEPEE: stejný počet nosných prvků, sklon, spojení a půdorys; žádné další vzpěry.';
  if (key.includes('spirál') || key.includes('spiral')) return 'SPIRÁLA: stejný počet závitů, průměry a rozestupy.';
  if (key.includes('lízát') || key.includes('lizat')) return 'LÍZÁTKO: stejný kruhový prvek, průměr, napojení na stojinu a poloha trysek.';
  return 'Stejná silueta, topologie konstrukce, počet a poloha ramen/trubek/trysek, rádiusy, proporce, patka a kotvení jako na fotografiích.';
};

async function collectReferences(sr: any, product: any, extra: string[] = []) {
  const media = await sr.MediaFile.filter({ product_slug: product.slug }, { limit: 60 }).catch(() => ({ items: [] }));
  const items = (media?.items || media || []) as any[];
  // Reference = čistý produkt (studio, hero, detail). Realizace a vizualizace se scenérií/lidmi generátor mate, proto se nepoužívají.
  const rank = (m: any) => ({ hero: 0, gallery: 1, detail: 2 } as Record<string, number>)[m.media_role] ?? 9;
  const NOT_CLEAN = /realiz|instal|montaz|vyrob|diagram|schema|smart|supla|ovlad|ovládání|render|vizual|generated|chatgpt|gemini|ai_|reference|park|namesti|náměstí|zahrad/i;
  const disk = items
    .filter((m) => isImage(m.file_url) && rank(m) < 9 && !NOT_CLEAN.test(`${m.file_name || ''} ${m.file_url || ''}`))
    .sort((a, b) => rank(a) - rank(b) || (a.sort_order || 0) - (b.sort_order || 0))
    .map((m) => m.file_url);
  const clean = (u: string) => u && !NOT_CLEAN.test(u);
  const list = [
    product.visual_master_reference_url,
    product.hero_visual_verified && clean(product.hero_product_image_url) ? product.hero_product_image_url : '',
    clean(product.image_url) ? product.image_url : '',
    ...extra,
    ...disk,
  ].map(abs).filter((u) => u && isImage(u));
  const uniq = list.filter((u, i, all) => all.indexOf(u) === i).slice(0, MAX_REFS);
  return { references: uniq, diskCount: disk.length };
}

function buildPrompt(product: any, o: any) {
  const dims = [
    product.material && `materiál ${product.material}`,
    product.pressure && `tlak ${product.pressure}`,
    product.coverage_area && `dosah ${product.coverage_area}`,
  ].filter(Boolean).join(', ');
  const dimLine = o.heightMm || o.diameterMm
    ? `ROZMĚRY (závazné měřítko): ${o.heightMm ? `celková výška ${o.heightMm} mm` : ''}${o.heightMm && o.diameterMm ? ', ' : ''}${o.diameterMm ? `průměr profilu ${o.diameterMm} mm` : ''}. Produkt je ve scéně v reálném měřítku vůči člověku (dospělý ~1750 mm).`
    : 'Produkt je ve scéně v reálném měřítku vůči člověku (dospělý ~1750 mm); poměry výšky, šířky a tloušťky profilu zůstávají jako na fotografiích.';
  const rules = [...(product.visual_negative_rules || [])].filter(Boolean);
  return [
    `PRODUCT LOCK. Video ukazuje skutečný výrobek MLŽIDLA® ${product.name}. Referenční obrázky jsou fotografie reálného produktu z webu mlzidla.cz a z firemního disku; výrobek věrně zachovej.`,
    'Zachovej přesně: siluetu, dráhu trubky, ohyby a rádiusy, počet a polohu trysek, patku a kotvení, kartáčovaný nerez, poměry a rozměry. Nic nepřidávej, neubírej, neztlušťuj, nezdvojuj ani nemorfuj. Tvar produktu se v žádném snímku nemění.',
    familyLock(product),
    product.visual_geometry_lock ? `Geometrie: ${product.visual_geometry_lock}` : '',
    dimLine,
    dims ? `Technické údaje: ${dims}.` : '',
    `Počet kusů ve scéně: přesně ${o.quantity} identických ${o.quantity === 1 ? 'kus' : 'kusů'}.`,
    `Prostředí: ${o.environmentPrompt}.`,
    'Animuje se pouze okolí: pomalý plynulý pohyb kamery, světlo klouzající po nerezu, jemná průsvitná vodní mlha vycházející pouze ze skutečných trysek, přirozený pohyb lidí v pozadí. Bez textu, loga a vodoznaku ve videu, bez hadic a kabelů.',
    rules.length ? `Zakázané změny: ${rules.join('; ')}.` : '',
    String(o.scene || '').trim() ? `Scéna: ${String(o.scene).trim()}` : '',
  ].filter(Boolean).join('\n');
}

export default async function handler(req: Request) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json();
    const { baseURL, token, headers } = base44.asServiceRole.aiGateway.connection();
    const videos = new OpenAI({ baseURL, apiKey: token, defaultHeaders: headers }).videos;

    if (body.action === 'retrieve') {
      if (!body.videoId) return Response.json({ error: 'Chybí videoId' }, { status: 400 });
      return Response.json(await videos.retrieve(body.videoId));
    }

    if (!['prepare', 'create'].includes(body.action)) return Response.json({ error: 'Neplatná akce' }, { status: 400 });
    const sr = base44.asServiceRole.entities;
    const found = await sr.Product.filter({ slug: String(body.productSlug || '') }, { limit: 1 });
    const product = (found?.items || found || [])[0];
    if (!product) return Response.json({ error: 'Produkt nenalezen.' }, { status: 404 });

    const { references, diskCount } = await collectReferences(sr, product, body.extraReferences || []);
    if (!references.length) return Response.json({ error: 'Produkt nemá žádnou referenční fotografii. Generování je zablokované.' }, { status: 409 });

    const aspect = ASPECTS.includes(body.aspectRatio) ? body.aspectRatio : '16:9';
    const seconds = Math.max(4, Math.min(12, Math.round(Number(body.seconds) || 6)));
    const quantity = Math.max(1, Math.min(20, Math.round(Number(body.quantity) || 1)));
    const prompt = buildPrompt(product, {
      quantity,
      environmentPrompt: String(body.environmentPrompt || 'čisté architektonické prostředí'),
      scene: body.scene,
      heightMm: Number(body.heightMm) || 0,
      diameterMm: Number(body.diameterMm) || 0,
    });
    const request = {
      model: MODEL,
      prompt,
      seconds,
      aspect_ratio: aspect,
      resolution: '720p',
      generate_audio: false,
      input_references: references.map((url) => ({ type: 'image_url', image_url: { url } })),
    };

    if (body.action === 'prepare') {
      let credits = null;
      try { credits = (await videos.create({ ...request, dry_run: true } as any))?.usage?.base44_credits ?? null; } catch (_) { /* odhad není povinný */ }
      return Response.json({ ok: true, references, diskCount, prompt, credits, masterVerified: Boolean(product.visual_master_verified) });
    }

    const job = await videos.create(request as any, { maxRetries: 0 });
    return Response.json({ ...job, references, prompt, masterVerified: Boolean(product.visual_master_verified) }, { status: 202 });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}