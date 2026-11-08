// MLŽIDLA.cz: small, side-effect-free account and catalog guards.
// NEVER return or log OAuth tokens, partner prices, margins or internal costs.
export const BUSINESS_EMAIL = 'meduna@holmtec.cz';
export const CURRENT_PUBLIC_CATALOG = Object.freeze({
  id: '1kyxH-ihr6YC5xnu8Ef5X4jbR81VVaJtDO1UVWK5d_S8',
  sheet: '💧 Katalog produktů 2026',
  range: "'💧 Katalog produktů 2026'!A3:H80",
  product_column: 'A',
  public_price_column: 'H',
  currency: 'CZK',
  vat_percent: 21,
});
export const PRODUCT_CATALOG_FOLDER_ID = '1KJqen97HpD9yAmo7yMBpaFZI8iqk0mdE';

const LABELS = { googledrive:'Google Drive', gmail:'Gmail', googlesheets:'Google Sheets' };
const cleanEmail = value => String(value || '').trim().toLowerCase();

export function assertBusinessAccount(email, type) {
  const normalized = cleanEmail(email);
  const label = LABELS[type] || type;
  if (!normalized) throw new Error(`Není ověřena identita ${label}.`);
  if (normalized !== BUSINESS_EMAIL) throw new Error(`Nesprávný účet ${label}: ${normalized}. Je vyžadován ${BUSINESS_EMAIL}.`);
  return normalized;
}

export async function getVerifiedGoogleAccount(accessToken, type, fetcher = fetch) {
  if (!accessToken) throw new Error(`Chybí autorizace ${LABELS[type] || type}.`);
  const endpoints = {
    googledrive: 'https://www.googleapis.com/drive/v3/about?fields=user(emailAddress)',
    gmail: 'https://gmail.googleapis.com/gmail/v1/users/me/profile',
    googlesheets: 'https://www.googleapis.com/oauth2/v3/userinfo',
  };
  if (!endpoints[type]) throw new Error('Nepodporovaný typ konektoru.');
  const response = await fetcher(endpoints[type], {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`${LABELS[type]} OAuth API: HTTP ${response.status}.`);
  const data = await response.json();
  const email = type === 'googledrive' ? data?.user?.emailAddress
    : type === 'gmail' ? data?.emailAddress : data?.email;
  if (!email) throw new Error(`Není ověřena identita ${LABELS[type]}.`);
  return cleanEmail(email);
}

export async function getBusinessConnectorStatus(base44, type, fetcher = fetch) {
  try {
    const connection = await base44.asServiceRole.connectors.getConnection(type);
    const account = await getVerifiedGoogleAccount(connection?.accessToken, type, fetcher);
    assertBusinessAccount(account, type);
    return { type, ready:true, account, error:null };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // Suppress any accidental token or API body: only known, short error messages.
    const safeMessage = /Nesprávný účet|Není ověřena identita|Chybí autorizace|OAuth API: HTTP/.test(message)
      ? message.slice(0, 280)
      : `Konektor ${LABELS[type] || type} nelze bezpečně ověřit.`;
    const match = safeMessage.match(/Nesprávný účet .*?: (.*?). Je vyžadován /);
    return { type, ready:false, account:match?.[1] || null, error:safeMessage };
  }
}

const normalizeVariant = value => String(value || '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();

const parsePublicAmount = value => {
  if (typeof value === 'number') return Number.isFinite(value) && value > 0 ? value : null;
  const raw=String(value || '').replace(/\u00a0/g,' ').replace(/Kč/gi,'')
    .replace(/\s/g,'').replace(/[^\d,.-]/g,'').replace(',','.');
  const amount=Number(raw);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
};

export function resolvePublicCatalogPrice(rows, requestedVariant) {
  const key=normalizeVariant(requestedVariant);
  const safeUnmatched = (reason) => ({
    variant: String(requestedVariant || '').trim(),
    price_ex_vat: null,
    needs_review: true,
    reason,
    source: CURRENT_PUBLIC_CATALOG.id,
  });
  if (!key) return safeUnmatched('Není uvedena jednoznačná varianta produktu.');
  const matches=(Array.isArray(rows) ? rows : []).filter(r =>
    Array.isArray(r) && normalizeVariant(r[0]) === key
  );
  if (matches.length !== 1) return safeUnmatched(matches.length === 0
    ? 'Varianta není v aktuálním veřejném katalogu.'
    : 'Varianta není v katalogu jednoznačná.');
  const price = parsePublicAmount(matches[0][7]); // only column H, never I–K.
  if (price === null) return safeUnmatched('Cena varianty je pouze na poptávku.');
  return {
    variant: String(matches[0][0]).trim(),
    price_ex_vat: price,
    needs_review: false,
    reason: null,
    source: CURRENT_PUBLIC_CATALOG.id,
  };
}
