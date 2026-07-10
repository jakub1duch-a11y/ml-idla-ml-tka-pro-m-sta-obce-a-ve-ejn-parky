import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function SustainabilityHero() {
  return (
    <div className="relative h-[70vh] min-h-[520px] overflow-hidden">
      <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/f3b8c55a9_generated_bbf2a949.png"
        alt="Mlžení v zahradě lázeňského resortu za soumraku" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
      <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl">
          <span className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 text-white text-xs font-bold tracking-widest uppercase rounded-full mb-5">
            Udržitelnost & mikroklima
          </span>
          <h1 className="font-heading font-light text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.05] mb-5">
            Mlžení, které šetří <span className="italic font-light text-cyan">vodu i klima.</span>
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-xl mb-7">
            Nízkotlaké mlžení ochlazuje veřejný prostor bez klimatizace, s minimální spotřebou vody a bez chemikálií.
          </p>
          <Link to="/kontakt?produkt=Udr%C5%BEiteln%C3%A9%20ml%C5%BE%C3%ADt%C3%A1"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-slate-900 text-sm font-bold rounded-full hover:bg-white/90 transition-all">
            Nezávazná konzultace <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </div>);

}