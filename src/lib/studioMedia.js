export const STUDIO_MEDIA_BY_SLUG = {
  'mlzitko-bendy': '/media/studio/bendy-studio.webp',
  'bendy-radius-s': '/media/studio/bendy-radius-s-studio.webp',
  'bendy-radius-m': '/media/studio/bendy-radius-m-studio.webp',
  'bendy-radius-l': '/media/studio/bendy-radius-l-studio.webp',
  'bendy-field': '/media/studio/bendy-field-studio.webp',
  'aura-mlzitko': '/media/studio/aura-garden-studio.webp',
  'linea-solo': '/media/studio/linea-ce-studio.webp',
  'linea-gate': '/media/studio/linea-gate-studio.webp',
  'linea-avenue': '/media/studio/linea-avenue-studio.webp',
  'y-armist-tr60': '/media/studio/y-armist-tr60-studio.webp',
  'y-armist-j70': '/media/studio/y-armist-j70-studio.webp',
  'mlzitko-steblo': '/media/studio/steblo-studio.webp',
  'mlzna-brana-gate': '/media/studio/gate-studio.webp',
  'mlzitko-mrak': '/media/studio/mrak-studio.webp',
  'mlzna-spirála': '/media/studio/spirala-studio.webp',
  'mlzitko-mrkev': '/media/studio/mrkev-studio.webp',
  'teepee': '/media/studio/teepee-studio.webp',
};

export function getStudioMedia(product) {
  if (!product?.slug) return null;
  return STUDIO_MEDIA_BY_SLUG[product.slug] || null;
}
