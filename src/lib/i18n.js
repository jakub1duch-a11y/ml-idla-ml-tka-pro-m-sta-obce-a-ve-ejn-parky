export const SUPPORTED_LOCALES = ['cs', 'en', 'de'];

export const LOCALE_CONFIG = {
  cs: { code: 'cs', label: 'CZ', nativeName: 'Čeština', htmlLang: 'cs', hreflang: 'cs-CZ', ogLocale: 'cs_CZ' },
  en: { code: 'en', label: 'EN', nativeName: 'English', htmlLang: 'en', hreflang: 'en', ogLocale: 'en_GB' },
  de: { code: 'de', label: 'DE', nativeName: 'Deutsch', htmlLang: 'de', hreflang: 'de-DE', ogLocale: 'de_DE' },
};

export const ROUTE_MAP = {
  home: { cs: '/', en: '/en', de: '/de' },
  catalog: { cs: '/mlzidla-mlzitka', en: '/en/misting-systems', de: '/de/nebelanlagen' },
  city: { cs: '/mestske-mlzitka', en: '/en/urban-misting', de: '/de/stadtnebel' },
  garden: { cs: '/zahradni-mlzitka', en: '/en/garden-misting', de: '/de/gartennebel' },
  custom: { cs: '/zakazkova-mlzitka', en: '/en/custom-misting', de: '/de/sonderanfertigung' },
  technology: { cs: '/jak-to-funguje', en: '/en/how-it-works', de: '/de/funktionsweise' },
  smart: { cs: '/smart-ovladani', en: '/en/smart-control', de: '/de/smart-steuerung' },
  references: { cs: '/reference', en: '/en/projects', de: '/de/referenzen' },
  contact: { cs: '/kontakt', en: '/en/contact', de: '/de/kontakt' },
  inquiry: { cs: '/poptavka', en: '/en/quote', de: '/de/anfrage' },
  about: { cs: '/o-nas', en: '/en/about', de: '/de/ueber-uns' },
  faq: { cs: '/podpora', en: '/en/faq', de: '/de/faq' },
};

const PATH_TO_ROUTE = Object.entries(ROUTE_MAP).flatMap(([key, localized]) =>
  Object.entries(localized).map(([locale, path]) => [path.replace(/\/$/, '') || '/', { key, locale }])
);

export function getLocaleFromPath(pathname = '/') {
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en';
  if (pathname === '/de' || pathname.startsWith('/de/')) return 'de';
  return 'cs';
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
    { hreflang: 'cs-CZ', path: routes.cs },
    { hreflang: 'en', path: routes.en },
    { hreflang: 'de-DE', path: routes.de },
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
