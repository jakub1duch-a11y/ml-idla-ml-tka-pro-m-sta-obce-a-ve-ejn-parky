import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Wrench, EyeOff, Waves } from 'lucide-react';

const CORNERS = [
  { icon: ShieldCheck, title: 'Prémiový materiál', text: 'Jemně broušená nerezová ocel (trubka Ø 42 × 3 mm, s možností až do 76 mm) zaručuje extrémní odolnost.', side: 'left' },
  { icon: EyeOff, title: 'Skrytá technologie', text: 'Vedení vody je plně integrováno uvnitř těla trubky — čistý design, ochrana proti vandalismu.', side: 'left' },
  { icon: Waves, title: 'Chytré trysky', text: 'Vybaveny zpětným ventilem proti nechtěnému odkapávání vody po vypnutí.', side: 'right' },
  { icon: Wrench, title: 'Organický tvar', text: 'Bezpečný a plynulý design (slouží jako vizuální prvek, není certifikováno jako herní prvek).', side: 'right' },
];

export default function AnatomySection() {
  const left = CORNERS.filter((c) => c.side === 'left');
  const right = CORNERS.filter((c) => c.side === 'right');

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-8 py-14 border-t border-slate-100">
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight mb-10">
        Anatomie městského mlžítka.
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr_1fr] gap-5 items-center">
        <div className="flex flex-col gap-5">
          {left.map((c, i) => (
            <motion.div key={c.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3">
                <c.icon size={16} className="text-slate-700" />
              </div>
              <h3 className="text-slate-900 font-medium text-sm mb-1.5">{c.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{c.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="rounded-2xl overflow-hidden border border-slate-200">
          <img
            src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6655535c2_generated_image.png"
            alt="Anatomie městského mlžítka"
            className="w-full h-full object-cover aspect-[4/5]"
          />
        </motion.div>

        <div className="flex flex-col gap-5">
          {right.map((c, i) => (
            <motion.div key={c.title} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3">
                <c.icon size={16} className="text-slate-700" />
              </div>
              <h3 className="text-slate-900 font-medium text-sm mb-1.5">{c.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{c.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}