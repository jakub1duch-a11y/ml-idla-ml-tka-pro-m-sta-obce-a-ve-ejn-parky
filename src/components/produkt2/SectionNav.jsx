import React, { useEffect, useState } from 'react';

export default function SectionNav({ sections }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observers = sections.map(({ id, ref }) => {
      if (!ref.current) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
      );
      obs.observe(ref.current);
      return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, [sections]);

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col gap-4">
      {sections.map((s) => (
        <button key={s.id} onClick={() => scrollTo(s.ref)} className="group flex items-center gap-3 justify-end">
          <span className={`font-mono text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${active === s.id ? 'text-techblue opacity-100' : 'text-white/30 opacity-0 group-hover:opacity-100'}`}>
            {s.label}
          </span>
          <span className={`w-2 h-2 rounded-full border transition-all shrink-0 ${active === s.id ? 'bg-techblue border-techblue scale-125' : 'border-white/30 bg-transparent'}`} />
        </button>
      ))}
    </div>
  );
}