import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Verified STÉBLO product master from the product administration.
// Kept separate from the unverified STÉBLO GATE visualizations.
const STEBLO_MASTER = 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/1a97d09ea_486dbd1bb_mlzitko-steblo-katalog2.webp';

export default function StebloSpaceFeature({ context = 'city' }) {
  const hotel = context === 'hotel';
  return (
    <section className="bg-[#f5f8f9] text-[#183949]" aria-labelledby={`steblo-space-${context}`}>
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
        <div className="overflow-hidden rounded-2xl bg-white">
          <img src={STEBLO_MASTER} alt="Produktové zobrazení nerezového mlžítka STÉBLO" className="aspect-[4/3] w-full object-contain" loading="lazy" decoding="async" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-[#087589]">MLŽÍTKO STÉBLO</p>
          <h2 id={`steblo-space-${context}`} className="mt-4 font-heading text-3xl leading-tight sm:text-4xl">{hotel ? 'Osvěžení, které ladí s vaším prostorem.' : 'Jemná křivka pro místa, kde se setkáváme.'}</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-700">{hotel ? 'STÉBLO doplní terasu, zahradu nebo vstupní prostor. Umístění, přívod vody i způsob řízení navrhneme podle konkrétního místa.' : 'Samostatné mlžítko nebo sestava prvků STÉBLO může doplnit náměstí, park či pěší trasu. Pro váš prostor navrhneme vhodné umístění a napojení.'}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/produkt/mlzitko-steblo" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#12415e] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a344b]">Prohlédnout STÉBLO <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link to="/poptavka" className="inline-flex min-h-11 items-center rounded-full border border-[#12415e]/30 px-6 py-3 text-sm font-semibold text-[#12415e] hover:bg-white">Poptat návrh</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
