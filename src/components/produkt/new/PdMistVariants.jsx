import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const VARIANTS = [
  { key: 'jemna', name: 'Jemná mlha', nozzles: 2, pressure: '3–4 bar', reach: '≈ 2 m', use: 'Lavičky, zahrady, terasy', flow: '≈ 0,2 l/min', opacity: 0.35, spread: 40 },
  { key: 'standard', name: 'Doporučené osazení', nozzles: 4, pressure: '4–6 bar', reach: '≈ 3–4 m', use: 'Parky, hřiště, náměstí', flow: '≈ 0,4 l/min', opacity: 0.6, spread: 70, recommended: true },
  { key: 'intenzivni', name: 'Intenzivní mlžná zóna', nozzles: 6, pressure: '5–7 bar', reach: '≈ 5 m', use: 'Sportoviště, eventy, frekventované zóny', flow: '≈ 0,6 l/min', opacity: 0.85, spread: 100 },
];

function MistPreview({ v, image }) {
  const pts = Array.from({ length: v.nozzles }, (_, i) => 20 + (i * 60) / Math.max(1, v.nozzles - 1));
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-b from-mist to-white sm:aspect-[16/11]">
      {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-contain p-6" />}
      <AnimatePresence mode="wait">
        <motion.div key={v.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0">
          {pts.map((x, i) => (
            <motion.span key={i} className="absolute top-[18%] block rounded-full bg-white blur-2xl"
              style={{ left: `${x}%`, width: v.spread * 1.4, height: v.spread * 2.2, opacity: v.opacity, translateX: '-50%' }}
              animate={{ y: [0, 18, 0], scale: [1, 1.12, 1] }} transition={{ duration: 4 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }} />
          ))}
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-4 left-4 rounded-full bg-ink/85 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white">
        {v.nozzles}× tryska M2 · {v.pressure}
      </div>
    </div>
  );
}

export default function PdMistVariants({ product }) {
  const [sel, setSel] = useState(VARIANTS[1]);
  const msg = `Mám zájem o ${product.name} – varianta „${sel.name}“ (${sel.nozzles}× tryska M2, ${sel.pressure}). Prosím o nezávaznou cenovou nabídku.`;
  const href = `/poptavka?produkt=${encodeURIComponent(product.slug)}&zprava=${encodeURIComponent(msg)}`;

  return (
    <section id="varianty-mlhy" className="scroll-mt-24 bg-foglight px-5 py-16 sm:px-10 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <MistPreview v={sel} image={product.image_url} />
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[.18em] text-hydro">Vyberte typ mlhy</p>
          <h2 className="mt-3 text-ink">Jak bude {product.name} mlžit?</h2>
          <p className="mt-3 text-slate-600">Tři ověřená osazení nízkotlakými tryskami M2 (Ø 0,2 mm). Vyberte, co odpovídá vašemu prostoru, doladíme to v nabídce.</p>
          <div className="mt-6 space-y-3">
            {VARIANTS.map((v) => (
              <button key={v.key} type="button" onClick={() => setSel(v)} aria-pressed={sel.key === v.key}
                className={`w-full rounded-2xl border p-4 text-left transition ${sel.key === v.key ? 'border-hydro bg-white shadow-lg' : 'border-slate-200 bg-white/60 hover:border-slate-400'}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-heading text-lg font-bold text-ink">{v.name}</span>
                  {v.recommended && <span className="rounded-full bg-cyan/15 px-2.5 py-1 text-[11px] font-bold uppercase text-hydro">Doporučeno</span>}
                </div>
                <p className="mt-1 text-sm text-slate-600">{v.use}</p>
                <dl className="mt-3 grid grid-cols-4 gap-2 font-mono text-[11px] text-slate-500">
                  <div><dt>Trysky</dt><dd className="text-ink">{v.nozzles}× M2</dd></div>
                  <div><dt>Tlak</dt><dd className="text-ink">{v.pressure}</dd></div>
                  <div><dt>Dosah</dt><dd className="text-ink">{v.reach}</dd></div>
                  <div><dt>Voda</dt><dd className="text-ink">{v.flow}</dd></div>
                </dl>
              </button>
            ))}
          </div>
          <Link to={href} className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-ink px-6 font-bold text-white transition hover:bg-hydro sm:w-auto">
            Zjistit cenu této varianty →
          </Link>
          <p className="mt-2 text-xs text-slate-500">Nezávazně. Odpovíme do 24 hodin.</p>
        </div>
      </div>
    </section>
  );
}