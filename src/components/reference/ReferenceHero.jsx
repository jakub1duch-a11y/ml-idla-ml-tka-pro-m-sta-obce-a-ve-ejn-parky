import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import ScrollDropLink from '@/components/common/ScrollDropLink';

const BG_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/b1ef284f1_generated_image.png';

export default function ReferenceHero() {
  return (
    <section className="relative min-h-[720px] h-[100svh] overflow-hidden flex items-center justify-center text-center bg-[hsl(var(--popover-foreground))]">
      <img src={BG_IMAGE} alt="Mlžný oblak ve veřejném prostoru" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-950/35 to-slate-950/90" />
      <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }} className="relative z-10 px-6 max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.22em] uppercase text-white/65 mb-4">Realizace</p>
        <h1 className="font-light text-white leading-[1.1] [font-family:'DM_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] text-5xl sm:text-5xl">Mlžení, které dává veřejnému prostoru nový rozměr.</h1>
        <p className="text-white/75 max-w-xl mx-auto text-base sm:text-lg mt-6">Podívejte se na instalace pro města, parky, gastro provozy a místa, kde má být příjemně i v horkých dnech.</p>
        <Link to="/videosekce-mlzitka" className="inline-flex items-center gap-2 px-6 py-3 mt-8 bg-white text-slate-900 text-sm font-bold rounded-full hover:bg-white/90 transition-colors"><Play size={15} fill="currentColor" /> Prohlédnout videosekci</Link>
      </motion.div>
      <ScrollDropLink href="#reference-vypis" label="Pokračovat k realizacím" />
    </section>);

}