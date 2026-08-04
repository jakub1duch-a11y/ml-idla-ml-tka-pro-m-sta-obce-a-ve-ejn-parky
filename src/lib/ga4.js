// ⚠️ ZDE NAHRAĎTE 'AbC-D...' SKUTEČNÝM ŠTÍTKEM Z GOOGLE ADS
const GOOGLE_ADS_ID = 'AW-18276263329';
const GOOGLE_ADS_CONVERSION_LABEL = 'AbC-D_8356326891';

function safeGtag(...args) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
}

function sendToGoogleAds(value = 1000) {
  safeGtag('event', 'conversion', {
    send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`,
    value,
    currency: 'CZK'
  });
}

export function trackCooperationFormSubmit() {
  safeGtag('event', 'generate_lead', { lead_type: 'spolupráce', value: 1 });
  sendToGoogleAds(500);
}

export function trackContactFormSubmit(formType, productName) {
  safeGtag('event', 'generate_lead', { lead_type: formType || 'kontakt', product_name: productName || 'nezadáno', value: 1 });
  sendToGoogleAds(1000);
}

export function trackInquirySubmitted(requestType, productInterest) {
  safeGtag('event', 'generate_lead', { lead_type: requestType || 'poptávka', product_name: productInterest || 'bez produktu', value: 1 });
  sendToGoogleAds(2000);
}

export function trackRentalInquiry(productName, eventType) {
  safeGtag('event', 'generate_lead', { lead_type: 'pronájem GO', product_name: productName || 'nezvoleno', event_type: eventType || 'event', value: 1 });
  sendToGoogleAds(1500);
}

export function trackThankYouPageView(source) {
  safeGtag('event', 'generate_lead', { currency: 'CZK', value: 1000, lead_source: source || 'kontakt' });
  sendToGoogleAds(1000);
}

export function trackGateInterest(productName) {
  safeGtag('event', 'product_interest', { product_type: 'brána', product_name: productName || 'obecná brána' });
}

export function trackMistSculptureInterest(productName) {
  safeGtag('event', 'product_interest', { product_type: 'mlžná plastika', product_name: productName || 'obecná plastika' });
}

export function trackProductSectionEngagement(sectionName) {
  safeGtag('event', 'product_section_view', { section_name: sectionName });
}

export function trackProductView(productName, productSlug, category) {
  safeGtag('event', 'view_item', { product_name: productName, product_slug: productSlug, product_category: category || 'neznámá' });
}

export function trackProductClick(productName, productSlug, section) {
  safeGtag('event', 'select_item', { product_name: productName, product_slug: productSlug, section_name: section || 'katalog' });
}

export function trackQuickInquiryClick(productName, section) {
  safeGtag('event', 'quick_inquiry_click', {
    product_name: productName || 'bez produktu',
    section_name: section || 'produkt'
  });
}

export function trackBlogPostView(title, slug, category) {
  safeGtag('event', 'blog_post_view', {
    post_title: title,
    post_slug: slug,
    post_category: category || 'nezadaná'
  });
}

export function trackReferenceView(name, location, category) {
  safeGtag('event', 'reference_view', {
    reference_name: name,
    reference_location: location || 'nezadaná',
    reference_category: category || 'nezadaná'
  });
}

if (typeof window !== 'undefined') {
  window.trackGateInterest = trackGateInterest;
  window.trackMistSculptureInterest = trackMistSculptureInterest;
  window.trackCooperationFormSubmit = trackCooperationFormSubmit;
  window.trackProductSectionEngagement = trackProductSectionEngagement;
  window.trackProductView = trackProductView;
  window.trackProductClick = trackProductClick;
  window.trackQuickInquiryClick = trackQuickInquiryClick;
  window.trackBlogPostView = trackBlogPostView;
  window.trackReferenceView = trackReferenceView;
  window.trackContactFormSubmit = trackContactFormSubmit;
  window.trackInquirySubmitted = trackInquirySubmitted;
  window.trackRentalInquiry = trackRentalInquiry;
  window.trackThankYouPageView = trackThankYouPageView;
}