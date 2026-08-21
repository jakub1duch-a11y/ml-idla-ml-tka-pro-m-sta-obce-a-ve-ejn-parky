import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Wrench, EyeOff, Waves } from 'lucide-react';

const CORNERS = [
{ icon: ShieldCheck, title: 'Materiál podle prostředí', text: 'Nerez, povrch a průřez konstrukce volíme podle produktové řady, umístění a požadované odolnosti. U městských a prémiových řad používáme také AISI 316L.', side: 'left' },
{ icon: EyeOff, title: 'Integrovaný rozvod', text: 'Kde to konstrukce umožňuje, vedeme vodu uvnitř těla výrobku. Výsledkem je čistší architektonický detail a lépe chráněné vedení.', side: 'left' },
{ icon: Waves, title: 'Trysky podle hydrauliky', text: 'Typ, počet a orientace trysek se volí podle dostupného tlaku, průtoku, výšky prvku a požadované mlžicí zóny.', side: 'right' },
{ icon: Wrench, title: 'Servisovatelný detail', text: 'Konstrukce počítá s přístupem k servisním částem. Výrobek je určen k mlžení a případné jiné užití se posuzuje samostatně podle projektu.', side: 'right' }];


export default function AnatomySection() {
  const left = CORNERS.filter((c) => c.side === 'left');
  const right = CORNERS.filter((c) => c.side === 'right');

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 border-t border-slate-100">
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="mb-10 font-heading text-3xl tracking-[-.02em] text-foreground sm:text-4xl lg:text-5xl">
        Anatomie dobře navrženého mlžítka.
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr_1fr] gap-5 items-center">
        <div className="flex flex-col gap-5">
          {left.map((c, i) =>
          <motion.div key={c.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
          className="border border-slate-200 rounded-2xl p-5 bg-[hsl(var(--muted))]">
              <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3">
                <c.icon size={16} className="text-slate-700" />
              </div>
              <h3 className="mb-1.5 font-heading text-2xl text-foreground">{c.title}</h3>
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
                <c.icon size={16} className="text-slate-700" />
              </div>
              <h3 className="mb-1.5 font-heading text-2xl text-foreground">{c.title}</h3>
              <p className="text-slate-500 leading-relaxed text-base">{c.text}</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>);

}