import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function HomeGsapMotion() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    gsap.registerPlugin(ScrollTrigger);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (reduced) return undefined;

    const cleanups = [];
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-home-reveal]').forEach((node) => {
        gsap.fromTo(
          node,
          { y: 34, opacity: 0, filter: 'blur(8px)', clipPath: 'inset(0 0 12% 0 round 18px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            clipPath: 'inset(0 0 0% 0 round 18px)',
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: node, start: 'top 88%', once: true },
          },
        );
      });

      gsap.utils.toArray('[data-home-parallax]').forEach((node) => {
        const depth = Number(node.getAttribute('data-home-parallax') || 10);
        gsap.to(node, {
          yPercent: -Math.max(-18, Math.min(18, depth)),
          ease: 'none',
          scrollTrigger: { trigger: node, start: 'top bottom', end: 'bottom top', scrub: 0.65 },
        });
      });

      gsap.utils.toArray('[data-home-rotate]').forEach((node) => {
        const amount = Number(node.getAttribute('data-home-rotate') || 3.5);
        gsap.fromTo(node, { rotate: -amount }, {
          rotate: amount,
          ease: 'none',
          transformOrigin: '50% 50%',
          scrollTrigger: { trigger: node, start: 'top 92%', end: 'bottom 8%', scrub: 0.75 },
        });
      });

      gsap.utils.toArray('[data-home-progress]').forEach((node) => {
        gsap.fromTo(node, { scaleX: 0 }, {
          scaleX: 1,
          ease: 'none',
          transformOrigin: 'left center',
          scrollTrigger: { trigger: node.parentElement || node, start: 'top 85%', end: 'bottom 35%', scrub: true },
        });
      });

      if (finePointer) {
        gsap.utils.toArray('[data-home-pointer]').forEach((node) => {
          const strength = Number(node.getAttribute('data-home-pointer') || 8);
          const xTo = gsap.quickTo(node, 'x', { duration: 0.55, ease: 'power3.out' });
          const yTo = gsap.quickTo(node, 'y', { duration: 0.55, ease: 'power3.out' });
          const onMove = (event) => {
            const rect = node.getBoundingClientRect();
            const px = (event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
            const py = (event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
            xTo(px * strength);
            yTo(py * strength);
          };
          const onLeave = () => { xTo(0); yTo(0); };
          node.addEventListener('pointermove', onMove);
          node.addEventListener('pointerleave', onLeave);
          cleanups.push(() => {
            node.removeEventListener('pointermove', onMove);
            node.removeEventListener('pointerleave', onLeave);
          });
        });
      }
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return null;
}
