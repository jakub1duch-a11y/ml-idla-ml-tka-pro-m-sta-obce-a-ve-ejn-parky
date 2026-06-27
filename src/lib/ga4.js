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

// Expose on window for external use
if (typeof window !== 'undefined') {
  window.trackGateInterest = trackGateInterest;
  window.trackMistSculptureInterest = trackMistSculptureInterest;
  window.trackCooperationFormSubmit = trackCooperationFormSubmit;
  window.trackProductSectionEngagement = trackProductSectionEngagement;
}