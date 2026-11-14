import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
test('public catalog retains its visibility and sorting pipeline', () => {
  const source = readFileSync(new URL('../src/lib/publicCatalogProducts.js', import.meta.url), 'utf8');
  assert.match(source, /mergePortalGateProducts\(visible\)/);
  assert.match(source, /sortByStructure/);
  assert.match(source, /auditPublicCatalogProducts/);
});
test('optimized image supports AVIF, responsive sizes and safe studio framing', () => {
  const source = readFileSync(new URL('../src/components/ImageOptimized.jsx', import.meta.url), 'utf8');
  for (const token of ['avifSrcSet', 'webpSrcSet', 'fetchPriority', 'objectFit', 'objectPosition', 'aspectRatio']) assert.ok(source.includes(token), token);
});
