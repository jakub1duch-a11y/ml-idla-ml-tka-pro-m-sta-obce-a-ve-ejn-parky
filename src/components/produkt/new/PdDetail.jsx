import React from 'react';

export default function PdDetail({ product }) {
  const gallery = (product.gallery_urls || []).filter(Boolean);
  const detailImg = gallery[0] || product.image_url;

  if (!detailImg) return null;

  const captions = [
    { label: 'Materiál', value: product.material || 'Nerezová ocel' },
    { label: 'Trysky', value: product.micron_size || 'Jemná mlha 50–100 µm' },
    { label: 'Povrch', value: 'Saténově broušený, svařovaný TIG' },
  ];

  return (
    <section className="bg-[#EAF5FB] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Detail</p>
        <h2 className="mt-4 font-heading text-3xl leading-tight text-[#0D2F4F] lg:text-4xl">Detail, na kterém záleží.</h2>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div className="overflow-hidden">
            <img src={detailImg} alt={`${product.name} — detail`} loading="lazy" className="aspect-[16/10] w-full object-cover" />
          </div>
          <div className="space-y-6">
            {captions.map((c) => (
              <div key={c.label} className="border-l-2 border-[#0B5EA8] pl-4">
                <p className="font-mono text-[10px] uppercase tracking-wide text-[#0D2F4F]/45">{c.label}</p>
                <p className="mt-1 font-heading text-base font-semibold text-[#0D2F4F]">{c.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}