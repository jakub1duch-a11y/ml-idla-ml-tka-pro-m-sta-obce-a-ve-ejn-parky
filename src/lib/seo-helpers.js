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
    logo: 'https://mlzidla.cz/logo.png',
    description: 'Mlžítka a mlžné brány z nerezové oceli pro ochlazení veřejných prostorů',
    sameAs: [
      'https://www.facebook.com/mlzidla',
      'https://www.instagram.com/mlzidla',
    ],
    address: {
      '@type': 'PostalAddress',
      'addressCountry': 'CZ',
      'addressLocality': 'České Budějovice',
      'streetAddress': 'Mlžidla 123',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      'contactType': 'Customer Service',
      'email': 'info@mlzidla.cz',
      'telephone': '+420XXX XXX XXX',
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
    offers: {
      '@type': 'Offer',
      url: product.url,
      priceCurrency: 'CZK',
      price: product.price,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Mlžidla.cz',
      },
    },
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
    image: 'https://mlzidla.cz/logo.png',
    description: 'Profesionální mlžítka a mlžné brány pro města a obce',
    url: 'https://mlzidla.cz',
    telephone: '+420XXX XXX XXX',
    email: 'info@mlzidla.cz',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Mlžidla 123',
      addressLocality: 'České Budějovice',
      addressRegion: 'South Bohemian',
      postalCode: '370XX',
      addressCountry: 'CZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '48.975',
      longitude: '14.475',
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
