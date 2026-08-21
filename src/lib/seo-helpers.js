/**
 * SEO Helpers & Utilities
 */

/**
 * Generate structured data for Organization
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Mlžidla.cz',
    url: 'https://mlzidla.cz',
    logo: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/a7bf1f951_favicon.png',
    description: 'Český návrh a výroba nerezových mlžítek, mlžných bran a Smart Cooling řešení pro veřejný i soukromý prostor.',
    sameAs: [
      'https://www.instagram.com/mlzidla/',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CZ',
      addressLocality: 'Trutnov',
      postalCode: '541 02',
      streetAddress: 'Horní Staré Město 698',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'obchod1@holmtec.cz',
      telephone: '+420774700390',
      availableLanguage: ['cs', 'en'],
    },
  };
}

/**
 * Generate structured data for Product
 */
export function getProductSchema(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku || '',
    brand: {
      '@type': 'Brand',
      name: 'Mlžidla.cz',
    },
    ...(product.price ? {
      offers: {
        '@type': 'Offer',
        url: product.url,
        priceCurrency: 'CZK',
        price: product.price,
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'HolmTec',
        },
      },
    } : {}),
    aggregateRating: product.rating && {
      '@type': 'AggregateRating',
      ratingValue: product.rating.value,
      reviewCount: product.rating.count,
    },
  };
}

/**
 * Generate structured data for BreadcrumbList
 */
export function getBreadcrumbSchema(breadcrumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate structured data for LocalBusiness
 */
export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Mlžidla.cz',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/a7bf1f951_favicon.png',
    description: 'Nerezová mlžítka, mlžné brány a Smart Cooling řešení pro města, obce, parky a další venkovní prostory.',
    url: 'https://mlzidla.cz',
    telephone: '+420774700390',
    email: 'obchod1@holmtec.cz',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Horní Staré Město 698',
      addressLocality: 'Trutnov',
      postalCode: '541 02',
      addressCountry: 'CZ',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '17:00',
    },
  };
}

/**
 * Generate URL slug from text
 */
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate canonical URL
 */
export function getCanonicalUrl(path) {
  return `https://mlzidla.cz${path}`;
}

/**
 * Meta tags object for easy management
 */
export function createMetaTags({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  author = 'Mlžidla.cz',
  datePublished,
  dateModified,
}) {
  return {
    title,
    description,
    keywords: Array.isArray(keywords) ? keywords.join(', ') : keywords,
    og: {
      title,
      description,
      image,
      url,
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image,
    },
    article: datePublished && {
      published_time: datePublished,
      modified_time: dateModified,
      author,
    },
  };
}
