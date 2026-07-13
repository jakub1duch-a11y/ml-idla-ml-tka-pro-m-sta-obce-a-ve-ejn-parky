import React from 'react';
import { motion } from 'framer-motion';
import { Trees, Landmark, UtensilsCrossed, Baby } from 'lucide-react';

const PLACES = [
  { icon: Trees, title: 'Parky a odpočinkové zóny' },
  { icon: Landmark, title: 'Náměstí, křížení ulic a rozcestí' },
  { icon: UtensilsCrossed, title: 'Venkovní restaurační zahrádky' },
  { icon: Baby, title: 'Okolí dětských hřišť (zóna pro osvěžení rodičů a dětí)' },
];

export default function IntegrationSection() {
  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-8 py-14 border-t border-slate-100 bg-slate-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-10">
        <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="rounded-2xl overflow-hidden border border-slate-200 order-2 lg:order-1">
          <img
            src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/a74f3279a_generated_image.png"
            alt="OSTEV integrace do veřejného prostoru"
            className="w-full h-full object-cover aspect-[4/3]"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="order-1 lg:order-2">
          <h2 className="font-heading font-light text-2xl lg:text-3xl text-slate-900 tracking-tight mb-5">
            OSTEV: Ideální integrace do veřejného i soukromého prostoru
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {PLACES.map((p) => (
              <div key={p.title} className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-2">
                  <p.icon size={16} className="text-slate-700" />
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">{p.title}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="text-center text-slate-500 text-sm max-w-2xl mx-auto">
        Prvek, který harmonicky doplňuje prostor a okamžitě zvyšuje jeho užitnou hodnotu v letních měsících.
      </motion.p>
    </div>
  );
}