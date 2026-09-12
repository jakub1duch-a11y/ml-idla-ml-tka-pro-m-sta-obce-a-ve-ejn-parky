import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, MoveHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProductSpatialConfigurations } from '@/lib/productDetailConfig';

/** Z popisku varianty ("2 stejné prvky") odvodíme počet kusů v sestavě. */
function countFromLabel(sub, index) {
  const m = String(sub || '').match(/(\d+)/);
  if (m) return Math.min(Number(m[1]) || 1, 4);
  if (/alej|linii|více|sestav/i.test(sub || '')) return 4;
  return Math.min(index + 1, 4);
}

const SPACING = { 1: '—', 2: '4–6 m rozestup', 3: '4–5 m rozestup', 4: '3–5 m v linii' };

export default function PdConfigurator({ product }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);

  const configs = useMemo(
    () => getProductSpatialConfigurations(product).map(([title, sub, desc], i) => ({
      title, sub, desc, count: countFromLabel(sub, i),
    })),
    [product]
  );

  const current = configs[active] || configs[0];
  if (!current) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
      {/* Interaktivní seznam konfigurací */}
      <div className="flex flex-col divide-y divide-white/10 border border-white/12 bg-white/[.03]">
        {configs.map((c, i) => (
          <motion.button
            key={c.title}
            type="button"
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            onViewportEnter={() => setActive(i)}
            viewport={{ amount: 0.9 }}
            className={`group relative px-6 py-5 text-left transition-colors ${
              active === i ? 'bg-white/[.07]' : 'hover:bg-white/[.05]'
            }`}
          >
            <span
              className={`absolute left-0 top-0 h-full w-[2px] bg-[#22D3EE] transition-transform duration-500 ${
                active === i ? 'scale-y-100' : 'scale-y-0'
              }`}
              style={{ transformOrigin: 'top' }}
            />
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-heading text-lg font-semibold text-white">{c.title}</h3>
              <span className="font-mono text-[10px] uppercase tracking-[.14em] text-[#22D3EE]">
                {c.count} {c.count === 1 ? 'ks' : 'ks'}
              </span>
            </div>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[.12em] text-white/40">{c.sub}</p>
            <p className={`mt-3 text-sm leading-relaxed transition-colors ${active === i ? 'text-white/70' : 'text-white/45'}`}>
              {c.desc}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Živý náhled sestavy */}
      <div className="relative overflow-hidden border border-white/12 bg-gradient-to-b from-[#F4FAFC] to-[#E7F4F8]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(21,56,99,.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(21,56,99,.14) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative flex h-[300px] items-center justify-center gap-3 px-6 pb-16 sm:h-[380px] sm:gap-8 lg:h-[440px]">
          <AnimatePresence mode="popLayout">
            {Array.from({ length: current.count }).map((_, i) => (
              <motion.div
                key={`${current.title}-${i}`}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-1 items-center justify-center"
              >
                {/* mlžná zóna */}
                <motion.span
                  aria-hidden="true"
                  className="absolute aspect-square w-[132%] max-w-[190px] rounded-full bg-[#22D3EE]/20 blur-xl"
                  animate={reduceMotion ? undefined : { scale: [1, 1.09, 1], opacity: [0.55, 0.85, 0.55] }}
                  transition={{ duration: 4.5, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
                />
                <span aria-hidden="true" className="absolute aspect-square w-[112%] max-w-[160px] rounded-full border border-[#153863]/20" />
                <span aria-hidden="true" className="absolute aspect-square w-[72%] max-w-[104px] rounded-full border border-dashed border-[#153863]/25" />
                {/* prvek */}
                <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[#153863]/35 bg-white shadow-[0_2px_10px_rgba(10,22,40,.12)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#153863]" />
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* osa + kóta rozestupu */}
          <div aria-hidden="true" className="absolute inset-x-6 bottom-12 h-px bg-[#153863]/25" />
          <div className="absolute inset-x-6 bottom-4 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[.14em] text-[#153863]/60">
              {current.title} · {current.count} ks
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[.14em] text-[#153863]/60">
              <MoveHorizontal size={12} strokeWidth={1.5} /> {SPACING[current.count] || 'dle projektu'}
            </span>
          </div>
        </div>

        <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-[#153863]/12 bg-white/60 px-6 py-4">
          <p className="max-w-md text-[13px] leading-snug text-[#0A1628]/70">
            Náhled ukazuje pouze počet a rozmístění — geometrie výrobku zůstává schválená.
          </p>
          <Link
            to={`/poptavka?produkt=${product.slug}&sestava=${encodeURIComponent(current.title)}`}
            className="inline-flex items-center gap-2 border border-[#153863] px-4 py-2 font-heading text-[13px] font-semibold text-[#153863] transition hover:bg-[#153863] hover:text-white"
          >
            Poptat sestavu {current.title} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}