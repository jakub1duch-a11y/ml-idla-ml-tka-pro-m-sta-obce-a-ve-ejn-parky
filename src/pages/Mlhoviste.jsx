import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Droplets, Sun } from 'lucide-react';

const variants = [
  {
    name: 'START',
    subtitle: 'Pro malá hřiště',
    price: 'od 48 000 Kč',
    specs: ['Plocha do 30 m²', '3 trysky AISI 304', 'Ruční ovládání', 'Zemní vrut'],
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/8139fde88_7fc9b4e64_mlzitko_upraveno_Z09_3544_zmenseno.jpg',
  },
  {
    name: 'PARK',
    subtitle: 'Pro parky & sídliště',
    price: 'od 85 000 Kč',
    specs: ['Plocha do 80 m²', '6 trysek AISI 316L', 'WiFi ovládání', 'Betonový základ'],
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/fbcf274b1_FB_IMG_1782148331764.jpg',
    featured: true,
  },
  {
    name: 'ARENA',
    subtitle: 'Pro velká hřiště & ZOO',
    price: 'od 140 000 Kč',
    specs: ['Plocha do 200 m²', '12+ trysek AISI 316L', 'Smart senzory', 'Vlastní design'],
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/60a14cfc6_43d83e0c0_unnamed-9.png',
  },
];

const features = [
  { icon: Droplets, title: 'Bez mokrého povrchu', desc: 'Kapky 10–50 μm se odpaří dřív, než dopadnou. Děti nesklouznou.' },
  { icon: Shield, title: 'Certifikované materiály', desc: 'Nerezová ocel AISI 304/316L, potravinářský standard. Bezpečné pro děti.' },
  { icon: Zap, title: 'Minimální spotřeba', desc: 'Pouze 6–10 l/h. Bez chemie, bez filtrů, bez složité údržby.' },
  { icon: Sun, title: 'Celodenní provoz', desc: 'Automatický start při 28 °C. Vypne se sám, když ochladí. Smart systém.' },
];

export default function Mlhoviste() {
  return (
    <div className="min-h-screen bg-ink pt-28">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">Mlhoviště pro děti</p>
          <h1 className="font-heading font-black text-4xl lg:text-6xl text-white tracking-tight mb-4">
            Klimaticky aktivní<br />dětský prostor
          </h1>
          <p className="text-white/50 max-w-2xl text-lg">
            Mlhoviště HolmTec — interaktivní mlžné prvky pro dětská hřiště, mateřské školy, ZOO a parky. Bezpečné, designové, energeticky úsporné.
          </p>
        </motion.div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-card_bg border border-white/10 hover:border-cyan/30 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center mb-4 group-hover:bg-cyan/20 transition-all border border-cyan/20">
                <f.icon size={20} className="text-cyan" />
              </div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/50">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Variants */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        <h2 className="font-heading font-black text-3xl text-white mb-8">Konfigurace mlhoviště</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {variants.map((v, i) => (
            <motion.div key={v.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className={`rounded-2xl overflow-hidden border transition-all ${v.featured ? 'border-cyan/40 bg-gradient-to-b from-cyan/10 to-card_bg' : 'border-white/10 bg-card_bg'}`}>
                {v.featured && (
                  <div className="px-6 py-2 bg-cyan/20 border-b border-cyan/20">
                    <span className="text-xs font-mono text-cyan tracking-widest uppercase">Nejoblíbenější</span>
                  </div>
                )}
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <p className="text-xs font-mono text-white/40 tracking-widest uppercase mb-1">{v.subtitle}</p>
                  <h3 className="font-black text-2xl text-white mb-1">{v.name}</h3>
                  <p className="text-cyan font-bold mb-4">{v.price}</p>
                  <ul className="space-y-2 mb-6">
                    {v.specs.map(s => (
                      <li key={s} className="flex items-center gap-2 text-sm text-white/60">
                        <span className="text-cyan">✓</span> {s}
                      </li>
                    ))}
                  </ul>
                  <Link to="/kontakt"
                    className={`block text-center px-6 py-3 text-sm font-bold rounded-full transition-all ${v.featured ? 'bg-cyan text-ink hover:bg-cyan/90 shadow-lg shadow-cyan/25' : 'bg-white/5 text-white border border-white/20 hover:bg-white/10'}`}>
                    Poptat
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Videos */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        <h2 className="font-heading font-black text-3xl text-white mb-8">Mlhoviště v provozu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <video controls playsInline className="w-full aspect-video object-cover rounded-2xl bg-card_bg">
            <source src="https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/f17970686_video_20260619_162927.mp4" type="video/mp4" />
          </video>
          <video controls playsInline className="w-full aspect-video object-cover rounded-2xl bg-card_bg">
            <source src="https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/c7c9d3e68_video_20260619_164025.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="p-12 rounded-2xl bg-gradient-to-r from-cyan/10 to-card_bg border border-cyan/20 text-center">
          <h2 className="font-heading font-black text-3xl text-white mb-3">Navrhněme mlhoviště pro váš prostor</h2>
          <p className="text-white/50 mb-8">Konzultace zdarma. 3D vizualizace do 48 h. Montáž za jeden den.</p>
          <Link to="/kontakt"
            className="inline-flex items-center gap-2 px-8 py-4 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-xl shadow-cyan/30">
            Nezávazná poptávka <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}