import React from 'react';
import { Droplets, Ruler, Gauge } from 'lucide-react';

export const TEEPEE_STUDIO_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9c7080572_generated_image.png';
export const TEEPEE_NOZZLE_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ae73692aa_generated_image.png';

const FACTS = [
  { icon: Ruler, label: 'Výška / šířka', value: '2 400 / 1 600 mm' },
  { icon: Gauge, label: 'Provozní tlak', value: '2–8 bar' },
  { icon: Droplets, label: 'Jemnost mlhy', value: '50–100 μm' },
];

export default function PdTeepeeStudio({ product }) {
  if (product?.slug !== 'teepee') return null;
  return (
    <section className="bg-[#F4FAFC]" data-analytics-section="teepee-studio">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#0E5B67]">Samostojná mlžná trojnožka</p>
        <h2 className="mt-4 max-w-3xl font-heading text-4xl leading-[1.03] text-[#0D2D38] sm:text-5xl">Čistá geometrie. Jemná mlha z vrcholu.</h2>

        <div className="mt-10 grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
          <figure className="overflow-hidden border border-[#D3E2E8] bg-white">
            <img src={TEEPEE_STUDIO_URL} alt={`${product.name} – studiový náhled samostojné mlžné trojnožky`} loading="lazy" className="aspect-[4/5] w-full object-cover" />
            <figcaption className="px-5 py-3 font-mono text-[10px] uppercase tracking-[.16em] text-[#5A6B78]">Studiový náhled · geometrie dle referenční fotografie</figcaption>
          </figure>
          <div className="flex flex-col gap-4">
            <figure className="relative flex-1 overflow-hidden border border-[#D3E2E8] bg-[#0D2D38]">
              <img src={TEEPEE_NOZZLE_URL} alt={`${product.name} – detail mlžné hlavy a trysek na vrcholu konstrukce`} loading="lazy" className="h-full min-h-[260px] w-full object-cover" />
              <figcaption className="absolute bottom-0 left-0 bg-[#0D2D38]/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[.16em] text-[#61D5E5] backdrop-blur-sm">Detail mlžné hlavy a trysek</figcaption>
            </figure>
            <dl className="grid grid-cols-3 divide-x divide-[#D3E2E8] border border-[#D3E2E8] bg-white">
              {FACTS.map(({ icon: Icon, label, value }) => (
                <div key={label} className="p-4">
                  <Icon size={18} strokeWidth={1.5} className="text-[#0E5B67]" />
                  <dt className="mt-3 text-[11px] text-[#5A6B78]">{label}</dt>
                  <dd className="mt-1 font-mono text-sm font-semibold text-[#0D2D38]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}