import React from 'react';
import { motion } from 'framer-motion';

const ABOUT_IMG = "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/7268c50b7_generated_b7a87f78.png";

const stats = [
  { value: '250+', label: 'Realizovaných projektů' },
  { value: '15', label: 'Let na trhu' },
  { value: '98%', label: 'Spokojenost klientů' },
  { value: '< 10μm', label: 'Velikost kapek' },
];

export default function AboutSection() {
  return (
    <section id="o-nas" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-hydro text-sm font-mono tracking-widest uppercase mb-3">O nás</p>
            <h2 className="text-3xl lg:text-5xl font-heading font-light text-tectonic tracking-tight mb-8">
              Přinášíme osvěžení do městského prostoru
            </h2>
            <div className="space-y-4 text-tectonic/60 text-base leading-relaxed">
              <p>
                Jsme specialisté na high-pressure mlžné systémy s více než 15letou zkušeností 
                v oboru. Naše technologie mikronizace vody pod vysokým tlakem vytváří jemnou mlhu, 
                která efektivně ochlazuje okolní vzduch až o 12 °C.
              </p>
              <p>
                Spolupracujeme s městy, architekty, developery a gastro provozovnami po celé 
                České republice. Každý projekt navrhujeme na míru — od analýzy prostoru přes 
                3D vizualizaci až po realizaci a servis.
              </p>
              <p>
                Naše systémy využívají materiály nejvyšší kvality — nerezovou ocel 316L, 
                keramické trysky a inteligentní řízení, které minimalizuje spotřebu vody 
                a maximalizuje chladicí účinek.
              </p>
            </div>
          </motion.div>

          {/* Image + Stats */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <img
                src={ABOUT_IMG}
                alt="Engineering workspace with mist system blueprints"
                className="w-full aspect-[16/10] object-cover mb-10"
              />
            </motion.div>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="border-l-2 border-hydro pl-4"
                >
                  <p className="text-2xl lg:text-3xl font-heading font-light text-tectonic">{stat.value}</p>
                  <p className="text-xs text-tectonic/50 tracking-wide uppercase mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}