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
const HIDDEN_STANDALONE_PRODUCT_SLUGS = new Set();
const hideStandaloneVariants = (result) => {
  if (Array.isArray(result)) return result.filter((item) => !HIDDEN_STANDALONE_PRODUCT_SLUGS.has(item?.slug));
  if (result && HIDDEN_STANDALONE_PRODUCT_SLUGS.has(result.slug)) return null;
  return result;
};
const optimizedProductEntity = new Proxy(productEntity, {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver);
    if (typeof value !== 'function' || !['list', 'filter', 'get', 'getById'].includes(String(prop))) return value;
    return async (...args) => hideStandaloneVariants(normalizeProductResult(await value.apply(target, args)));
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
