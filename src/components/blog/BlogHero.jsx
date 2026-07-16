import React from 'react';
import { motion } from 'framer-motion';
import ScrollDropLink from '@/components/common/ScrollDropLink';

export default function BlogHero() {
  return (
    <section className="relative min-h-[560px] sm:min-h-[620px] pt-28 pb-32 overflow-hidden flex items-center bg-slate-950">
      <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/b1ef284f1_generated_image.png" alt="Jemná mlha v městském prostoru" className="absolute inset-0 w-full h-full object-cover opacity-65" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-950/50 to-slate-950" />
      <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }} className="relative max-w-7xl mx-auto w-full px-6 lg:px-8">
        <p className="text-xs font-semibold text-white/60 uppercase tracking-[0.24em] mb-4">Novinky a inspirace</p>
        <h1 className="font-heading font-light text-white text-4xl sm:text-6xl max-w-3xl">Praktické poznatky ze světa mlžení.</h1>
        <p className="text-white/75 max-w-xl text-base sm:text-lg mt-5">Technologie, inspirace a konkrétní zkušenosti pro provozy, města i moderní venkovní prostory.</p>
      </motion.div>
      <ScrollDropLink href="#blog-vypis" label="Pokračovat k novinkám" variant="pulse" />
    </section>
  );
}