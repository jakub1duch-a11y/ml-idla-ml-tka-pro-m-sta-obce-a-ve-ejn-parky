import React from 'react';

const DRAWINGS = {
  'mlzna-spirála': {
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e9f87dc9f_224605786_1792549270242844.jpg',
    specs: [['Výška', '2 450 mm'], ['Průměr spirály', '780 mm'], ['Trubka', 'Ø 42 mm'], ['Přípojka', 'G 1/2"'], ['Kotevní příruba', 'Ø 160 mm, 4× M10'], ['Materiál', 'nerez']],
  },
};

export default function PdTechnicalDrawing({ product }) {
  const d = DRAWINGS[product?.slug];
  if (!d) return null;
  return <section className="border-t border-border bg-muted/40 py-14 lg:py-20">
    <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
      <img src={d.image} alt={`Technický výkres ${product.name}`} loading="lazy" className="w-full rounded-lg border border-border bg-card object-contain" />
      <div>
        <p className="font-mono text-xs text-muted-foreground">TECHNICKÝ VÝKRES</p>
        <h2 className="mt-3 font-heading text-3xl">Rozměry a osazení</h2>
        <dl className="mt-6 divide-y divide-border border-y border-border">
          {d.specs.map(([k, v]) => <div key={k} className="flex justify-between gap-4 py-3 text-sm"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium text-foreground">{v}</dd></div>)}
        </dl>
        <p className="mt-4 text-xs text-muted-foreground">Orientační návrhový výkres. Finální rozměry a počet trysek potvrdíme pro konkrétní místo.</p>
      </div>
    </div>
  </section>;
}