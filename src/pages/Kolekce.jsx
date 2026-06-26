import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = ['Vše', 'Parky & Zahrady', 'Veřejná prostranství', 'Brány & Portály', 'Hřiště & Školy', 'Zahrady & Terasy', 'Smart & Tech'];

const products = [
  {
    name: 'MRAK',
    category: 'Parky & Zahrady',
    tagline: 'Organické křivky. Nebeský dotek.',
    desc: 'Jedinečné mlžítko ve tvaru stilizovaného mraku. Organické křivky z nerezové trubky TR40×3 mm s 5 kvalitními trysky. Broušený saténový povrch.',
    spec: 'AISI 304',
    material: 'TR40×3 mm · 5 trysek',
    image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/2a4a97b54_Social_Media_Video_Ads_A_metallic_abstract_sculpture_sprays_mist_JyR_T8pt.png',
  },
  {
    name: 'LINEA EL70',
    category: 'Veřejná prostranství',
    tagline: 'Minimalistická čistota. Maximální efekt.',
    desc: 'Designové mlžítko z čtvercového profilu 70×70×3 mm. Minimalistický design pro moderní architekturu.',
    spec: 'AISI 304',
    material: '70×70×3 mm · Čtvercový profil',
    image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/c100890c0_Social_Media_Video_Ads_In_a_stark_monochromatic_style_a_metal_pipe_VmFBiVkY.png',
  },
  {
    name: 'GATE_60',
    category: 'Brány & Portály',
    tagline: 'Vstupní portál z mlhy.',
    desc: 'Třímetrová mlžná brána z trubek TR60×3 z oceli 1.4301 s 5 tryskami. Šíře 3 m, výška 2,1 m.',
    spec: 'AISI 304',
    material: 'TR60×3 · šíře 3 m · výška 2,1 m',
    image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/450804ee4_Social_Media_Video_Ads_In_a_minimalist_abstract_style_a_metallic_7pWGCuLQ.png',
  },
  {
    name: 'Kids Edition',
    category: 'Hřiště & Školy',
    tagline: 'Hravý tvar. Bezpečná mlha.',
    desc: 'Mlžítka pro dětská hřiště a mateřské školy. Bez ostrých hran, hladké svary, potravinářská nerez.',
    spec: 'AISI 304',
    material: 'Potravinářská nerez · Hladké svary',
    image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/f3cc7e7b8_mlhoviste-t-3.png',
  },
  {
    name: 'Volavka',
    category: 'Zahrady & Terasy',
    tagline: 'Elegance pro soukromé zahrady.',
    desc: 'Subtilní mlžítko s elegantně zahnutým ramenem TR60. Minimalistický oblouk 120°. Mobilní varianta se zemním vrutem.',
    spec: 'AISI 304',
    material: 'TR60 · Oblouk 120° · Zemní vrut',
    image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/d6c2932cf_Social_Media_Video_Ads_In_a_minimalist_abstract_style_a_modern_metal_9yZ29dM6.png',
  },
  {
    name: 'Smart Control',
    category: 'Smart & Tech',
    tagline: 'Mlha pod kontrolou odkudkoli.',
    desc: 'WiFi a Bluetooth ovládání mlžítek přes mobilní aplikaci HolmTec (iOS & Android). Automatické scénáře — mlha se spustí sama, když je nejpotřebnější.',
    spec: 'AISI 304',
    material: 'WiFi + BT · iOS & Android',
    image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/6a6b4eb5a_Social_Media_Video_Ads_A_hand_holds_a_smartphone_displaying_the_Zahrada_KQFVTEiZ.png',
  },
];

const accessories = [
  {
    name: 'Zemní vrut',
    subtitle: 'Mobilní kotvení bez betonu.',
    desc: 'Nerezový zemní vrut ∅60 mm pro rychlou instalaci mlžných soch bez betonového základu.',
    image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/8fd8247c3_Copilot_20260506_023304.png',
  },
  {
    name: 'Kotvící patka',
    subtitle: 'Trvalé ukotvení do betonu.',
    desc: 'Nerezová kotvící patka pro pevnou instalaci mlžných soch. Chemické kotvy M10.',
    image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/304a79acc_Copilot_20260506_022439.png',
  },
];

export default function Kolekce() {
  const [active, setActive] = useState('Vše');

  const filtered = active === 'Vše' ? products : products.filter(p => p.category === active);

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-ink py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="font-mono text-[9px] tracking-widest uppercase text-white/30 mb-3">Produktová řada 2026</p>
          <h1 className="font-heading font-light text-4xl lg:text-6xl text-white tracking-tight">Mlžné sochy</h1>
        </div>
      </div>

      {/* Filter */}
      <div className="border-b border-steel bg-white sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex gap-1 overflow-x-auto py-3 no-scrollbar">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              className={`px-4 py-2 font-mono text-[9px] tracking-widest uppercase whitespace-nowrap transition-all ${active === cat ? 'bg-ink text-white' : 'text-ink/50 hover:text-ink'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {filtered.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to="/kontakt" className="group block bg-white border border-steel/30 overflow-hidden hover:border-ink/30 transition-all">
                <div className="aspect-square overflow-hidden bg-fog">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[9px] tracking-widest uppercase text-ink/30 mb-1">{p.category} · 2026</p>
                      <h3 className="font-heading text-2xl text-ink font-light">{p.name}</h3>
                      <p className="text-sm text-ink/50 mt-1">{p.tagline}</p>
                    </div>
                    <span className="font-mono text-[9px] tracking-widest bg-fog px-2 py-1 text-ink/40 whitespace-nowrap">{p.spec}</span>
                  </div>
                  <p className="text-xs text-ink/40 mt-4 leading-relaxed">{p.desc}</p>
                  <p className="font-mono text-[10px] text-hydro mt-3 tracking-wide">{p.material}</p>
                  <div className="mt-5 text-xs font-mono tracking-widest uppercase text-ink/30 group-hover:text-hydro transition-colors">
                    Detail produktu →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Accessories */}
        <div className="mt-20">
          <p className="font-mono text-[9px] tracking-widest uppercase text-ink/30 mb-2">Kotvení & příslušenství</p>
          <h2 className="font-heading font-light text-3xl text-ink mb-10">Kotvící systémy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
            {accessories.map(a => (
              <div key={a.name} className="flex gap-6 bg-white border border-steel/30 p-6">
                <img src={a.image} alt={a.name} className="w-24 h-24 object-cover flex-shrink-0 bg-fog" />
                <div>
                  <p className="font-mono text-[9px] tracking-widest uppercase text-ink/30 mb-1">Příslušenství & Kotvení</p>
                  <h3 className="font-heading text-xl text-ink font-light">{a.name}</h3>
                  <p className="text-sm text-ink/50 mt-0.5">{a.subtitle}</p>
                  <p className="text-xs text-ink/40 mt-2">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Catalog CTA */}
        <div className="mt-16 bg-ink text-white p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="font-mono text-[9px] tracking-widest uppercase text-white/30 mb-2">Nový katalog 2026</p>
            <h3 className="font-heading text-2xl font-light">Celá kolekce v jednom PDF.</h3>
            <p className="text-sm text-white/40 mt-1">Technické listy, výkresy, ceníky a referenční fotografie všech modelů.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="mailto:obchod1@holmtec.cz?subject=Katalog 2026 — zaslat PDF"
              className="px-8 py-4 border border-white/30 text-white text-xs font-mono tracking-widest uppercase hover:bg-white hover:text-ink transition-all">
              Zaslat katalog na e-mail
            </a>
            <Link to="/kontakt"
              className="px-8 py-4 bg-white text-ink text-xs font-mono tracking-widest uppercase hover:bg-white/90 transition-all">
              Nezávazná poptávka
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}