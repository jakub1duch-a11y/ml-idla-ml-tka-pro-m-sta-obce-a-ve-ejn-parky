/**
 * SEO utility — sets <title>, <meta name="description">, <meta name="keywords">,
 * Open Graph and Twitter Card tags dynamically for each page/product.
 */

import { LOCALE_CONFIG, ROUTE_MAP, getLanguageAlternates, getRouteKeyFromPath } from './i18n.js';

const SITE_NAME = 'MLŽIDLA.cz';
const BASE_URL = 'https://mlzidla.cz';
const DEFAULT_IMAGE = '/media/optimized/84af07a7b_0d4b710a-7605-463b-835a-71e89991f12d.webp';
export const GOOGLE_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Horn%C3%AD+Star%C3%A9+M%C4%9Bsto+698%2C+Trutnov';
export const GOOGLE_MAPS_EMBED_URL = 'https://www.google.com/maps?q=Horn%C3%AD+Star%C3%A9+M%C4%9Bsto+698%2C+Trutnov&output=embed';

function setMeta(name, content) {
  if (!content) return;
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
  el.setAttribute('content', content);
}

function setOg(property, content) {
  if (!content) return;
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute('property', property); document.head.appendChild(el); }
  el.setAttribute('content', content);
}

function normalizeCanonicalPath(path) {
  if (!path) return '/';
  const rawPath = path.startsWith('http') ? new URL(path).pathname : path;
  const cleanPath = rawPath.split('?')[0].split('#')[0] || '/';
  return cleanPath === '/' ? '/' : cleanPath.replace(/\/+$/, '');
}

function setCanonical(path) {
  const canonicalPath = normalizeCanonicalPath(path);
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', 'canonical'); document.head.appendChild(el); }
  el.setAttribute('href', `${BASE_URL}${canonicalPath}`);
}

function setLanguageAlternates(alternates = []) {
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
  alternates.forEach(({ hreflang, path }) => {
    if (!hreflang || !path) return;
    const el = document.createElement('link');
    el.setAttribute('rel', 'alternate');
    el.setAttribute('hreflang', hreflang);
    el.setAttribute('href', `${BASE_URL}${path}`);
    document.head.appendChild(el);
  });
}

function setOgLocale(locale = 'cs') {
  const config = LOCALE_CONFIG[locale] || LOCALE_CONFIG.cs;
  setOg('og:locale', config.ogLocale);
  document.querySelectorAll('meta[property="og:locale:alternate"]').forEach((el) => el.remove());
  Object.values(LOCALE_CONFIG)
    .filter((item) => item.code !== locale)
    .forEach((item) => {
      const el = document.createElement('meta');
      el.setAttribute('property', 'og:locale:alternate');
      el.setAttribute('content', item.ogLocale);
      document.head.appendChild(el);
    });
}

function setJsonLd(data) {
  let el = document.getElementById('json-ld-seo');
  if (!el) {
    const script = document.createElement('script');
    script.id = 'json-ld-seo';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
    el = script;
  }
  el.textContent = JSON.stringify(data);
}

function clearJsonLd() {
  document.getElementById('json-ld-seo')?.remove();
}

const BREADCRUMB_HOME = {
  cs: 'Hlavní stránka',
  en: 'Home',
  de: 'Startseite',
  pl: 'Strona główna',
  sk: 'Domov',
  it: 'Home',
};

// Lokalizované drobečkové schéma pro Google.
function generateBreadcrumbsJsonLd(path, title, locale = 'cs') {
  if (!path || path === ROUTE_MAP.home[locale]) return null;
  const homePath = ROUTE_MAP.home[locale] || '/';
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: BREADCRUMB_HOME[locale] || BREADCRUMB_HOME.en,
        item: `${BASE_URL}${homePath === '/' ? '' : homePath}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: title || path.split('/').filter(Boolean).at(-1),
        item: BASE_URL + path,
      },
    ],
  };
}

/**
 * @param {{
 *   title?: string,
 *   description?: string,
 *   keywords?: string,
 *   image?: string,
 *   canonicalPath?: string,
 *   type?: string,
 *   jsonLd?: any,
 *   geo?: { placename?: string, region?: string },
 *   robots?: string,
 *   locale?: 'cs'|'en'|'de'|'pl'|'sk'|'it',
 *   alternates?: Array<{hreflang: string, path: string}>
 * }} options
 */
export function setSEO({ title, description, keywords, image, canonicalPath, type = 'website', jsonLd, geo, robots, locale = 'cs', alternates = [] }) {
  // Nezdvojujeme značku v titulku u presetů, které už obsahují „MLŽIDLA.cz“.
  // Je to důležité i pro Google Ads landing-page message match: reklamní a vstupní titulek má zůstat čistý a čitelný.
  const normalizedTitle = String(title || '').trim();
  const fullTitle = normalizedTitle
    ? (normalizedTitle.toLowerCase().includes(SITE_NAME.toLowerCase()) ? normalizedTitle : `${normalizedTitle} | ${SITE_NAME}`)
    : SITE_NAME;
  const imagePath = image || DEFAULT_IMAGE;
  const img = imagePath.startsWith('http') ? imagePath : `${BASE_URL}${imagePath}`;
  const localeConfig = LOCALE_CONFIG[locale] || LOCALE_CONFIG.cs;
  const resolvedCanonicalPath = canonicalPath || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const routeKey = resolvedCanonicalPath ? getRouteKeyFromPath(resolvedCanonicalPath) : null;
  const resolvedAlternates = alternates.length ? alternates : (routeKey ? getLanguageAlternates(routeKey) : []);

  document.documentElement.lang = localeConfig.htmlLang;
  document.title = fullTitle;
  setMeta('description', description);
  setMeta('keywords', keywords || '');
  setMeta('robots', robots || 'index, follow');

  // Open Graph
  setOg('og:title', fullTitle);
  setOg('og:description', description);
  setOg('og:image', img);
  setOg('og:type', type);
  setOg('og:site_name', SITE_NAME);
  setOgLocale(locale);
  setOg('og:url', BASE_URL + normalizeCanonicalPath(resolvedCanonicalPath));

  // Twitter
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', fullTitle);
  setMeta('twitter:description', description);
  setMeta('twitter:image', img);

  setCanonical(resolvedCanonicalPath);
  setLanguageAlternates(resolvedAlternates);
  
  // Kombinace vlastních a automatických JSON-LD strukturovaných dat.
  // Pokud stránka dodá vlastní @graph, zachováme ho a doplníme BreadcrumbList.
  const breadcrumbs = generateBreadcrumbsJsonLd(resolvedCanonicalPath, title, locale);
  if (jsonLd && breadcrumbs) {
    const graph = jsonLd['@graph']
      ? [...jsonLd['@graph'], breadcrumbs]
      : [jsonLd, breadcrumbs];
    setJsonLd({ '@context': 'https://schema.org', '@graph': graph });
  } else if (jsonLd) {
    setJsonLd(jsonLd);
  } else if (breadcrumbs) {
    setJsonLd(breadcrumbs);
  } else {
    clearJsonLd();
  }

  // Místní SEO značky
  if (geo) {
    setMeta('geo.placename', geo.placename);
    setMeta('geo.region', geo.region || 'CZ');
  }
}

const isPublicImage = (url) => (
  typeof url === 'string'
  && url.length > 0
  && !url.startsWith('/media/studio/')
  && !url.startsWith('/media/products/')
  && !url.startsWith('/media/optimized/')
);

function getProductSearchContext(product) {
  const source = [product?.slug, product?.name, product?.short_description, product?.description]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (/(gate|brána|brana)/.test(source)) {
    return {
      primaryKeyword: 'mlžná brána',
      useCase: 'pro města, parky a veřejný prostor',
      keywords: 'mlžná brána, mlžné brány, mlžící brána, ochlazovací brána, veřejný prostor',
    };
  }

  if (/(aura|zahrad|terasa|pergola|rezidenc|garden)/.test(source)) {
    return {
      primaryKeyword: 'zahradní mlžítko',
      useCase: 'pro zahrady, terasy a pergoly',
      keywords: 'zahradní mlžítko, mlžítko na zahradu, mlžítko na terasu, vodní mlha na terasu, mlžení pergoly',
    };
  }

  if (/(mrak|spir|teepee|mrkev|škol|skolk|dět|hřišt)/.test(source)) {
    return {
      primaryKeyword: 'mlhoviště',
      useCase: 'pro parky, školy a dětská hřiště',
      keywords: 'mlhoviště, mlžítko do parku, mlhoviště pro děti, mlžítko na hřiště, veřejné mlžení',
    };
  }

  return {
    primaryKeyword: 'nerezové mlžítko',
    useCase: 'pro města, parky a veřejný prostor',
    keywords: 'městské mlžítko, mlžítko pro města, nerezové mlžítko, ochlazení města, veřejné mlžení',
  };
}

export function getProductSEO(product, reviewStats) {
  const search = getProductSearchContext(product);
  const canonicalPath = '/produkt/' + product.slug;
  const images = [
    product.hero_visual_verified ? product.hero_product_image_url : null,
    product.image_url,
    ...(product.gallery_urls || []),
  ].filter(isPublicImage);

  const additionalProperty = [
    product.material && { '@type': 'PropertyValue', name: 'Materiál', value: product.material },
    product.coverage_area && { '@type': 'PropertyValue', name: 'Rozměr nebo pokrytí', value: product.coverage_area },
    product.pressure && { '@type': 'PropertyValue', name: 'Provozní tlak', value: product.pressure },
    product.water_consumption && { '@type': 'PropertyValue', name: 'Spotřeba vody', value: product.water_consumption },
    product.micron_size && { '@type': 'PropertyValue', name: 'Velikost kapek', value: product.micron_size },
    product.power_supply && { '@type': 'PropertyValue', name: 'Napájení', value: product.power_supply },
  ].filter(Boolean);

  const materialText = product.material ? ' V provedení ' + product.material + '.' : '';
  const fallbackDescription = product.name + ' je ' + search.primaryKeyword + ' ' + search.useCase + '.' + materialText + ' Prohlédněte technické parametry, varianty, realizace a podklady pro projekt.';
  const description = product.seo_description || fallbackDescription;
  const productSchema = {
    '@type': 'Product',
    '@id': `${BASE_URL}${canonicalPath}#product`,
    name: product.name,
    description,
    image: images,
    url: BASE_URL + canonicalPath,
    category: search.primaryKeyword,
    brand: { '@type': 'Brand', name: 'MLŽIDLA®' },
    manufacturer: { '@type': 'Organization', name: 'HolmTec s.r.o.', url: 'https://holmtec.cz' },
    ...(product.location_context ? { areaServed: product.location_context } : {}),
    ...(Array.isArray(product.use_cases) && product.use_cases.length ? { audience: product.use_cases.map((name) => ({ '@type': 'Audience', audienceType: name })) } : {}),
    ...(additionalProperty.length ? { additionalProperty } : {}),
  };

  if (product.price_from) {
    productSchema.offers = {
      '@type': 'Offer',
      priceCurrency: 'CZK',
      price: product.price_from,
      availability: 'https://schema.org/InStock',
      url: BASE_URL + canonicalPath,
    };
  }

  if (reviewStats?.count && reviewStats?.average) {
    productSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: reviewStats.average,
      reviewCount: reviewStats.count,
    };
  }

  const faqItems = Array.isArray(product.faq_items)
    ? product.faq_items.filter((item) => item?.question && item?.answer)
    : [];
  const graph = [productSchema];
  if (faqItems.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${BASE_URL}${canonicalPath}#faq`,
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }

  return {
    title: product.seo_title || (product.name + ' – ' + search.primaryKeyword + ' ' + search.useCase),
    description,
    keywords: search.keywords + ', ' + product.name + ', HolmTec, MLŽIDLA.cz',
    image: images[0] || product.image_url,
    canonicalPath,
    type: 'product',
    jsonLd: { '@context': 'https://schema.org', '@graph': graph },
  };
}

export function getBlogPostSEO(post) {
  const canonicalPath = `/blog/${post.slug || post.id}`;
  const description = post.seo_description || post.perex;
  const faqItems = Array.isArray(post.faq_items)
    ? post.faq_items.filter((item) => item?.question && item?.answer)
    : [];
  const article = {
    '@type': 'BlogPosting',
    '@id': `${BASE_URL}${canonicalPath}#article`,
    headline: post.seo_title || post.title,
    description,
    image: post.image_url ? [post.image_url] : undefined,
    datePublished: post.published_date,
    mainEntityOfPage: `${BASE_URL}${canonicalPath}`,
    author: { '@type': 'Organization', name: 'HolmTec s.r.o.', url: 'https://holmtec.cz' },
    publisher: { '@type': 'Organization', name: 'MLŽIDLA.cz', url: BASE_URL },
    ...(post.location_context ? { contentLocation: { '@type': 'Place', name: post.location_context } } : {}),
    ...(Array.isArray(post.tags) && post.tags.length ? { keywords: post.tags.join(', ') } : {}),
    ...(Array.isArray(post.related_product_slugs) && post.related_product_slugs.length ? {
      about: post.related_product_slugs.map((slug) => ({ '@type': 'Product', url: `${BASE_URL}/produkt/${slug}` })),
    } : {}),
  };
  const graph = [article];
  if (faqItems.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${BASE_URL}${canonicalPath}#faq`,
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }
  return {
    title: post.seo_title || post.title,
    description,
    image: post.image_url,
    canonicalPath,
    type: 'article',
    jsonLd: { '@context': 'https://schema.org', '@graph': graph },
  };
}

export function getReferenceSEO(project) {
  const isBendyJicin = project.id === '6a71d1ff57598752eed27bfb';
  const isBendyLineaGarden = project.id === '6a9fdf2f153be3ee13d70207';
  const title = isBendyJicin
    ? 'BENDY na Valdštejnově náměstí v Jičíně – realizace'
    : isBendyLineaGarden
      ? 'BENDY + LINEA v rodinné zahradě – nízkotlaké mlžení'
      : project.name;
  const description = isBendyJicin
    ? 'Skutečná realizace nerezového mlžítka BENDY na Valdštejnově náměstí v Jičíně. Fotografie a videa pouze z této městské instalace.'
    : isBendyLineaGarden
      ? 'Reálná realizace nízkotlakého mlžícího prostoru BENDY + LINEA v rodinné zahradě. Nerezová mlžítka, lokální ochlazení a monitoring provozu.'
      : project.description;
  const canonicalPath = isBendyJicin
    ? '/reference/bendy-jicinske-namesti'
    : isBendyLineaGarden
      ? '/reference/bendy-linea-rodinna-zahrada'
      : `/reference/${project.id}`;
  return {
    title,
    description,
    keywords: isBendyJicin
      ? 'BENDY Jičín, mlžítko Jičín, Valdštejnovo náměstí, městské mlžítko, ochlazení náměstí, MLŽIDLA.cz'
      : isBendyLineaGarden ? 'BENDY, LINEA, zahradní mlžítko, nízkotlaké mlžení, mlžení zahrady, ochlazení zahrady, MLŽIDLA.cz' : undefined,
    image: project.image_url,
    canonicalPath,
    type: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      image: project.image_url,
      mainEntityOfPage: `${BASE_URL}${canonicalPath}`,
      author: { '@type': 'Organization', name: 'HolmTec s.r.o.' },
      publisher: { '@type': 'Organization', name: 'MLŽIDLA.cz' }
    }
  };
}

// ─── Per-page SEO presets ────────────────────────────────────────────────────

export const SEO_PAGES = {
  home: {
    title: 'Mlžítka a mlžné brány pro veřejný prostor',
    description: 'Zakázková mlžítka, designové mlžné brány a chladicí systémy HolmTec z nerezové oceli AISI 316L. Efektivní ochlazení měst, parků, náměstí i zahrad.',
    keywords: 'mlžné plastiky, mlžítka, mlzitka, mlžné brány, HolmTec, mlzidla, nerezové skulptury, vodní prvky, veřejné mlžení',
    canonicalPath: '/',
  },
  kolekce: {
    title: 'Celý katalog 2026 - Mlžítka a mlžné brány',
    description: 'Katalog 2026 - Systémy HolmTec: OSTEV, MRAK, LINEA, Y-ARMIST, BENDY 60, GATE70 a další. Zakázková výroba z nerezové oceli pro moderní architekturu.',
    keywords: 'mlžítka katalog, mlžné brány, designová mlžítka, mlžné skulptury, mlžné systémy, OSTEV, MRAK, LINEA, Y-ARMIST, BENDY 60, GATE70',
    canonicalPath: '/mlzidla-mlzitka',
  },
  mestskaKolekce: {
    title: 'Městská mlžítka pro města, obce a veřejný prostor',
    description: 'Nerezová městská mlžítka, mlžné brány a mlžné zóny pro náměstí, parky, školy, hřiště a sportoviště. Projektová podpora, Smart řízení a servis.',
    keywords: 'městská mlžítka, mlžítka pro města, mlžítka pro obce, ochlazování měst, městské ochlazování, mlžná zóna',
    canonicalPath: '/mestske-mlzitka',
  },
  zahradniKolekce: {
    title: 'Zahradní mlžítka pro zahrady, terasy a pergoly',
    description: 'Designová nerezová zahradní mlžítka pro zahrady, terasy, pergoly a venkovní wellness. Nízkotlaké řešení na vodovodní řad a volitelné Smart ovládání.',
    keywords: 'zahradní mlžítko, mlžítka na zahradu, mlžítko na terasu, zahradní mlžení, vodní mlha na zahradu, vodní mlha na terasu',
    canonicalPath: '/zahradni-mlzitka',
  },
  zakazkovaKolekce: {
    title: 'Zakázková mlžítka a mlžné sochy na míru',
    description: 'Zakázková nerezová mlžítka, mlžné sochy a atypické mlžné instalace podle identity místa, architektonického návrhu nebo vlastního tvaru.',
    keywords: 'zakázkové mlžítko, mlžítko na míru, mlžná socha, designové mlžítko, atypické mlžítko, mlžná instalace',
    canonicalPath: '/zakazkova-mlzitka',
  },
  mlzitko: {
    title: 'Mlžítko — designové nerezové mlžítko bez čerpadla',
    description: 'Designová nerezová mlžítka a mlžné sochy pro města, zahrady a veřejný prostor. Nízkotlaké mlžení na vodovodní řad, Smart ovládání a výroba na míru.',
    keywords: 'mlžítko, mlžítka, mlzitko, mlzitka, designové mlžítko, nerezové mlžítko',
    canonicalPath: '/mlzitko',
  },
  mlhoviste: {
    title: 'Mlhoviště pro města, zahrady a dětská hřiště',
    description: 'Nerezová mlhoviště a mlžné zóny pro města, parky, dětská hřiště, zahrady a terasy. Nízkotlaké řešení, Smart řízení a zakázková výroba.',
    keywords: 'mlhoviště, mlhoviste, mlhoviště na zahradu, dětské mlhoviště, mobilní mlhoviště, mlžná zóna',
    canonicalPath: '/mlhoviste',
  },
  vodniMlha: {
    title: 'Vodní mlha pro zahrady, terasy a veřejný prostor',
    description: 'Vodní mlha pro ochlazení zahrad, teras, pergol, parků a veřejného prostoru. Princip, nízkotlaké mlžení, trysky, spotřeba a Smart řízení.',
    keywords: 'vodní mlha, vodní mlha na zahradu, vodní mlha na terasu, mlha na zahradu, zahradní mlha, vodní mlha na pergolu',
    canonicalPath: '/vodni-mlha',
  },
  mlzneBrany: {
    title: 'Mlžné brány pro města, parky a eventy',
    description: 'Designové nerezové mlžné brány pro města, parky, sportoviště a eventy. Nízkotlaké mlžení, zakázkové rozměry, projektová podpora a Smart řízení.',
    keywords: 'mlžná brána, mlžné brány, mlzna brana, mlžící brána, ochlazovací brána',
    canonicalPath: '/mlzne-brany',
  },
  jakToFunguje: {
    title: 'Jak funguje vodní mlha a nízkotlaké mlžení',
    description: 'Jak funguje vodní mlha, evaporace, trysky a nízkotlaké mlžení na běžný vodovodní řad. Vysvětlení tlaku, průtoku, spotřeby a podmínek pro účinné ochlazení.',
    keywords: 'jak funguje mlžení, vodní mlha, nízkotlaké mlžení, evaporace, mlžicí trysky, ochlazení vodní mlhou',
    canonicalPath: '/jak-to-funguje',
  },
  oNas: {
    title: 'O nás — HolmTec, výrobce mlžných skulptur z Trutnova',
    description: 'HolmTec je česká firma s kořeny v přesném strojírenství. Vyrábíme zakázkové mlžné plastiky a chladicí systémy z nerezové oceli AISI 316L pro města, parky a eventy.',
    keywords: 'HolmTec, výrobce mlžných prvků, mlzidla.cz, mlžné skulptury výroba, zakázková výroba Trutnov, nerezová mlžítka',
    canonicalPath: '/o-nas',
  },
  reference: {
    title: 'Reference — Realizované projekty mlžných plastik a mlhovišť',
    description: 'Více než 120 úspěšných realizací mlžných prvků a systémů po celé ČR. Prohlédněte si referenční galerii projektů HolmTec pro města, obce a soukromé investory.',
    keywords: 'reference mlžná mlžítka, realizace mlhoviště, projekty mlžení veřejný prostor, instalace mlžných skulptur',
    canonicalPath: '/reference',
  },
  blog: {
    title: 'Blog — Mlžné technologie, inspirace a urbanismus | HolmTec',
    description: 'Články o technologiích, inspiraci a novinkách ze světa městského ochlazování. Témata jako evaporace, mikroklíma měst, srovnání s klimatizací a inovace HolmTec.',
    keywords: 'blog mlžení, městské mikroklíma, evaporace veřejný prostor, chlazení měst, mlžné skulptury technologie',
    canonicalPath: '/blog',
  },
  poptavka: {
    title: 'Nezávazná poptávka — Mlžné plastiky a chladicí systémy na míru',
    description: 'Poptejte zakázkové mlžítko, bránu nebo ucelený chladicí systém. Konzultace zdarma, 3D vizualizace do 48 hodin, rychlá kalkulace. HolmTec — mlzidla.cz.',
    keywords: 'poptávka mlžná tělesa, nezávazná poptávka mlhoviště, kalkulace mlžení, mlžné skulptury cena',
    canonicalPath: '/poptavka',
  },
  kontakt: {
    title: 'Kontakt — HolmTec mlžné skulptury a městská mlžítka',
    description: 'Kontaktujte výrobce HolmTec: Trutnov, +420 774 700 390, obchod1@holmtec.cz. Projektová spolupráce, cenové nabídky, 3D vizualizace a výkresová dokumentace.',
    keywords: 'kontakt HolmTec, mlžítka kontakt, mlhoviště poptávka, HolmTec telefon, technická podpora mlžení',
    canonicalPath: '/kontakt',
  },
  podpora: {
    title: 'Podpora & FAQ — Časté dotazy o mlžných systémech HolmTec',
    description: 'Odpovědi na nejčastější dotazy ohledně provozu: stavební připravenost, zimní údržba, spotřeba vody, legislativní certifikáty a záruční podmínky.',
    keywords: 'FAQ mlžná technika, údržba mlžítka, zazimování mlhoviště, instalace vodních prvků, certifikace pitná voda',
    canonicalPath: '/podpora',
  },
  mestOobce: {
    title: 'Mlžítka pro města a obce – návrh a výroba',
    description: 'Městská mlžítka, mlhoviště a mlžné brány pro náměstí, parky, školy a veřejný prostor. Vizualizace, zakázková výroba, Smart řízení, instalace a servis.',
    keywords: 'mlžítka pro města, mlžítka pro obce, městská mlžítka, městské mlhoviště, ochlazování měst, ochlazení veřejného prostoru, mlžné brány, zakázková výroba',
    canonicalPath: '/mlzitka-pro-mesta-obce',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          name: 'Návrh a zakázková výroba mlžítek pro města a obce',
          serviceType: 'Městská mlžítka, mlhoviště a mlžné brány',
          description: 'Návrh, vizualizace, zakázková výroba, instalace, Smart řízení a servis mlžných prvků pro veřejný prostor.',
          provider: { '@type': 'Organization', name: 'HolmTec s.r.o.', url: BASE_URL },
          areaServed: { '@type': 'Country', name: 'Česká republika' },
          audience: { '@type': 'Audience', audienceType: 'Města, obce, architekti a projektanti' },
          url: BASE_URL + '/mlzitka-pro-mesta-obce',
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Co potřebujete pro první návrh?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Stačí fotografie nebo situační výkres místa, přibližné rozměry, očekávaný způsob využití a informace o dostupnosti vody a elektřiny.',
              },
            },
            {
              '@type': 'Question',
              name: 'Lze řešení přizpůsobit architektuře města?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Ano. Zakázkové zpracování může řešit rozměry, konfiguraci, kotvení, návaznost na mobiliář i barevné a povrchové pojetí. Každé technické rozhodnutí následně potvrzuje projektová dokumentace.',
              },
            },
            {
              '@type': 'Question',
              name: 'Co obdrží obec před rozhodnutím?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Podle fáze projektu připravíme situační doporučení, variantu řešení, vizualizaci, technické požadavky a podklady pro cenovou nabídku.',
              },
            },
            {
              '@type': 'Question',
              name: 'Jak se řeší provoz a údržba?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Součástí návrhu může být Smart řízení, provozní režimy, vzdálená správa a plán servisu včetně přípravy na zimní období.',
              },
            },
          ],
        },
      ],
    },
  },
  parkyHriste: {
    title: 'Mlhoviště pro parky a dětská hřiště — Bezpečné mlžení bez chemie',
    description: 'Nerezové nízkotlaké mlžné systémy pro parky a dětská hřiště. Konstrukce z AISI 316L, provoz bez čerpadla a řešení navržené pro bezpečný a snadno udržovatelný veřejný prostor.',
    keywords: 'mlhoviště dětské hřiště, parkové mlžení, herní vodní prvky, bezpečné ochlazení dětí',
    canonicalPath: '/kategorie/parky-hriste',
  },
  koupaliste: {
    title: 'Mlhoviště pro koupaliště a aquaparky — Komfortní chladicí zóny',
    description: 'Designové nízkotlaké mlžné systémy pro koupaliště, aquaparky a bazénové areály. Nerezové řešení bez čerpadla, napojené na běžný vodovodní řad, pro komfortní venkovní ochlazení.',
    keywords: 'mlhoviště koupaliště, mlžení aquapark, chladicí zóna bazén, nízkotlaké mlžení koupaliště',
    canonicalPath: '/kategorie/koupaliste',
  },
  architekti: {
    title: 'Mlžítka pro architekty | 2D/3D, BIM a technické podklady',
    description: 'Projektové podklady pro architekty a krajináře: 2D/3D, BIM dle produktu, technické listy, vizualizace, reference a konzultace od studie po realizaci.',
    keywords: 'BIM modely mlžítka, DWG výkresy mlžná brána, podklady pro architekty, technická specifikace HolmTec, mlžítka pro krajináře',
    canonicalPath: '/kategorie/architekti',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          name: 'Projektová podpora pro architekty a krajináře',
          serviceType: 'Technické podklady a návrh mlžných prvků do veřejného prostoru',
          description: 'Technické listy, 2D/3D podklady, BIM dle konkrétního produktu, vizualizace, reference a konzultace pro začlenění mlžítek do projektu.',
          provider: { '@type': 'Organization', name: 'HolmTec s.r.o.', url: 'https://holmtec.cz' },
          areaServed: { '@type': 'Country', name: 'Česká republika' },
          audience: { '@type': 'Audience', audienceType: 'Architekti, krajinářští architekti a projektanti' },
          url: BASE_URL + '/kategorie/architekti',
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Jaké podklady jsou k mlžítkům dostupné pro projekt?',
              acceptedAnswer: { '@type': 'Answer', text: 'Podle konkrétního produktu poskytujeme technické listy, 2D/3D podklady, výkresy a u vybraných produktů BIM podklady. Dostupnost se ověřuje vždy pro zvolený model.' },
            },
            {
              '@type': 'Question',
              name: 'Lze připravit vizualizaci mlžítka přímo do navrhovaného prostoru?',
              acceptedAnswer: { '@type': 'Answer', text: 'Ano. Pro studii lze připravit návrhovou vizualizaci v konkrétním prostředí. Geometrie produktu se ověřuje proti referenčnímu podkladu a technické parametry se potvrzují podle zvoleného modelu.' },
            },
            {
              '@type': 'Question',
              name: 'Kde najdu realizace a lokalitní reference?',
              acceptedAnswer: { '@type': 'Answer', text: 'Realizace jsou propojené z produktových detailů a z referenční sekce webu. U jednotlivých realizací uvádíme lokalitu, použitý produkt a dostupná média.' },
            },
          ],
        },
      ],
    },
  },
  komercni: {
    title: 'Mlžení pro komerční prostory — restaurace, obchodní centra, výrobní haly',
    description: 'Mlžné systémy pro terasy restaurací, nákupní centra, showroomy a výrobní haly. Zvyšte komfort zákazníků i zaměstnanců, nerezová konstrukce s dlouhou životností.',
    keywords: 'mlžení komerční prostory, mlžítka restaurace, mlžné terasy, ochlazení nákupní centrum, mlžení výrobní haly',
    canonicalPath: '/kategorie/komercni',
  },
  eventy: {
    title: 'Mlžení pro eventy a festivaly — mobilní chladicí řešení na akce',
    description: 'Mlžné prvky pro hudební festivaly, letní terasy, sportovní akce a veletrhy. Mobilní instalace k pronájmu i koupi, rychlé osvěžení návštěvníků kdekoli venku.',
    keywords: 'mlžení festival, mlžítka na akce, mobilní mlžení, chlazení eventy, pronájem mlžítek',
    canonicalPath: '/kategorie/eventy',
  },
  outdoor: {
    title: 'Mlžítka na zahradu a terasu | MLŽIDLA.cz',
    description: 'Designová mlžítka pro zahrady, terasy a venkovní wellness. Nerezové provedení, Smart ovládání, vizualizace a návrh vhodné konfigurace.',
    keywords: 'mlžítka zahrada, venkovní mlžení, zahradní mlžná skulptura, ochlazení terasy, outdoor mlžítka',
    canonicalPath: '/kategorie/outdoor-zahrady',
  },
  art: {
    title: 'Mlžné umělecké instalace — Art & Design kolekce HolmTec',
    description: 'Mlžná skulptura jako umělecké dílo. Site-specific instalace pro galerie, výstavy a veřejný prostor, kombinující design, technologii a smyslový zážitek.',
    keywords: 'mlžné umělecké instalace, art instalace mlha, site-specific mlžítko, designová skulptura mlha',
    canonicalPath: '/kategorie/art-instalace',
  },
  deti: {
    title: 'Mlhoviště pro školy, školky a dětská hřiště — bezpečné mlžení',
    description: 'Nízkotlaká mlhoviště pro základní školy, mateřské školy a dětská hřiště. Nerez AISI 316L, jemné mlžení bez čerpadla a řešení navržené pro dětské a veřejné prostory.',
    keywords: 'mlhoviště škola, mlžítka školka, dětské hřiště mlžení, bezpečné mlžení dětí',
    canonicalPath: '/kategorie/skoly-skolky-deti',
  },
};