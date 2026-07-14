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
    <div className="fixed top-16 left-0 right-0 z-30 hidden lg:flex justify-center bg-white/80 backdrop-blur-xl border-b border-slate-200">
      <div className="flex items-center gap-8 px-6">
        {sections.map((s) => (
          <button key={s.id} onClick={() => scrollTo(s.ref)}
            className={`py-3 text-sm font-medium transition-colors border-b-2 ${active === s.id ? 'text-slate-900 border-slate-900' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}