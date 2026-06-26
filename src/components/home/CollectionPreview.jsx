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
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/60a14cfc6_43d83e0c0_unnamed-9.png',
  },
  {
    name: 'LINEA EL70',
    category: 'Veřejná prostranství',
    tagline: 'Minimalistická čistota. Maximální efekt.',
    spec: '70×70×3 mm · Čtvercový profil · AISI 304',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/c90bbf42d_C-MltkoLINEA_CE70_single-1.png',
  },
  {
    name: 'GATE_60',
    category: 'Brány & Portály',
    tagline: 'Vstupní portál z mlhy.',
    spec: 'TR60×3 mm · šíře 3 m · výška 2,1 m · AISI 304',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/fbcf274b1_FB_IMG_1782148331764.jpg',
  },
  {
    name: 'Kids Edition',
    category: 'Hřiště & Školy',
    tagline: 'Hravý tvar. Bezpečná mlha.',
    spec: 'Hladké svary · Potravinářská nerez · AISI 304',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/8139fde88_7fc9b4e64_mlzitko_upraveno_Z09_3544_zmenseno.jpg',
  },
  {
    name: 'Volavka',
    category: 'Zahrady & Terasy',
    tagline: 'Elegance pro soukromé zahrady.',
    spec: 'TR60 · Oblouk 120° · Zemní vrut',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/1035553df_FB_IMG_1782148329157.jpg',
  },
  {
    name: 'Smart Control',
    category: 'Technologie',
    tagline: 'Mlha pod kontrolou odkudkoli.',
    spec: 'WiFi + BT · iOS & Android · Čidla teploty',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3aa6b0337_51da7b088_Social_Media_Video_Ads_A_hand_holds_a_smartphone_displaying_the_Zahrada_KQFVTEiZ1.png',
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