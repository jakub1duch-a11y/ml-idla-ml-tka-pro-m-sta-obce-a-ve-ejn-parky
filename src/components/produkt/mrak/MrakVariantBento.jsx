import React from 'react';
import { motion } from 'framer-motion';
import { MRAK_DETAILS } from '@/components/produkt/nozzles/nozzleData';

const reveal = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' }, transition: { duration: 0.5 } };

export default function MrakVariantBento({ model, content }) {
  const photos = [
    { image: model.scene || model.image, label: model.scene ? 'Návrh v prostoru' : 'Tvar varianty', contain: !model.scene },
    ...MRAK_DETAILS.map((d) => ({ ...d, contain: false })),
  ];
  return (
    <section className="bg-background px-5 py-20 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground">PREZENTACE PRODUKTU</p>
        <h2 className="mt-3 max-w-2xl font-heading">Tvar, detail a místo, kde vytváří chládek</h2>
        <div className="mt-10 grid auto-rows-[220px] grid-cols-1 gap-4 md:grid-cols-4">
          <motion.figure {...reveal} className="group relative overflow-hidden border border-border bg-card md:col-span-2 md:row-span-2">
            <img src={photos[0].image} alt={`${model.name} · ${photos[0].label}`} className={`h-full w-full transition-transform duration-700 group-hover:scale-105 ${photos[0].contain ? 'object-contain p-8' : 'object-cover'}`} />
            <figcaption className="absolute bottom-4 left-4 bg-background/90 px-3 py-2 text-xs font-semibold">{photos[0].label}</figcaption>
          </motion.figure>
          {content.features.map((f, i) => (
            <motion.div key={f.title} {...reveal} transition={{ duration: 0.5, delay: i * 0.08 }} className={`flex flex-col justify-between border border-border p-6 ${i === 0 ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
              <span className="font-mono text-xs opacity-60">0{i + 1}</span>
              <div><h3 className="font-heading text-lg">{f.title}</h3><p className="mt-2 text-sm opacity-80">{f.text}</p></div>
            </motion.div>
          ))}
          {photos.slice(1).map((p) => (
            <motion.figure key={p.image} {...reveal} className="group relative overflow-hidden border border-border bg-card md:col-span-2">
              <img src={p.image} alt={`${model.name} · ${p.label}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <figcaption className="absolute bottom-4 left-4 bg-background/90 px-3 py-2 text-xs font-semibold">{p.label} · AI vizualizace</figcaption>
            </motion.figure>
          ))}
          <motion.div {...reveal} className="flex flex-col justify-center border border-border bg-muted p-6">
            <p className="font-mono text-xs text-muted-foreground">VHODNÉ PRO</p>
            <ul className="mt-3 space-y-2">{content.audience.map((a) => <li key={a} className="font-heading text-base">{a}</li>)}</ul>
          </motion.div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Vizualizace nejsou výrobní výkresy. Rozměry a kotvení potvrdí technický návrh.</p>
      </div>
    </section>
  );
}