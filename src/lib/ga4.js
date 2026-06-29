// GA4 Conversion Event Helpers – HolmTec

function safeGtag(...args) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
}

export function trackGateInterest(productName) {
  safeGtag('event', 'gate_interest', {
    event_category: 'product_interest',
    event_label: productName || 'brána',
    value: 1,
  });
}

export function trackMistSculptureInterest(productName) {
  safeGtag('event', 'mist_sculpture_interest', {
    event_category: 'product_interest',
    event_label: productName || 'mlžná socha',
    value: 1,
  });
}

export function trackCooperationFormSubmit() {
  safeGtag('event', 'cooperation_form_submit', {
    event_category: 'conversion',
    event_label: 'spolupráce',
    value: 1,
    send_to: 'G-0J3NKLWM2Q',
  });
  safeGtag('event', 'generate_lead', {
    currency: 'CZK',
    value: 1000,
  });
}

export function trackProductSectionEngagement(sectionName) {
  safeGtag('event', 'product_section_view', {
    event_category: 'engagement',
    event_label: sectionName,
    value: 1,
  });
}

export function trackProductView(productName, productSlug, category) {
  safeGtag('event', 'product_view', {
    event_category: 'product_engagement',
    event_label: productName,
    product_name: productName,
    product_slug: productSlug,
    product_category: category || 'neznámá',
    value: 1,
  });
}

export function trackProductClick(productName, productSlug, section) {
  safeGtag('event', 'product_click', {
    event_category: 'product_engagement',
    event_label: productName,
    product_name: productName,
    product_slug: productSlug,
    section: section || 'katalog',
    value: 1,
  });
}

export function trackBlogPostView(postTitle, postSlug, category) {
  safeGtag('event', 'blog_post_view', {
    event_category: 'content_engagement',
    event_label: postTitle,
    content_title: postTitle,
    content_slug: postSlug,
    content_category: category || 'blog',
    value: 1,
  });
}

export function trackReferenceView(projectName, location, category) {
  safeGtag('event', 'reference_view', {
    event_category: 'portfolio_engagement',
    event_label: projectName,
    project_name: projectName,
    project_location: location,
    project_category: category || 'realizace',
    value: 1,
  });
}

export function trackContactFormSubmit(formType, productName) {
  safeGtag('event', 'contact_form_submit', {
    event_category: 'conversion',
    event_label: formType || 'kontakt',
    form_type: formType,
    product_name: productName,
    value: 1,
    send_to: 'G-0J3NKLWM2Q',
  });
}

export function trackHeroInteraction(slideName, ctaClicked) {
  safeGtag('event', 'hero_interaction', {
    event_category: 'engagement',
    event_label: slideName,
    slide_name: slideName,
    cta_clicked: ctaClicked || false,
    value: 1,
  });
}

export function trackCategoryFilter(categoryName) {
  safeGtag('event', 'category_filter', {
    event_category: 'navigation',
    event_label: categoryName,
    category: categoryName,
    value: 1,
  });
}

export function trackInquirySubmitted(requestType, productInterest) {
  safeGtag('event', 'inquiry_submitted', {
    event_category: 'conversion',
    event_label: requestType || 'poptávka',
    request_type: requestType,
    product_interest: productInterest || 'bez produktu',
    value: 1,
    send_to: 'G-0J3NKLWM2Q',
  });
  safeGtag('event', 'generate_lead', {
    currency: 'CZK',
    value: 1000,
  });
}

// Expose on window for external use
if (typeof window !== 'undefined') {
  window.trackGateInterest = trackGateInterest;
  window.trackMistSculptureInterest = trackMistSculptureInterest;
  window.trackCooperationFormSubmit = trackCooperationFormSubmit;
  window.trackProductSectionEngagement = trackProductSectionEngagement;
  window.trackProductView = trackProductView;
  window.trackProductClick = trackProductClick;
  window.trackBlogPostView = trackBlogPostView;
  window.trackReferenceView = trackReferenceView;
  window.trackContactFormSubmit = trackContactFormSubmit;
  window.trackHeroInteraction = trackHeroInteraction;
  window.trackCategoryFilter = trackCategoryFilter;
  window.trackInquirySubmitted = trackInquirySubmitted;
}