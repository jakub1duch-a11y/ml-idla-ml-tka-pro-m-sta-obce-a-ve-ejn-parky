import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const products = [
  {
    name: 'MRAK',
    category: 'Parky & Zahrady',
    tagline: 'Organické křivky. Nebeský dotek.',
    spec: 'TR40×3 mm · 5 trysek · AISI 304',
    image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/2a4a97b54_Social_Media_Video_Ads_A_metallic_abstract_sculpture_sprays_mist_JyR_T8pt.png',
  },
  {
    name: 'LINEA EL70',
    category: 'Veřejná prostranství',
    tagline: 'Minimalistická čistota. Maximální efekt.',
    spec: '70×70×3 mm · Čtvercový profil · AISI 304',
    image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/c100890c0_Social_Media_Video_Ads_In_a_stark_monochromatic_style_a_metal_pipe_VmFBiVkY.png',
  },
  {
    name: 'GATE_60',
    category: 'Brány & Portály',
    tagline: 'Vstupní portál z mlhy.',
    spec: 'TR60×3 mm · šíře 3 m · výška 2,1 m · AISI 304',
    image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/450804ee4_Social_Media_Video_Ads_In_a_minimalist_abstract_style_a_metallic_7pWGCuLQ.png',
  },
  {
    name: 'Kids Edition',
    category: 'Hřiště & Školy',
    tagline: 'Hravý tvar. Bezpečná mlha.',
    spec: 'Hladké svary · Potravinářská nerez · AISI 304',
    image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/f3cc7e7b8_mlhoviste-t-3.png',
  },
  {
    name: 'Volavka',
    category: 'Zahrady & Terasy',
    tagline: 'Elegance pro soukromé zahrady.',
    spec: 'TR60 · Oblouk 120° · Zemní vrut',
    image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/d6c2932cf_Social_Media_Video_Ads_In_a_minimalist_abstract_style_a_modern_metal_9yZ29dM6.png',
  },
  {
    name: 'Smart Control',
    category: 'Technologie',
    tagline: 'Mlha pod kontrolou odkudkoli.',
    spec: 'WiFi + BT · iOS & Android · Čidla teploty',
    image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/6a6b4eb5a_Social_Media_Video_Ads_A_hand_holds_a_smartphone_displaying_the_Zahrada_KQFVTEiZ.png',
  },
];

export default function CollectionPreview() {
  return (
    <section className="py-24 lg:py-32 bg-fog">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="font-mono text-[10px] tracking-widest uppercase text-ink/30 mb-3">Produktová řada 2026</p>
            <h2 className="font-heading font-light text-4xl lg:text-6xl text-ink tracking-tight">
              Každý kus je unikát.
            </h2>
          </div>
          <Link to="/kolekce" className="hidden md:flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-ink/40 hover:text-hydro transition-colors">
            Celá kolekce <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {products.map((p, i) => (
            <motion.div key={p.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.5, delay: i * 0.07 }}>
              <Link to="/kolekce" className="group block bg-white overflow-hidden">
                <div className="aspect-square overflow-hidden bg-mist">
                  <img src={p.image} alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6 border-t border-steel/30">
                  <p className="font-mono text-[9px] tracking-widest uppercase text-ink/30 mb-1">{p.category}</p>
                  <h3 className="font-heading text-xl text-ink font-light">{p.name}</h3>
                  <p className="text-sm text-ink/50 mt-1">{p.tagline}</p>
                  <p className="font-mono text-[10px] text-hydro mt-3 tracking-wide">{p.spec}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 md:hidden text-center">
          <Link to="/kolekce" className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-ink/40 hover:text-hydro transition-colors">
            Celá kolekce <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}