import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import LocalizedFooter from './LocalizedFooter';
import { getLocaleFromPath } from '@/lib/i18n';
import NotificationPrompt from '@/components/common/NotificationPrompt';
import CookieConsent from '@/components/common/CookieConsent';
import WhatsAppContactWidget from '@/components/common/WhatsAppContactWidget';
import useGlobalLenis from '@/hooks/useGlobalLenis';
import ScrollMotionController from '@/components/common/ScrollMotionController';
import 'lenis/dist/lenis.css';
import '@/styles/footer-reveal.css';

/**
 * The footer stays under the page on larger screens and is uncovered while
 * scrolling past the final section. Mobile/reduced-motion keeps normal flow.
 * ResizeObserver maintains the correct scroll space for dynamic footer height.
 */
export default function SiteLayout() {
  const location = useLocation();
  const locale = getLocaleFromPath(location.pathname);
  const footerRef = useRef(null);
  const spacerRef = useRef(null);
  const [revealEnabled, setRevealEnabled] = useState(false);
  const [footerHeight, setFooterHeight] = useState(0);
  const [footerVisible, setFooterVisible] = useState(false);

  useGlobalLenis(location.pathname);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)');
    const update = () => setRevealEnabled(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!revealEnabled || !footerRef.current) return;
    const footer = footerRef.current;
    const update = () => setFooterHeight(Math.ceil(footer.getBoundingClientRect().height));
    update();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(update);
    observer.observe(footer);
    return () => observer.disconnect();
  }, [locale, revealEnabled]);

  useEffect(() => {
    if (!revealEnabled || !spacerRef.current) {
      setFooterVisible(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(spacerRef.current);
    return () => observer.disconnect();
  }, [revealEnabled, footerHeight, location.pathname]);

  return (
    <div className={`architecture-site min-h-screen flex flex-col ${revealEnabled ? 'site-footer-reveal-active' : ''}`}>
      <Header />
      <main className="flex-1 site-footer-page-cover">
        <ScrollMotionController />
        <Outlet />
      </main>
      {revealEnabled && <div ref={spacerRef} className="site-footer-reveal-spacer" style={{ height: footerHeight }} aria-hidden="true" />}
      <div ref={footerRef}
        className={revealEnabled ? 'site-footer-reveal-fixed' : 'site-footer-normal'}
        inert={revealEnabled && !footerVisible ? '' : undefined}
        aria-hidden={revealEnabled && !footerVisible ? 'true' : undefined}>
        {locale === 'cs' ? <Footer /> : <LocalizedFooter locale={locale} />}
      </div>
      {locale === 'cs' && <NotificationPrompt />}
      {locale === 'cs' && <WhatsAppContactWidget />}
      <CookieConsent locale={locale} />
    </div>
  );
}
