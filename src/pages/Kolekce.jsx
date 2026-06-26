import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = ['Vše', 'Rezidenční', 'Komerční', 'Art instalace', 'Outdoor', 'Příslušenství'];

const products = [
  {
    name: 'MRAK',
    category: 'Art instalace',
    tagline: 'Organické křivky. Nebeský dotek.',
    desc: 'Jedinečné mlžítko ve tvaru stilizovaného mraku. Organické křivky z nerezové trubky TR40×3 mm s 5 kvalitními trysky.',
    spec: 'AISI 304',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/60a14cfc6_43d83e0c0_unnamed-9.png',
  },
  {
    name: 'LINEA EL70',
    category: 'Komerční',
    tagline: 'Minimalistická čistota. Maximální efekt.',
    desc: 'Designové mlžítko z čtvercového profilu 70×70×3 mm. Minimalistický design pro moderní architekturu.',
    spec: 'AISI 304',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/c90bbf42d_C-MltkoLINEA_CE70_single-1.png',
  },
  {
    name: 'GATE_60',
    category: 'Komerční',
    tagline: 'Vstupní portál z mlhy.',
    desc: 'Třímetrová mlžná brána z trubek TR60×3 z oceli 1.4301 s 5 tryskami. Šíře 3 m, výška 2,1 m.',
    spec: 'AISI 304',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/fbcf274b1_FB_IMG_1782148331764.jpg',
  },
  {
    name: 'Kids Edition',
    category: 'Outdoor',
    tagline: 'Hravý tvar. Bezpečná mlha.',
    desc: 'Mlžítka pro dětská hřiště a mateřské školy. Bez ostrých hran, hladké svary, potravinářská nerez.',
    spec: 'AISI 304',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/8139fde88_7fc9b4e64_mlzitko_upraveno_Z09_3544_zmenseno.jpg',
  },
  {
    name: 'Volavka',
    category: 'Rezidenční',
    tagline: 'Elegance pro soukromé zahrady.',
    desc: 'Subtilní mlžítko s elegantně zahnutým ramenem TR60. Minimalistický oblouk 120°. Mobilní varianta se zemním vrutem.',
    spec: 'AISI 304',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/1035553df_FB_IMG_1782148329157.jpg',
  },
  {
    name: 'Smart Control',
    category: 'Příslušenství',
    tagline: 'Mlha pod kontrolou odkudkoli.',
    desc: 'WiFi a Bluetooth ovládání mlžítek přes mobilní aplikaci HolmTec (iOS & Android). Automatické scénáře.',
    spec: 'WiFi + BT',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3aa6b0337_51da7b088_Social_Media_Video_Ads_A_hand_holds_a_smartphone_displaying_the_Zahrada_KQFVTEiZ1.png',
  },
];

export default function Kolekce() {
  const [active, setActive] = useState('Vše');
  const filtered = active === 'Vše' ? products : products.filter(p => p.category === active);

  return (
    <div className="min-h-screen bg-ink pt-28">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">NAŠE PRODUKTY</p>
          <h1 className="font-heading font-black text-4xl lg:text-6xl text-white tracking-tight">Mlžné systémy</h1>
        </motion.div>
      </div>

      {/* Filter */}
      <div className="border-y border-white/10 bg-ink/95 sticky top-[105px] z-40 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex gap-2 overflow-x-auto py-3">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-widest uppercase whitespace-nowrap transition-all ${active === cat ? 'bg-cyan text-ink font-bold' : 'text-white/50 hover:text-white hover:bg-white/10'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Link to="/kontakt" className="group block bg-card_bg rounded-2xl overflow-hidden border border-white/10 hover:border-cyan/40 transition-all duration-300">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-2">{p.category}</p>
                  <h3 className="text-xl font-bold text-white mb-1">{p.name}</h3>
                  <p className="text-sm text-white/50 mb-3">{p.tagline}</p>
                  <p className="text-xs text-white/30 leading-relaxed mb-4">{p.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-white/30 bg-white/5 px-2 py-1 rounded-lg">{p.spec}</span>
                    <div className="flex items-center gap-1 text-xs text-cyan font-medium">
                      Cena na vyžádání <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 p-10 rounded-2xl bg-gradient-to-r from-cyan/10 to-cyan/5 border border-cyan/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-2">Nový katalog 2026</p>
            <h3 className="font-heading font-black text-2xl text-white">Celá kolekce v jednom PDF.</h3>
            <p className="text-sm text-white/40 mt-1">Technické listy, výkresy, ceníky a referenční fotografie všech modelů.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="mailto:obchod1@holmtec.cz?subject=Katalog 2026 — zaslat PDF"
              className="px-7 py-3.5 border border-white/20 text-white text-sm font-medium rounded-full hover:bg-white/10 transition-all">
              Zaslat katalog na e-mail
            </a>
            <Link to="/kontakt"
              className="px-7 py-3.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/25">
              Nezávazná poptávka
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}