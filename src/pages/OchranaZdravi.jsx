import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Droplets, FileCheck2, HeartPulse, ShieldCheck, Sparkles, ThermometerSun, Wrench, Wind } from 'lucide-react';
import { setSEO } from '@/lib/seo';

const HEALTH_POINTS = [
  { icon: ThermometerSun, title: 'Tepelný komfort', text: 'Jemná vodní mlha podporuje ochlazování bez nutnosti klimatizovat otevřený veřejný prostor. Výsledný efekt závisí na teplotě, vlhkosti, proudění vzduchu a návrhu konkrétní instalace.' },
  { icon: Wind, title: 'Prašnost v místě instalace', text: 'Vodní aerosol může lokálně pomáhat zachytávat část prachových částic. Mlžítko ale nenahrazuje opatření pro kvalitu ovzduší ani monitoring znečištění.' },
  { icon: HeartPulse, title: 'Komfort návštěvníků', text: 'Dobře navržené mlžení vytváří příjemnější pobytové podmínky na náměstích, v parcích, školních zahradách, u sportovišť a dalších exponovaných místech.' },
];

const HYGIENE = [
  { icon: Droplets, title: 'Zdroj vody', text: 'Pro veřejné instalace doporučujeme napojení na vodu odpovídající požadavkům pro dané použití. U městských projektů je vhodné už v návrhu potvrdit zdroj, tlak, přípojku a odpovědnost za provoz.' },
  { icon: ShieldCheck, title: 'Minimalizace stagnace', text: 'Rozvody navrhujeme s důrazem na pravidelný průtok a možnost proplachu. Dlouhodobě stojatá voda je provozní riziko, které je vhodné řešit už v projektové dokumentaci.' },
  { icon: Wrench, title: 'Servis a čištění', text: 'Provozní plán má obsahovat kontrolu filtrů, trysek, těsnosti, proplach po odstávce, sezónní spuštění a zazimování. Intervaly se stanovují podle konkrétní instalace a kvality vstupní vody.' },
  { icon: FileCheck2, title: 'Hygienický režim', text: 'U veřejných instalací doporučujeme jednoduchý provozní a servisní záznam: datum kontroly, provedený proplach, výměna filtru, servisní zásah a případné odstávky.' },
];

const MAYOR = [
  ['Co je potřeba před realizací?', 'Místo instalace, dostupná přípojka vody, tlak a průtok, způsob kotvení, odvodnění okolní plochy, očekávaná návštěvnost a režim provozu.'],
  ['Kdo bude zařízení provozovat?', 'Doporučujeme určit konkrétního správce — technické služby, správu majetku nebo jinou odpovědnou osobu. Součástí předání má být návod, servisní režim a kontaktní místo pro podporu.'],
  ['Co hygiena a kvalita vody?', 'Požadavky se posuzují podle zdroje vody, způsobu použití a konkrétní instalace. Pro veřejný projekt je vhodné hygienický režim řešit už v projektové fázi a v případě potřeby jej konzultovat s místně příslušným orgánem ochrany veřejného zdraví.'],
  ['Jak omezit zbytečnou spotřebu?', 'Pomocí časových programů, teplotních podmínek, intervalového provozu a chytrého řízení. Systém nemusí mlžit nepřetržitě po celou otevírací dobu prostoru.'],
  ['Co se děje po sezóně?', 'Systém se odstaví podle servisního postupu, propláchne, zkontroluje a podle místních podmínek zazimuje. Na jaře se před spuštěním provede kontrola rozvodů, filtrů a trysek.'],
  ['Jaké podklady může město chtít?', 'Technický list produktu, schéma napojení, informace k údržbě, servisní plán, materiálové specifikace, podklady pro projektanta a dokumentaci skutečného provedení dle rozsahu zakázky.'],
];

const PROCESS = [
  'Posouzení místa a zdroje vody',
  'Návrh rozmístění a provozního režimu',
  'Technické řešení přípojky, filtrace a kotvení',
  'Montáž, proplach a funkční zkouška',
  'Předání návodu a servisního režimu správci',
];

export default function OchranaZdravi() {
  useEffect(() => {
    setSEO({
      title: 'Hygiena, ochrana zdraví a provoz městských mlžítek',
      description: 'Praktické informace pro města a správce veřejného prostoru: hygiena vody, provozní režim, servis, proplach, údržba a podklady k instalaci mlžítek.',
      keywords: 'hygiena mlžítek, městská mlžítka hygiena, provoz mlžítek, servis mlžítek, kvalita vody mlžení, veřejný prostor',
      canonicalPath: '/ochrana-zdravi',
    });
  }, []);

  return <div className="min-h-screen bg-background">
    <section className="relative overflow-hidden bg-primary pt-28 pb-20 text-white lg:pt-36 lg:pb-28">
      <div className="absolute inset-0 bg-gradient-to-r from-[#041c28]/95 via-[#082f3f]/78 to-[#041c28]/10" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[.2em] text-cyan-300">Hygiena · zdraví · veřejný provoz</p>
        <h1 className="mt-4 max-w-5xl font-heading text-4xl leading-[1.03] tracking-[-.03em] text-white sm:text-5xl lg:text-7xl">Bezpečný provoz mlžítek začíná správným návrhem.</h1>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/75 sm:text-lg">Pro města nestačí jen pěkný produkt. Důležitý je zdroj vody, způsob napojení, omezení stagnace, servisní režim, odpovědnost správce i jednoduchá dokumentace provozu. Níže jsou informace, které je vhodné řešit už před objednávkou.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link to="/poptavka" className="btn-metallic-mist inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold">Probrat městský projekt <ArrowRight size={16}/></Link><Link to="/mestske-mlzitka" className="btn-secondary-outline inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white">Městská mlžítka</Link></div>
      </div>
    </section>

    <section className="border-b border-border bg-slate-50 py-10">
      <div className="mx-auto grid max-w-7xl gap-4 px-6 sm:grid-cols-3 lg:px-10">{[['47+','instalací ve veřejném prostoru'],['17+','měst a obcí'],['ČR + SR','servisní podpora']].map(([v,l])=><div key={l} className="rounded-2xl border border-border bg-white p-5"><strong className="font-heading text-3xl text-foreground">{v}</strong><p className="mt-1 text-sm text-muted-foreground">{l}</p></div>)}</div>
    </section>

    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
      <div className="max-w-3xl"><p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">Ochrana zdraví</p><h2 className="mt-3 font-heading text-3xl tracking-[-.02em] text-foreground sm:text-4xl lg:text-5xl">Co mlžení ve veřejném prostoru reálně řeší.</h2><p className="mt-4 text-base leading-relaxed text-muted-foreground">Primárním účelem je tepelný komfort. Další efekty, například lokální omezení prašnosti, závisí na prostředí a nelze je prezentovat jako náhradu opatření pro kvalitu ovzduší.</p></div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">{HEALTH_POINTS.map(({icon:Icon,title,text})=><article key={title} className="rounded-2xl border border-border bg-card p-6"><div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-secondary"><Icon size={19}/></div><h3 className="mt-5 font-heading text-2xl text-foreground">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p></article>)}</div>
    </section>

    <section className="border-y border-border bg-slate-50 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10"><div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr]"><div><p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">Hygiena vody</p><h2 className="mt-3 font-heading text-3xl tracking-[-.02em] text-foreground sm:text-4xl lg:text-5xl">Čtyři body, které mají být v každém městském projektu.</h2><p className="mt-5 text-base leading-relaxed text-muted-foreground">Hygienické požadavky se vždy posuzují podle konkrétní instalace. Základ je jednoduchý: vhodný zdroj vody, omezení stagnace, kontrolovatelná údržba a jasně určený správce.</p></div><div className="grid gap-4 sm:grid-cols-2">{HYGIENE.map(({icon:Icon,title,text})=><article key={title} className="rounded-2xl border border-border bg-white p-6"><Icon size={20} className="text-secondary"/><h3 className="mt-4 font-heading text-xl text-foreground">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p></article>)}</div></div></div>
    </section>

    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr]"><div><p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">Pro starostu a správce města</p><h2 className="mt-3 font-heading text-3xl tracking-[-.02em] text-foreground sm:text-4xl lg:text-5xl">Co chcete vědět před schválením instalace.</h2><p className="mt-5 text-base leading-relaxed text-muted-foreground">Tyto body doporučujeme projít ještě před finálním umístěním a rozpočtem. Urychlí přípravu projektu a omezí dodatečné změny při montáži.</p></div><div className="divide-y divide-border rounded-2xl border border-border bg-card">{MAYOR.map(([q,a],i)=><div key={q} className="grid gap-2 p-5 sm:grid-cols-[32px_1fr] sm:p-6"><span className="font-mono text-xs text-secondary">{String(i+1).padStart(2,'0')}</span><div><h3 className="font-heading text-lg text-foreground">{q}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</p></div></div>)}</div></div>
    </section>

    <section className="bg-primary py-20 text-white lg:py-24"><div className="mx-auto max-w-7xl px-6 lg:px-10"><div className="max-w-3xl"><p className="font-mono text-[11px] uppercase tracking-[.18em] text-cyan-300">Doporučený postup</p><h2 className="mt-3 font-heading text-3xl tracking-[-.02em] text-white sm:text-4xl lg:text-5xl">Od přípojky až po předání správci.</h2></div><div className="mt-10 grid gap-3 lg:grid-cols-5">{PROCESS.map((item,i)=><div key={item} className="rounded-2xl border border-white/10 bg-white/[.04] p-5"><span className="font-mono text-xs text-cyan-300">0{i+1}</span><p className="mt-4 text-sm leading-relaxed text-white/75">{item}</p></div>)}</div></div></section>

    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-24"><div className="grid gap-8 rounded-3xl border border-border bg-slate-50 p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">Důležité</p><h2 className="mt-3 font-heading text-3xl text-foreground sm:text-4xl">Hygiena se řeší podle konkrétního projektu.</h2><p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">České předpisy stanovují hygienické požadavky na kvalitu pitné a teplé vody. U veřejného mlžného systému je proto vhodné zohlednit charakter zdroje vody, konstrukci rozvodů a provozní režim; u specifických projektů doporučujeme konzultaci s projektantem a místně příslušným orgánem ochrany veřejného zdraví. Tato stránka nenahrazuje individuální hygienické posouzení projektu.</p></div><Link to="/kontakt" className="btn-secondary-outline inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-foreground">Konzultovat projekt <ArrowRight size={15}/></Link></div></section>
  </div>;
}
