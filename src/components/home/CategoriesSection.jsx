import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    id: 'sochy',
    label: 'Mlžné sochy',
    tagline: 'Přírodní tvary. Živá atmosféra.',
    desc: 'Skulpturální instalace inspirované přírodou — stromy, mraky, listy. Dominanta každého prostoru.',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/84af07a7b_0d4b710a-7605-463b-835a-71e89991f12d.jpg',
    link: '/kolekce',
    count: '12 produktů',
    tag: 'NATURE',
  },
  {
    id: 'mlhoviste',
    label: 'Mlhoviště & chladicí zóny',
    tagline: 'Až −9 °C. Komfort bez mokra.',
    desc: 'Plošné ochlazení teras, hřišť, sportovišť a průmyslových prostorů. Průmyslové čerpadlo 70 bar.',
    image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/62841e4f5_img-5153.jpeg',
    link: '/mlhoviste',
    count: '4 produkty',
    tag: 'COOLING',
  },
  {
    id: 'prislusenstvi',
    label: 'Mlžné příslušenství a moduly',
    tagline: 'Doplňky pro každou instalaci.',
    desc: 'Trysky, čerpadla, filtry, Smart moduly a další komponenty pro rozšíření a údržbu vašeho mlžného systému.',
    image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/dec576b4e_upscaled_7fc9b4e64_mlzitko_upraveno_Z09_3544_zmenseno.jpg',
    link: '/kolekce',
    count: '5 produktů',
    tag: 'PŘÍSLUŠENSTVÍ',
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Kategorie produktů</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="font-heading font-light text-4xl lg:text-5xl text-slate-900 tracking-tight">
              Řešení pro každý<br /><span className="text-slate-400">typ prostoru.</span>
            </motion.h2>
            <Link to="/kolekce" className="flex items-center gap-2 text-sm text-slate-900 hover:text-slate-600 transition-colors font-medium whitespace-nowrap">
              Celá kolekce <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Grid: 1 big left + 3 right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Featured (first) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          >
            <Link to={categories[0].link} className="group relative block rounded-2xl overflow-hidden h-full min-h-[400px]">
              <img src={categories[0].image} alt={categories[0].label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono tracking-widest text-white/70 backdrop-blur-sm">
                    {categories[0].tag}
                  </span>
                  <span className="text-xs font-mono text-white/50">{categories[0].count}</span>
                </div>
                <div>
                  <p className="text-xs font-mono tracking-widest uppercase text-white/60 mb-2">{categories[0].tagline}</p>
                  <h3 className="font-heading font-light text-3xl text-white mb-2 group-hover:text-white/80 transition-colors">{categories[0].label}</h3>
                  <p className="text-sm text-white/60 leading-relaxed mb-4 max-w-sm">{categories[0].desc}</p>
                  <div className="flex items-center gap-2 text-sm text-white font-medium">
                    Prozkoumat <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Right column: 3 smaller */}
          <div className="flex flex-col gap-4">
            {categories.slice(1).map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link to={cat.link} className="group relative flex items-stretch rounded-2xl overflow-hidden h-36">
                  {/* Image */}
                  <div className="relative w-48 shrink-0 overflow-hidden">
                    <img src={cat.image} alt={cat.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  {/* Text */}
                  <div className="flex-1 bg-white border border-slate-200 group-hover:border-slate-300 transition-all p-5 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 block mb-1">{cat.tag}</span>
                        <h3 className="font-normal text-slate-900 text-base group-hover:text-slate-600 transition-colors leading-tight">{cat.label}</h3>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">{cat.count}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-400 italic">{cat.tagline}</p>
                      <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}