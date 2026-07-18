import React, { useEffect, useRef, useState } from 'react';

export default function CoolingCardEffect({ active = false }) {
  const effectRef = useRef(null);
  const [cooled, setCooled] = useState(false);

  useEffect(() => {
    if (!active || !effectRef.current) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setCooled(true);
    }, { threshold: 0.6 });
    observer.observe(effectRef.current);
    return () => observer.disconnect();
  }, [active]);

  if (!active) return null;

  return <div ref={effectRef} className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
    <div className={`absolute inset-0 bg-orange-500/35 mix-blend-color transition-opacity duration-1000 ${cooled ? 'opacity-0' : 'animate-pulse'}`} />
    <div className={`absolute inset-0 bg-cyan/20 transition-opacity duration-700 ${cooled ? 'opacity-100' : 'opacity-0'}`} />
    <span className={`absolute left-4 top-4 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.16em] transition-all duration-500 ${cooled ? 'bg-cyan text-slate-950' : 'bg-orange-500 text-white'}`}>{cooled ? 'Ochlazeno mlhou' : 'Horký den'}</span>
    {cooled && <div className="absolute right-5 top-4 flex gap-1.5 text-cyan animate-bounce"><i className="h-1.5 w-1.5 rounded-full bg-current" /><i className="mt-2 h-1 w-1 rounded-full bg-current" /><i className="h-1.5 w-1.5 rounded-full bg-current" /></div>}
  </div>;
}