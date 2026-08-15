import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, CheckCircle2 } from 'lucide-react';

function SpecCard({ row }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = row.icon || Info;

  return (
    <button type="button" onClick={() => row.desc && setExpanded((v) => !v)}
      className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_30px_rgba(15,23,42,.06)]">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[#0b4860]">
          <Icon size={17} strokeWidth={1.8} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-mono uppercase tracking-[.14em] text-slate-400">{row.label}</span>
          <span className="mt-1.5 block text-base font-semibold leading-snug text-slate-900">{row.value}</span>
          {row.desc && <span className="mt-2 block text-xs leading-relaxed text-slate-500 sm:hidden">{row.desc}</span>}
          <AnimatePresence initial={false}>
            {expanded && row.desc && (
              <motion.span initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mt-2 hidden overflow-hidden text-xs leading-relaxed text-slate-500 sm:block">{row.desc}</motion.span>
            )}
          </AnimatePresence>
        </span>
      </div>
    </button>
  );
}

export default function SpecsTab({ product, techRows }) {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:sticky lg:top-44">
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Technické specifikace</p>
            <h2 className="font-heading font-light text-4xl lg:text-5xl text-slate-900 tracking-tight mb-5">
              Parametry bez<br /><span className="text-slate-400">technického chaosu.</span>
            </h2>
            <p className="text-slate-500 text-base font-light leading-relaxed">
              Klíčové údaje jsou viditelné hned. Na mobilu je vysvětlení vždy zobrazené; na desktopu lze kartu rozbalit pro detail.
            </p>
            {product?.image_url && <div className="mt-7 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100"><img src={product.image_url} alt={`${product.name} – technický pohled`} className="aspect-[4/3] w-full object-cover" loading="lazy" /></div>}
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-700" />
              <p className="text-sm leading-relaxed text-emerald-900"><strong>Nízkotlaký princip:</strong> přímé napojení na běžný vodovodní řad, bez vysokotlakého čerpadla.</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="grid gap-3 sm:grid-cols-2">
              {techRows.map((row) => <SpecCard key={row.label} row={row} />)}
              <SpecCard row={{ label: 'Provozní tlak', value: '2–7 BAR (nízkotlaký)', desc: 'Navrženo pro provoz z běžného vodovodního řadu; výsledná konfigurace se vždy ověřuje podle konkrétní instalace.' }} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}