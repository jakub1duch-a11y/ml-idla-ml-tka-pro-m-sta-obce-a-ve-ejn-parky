import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Building2, Trees, Wifi, Droplets, TimerReset, ThermometerSun, ShieldCheck, Gauge, Sparkles, CheckCircle2 } from 'lucide-react';
import { setSEO } from '@/lib/seo';

const CITY_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.jpg';
const BENDY_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/a73ab7232_Mltko-Bendy60-edited1.png';
const SMART_IMAGE = 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/d584008b5_Smartmlzitka-ovladanizmobilu.jpg';
const VALVE_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/c53ea2fd4_chytra-ochrana-pred-vytopenim-a-unikem-vody-peveko-s-wi-fi-ovladanim-pres-internet-JABLOSHOP-800x640.png';
const SMART_VIDEO = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/feff82d99_Aura-mlzitko-video-01.MP4';

const configs = {
  mesta: {
    path: '/ppc/mlzitka-pro-mesta-obce',
    eyebrow: 'PPC · města a obce',
    title: 'Mlžítka pro města a obce',
    lead: 'Architektonické ochlazení veřejného prostoru bez vysokotlakého čerpadla. Návrh, výroba, instalace i smart řízení v jednom projektu.',
    image: CITY_IMAGE,
    intent: 'Městská mlžítka pro město nebo obec',
    icon: Building2,
    points: ['Náměstí, pěší zóny a předprostory', 'Parky, sportoviště a veřejné budovy', 'Nerezové provedení pro dlouhodobý provoz', 'Projektová vizualizace před realizací'],
    useCases: ['Městská náměstí', 'Obecní centra', 'Promenády', 'Sportoviště', 'Školní areály', 'Veřejné parky']
  },
  parky: {
    path: '/ppc/mlzitka-namesti-parky',
    eyebrow: 'PPC · náměstí a parky',
    title: 'Ochlazení náměstí a parků',
    lead: 'Jemná vodní mlha jako součást kvalitního veřejného prostoru. Solitér, průchozí zóna nebo sestava více prvků podle dispozice místa.',
    image: BENDY_IMAGE,
    intent: 'Mlžítka pro náměstí a parky',
    icon: Trees,
    points: ['SINGLE, DUO i víceprvkové sestavy', 'Citlivé začlenění do architektury místa', 'Nízkotlaký provoz z vodovodního řadu', 'Možnost automatizovaného spouštění'],
    useCases: ['Náměstí', 'Městské parky', 'Pěší zóny', 'Nábřeží', 'Hřiště', 'Odpočinkové zóny']
  },
  smart: {
    path: '/ppc/chytra-mlzitka',
    eyebrow: 'PPC · Smart Cooling',
    title: 'Chytrá mlžítka s automatickým řízením',
    lead: 'Mlžení se spustí jen tehdy, když má. Podle teploty, času, senzoru nebo vzdáleného povelu. Více zón lze řídit samostatně.',
    image: SMART_IMAGE,
    video: SMART_VIDEO,
    intent: 'Chytrá mlžítka a Smart Cooling',
    icon: Wifi,
    points: ['Spuštění podle venkovní teploty', 'Časové plány a denní intervaly', 'Vzdálené ovládání přes aplikaci', 'Samostatné zóny a provozní scénáře'],
    useCases: ['Smart city', 'Parky', 'Náměstí', 'Sportoviště', 'Koupaliště', 'Veřejné areály']
  },
  ventil: {
    path: '/ppc/chytry-ventil-automatizace',
    eyebrow: 'PPC · chytrý ventil',
    title: 'Chytrý ventil pro automatické mlžení',
    lead: 'Řízený přívod vody pro mlžítka s Wi‑Fi ovládáním, harmonogramem a možností napojení na senzory a provozní logiku.',
    image: VALVE_IMAGE,
    intent: 'Chytrý ventil a automatizace mlžítek',
    icon: Droplets,
    points: ['Automatické otevření a uzavření vody', 'Wi‑Fi a vzdálené ovládání', 'Teplotní a časové scénáře', 'Možnost měření a správy spotřeby'],
    useCases: ['1 mlžítko', 'Více mlžítek', 'Více zón', 'Veřejné instalace', 'Zahrady a gastro', 'Smart city']
  }
};

const BENEFITS = [
  { icon: ThermometerSun, title: 'Spouštění podle podmínek', text: 'Teplota, časový plán nebo senzor mohou rozhodnout, kdy se systém aktivuje.' },
  { icon: TimerReset, title: 'Úsporný provoz', text: 'Systém neběží zbytečně mimo nastavené časy a provozní podmínky.' },
  { icon: Gauge, title: 'Bez vysokotlakého čerpadla', text: 'Vybrané systémy pracují přímo s dostupným tlakem vodovodního řadu.' },
  { icon: ShieldCheck, title: 'Projektové řešení', text: 'Hydrauliku, počet trysek, zóny, kotvení a řízení ověřujeme pro konkrétní místo.' }
];

export default function PpcLanding({ variant = 'mesta' }) {
  const cfg = configs[variant] || configs.mesta;
  const location = useLocation();
  const Icon = cfg.icon;
  const suffix = location.search ? `&${location.search.slice(1)}` : '';
  const inquiryUrl = `/poptavka?produkt=${encodeURIComponent(cfg.intent)}&zprava=${encodeURIComponent(`Mám zájem o ${cfg.intent}. Prosím o návrh řešení a orientační cenovou nabídku.`)}${suffix}`;

  useEffect(() => {
    setSEO({
      title: `${cfg.title} | MLŽIDLA®`,
      description: cfg.lead,
      canonicalPath: cfg.path,
      robots: 'noindex, follow'
    });
  }, [cfg]);

  return <main className="bg-white text-slate-950">
    <section className="relative min-h-[720px] overflow-hidden bg-[#082f3f]">
      {cfg.video ? <video src={cfg.video} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-45"/> : <img src={cfg.image} alt={cfg.title} className="absolute inset-0 h-full w-full object-cover opacity-55"/>}
      <div className="absolute inset-0 bg-gradient-to-r from-[#041c28]/98 via-[#082f3f]/84 to-[#041c28]/25"/>
      <div className="absolute inset-0 bg-gradient-to-t from-[#041c28]/70 via-transparent to-transparent"/>
      <div className="relative mx-auto flex min-h-[720px] max-w-7xl items-end px-6 pb-16 pt-28 lg:px-10 lg:pb-20">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-cyan-100 backdrop-blur"><Icon size={15}/>{cfg.eyebrow}</div>
          <h1 className="mt-6 max-w-4xl font-heading text-5xl leading-[.98] tracking-[-.04em] text-white sm:text-6xl lg:text-7xl">{cfg.title}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/78 sm:text-xl">{cfg.lead}</p>
          <div className="mt-9 flex flex-wrap gap-3"><Link to={inquiryUrl} className="inline-flex items-center gap-2 rounded-full bg-[#61D5E5] px-7 py-4 text-sm font-bold text-[#082f3f] shadow-lg transition hover:-translate-y-0.5">Nezávazný návrh + cena <ArrowRight size={16}/></Link><a href="tel:+420774700390" className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur">Konzultace +420 774 700 390</a></div>
          <div className="mt-9 grid gap-2 sm:grid-cols-2">{cfg.points.map(p => <div key={p} className="flex items-center gap-2 text-sm text-white/75"><CheckCircle2 size={15} className="shrink-0 text-[#61D5E5]"/>{p}</div>)}</div>
        </div>
      </div>
    </section>

    <section className="border-b border-slate-200 bg-slate-50 py-16 lg:py-20"><div className="mx-auto max-w-7xl px-6 lg:px-10"><p className="font-mono text-[11px] uppercase tracking-[.18em] text-teal-700">Vhodné použití</p><div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">{cfg.useCases.map(item => <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-800 shadow-sm">{item}</div>)}</div></div></section>

    <section className="py-20 lg:py-28"><div className="mx-auto max-w-7xl px-6 lg:px-10"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><div><p className="font-mono text-[11px] uppercase tracking-[.18em] text-teal-700">Smart Cooling</p><h2 className="mt-4 font-heading text-4xl tracking-[-.03em] lg:text-5xl">Ochlazování, které se řídí samo.</h2><p className="mt-5 text-lg leading-relaxed text-slate-600">Od jednoduchého časovače až po vícezónový systém s teplotním řízením. Provozní logika se nastaví podle způsobu používání místa.</p><Link to="/smart-ovladani" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-teal-800">Detail Smart řízení <ArrowRight size={15}/></Link></div><div className="grid gap-4 sm:grid-cols-2">{BENEFITS.map(({icon:BIcon,title,text}) => <article key={title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><BIcon size={22} className="text-teal-700"/><h3 className="mt-5 font-heading text-xl">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p></article>)}</div></div></div></section>

    <section className="bg-[#082f3f] py-20 text-white"><div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1fr_auto] lg:items-end lg:px-10"><div><p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#61D5E5]">Další krok</p><h2 className="mt-4 max-w-3xl font-heading text-4xl tracking-[-.03em] lg:text-5xl">Pošlete místo. Připravíme vhodný směr řešení.</h2><p className="mt-5 max-w-2xl text-white/65">Stačí fotografie, rozměr nebo krátký popis. Doporučíme typ prvku, rozsah, smart řízení a další technické kroky.</p></div><Link to={inquiryUrl} className="inline-flex h-fit items-center gap-2 rounded-full bg-[#61D5E5] px-7 py-4 text-sm font-bold text-[#082f3f]">Poptat projekt <ArrowRight size={16}/></Link></div></section>
  </main>;
}
