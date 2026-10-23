// Studio assets are only shown when they are explicitly verified against the
// manufactured product. The previous local placeholders were not present in the
// public build and produced empty product cards.
export const STUDIO_MEDIA_BY_SLUG = Object.freeze({
  'mlzitko-steblo': '/media/studio/steblo-studio.webp',
  teepee: '/media/studio/teepee-studio.webp',
  'mlzitko-bendy': '/media/studio/bendy-studio.webp',
  'mlzitko-bendy-field': '/media/studio/bendy-field-studio.webp',
  'bendy-radius-s': '/media/studio/bendy-radius-s-studio.webp',
  'bendy-radius-m': '/media/studio/bendy-radius-m-studio.webp',
  'bendy-radius-l': '/media/studio/bendy-radius-l-studio.webp',
  'aura-mlzitko': '/media/studio/aura-garden-studio.webp',
  'mlzna-brana-gate': '/media/studio/gate-studio.webp',
  'linea-avenue': '/media/studio/linea-avenue-studio.webp',
  'linea-CE-gate': '/media/studio/linea-ce-studio.webp',
  'mlzitko-mrak': '/media/studio/mrak-studio.webp',
  'mlzitko-mrkev': '/media/studio/mrkev-studio.webp',
  'mlzna-spirála': '/media/studio/spirala-studio.webp',
  'y-armist-tr60': '/media/studio/y-armist-tr60-studio.webp',
  'y-armist-j70': '/media/studio/y-armist-j70-studio.webp',
});

const isPublicProductAsset = (url) => (
  typeof url === 'string'
  && url.length > 0
  && !url.startsWith('/media/products/')
);

export function getStudioMedia(product) {
  if (!product?.slug) return null;

  const mappedAsset = STUDIO_MEDIA_BY_SLUG[product.slug];
  if (isPublicProductAsset(mappedAsset)) return mappedAsset;

  const verifiedHero = product?.hero_visual_verified ? product?.hero_product_image_url : null;
  return isPublicProductAsset(verifiedHero) ? verifiedHero : null;
}