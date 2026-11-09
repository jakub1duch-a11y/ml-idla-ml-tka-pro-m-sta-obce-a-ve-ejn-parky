import { assertBusinessAccount, CURRENT_PUBLIC_CATALOG, getVerifiedGoogleAccount, resolvePublicCatalogPrice } from './businessWorkflowGuard.mjs';
import { createBrandOfferPacket } from './brandOfferPacket.mjs';

// Server-side only: never call this helper from public UI.
// Reads precisely the public columns A:H; no partner/margin/internal columns.
export async function loadVerifiedBrandOfferPacket(base44, { productId, variant }, fetcher = fetch) {
  if (!productId || !String(variant || '').trim()) throw new Error('Chybí produkt nebo jednoznačná varianta.');
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('googlesheets');
  const account = await getVerifiedGoogleAccount(accessToken, 'googlesheets', fetcher);
  assertBusinessAccount(account, 'googlesheets');

  const product = await base44.asServiceRole.entities.Product.get(productId);
  if (!product) throw new Error('Produkt neexistuje.');

  const range = encodeURIComponent(CURRENT_PUBLIC_CATALOG.range);
  const response = await fetcher(
    `https://sheets.googleapis.com/v4/spreadsheets/${CURRENT_PUBLIC_CATALOG.id}/values/${range}?majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(10000),
    }
  );
  if (!response.ok) throw new Error(`Google Sheets API HTTP ${response.status}.`);
  const body = await response.json();
  if (!Array.isArray(body?.values)) throw new Error('Neplatná odpověď aktuálního katalogu.');

  const price = resolvePublicCatalogPrice(body.values, variant);
  return createBrandOfferPacket({ product, variant, price });
}