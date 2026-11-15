import { isArchived } from '@/lib/newMedia';
import { mergePortalGateProducts } from '@/lib/portalGateProducts';
import { sortByStructure } from '@/lib/productFamilies';

const HIDDEN_NAMES = new Set(['smart rizeni mlzitek', 'filtracni a jine moduly', 'trysky m2', 'senzory', 'bendy gate', 'portal linea ce', 'bendy field']);
const HIDDEN_SLUGS = new Set(['garden-cooling-set', 'bendy-gate', 'portal-linea-ce', 'linea-ce-portal', 'steblo-gate', 'linea-gate']);
const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

export function isPublicCatalogProduct(product) {
  return Boolean(product?.slug) && product.active !== false && !isArchived(product.slug) &&
    !HIDDEN_SLUGS.has(normalize(product.slug)) && !HIDDEN_NAMES.has(normalize(product.name));
}

export function preparePublicCatalogProducts(records = []) {
  const visible = records.filter(isPublicCatalogProduct);
  return sortByStructure((mergePortalGateProducts(visible) || []).filter(isPublicCatalogProduct));
}
// Non-destructive editorial diagnostics. Keep product visibility and ordering
// independent from missing photos or optional metadata.
export function auditPublicCatalogProducts(records = []) {
  const issues = [];
  const seen = new Set();
  for (const product of Array.isArray(records) ? records : []) {
    if (!isPublicCatalogProduct(product)) continue;
    const slug = normalize(product.slug);
    if (seen.has(slug)) issues.push({ slug: product.slug, code: 'duplicate_slug' });
    seen.add(slug);
    if (!String(product.name || '').trim()) issues.push({ slug: product.slug, code: 'missing_name' });
  }
  return issues;
}
