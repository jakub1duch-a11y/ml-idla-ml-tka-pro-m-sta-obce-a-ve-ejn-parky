import { useEffect } from 'react';

/**
 * Hook for managing dynamic meta tags and structured data
 * Usage:
 * useHeadMetaTags({
 *   title: 'Page Title',
 *   description: 'Page description',
 *   ogImage: 'https://example.com/image.png',
 *   structuredData: { ... }
 * })
 */
export function useHeadMetaTags({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  ogUrl,
  canonical,
  robots = 'index, follow',
  structuredData,
  lang = 'cs',
}) {
  useEffect(() => {
    // Set title
    if (title) {
      document.title = title;
      updateMetaTag('og:title', title);
      updateMetaTag('twitter:title', title);
    }

    // Set description
    if (description) {
      updateMetaTag('description', description, 'name');
      updateMetaTag('og:description', description);
      updateMetaTag('twitter:description', description);
    }

    // Set keywords
    if (keywords) {
      updateMetaTag('keywords', keywords, 'name');
    }

    // Set og:image
    if (ogImage) {
      updateMetaTag('og:image', ogImage);
      updateMetaTag('twitter:image', ogImage);
    }

    // Set og:type
    updateMetaTag('og:type', ogType);

    // Set og:url
    if (ogUrl || typeof window !== 'undefined') {
      updateMetaTag('og:url', ogUrl || window.location.href);
    }

    // Set robots
    updateMetaTag('robots', robots, 'name');

    // Set language
    document.documentElement.lang = lang;

    // Set canonical URL
    if (canonical || typeof window !== 'undefined') {
      const canonicalUrl = canonical || window.location.href;
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = canonicalUrl;
    }

    // Set structured data (JSON-LD)
    if (structuredData) {
      let scriptTag = document.querySelector('script[type="application/ld+json"]');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    }
  }, [title, description, keywords, ogImage, ogType, ogUrl, canonical, robots, structuredData, lang]);
}

function updateMetaTag(name, content, attribute = 'property') {
  let tag = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

export default useHeadMetaTags;
