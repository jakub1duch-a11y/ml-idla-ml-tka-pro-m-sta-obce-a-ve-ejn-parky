import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const variants = [
  {
    name: 'Mlhoviště START',
    label: 'Nejoblíbenější',
    size: '3 × 3 m',
    desc: '1 mlžná socha Kids + dopadová plocha 9 m². Ideální pro školky a zahrady.',
    price: 'od 48 000 Kč',
    image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/65ac64fd3_mlhoviste-t-3.png',
  },
  {
    name: 'Mlhoviště PARK',
    label: 'Pro parky',
    size: '6 × 6 m',
    desc: '3 mlžné sochy + dopadové plochy 36 m². Smart ventil a aplikace.',
    price: 'od 128 000 Kč',
    image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/acb98f1a6_img-4513.jpeg',
  },
  {
    name: 'Mlhoviště ARENA',
    label: 'Velkoformát',
    size: '12 × 8 m',
    desc: '6–10 mlžných soch + dopadové plochy 96 m². Smart systém s čidlem.',
    price: 'od 290 000 Kč',
    image: 'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/82e33688f_img-3531.jpeg',
  },
];

const features = [
  { icon: '☀️', title: 'Do každého počasí', desc: 'Funguje za slunce, větru i oblačna.' },
  { icon: '💧', title: 'Vždy bez kaluží', desc: 'Mikrotrysky odpařují vodu ve vzduchu.' },
  { icon: '🔧', title: 'Bezúdržbové', desc: 'Nerezová ocel, žádná chemie, minimální servis.' },
  { icon: '🟢', title: 'Měkké na dopad', desc: 'Certifikované gumové dopadové plochy.' },
  { icon: '⚡', title: 'Bez elektřiny', desc: 'Funguje při běžném tlaku vody, bez elektřiny.' },
  { icon: '👶', title: 'Bezpečné pro děti', desc: 'Hladké svary, potravinářská nerezová ocel.' },
];

export default function Mlhoviste() {
  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-ink py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="font-mono text-[9px] tracking-widest uppercase text-white/30 mb-3">Mlžná hřiště</p>
          <h1 className="font-heading font-light text-4xl lg:text-6xl text-white tracking-tight">
            Mlhoviště — hřiště pro všechny
          </h1>
          <p className="mt-5 text-white/40 max-w-xl text-base">
            Atraktivní pro děti i rodiče. Bez elektřiny — funguje na běžný vodovodní tlak.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {features.map(f => (
              <div key={f.title} className="text-center">
                <p className="text-2xl mb-2">{f.icon}</p>
                <p className="font-heading text-sm text-ink font-medium">{f.title}</p>
                <p className="text-xs text-ink/40 mt-1 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <p className="font-mono text-[9px] tracking-widest uppercase text-ink/30 mb-3">Varianty</p>
        <h2 className="font-heading font-light text-3xl lg:text-5xl text-ink mb-14">Zvolte svou velikost</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {variants.map((v, i) => (
            <motion.div key={v.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white border border-steel/30 overflow-hidden group">
              <div className="aspect-[4/3] overflow-hidden bg-fog">
                <img src={v.image} alt={v.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-7">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[9px] tracking-widest uppercase text-ink/30">{v.label}</span>
                  <span className="font-mono text-[9px] tracking-widest text-hydro bg-hydro/10 px-2 py-0.5">{v.size}</span>
                </div>
                <h3 className="font-heading text-2xl font-light text-ink">{v.name}</h3>
                <p className="text-sm text-ink/50 mt-2 leading-relaxed">{v.desc}</p>
                <p className="font-heading text-xl text-ink mt-5 font-light">{v.price}</p>
                <Link to="/kontakt"
                  className="mt-5 inline-block px-6 py-3 border border-ink text-ink text-xs font-mono tracking-widest uppercase hover:bg-ink hover:text-white transition-all">
                  Poptávka
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex gap-4 justify-center">
          <a href="mailto:obchod1@holmtec.cz?subject=Katalog 2026"
            className="px-8 py-4 border border-steel text-ink text-xs font-mono tracking-widest uppercase hover:border-ink transition-all">
            Nový katalog 2026
          </a>
          <Link to="/kontakt"
            className="px-8 py-4 bg-ink text-white text-xs font-mono tracking-widest uppercase hover:bg-ink/80 transition-all">
            Více o mlhovištích
          </Link>
        </div>
      </div>

      {/* ZOO Praha reference */}
      <div className="bg-fog py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center">
          <p className="font-mono text-[9px] tracking-widest uppercase text-ink/30 mb-3">Reference</p>
          <p className="font-heading text-2xl text-ink font-light">ZOO Praha · 6 mlžných soch · 2024</p>
          <p className="text-sm text-ink/40 mt-2 max-w-md mx-auto">Bezpečné pro děti. Přirozené pro zvířata. Nerezová ocel AISI 304.</p>
        </div>
      </div>
    </div>
  );
}