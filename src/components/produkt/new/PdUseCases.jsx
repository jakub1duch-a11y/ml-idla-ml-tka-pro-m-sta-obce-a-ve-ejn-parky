import React from 'react';
import { Building2, Trees, Footprints, Hotel, School, Store, MapPinned, Sparkles } from 'lucide-react';
import { getProductDetailConfig } from '@/lib/productDetailConfig';

const ICONS = [Building2, Trees, Footprints, Hotel, School, Store, MapPinned, Sparkles];

export default function PdUseCases({ product }) {
  const { useCases = [] } = getProductDetailConfig(product);
  if (!useCases.length) return null;

  return (
    <section className="bg-[#F4FAFC] py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#153863]">// Vhodné pro</p>
            <h2 className="mt-3 font-heading text-3xl font-bold leading-[1.03] tracking-[-.03em] text-[#0A1628] sm:text-4xl">
              Kde tento produkt dává největší smysl
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-[#5A6B78] lg:justify-self-end">
            Finální počet prvků, rozestupy, směr mlžení a způsob řízení se vždy navrhují podle konkrétního prostoru. Níže jsou typické scénáře použití této produktové řady.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-[#D3E2E8] bg-[#D3E2E8] sm:grid-cols-4">
          {useCases.map((label, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <div key={label} className="group bg-white p-5 transition-colors hover:bg-[#F8FCFD] sm:p-6">
                <Icon size={22} strokeWidth={1.5} className="text-[#0B5EA8]" />
                <p className="mt-5 font-heading text-sm font-semibold leading-tight text-[#0A1628] sm:text-base">{label}</p>
                <p className="mt-2 text-xs leading-5 text-[#5A6B78]">Návrh přizpůsobíme provozu, pohybu lidí a charakteru místa.</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
