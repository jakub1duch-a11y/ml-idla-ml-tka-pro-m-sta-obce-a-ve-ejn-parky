import { useEffect } from 'react';

// Globální plynulý scroll. Načítá se asynchronně (mimo kritickou cestu),
// vypíná se při prefers-reduced-motion a na /gate70, která má vlastní instanci.
export default function useGlobalLenis(pathname) {
  useEffect(() => {
    if (pathname.startsWith('/gate70')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let lenis;
    let raf = 0;
    let cancelled = false;
    const start = async () => {
      const { default: Lenis } = await import('lenis');
      if (cancelled) return;
      lenis = new Lenis({ duration: 1.05, smoothWheel: true, anchors: { offset: -88 } });
      window.__lenis = lenis;
      const loop = (t) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
      raf = requestAnimationFrame(loop);
    };
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));
    idle(start);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
      if (window.__lenis === lenis) window.__lenis = null;
    };
  }, [pathname]);
}