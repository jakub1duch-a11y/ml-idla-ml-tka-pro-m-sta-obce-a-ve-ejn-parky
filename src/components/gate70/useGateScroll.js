import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-driven animace pro Gate70.
 *
 * - Lenis pro smooth scrolling
 * - GSAP ScrollTrigger s pin: scéna zůstává fixována na obrazovce
 * - scrub: true — animace je 1:1 navázaná na pozici scrollu
 * - 4 fáze (stage 0–3) se přepínají podle progress
 * - ResizeObserver pro přepočet při změně velikosti
 */
export default function useGateScroll(section, state, onStage) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const mobile = window.matchMedia('(max-width:767px)').matches;

    // Lenis — smooth scrolling (pouze pro desktop a bez reduced-motion)
    const lenis = reduced ? null : new Lenis({
      duration: 1.1,
      smoothWheel: !mobile,
      anchors: true,
      touchMultiplier: 1.5,
    });

    state.current.scrollTo = (top) => {
      if (lenis) lenis.scrollTo(top, { immediate: true });
      else window.scrollTo({ top, behavior: 'instant' });
    };

    const tick = (t) => lenis?.raf(t * 1000);
    if (lenis) {
      gsap.ticker.add(tick);
      lenis.on('scroll', ScrollTrigger.update);
    }

    // Hlavní scroll tween — progress 0 → 1 napříč celou sekcí
    let last = -1;
    const tween = gsap.to(state.current, {
      progress: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: section.current,
        start: 'top top',
        end: 'bottom bottom',
        pin: section.current.querySelector('.gate-sticky'),
        pinSpacing: false,
        pinType: 'fixed',
        scrub: true,
        onUpdate: (self) => {
          const stage = Math.min(3, Math.floor(self.progress * 4));
          if (stage !== last) {
            last = stage;
            onStage(stage);
          }
        },
      },
    });

    // Re-measure při změně velikosti
    const resizeObserver = new ResizeObserver(() => {
      tween.scrollTrigger?.refresh();
      lenis?.resize();
    });
    resizeObserver.observe(section.current);
    ScrollTrigger.refresh();

    return () => {
      resizeObserver.disconnect();
      tween.scrollTrigger?.kill();
      tween.kill();
      if (lenis) {
        gsap.ticker.remove(tick);
        lenis.destroy();
      }
    };
  }, [section, state, onStage]);
}