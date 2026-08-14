import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const ROWS = [
{ label: 'Způsob uchycení', permanent: 'Chemické kotvy M10 do betonu', mobile: 'Zemní vrut do zahrady' },
{ label: 'Přípojka vody', permanent: 'Závit R1"', mobile: 'Standardní zahradní hadice' },
{ label: 'Vizuální prvek', permanent: 'Skrytá patka pod terénem', mobile: 'Viditelný vrut / rychlospojka' },
{ label: 'Typické využití', permanent: 'Náměstí, admin. centra', mobile: 'Soukromé zahrady, trávníky' }];


export default function InstallationComparisonSection() {
  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 border-t border-slate-100 bg-slate-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading font-light text-xl text-slate-900 tracking-tight mb-2">1. Trvalé kotvení (Profesionální)</h2>
          <ul className="text-sm text-slate-500 space-y-1.5 list-disc list-inside">
            <li>Ideální pro veřejná prostranství a náměstí.</li>
            <li>Využívá skrytou patku pod úrovní terénu pro nerušený design.</li>
          </ul>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
          <h2 className="font-heading font-light text-xl text-slate-900 tracking-tight mb-2">2. Mobilní instalace (Zahradní)</h2>
          <ul className="text-sm text-slate-500 space-y-1.5 list-disc list-inside">
            <li>Optimální pro soukromé zahrady.</li>
            <li>Umožňuje snadné přemístění a sezónní využití bez nutnosti betonáže.</li>
          </ul>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-8">
        <p className="text-center font-mono tracking-widest uppercase text-slate-400 py-4 border-b border-slate-200 text-xs">
          Technické srovnání požadavků pro oba typy instalace
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
          <div>
            {ROWS.map((r) =>
            <div key={r.label} className="flex items-center justify-between px-6 py-3 border-b border-slate-100 last:border-0 bg-gray-300">
                <span className="text-xs text-slate-400">{r.label}</span>
                <span className="text-sm text-slate-900 font-medium text-right">{r.permanent}</span>
              </div>
            )}
          </div>
          <div>
            {ROWS.map((r) =>
            <div key={r.label} className="flex items-center justify-between px-6 py-3 border-b border-slate-100 last:border-0 bg-[hsl(var(--ring))]">
                <span className="text-xs text-[hsl(var(--background))]">{r.label}</span>
                <span className="text-sm font-medium text-right text-[hsl(var(--background))]">{r.mobile}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={18} className="text-red-500" />
          <h3 className="text-red-700 font-medium text-sm">Bezpečnost a normy</h3>
        </div>
        <div className="space-y-3 text-sm text-red-700/90">
          <p><span className="font-medium">Není určeno jako herní prvek:</span> Mlžítko nesplňuje požadavky na zařízení dětských hřišť dle normy ČSN EN 1176.</p>
          <p><span className="font-medium">Omezení konstrukce:</span> Zařízení je určeno výhradně k mlžení; konstrukce není dimenzována pro lezení nebo jiné zatěžování osobami.</p>
          <p><span className="font-medium">Záruční podmínky:</span> Případné poškození způsobené nevhodným používáním (např. jako herní prvek) není kryto zárukou.</p>
        </div>
      </motion.div>
    </div>);

}