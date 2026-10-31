import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Ruler, Droplets, Layers } from 'lucide-react';

// Variant selector for gate products: image previews, grounded dimensions and quote CTA.
const GATE_VARIANT_IMAGES = [
  [/BRÁNA\s*60[_\s-]*2115/i, '/assets/images/gate-variant-60-2115.svg'],
  [/BRÁNA\s*60[_\s-]*2130/i, '/assets/images/gate-variant-60-2130.svg'],
  [/BRÁNA\s*76[_\s-]*2130/i, '/assets/images/gate-variant-76-2130.svg'],
  [/BRANKA\s*OBLOUK[_\s-]*42[_\s-]*1815/i, '/assets/images/gate-variant-42-1815.svg'],
  [/BRANKA\s*RADIUS[_\s-]*42[_\s-]*1825/i, '/assets/images/gate-variant-42-1825.svg'],
];
const getVariantImage = (variant) => GATE_VARIANT_IMAGES.find(([pattern]) => pattern.test(variant.name || ''))?.[1] || variant.image_url;

export default function PdVariantsTable({ variants, productSlug }) {
  const [params, setParams] = useSearchParams();
  const fromUrl = variants?.findIndex((v) => v.name === params.get('varianta'));
  const [active, setActive] = useState(fromUrl > -1 ? fromUrl : 0);

  useEffect(() => {
    if (fromUrl > -1) setActive(fromUrl);
  }, [fromUrl]);

  if (!variants?.length) return null;

  const sel = variants[active] || variants[0];
  const pick = (index) => {
    setActive(index);
    const next = new URLSearchParams(params);
    next.set('varianta', variants[index].name);
    setParams(next, { replace: true, preventScrollReset: true });
  };

  return (
    <section id="varianty" className="mt-8 scroll-mt-28 overflow-hidden rounded-[28px] border border-[#D8E8F0] bg-white shadow-[0_18px_55px_rgba(10,35,66,.06)]">
      <div className="border-b border-[#E7F0F4] px-5 pt-5 sm:px-6 sm:pt-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[#0B97E8]">Varianty produktu</p>
        <h2 className="mt-2 font-heading text-xl font-bold text-[#0A2342] sm:text-2xl">Vyberte provedení mlžné brány</h2>
        <div className="mt-5 grid min-w-0 grid-cols-1 gap-3 pb-5 sm:grid-cols-2 xl:grid-cols-3">
          {variants.map((variant, index) => (
            <button
              key={variant.name}
              type="button"
              onClick={() => pick(index)}
              aria-pressed={index === active}
              className={`group min-w-0 overflow-hidden rounded-2xl border text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B97E8] focus-visible:ring-offset-2 ${index === active ? 'border-[#0756A5] bg-[#F1F8FD] shadow-[0_8px_24px_rgba(7,86,165,.12)]' : 'border-[#D8E8F0] bg-white hover:border-[#78BDE8]'}`}
            >
              {getVariantImage(variant) ? (
                <img src={getVariantImage(variant)} alt={`${variant.name} – náhled mlžné brány`} loading="lazy" className="aspect-[1.5/1] w-full object-cover" />
              ) : (
                <div className="flex aspect-[1.5/1] items-center justify-center bg-[#F4FAFD] text-sm text-[#52708C]">Náhled připravujeme</div>
              )}
              <span className="block px-4 py-3">
                <span className="block text-sm font-extrabold leading-snug text-[#0A2342]">{variant.name}</span>
                <span className="mt-1 block text-xs text-[#526A83]">{variant.dimensions ? `Šířka ${variant.dimensions.split(' × ')[0]} × výška ${variant.dimensions.split(' × ')[1]} mm` : 'Rozměr dle konfigurace'}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div key={sel.name} className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,.95fr)] lg:items-start">
        <div className="min-w-0 overflow-hidden rounded-2xl bg-[#F4FAFD]">
          {getVariantImage(sel) && <img src={getVariantImage(sel)} alt={`${sel.name} – detailní náhled`} className="aspect-[1.5/1] w-full object-cover" />}
        </div>
        <div className="min-w-0">
          <h3 className="font-heading text-2xl font-bold text-[#0A2342]">{sel.name}</h3>
          {sel.description && <p className="mt-3 text-sm leading-6 text-[#526A83]">{sel.description}</p>}
          <dl className="mt-5 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
            {[[Layers, 'Profil', sel.profile], [Ruler, 'Šířka × výška', sel.dimensions && `${sel.dimensions} mm`], [Droplets, 'Trysky', sel.nozzles]].map(([Icon, label, value]) => (
              <div key={label} className="min-w-0 rounded-2xl bg-[#F4FAFD] p-4">
                <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.12em] text-[#0D2F4F]/55"><Icon size={14} className="shrink-0 text-[#0B97E8]" />{label}</dt>
                <dd className="mt-1 break-words font-heading text-base font-bold text-[#0A2342]">{value || 'Na upřesnění'}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 rounded-2xl border border-[#D8E8F0] p-4">
            <p className="text-sm leading-6 text-[#526A83]">Cena se připravuje podle vybraného provedení a požadovaného řešení.</p>
            <Link to={`/poptavka?produkt=${encodeURIComponent(productSlug || '')}&varianta=${encodeURIComponent(sel.name)}`} className="mt-3 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0A2342] px-5 text-sm font-bold text-white transition hover:bg-[#0B97E8] sm:w-auto">
              Zjistit cenu <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
      <p className="border-t border-[#E7F0F4] bg-[#F7FBFD] px-5 py-3 text-[11px] leading-5 text-[#0D2F4F]/60 sm:px-6">Uvedené rozměry a profily vycházejí z produktového přehledu. Konečné provedení a osazení trysek se potvrzuje v nabídce a výrobní dokumentaci.</p>
    </section>
  );
}
