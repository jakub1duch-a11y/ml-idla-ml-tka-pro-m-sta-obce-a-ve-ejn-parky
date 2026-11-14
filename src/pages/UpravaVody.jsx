import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Filter, Gauge, ArrowRight, ShieldCheck, Wrench } from 'lucide-react';
import { setSEO } from '@/lib/seo';

const steps = [
  { icon: Droplets, title: '01 · Přívod pitné vody', text: 'Základem je vhodný zdroj pitné vody a kontrola místních provozních podmínek.' },
  { icon: Filter, title: '02 · Mechanická filtrace', text: 'Předfiltr zachytává pevné nečistoty. Jemnost filtru se vybírá podle použité trysky a rozboru vody.' },
  { icon: Gauge, title: '03 · Změkčování podle tvrdosti', text: 'U tvrdé vody lze navrhnout iontoměničový změkčovač. Ten omezuje tvorbu vápenatých usazenin, ale nenahrazuje dezinfekci.' },
  { icon: ShieldCheck, title: '04 · Hygienicky bezpečný provoz', text: 'Po odstávkách je důležitý proplach, kontrola hygieny a pravidelný servis. Samotná filtrace ani změkčení nezaručují mikrobiologickou bezpečnost.' },
];
const questions = [
  ['Je změkčovač nutný pro každé mlžítko?', 'Ne. Rozhoduje tvrdost vody, provozní režim a doporučení pro konkrétní trysky. Před výběrem je vhodné ověřit kvalitu vstupní vody.'],
  ['Odstraní běžný filtr vodní kámen?', 'Mechanický filtr zachytává částice, ale rozpuštěné soli způsobující tvrdost vody běžně neodstraňuje.'],
  ['Mohu používat dešťovou vodu?', 'Pro mlžení určené do prostoru s lidmi doporučujeme pitnou vodu. Jiné zdroje vyžadují individuální hygienické a technické posouzení.'],
  ['Jak se systém udržuje?', 'Kontroluje se stav filtrů, trysek, případné regenerační soli změkčovače, těsnost, proplach a sezónní odstavení podle konkrétního zařízení.'],
];
export default function UpravaVody() {
  useEffect(() => setSEO({
    title: 'Úprava a změkčování vody pro nízkotlaká mlžítka | MLŽIDLA.cz',
    description: 'Jak chránit trysky nízkotlakých mlžítek před nečistotami a vodním kamenem. Filtrace, změkčování, hygiena vody a servisní doporučení HolmTec.',
    keywords: 'úprava vody pro mlžítka, změkčování vody mlžítka, filtrace vody trysky, vodní kámen mlžení',
    canonicalPath: '/uprava-vody'
  }), []);
  return <main className="min-h-screen bg-white text-slate-900 pt-20">
    <section className="relative overflow-hidden bg-[#0d171c] text-white py-24 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-36 h-[32rem] w-[32rem] rounded-full bg-cyan-400/15 blur-[100px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <p className="font-mono text-xs uppercase tracking-[.3em] text-cyan-300">MLŽIDLA® · Technologie vody</p>
        <h1 className="mt-6 max-w-4xl font-heading text-4xl font-semibold leading-tight sm:text-6xl">Čistá voda. Spolehlivé mlžení.</h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300">Správně zvolená filtrace a případné změkčování pomáhají chránit trysky nízkotlakých mlžítek před nečistotami a vodním kamenem. Řešení navrhujeme podle kvality vody a konkrétní instalace.</p>
        <div className="mt-9 flex flex-wrap gap-3"><Link to="/kontakt" className="rounded-full bg-white px-7 py-3.5 font-semibold text-slate-900 hover:bg-cyan-100">Poptat úpravu vody <ArrowRight className="ml-2 inline" size={17}/></Link><Link to="/servis-udrzba" className="rounded-full border border-white/30 px-7 py-3.5 font-semibold hover:bg-white/10">Servis a údržba</Link></div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-10">
      <p className="font-mono text-xs uppercase tracking-[.25em] text-[#0b4860]">Technický princip</p>
      <h2 className="mt-4 max-w-3xl font-heading text-3xl font-semibold sm:text-4xl">Čtyři kroky od přívodu vody k mlžicí trysce</h2>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">{steps.map(({icon: Icon,title,text}) => <article key={title} className="rounded-3xl border border-slate-200 bg-[#f7f8f6] p-7 transition-transform duration-300 hover:-translate-y-1"><Icon className="text-[#0b7892]" size={28}/><h3 className="mt-7 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-600">{text}</p></article>)}</div>
    </section>
    <section className="bg-[#f3f7f8] py-20"><div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-2 lg:px-10"><div><p className="font-mono text-xs uppercase tracking-[.25em] text-[#0b4860]">Co řeší úprava vody</p><h2 className="mt-4 font-heading text-3xl font-semibold">Méně usazenin, přehlednější údržba</h2><p className="mt-5 leading-8 text-slate-600">Pevné částice mohou zanášet jemné otvory trysek. Tvrdá voda zase může vytvářet minerální úsady. Filtrace a změkčování řeší rozdílné problémy a mohou se vhodně doplňovat. Výběr technologie musí zohlednit průtok, tlakové ztráty, tvrdost i hygienické požadavky.</p></div><div className="rounded-3xl bg-white p-8 shadow-sm"><h3 className="text-xl font-semibold">Orientační zapojení</h3><div className="mt-6 flex flex-wrap items-center gap-2 text-sm font-semibold">{['Pitná voda','Předfiltr','Volitelný změkčovač','Ventil / řízení','Mlžítko'].map((x,i)=><React.Fragment key={x}>{i>0&&<ArrowRight size={15} className="text-cyan-600"/>}<span className="rounded-xl bg-slate-100 px-3 py-3">{x}</span></React.Fragment>)}</div><p className="mt-6 text-sm leading-6 text-slate-500">Schéma je ilustrační. Skutečné pořadí armatur, zabezpečení proti zpětnému toku, proplach a servisní obtok určuje projekt a výrobce technologie.</p></div></div></section>
    <section className="mx-auto max-w-5xl px-5 py-20"><h2 className="font-heading text-3xl font-semibold">Časté dotazy k vodě a mlžení</h2><div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">{questions.map(([q,a])=><details key={q} className="group py-5"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-3 max-w-3xl leading-7 text-slate-600">{a}</p></details>)}</div><div className="mt-12 flex flex-wrap gap-4"><Link className="font-semibold text-[#0b4860] underline underline-offset-4" to="/podpora">Technická podpora</Link><Link className="font-semibold text-[#0b4860] underline underline-offset-4" to="/servis-udrzba">Údržba mlžítek</Link><Link className="font-semibold text-[#0b4860] underline underline-offset-4" to="/katalog-mlzitek">Katalog mlžítek</Link></div></section>
    <section className="bg-[#0d171c] py-16 text-white"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 px-5 sm:px-6 md:flex-row md:items-center lg:px-10"><div><h2 className="font-heading text-3xl font-semibold">Nechte posoudit vodu pro vaše mlžítko.</h2><p className="mt-3 text-slate-300">Sdělte nám zdroj vody, místo instalace a typ mlžítka. Doporučíme další postup.</p></div><Link to="/kontakt" className="shrink-0 rounded-full bg-white px-7 py-3.5 font-semibold text-slate-900">Nezávazná konzultace</Link></div></section>
  </main>;
}
