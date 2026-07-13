import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, Layers, Wind, Compass } from 'lucide-react';

const FORM = [
  { icon: Sprout, title: 'Vzhled', text: 'Vychází z tradičního organického tvaru stromu.' },
  { icon: Layers, title: 'Začlenění', text: 'Umožňuje naprosto nenásilné a elegantní zasazení do jakéhokoliv veřejného i soukromého prostoru.' },
];
const FUNCTION = [
  { icon: Wind, title: 'Mikroklima', text: 'Vodní mlha aktivně ochlazuje okolí a zlepšuje komfort návštěvníků.' },
  { icon: Compass, title: 'Inteligentní rozcestník', text: 'Větve mlžítka lze nasměrovat k zajímavým bodům v okolí, čímž slouží jako přirozený orientační bod.' },
];

export default function FormFunctionSection() {
  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-8 py-14 border-t border-slate-100">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
        <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Model OSTEV</p>
        <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight">Forma a funkce mlžítka OSTEV</h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-5">Forma (Organická integrace)</p>
          <div className="space-y-5">
            {FORM.map((f) => (
              <div key={f.title} className="flex gap-4">
                <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  <f.icon size={16} className="text-slate-700" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-medium text-sm mb-1">{f.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-5">Funkce (Ochlazení a orientace)</p>
          <div className="space-y-5">
            {FUNCTION.map((f) => (
              <div key={f.title} className="flex gap-4">
                <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  <f.icon size={16} className="text-slate-700" />
                </div>
                <div>
                  <h3 className="text-slate-900 font-medium text-sm mb-1">{f.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}