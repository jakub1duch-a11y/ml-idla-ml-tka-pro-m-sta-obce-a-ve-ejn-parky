const CONSENT_STORAGE_KEY = 'cookie_consent';

let pixelId = '';
let loadPromise = null;
let initialized = false;

function getStoredConsent() {
  if (typeof window === 'undefined') return '';
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) || '';
  } catch (_) {
    return '';
  }
}

function defineFbq() {
  if (typeof window === 'undefined') return null;
  if (typeof window.fbq === 'function') return window.fbq;

  const fbq = function fbq() {
    if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
    else fbq.queue.push(arguments);
  };
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;
  window._fbq = fbq;
  return fbq;
}

function loadMetaScript() {
  if (typeof document === 'undefined') return Promise.resolve(false);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById('mlzidla-meta-pixel');
    if (existing) {
      if (existing.dataset.loaded === 'true') resolve(true);
      else {
        existing.addEventListener('load', () => resolve(true), { once: true });
        existing.addEventListener('error', reject, { once: true });
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'mlzidla-meta-pixel';
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve(true);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return loadPromise;
}

async function initMetaPixel() {
  if (typeof window === 'undefined' || !pixelId || getStoredConsent() !== 'accepted') return false;
  if (initialized) return true;

  try {
    const fbq = defineFbq();
    if (!fbq) return false;
    fbq('consent', 'grant');
    fbq('init', pixelId);
    await loadMetaScript();
    initialized = true;
    return true;
  } catch (error) {
    console.warn('Meta Pixel initialization failed:', error);
    loadPromise = null;
    return false;
  }
}

export async function configureMetaPixel(id) {
  pixelId = String(id || '').trim();
  if (!pixelId || getStoredConsent() !== 'accepted') return false;
  return initMetaPixel();
}

export function updateMetaConsent(value) {
  if (typeof window === 'undefined') return;

  if (value !== 'accepted') {
    if (typeof window.fbq === 'function') window.fbq('consent', 'revoke');
    return;
  }

  void initMetaPixel().then((ready) => {
    if (!ready || typeof window.fbq !== 'function') return;
    window.fbq('consent', 'grant');
    // A visitor can accept cookies after the SPA route page_view already fired.
    // Record the current page once consent is granted so attribution is not lost.
    window.fbq('track', 'PageView');
  });
}

const STANDARD_EVENT_MAP = {
  page_view: 'PageView',
  generate_lead: 'Lead',
  view_item: 'ViewContent',
  sign_up: 'CompleteRegistration',
  phone_click: 'Contact',
  email_click: 'Contact',
  quick_inquiry_click: 'Contact',
};

const CUSTOM_EVENT_MAP = {
  cta_click: 'CTA_Click',
  product_interest: 'ProductInterest',
  select_item: 'ProductSelect',
  visualization_complete: 'VisualizationComplete',
  file_download: 'FileDownload',
  social_click: 'SocialClick',
};

export async function trackMetaEvent(eventName, properties = {}) {
  if (!pixelId || getStoredConsent() !== 'accepted') return;
  const ready = await initMetaPixel();
  if (!ready || typeof window.fbq !== 'function') return;

  const standardName = STANDARD_EVENT_MAP[eventName];
  if (standardName) {
    window.fbq('track', standardName, properties);
    return;
  }

  const customName = CUSTOM_EVENT_MAP[eventName];
  if (customName) window.fbq('trackCustom', customName, properties);
}

export function isMetaPixelConfigured() {
  return Boolean(pixelId);
}
