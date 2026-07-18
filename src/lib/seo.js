/**
 * SEO utility — sets <title>, <meta name="description">, <meta name="keywords">,
 * Open Graph and Twitter Card tags dynamically for each page/product.
 */

const SITE_NAME = 'Mlžidla.cz - Mlžítka Holmtec';
const BASE_URL = 'https://mlzidla.cz';
const DEFAULT_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/84af07a7b_0d4b710a-7605-463b-835a-71e89991f12d.jpg';

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
  if (jsonLd) setJsonLd(jsonLd);

  // Local/geo SEO meta tags (used on reference/project pages with a known location)
  if (geo) {
    setMeta('geo.placename', geo.placename);
    setMeta('geo.region', geo.region || 'CZ');
  }
}

// ─── Per-page SEO presets ────────────────────────────────────────────────────

export const SEO_PAGES = {
  home: {
    title: 'Mlžítka a mlžné brány',
    description: 'Zakázkové mlžítka, mlžné brány a chladicí systémy HolmTec z nerezové oceli AISI 316L. Ochlazení veřejných prostorů, parků, náměstí, festivalů a zahrad.',
    keywords: 'mlžné, sochy, mlžítka, mlzitka, mlžné, brány, HolmTec, mlzidla, nerezové sochy, mlžení',
    canonicalPath: '/',
  },
  kolekce: {
    title: 'Celý katalog 2026 - Mlžítka a mlžné brány',
    description: 'Kolekce 2026 - Mlžítka a mlžné brány HolmTec: OSTREV, MRAK, LINEA, Y-ARMIST, BENDY 60, GATE70 a další. Zakázková výroba z nerezové oceli, navržená pro každý veřejný prostor.',
    keywords: 'mlžítka, mlžné brány, katalog mlžných soch, mlžné skulptury, mlžné systémy katalog, OSTEV, MRAK, LINEA, Y-ARMIST, BENDY 60, GATE70, mlžná brána',
    canonicalPath: '/mlzidla-mlzitka',
  },
  mlhoviste: {
    title: 'Mlhoviště pro mlžná dětská hřiště, terasy a veřejné prostory',
    description: 'Mlžné systémy - Mlhoviště START, PARK a ARENA pro dětská hřiště, restaurační terasy a veřejné prostory. Ochlazení až −9 °C, bezpečné pro děti, potravinářská nerezová ocel.',
    keywords: 'mlhoviště, mlžná, hřiště, mlžné, systémy, terasy',
    canonicalPath: '/mlhoviste',
  },
  jakToFunguje: {
    title: 'Jak funguje mlžení? Princip evaporace a technologie mlžných soch',
    description: 'Vysvětlujeme fyziku mlžení: kapičky 10–50 μm se odpařují ve vzduchu a absorbují teplo. Ochlazení až −9 °C bez mokrých ploch. Zjistěte, jak mlžné sochy HolmTec fungují.',
    keywords: 'jak funguje mlžení, evaporace mlha, mlžné trysky princip, ochlazení evaporací, fyzika mlžení, mlžné sochy jak to funguje',
    canonicalPath: '/jak-to-funguje',
  },
  oNas: {
    title: 'O nás — HolmTec, výrobce mlžných skulptur z Trutnova',
    description: 'HolmTec je česká firma s kořeny v automobilovém průmyslu. Vyrábíme zakázkové mlžné skulptury a chladicí systémy z nerezové oceli AISI 316L pro veřejné prostory, parky a eventy.',
    keywords: 'HolmTec, výrobce mlžných soch, mlzidla.cz, mlžné skulptury výroba, zakázková výroba Trutnov, nerezové mlžné sochy',
    canonicalPath: '/o-nas',
  },
  reference: {
    title: 'Reference — Realizované projekty mlžných soch a mlhovisť',
    description: 'Více než 120 realizací mlžných soch a chladicích systémů po celé ČR a zahraničí. Prohlédněte si referenční galerii projektů HolmTec pro města, parky, festivaly a soukromé investory.',
    keywords: 'reference mlžné sochy, realizace mlhoviště, projekty mlžení veřejný prostor, instalace mlžných skulptur',
    canonicalPath: '/reference',
  },
  blog: {
    title: 'Blog — Mlžné technologie, inspirace a realizace | HolmTec',
    description: 'Technologie, inspirace a novinky ze světa mlžných soch a chladicích systémů. Články o evaporaci, srovnání s klimatizací, realizacích a inovacích HolmTec.',
    keywords: 'blog mlžení, mlžné sochy novinky, evaporace veřejný prostor, mlhoviště inspirace, mlžné skulptury technologie',
    canonicalPath: '/blog',
  },
  poptavka: {
    title: 'Nezávazná poptávka — Mlžné sochy a chladicí systémy na míru',
    description: 'Poptejte mlžnou skulpturu nebo chladicí systém na míru. Odpovídáme do 24 hodin, konzultace zdarma, 3D vizualizace do 48 h. HolmTec — mlzidla.cz.',
    keywords: 'poptávka mlžné sochy, nezávazná poptávka mlhoviště, kontakt HolmTec, mlžné skulptury cena',
    canonicalPath: '/poptavka',
  },
  kontakt: {
    title: 'Kontakt — HolmTec mlžné sochy a mlhoviště',
    description: 'Kontaktujte HolmTec: Trutnov, +420 774 700 390, obchod1@holmtec.cz. Cena produktu, projektová spolupráce, 3D vizualizace a technická dokumentace.',
    keywords: 'kontakt HolmTec, mlžné sochy kontakt, mlhoviště poptávka, HolmTec telefon email',
    canonicalPath: '/kontakt',
  },
  podpora: {
    title: 'Podpora & FAQ — Časté dotazy o mlžných systémech HolmTec',
    description: 'Odpovědi na nejčastější otázky o mlžných sochách a mlhovištích: instalace, údržba, spotřeba vody, provoz v zimě, certifikáty a záruky.',
    keywords: 'FAQ mlžné sochy, dotazy mlhoviště, údržba mlžný systém, instalace mlžné sochy, záruky mlhoviště',
    canonicalPath: '/podpora',
  },
  mestOobce: {
    title: 'Mlžítka pro města a obce — Ochlazení veřejných prostranství',
    description: 'Mlžítka, mlžné sochy a mlhoviště pro města a obce. Ochlazení náměstí, parků a zastávek. Dotační programy, certifikované materiály, zakázková výroba HolmTec.',
    keywords: 'mlžítka, mlžné sochy, pro města, mlhoviště obce, ochlazení náměstí,',
    canonicalPath: '/kategorie/mesta-obce',
  },
  parkyHriste: {
    title: 'Mlhoviště pro parky a dětská hřiště — Bezpečné mlžení pro děti',
    description: 'Mlžné systémy pro parky a dětská hřiště. Bezpečné pro děti, potravinářská nerez AISI 316L, bez chemie. Ochlazení až −9 °C. HolmTec mlzidla.',
    keywords: 'mlhoviště hřiště, mlžení dětské hřiště, mlžný systém park, mlžné sochy pro parky, ochlazení hřiště',
    canonicalPath: '/kategorie/parky-hriste',
  },
  koupaliste: {
    title: 'Mlhoviště pro koupaliště a aquaparky — Chladicí zóny u vody',
    description: 'Mlžné systémy LINEA CE70 a Y-ARMIST pro koupaliště, aquaparky a bazény. Chladicí zóny pro návštěvníky, elegantní design, odolné materiály.',
    keywords: 'mlhoviště koupaliště, mlžení aquapark, chladicí systém bazén, mlžné trysky koupaliště, ochlazení u vody',
    canonicalPath: '/kategorie/koupaliste',
  },
  architekti: {
    title: 'Mlžné skulptury pro architekty a projektanty — 3D modely a dokumentace',
    description: 'Spolupráce s architekty: 3D modely, technické výkresy, materiálové certifikáty, zakázková výroba. Mlžné skulptury HolmTec jako dominanta moderního veřejného prostoru.',
    keywords: 'mlžné sochy pro architekty, 3D model mlžení, technická dokumentace mlžný systém, projektová spolupráce mlhoviště',
    canonicalPath: '/kategorie/architekti',
  },
  komercni: {
    title: 'Mlhování pro obchodní centra a komerční prostory',
    description: 'Mlžné instalace pro obchodní centra, hotely, showroomy a komerční prostory. Zvýšení komfortu zákazníků, elegantní design, individuální návrh.',
    keywords: 'mlhování obchodní centrum, mlžení hotel, mlžná instalace komerční, mlžné sochy pro firmy',
    canonicalPath: '/kategorie/komercni',
  },
  eventy: {
    title: 'Mlžné efekty pro eventy, festivaly a pronájem',
    description: 'Pronájem mlžných soch a instalací na festivaly, eventy a firemní akce. Mlžné brány, portály, mobilní mlhoviště. Rychlá montáž, nezaměnitelný vizuální efekt.',
    keywords: 'mlžení festival, mlžné efekty event, pronájem mlžné sochy, mlžná brána festival, mobilní mlhoviště event',
    canonicalPath: '/kategorie/eventy',
  },
  outdoor: {
    title: 'Mlžné prvky pro zahrady, terasy a rezidenční projekty',
    description: 'Mlžné skulptury pro soukromé zahrady, terasy a rezidenční projekty. Elegantní chlazení venkovních prostorů z nerezové oceli AISI 316L.',
    keywords: 'mlžení zahrada, mlžný prvek terasa, mlhoviště rezidenční projekt, mlžná socha zahrada, ochlazení terasy',
    canonicalPath: '/kategorie/outdoor-zahrady',
  },
  art: {
    title: 'Art instalace na míru — mlžné skulptury jako umělecké dílo',
    description: 'Zakázkové umělecké mlžné instalace pro galerie, veřejný prostor a site-specific projekty. Mlha jako médium — návrh, výroba a realizace HolmTec.',
    keywords: 'art instalace mlžení, umělecká mlžná socha, site-specific mlha, mlžné dílo na míru, galerie mlžná instalace',
    canonicalPath: '/kategorie/art-instalace',
  },
  deti: {
    title: 'Mlžné systémy pro školy, školky a dětská hřiště',
    description: 'Bezpečné mlžné systémy pro školy, mateřské školky a dětská hřiště. Potravinářská nerez, bez chemie, ochlazení až o 9 °C.',
    keywords: 'mlžení škola, mlhoviště školka, mlžný systém dětské hřiště, bezpečné mlžení pro děti, ochlazení školní dvůr',
    canonicalPath: '/kategorie/skoly-skolky-deti',
  },
};

// ─── Dynamic SEO for Product pages ──────────────────────────────────────────

export function getProductSEO(product, reviewStats) {
  if (!product) return {};
  const title = `${product.name} — Nízkotlaké mlžítko 200–800 kPa`;
  const description = product.short_description
    ? `${product.name}: ${product.short_description} Nízkotlaký mlžící systém 200–800 kPa, kotvení zemním vrutem, rychlá instalace do 30 minut. ${product.material ? `Materiál: ${product.material}.` : ''} Doprava zdarma, cena na vyžádání.`
    : `Nízkotlaké mlžítko ${product.name} — provoz 200–800 kPa bez čerpadel, kotvení zemním vrutem, rychlá instalace do 30 minut. Doprava zdarma, cena na vyžádání.`;
  const keywords = `${product.name}, nízkotlaký mlžící systém 200–800 kPa, kotvení zemním vrutem, rychlá instalace do 30 minut, mlžný systém ${product.name}, ${product.material || 'nerezová ocel'}, HolmTec ${product.name}`;

  const sku = `HT-${(product.slug || product.name).toUpperCase().replace(/[^A-Z0-9]+/g, '-')}`;
  const images = [product.image_url, ...(product.gallery_urls || [])].filter(Boolean);

  const hasPrice = typeof product.price_from === 'number' && product.price_from > 0;
  const priceValue = hasPrice ? String(product.price_from) : '1';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: images.length ? images : [DEFAULT_IMAGE],
    description: product.short_description || description,
    sku,
    mpn: sku,
    brand: { '@type': 'Brand', name: 'HolmTec' },
    manufacturer: { '@type': 'Organization', name: 'HolmTec s.r.o.', url: BASE_URL },
    material: product.material || 'Nerezová ocel AISI 316L',
    offers: {
      '@type': 'Offer',
      price: priceValue,
      priceCurrency: 'CZK',
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
      itemCondition: 'https://schema.org/NewCondition',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: priceValue,
        priceCurrency: 'CZK',
        valueAddedTaxIncluded: true,
        name: hasPrice ? 'Cena od, finální cena dle projektové specifikace' : 'Cena na vyžádání dle projektové specifikace',
      },
      availability: 'https://schema.org/InStock',
      url: `${BASE_URL}/produkt/${product.slug}`,
      seller: { '@type': 'Organization', name: 'HolmTec s.r.o.' },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 14,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
        applicableCountry: 'CZ',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'CZK' },
        shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'CZ' },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: { '@type': 'QuantitativeValue', minValue: 42, maxValue: 56, unitCode: 'DAY' },
          transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 5, unitCode: 'DAY' },
        },
      },
    },
  };

  if (reviewStats && reviewStats.count > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: reviewStats.average.toFixed(1),
      reviewCount: String(reviewStats.count),
      bestRating: '5',
      worstRating: '1',
    };
  }

  return {
    title,
    description,
    keywords,
    image: product.image_url,
    canonicalPath: `/produkt/${product.slug}`,
    type: 'product',
    jsonLd,
  };
}

// ─── Dynamic SEO for Blog post pages ────────────────────────────────────────

function extractFirstContentImage(html) {
  if (!html) return null;
  const match = html.match(/<img[^>]+src="([^"]+)"/i);
  return match ? match[1] : null;
}

export function getBlogPostSEO(post) {
  if (!post) return {};
  const description = post.perex
    ? post.perex.slice(0, 160)
    : `Přečtěte si článek "${post.title}" na blogu HolmTec — mlzidla.cz.`;
  const previewImage = post.image_url || extractFirstContentImage(post.content) || DEFAULT_IMAGE;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description,
    image: previewImage,
    datePublished: post.published_date || post.created_date,
    dateModified: post.updated_date || post.published_date || post.created_date,
    author: { '@type': 'Organization', name: 'HolmTec s.r.o.' },
    publisher: { '@type': 'Organization', name: 'Mlžidla.cz - Mlžítka HolmTec', url: BASE_URL },
  };

  return {
    title: post.title,
    description,
    keywords: `${post.title}, mlžné sochy blog, ${post.category || ''}, Mlžidla.cz - novinky`,
    image: previewImage,
    canonicalPath: `/blog/${post.slug || post.id}`,
    type: 'article',
    jsonLd,
  };
}

// ─── Dynamic SEO for Reference/Realizace project pages (with local/geo SEO) ─

export function getReferenceSEO(project) {
  if (!project) return {};
  const description = project.description
    ? project.description.slice(0, 160)
    : `Realizace mlžného systému ${project.product_used || ''} — ${project.name}. HolmTec — mlzidla.cz.`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description,
    image: project.image_url || DEFAULT_IMAGE,
    locationCreated: project.location ? { '@type': 'Place', name: project.location } : undefined,
    dateCreated: project.year ? String(project.year) : undefined,
    creator: { '@type': 'Organization', name: 'HolmTec s.r.o.', url: BASE_URL },
  };

  return {
    title: `${project.name}${project.location ? ` — ${project.location}` : ''}`,
    description,
    keywords: `${project.name}, ${project.location || ''}, reference mlžné sochy, ${project.product_used || ''}, realizace HolmTec`,
    image: project.image_url,
    canonicalPath: `/reference/${project.id}`,
    type: 'article',
    jsonLd,
    geo: project.location ? { placename: project.location, region: 'CZ' } : undefined,
  };
}

// ─── Organization JSON-LD (inject on all pages) ─────────────────────────────

export const GOOGLE_MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=HolmTec+s.r.o.+Horn%C3%AD+star%C3%A9+m%C4%9Bsto+698+Trutnov';
export const GOOGLE_MAPS_EMBED_URL = 'https://www.google.com/maps?q=Horn%C3%AD+star%C3%A9+m%C4%9Bsto+698,+Trutnov&output=embed';

export function injectOrgJsonLd() {
  setJsonLd({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'HolmTec s.r.o. — Mlžidla.cz',
    url: BASE_URL,
    logo: DEFAULT_IMAGE,
    image: DEFAULT_IMAGE,
    priceRange: 'na vyžádání',
    telephone: '+420-774-700-390',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+420-774-700-390',
      contactType: 'sales',
      areaServed: 'CZ',
      availableLanguage: 'Czech',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Trutnov',
      streetAddress: 'Horní staré město 698',
      postalCode: '54102',
      addressCountry: 'CZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 50.5605,
      longitude: 15.9122,
    },
    hasMap: GOOGLE_MAPS_URL,
    sameAs: ['https://mlzidla.cz', GOOGLE_MAPS_URL],
  });
}