import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Ruler, Droplets, Layers } from 'lucide-react';


// Varianty jako odkazové záložky: každá má vlastní adresu (?varianta=…) s kompletním detailem.
export default function PdVariantsTable({ variants, productSlug }) {
  const [params, setParams] = useSearchParams();
  const fromUrl = variants?.findIndex((v) => v.name === params.get('varianta'));
  const [active, setActive] = useState(fromUrl > -1 ? fromUrl : 0);
  useEffect(() => { if (fromUrl > -1) setActive(fromUrl); }, [fromUrl]);
  if (!variants?.length) return null;
  const sel = variants[active] || variants[0];
  const pick = (i) => { setActive(i); const p = new URLSearchParams(params); p.set('varianta', variants[i].name); setParams(p, { replace: true, preventScrollReset: true }); };

  return (
    <section id="varianty" className="mt-8 scroll-mt-28 overflow-hidden rounded-[28px] border border-[#D8E8F0] bg-white">
      <div className="border-b border-[#E7F0F4] px-5 pt-5 sm:px-6">
        <p className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-[#0B97E8]">Varianty produktu</p>
        <nav aria-label="Varianty" className="mt-3 grid min-w-0 grid-cols-1 gap-2 pb-4 md:grid-cols-2 xl:grid-cols-3">
          {variants.map((v, i) => (
            <a key={v.name} href={`?varianta=${encodeURIComponent(v.name)}#varianty`} onClick={(e) => { e.preventDefault(); pick(i); }}
              aria-current={i === active ? 'page' : undefined}
              className={`flex min-h-12 min-w-0 items-center justify-center whitespace-normal break-words text-center [overflow-wrap:anywhere] rounded-full border px-4 py-2 text-sm font-bold transition ${i === active ? 'border-[#0A2342] bg-[#0A2342] text-white' : 'border-[#D8E8F0] text-[#0A2342] hover:border-[#0B97E8] hover:text-[#0B97E8]'}`}>
              {v.name}
            </a>
          ))}
        </nav>
      </div>
      <div key={sel.name} className="grid min-w-0 gap-6 p-4 sm:p-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end [&>*]:min-w-0 [&_h3]:break-words [&_dd]:break-words [&_dd]:[overflow-wrap:anywhere]">
        <div>
          <h3 className="font-heading text-2xl font-bold text-[#0A2342]">{sel.name}</h3>
          <dl className="mt-4 grid min-w-0 grid-cols-1 gap-3 lg:grid-cols-3">
            {[[Layers, 'Profil', sel.profile], [Ruler, 'Rozměr V × Š', sel.dimensions && `${sel.dimensions} mm`], [Droplets, 'Trysky', sel.nozzles]].map(([Icon, label, val]) => (
              <div key={label} className="rounded-2xl bg-[#F4FAFD] p-4">
                <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.12em] text-[#0D2F4F]/55"><Icon size={14} className="text-[#0B97E8]" />{label}</dt>
                <dd className="mt-1 font-heading text-base font-bold text-[#0A2342]">{val || '–'}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="lg:text-right">
          <p className="text-sm font-semibold text-[#0D2F4F]/60">Cena dle konfigurace</p>
          <Link to={`/poptavka?produkt=${encodeURIComponent(productSlug || '')}&varianta=${encodeURIComponent(sel.name)}`} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0A2342] px-5 text-sm font-bold text-white transition hover:bg-[#0B97E8]">
            Žádost o cenu <ArrowRight size={15} />
          </Link>
        </div>
      </div>
      <p className="border-t border-[#E7F0F4] bg-[#F7FBFD] px-5 py-3 text-[11px] text-[#0D2F4F]/60 sm:px-6">Parametry platí pro zvolené provedení. Finální rozměry, materiál a osazení trysek potvrzuje výrobní výkres.</p>
    </section>
  );
}