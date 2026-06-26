import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const projects = [
  {
    id: 1,
    location: 'Praha 6 — Divoká Šárka',
    type: 'Park',
    year: '2025',
    title: 'Přírodní amfiteátr s mlžnou oázou',
    desc: 'V nejnavštěvovanějším pražském přírodním parku jsme instalovali 3 mlžné sochy GATE 60 podél hlavní promenády. V horkých dnech teplota v bezprostřední blízkosti klesla o 7 °C. Návštěvnost stoupla o 34 %.',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/fbcf274b1_FB_IMG_1782148331764.jpg',
    stats: [{ val: '−7 °C', label: 'pokles teploty' }, { val: '34 %', label: 'více návštěvníků' }, { val: '3 ks', label: 'GATE 60' }],
  },
  {
    id: 2,
    location: 'Brno — ZOO Dvůr Králové',
    type: 'ZOO',
    year: '2025',
    title: 'Klimatický komfort pro zvířata i lidi',
    desc: 'Instalace 6 mlžných trysek ARENA v exponátu afrických zvířat. Systém zajišťuje optimální mikroklima pro citlivá zvířata při letních teplotách. Spotřeba vody pouze 14 l/h pro celou zónu.',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/60a14cfc6_43d83e0c0_unnamed-9.png',
    stats: [{ val: '14 l/h', label: 'spotřeba vody' }, { val: '6 ks', label: 'trysek ARENA' }, { val: '200 m²', label: 'pokrytá plocha' }],
  },
  {
    id: 3,
    location: 'Trutnov — Dětské hřiště Sídliště',
    type: 'Hřiště',
    year: '2026',
    title: 'Mlhoviště START pro nejmenší',
    desc: 'Mateřská škola požadovala bezpečné osvěžení pro děti do 6 let. Instalace Kids Edition + START modul bez ostrých hran, hladké svary z potravinářské nerezové oceli. Rodiče mohou být v klidu.',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/8139fde88_7fc9b4e64_mlzitko_upraveno_Z09_3544_zmenseno.jpg',
    stats: [{ val: '30 m²', label: 'plocha osvěžení' }, { val: '1 den', label: 'montáž' }, { val: '5 let', label: 'záruka' }],
  },
  {
    id: 4,
    location: 'Praha 1 — Náměstí Republiky',
    type: 'Veřejný prostor',
    year: '2026',
    title: 'Designová mlžná socha v centru města',
    desc: 'Pro Prahu 1 jsme navrhli custom mlžnou sochu AURA jako dominantu náměstí. Průměr 160 cm, 8 trysek, ovládání přes Smart systém napojený na meteorologická data. Zásah do teploty okolí o 9 °C.',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9c4797da7_01D04E88-89AB-44FB-9989-C97F3B40E100.png',
    stats: [{ val: '−9 °C', label: 'pokles teploty' }, { val: '160 cm', label: 'průměr AURA' }, { val: 'Smart', label: 'automatické řízení' }],
  },
];

export default function ProjectsSection() {
  const [active, setActive] = useState(0);
  const project = projects[active];

  return (
    <section className="py-24 bg-ink">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
          <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">Realizované projekty</p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <h2 className="font-heading font-light text-4xl lg:text-5xl text-white tracking-tight">
              Kde naše sochy stojí
            </h2>
            <Link to="/kontakt" className="inline-flex items-center gap-2 text-sm text-cyan font-light hover:gap-3 transition-all">
              Konzultace zdarma <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {projects.map((p, i) => (
            <button key={p.id} onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-widest uppercase transition-all ${active === i ? 'bg-cyan text-ink' : 'text-white/40 border border-white/10 hover:border-white/30 hover:text-white/70'}`}>
              {p.location.split('—')[0].trim()}
            </button>
          ))}
        </div>

        {/* Main card */}
        <AnimatePresence mode="wait">
          <motion.div key={project.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden border border-white/10">
              {/* Image */}
              <div className="lg:col-span-3 aspect-[4/3] lg:aspect-auto relative overflow-hidden">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                <div className="absolute top-5 left-5 flex items-center gap-2">
                  <span className="px-3 py-1 bg-ink/70 backdrop-blur-sm border border-white/10 rounded-full text-xs font-mono text-white/60 tracking-widest uppercase">{project.type}</span>
                  <span className="px-3 py-1 bg-cyan/20 backdrop-blur-sm border border-cyan/20 rounded-full text-xs font-mono text-cyan tracking-widest uppercase">{project.year}</span>
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-2 bg-card_bg p-8 lg:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-white/30 text-xs font-mono mb-4">
                    <MapPin size={12} />
                    <span>{project.location}</span>
                  </div>
                  <h3 className="font-heading font-light text-2xl text-white tracking-tight mb-4 leading-snug">{project.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed font-light">{project.desc}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
                  {project.stats.map(s => (
                    <div key={s.label}>
                      <p className="font-light text-xl text-cyan leading-none mb-1">{s.val}</p>
                      <p className="text-xs font-mono text-white/30 tracking-widest uppercase leading-tight">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}