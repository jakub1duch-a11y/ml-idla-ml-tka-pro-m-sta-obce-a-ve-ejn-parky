import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, Sun, Sparkles, SlidersHorizontal, ShieldCheck, Wrench, Factory } from 'lucide-react';

// Přehledné informace o výrobcích, funkci a výrobě.
// Záměrně bez dalšího obrazového slideru, pohybujících se kulis a duplicitního loga.
const benefits = [
  { icon: Sun, title: 'Osvěžení', text: 'Příjemné ochlazení v horkých dnech.' },
  { icon: ShieldCheck, title: 'Nerezová výroba', text: 'Odolné konstrukce z nerezové oceli.' },
  { icon: Sparkles, title: 'Design na míru', text: 'Originální řešení pro každý prostor.' },
  { icon: SlidersHorizontal, title: 'Chytré řízení', text: 'Promyšlený provoz a automatizace.' },
];
const facts = [
  { name: 'Konstrukce', value: 'Nerezová ocel' },
  { name: 'Přívod', value: 'Napojení na vodu' },
  { name: 'Provoz', value: 'Nízkotlaký nebo vysokotlaký systém dle návrhu' },
  { name: 'Řízení', value: 'Ruční nebo automatické / SUPLA' },
];

export function HomeOverview() {
  return (
    <section className="bg-white text-[#0D2F4F]" aria-labelledby="home-about-title">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-20 lg:px-10 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.03fr_.97fr] lg:gap-16">
          <div className="max-w-[610px]">
            <p className="text-xs font-bold uppercase tracking-[.1em] text-[#076EDC]">MLŽIDLA.CZ · česká výroba HolmTec</p>
            <h1 id="home-about-title" className="mt-5 font-heading text-[clamp(2.2rem,4.35vw,4.45rem)] font-extrabold leading-[1.09] tracking-[-.048em]">Designová mlžítka, která mění veřejný prostor.</h1>
            <p className="mt-7 max-w-[580px] text-base leading-8 text-[#39556B] sm:text-lg">Navrhujeme a vyrábíme nerezová mlžítka, mlžné brány a originální mlžné instalace na míru pro města, parky, školy, sportovní areály i soukromé prostory.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/katalog-mlzitek" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#086EF2] px-6 text-sm font-bold text-white transition-colors hover:bg-[#095DC6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#086EF2]">Prohlédnout mlžítka <ArrowRight size={18} /></Link>
              <Link to="/poptavka" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#9FAFBE] bg-white px-6 text-sm font-bold text-[#0D2F4F] transition-colors hover:border-[#086EF2] hover:text-[#086EF2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#086EF2]">Poptat řešení</Link>
            </div>
          </div>
          <figure className="m-0 overflow-hidden rounded-[26px] bg-[#EAF2F6]">
            <picture>
              <source media="(max-width: 639px)" srcSet="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/4b88f291b_hero_steblo_gate_mobile_20261101.webp" type="image/webp" />
              <source media="(max-width: 1023px)" srcSet="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/b8e5c344d_hero_steblo_gate_tablet_20261101.webp" type="image/webp" />
              <img className="block aspect-[5/4] w-full object-cover object-[28%_center] sm:aspect-[4/3] lg:aspect-[5/4]" src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9f27dc9cf_hero_steblo_gate_desktop_20261101.webp" alt="Mlžná brána STÉBLO GATE výrobce Mlžidla.cz – HolmTec v parku" loading="lazy" decoding="async" />
            </picture>
          </figure>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-5" aria-label="Hlavní přednosti našich mlžítek">
          {benefits.map(({ icon: Icon, title, text }) => (
            <article key={title} className="flex items-start gap-4 rounded-[20px] border border-[#E5EBF1] bg-[#FAFCFE] p-5 shadow-[0_5px_22px_rgba(10,35,66,.035)] sm:flex-col sm:gap-3 sm:p-6">
              <Icon className="mt-0.5 shrink-0 text-[#086EF2]" size={30} strokeWidth={1.7} aria-hidden="true" />
              <div><h2 className="font-heading text-base font-bold leading-snug sm:text-lg">{title}</h2><p className="mt-1 text-sm leading-6 text-[#526B7D]">{text}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeTechnology() {
  return (
    <section className="bg-[#F4F8FB] py-20 text-[#0D2F4F] sm:py-24" aria-labelledby="home-technology-title">
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-20 lg:px-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#087EAA]">Jak mlžení funguje</p>
          <h2 id="home-technology-title" className="mt-4 font-heading text-3xl font-bold tracking-[-.04em] sm:text-4xl">Jednoduchý princip. Promyšlená technologie.</h2>
          <p className="mt-6 max-w-lg text-base leading-8 text-[#526B7D]">Voda prochází rozvodem k mlžným tryskám, které ji rozptylují na jemné kapky. Konkrétní tlak, spotřeba, počet trysek i způsob řízení závisí na zvoleném modelu a podmínkách instalace.</p>
          <Link to="/smart-ovladani" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#0A6795] hover:underline">Více o chytrém ovládání <ArrowRight size={17} /></Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-[#D9E6ED] bg-white">
          {facts.map((fact, i) => <div key={fact.name} className={`grid gap-2 px-6 py-5 sm:grid-cols-[130px_1fr] sm:gap-5 ${i ? 'border-t border-[#E5EDF1]' : ''}`}>
            <span className="text-xs font-semibold uppercase tracking-[.1em] text-[#6C8798]">{fact.name}</span>
            <span className="text-sm font-semibold leading-6 text-[#0D2F4F]">{fact.value}</span>
          </div>)}
          <div className="border-t border-[#E5EDF1] bg-[#F9FCFD] px-6 py-4 text-xs leading-5 text-[#587285]">Přesné technické parametry, požadavky na vodu a možnosti regulace uvádíme u konkrétních produktů.</div>
        </div>
      </div>
    </section>
  );
}

export function HomeHolmTec() {
  return (
    <section className="bg-white py-20 text-[#0D2F4F] sm:py-24" aria-labelledby="home-holmtec-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="grid grid-cols-2 gap-3 rounded-[24px] bg-[#F4F8FB] p-4 sm:gap-5 sm:p-6">
            <div className="flex min-h-[185px] flex-col justify-between rounded-xl bg-white p-5"><Factory className="text-[#0B83BC]" size={30} /><div><strong className="block font-heading text-lg">Česká výroba</strong><span className="mt-2 block text-sm text-[#587285]">Trutnov · HolmTec</span></div></div>
            <div className="flex min-h-[185px] flex-col justify-between rounded-xl bg-white p-5"><Wrench className="text-[#0B83BC]" size={30} /><div><strong className="block font-heading text-lg">Vlastní zpracování</strong><span className="mt-2 block text-sm text-[#587285]">Ohýbání a výroba nerezových prvků</span></div></div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#087EAA]">Za značkou Mlžidla.cz</p>
            <h2 id="home-holmtec-title" className="mt-4 font-heading text-3xl font-bold tracking-[-.04em] sm:text-4xl">Design s technickým zázemím HolmTec.</h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#526B7D]">Naše zkušenosti se zpracováním nerezových trubek promítáme do návrhu a výroby mlžítek. Od prvního nápadu přes konstrukční řešení až po instalaci a údržbu.</p>
            <div className="mt-7 flex flex-wrap gap-5">
              <Link to="/ke-stazeni" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A6795] hover:underline"><ShieldCheck size={18} /> Technické podklady <ArrowRight size={16} /></Link>
              <a href="https://holmtec.cz/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A6795] hover:underline">Více o HolmTec <ArrowRight size={16} /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
