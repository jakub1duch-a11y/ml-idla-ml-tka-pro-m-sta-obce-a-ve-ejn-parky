import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ScanLine } from 'lucide-react';
import { getProductSpatialConfigurations } from '@/lib/productDetailConfig';

export default function PdVariants({ product }) {
  const variants = getProductSpatialConfigurations(product);

  return (
    <section className="bg-[#EAF5FB] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Produkt ≠ konfigurace</p>
            <h2 className="mt-4 font-heading text-3xl leading-tight tracking-[-.03em] text-[#0D2F4F] lg:text-4xl">Konfigurace v prostoru</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#0D2F4F]/60">U prostorových sestav zachováváme schválenou geometrii produktu. Mění se pouze počet kusů, rozmístění nebo výrobcem definovaná varianta konkrétního produktu.</p>
          </div>
          <Link to={`/ai-vizualizace?produkt=${encodeURIComponent(product.name)}&slug=${encodeURIComponent(product.slug)}`} className="inline-flex min-h-[44px] items-center gap-2 self-start border border-[#0B5EA8]/20 bg-white px-5 text-sm font-semibold text-[#0B5EA8] transition hover:border-[#0B5EA8]/40 lg:self-auto"><ScanLine size={16}/> Vyzkoušet v mém prostoru</Link>
        </div>

        <div className={`mt-10 grid gap-5 ${variants.length >= 4 ? 'md:grid-cols-2 xl:grid-cols-4' : 'md:grid-cols-3'}`}>
          {variants.map(([title, sub, desc], i) => (
            <div key={`${title}-${i}`} className="group border border-[#0B5EA8]/15 bg-white p-7 transition-all hover:-translate-y-1 hover:border-[#0B5EA8]/35 hover:shadow-[0_18px_45px_rgba(11,94,168,.08)]">
              <span className="font-mono text-sm text-[#0B5EA8]">0{i + 1}</span>
              <h3 className="mt-5 font-heading text-xl font-semibold text-[#0D2F4F]">{title}</h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[.12em] text-[#0B5EA8]/65">{sub}</p>
              <p className="mt-4 text-sm leading-relaxed text-[#0D2F4F]/60">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Link to={`/poptavka?produkt=${encodeURIComponent(product.slug)}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B5EA8] hover:text-[#0D2F4F]">Navrhnout vhodnou konfiguraci <ArrowRight size={15}/></Link>
        </div>
      </div>
    </section>
  );
}
