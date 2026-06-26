import React from 'react';
import { motion } from 'framer-motion';

export default function TechSection() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p className="font-mono text-[9px] tracking-widest uppercase text-ink/30 mb-3">Technologie mlžení</p>
            <h2 className="font-heading font-light text-4xl lg:text-6xl text-ink tracking-tight leading-tight">
              Mikromlha.<br />Maximální efekt.
            </h2>
            <p className="mt-6 text-ink/50 text-base leading-relaxed">
              Tlaková mlha bez mokrého povrchu. Mikrotrysky produkují kapky 10–50 μm, které se odpařují okamžitě ve vzduchu — absorbují teplo z okolí a ochlazují prostor až o 10 °C.
            </p>
            <div className="mt-10 space-y-5">
              {[
                { title: 'Evaporace', desc: 'Kapky 10–50 μm se odpařují dříve, než dopadnou na zem. Žádný mokrý povrch.' },
                { title: 'Inteligentní řízení', desc: 'Automatické scénáře — mlha se spustí sama při 28 °C. Aplikace iOS & Android.' },
                { title: 'Tichý provoz', desc: 'Nízkotlaké trysky. Průtok 0,05 l/min na trysku. Provoz je přirozený a nenásilný.' },
                { title: 'Čistší vzduch', desc: 'Mlha snižuje prach a pylové částice v okolí. Zdravé prostředí.' },
              ].map((f, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-px bg-hydro flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-heading text-ink font-medium">{f.title}</p>
                    <p className="text-sm text-ink/50 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <img
              src="https://media.base44.com/images/public/69e1b467582d85dada1b0fe9/a94dc72e7_img-4513.jpeg"
              alt="Detail mikrotrysky mlžné sochy"
              className="w-full aspect-[4/5] object-cover"
            />
            <div className="mt-1 bg-ink text-white p-6 grid grid-cols-2 gap-6">
              {[
                { val: '93%', label: 'Provozní efektivita' },
                { val: '100%', label: 'Spokojení klienti' },
                { val: '< 10 l/h', label: 'Spotřeba vody' },
                { val: '10+ let', label: 'Životnost oceli' },
              ].map(s => (
                <div key={s.val}>
                  <p className="font-heading text-2xl font-light">{s.val}</p>
                  <p className="font-mono text-[9px] tracking-widest uppercase text-white/30 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}