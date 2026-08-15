/**
 * SEO utility — sets <title>, <meta name="description">, <meta name="keywords">,
 * Open Graph and Twitter Card tags dynamically for each page/product.
 */

const SITE_NAME = 'Mlžidla.cz - MLŽIDLA® / Mlžítka HolmTec';
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

function setCanonical(path) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', 'canonical'); document.head.appendChild(el); }
  el.setAttribute('href', BASE_URL + path);
}

function setJsonLd(data) {
  let el = document.getElementById('json-ld-seo');
  if (!el) { el = document.createElement('script'); el.id = 'json-ld-seo'; el.type = 'application/ld+json'; document.head.appendChild(el); }
  el.textContent = JSON.stringify(data);
}

// Generuje automatické drobečkové schéma pro Google z aktuální cesty
function generateBreadcrumbsJsonLd(path, title) {
  if (!path || path === '/') return null;
  const segments = path.split('/').filter(Boolean);
  const items = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Hlavní stránka",
      "item": BASE_URL
    }
  ];
  
  if (segments.length === 1) {
    items.push({
      "@type": "ListItem",
      "position": 2,
      "name": title || segments[0],
      "item": BASE_URL + path
    });
  }
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items
  };
}

export function setSEO({ title, description, keywords, image, canonicalPath, type = 'website', jsonLd, geo, robots }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const img = image || DEFAULT_IMAGE;

  document.title = fullTitle;
  setMeta('description', description);
  if (keywords) setMeta('keywords', keywords);
  setMeta('robots', robots || 'index, follow');

  // Open Graph
  setOg('og:title', fullTitle);
  setOg('og:description', description);
  setOg('og:image', img);
  setOg('og:type', type);
  setOg('og:site_name', SITE_NAME);
  setOg('og:locale', 'cs_CZ');
  if (canonicalPath) setOg('og:url', BASE_URL + canonicalPath);

  // Twitter
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', fullTitle);
  setMeta('twitter:description', description);
  setMeta('twitter:image', img);

  if (canonicalPath) setCanonical(canonicalPath);
  
  // Kombinace vlastních a automatických JSON-LD strukturovaných dat.
  // Pokud stránka dodá vlastní @graph, zachováme ho a doplníme BreadcrumbList.
  const breadcrumbs = generateBreadcrumbsJsonLd(canonicalPath, title);
  if (jsonLd && breadcrumbs) {
    const graph = jsonLd['@graph']
      ? [...jsonLd['@graph'], breadcrumbs]
      : [jsonLd, breadcrumbs];
    setJsonLd({ '@context': 'https://schema.org', '@graph': graph });
  } else if (jsonLd) {
    setJsonLd(jsonLd);
  } else if (breadcrumbs) {
    setJsonLd(breadcrumbs);
  }

  // Místní SEO značky
  if (geo) {
    setMeta('geo.placename', geo.placename);
    setMeta('geo.region', geo.region || 'CZ');
  }
}

export function getProductSEO(product, reviewStats) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short_description || product.description,
    image: [product.image_url, ...(product.gallery_urls || [])].filter(Boolean),
    brand: { '@type': 'Brand', name: 'HolmTec' }
  };

  if (product.price_from) {
    jsonLd.offers = {
      '@type': 'Offer',
      priceCurrency: 'CZK',
      price: product.price_from,
      availability: 'https://schema.org/InStock',
      url: `${BASE_URL}/produkt/${product.slug}`
    };
  }

  if (reviewStats?.count && reviewStats?.average) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: reviewStats.average,
      reviewCount: reviewStats.count
    };
  }

  return {
    title: product.name,
    description: product.short_description || product.description,
    image: product.image_url,
    canonicalPath: `/produkt/${product.slug}`,
    type: 'product',
    jsonLd
  };
}

export function getBlogPostSEO(post) {
  return {
    title: post.title,
    description: post.perex,
    image: post.image_url,
    canonicalPath: `/blog/${post.slug || post.id}`,
    type: 'article',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.perex,
      image: post.image_url,
      datePublished: post.published_date,
      author: { '@type': 'Organization', name: 'HolmTec' }
    }
  };
}

export function getReferenceSEO(project) {
  return {
    title: project.name,
    description: project.description,
    image: project.image_url,
    canonicalPath: `/reference/${project.id}`,
    type: 'article'
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
  mlhoviste: {
    title: 'Mlhoviště pro dětská hřiště, terasy a veřejné prostory',
    description: 'Mlžné systémy - Mlhoviště START, PARK a ARENA pro hřiště, restaurační terasy a prostranství. Ochlazení až o 10 °C, bezpečné pro děti, nerezová ocel.',
    keywords: 'mlhoviště, mlžná hřiště, mlžné systémy, terasy, vodní mlha pro děti, ochlazení prostranství',
    canonicalPath: '/mlhoviste',
  },
  jakToFunguje: {
    title: 'Jak funguje mlžení? Princip evaporace a technologie HolmTec',
    description: 'Vysvětlujeme fyziku vysokotlakého mlžení: kapičky 10–50 μm se odpařují ve vzduchu a absorbují teplo. Ochlazení až o 10 °C bez tvoření mokrých louží.',
    keywords: 'jak funguje mlžení, evaporace mlha, vysokotlaká atomizace, ochlazení evaporací, fyzika mlžení, mlžná technika',
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
    title: 'Mlžítka pro města a obce — Ochlazení veřejných prostranství',
    description: 'Certifikovaná mlžítka, mlžné brány a mlhoviště pro moderní města a obce. Boj proti městským tepelným ostrovům, dotační poradenství, nerezová konstrukce.',
    keywords: 'mlžítka pro obce, městské ochlazování, urbanismus, adaptace na sucho, ochlazení náměstí, tepelné ostrovy',
    canonicalPath: '/kategorie/mesta-obce',
  },
  parkyHriste: {
    title: 'Mlhoviště pro parky a dětská hřiště — Bezpečné mlžení bez chemie',
    description: 'Bezpečné mlžné systémy pro parky a hřiště. Používáme výhradně potravinářskou nerezovou ocel AISI 316L, provoz je hygienicky čistý a bezpečný pro nejmenší děti.',
    keywords: 'mlhoviště dětské hřiště, parkové mlžení, herní vodní prvky, bezpečné ochlazení dětí',
    canonicalPath: '/kategorie/parky-hriste',
  },
  koupaliste: {
    title: 'Mlhoviště pro koupaliště a aquaparky — Komfortní chladicí zóny',
    description: 'Designové mlžné systémy LINEA CE70 a Y-ARMIST pro areály koupališť, aquaparků a bazénů. Zvyšují atraktivitu areálu a nabízejí rychlé osvěžení bez přehřívání.',
    keywords: 'mlhoviště koupaliště, mlžení aquapark, chladicí zóna bazén, vysokotlaké trysky koupaliště',
    canonicalPath: '/kategorie/koupaliste',
  },
  architekti: {
    title: 'Pro architekty a projektanty — 3D modely, DWG a technická dokumentace',
    description: 'Kompletní podklady pro architektonické ateliéry a projektanty. Ke stažení: 2D/3D DWG výkresy, BIM modely, texty do zadávacích dokumentací a konzultace stavební připravenosti.',
    keywords: 'BIM modely mlžítka, DWG výkresy mlžná brána, podklady pro architekty, technická specifikace HolmTec',
    canonicalPath: '/kategorie/architekti',
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
    title: 'Mlžítka pro zahrady a venkovní prostory — Outdoor kolekce',
    description: 'Designová mlžítka pro zahrady, terasy a venkovní posezení. Nerezové skulptury HolmTec, které osvěží soukromý outdoor prostor bez nutnosti klimatizace.',
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
    description: 'Bezpečná mlhoviště pro základní školy, mateřské školky a dětská hřiště. Potravinářská nerez, jemná mlha bez tlakového rizika, certifikováno pro dětské prostory.',
    keywords: 'mlhoviště škola, mlžítka školka, dětské hřiště mlžení, bezpečné mlžení dětí',
    canonicalPath: '/kategorie/skoly-skolky-deti',
  },
};