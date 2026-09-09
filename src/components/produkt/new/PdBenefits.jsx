import React from 'react';
import { Layers, Gauge, Droplets, Waves, Wifi } from 'lucide-react';

export default function PdBenefits({ product }) {
  const benefits = [
    product.material && { icon: Layers, label: 'Materiál', value: product.material },
    product.pressure && { icon: Gauge, label: 'Provozní tlak', value: product.pressure },
    product.water_consumption && { icon: Droplets, label: 'Spotřeba vody', value: product.water_consumption },
    product.micron_size && { icon: Waves, label: 'Kapky', value: product.micron_size },
    product.power_supply && { icon: Wifi, label: 'Ovládání', value: product.power_supply },
  ].filter(Boolean);

  if (benefits.length === 0) return null;

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Klíčové výhody</p>
        <h2 className="mt-4 font-heading text-3xl leading-tight text-[#0D2F4F] lg:text-4xl">{product.name}</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {benefits.map((b) => (
            <div key={b.label} className="border border-[#EAF5FB] bg-white p-6">
              <b.icon size={24} className="text-[#0B5EA8]" />
              <p className="mt-4 font-mono text-[10px] uppercase tracking-wide text-[#0D2F4F]/45">{b.label}</p>
              <p className="mt-1 font-heading text-base font-semibold text-[#0D2F4F]">{b.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}