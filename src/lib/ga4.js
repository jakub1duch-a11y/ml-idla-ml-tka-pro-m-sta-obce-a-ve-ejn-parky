// GA4 + Google Ads Conversion Event Helpers – HolmTec

// ⚠️ ZDE DOPLŇTE SVÉ ÚDAJE Z GOOGLE ADS (najdete v Google Ads -> Konverze)
const GOOGLE_ADS_ID = 'AW-18276263329'; // Nahraďte vaším AW-XXXXX ID účtu
const GOOGLE_ADS_CONVERSION_LABEL = 'AbC-D_efGhIjKlMnOp'; // Nahraďte vaším štítkem konverze

function safeGtag(...args) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
}

// Pomocná funkce pro bezpečné odeslání konverze přímo do Google Ads
function sendToGoogleAds(value = 1000) {
  if (GOOGLE_ADS_ID !== 'AW-123456789') {
    safeGtag('event', 'conversion', {
      'send_to': `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`,
      'value': value,
      'currency': 'CZK'
    });
  }
}
// Zájem o produkty – opraveno podle oficiální terminologie
export function trackGateInterest(productName) {
  safeGtag('event', 'product_interest', {
    product_type: 'brána', // např. GATE70
    product_name: productName || 'obecná brána',
    value: 1,
  });
}

export function trackMistSculptureInterest(productName) {
  safeGtag('event', 'product_interest', {
    product_type: 'mlžná plastika', // 🚀 Opraveno na správný název sortimentu
    product_name: productName || 'obecná plastika',
    value: 1,
  });
}


// Konverzní formuláře (GA4 'generate_lead' + Přímý zásek do Google Ads)
export function trackCooperationFormSubmit() {
  safeGtag('event', 'generate_lead', {
    lead_type: 'spolupráce',
    value: 1,
  });
  sendToGoogleAds(500); // Nižší hodnota pro lead ze spolupráce
}

export function trackContactFormSubmit(formType, productName) {
  safeGtag('event', 'generate_lead', {
    lead_type: formType || 'kontakt',
    product_name: productName || 'nezadáno',
    value: 1,
  });
  sendToGoogleAds(1000);
}

export function trackInquirySubmitted(requestType, productInterest) {
  safeGtag('event', 'generate_lead', {
    lead_type: requestType || 'poptávka',
    product_name: productInterest || 'bez produktu',
    value: 1,
  });
  sendToGoogleAds(2000); // Poptávka má pro byznys nejvyšší hodnotu
}

export function trackRentalInquiry(productName, eventType) {
  safeGtag('event', 'generate_lead', {
    lead_type: 'pronájem GO',
    product_name: productName || 'nezvoleno',
    event_type: eventType || 'event',
    value: 1,
  });
  sendToGoogleAds(1500);
}

// Prohlížení a interakce (Čisté GA4 bez UA balastu)
export function trackProductSectionEngagement(sectionName) {
  safeGtag('event', 'product_section_view', {
    section_name: sectionName,
  });
}

export function trackProductView(productName, productSlug, category) {
  safeGtag('event', 'view_item', {
    product_name: productName,
    product_slug: productSlug,
    product_category: category || 'neznámá',
  });
}

export function trackProductClick(productName, productSlug, section) {
  safeGtag('event', 'select_item', {
    product_name: productName,
    product_slug: productSlug,
    section_name: section || 'katalog',
  });
}

export function trackBlogPostView(postTitle, postSlug, category) {
  safeGtag('event', 'blog_post_view', {
    content_title: postTitle,
    content_slug: postSlug,
    content_category: category || 'blog',
  });
}

export function trackReferenceView(projectName, location, category) {
  safeGtag('event', 'reference_view', {
    project_name: projectName,
    project_location: location,
    project_category: category || 'realizace',
  });
}

export function trackHeroInteraction(slideName, ctaClicked) {
  safeGtag('event', 'hero_interaction', {
    slide_name: slideName,
    cta_clicked: ctaClicked || false,
  });
}

export function trackCategoryFilter(categoryName) {
  safeGtag('event', 'category_filter', {
    category_name: categoryName,
  });
}

export function trackQuickInquiryClick(productName, location) {
  safeGtag('event', 'quick_inquiry_click', {
    product_name: productName,
    location_source: location || 'neznámé umístění',
  });
}

// Spustí se na /dekujeme – Finální konverze (GA4 + Google Ads jistota)
export function trackThankYouPageView(source) {
  safeGtag('event', 'generate_lead', {
    currency: 'CZK',
    value: 1000,
    lead_source: source || 'kontakt',
  });
  sendToGoogleAds(1000); // Pojistka přímého měření na děkovné stránce
}

// Exponování do window objektu pro externí použití
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
  window.trackHeroInteraction = heroInteraction => trackHeroInteraction;
  window.trackCategoryFilter = trackCategoryFilter;
  window.trackInquirySubmitted = trackInquirySubmitted;
  window.trackRentalInquiry = trackRentalInquiry;
  window.trackQuickInquiryClick = trackQuickInquiryClick;
  window.trackThankYouPageView = trackThankYouPageView;
}
