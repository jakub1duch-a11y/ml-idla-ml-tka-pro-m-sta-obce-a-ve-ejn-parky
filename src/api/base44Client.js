import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';
import { normalizeProductResult } from '@/lib/optimizedMedia';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

const rawBase44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl
});

// Product records are stored with their original source media in Base44.
// The website transparently resolves those URLs to optimized WebP/WebM files
// generated in public/media/optimized. Transparent product cut-outs remain original.
const productEntity = rawBase44.entities.Product;
const HIDDEN_STANDALONE_PRODUCT_SLUGS = new Set([
  'archived-bendy-radius-s-duplicate',
  'archived-bendy-radius-m-duplicate',
  'archived-bendy-radius-l-duplicate',
  'archived-bendy-field-duplicate',
]);

// Varianty jsou součástí detailu hlavního produktu, ne veřejných výpisů produktů.
// Přímý detail varianty ale musí zůstat dostupný (např. /produkt/bendy-radius-s).
const isVariantProduct = (item) => {
  const slug = String(item?.slug || '').toLowerCase();
  const name = String(item?.name || '').toLowerCase();
  return HIDDEN_STANDALONE_PRODUCT_SLUGS.has(slug) ||
    /(?:^|-)radius-(?:s|m|l)(?:-|$)/.test(slug) ||
    /\bradius\s*[sml]\b/.test(name);
};

const hideVariantsFromPublicLists = (result) => {
  if (Array.isArray(result)) return result.filter((item) => !isVariantProduct(item));
  return result;
};

const optimizedProductEntity = new Proxy(productEntity, {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver);
    if (typeof value !== 'function' || !['list', 'filter', 'get', 'getById'].includes(String(prop))) return value;
    return async (...args) => {
      const normalized = normalizeProductResult(await value.apply(target, args));
      if (String(prop) === 'list') return hideVariantsFromPublicLists(normalized);
      if (String(prop) === 'filter') {
        const query = args?.[0] || {};
        const exactSlugLookup = typeof query?.slug === 'string' && query.slug.length > 0;
        return exactSlugLookup ? normalized : hideVariantsFromPublicLists(normalized);
      }
      return normalized;
    };
  },
});

const optimizedEntities = new Proxy(rawBase44.entities, {
  get(target, prop, receiver) {
    if (prop === 'Product') return optimizedProductEntity;
    return Reflect.get(target, prop, receiver);
  },
});

export const base44 = new Proxy(rawBase44, {
  get(target, prop, receiver) {
    if (prop === 'entities') return optimizedEntities;
    return Reflect.get(target, prop, receiver);
  },
});
