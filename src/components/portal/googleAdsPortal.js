// Module-scope bootstrap: available before an order success handler can run.
if (typeof document !== 'undefined' && !window.__gads_loaded) {
  window.__gads_loaded = true;
  window.dataLayer = window.dataLayer || [];
  const inIframe = (() => { try { return window.self !== window.top; } catch { return true; } })();
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
    if (inIframe) {
      try {
        const args = Array.prototype.slice.call(arguments);
        const cmd = args[0];
        window.parent.postMessage({ type: 'base44_gtag_event', event: { source: 'gtag', timestamp: new Date().toLocaleTimeString(), command: cmd, params: args.slice(1), type: cmd === 'event' ? (args[1] || 'event') : cmd } }, '*');
      } catch { /* Tracking must not interrupt an order. */ }
    }
  };
  let accepted = false;
  try { accepted = localStorage.getItem('cookie_consent') === 'accepted'; } catch { /* Essential only. */ }
  const consent = accepted ? 'granted' : 'denied';
  window.gtag('consent', 'default', { ad_storage: consent, analytics_storage: consent, ad_user_data: consent, ad_personalization: consent });
  const s = document.createElement('script');
  s.src = 'https://www.googletagmanager.com/gtag/js?id=AW-18399688870';
  s.async = true;
  document.head.appendChild(s);
  window.gtag('js', new Date());
  window.gtag('config', 'AW-18399688870', { send_page_view: false });
}