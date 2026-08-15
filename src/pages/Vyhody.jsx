import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Droplets, Gauge, Leaf, Radio, ShieldCheck, Snowflake, Sparkles, Wrench, Wind } from 'lucide-react';
import { setSEO } from '@/lib/seo';

const BENEFITS = [
  { icon: Snowflake, title: 'Tepelný komfort', text: 'Jemná vodní mlha pomáhá zpříjemnit pobyt v horkém veřejném prostoru. Účinek závisí na teplotě, vlhkosti, proudění vzduchu a návrhu instalace.' },
  { icon: Droplets, title: 'Provoz bez vysokotlakého čerpadla', text: 'Vybrané systémy MLŽIDLA® jsou navržené pro přímé napojení na běžný vodovodní řad, bez samostatné vysokotlaké technologie.' },
  { icon: Radio, title: 'Chytré řízení', text: 'Časové programy, teplotní podmínky a intervalový režim pomáhají omezit zbytečný provoz a zjednodušit správu zařízení.' },
  { icon: ShieldCheck, title: 'Nerezové provedení', text: 'Konstrukce z nerezové oceli je vhodná pro dlouhodobé venkovní použití a dobře zapadá do moderní architektury veřejného prostoru.' },
  { icon: Wrench, title: 'Servisovatelný systém', text: 'Filtrace, trysky, napojení i provozní režim navrhujeme tak, aby byla pravidelná kontrola a sezónní údržba co nejjednodušší.' },
  { icon: Sparkles, title: 'Design jako součást místa', text: 'Mlžítko může fungovat jako technický prvek i jako vizuální dominanta, která podporuje identitu náměstí, parku nebo areálu.' },
];

const CITY_BENEFITS = [
  ['Vyšší komfort návštěvníků', 'Příjemnější mikroklima podporuje pobyt lidí na náměstích, v parcích a pěších zónách během horkých dnů.'],
  ['Bez nutnosti klimatizovat otevřený prostor', 'Evaporační princip pracuje přímo v místě, kde je ochlazení potřeba, bez uzavřeného prostoru.'],
  ['Flexibilní architektura řešení', 'Samostatný prvek, brána, alej nebo víceprvkové mlžiště lze navrhnout podle provozu a charakteru lokality.'],
  ['Možnost chytrého provozu', 'Automatizace pomáhá spouštět mlžení jen tehdy, když to dává smysl vzhledem k počasí a návštěvnosti.'],
  ['Podklady pro projektanta a správce', 'Technické listy, schéma napojení, servisní režim a další podklady lze připravit podle rozsahu městského projektu.'],
  ['Český návrh, výroba a servis', 'Jeden partner pro návrh, výrobu, instalaci i následnou servisní podporu v ČR a SR.'],
];

export default function Vyhody() {
  useEffect(() => setSEO({
    title: 'Výhody a benefity mlžítek pro města a veřejný prostor | MLŽIDLA®',
    description: 'Hlavní benefity mlžítek: tepelný komfort, úsporný provoz, chytré řízení, nerezové provedení, servis a architektonická hodnota.',
    canonicalPath: '/vyhody'
  }), []);

  return <main className="bg-background pt-16">
    <section className="relative min-h-[520px] overflow-hidden bg-primary text-white lg:min-h-[620px]">
      <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ccf06b29a_mlzidla-mlzitka-pro-mesta-obce.webp" alt="Městské mlžítko ve veřejném prostoru" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#041c28]/95 via-[#041c28]/72 to-[#041c28]/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#041c28]/55 via-transparent to-[#041c28]/15" />
      <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-center px-6 py-20 lg:min-h-[620px] lg:px-10 lg:py-28">
       <div>
        <p className="font-mono text-[11px] uppercase tracking-[.2em] text-cyan-300">Výhody a benefity · MLŽIDLA®</p>
        <h1 className="mt-4 max-w-5xl font-heading text-4xl leading-[1.03] tracking-[-.03em] sm:text-5xl lg:text-7xl">Výhody a benefity mlžítek.</h1>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/78 sm:text-lg">Mlžítko není jen způsob ochlazení. U dobře navrženého projektu spojuje tepelný komfort, nízké nároky na provoz, jednoduchou správu a architektonickou hodnotu prostoru.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/mestske-mlzitka" className="btn-metallic-mist inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold">Městská mlžítka <ArrowRight size={16}/></Link>
          <Link to="/ochrana-zdravi" className="btn-secondary-outline inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white">Hygiena a ochrana zdraví</Link>
        </div>
       </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
      <div className="max-w-3xl"><p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">Hlavní benefity</p><h2 className="mt-3 font-heading text-3xl tracking-[-.02em] text-foreground sm:text-4xl lg:text-5xl">Co získáte dobře navrženým mlžením.</h2></div>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{BENEFITS.map(({icon:Icon,title,text})=><article key={title} className="rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-secondary/40 hover:shadow-lg"><div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-secondary"><Icon size={19}/></div><h3 className="mt-5 font-heading text-2xl text-foreground">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p></article>)}</div>
    </section>

    <section className="border-y border-border bg-slate-50 py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_1fr] lg:px-10 lg:items-center">
        <div className="grid grid-cols-2 gap-4">
          <figure className="col-span-2 overflow-hidden rounded-3xl aspect-[16/9]"><img src="/media/optimized/a2d77392e_Mlnbranyaportaly.webp" alt="Mlžná brána ve veřejném prostoru" className="h-full w-full object-cover" loading="lazy" /></figure>
          <figure className="overflow-hidden rounded-2xl aspect-square"><img src="/media/optimized/150f3566d_IMG_20260623_124103.webp" alt="Detail nerezového mlžítka" className="h-full w-full object-cover" loading="lazy" /></figure>
          <figure className="overflow-hidden rounded-2xl aspect-square"><img src="/media/optimized/9cf838258_MlzicisprchaaSMARTaplikace.webp" alt="Chytré řízení mlžítka" className="h-full w-full object-cover" loading="lazy" /></figure>
        </div>
        <div><p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">Pro města a veřejný prostor</p><h2 className="mt-3 font-heading text-3xl tracking-[-.02em] text-foreground sm:text-4xl lg:text-5xl">Benefit není jen teplota. Důležitý je celý provoz.</h2><p className="mt-5 text-base leading-relaxed text-muted-foreground">Město řeší životnost, hygienu vody, správu zařízení, servis, spotřebu a dokumentaci stejně jako samotný vzhled. Proto propojujeme návrh produktu s provozním řešením už od začátku.</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/ochrana-zdravi" className="btn-secondary-outline inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-foreground">Hygiena a provoz <ArrowRight size={15}/></Link><Link to="/smart-ovladani" className="btn-secondary-outline inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-foreground">Chytré ovládání <ArrowRight size={15}/></Link></div></div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
      <div className="max-w-3xl"><p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">Praktický přínos</p><h2 className="mt-3 font-heading text-3xl tracking-[-.02em] text-foreground sm:text-4xl lg:text-5xl">Šest důvodů, proč mlžítka dávají smysl městům.</h2></div>
      <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">{CITY_BENEFITS.map(([title,text],i)=><div key={title} className="grid gap-3 p-5 sm:grid-cols-[50px_1fr] sm:p-6"><span className="font-mono text-xs text-secondary">{String(i+1).padStart(2,'0')}</span><div><h3 className="font-heading text-xl text-foreground">{title}</h3><p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{text}</p></div></div>)}</div>
    </section>

    <section className="bg-primary py-20 text-white lg:py-24"><div className="mx-auto max-w-7xl px-6 lg:px-10"><div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><p className="font-mono text-[11px] uppercase tracking-[.18em] text-cyan-300">Další informace</p><h2 className="mt-3 max-w-3xl font-heading text-3xl tracking-[-.02em] sm:text-4xl lg:text-5xl">Od principu mlžení po hygienu a správu systému.</h2><p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">Pro městský projekt doporučujeme projít technologii, hygienu, chytré řízení i reálné realizace ještě před výběrem konkrétního modelu.</p></div><div className="flex flex-wrap gap-3 lg:justify-end"><Link to="/jak-to-funguje" className="btn-secondary-outline inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white">Jak fungují <ArrowRight size={15}/></Link><Link to="/reference" className="btn-secondary-outline inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white">Reference <ArrowRight size={15}/></Link><Link to="/poptavka" className="btn-metallic-mist inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold">Poptat projekt <ArrowRight size={15}/></Link></div></div></div></section>
  </main>;
}