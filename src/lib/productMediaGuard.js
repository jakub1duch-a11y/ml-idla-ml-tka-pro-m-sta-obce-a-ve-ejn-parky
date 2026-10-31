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
  'mlzny-mrak-1414': ['mrak'],
  'mlzny-mrak-1480': ['mrak'],
  'mlzny-mrak-2424': ['mrak'],
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

const SHARED_MEDIA_ALLOWLIST = Object.freeze({
  // Ambiguous photos shared by KAPR and VOLAVKA are hidden until the library assigns them to one product.
  'a631f5bed_7f20e80e-d704-47c4-acf7-f7566087a0ea.jpg': [],
  'ae23c1a50_329b2a1b-647c-405b-9f8b-3cac3dddbada.jpg': [],
  '1ba9cfa93_4cb1155f-000e-4eec-98ee-90cb6d38ba0d.jpg': [],
  'd790e0f10_img_4406.jpg': [],
  // General BENDY photos are kept on the main BENDY card, not copied to size variants.
  'ae3874c7c_img_5068.jpg': ['mlzitko-bendy'],
  '0b1d07bb3_img_5072.jpg': ['mlzitko-bendy'],
  '496887eb9_img_5040.jpg': ['mlzitko-bendy'],
  'cca8ea12b_img_5039.jpg': ['mlzitko-bendy'],
  'afafa26f3_img_5035.jpg': ['mlzitko-bendy'],
  '7e9aacce7_img_5036.jpg': ['mlzitko-bendy'],
  '48547c2fe_img_4983.jpg': ['mlzitko-bendy'],
  'f3cbea450_img_4989.jpg': ['mlzitko-bendy'],
  'bendy-field-preview.webp': ['mlzitko-bendy-field'],
  '18399510e_generated_image.png': ['mlzitko-bendy'],
  '6af16b6a9_linea---rezidencni-mlzeni.jpg': ['linea-mlzitko'],
  // This is one documented BENDY + LINEA installation, so it belongs to both cards.
  'e7593e68f_realizace-img_5072.jpg': ['mlzitko-bendy', 'linea-mlzitko'],
  // J70-specific images must not appear on the TR60 variant page.
  '93cd8ff63_mlzitkoy-armistj70_2.png': ['y-armist-j70'],
  '625f54e91_mlzitkoy-armistj70_1.png': ['y-armist-j70'],
  '95f7c7ca5_mlzitkoy-armistj70.png': ['y-armist-j70'],
  '498919d09_mlzitko-y-armist-j70_ig.jpg': ['y-armist-j70'],
  '0ab65d73d_mlzitko-y-armist-j70_2.jpg': ['y-armist-j70'],
  'a799ded12_mlzitko-y-armist-j70_1.jpg': ['y-armist-j70'],
  '82390fca7_y-armist.jpg': ['y-armist-tr60'],
  '22fc78d8f_mlzitko-y-armist-tr60_j70.jpg': ['y-armist-tr60', 'y-armist-j70'],
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
  const url = mediaIdentity.find((value) => typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'))) || '';
  const rawName = String(url).split('/').pop().split('?')[0].split('#')[0];
  let fileName = rawName;
  try { fileName = decodeURIComponent(rawName); } catch {}
  const sharedKey = normalizedAssetText(fileName).replace(/ /g, '-');
  const allowlistEntry = Object.entries(SHARED_MEDIA_ALLOWLIST).find(([name]) => normalizedAssetText(name).replace(/ /g, '-') === sharedKey);
  if (allowlistEntry) return allowlistEntry[1].includes(slug);
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