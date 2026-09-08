import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, ShieldCheck, Anchor, Wifi, Wrench, Building2, Trees, Users, Store, Gauge, Layers3, Ruler, Sparkles, ArrowRight } from 'lucide-react';
import ProductSignatureSystem from './ProductSignatureSystem';

function MiniCard({ icon: Icon, title, text }) {
  return <motion.div whileHover={{ y: -3 }} className="rounded-[18px] border border-slate-200 bg-[#fbfdfe] p-5 transition-all hover:border-cyan-200 hover:shadow-[0_12px_30px_rgba(11,72,96,.06)]"><Icon size={26} className="text-[#39b9e6]" strokeWidth={1.7}/><h3 className="mt-4 text-[15px] font-semibold leading-tight text-slate-950">{title}</h3><p className="mt-2 text-xs leading-relaxed text-slate-500">{text}</p></motion.div>;
}

export default function ProductReferenceSheet({ product, techRows = [], onPoptat, onShowInstallation, onShowSmart }) {
  const benefits = [
    { icon: Droplets, title: 'Nízkotlaké mlžení', text: product.pressure ? `Provozní tlak: ${product.pressure}.` : 'Provozní princip se navrhuje podle konkrétní instalace.' },
    { icon: ShieldCheck, title: 'Nerezová konstrukce', text: product.material || 'Materiál dle technické specifikace produktu.' },
    { icon: Anchor, title: 'Čisté kotvení', text: 'Kotvení a přívod vody lze řešit s důrazem na čistý vzhled finálního prostoru.' },
    { icon: Wifi, title: 'Chytré řízení', text: 'Volitelné časové nebo senzorické řízení podle projektu.' },
    { icon: Wrench, title: 'Servisní řešení', text: 'Montáž a servis se řeší podle konkrétního produktu a lokality.' }
  ];

  const useCases = [
    { icon: Building2, label: 'Městský prostor' },
    { icon: Trees, label: 'Parky a zeleň' },
    { icon: Users, label: 'Pobytové zóny' },
    { icon: Store, label: 'Komerční areály' }
  ];

  return (
    <section className="product-reference-sheet bg-white py-10 sm:py-12 xl:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-7 xl:px-10">
        <div className="mb-7 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
          <div><p className="font-mono text-[10px] font-semibold uppercase tracking-[.2em] text-slate-400">{product.name}</p><h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Klíčové výhody</h2></div>
          <p className="max-w-xl text-sm leading-relaxed text-slate-500">Čistý design, funkční mlžení a projektové řešení podle konkrétního prostoru. Technické údaje níže vycházejí pouze z dat přiřazených tomuto produktu.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">{benefits.map((item) => <MiniCard key={item.title} {...item}/>)}</div>

        <div className="mt-10">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-heading text-2xl font-semibold tracking-tight text-slate-950">Varianty</h2><p className="mt-1 text-xs text-slate-500">Pouze schválené konfigurace daného produktu. Geometrie prvku se svévolně nemění.</p></div></div>
          <ProductSignatureSystem product={product} showSignatures={false}/>
        </div>

        <div className="mt-9 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
          <div>
            <div className="mb-4 flex items-end justify-between gap-3"><div><h2 className="font-heading text-2xl font-semibold tracking-tight text-slate-950">Technické parametry</h2><p className="mt-1 text-xs text-slate-500">Potvrzené údaje produktu bez univerzálních hodnot.</p></div></div>
            <div className="grid gap-px overflow-hidden rounded-[20px] border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
              {techRows.slice(0,6).map((row) => { const Icon = row.icon || Gauge; return <div key={row.label} className="bg-white p-4"><Icon size={21} className="text-[#39b9e6]"/><p className="mt-3 text-[11px] font-semibold uppercase tracking-[.08em] text-slate-500">{row.label}</p><p className="mt-1 text-sm font-semibold leading-snug text-slate-950">{row.value}</p></div>; })}
            </div>
          </div>

          <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-[linear-gradient(145deg,#dff4fb,#f8fcfd)] p-5">
            <p className="text-sm font-semibold text-[#0b4860]">Detail, na kterém záleží.</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">Povrch, trysky a napojení vždy odpovídají konkrétnímu výrobku a schválené technické konfiguraci.</p>
            {product.image_url && <div className="mt-4 overflow-hidden rounded-xl bg-white"><img src={product.image_url} alt={`${product.name} – technický detail`} className="aspect-[4/3] w-full object-contain p-3" loading="lazy"/></div>}
          </div>
        </div>

        <div className="mt-9 grid gap-5 xl:grid-cols-3">
          <div className="xl:col-span-1"><h2 className="font-heading text-2xl font-semibold tracking-tight text-slate-950">Vhodné pro</h2><div className="mt-4 grid grid-cols-2 gap-2">{useCases.map(({icon:Icon,label}) => <div key={label} className="rounded-[16px] border border-slate-200 bg-[#fbfdfe] p-4 text-center"><Icon size={23} className="mx-auto text-[#39b9e6]"/><p className="mt-2 text-xs font-semibold text-slate-700">{label}</p></div>)}</div></div>

          <button type="button" onClick={onShowInstallation} className="group text-left overflow-hidden rounded-[20px] border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(11,72,96,.07)]"><div className="flex items-center justify-between"><h2 className="font-heading text-2xl font-semibold tracking-tight text-slate-950">Instalace</h2><ArrowRight size={17} className="text-[#39b9e6] transition-transform group-hover:translate-x-1"/></div><div className="mt-6 rounded-2xl bg-slate-50 p-5"><div className="mx-auto h-28 w-10 rounded-t-full bg-gradient-to-r from-slate-400 via-white to-slate-500"/><div className="mx-auto h-3 w-24 rounded bg-slate-400"/><div className="mx-auto mt-1 h-14 w-36 rounded-b-lg bg-slate-300"/></div><p className="mt-4 text-xs leading-relaxed text-slate-500">Skryté nebo přiznané kotvení, přívod vody a základ se navrhují podle produktu a podloží.</p></button>

          <button type="button" onClick={onShowSmart} className="group text-left overflow-hidden rounded-[20px] border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(11,72,96,.07)]"><div className="flex items-center justify-between"><h2 className="font-heading text-2xl font-semibold tracking-tight text-slate-950">Chytré ovládání</h2><Wifi size={22} className="text-[#39b9e6]"/></div><div className="mt-6 grid grid-cols-[.8fr_1.2fr] gap-4"><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center"><div className="mx-auto flex h-16 w-10 items-center justify-center rounded-xl border-2 border-slate-300 bg-white"><span className="h-5 w-5 rounded-full bg-emerald-400"/></div><p className="mt-2 text-[10px] font-semibold text-slate-600">Mlžení zapnuto</p></div><div className="space-y-2">{['Podle teploty','Časový plán','Senzor / provozní logika'].map((label)=><div key={label} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-[11px] font-medium text-slate-600"><Sparkles size={12} className="text-[#39b9e6]"/>{label}</div>)}</div></div><p className="mt-4 text-xs leading-relaxed text-slate-500">Volitelná vrstva řízení. Konkrétní komponenty se volí podle projektu.</p></button>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-5 overflow-hidden rounded-[22px] border border-cyan-100 bg-[linear-gradient(90deg,#edf9fd,#ffffff)] p-6 sm:flex-row sm:items-center"><div><p className="font-mono text-[9px] font-semibold uppercase tracking-[.18em] text-cyan-700">Udělejme váš prostor příjemnější</p><h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-slate-950">Chci návrh a cenovou nabídku</h2><p className="mt-2 text-sm text-slate-500">Probereme možnosti, doporučíme řešení a technické podklady doplníme až podle konkrétního místa.</p></div><button type="button" onClick={onPoptat} className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-lg bg-[#86d7f4] px-6 text-sm font-bold text-[#073747] transition hover:bg-[#6ccbed]">Kontaktovat tým MLŽIDLA.cz <ArrowRight size={15}/></button></div>
      </div>
    </section>
  );
}
