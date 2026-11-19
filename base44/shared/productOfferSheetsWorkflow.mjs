import { assertBusinessAccount, getVerifiedGoogleAccount } from './businessWorkflowGuard.mjs';
import { OFFER_CATALOG_ID, OFFER_PRICE_RANGES, mergeCustomerCatalogRanges, buildProductOfferSheets } from './productOfferSheets.mjs';

// Server-side only. Google Sheets account and prices are verified on every request.
// Two disjoint ranges deliberately skip column I (partner pricing).
export async function loadProductOfferSheets(base44, requestedNames, { vatRate = null } = {}, fetcher = fetch) {
  const connection = await base44.asServiceRole.connectors.getConnection('googlesheets');
  const token = connection?.accessToken;
  const email = await getVerifiedGoogleAccount(token, 'googlesheets', fetcher);
  assertBusinessAccount(email, 'googlesheets');
  const values = [];
  for (const range of OFFER_PRICE_RANGES) {
    const response = await fetcher(
      'https://sheets.googleapis.com/v4/spreadsheets/' + OFFER_CATALOG_ID + '/values/' + encodeURIComponent(range) + '?majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE',
      { headers: { Authorization: 'Bearer ' + token }, signal: AbortSignal.timeout(10000) }
    );
    if (!response.ok) throw new Error('Google Sheets API HTTP ' + response.status + '.');
    const data = await response.json();
    if (!Array.isArray(data?.values)) throw new Error('Chybí aktuální cenová data.');
    values.push(data.values);
  }
  return buildProductOfferSheets(mergeCustomerCatalogRanges(values[0], values[1]), requestedNames, { vatRate });
}
