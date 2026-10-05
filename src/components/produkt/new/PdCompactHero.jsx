import React from 'react';
import { ArrowRight, Droplets, ExternalLink, Gauge, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFamily, getLine } from '@/lib/productFamilies';

function cleanText(value = '') {
  return String(value).
  replace(/<[^>]*>/g, ' ').
  replace(/\s+/g, ' ').
  trim();
}

export default function PdCompactHero({ product }) {
  const family = getFamily(product);
  const line = getLine(product);
  const image = product.hero_visual_verified && product.hero_product_image_url ?
  product.hero_product_image_url :
  product.image_url;
  const intro = cleanText(product.short_description || product.description || '');
  const facts = [
  product.material && { icon: ShieldCheck, label: 'Materiál', value: product.material },
  product.pressure && { icon: Gauge, label: 'Tlak', value: product.pressure },
  product.water_consumption && { icon: Droplets, label: 'Voda', value: product.water_consumption }].
  filter(Boolean).slice(0, 3);

  return (
    <section id="prehled" className="scroll-mt-28 bg-[#F7FBFD]">
      <div className="grid max-w-[1500px] gap-7 px-5 pb-10 pt-8 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch lg:px-12 lg:pb-14 lg:pt-12 xl:px-20 my-20">
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[.17em] text-[#0B8EC5]">
            <span>{family.label}</span>
            <span className="text-[#A4B4BC]">·</span>
            <span>{line.label}</span>
          </div>

          <h1 className="mt-4 max-w-[12ch] font-heading text-[clamp(2.7rem,7vw,5.6rem)] font-black leading-[.9] tracking-[-.06em] text-[#07131D]">
            {product.name}
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#5A6B78] sm:text-base">
            {intro || 'Designové mlžítko pro konkrétní prostor. Přesné provedení a technické parametry se řídí ověřenými daty produktu.'}
          </p>

          {facts.length > 0 &&
          <div className="mt-6 grid gap-2 sm:grid-cols-3">
              {facts.map(({ icon: Icon, label, value }) =>
            <div key={label} className="rounded-[18px] border border-[#D8E8ED] bg-white p-3.5">
                  <Icon size={16} strokeWidth={1.6} className="text-[#0B8EC5]" />
                  <p className="mt-2 font-mono text-[8px] font-bold uppercase tracking-[.16em] text-[#0D2F4F]/38">{label}</p>
                  <p className="mt-1 line-clamp-2 text-[12px] font-semibold leading-5 text-[#0A2342]">{value}</p>
                </div>
            )}
            </div>
          }

          <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Link
              to={`/poptavka?produkt=${encodeURIComponent(product.slug)}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#07131D] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#153863]">
              
              Návrh a cena <ArrowRight size={15} />
            </Link>
            <Link
              to={`/ai-vizualizace?produkt=${encodeURIComponent(product.name)}&slug=${encodeURIComponent(product.slug)}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[#CBE4EE] bg-white px-5 py-3 text-sm font-bold text-[#07131D] transition hover:-translate-y-0.5 hover:border-[#7CCBD8]">
              
              Vizualizovat v prostoru <ExternalLink size={14} />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-[#D8E8ED] bg-[radial-gradient(circle_at_70%_18%,#FFFFFF_0%,#EDF8FA_44%,#DCEFF3_100%)] sm:min-h-[520px]">
          {image ?
          <img
            src={image}
            alt={product.image_alt || `${product.name} — produkt`}
            className="absolute inset-0 h-full w-full object-cover object-center"
            fetchPriority="high" /> :


          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_18%,#FFFFFF_0%,#EDF8FA_44%,#DCEFF3_100%)]" />
          }
          <div className="absolute inset-0 bg-gradient-to-t from-[#07131D]/70 via-transparent to-white/10" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[.18em] text-[#8AEAF5]">Produkt v kostce</p>
            <h2 className="mt-2 max-w-2xl font-heading text-2xl font-bold leading-[1.02] tracking-[-.035em] sm:text-3xl">
              Přesný produkt. Hodně vizuálu. Minimum zbytečného textu.
            </h2>
          </div>
        </div>
      </div>
    </section>);

}