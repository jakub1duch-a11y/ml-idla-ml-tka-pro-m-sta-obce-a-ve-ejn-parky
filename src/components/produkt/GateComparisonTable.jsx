import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, Ruler } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const variantSlug = (name = '') => String(name).normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function GateComparisonTable() {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    base44.entities.Product.filter({ slug: 'mlzna-brana-gate' })
      .then((products = []) => {
        const product = products.find((item) => item.slug === 'mlzna-brana-gate');
        if (mounted) setVariants(Array.isArray(product?.variants) ? product.variants.filter((item) => item?.name) : []);
      })
      .catch(() => { if (mounted) setVariants([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return (
    <section aria-labelledby="gate-compare-title" className="border-y border-[#E6EBEF] bg-[#F8F9FA] py-16 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#008AA6]">Katalog mlžných bran</p>
        <h2 id="gate-compare-title" className="mt-3 max-w-3xl font-heading text-3xl font-bold tracking-tight text-[#2B3A42] sm:text-4xl">
          Porovnejte skutečně evidovaná provedení GATE.
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Výběr podle tvaru, profilu a rozměrů. Technické údaje přebíráme z aktuálního katalogu Base44, nikoliv ze starších reklamních listů.
        </p>
        {loading && <p role="status" className="mt-8 text-sm text-slate-500">Načítám katalogové varianty…</p>}
        {!loading && !variants.length && (
          <div className="mt-8 rounded-2xl border border-[#D6E7EA] bg-white p-6 text-slate-600">
            Katalogové podrobnosti se nyní nepodařilo načíst. <Link className="font-semibold text-[#008AA6] underline" to="/produkt/mlzna-brana-gate">Otevřít produkt GATE</Link>.
          </div>
        )}
        <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {variants.map((variant, index) => {
            const url = `/produkt/mlzna-brana-gate?varianta=${variantSlug(variant.name)}`;
            return (
              <article key={variant.name} className="flex min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-[#E6EBEF] bg-white shadow-[0_10px_35px_rgba(43,58,66,.05)]">
                <div className="flex aspect-[5/4] items-center justify-center bg-[#EFF5F7] p-4">
                  {variant.image_url
                    ? <img src={variant.image_url} alt={`Produktový náhled ${variant.name}`} className="h-full w-full object-contain" loading="lazy" decoding="async" />
                    : <span className="text-sm text-slate-500">Fotografie varianty se připravuje</span>}
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <span className="text-[10px] font-bold uppercase tracking-[.18em] text-[#008AA6]">GATE · 0{index + 1}</span>
                  <h3 className="mt-2 font-heading text-xl font-bold text-[#2B3A42]">{variant.name}</h3>
                  <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-[#E6EBEF] pt-4 text-sm text-slate-700">
                    <div><dt className="text-xs text-slate-500">Profil</dt><dd className="mt-1 font-semibold">{variant.profile || 'Dle projektu'}</dd></div>
                    <div><dt className="text-xs text-slate-500">Rozměry</dt><dd className="mt-1 font-semibold">{variant.dimensions ? `${variant.dimensions} mm` : 'Dle projektu'}</dd></div>
                    <div className="col-span-2 flex items-center gap-2"><Droplets size={16} className="text-[#008AA6]" aria-hidden="true" /><dt>Počet trysek</dt><dd className="font-semibold">{variant.nozzles || 'Dle projektu'}</dd></div>
                  </dl>
                  <Link to={url} className="mt-auto inline-flex min-h-12 items-center justify-between gap-3 pt-5 text-sm font-bold text-[#008AA6]">
                    Zobrazit provedení <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#081B33] px-6 py-7 text-white sm:px-8">
          <div>
            <p className="font-heading text-xl font-bold">Další tvar brány: LINEA CE GATE</p>
            <p className="mt-1 text-sm leading-6 text-white/70">Samostatná produktová řada s vlastní geometrií a katalogovým listem.</p>
          </div>
          <Link to="/produkt/linea-CE-gate" className="inline-flex min-h-12 items-center gap-3 rounded-xl bg-[#00B4D8] px-6 py-3 text-sm font-bold text-[#081B33]">
            Detail LINEA CE GATE <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <p className="mt-6 flex items-start gap-2 text-xs leading-6 text-slate-500"><Ruler size={16} className="mt-1 shrink-0" aria-hidden="true" />
          Výrobní geometrie, materiál, kotvení, filtrace a skutečný průtok musí být potvrzeny podle konkrétního výrobního provedení. Vizualizace jsou ilustrační.
        </p>
      </div>
    </section>
  );
}
