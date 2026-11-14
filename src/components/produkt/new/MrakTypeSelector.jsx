import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Droplets, Ruler, ScanLine } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// Čtyři samostatné veřejné produkty v aktuální databázi Base44.
// Zobrazené rozměry, počet trysek i fotografie se načítají z jejich vlastních záznamů.
const MRAK_MODELS = [
  { slug: 'mlzny-mrak-1413', label: 'MRAK 1413' },
  { slug: 'mlzny-mrak-1414', label: 'MRAK 1414' },
  { slug: 'mlzny-mrak-1480', label: 'MRAK 1480' },
  { slug: 'mlzny-mrak-2424', label: 'MRAK 2424' },
];

function ModelImage({ src, name }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (!src || failed) {
    return <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#E7F1F5] px-6 text-center text-[#50707C]">
      <Droplets size={32} aria-hidden="true" />
      <p className="text-sm">Produktové vyobrazení se připravuje</p>
    </div>;
  }
  return <img src={src} alt={`Katalogový náhled ${name}`} loading="lazy" decoding="async"
    className="h-full w-full object-contain object-center" onError={() => setFailed(true)} />;
}

export default function MrakTypeSelector({ slug }) {
  const [products, setProducts] = useState({});
  useEffect(() => {
    let mounted = true;
    Promise.all(MRAK_MODELS.map(async ({ slug: modelSlug }) => {
      try {
        const records = await base44.entities.Product.filter({ slug: modelSlug });
        const product = (records || []).find((item) => item.slug === modelSlug && item.active !== false);
        return [modelSlug, product || null];
      } catch {
        return [modelSlug, null];
      }
    })).then((entries) => {
      if (mounted) setProducts(Object.fromEntries(entries));
    });
    return () => { mounted = false; };
  }, []);

  return (
    <section id="tvar-mraku" aria-labelledby="mrak-types-heading" className="scroll-mt-28 bg-[#F8F9FA] py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-[#008AA6]">Produktová řada MRAK</p>
        <h2 id="mrak-types-heading" className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#2B3A42] sm:text-4xl">
          Čtyři katalogová provedení. Vyberte správný tvar.
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          Každý MRAK má vlastní produktový list a samostatnou adresu. Technické hodnoty přebíráme přímo z jeho záznamu v katalogu; konečné provedení ověřujeme podle výrobního výkresu.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {MRAK_MODELS.map(({ slug: modelSlug, label }, index) => {
            const product = products[modelSlug];
            const variant = product?.variants?.[0];
            const selected = slug === modelSlug;
            return (
              <article key={modelSlug} className={`flex min-w-0 flex-col overflow-hidden rounded-[1.5rem] border-2 bg-white transition hover:-translate-y-1 hover:shadow-xl ${selected ? 'border-[#00B4D8]' : 'border-[#E6EBEF]'}`}>
                <div className="relative aspect-[4/5] bg-[#EFF6F8] p-3">
                  <ModelImage src={product?.image_url} name={label} />
                  <span className="absolute left-5 top-5 rounded-full bg-[#081B33] px-3 py-1.5 text-[10px] font-bold tracking-wide text-white">0{index + 1}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-heading text-xl font-bold text-[#2B3A42]">{label}</h3>
                  <dl className="mt-5 space-y-3 text-sm">
                    <div className="flex items-start gap-2"><Ruler size={16} className="mt-0.5 shrink-0 text-[#008AA6]" aria-hidden="true" />
                      <dt className="sr-only">Rozměr</dt><dd className="text-slate-700">{variant?.dimensions ? `${variant.dimensions} mm` : 'Rozměry k upřesnění'}</dd>
                    </div>
                    <div className="flex items-start gap-2"><Droplets size={16} className="mt-0.5 shrink-0 text-[#008AA6]" aria-hidden="true" />
                      <dt className="sr-only">Počet trysek</dt><dd className="text-slate-700">{variant?.nozzles ? `Trysky: ${variant.nozzles}` : 'Trysky dle výrobního návrhu'}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
                    <ScanLine size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                    {product?.visual_master_verified ? 'Produktový náhled z ověřené galerie.' : 'Přiřazený katalogový náhled; výrobní geometrii ověřujeme.'}
                  </p>
                  <Link to={`/produkt/${modelSlug}`} aria-current={selected ? 'page' : undefined}
                    className="mt-auto inline-flex min-h-11 items-center justify-between gap-2 border-t border-[#E6EBEF] pt-4 text-sm font-bold text-[#008AA6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00B4D8]">
                    {selected ? 'Aktuální provedení' : 'Otevřít produkt'} <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-7 text-xs leading-6 text-slate-500">Ilustrační podklady nejsou výrobním výkresem. Pro finální nabídku ověříme geometrii, profil, rozmístění trysek a způsob kotvení.</p>
      </div>
    </section>
  );
}
