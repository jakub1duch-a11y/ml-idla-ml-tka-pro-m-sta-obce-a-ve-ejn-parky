import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function PdClosingCta({ product }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#effcf5] via-white to-[#e6faf4] py-16 sm:py-20 lg:py-24" aria-labelledby="project-consultation-title">
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-7 lg:px-10">
        <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-emerald-800"><span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />Projektová konzultace</p>
        <h2 id="project-consultation-title" className="mt-5 font-heading text-3xl font-bold leading-tight tracking-tight text-[#0A2342] sm:text-4xl lg:text-5xl">Představte si {product.name} ve vašem prostoru.</h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600">Pošlete fotografii místa nebo projektovou situaci. Navrhneme vhodné provedení, připojení a ovládání a připravíme cenovou nabídku.</p>
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link to={`/poptavka?produkt=${encodeURIComponent(product.slug)}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">Získat návrh a cenu <ArrowRight size={17} aria-hidden="true" /></Link>
          <Link to={`/ai-vizualizace?produkt=${encodeURIComponent(product.name)}&slug=${encodeURIComponent(product.slug)}`} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-emerald-200 bg-white px-6 py-4 text-sm font-semibold text-[#0A2342] hover:bg-emerald-50">Vizualizovat v mém prostoru</Link>
        </div>
      </div>
    </section>
  );
}
