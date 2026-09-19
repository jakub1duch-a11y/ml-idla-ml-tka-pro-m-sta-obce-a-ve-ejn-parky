import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

// Produktová přesnost je prioritou: zde se zobrazují pouze skutečné produkty
// načtené z produktové databáze MLŽIDLA.cz. Higgsfield nesmí generovat ani
// nahrazovat tvar, konstrukci nebo proporce produktu.
const VERIFIED_PRODUCTS = [
  'MLŽÍTKO BENDY',
  'MLŽÍTKO OSTREV',
  'MLŽÍTKO LINEA CE',
  'MLŽÍTKO Y-ARMIST',
  'MLŽNÝ MRAK',
  'MLŽÍTKO AURA GARDEN',
  'MLŽNÉ LÍZÁTKO',
];

export default function HiggsfieldCityPromo() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    base44.entities.Product.list('name', 200).then((items) => {
      const verified = VERIFIED_PRODUCTS.map((name) => (items || []).find((p) => p.name === name && p.image_url)).filter(Boolean).slice(0, 4);
      setProducts(verified);
    });
  }, []);

  return (
    <section aria-labelledby="higgsfield-city-promo" className="relative overflow-hidden bg-[#071a2a] py-16 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-10">
        <div className="text-white">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">MLŽIDLA × AI vizualizace</p>
          <h2 id="higgsfield-city-promo" className="text-3xl font-semibold tracking-tight sm:text-4xl">Městské ochlazování jako součást veřejného prostoru.</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/75">Pro vizualizace používáme výhradně skutečné produkty MLŽIDLA.cz. Žádný generovaný tvar nenahrazuje náš výrobek, jeho konstrukci ani proporce.</p>
          <div className="mt-7 grid grid-cols-2 gap-3">
            {products.map((p) => <div key={p.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"><img src={p.image_url} alt={p.name} className="aspect-square w-full object-contain bg-white" loading="lazy" /><div className="px-3 py-2 text-xs font-semibold text-white">{p.name}</div></div>)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {products.map((p) => (
            <article key={p.id} className="overflow-hidden rounded-[22px] border border-white/10 bg-white shadow-xl shadow-cyan-950/20">
              <div className="aspect-square bg-white p-4 sm:p-6"><img src={p.image_url} alt={p.name} className="h-full w-full object-contain" loading="lazy" /></div>
              <div className="bg-[#0b2235] px-4 py-3 text-sm font-semibold text-white">{p.name}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
