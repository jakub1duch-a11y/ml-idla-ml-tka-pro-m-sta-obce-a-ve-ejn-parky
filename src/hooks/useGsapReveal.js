import { useEffect, useRef } from 'react';

// Scroll-driven reveal + parallax for [data-reveal] / [data-parallax] elements.
// Vlastní implementace (IntersectionObserver + rAF) — bez externí animační knihovny.
export default function useGsapReveal(deps = []) {
  const scope = useRef(null);

  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealEls = Array.from(root.querySelectorAll('[data-reveal]'));
    const parallaxEls = Array.from(root.querySelectorAll('[data-parallax]'));

    if (reduced) {
      revealEls.forEach((el) => { el.style.opacity = '1'; el.style.transform = 'none'; });
      return;
    }

    revealEls.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translate3d(0, 34px, 0)';
      el.style.transition = 'opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1)';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translate3d(0, 0, 0)';
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
    revealEls.forEach((el) => observer.observe(el));

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const vh = window.innerHeight;
        parallaxEls.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const progress = (vh - rect.top) / (vh + rect.height);
          const amount = Number(el.dataset.parallax) || -12;
          el.style.transform = `translate3d(0, ${(progress - 0.5) * amount}%, 0)`;
        });
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, deps);

  return scope;
}