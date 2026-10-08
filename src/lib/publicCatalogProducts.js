import { isArchived } from '@/lib/newMedia';
import { mergePortalGateProducts } from '@/lib/portalGateProducts';
import { sortByStructure } from '@/lib/productFamilies';

const HIDDEN_NAMES = new Set(['smart rizeni mlzitek', 'filtracni a jine moduly', 'trysky m2', 'senzory', 'bendy gate', 'steblo gate', 'portal linea ce', 'bendy field']);
const HIDDEN_SLUGS = new Set(['garden-cooling-set', 'bendy-gate', 'brana-bendy', 'steblo-gate', 'steblo-gate-70', 'mlzitko-2-stebla', 'portal-linea-ce', 'linea-ce-portal']);
const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

export function isPublicCatalogProduct(product) {
  return Boolean(product?.slug) && !isArchived(product.slug) &&
    !HIDDEN_SLUGS.has(normalize(product.slug)) && !HIDDEN_NAMES.has(normalize(product.name));
}

export function preparePublicCatalogProducts(records = []) {
  const visible = records.filter(isPublicCatalogProduct);
  return sortByStructure((mergePortalGateProducts(visible) || []).filter(isPublicCatalogProduct));
}
