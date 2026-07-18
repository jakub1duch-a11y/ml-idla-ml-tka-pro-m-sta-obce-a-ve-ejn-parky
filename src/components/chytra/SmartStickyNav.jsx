import React, { useEffect, useState } from 'react';

const links = [['smart-uvod', 'Úvod'], ['smart-varianty', 'Automatizace'], ['smart-aplikace', 'Aplikace'], ['smart-moduly', 'Senzory'], ['smart-uspory', 'Úspory']];

export default function SmartStickyNav() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const update = () => setVisible(window.scrollY > 520); update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update); }, []);
  return <nav className={`fixed inset-x-0 bottom-4 z-40 px-3 transition-all duration-300 ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'}`} aria-label="Navigace chytrým řízením"><div className="site-container"><div className="grid grid-cols-5 overflow-hidden rounded-full border border-slate-400/60 bg-[linear-gradient(115deg,#f8fafc_0%,#cbd5e1_26%,#f8fafc_50%,#94a3b8_75%,#f8fafc_100%)] p-1 shadow-xl shadow-slate-950/20">{links.map(([id, label]) => <a key={id} href={`#${id}`} className="rounded-full px-2 py-2 text-center text-[10px] font-bold text-slate-800 transition hover:bg-slate-950 hover:text-white sm:text-xs">{label}</a>)}</div></div></nav>;
}