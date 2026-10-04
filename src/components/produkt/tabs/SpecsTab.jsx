import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Info, CheckCircle2, ShieldCheck, Factory, Ruler } from 'lucide-react';

function SpecCard({ row, index }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = row.icon || Info;
  const interactive = Boolean(row.desc);

  return (
    <motion.button
      type="button"
      onClick={() => interactive && setExpanded((v) => !v)}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.035, 0.18) }}
      whileHover={{ y: -4 }}
      aria-expanded={interactive ? expanded : undefined}
      className="group relative w-full overflow-hidden rounded-[22px] border border-slate-200 bg-white p-5 text-left shadow-[0_8px_28px_rgba(15,23,42,.035)] transition-[border-color,box-shadow,background-color] duration-300 hover:border-[#0b4860]/30 hover:bg-[#fbfdfe] hover:shadow-[0_18px_46px_rgba(11,72,96,.09)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2bbfcf]/45"
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2bbfcf]/0 to-transparent transition-all duration-500 group-hover:via-[#2bbfcf]/65" />
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-[#0b4860] transition-all duration-300 group-hover:border-[#0b4860]/15 group-hover:bg-[#eaf7fa] group-hover:scale-[1.04]">
          <Icon size={18} strokeWidth={1.75} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-3">
            <span>
              <span className="block font-mono text-[10px] uppercase tracking-[.16em] text-slate-400">{row.label}</span>
              <span className="mt-1.5 block text-[17px] font-semibold leading-snug tracking-[-.015em] text-slate-950">{row.value}</span>
            </span>
            {interactive && (
              <ChevronDown size={16} className={`mt-1 shrink-0 text-slate-300 transition-transform duration-300 group-hover:text-[#0b4860] ${expanded ? 'rotate-180' : ''}`} />
            )}
          </span>
          {row.desc && <span className="mt-2 block text-xs leading-relaxed text-slate-500 sm:hidden">{row.desc}</span>}
          <AnimatePresence initial={false}>
            {expanded && row.desc && (
              <motion.span
                initial={{ opacity: 0, height: 0, y: -3 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -3 }}
                className="mt-3 hidden overflow-hidden border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-500 sm:block"
              >
                {row.desc}
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </div>
    </motion.button>
  );
}

export default function SpecsTab({ product, techRows }) {
  const hasPressure = Boolean(product?.pressure);
  const hasMaterial = Boolean(product?.material);

  return (
    <section className="bg-[linear-gradient(180deg,#fff_0%,#f8fbfc_55%,#fff_100%)] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-start">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:sticky lg:top-44">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[.2em] text-[#0b4860]/55">Technické specifikace</p>
            <h2 className="font-heading text-4xl font-light tracking-[-.04em] text-slate-950 lg:text-5xl">
              Technika, kterou<br /><span className="text-slate-400">lze rychle přečíst.</span>
            </h2>
            <p className="mt-5 max-w-xl text-base font-light leading-relaxed text-slate-500">
              Zobrazujeme pouze parametry uložené u konkrétního produktu. Rozměry kotvení, počet kotev a projektové detaily se potvrzují pro konkrétní místo instalace.
            </p>

            {product?.image_url && (
              <div className="group relative mt-7 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-100 shadow-[0_16px_45px_rgba(15,23,42,.07)]">
                <img src={product.image_url} alt={`${product.name} – technický pohled`} className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" loading="lazy" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#031d26]/55 via-transparent to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 text-white">
                  <div><p className="font-mono text-[9px] uppercase tracking-[.18em] text-white/60">Produktový podklad</p><p className="mt-1 text-sm font-semibold">{product.name}</p></div>
                  <Ruler size={18} className="text-cyan-200" />
                </div>
              </div>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {hasPressure && (
                <div className="flex items-start gap-3 rounded-2xl border border-[#0b4860]/10 bg-[#eef8fb] p-4">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#0b6b78]" />
                  <p className="text-sm leading-relaxed text-[#0b4860]"><strong>Provozní tlak:</strong> {product.pressure}. Konkrétní návrh napojení se ověřuje podle lokality.</p>
                </div>
              )}
              {hasMaterial && (
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <ShieldCheck size={18} className="mt-0.5 shrink-0 text-slate-500" />
                  <p className="text-sm leading-relaxed text-slate-600"><strong>Materiál:</strong> {product.material}</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.16em] text-slate-400">Data produktu</p>
                <p className="mt-1 text-sm text-slate-500">Kliknutím na kartu zobrazíte vysvětlení parametru.</p>
              </div>
              <span className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-slate-500 sm:inline-flex"><Factory size={13}/> HolmTec</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {techRows.map((row, index) => <SpecCard key={`${row.label}-${row.value}`} row={row} index={index} />)}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
