import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Lightweight, route-aware scroll reveals inspired by modern motion-design workflows.
 * Content remains visible when motion is reduced or IntersectionObserver is unavailable.
 */
export default function ScrollMotionController() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const main = document.querySelector('.architecture-site main');
    if (!main) return;

    const candidates = main.querySelectorAll(
      'section, article, .product-card, .gate-product-card, .space-event-card, [data-motion-reveal="item"]'
    );
    const targets = Array.from(candidates).filter((element) => {
      if (element.closest('[data-no-scroll-motion], [aria-hidden="true"]')) return false;
      if (element.matches('section') && element.parentElement?.closest('section')) return false;
      if (element.matches('article') && element.parentElement?.closest('article')) return false;
      return true;
    });

    if (!targets.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('motion-reveal-visible');
        entry.target.classList.remove('motion-reveal-pending');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    targets.forEach((element, index) => {
      element.classList.add('motion-reveal-pending');
      element.style.setProperty('--motion-reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      targets.forEach((element) => {
        element.classList.remove('motion-reveal-pending', 'motion-reveal-visible');
        element.style.removeProperty('--motion-reveal-delay');
      });
    };
  }, [location.pathname]);

  return null;
}
