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
  const fallbackDescription = 'Designové nerezové mlžítko pro ochlazení zahrad, parků a veřejných prostor jemnou vodní mlhou.' + materialText;
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

  // Ceny se u zakázkových mlžítek nezveřejňují ve veřejných strukturovaných datech.
  // Patří do interních nabídek a klientského portálu, ne do Google indexu.

  if (reviewStats?.count && reviewStats?.average) {
    productSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: reviewStats.average,
      reviewCount: reviewStats.count,
    };
  }

  const explicitFaqItems = Array.isArray(product.faq_items)
    ? product.faq_items.filter((item) => item?.question && item?.answer)
    : [];
  const derivedFaqItems = [
    product.material && { question: `Z jakého materiálu je ${product.name}?`, answer: `${product.name} má v technických údajích uveden materiál: ${product.material}.` },
    product.pressure && { question: `Jaký provozní tlak vyžaduje ${product.name}?`, answer: `U produktu ${product.name} je uveden provozní tlak ${product.pressure}. Finální nastavení se vždy potvrzuje podle konkrétní konfigurace a místa instalace.` },
    product.water_consumption && { question: `Jaká je spotřeba vody u ${product.name}?`, answer: `Uvedená spotřeba vody je ${product.water_consumption}. Skutečná spotřeba závisí na počtu trysek, tlaku a provozním režimu.` },
    product.micron_size && { question: `Jak jemnou mlhu vytváří ${product.name}?`, answer: `Technický údaj pro tento produkt je ${product.micron_size}.` },
    product.power_supply && { question: `Potřebuje ${product.name} elektrické napájení?`, answer: `Pro tento produkt je uvedeno: ${product.power_supply}. Přesné zapojení se potvrzuje podle zvoleného řízení.` },
  ].filter(Boolean);
  const faqItems = explicitFaqItems.length ? explicitFaqItems : derivedFaqItems.slice(0, 5);
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
    title: product.seo_title || (product.name + ' – nerezové mlžítko pro zahrady a města'),
    description,
    keywords: search.keywords + ', ' + product.name + ', HolmTec, MLŽIDLA.cz',
    image: images[0] || product.image_url,
    canonicalPath,
    type: 'product',
    jsonLd: { '@context': 'https://schema.org', '@graph': graph },
  };
}

function stripArticleText(value = '') {
  return String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]+\]\([^)]*\)/g, (match) => match.replace(/^\[|\]\([^)]*\)$/g, ''))
    .replace(/[#*_>`|\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getBlogFaqItems(post) {
  const explicit = Array.isArray(post?.faq_items)
    ? post.faq_items.filter((item) => item?.question && item?.answer)
    : [];
  if (explicit.length) return explicit;

  const summary = String(post?.perex || '').trim() || stripArticleText(post?.content || '').slice(0, 320);
  const title = String(post?.title || 'tématu článku').trim();
  const followUpByCategory = {
    novinky: {
      question: 'Kde najdu související produkty nebo další novinky?',
      answer: 'Navazující odkazy a související produkty jsou uvedené pod článkem. Další aktuality najdete v sekci Blog a novinky.',
    },
    technika: {
      question: 'Kde najdu další technické informace k tématu?',
      answer: 'Navazující technické stránky a související produkty jsou uvedené pod článkem podle jeho tématu.',
    },
    realizace: {
      question: 'Kde najdu další realizace a související projekty?',
      answer: 'Další realizace najdete v sekci Reference; související odkazy k tomuto projektu jsou uvedené také pod článkem.',
    },
    inspirace: {
      question: 'Kde najdu další inspiraci pro podobný prostor?',
      answer: 'Další inspiraci najdete v blogu, referencích a v tematických odkazech uvedených pod článkem.',
    },
  };
  return [
    {
      question: `Co je hlavním tématem článku „${title}“?`,
      answer: summary || `Článek shrnuje hlavní souvislosti tématu „${title}“ a navazující možnosti řešení.`,
    },
    followUpByCategory[post?.category] || {
      question: 'Kde najdu další související informace?',
      answer: 'Navazující obsah, produkty a další relevantní stránky jsou uvedené v odkazech pod článkem.',
    },
  ];
}

export function getBlogPostSEO(post) {
  const canonicalPath = `/blog/${post.slug || post.id}`;
  const description = post.seo_description || post.perex;
  const faqItems = getBlogFaqItems(post);
  const contentImages = Array.isArray(post.content_images)
    ? post.content_images.filter((item) => item?.url).map((item) => item.url)
    : [];
  const images = [post.image_url, ...contentImages].filter(Boolean);
  const article = {
    '@type': post.category === 'novinky' ? 'NewsArticle' : 'BlogPosting',
    '@id': `${BASE_URL}${canonicalPath}#article`,
    headline: post.seo_title || post.title,
    description,
    image: images.length ? images : undefined,
    datePublished: post.published_date,
    dateModified: post.updated_date || post.published_date,
    mainEntityOfPage: `${BASE_URL}${canonicalPath}`,
    inLanguage: 'cs-CZ',
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
      '@id': `${BASE_URL}${canonicalPath}#realizace`,
      headline: title,
      description,
      image: project.image_url,
      mainEntityOfPage: `${BASE_URL}${canonicalPath}`,
      ...(project.location ? { contentLocation: { '@type': 'Place', name: project.location } } : {}),
      ...(project.product_used ? { about: { '@type': 'Product', name: project.product_used } } : {}),
      ...(project.client ? { mentions: { '@type': 'Organization', name: project.client } } : {}),
      author: { '@type': 'Organization', name: 'HolmTec s.r.o.', url: 'https://holmtec.cz' },
      publisher: { '@type': 'Organization', name: 'MLŽIDLA.cz', url: BASE_URL }
    }
  };
}

// ─── Per-page SEO presets ────────────────────────────────────────────────────

export const SEO_PAGES = {
  home: {
    title: 'Designová mlžítka pro města a zahrady',
    description: 'Nerezová mlžítka, mlžné brány a mlhoviště pro města, obce, parky i zahrady. Návrh řešení, technické podklady a chytré řízení pro venkovní prostory.',
    keywords: 'mlžné plastiky, mlžítka, mlzitka, mlžné brány, HolmTec, mlzidla, nerezové skulptury, vodní prvky, veřejné mlžení',
    canonicalPath: '/',
  },
  kolekce: {
    title: 'Katalog mlžítek, mlžných bran a mlhovišť',
    description: 'Vyberte mlžítko, mlžnou bránu nebo mlhoviště pro město, park, hřiště, sportoviště či zahradu. Prohlédněte si produkty, možnosti využití a technické podklady.',
    keywords: 'katalog mlžítek, katalog mlzitek, mlžítka pro města, mlžítka pro obce, mlžné brány, městská mlžítka, nerezová mlžítka',
    canonicalPath: '/katalog-mlzitek',
  },
  mestskaKolekce: {
    title: 'Městská mlžítka pro města a obce',
    description: 'Městská mlžítka, mlžné brány a mlžné zóny pro náměstí, parky, školy a sportoviště. Návrh rozmístění, technické podklady, chytré řízení i servis podle projektu.',
    keywords: 'městská mlžítka, mlžítka pro města, mlžítka pro obce, ochlazování měst, městské ochlazování, mlžná zóna',
    canonicalPath: '/mestske-mlzitka',
  },
  mestskeOchlazovani: {
    title: 'Městská mlžítka pro ochlazení měst',
    description: 'Městská mlžítka, mlžné brány a mlžné zóny pro náměstí, parky, pěší zóny a sportoviště. Návrh rozmístění, technické podklady, řízení i servis.',
    keywords: 'městská mlžítka, mlžítka pro města, ochlazování měst, ochlazování veřejného prostoru, mlžné brány, mlžná zóna',
    canonicalPath: '/mestske-ochlazovani-verejneho-prostoru',
  },
  zahradniKolekce: {
    title: 'Zahradní mlžítka na terasu i do zahrady',
    description: 'Designová zahradní mlžítka pro terasy, pergoly, zahrady a venkovní wellness. Vyberte nerezový prvek, ovládání a napojení podle svého prostoru.',
    keywords: 'zahradní mlžítko, mlžítka na zahradu, mlžítko na terasu, zahradní mlžení, vodní mlha na zahradu, vodní mlha na terasu',
    canonicalPath: '/zahradni-mlzitka',
  },
  zakazkovaKolekce: {
    title: 'Zakázková mlžítka a mlžné sochy na míru',
    description: 'Navrhujeme zakázková mlžítka, mlžné sochy a atypické instalace pro města, parky i soukromé zahrady. Tvar a technické řešení přizpůsobíme konkrétnímu místu.',
    keywords: 'zakázkové mlžítko, mlžítko na míru, mlžná socha, designové mlžítko, atypické mlžítko, mlžná instalace',
    canonicalPath: '/zakazkova-mlzitka',
  },
  mlzitko: {
    title: 'Mlžítka z nerezu pro města i zahrady',
    description: 'Designová mlžítka a mlžné sochy pro veřejný prostor, parky, hřiště, terasy a zahrady. Prohlédněte si typy, technické informace a možnosti zakázkového řešení.',
    keywords: 'mlžítko, mlžítka, mlzitko, mlzitka, designové mlžítko, nerezové mlžítko',
    canonicalPath: '/mlzitko',
  },
  mlhoviste: {
    title: 'Mlhoviště a mlžiště pro města, parky a zahrady',
    description: 'Návrh mlhoviště nebo mlžiště pro náměstí, parky, dětská hřiště a areály. Propojíme mlžítka do vhodné zóny podle prostoru, přívodu vody a způsobu provozu.',
    keywords: 'mlžiště, mlziste, mlhoviště, mlhoviste, mlhoviště na zahradu, dětské mlhoviště, mobilní mlhoviště, mlžná zóna',
    canonicalPath: '/mlhoviste',
  },
  vodniMlha: {
    title: 'Vodní mlha pro zahrady, terasy a města',
    description: 'Zjistěte, jak funguje vodní mlha a nízkotlaké mlžení. Vysvětlujeme princip trysek, odpařování, spotřebu vody a možnosti pro zahrady i veřejný prostor.',
    keywords: 'vodní mlha, vodní mlha na zahradu, vodní mlha na terasu, mlha na zahradu, zahradní mlha, vodní mlha na pergolu',
    canonicalPath: '/vodni-mlha',
  },
  sloupkovaMlzitka: {
    title: 'Sloupková mlžítka pro parky a města',
    description: 'Sloupková mlžítka pro náměstí, promenády, parky a pěší zóny. Pomůžeme vybrat tvar a navrhnout rozmístění, napojení i provoz pro konkrétní lokalitu.',
    keywords: 'sloupková mlžítka, sloupkové mlžítko, mlžítko LINEA, nerezové mlžítko, mlžítka pro města',
    canonicalPath: '/sloupkova-mlzitka',
  },
  mlzneBrany: {
    title: 'Mlžné brány pro města, parky a veřejný prostor',
    description: 'Designové mlžné brány a oblouky pro náměstí, parky, sportoviště a areály. Vyberte tvar a proberte rozměry, napojení vody, řízení i instalaci.',
    keywords: 'mlžná brána, mlžné brány, mlžný oblouk, mlžící brána, ochlazovací brána',
    canonicalPath: '/mlzne-brany',
  },
  atelierovePrvky: {
    title: 'Ateliérová mlžítka a mlžné instalace na míru',
    description: 'Zakázková mlžítka a výrazné mlžné instalace pro veřejný prostor, parky, školy i soukromé areály. Návrh vychází z charakteru místa a technických možností.',
    keywords: 'zakázková mlžítka, ateliérové prvky, designová mlžítka, mlžná instalace, mlžítko na míru',
    canonicalPath: '/atelierove-prvky',
  },
  jakToFunguje: {
    title: 'Jak funguje vodní mlha a mlžení',
    description: 'Poznejte princip vodní mlhy, nízkotlakého mlžení a mlžicích trysek. Vysvětlujeme vliv tlaku, průtoku, počasí a návrhu na účinek i provoz systému.',
    keywords: 'jak funguje mlžení, vodní mlha, nízkotlaké mlžení, evaporace, mlžicí trysky, ochlazení vodní mlhou',
    canonicalPath: '/jak-to-funguje',
  },
  oNas: {
    title: 'HolmTec: výrobce mlžítek a mlžných soch',
    description: 'Poznejte HolmTec a výrobu mlžítek, mlžných bran a skulptur. Představujeme technický přístup a spolupráci při přípravě veřejných i rezidenčních projektů.',
    keywords: 'HolmTec, výrobce mlžných prvků, mlzidla.cz, mlžné skulptury výroba, zakázková výroba Trutnov, nerezová mlžítka',
    canonicalPath: '/o-nas',
  },
  reference: {
    title: 'Reference mlžítek a mlhovišť z realizací',
    description: 'Prohlédněte si realizace mlžítek, mlžných bran a mlhovišť pro města, parky, školy, zoologické zahrady i soukromé zahrady. Inspirace pro nové projekty.',
    keywords: 'reference mlžná mlžítka, realizace mlhoviště, projekty mlžení veřejný prostor, instalace mlžných skulptur',
    canonicalPath: '/reference',
  },
  blog: {
    title: 'Blog o mlžítkách, vodní mlze a ochlazování',
    description: 'Články o mlžítkách, mlžných branách, vodní mlze, realizacích a městském ochlazování. Praktické informace pro obce, architekty i majitele zahrad.',
    keywords: 'blog mlžení, městské mikroklíma, evaporace veřejný prostor, chlazení měst, mlžné skulptury technologie',
    canonicalPath: '/blog',
  },
  poptavka: {
    title: 'Poptávka na mlžítko, mlžnou bránu nebo mlhoviště',
    description: 'Pošlete nezávaznou poptávku na městské nebo zahradní mlžítko, mlžnou bránu či mlhoviště. Pomůžeme upřesnit vhodné řešení podle místa, rozpočtu a provozu.',
    keywords: 'poptávka mlžná tělesa, nezávazná poptávka mlhoviště, kalkulace mlžení, mlžné skulptury cena',
    canonicalPath: '/poptavka',
  },
  kontakt: {
    title: 'Kontakt na výrobce mlžítek',
    description: 'Kontaktujte HolmTec kvůli městskému nebo zahradnímu mlžítku, mlžné bráně či mlhovišti. Domluvíme technické podklady, nabídku a další postup projektu.',
    keywords: 'kontakt HolmTec, mlžítka kontakt, mlhoviště poptávka, HolmTec telefon, technická podpora mlžení',
    canonicalPath: '/kontakt',
  },
  podpora: {
    title: 'FAQ: údržba, instalace a provoz mlžítek',
    description: 'Odpovědi na otázky k instalaci mlžítek, přívodu vody, spotřebě, údržbě, zazimování a chytrému řízení. Praktické podklady pro správce i provozovatele.',
    keywords: 'FAQ mlžná technika, údržba mlžítka, zazimování mlhoviště, instalace vodních prvků, certifikace pitná voda',
    canonicalPath: '/podpora',
  },
  mestOobce: {
    title: 'Mlžítka pro města a obce: návrh a výroba',
    description: 'Městská mlžítka, mlhoviště a mlžné brány pro náměstí, parky, školy a sportoviště. Návrh rozmístění, technické podklady, chytré řízení, instalace a servis.',
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
    title: 'Mlhoviště pro parky a dětská hřiště',
    description: 'Mlžítka a mlhoviště pro parky, dětská hřiště a veřejná prostranství. Návrh zóny, umístění prvků a provozní řešení podle konkrétního místa.',
    keywords: 'mlhoviště dětské hřiště, parkové mlžení, herní vodní prvky, bezpečné ochlazení dětí',
    canonicalPath: '/kategorie/parky-hriste',
  },
  koupaliste: {
    title: 'Mlžítka a mlhoviště pro koupaliště',
    description: 'Mlžítka a mlhoviště pro koupaliště, aquaparky a venkovní bazénové areály. Návrh mlžicí zóny, přívodu vody a provozu podle konkrétního místa.',
    keywords: 'mlhoviště koupaliště, mlžení aquapark, chladicí zóna bazén, nízkotlaké mlžení koupaliště',
    canonicalPath: '/kategorie/koupaliste',
  },
  architekti: {
    title: 'Mlžítka pro architekty a krajináře',
    description: 'Technické listy, 2D/3D výkresy a BIM dle konkrétního produktu. Podklady pro architekty a krajináře, vizualizace, reference a konzultace k projektu.',
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
    title: 'Mlžení pro restaurace, hotely a komerční areály',
    description: 'Mlžítka a mlžné systémy pro terasy restaurací, hotely, showroomy a komerční areály. Návrh, nerezové provedení a řízení podle konkrétního provozu.',
    keywords: 'mlžení komerční prostory, mlžítka restaurace, mlžné terasy, ochlazení nákupní centrum, mlžení výrobní haly',
    canonicalPath: '/kategorie/komercni',
  },
  eventy: {
    title: 'Mlžení a mlžítka pro festivaly a eventy',
    description: 'Mlžítka a mlžné brány pro festivaly, sportovní akce a venkovní eventy. Proberte nákup nebo pronájem, rozmístění a podmínky provozu pro vaši akci.',
    keywords: 'mlžení festival, mlžítka na akce, mobilní mlžení, chlazení eventy, pronájem mlžítek',
    canonicalPath: '/kategorie/eventy',
  },
  outdoor: {
    title: 'Zahradní mlžítka pro terasy a wellness',
    description: 'Designová mlžítka pro soukromé zahrady, terasy, pergoly a wellness. Vyberte vhodný tvar, napojení vody a volitelné chytré ovládání podle prostoru.',
    keywords: 'mlžítka zahrada, venkovní mlžení, zahradní mlžná skulptura, ochlazení terasy, outdoor mlžítka',
    canonicalPath: '/kategorie/outdoor-zahrady',
  },
  art: {
    title: 'Zakázkové mlžné instalace a designové sochy',
    description: 'Zakázkové mlžné instalace a designové skulptury pro galerie, výstavy a veřejný prostor. Návrh propojuje architekturu, vodní mlhu a charakter místa.',
    keywords: 'mlžné umělecké instalace, art instalace mlha, site-specific mlžítko, designová skulptura mlha',
    canonicalPath: '/kategorie/art-instalace',
  },
  deti: {
    title: 'Mlhoviště pro školy, školky a dětská hřiště',
    description: 'Mlhoviště a mlžítka pro mateřské školy, základní školy a dětská hřiště. Návrh mlžicí zóny a vhodného provozu podle věku uživatelů a charakteru areálu.',
    keywords: 'mlhoviště škola, mlžítka školka, dětské hřiště mlžení, bezpečné mlžení dětí',
    canonicalPath: '/kategorie/skoly-skolky-deti',
  },
};