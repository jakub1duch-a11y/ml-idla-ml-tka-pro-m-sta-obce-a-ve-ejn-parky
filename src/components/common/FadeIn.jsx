import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Wraps children in a div that fades in & slides up when scrolled into view (GSAP ScrollTrigger)
export default function FadeIn({ children, className = '', as: Tag = 'div' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => el.classList.add('visible')
    });
    return () => trigger.kill();
  }, []);

  return (
    <Tag ref={ref} className={`fade-in-element ${className}`}>
      {children}
    </Tag>
  );
}