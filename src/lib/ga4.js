import { base44 } from '@/api/base44Client';

const GOOGLE_ADS_ID = 'AW-18276263329';
// Google Ads conversion action label must come from the concrete Google Ads conversion action.
// Keep empty until the real label is available — this prevents false/invalid conversion hits.
const GOOGLE_ADS_CONVERSION_LABEL = '';
const CONSENT_STORAGE_KEY = 'cookie_consent';

let initPromise = null;
let measurementId = '';
let listenersInstalled = false;

function defineGtag() {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
  }
}

function safeGtag(...args) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
}

function consentState(value) {
  const accepted = value === 'accepted';
  return {
    analytics_storage: accepted ? 'granted' : 'denied',
    ad_storage: accepted ? 'granted' : 'denied',
    ad_user_data: accepted ? 'granted' : 'denied',
    ad_personalization: accepted ? 'granted' : 'denied',
  };
}

function setDefaultConsent() {
  if (typeof window === 'undefined') return;
  defineGtag();
  let stored = '';
  try { stored = localStorage.getItem(CONSENT_STORAGE_KEY) || ''; } catch (_) {}
  safeGtag('consent', 'default', {
    ...consentState(stored),
    wait_for_update: 500,
  });
}

export function updateGoogleConsent(value) {
  if (typeof window === 'undefined') return;
  defineGtag();
  safeGtag('consent', 'update', consentState(value));
}

function installGlobalListeners() {
  if (typeof window === 'undefined' || listenersInstalled) return;
  listenersInstalled = true;

  window.addEventListener('mlzidla:cookie-consent', (event) => {
    updateGoogleConsent(event?.detail?.value || 'essential');
  });

  const startedForms = new WeakSet();
  document.addEventListener('focusin', (event) => {
    const form = event.target?.closest?.('form');
    if (!form || startedForms.has(form)) return;
    startedForms.add(form);
    void emit('form_start', {
      form_id: form.id || form.getAttribute('name') || 'web_form',
      page_path: window.location.pathname,
    });
  }, { capture: true });

  document.addEventListener('click', (event) => {
    const anchor = event.target?.closest?.('a[href]');
    if (!anchor) return;
    const href = anchor.getAttribute('href') || '';
    if (href.startsWith('tel:')) {
      void emit('phone_click', { contact_type: 'phone', page_path: window.location.pathname });
      return;
    }
    if (href.startsWith('mailto:')) {
      void emit('email_click', { contact_type: 'email', page_path: window.location.pathname });
      return;
    }
    if (href.startsWith('/') || href.startsWith(window.location.origin)) {
      let targetPath = href;
      try { targetPath = new URL(href, window.location.origin).pathname; } catch (_) {}
      const importantTargets = ['/poptavka', '/kontakt', '/kalkulacka', '/ai-vizualizace', '/smart-ovladani', '/ke-stazeni', '/mlzidla-mlzitka', '/pronajem'];
      if (importantTargets.some((target) => targetPath.startsWith(target))) {
        void emit('cta_click', {
          cta_target: targetPath,
          cta_text: (anchor.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80),
          page_path: window.location.pathname,
        });
      }
    }
  }, { capture: true });

  const sentDepths = new Set();
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(() => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const pct = Math.round((window.scrollY / max) * 100);
      [25, 50, 75, 90].forEach((depth) => {
        if (pct >= depth && !sentDepths.has(`${window.location.pathname}:${depth}`)) {
          sentDepths.add(`${window.location.pathname}:${depth}`);
          void emit('scroll_depth', { percent_scrolled: depth, page_path: window.location.pathname });
        }
      });
      scrollTicking = false;
    });
  }, { passive: true });
}

function loadScript(id) {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById('mlzidla-google-tag');
    if (existing) {
      if (existing.dataset.loaded === 'true') resolve();
      else {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'mlzidla-google-tag';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    script.onload = () => { script.dataset.loaded = 'true'; resolve(); };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export function initGoogleAnalytics() {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      setDefaultConsent();
      installGlobalListeners();

      const response = await base44.functions.invoke('getPublicAnalyticsConfig', {});
      measurementId = response?.data?.measurementId || '';
      if (!measurementId) throw new Error(response?.data?.error || 'Missing GA4 Measurement ID');

      defineGtag();
      await loadScript(measurementId);
      safeGtag('js', new Date());
      safeGtag('config', measurementId, {
        send_page_view: false,
        anonymize_ip: true,
      });
      safeGtag('config', GOOGLE_ADS_ID, { send_page_view: false });
      return true;
    } catch (error) {
      console.warn('GA4 initialization failed:', error);
      initPromise = null;
      return false;
    }
  })();

  return initPromise;
}

async function emit(eventName, properties = {}) {
  const ready = await initGoogleAnalytics();
  if (!ready) return;
  safeGtag('event', eventName, properties);
}

function sendToGoogleAds(value = 1000) {
  if (!GOOGLE_ADS_CONVERSION_LABEL) return;
  safeGtag('event', 'conversion', {
    send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`,
    value,
    currency: 'CZK',
  });
}

function trackLead(leadType, productName, value) {
  void emit('generate_lead', {
    lead_type: leadType || 'kontakt',
    product_name: productName || 'nezadáno',
    value,
    currency: 'CZK',
  }).then(() => sendToGoogleAds(value));
}

export function trackPageView(path, title) {
  if (typeof window === 'undefined') return;
  void emit('page_view', {
    page_location: window.location.href,
    page_path: path || `${window.location.pathname}${window.location.search}`,
    page_title: title || document.title,
  });
}

export function trackCooperationFormSubmit() {
  trackLead('spolupráce', '', 500);
}

export function trackContactFormSubmit(formType, productName) {
  trackLead(formType || 'kontakt', productName, 1000);
}

export function trackInquirySubmitted(requestType, productInterest) {
  trackLead(requestType || 'poptávka', productInterest, 2000);
}

export function trackRentalInquiry(productName, eventType) {
  void emit('generate_lead', {
    lead_type: 'pronájem GO',
    product_name: productName || 'nezvoleno',
    event_type: eventType || 'event',
    value: 1500,
    currency: 'CZK',
  }).then(() => sendToGoogleAds(1500));
}

export function trackThankYouPageView(source) {
  void emit('thank_you_view', { lead_source: source || 'kontakt' });
}

export function trackGateInterest(productName) {
  void emit('product_interest', { product_type: 'brána', product_name: productName || 'obecná brána' });
}

export function trackMistSculptureInterest(productName) {
  void emit('product_interest', { product_type: 'mlžná plastika', product_name: productName || 'obecná plastika' });
}

export function trackProductSectionEngagement(sectionName) {
  void emit('product_section_view', { section_name: sectionName });
}

export function trackProductView(productName, productSlug, category) {
  void emit('view_item', {
    product_name: productName,
    product_slug: productSlug,
    product_category: category || 'neznámá',
  });
}

export function trackProductClick(productName, productSlug, section) {
  void emit('select_item', {
    product_name: productName,
    product_slug: productSlug,
    section_name: section || 'katalog',
  });
}

export function trackQuickInquiryClick(productName, section) {
  void emit('quick_inquiry_click', {
    product_name: productName || 'bez produktu',
    section_name: section || 'produkt',
  });
}

export function trackBlogPostView(title, slug, category) {
  void emit('blog_post_view', {
    post_title: title,
    post_slug: slug,
    post_category: category || 'nezadaná',
  });
}

export function trackReferenceView(name, location, category) {
  void emit('reference_view', {
    reference_name: name,
    reference_location: location || 'nezadaná',
    reference_category: category || 'nezadaná',
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
