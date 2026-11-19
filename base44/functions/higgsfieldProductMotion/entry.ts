import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { config, higgsfield } from 'npm:@higgsfield/client/v2';

const MODEL_ID = 'bytedance/seedance-2.0/reference-to-video';
const DEFAULT_DURATION = 5;
const DEFAULT_RESOLUTION = '720p';
const MAX_CUSTOM_PROMPT_LENGTH = 2500;
const HTTPS_URL = /^https:\/\/[^\s]+$/i;

function getCredentials() {
  const combined = Deno.env.get('HF_CREDENTIALS')?.trim();
  if (combined) return combined;

  const keyId = Deno.env.get('HF_API_KEY_ID')?.trim();
  const keySecret = Deno.env.get('HF_API_KEY_SECRET')?.trim();
  if (keyId && keySecret) return `${keyId}:${keySecret}`;
  return '';
}

function clampDuration(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_DURATION;
  return Math.max(4, Math.min(15, Math.round(parsed)));
}

function safeResolution(value) {
  return ['480p', '720p', '1080p', '4k'].includes(value) ? value : DEFAULT_RESOLUTION;
}

function safeAspectRatio(value) {
  return ['16:9', '4:3', '1:1', '3:4', '9:16', '21:9'].includes(value) ? value : '16:9';
}

function buildPrompt(product, customPrompt = '') {
  const geometryLock = String(product.visual_geometry_lock || '').trim();
  const negativeRules = Array.isArray(product.visual_negative_rules)
    ? product.visual_negative_rules.filter(Boolean).join('; ')
    : '';

  return [
    `MLZIDLA.CZ product motion for ${product.name}.`,
    'Preserve the supplied product exactly: same silhouette, tube path, proportions, bends, nozzle count and nozzle positions, base and visible construction.',
    'Do not redesign, extend, shorten, thicken, thin, duplicate or morph the product.',
    geometryLock ? `Geometry lock: ${geometryLock}` : '',
    negativeRules ? `Forbidden changes: ${negativeRules}` : '',
    'Animate environment only: slow premium camera movement, subtle stainless-steel light travel, natural fine mist drifting from the real nozzle positions, restrained atmospheric depth.',
    'Apple / Dyson / Nothing inspired presentation, realistic stainless steel, soft aqua mist, cinematic daylight, no text inside the generated video, no logos added by the model.',
    String(customPrompt || '').trim().slice(0, MAX_CUSTOM_PROMPT_LENGTH),
  ].filter(Boolean).join(' ');
}

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed.' }, { status: 405, headers: { Allow: 'POST' } });
    }

    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(() => null);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const credentials = getCredentials();
    if (!credentials) {
      return Response.json({
        error: 'Higgsfield API is not configured.',
        configured: false,
        required_env: ['HF_CREDENTIALS or HF_API_KEY_ID + HF_API_KEY_SECRET'],
      }, { status: 503 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return Response.json({ error: 'Invalid JSON body.' }, { status: 400 });
    }
    const productSlug = String(body.productSlug || '').trim().slice(0, 160);
    if (!productSlug) {
      return Response.json({ error: 'productSlug is required.' }, { status: 400 });
    }

    const products = await base44.asServiceRole.entities.Product.filter({ slug: productSlug });
    // Base44 SDK versions can return either an array or a paginated { items } wrapper.
    const product = (Array.isArray(products) ? products : products?.items || [])?.[0] || null;
    if (!product) {
      return Response.json({ error: 'Product not found.' }, { status: 404 });
    }

    if (!product.visual_master_verified || !product.visual_master_reference_url) {
      return Response.json({
        error: 'Product motion requires a human-verified MASTER reference.',
        product: { id: product.id, slug: product.slug, name: product.name },
      }, { status: 409 });
    }

    const masterUrl = String(product.visual_master_reference_url || '').trim();
    if (!HTTPS_URL.test(masterUrl)) {
      return Response.json({ error: 'MASTER reference must be an absolute HTTPS URL.' }, { status: 422 });
    }

    const duration = clampDuration(body.duration);
    const resolution = safeResolution(String(body.resolution || DEFAULT_RESOLUTION));
    const aspectRatio = safeAspectRatio(String(body.aspectRatio || '16:9'));
    const prompt = buildPrompt(product, body.prompt);

    config({ credentials });

    const result = await higgsfield.subscribe(
      MODEL_ID,
      {
        input: {
          prompt,
          image_urls: [masterUrl],
          duration,
          resolution,
          aspect_ratio: aspectRatio,
          generate_audio: false,
        },
        withPolling: true,
      },
    );

    const videoUrl = result?.video?.url || result?.data?.video?.url || result?.output?.video?.url || result?.output?.video_url || result?.video_url || result?.url || (Array.isArray(result?.videos) ? result.videos[0]?.url : null) || null;
    if (!videoUrl || !HTTPS_URL.test(videoUrl)) {
      console.error('Higgsfield returned no valid video URL.');
      return Response.json({ error: 'Higgsfield did not return a usable video URL.' }, { status: 502 });
    }

    return Response.json({
      success: true,
      url: videoUrl,
      provider: 'higgsfield',
      model: MODEL_ID,
      product: {
        id: product.id,
        slug: product.slug,
        name: product.name,
        master_reference: masterUrl,
      },
      settings: {
        duration,
        resolution,
        aspect_ratio: aspectRatio,
        generate_audio: false,
      },
      result,
      review_required: true,
      review_note: 'Generated media must be checked against the MASTER reference before publication.',
    });
  } catch (error) {
    const providerStatus = Number(error?.status || error?.response?.status || 0);
    console.error('higgsfieldProductMotion failed', { status: providerStatus || 500, name: error?.name });
    const status = [400, 401, 402, 403, 408, 413, 422, 429, 503].includes(providerStatus) ? providerStatus : 502;
    const errorMessage = status === 402 ? 'Higgsfield API account has insufficient credits.'
      : status === 429 ? 'Higgsfield generation rate limit reached.'
      : status === 401 || status === 403 ? 'Higgsfield API credentials were rejected.'
      : 'Higgsfield generation failed. Check backend logs.';
    return Response.json({ error: errorMessage, provider_status: providerStatus || null }, { status });
  }
});
