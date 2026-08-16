export const SUPPORTED_LOCALES = ['cs', 'en', 'de', 'pl', 'sk', 'it'];

export const LOCALE_CONFIG = {
  cs: { code: 'cs', label: 'CZ', nativeName: 'Čeština', htmlLang: 'cs', hreflang: 'cs-CZ', ogLocale: 'cs_CZ' },
  en: { code: 'en', label: 'EN', nativeName: 'English', htmlLang: 'en', hreflang: 'en', ogLocale: 'en_GB' },
  de: { code: 'de', label: 'DE', nativeName: 'Deutsch', htmlLang: 'de', hreflang: 'de-DE', ogLocale: 'de_DE' },
  pl: { code: 'pl', label: 'PL', nativeName: 'Polski', htmlLang: 'pl', hreflang: 'pl-PL', ogLocale: 'pl_PL' },
  sk: { code: 'sk', label: 'SK', nativeName: 'Slovenčina', htmlLang: 'sk', hreflang: 'sk-SK', ogLocale: 'sk_SK' },
  it: { code: 'it', label: 'IT', nativeName: 'Italiano', htmlLang: 'it', hreflang: 'it-IT', ogLocale: 'it_IT' },
};

export const ROUTE_MAP = {
  home: { cs: '/', en: '/en', de: '/de', pl: '/pl', sk: '/sk', it: '/it' },
  catalog: { cs: '/mlzidla-mlzitka', en: '/en/misting-systems', de: '/de/nebelanlagen', pl: '/pl/systemy-mglowe', sk: '/sk/hmlove-systemy', it: '/it/sistemi-nebulizzazione' },
  city: { cs: '/mestske-mlzitka', en: '/en/urban-misting', de: '/de/stadtnebel', pl: '/pl/systemy-mglowe-dla-miast', sk: '/sk/hmlove-systemy-pre-mesta', it: '/it/nebulizzazione-urbana' },
  garden: { cs: '/zahradni-mlzitka', en: '/en/garden-misting', de: '/de/gartennebel', pl: '/pl/mgla-wodna-do-ogrodu', sk: '/sk/hmlove-systemy-do-zahrady', it: '/it/nebulizzazione-giardino' },
  custom: { cs: '/zakazkova-mlzitka', en: '/en/custom-misting', de: '/de/sonderanfertigung', pl: '/pl/systemy-mglowe-na-zamowienie', sk: '/sk/hmlove-systemy-na-mieru', it: '/it/nebulizzazione-su-misura' },
  technology: { cs: '/jak-to-funguje', en: '/en/how-it-works', de: '/de/funktionsweise', pl: '/pl/jak-dziala-mgla-wodna', sk: '/sk/ako-funguje-vodna-hmla', it: '/it/come-funziona' },
  smart: { cs: '/smart-ovladani', en: '/en/smart-control', de: '/de/smart-steuerung', pl: '/pl/inteligentne-sterowanie', sk: '/sk/smart-riadenie', it: '/it/controllo-smart' },
  references: { cs: '/reference', en: '/en/projects', de: '/de/referenzen', pl: '/pl/realizacje', sk: '/sk/realizacie', it: '/it/progetti' },
  contact: { cs: '/kontakt', en: '/en/contact', de: '/de/kontakt', pl: '/pl/kontakt', sk: '/sk/kontakt', it: '/it/contatti' },
  inquiry: { cs: '/poptavka', en: '/en/quote', de: '/de/anfrage', pl: '/pl/wycena', sk: '/sk/cenova-ponuka', it: '/it/preventivo' },
  about: { cs: '/o-nas', en: '/en/about', de: '/de/ueber-uns', pl: '/pl/o-nas', sk: '/sk/o-nas', it: '/it/chi-siamo' },
  faq: { cs: '/podpora', en: '/en/faq', de: '/de/faq', pl: '/pl/faq', sk: '/sk/faq', it: '/it/faq' },
};

const PATH_TO_ROUTE = Object.entries(ROUTE_MAP).flatMap(([key, localized]) =>
  Object.entries(localized).map(([locale, path]) => [path.replace(/\/$/, '') || '/', { key, locale }])
);

export function getLocaleFromPath(pathname = '/') {
  const segment = pathname.split('/').filter(Boolean)[0];
  return SUPPORTED_LOCALES.includes(segment) && segment !== 'cs' ? segment : 'cs';
}

export function getRouteKeyFromPath(pathname = '/') {
  const normalized = pathname.replace(/\/$/, '') || '/';
  const match = PATH_TO_ROUTE.find(([path]) => path === normalized);
  return match?.[1]?.key || null;
}

export function localizedPath(routeKeyOrPath, locale) {
  if (!SUPPORTED_LOCALES.includes(locale)) return '/';
  if (ROUTE_MAP[routeKeyOrPath]) return ROUTE_MAP[routeKeyOrPath][locale];
  const key = getRouteKeyFromPath(routeKeyOrPath);
  if (key) return ROUTE_MAP[key][locale];
  return ROUTE_MAP.home[locale];
}

export function getLanguageAlternates(routeKey) {
  const routes = ROUTE_MAP[routeKey] || ROUTE_MAP.home;
  return [
    ...SUPPORTED_LOCALES.map((locale) => ({ hreflang: LOCALE_CONFIG[locale].hreflang, path: routes[locale] })),
    { hreflang: 'x-default', path: routes.cs },
  ];
}

export function getSwitchTargets(pathname = '/') {
  const routeKey = getRouteKeyFromPath(pathname) || 'home';
  return SUPPORTED_LOCALES.map((locale) => ({
    ...LOCALE_CONFIG[locale],
    path: ROUTE_MAP[routeKey][locale],
  }));
}
