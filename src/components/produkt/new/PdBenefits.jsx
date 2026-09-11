import React from 'react';
import { Droplets, Gauge, Layers, Sparkles, Wifi } from 'lucide-react';
import { getProductDetailConfig } from '@/lib/productDetailConfig';

export default function PdBenefits({ product }) {
  const detailConfig = getProductDetailConfig(product);

  const technical = [
    product.material && { icon: Layers, label: 'Materiál', value: product.material },
    product.pressure && { icon: Gauge, label: 'Provozní tlak', value: product.pressure },
    product.water_consumption && { icon: Droplets, label: 'Spotřeba vody', value: product.water_consumption },
    product.power_supply && { icon: Wifi, label: 'Ovládání', value: product.power_supply },
  ].filter(Boolean).slice(0, 4);

  const benefits = (detailConfig.benefits || []).slice(0, 4);

  if (benefits.length === 0 && technical.length === 0) return null;

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] font-medium uppercase tracking-[.2em] text-[#0B97E8]">Proč {product.name}</p>
            <h2 className="mt-3 max-w-2xl font-heading text-3xl font-bold leading-[1.02] tracking-[-.04em] text-[#0A2342] sm:text-4xl lg:text-5xl">
              Technologie, která dává smysl v prostoru.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#0D2F4F]/55">
            Hlavní přínosy a technické parametry se přizpůsobují konkrétnímu produktu a způsobu instalace.
          </p>
        </div>

        {benefits.length > 0 && (
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {benefits.map(([title, text], index) => (
              <article key={title} className="rounded-[24px] border border-[#DCECF4] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FCFE_100%)] p-5 shadow-[0_12px_36px_rgba(10,35,66,.045)] sm:p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E7F7FF] text-[#0B97E8]">
                  <Sparkles size={21} strokeWidth={1.7} />
                </div>
                <p className="mt-6 font-heading text-lg font-bold leading-tight text-[#0A2342]">{title}</p>
                <p className="mt-2 text-sm leading-6 text-[#0D2F4F]/56">{text}</p>
                <span className="mt-6 block h-1 w-9 rounded-full bg-[#18B8F2]/70" />
              </article>
            ))}
          </div>
        )}

        {technical.length > 0 && (
          <div className="mt-5 grid overflow-hidden rounded-[24px] border border-[#DCECF4] bg-[#F8FCFE] sm:grid-cols-2 lg:grid-cols-4">
            {technical.map((item, index) => (
              <div key={item.label} className={`flex items-center gap-4 p-5 sm:p-6 ${index > 0 ? 'border-t border-[#DCECF4] sm:border-t-0 sm:border-l' : ''}`}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#0B97E8] shadow-sm">
                  <item.icon size={19} strokeWidth={1.7} />
                </span>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[.14em] text-[#0D2F4F]/42">{item.label}</p>
                  <p className="mt-1 font-heading text-sm font-bold text-[#0A2342]">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
