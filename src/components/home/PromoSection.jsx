import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';

const codes = [
  { code: 'LÉTO2026', label: '10 %', desc: 'Sleva na všechny produkty Stéblo', min: 'Min. objednávka 3 900 Kč', until: '31. 8. 2026' },
  { code: 'MRAK2026', label: '15 %', desc: 'Sleva na GATE a velkoformátové instalace', min: 'Min. objednávka 85 000 Kč', until: '31. 7. 2026' },
  { code: 'ZAHRADA26', label: 'Doprava zdarma', desc: 'Doprava zdarma + montáž za polokolik', min: 'Objednávky nad 15 000 Kč', until: '15. 9. 2026' },
];

const promoImages = [
  'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/f01bc8d2c_img-4587.jpeg',
  'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/af3c01f8d_3695-fullsizerender-1.jpeg',
  'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/1f4f0ba99_img-3501.jpg',
  'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/62841e4f5_img-5153.jpeg',
];

export default function PromoSection() {
  return (
    <section className="py-24 bg-ink">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan/10 border border-cyan/20 text-xs font-mono text-cyan tracking-widest uppercase mb-4">
            ☀️ Limitovaná nabídka · Léto 2026
          </div>
          <h2 className="font-heading font-light text-4xl lg:text-5xl text-white tracking-tight mb-3">
            Slevové kódy<br /><span className="text-cyan">+ soutěž o sochu</span>
          </h2>
          <p className="text-white/50 max-w-xl">
            Tři exkluzivní slevy až 15 %, soutěž o mlžnou sochu a výzva pro Instagram. Platí do 31. 8. 2026.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-4">
            {codes.map((c, i) => (
              <motion.div key={c.code} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-card_bg border border-white/10 flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan font-black text-lg leading-none text-center">{c.label}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white mb-1">{c.desc}</p>
                  <p className="text-xs text-white/40 mb-2">{c.min} · Platí do: {c.until}</p>
                  <code className="inline-block px-3 py-1 bg-white/10 rounded-lg text-xs font-mono text-cyan tracking-widest">{c.code}</code>
                </div>
              </motion.div>
            ))}
            <Link to="/kontakt"
              className="block text-center px-7 py-3.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/25 mt-4">
              Zobrazit kódy & soutěž
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {promoImages.map((src, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="aspect-square overflow-hidden rounded-xl">
                <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}