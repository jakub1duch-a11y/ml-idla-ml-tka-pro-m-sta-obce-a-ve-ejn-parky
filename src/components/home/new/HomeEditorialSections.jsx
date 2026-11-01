import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, Sun, Sparkles, SlidersHorizontal, ShieldCheck, Wrench, Factory } from 'lucide-react';

// Přehledné informace o výrobcích, funkci a výrobě.
// Záměrně bez dalšího obrazového slideru, pohybujících se kulis a duplicitního loga.
const benefits = [
  { icon: Sun, title: 'Osvěžení v horkých dnech', text: 'Vodní mlha pomáhá zpříjemnit pobyt v letním počasí.' },
  { icon: Droplets, title: 'Jemná vodní mlha', text: 'Mlžení přizpůsobujeme prostoru a potřebám jeho návštěvníků.' },
  { icon: Sparkles, title: 'Design pro konkrétní místo', text: 'Nerezové prvky propojují funkci, architekturu a veřejný prostor.' },
  { icon: SlidersHorizontal, title: 'Chytré řízení', text: 'Podle řešení lze nastavit časy, provozní režimy a automatizaci.' },
];
const facts = [
  { name: 'Konstrukce', value: 'Nerezová ocel' },
  { name: 'Přívod', value: 'Napojení na vodu' },
  { name: 'Provoz', value: 'Nízkotlaký nebo vysokotlaký systém dle návrhu' },
  { name: 'Řízení', value: 'Ruční nebo automatické / SUPLA' },
];

export function HomeOverview() {
  return (
    <>
      <section className="bg-white py-20 text-[#0D2F4F] sm:py-24 lg:py-32" aria-labelledby="home-about-title">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-20 lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#087EAA]">Mlžidla.cz · česká výroba HolmTec</p>
            <h1 id="home-about-title" className="mt-5 max-w-2xl font-heading text-[clamp(2.15rem,4.2vw,4.15rem)] font-bold leading-[1.12] tracking-[-.045em]">Designová mlžítka, která mění veřejný prostor.</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#39556B]">Navrhujeme a vyrábíme nerezová mlžítka, mlžné brány a originální mlžné sochy. Spojujeme přesné zpracování nerezu, moderní design a promyšlené řízení vodní mlhy.</p>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#526B7D]">Pro města, obce, parky, školy, sportoviště i soukromé prostory. Každé řešení přizpůsobujeme místu a způsobu využití.</p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link to="/katalog-mlzitek" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0D2F4F] px-6 text-sm font-semibold text-white transition hover:bg-[#14517C]">Prohlédnout mlžítka <ArrowRight size={18} /></Link>
              <Link to="/poptavka" className="inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-[#0A6795] hover:underline">Poptat řešení <ArrowRight size={17} /></Link>
            </div>
          </div>
          <figure className="overflow-hidden rounded-[28px] bg-[#EAF2F6] shadow-[0_18px_60px_rgba(10,35,66,.08)]">
            <img className="aspect-[5/4] w-full object-cover" src="/media/optimized/e7593e68f_realizace-IMG_5072.webp" alt="Nerezová designová mlžítka Mlžidla.cz od výrobce HolmTec" loading="lazy" decoding="async" />
            <figcaption className="border-t border-[#D7E5EC] bg-[#F4F8FB] px-6 py-4 text-xs font-medium text-[#4F6A7B]">Mlžidla.cz · návrh a výroba HolmTec, Trutnov</figcaption>
          </figure>
        </div>
      </section>
      <section className="bg-[#F4F8FB] py-20 text-[#0D2F4F] sm:py-24" aria-labelledby="home-benefits-title">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#087EAA]">Proč mlžítka</p>
          <h2 id="home-benefits-title" className="mt-4 max-w-2xl font-heading text-3xl font-bold tracking-[-.04em] sm:text-4xl">Osvěžení, design a pohodlí v jednom.</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-[#E1EAF0] bg-white p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F5FB] text-[#087EAA]"><Icon size={23} strokeWidth={1.8} aria-hidden="true" /></div>
              <h3 className="mt-6 font-heading text-lg font-bold leading-snug">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#526B7D]">{text}</p>
            </article>)}
          </div>
        </div>
      </section>
    </>
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
