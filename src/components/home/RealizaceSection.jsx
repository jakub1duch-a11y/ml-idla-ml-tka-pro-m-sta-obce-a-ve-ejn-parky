import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const imgs = [
  'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/6913bcfef_mlitko-mlzne-mlhoviste.jpg',
  'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/d790e0633_img-4513.jpeg',
  'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/92361308a_img-3531.jpeg',
  'https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/a8b2afb44_fullsizerender.jpeg',
];

export default function RealizaceSection() {
  return (
    <section id="realizace" className="py-24 lg:py-32 bg-ink text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p className="font-mono text-[9px] tracking-widest uppercase text-white/30 mb-3">Realizace · ZOO Praha</p>
            <h2 className="font-heading font-light text-4xl lg:text-6xl leading-tight tracking-tight">
              Šest soch.<br /><span className="text-white/40">Jedna atmosféra.</span>
            </h2>
            <div className="mt-8 space-y-4 text-white/50 text-sm leading-relaxed">
              <p>Mlha, která oživuje areál. Design, který respektuje přírodu. Technologie, která slouží návštěvníkům.</p>
              <p>Výroba a instalace šesti nerezových mlžících soch v ZOO Praha.</p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { val: 'AISI 304', label: 'Nerezová ocel' },
                { val: 'Smart', label: 'Automatický provoz' },
                { val: '6 soch', label: 'Instalace 2024' },
              ].map(s => (
                <div key={s.val} className="border-l border-white/10 pl-4">
                  <p className="font-heading text-white text-xl font-light">{s.val}</p>
                  <p className="font-mono text-[9px] tracking-widest uppercase text-white/30 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <Link to="/kontakt" className="mt-10 inline-block px-8 py-4 border border-white/30 text-white text-xs font-mono tracking-widest uppercase hover:bg-white hover:text-ink transition-all">
              Nezávazná poptávka
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 gap-1">
            {imgs.map((img, i) => (
              <motion.div key={i}
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}>
                <img src={img} alt={`ZOO Praha realizace ${i + 1}`} className="w-full aspect-square object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}