import React from 'react';
import { Droplets, Gauge, Layers, Wifi } from 'lucide-react';
import { getProductDetailConfig } from '@/lib/productDetailConfig';

export default function PdBenefits({ product }) {
  const detailConfig = getProductDetailConfig(product);

  const technical = [
    product.material && { icon: Layers, label: 'Materiál', value: product.material, code: '// MATERIAL' },
    product.pressure && { icon: Gauge, label: 'Provozní tlak', value: product.pressure, code: '// TLAK' },
    product.water_consumption && { icon: Droplets, label: 'Spotřeba vody', value: product.water_consumption, code: '// VODA' },
    product.power_supply && { icon: Wifi, label: 'Ovládání', value: product.power_supply, code: '// ŘÍZENÍ' },
  ].filter(Boolean).slice(0, 4);

  const benefits = (detailConfig.benefits || []).slice(0, 4);

  if (benefits.length === 0 && technical.length === 0) return null;

  return (
    <section className="bg-[#F4FAFC] py-14 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#153863]">// Proč {product.name}</p>
            <h2 className="mt-3 max-w-2xl font-heading text-3xl font-bold leading-[1.02] tracking-[-.02em] text-[#0A1628] sm:text-4xl lg:text-5xl">
              Technologie, která dává smysl v prostoru.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-[#5A6B78]">
            Hlavní přínosy a technické parametry se přizpůsobují konkrétnímu produktu a způsobu instalace.
          </p>
        </div>

        {benefits.length > 0 && (
          <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {benefits.map(([title, text], index) => (
              <article key={title} className="card-brand-benefit">
                <div className="ico">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3c3 4 5 6.5 5 9.5A5 5 0 0 1 7 12.5C7 9.5 9 7 12 3z" />
                  </svg>
                </div>
                <div className="code">// 0{index + 1}</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        )}

        {technical.length > 0 && (
          <div className="mt-5 grid overflow-hidden border border-[#D3E2E8] bg-white sm:grid-cols-2 lg:grid-cols-4">
            {technical.map((item, index) => (
              <div key={item.label} className={`flex items-center gap-4 p-5 sm:p-6 ${index > 0 ? 'border-t border-[#D3E2E8] sm:border-t-0 sm:border-l' : ''}`}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center text-[#153863]">
                  <item.icon size={20} strokeWidth={1.5} />
                </span>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[.14em] text-[#5A6B78]">{item.code}</p>
                  <p className="mt-1 font-heading text-sm font-semibold text-[#0A1628]">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}