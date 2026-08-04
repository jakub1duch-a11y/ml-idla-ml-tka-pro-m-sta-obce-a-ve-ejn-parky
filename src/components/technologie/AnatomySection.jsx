import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Wrench, EyeOff, Waves } from 'lucide-react';

const CORNERS = [
{ icon: ShieldCheck, title: 'Prémiový materiál', text: 'Jemně broušená nerezová ocel (trubka Ø42,Ø64.Ø76 × 3 mm, s možností až do 76 mm) zaručuje extrémní odolnost.', side: 'left' },
{ icon: EyeOff, title: 'Skrytá technologie', text: 'Vedení vody je plně integrováno uvnitř těla trubky — čistý design, ochrana proti vandalismu.', side: 'left' },
{ icon: Waves, title: 'Chytré trysky', text: 'Vybaveny zpětným ventilem proti nechtěnému odkapávání vody po vypnutí.', side: 'right' },
{ icon: Wrench, title: 'Organický tvar', text: 'Bezpečný a plynulý design (slouží jako vizuální prvek, není certifikováno jako herní prvek).', side: 'right' }];


export default function AnatomySection() {
  const left = CORNERS.filter((c) => c.side === 'left');
  const right = CORNERS.filter((c) => c.side === 'right');

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-8 py-14 border-t border-slate-100">
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="text-3xl lg:text-4xl text-slate-900 tracking-tight mb-10 [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-medium">
        Anatomie městského mlžítka.
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr_1fr] gap-5 items-center">
        <div className="flex flex-col gap-5">
          {left.map((c, i) =>
          <motion.div key={c.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
          className="border border-slate-200 rounded-2xl p-5 bg-[hsl(var(--card-foreground))]">
              <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3">
                <c.icon size={16} className="text-slate-700" />
              </div>
              <h3 className="text-slate-900 mb-1.5 text-3xl [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-bold">{c.title}</h3>
              <p className="text-slate-500 leading-relaxed text-base">{c.text}</p>
            </motion.div>
          )}
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
        className="rounded-2xl overflow-hidden border border-slate-200">
          <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/eb03ffe38_file_00000000db9072469c9f2e9b61c49933.png"

          alt="Anatomie - Chladící mlžítko a mlžné systémy a prvky"
          className="w-full h-full object-cover aspect-[4/5]" />
          
        </motion.div>

        <div className="flex flex-col gap-5">
          {right.map((c, i) =>
          <motion.div key={c.title} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
          className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3">
                <c.icon size={16} className="text-slate-00" />
              </div>
              <h3 className="text-slate-900 mb-1.5 text-3xl [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-bold">{c.title}</h3>
              <p className="text-slate-500 leading-relaxed text-base">{c.text}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>);

}