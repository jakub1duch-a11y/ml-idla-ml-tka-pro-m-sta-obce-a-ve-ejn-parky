import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function HomeGsapMotion() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-home-reveal]').forEach((node) => {
        gsap.fromTo(node, { y: 34, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: node, start: 'top 88%', once: true },
        });
      });
      gsap.utils.toArray('[data-home-parallax]').forEach((node) => {
        gsap.to(node, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: { trigger: node, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        });
      });
    });
    return () => ctx.revert();
  }, []);
  return null;
}
