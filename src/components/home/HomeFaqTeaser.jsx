import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, BookOpen, Droplets, Wrench, Settings2 } from 'lucide-react';

export default function HomeFaqTeaser() {
  return (
    <section aria-labelledby="home-faq-teaser-title" className="w-full px-5 sm:px-8 py-12 md:py-16 bg-[#f5f7f7]">
      <Link to="/faq" className="group mx-auto flex max-w-6xl flex-col gap-6 rounded-[24px] border border-[#dce5e7] bg-white p-6 shadow-[0_8px_32px_rgba(15,40,48,.035)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#a9cbd0] hover:shadow-[0_16px_42px_rgba(15,40,48,.09)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#217c90] sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-start gap-4 sm:items-center">
          <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e9f5f5] text-[#247a88]"><BookOpen size={23} strokeWidth={1.7}/></span>
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[.17em] text-[#57808a]">Rady a technická podpora</p>
            <h2 id="home-faq-teaser-title" className="text-xl font-semibold tracking-tight text-[#152d35] md:text-2xl">Jak se o mlžítko starat?</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#61737a]">Praktické odpovědi k instalaci, údržbě a každodennímu provozu.</p>
            <div aria-hidden="true" className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#6b858b]"><span className="inline-flex items-center gap-1.5"><Wrench size={14}/> Instalace</span><span className="inline-flex items-center gap-1.5"><Droplets size={14}/> Údržba</span><span className="inline-flex items-center gap-1.5"><Settings2 size={14}/> Provoz</span></div>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-[#d7e4e6] px-4 py-2.5 text-sm font-semibold text-[#174b58] transition-colors group-hover:border-[#217c90] group-hover:bg-[#edf8f8] sm:self-auto">Přejít na časté dotazy <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true"/></span>
      </Link>
    </section>
  );
}
