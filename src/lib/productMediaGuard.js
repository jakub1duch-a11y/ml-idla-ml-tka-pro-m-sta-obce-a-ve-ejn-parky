const PRODUCT_MEDIA_TAGS = Object.freeze({
  'mlzitko-bendy': ['bendy'],
  'bendy-radius-s': ['bendy', 'radius', 's'],
  'bendy-radius-m': ['bendy', 'radius', 'm'],
  'bendy-radius-l': ['bendy', 'radius', 'l'],
  'mlzitko-bendy-field': ['bendy', 'field'],
  'archived-bendy-field-duplicate': ['bendy', 'field', 'archived'],
  'archived-bendy-radius-s-duplicate': ['bendy', 'radius', 's', 'archived'],
  'archived-bendy-radius-m-duplicate': ['bendy', 'radius', 'm', 'archived'],
  'archived-bendy-radius-l-duplicate': ['bendy', 'radius', 'l', 'archived'],
  'bendy-back-to-back': ['bendy', 'steblo', 'back', 'to'],
  'bendy-alej': ['bendy', 'steblo', 'alej'],
  'brana-bendy': ['bendy', 'steblo', 'gate', 'brana'],
  'mlzitko-steblo': ['steblo'],
  'mlzitko-2-stebla': ['steblo', '2'],
  'linea-mlzitko': ['linea'],
  'linea-avenue': ['linea', 'avenue'],
  'linea-CE-gate': ['linea', 'gate'],
  'mlzitko-mrak': ['mrak'],
  'mlzitko-mrkev': ['mrkev'],
  'mlzitko-kapr': ['kapr'],
  'mlzitko-volavka': ['volavka'],
  'mlzitko-kvet-4': ['kvet'],
  'mlzitko-kruh': ['kruh'],
  'mlzitko-lizatko': ['lizatko'],
  'mlzna-spirala': ['spirala'],
  'ostrev-city': ['ostrev'],
  'aura-mlzitko': ['aura'],
  'teepee': ['teepee'],
  'mlzna-brana-gate': ['gate', 'brana'],
  'mlzici-tryska': ['tryska'],
  'y-armist-tr60': ['armist', 'tr60'],
  'y-armist-j70': ['armist', 'j70'],
  'mlzitko-pav': ['pav'],
});

const MEDIA_IDENTITY_TOKENS = [
  'bendy', 'radius', 'field', 'alej', 'avenue', 'steblo', 'back', 'gate', 'brana',
  'linea', 'mrak', 'mrkev', 'kapr', 'volavka', 'kvet', 'kruh', 'lizatko',
  'spirala', 'ostrev', 'aura', 'teepee', 'armist', 'tr60', 'j70', 'tryska', 'pav',
];

function normalizedAssetText(...values) {
  return values.filter(Boolean).join(' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, ' ');
}

/** Reject files whose filename/title explicitly identifies a different product. */
export function isProductMediaAllowed(product, ...mediaIdentity) {
  const slug = String(product?.slug || '').toLowerCase();
  const text = normalizedAssetText(...mediaIdentity);
  const targetTags = PRODUCT_MEDIA_TAGS[slug] || MEDIA_IDENTITY_TOKENS.filter((token) =>
    new RegExp('\\b' + token + '\\b').test(normalizedAssetText(product?.name, slug))
  );
  const found = MEDIA_IDENTITY_TOKENS.filter((token) => new RegExp('\\b' + token + '\\b').test(text));
  if (!found.length) return true;
  return found.every((token) => targetTags.includes(token));
}

export function filterProductMedia(product, items, getIdentity = (item) => [item?.url, item?.file_name, item?.title]) {
  return (Array.isArray(items) ? items : []).filter((item) => isProductMediaAllowed(product, ...getIdentity(item)));
}
