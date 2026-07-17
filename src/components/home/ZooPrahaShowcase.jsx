import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ZooPrahaShowcase() {
  const [images, setImages] = useState([]);
  const [active, setActive] = useState(0);
  useEffect(() => { base44.entities.Realizace.list('-year', 100).then(items => { const zoo = items.find(item => /zoo praha/i.test(`${item.name || ''} ${item.client || ''}`)); setImages([zoo?.image_url, ...(zoo?.gallery_urls || [])].filter(Boolean).slice(0, 5)); }); }, []);
  useEffect(() => { if (images.length < 2) return undefined; const timer = window.setInterval(() => setActive(value => (value + 1) % images.length), 3800); return () => window.clearInterval(timer); }, [images.length]);
  if (!images.length) return null;
  return <section className="bg-slate-950 py-20 text-white lg:py-28"><div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-2 lg:px-10"><div><p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan"><MapPin size={14} /> Realizace Zoo Praha</p><h2 className="mt-5 font-heading text-4xl font-medium leading-tight tracking-tight lg:text-5xl">Osvěžení, které zapadne i do živého areálu.</h2><p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">V Zoo Praha vytváří mlžné chlazení příjemný okamžik pro návštěvníky v horkých dnech — jemně, bezpečně a bez rušivých zásahů do prostoru.</p><Link to="/reference" className="mt-8 inline-flex items-center gap-2 rounded-full border border-cyan/50 px-6 py-3 text-sm font-bold text-cyan transition hover:bg-cyan hover:text-slate-950">Prohlédnout realizace <ArrowRight size={16} /></Link></div><div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-900"><AnimatePresence mode="wait">{images[active] && <motion.img key={images[active]} src={images[active]} alt="Mlžné chlazení v Zoo Praha" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" />}</AnimatePresence><div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 to-transparent" /><span className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-slate-950/45 px-3 py-1.5 text-xs font-bold backdrop-blur">Živá obrazová sekvence</span></div></div></section>;
}