import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
  {
    id: 'prednosti',
    label: 'Přednosti',
    heading: (p) => `Proč zvolit ${p.name}`,
    text: (p) => p.short_description || 'Prémiový mlžný systém z nerezové oceli AISI 316L s tichým provozem a rovnoměrným rozptylem mikro-kapek.',
  },
  {
    id: 'instalace',
    label: 'Instalace',
    heading: () => 'Rychlá a čistá instalace',
    text: () => 'Certifikovaný technik HolmTec provede montáž na míru vašemu prostoru za jeden pracovní den, včetně napojení na vodní řad a elektřinu.',
  },
  {
    id: 'technologie',
    label: 'Technologie',
    heading: (p) => `Technologie uvnitř ${p.name}`,
    text: (p) => `Vysokotlaké čerpadlo a trysky${p.micron_size ? ` ${p.micron_size} μm` : ''} zajišťují jemnou mlhu, která se odpaří dřív, než dopadne na zem.`,
  },
  {
    id: 'reference',
    label: 'Reference',
    heading: () => 'Osvědčeno v provozu',
    text: () => 'Desítky realizací v parcích, restauracích a průmyslových provozech po celé ČR.',
  },
];

export default function InfoTabsGallery({ product }) {
  const [active, setActive] = useState(TABS[0].id);
  const images = [product.image_url, ...(product.gallery_urls || [])].filter(Boolean);
  const activeIndex = TABS.findIndex((t) => t.id === active);
  const image = images.length ? images[activeIndex % images.length] : null;
  const tab = TABS[activeIndex];

  return (
    <section className="min-h-screen w-full flex flex-col justify-center px-6 lg:px-20 py-24 bg-slate-950">
      <p className="text-sm font-semibold tracking-wide text-cyan mb-4">Informace k produktu</p>
      <h2 className="font-heading font-light text-white mb-10" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
        Vše, co potřebujete vědět
      </h2>

      <div className="flex gap-2 flex-wrap mb-8">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setActive(t.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${active === t.id ? 'bg-white text-slate-900' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="relative w-full max-w-5xl aspect-[16/9] rounded-3xl overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0">
            {image && <img src={image} alt={tab.label} className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 max-w-xl">
              <h3 className="text-white text-2xl font-heading font-light mb-3">{tab.heading(product)}</h3>
              <p className="text-white/70 text-sm leading-relaxed">{tab.text(product)}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}