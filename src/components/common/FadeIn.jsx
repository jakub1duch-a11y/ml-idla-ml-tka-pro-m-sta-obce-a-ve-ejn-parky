import React, { useEffect, useRef } from 'react';

// Wraps children in a div that reveals (fade + slide up) when scrolled into view (Intersection Observer API)
export default function FadeIn({ children, className = '', as: Tag = 'div' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px', threshold: 0.15 });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal-element bg-[#c7dce5] ${className}`}>
      {children}
    </Tag>);

}