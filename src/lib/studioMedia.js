// Studio assets are only shown when they are explicitly verified against the
// manufactured product. The previous local placeholders were not present in the
// public build and produced empty product cards.
export const STUDIO_MEDIA_BY_SLUG = Object.freeze({});

const isPublicProductAsset = (url) => (
  typeof url === 'string'
  && url.length > 0
  && !url.startsWith('/media/studio/')
  && !url.startsWith('/media/products/')
  && !url.startsWith('/media/optimized/')
);

export function getStudioMedia(product) {
  if (!product?.slug) return null;

  const mappedAsset = STUDIO_MEDIA_BY_SLUG[product.slug];
  if (isPublicProductAsset(mappedAsset)) return mappedAsset;

  const verifiedHero = product?.hero_visual_verified ? product?.hero_product_image_url : null;
  return isPublicProductAsset(verifiedHero) ? verifiedHero : null;
}
