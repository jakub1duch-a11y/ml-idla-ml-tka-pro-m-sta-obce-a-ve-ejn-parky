import React from 'react';

export default function ImageGridBlock({ data }) {
  const { heading, images } = data || {};
  const list = Array.isArray(images) ? images.filter(Boolean) : [];
  if (list.length === 0) return null;
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
      {heading && <h2 className="font-heading text-3xl font-bold text-slate-900 tracking-tight mb-8">{heading}</h2>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {list.map((src, i) => (
          <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-slate-100">
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}