import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function BlogVisualInspiration({ items = [] }) {
  if (!items.length) return null;

  return (
    <section className="bg-[#071A2F] py-16 text-white lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-cyan-300">Návrhová inspirace · schválené vizualizace</p>
            <h2 className="mt-3 font-heading text-3xl tracking-[-.035em] sm:text-4xl lg:text-5xl">Tvary, sestavy a nové možnosti mlžení.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60">Návrhové vizualizace z administrace slouží jako inspirace pro nové projekty. Nejsou vydávány za realizace a používají pouze schválenou produktovou geometrii.</p>
          </div>
          <Link to="/mlzidla-mlzitka" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200">Prohlédnout produkty <ArrowRight size={15}/></Link>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((item, index) => (
            <article key={item.id || item.image_url || index} className="group overflow-hidden rounded-[24px] border border-white/10 bg-white/[.035]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={item.thumbnail_url || item.image_url} alt={item.title || item.product_name || 'Návrhová vizualizace mlžítka'} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" loading="lazy"/>
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#071A2F]/75 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.14em] text-white backdrop-blur-md"><Sparkles size={10}/> Vizualizace</span>
              </div>
              <div className="p-5">
                <p className="font-mono text-[9px] uppercase tracking-[.15em] text-cyan-300">{item.product_name || item.product_slug || 'MLŽIDLA®'}</p>
                <h3 className="mt-2 font-heading text-xl">{item.title || 'Návrh prostorového řešení'}</h3>
                <p className="mt-2 text-xs leading-5 text-white/50">{[item.configuration, item.environment].filter(Boolean).join(' · ')}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
