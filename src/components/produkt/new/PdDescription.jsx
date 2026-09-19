import React from 'react';
import { getProductDetailConfig } from '@/lib/productDetailConfig';

export default function PdDescription({ product }) {
  const detailConfig = getProductDetailConfig(product);
  const intro = detailConfig.intro || product.short_description;

  const techTags = [
    product.material,
    product.pressure,
    product.water_consumption,
    product.micron_size,
    product.coverage_area,
    product.power_supply,
  ].filter(Boolean);

  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
          {/* Left: Eyebrow + heading */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#153863]">
              // {product.name}
            </p>
            <h2 className="mt-4 font-heading text-2xl font-bold leading-tight tracking-[-.02em] text-[#0A1628] sm:text-3xl lg:text-[2.5rem]">
              {product.short_description || detailConfig.tagline}
            </h2>
          </div>

          {/* Right: Description body */}
          <div className="text-[15px] leading-[1.75] text-[#0A1628]/70 lg:text-base">
            {intro && <p className="font-medium text-[#0A1628]">{intro}</p>}
            {!intro && (
              <p>Česká zakázková výroba nerezových mlžítek pro veřejný prostor. Každý projekt je originál navržený na míru prostoru, rozpočtu a záměru.</p>
            )}
          </div>
        </div>

        {/* Technical metadata tags */}
        {techTags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2 border-t border-[#D3E2E8] pt-6">
            {techTags.map((tag) => (
              <span key={tag} className="badge-brand-secondary">
                <span className="font-mono mr-1 text-[#5A6B78]">//</span>{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}