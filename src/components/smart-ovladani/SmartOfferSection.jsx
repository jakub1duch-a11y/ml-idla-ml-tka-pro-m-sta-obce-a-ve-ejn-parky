import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Clock3, Thermometer, Smartphone, Network, ShieldCheck, Wrench, CloudSun, MapPin, Radio, Droplets } from 'lucide-react';

const PACKAGES = [
  {
    name: 'START',
    label: 'Základní automatizace',
    description: 'Pro menší instalace, kde je prioritou spolehlivý časový provoz bez každodenní obsluhy.',
    icon: Clock3,
    features: ['Automatické zapnutí a vypnutí', 'Časový program a provozní intervaly', 'Manuální spuštění systému', 'Sezónní nastavení', 'Cyklický režim mlžení'],
    use: 'Menší instalace, terasy, zahrady a jednoduchá veřejná mlžítka.'
  },
  {
    name: 'SMART',
    label: 'Doporučujeme pro města',
    description: 'Řízení podle teploty, času a skutečných provozních podmínek v místě instalace.',
    icon: Thermometer,
    featured: true,
    features: ['Vše z varianty START', 'Teplotní čidlo', 'Nastavitelné teplotní limity', 'Časová okna provozu', 'Automatický / manuální režim', 'Možnost více samostatných zón'],
    use: 'Náměstí, parky, školy, školky, hřiště, sportoviště a koupaliště.'
  },
  {
    name: 'SMART PRO',
    label: 'Vzdálená správa',
    description: 'Pro rozsáhlejší instalace a provozovatele, kteří potřebují centrálně řídit více zařízení nebo lokalit.',
    icon: Smartphone,
    features: ['Vše z varianty SMART', 'Vzdálené ovládání', 'Správa více zón a lokalit', 'Monitoring provozního stavu', 'Pokročilé automatizační scénáře', 'Možnost rozšíření o další senzory'],
    use: 'Města, technické služby, velké areály a vícezónové instalace.'
  }
];

const EXTENSIONS = [
  { icon: CloudSun, title: 'Počasí', text: 'Provozní logiku lze podle projektu doplnit o reakci na déšť, vítr nebo další podmínky.' },
  { icon: Network, title: 'Více zón', text: 'Náměstí, park i sportoviště mohou mít vlastní režim a přitom být součástí jednoho systému.' },
  { icon: Radio, title: 'SUPLA', text: 'U vhodné konfigurace lze využít platformu SUPLA pro vzdálené ovládání, automatizaci a přehled o stavu systému.' },
  { icon: Droplets, title: 'PEVEKO', text: 'Řešení lze podle projektu kombinovat s vhodným ventilem PEVEKO jako součástí řízené vodní větve.' }
];

const STEPS = [
  ['01', 'Konzultace', 'Zjistíme typ mlžítek, počet zařízení, místo instalace a požadovaný způsob provozu.'],
  ['02', 'Návrh řízení', 'Navrhneme vhodnou úroveň automatizace, senzory, zóny a provozní logiku.'],
  ['03', 'Konfigurace a instalace', 'Připravíme řídicí prvky, nastavíme provozní scénáře a koordinujeme zapojení podle rozsahu projektu.'],
  ['04', 'Předání', 'Otestujeme funkce, nastavíme finální parametry a předáme informace obsluze.']
];

const FAQ = [
  ['Musí obsluha systém každý den zapínat?', 'Ne. U automatických variant lze nastavit provozní harmonogram a podmínky spuštění.'],
  ['Co se stane, když se ochladí?', 'U varianty s teplotním řízením může systém zůstat vypnutý pod nastavenou aktivační teplotou.'],
  ['Lze řídit několik mlžítek samostatně?', 'Ano. Pokud je projekt navržen jako vícezónový, mohou mít jednotlivé větve vlastní provozní režim.'],
  ['Je možné systém ovládat ručně?', 'Ano. Podle konfigurace lze zachovat manuální ovládání vedle automatického režimu.'],
  ['Lze chytré řízení doplnit ke stávajícímu systému?', 'Často ano. Nejdříve je ale potřeba posoudit stávající hydraulické a elektrické řešení a způsob ovládání ventilů.'],
  ['Je možné ovládání na dálku?', 'Ano, u konfigurace určené pro vzdálenou správu a při dostupném datovém připojení.']
];

export default function SmartOfferSection() {
  return <>
    <section id="varianty" className="scroll-mt-24 bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">Varianty řešení</p>
          <h2 className="mt-4 font-heading text-3xl leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">Od jednoduchého časovače po správu několika lokalit.</h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">Neplatíte za funkce, které nepotřebujete. Úroveň řízení navrhneme podle velikosti instalace, způsobu využití a požadavků správce.</p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {PACKAGES.map((p, i) => <motion.article key={p.name} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .07 }} className={`relative rounded-3xl border p-7 sm:p-8 ${p.featured ? 'border-secondary bg-slate-950 text-white shadow-xl' : 'border-slate-200 bg-white text-slate-900'}`}>
            {p.featured && <span className="absolute right-5 top-5 rounded-full bg-accent px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">Doporučeno</span>}
            <p.icon size={32} strokeWidth={1.5} className={p.featured ? 'text-accent' : 'text-secondary'} />
            <p className={`mt-7 font-mono text-[11px] uppercase tracking-[.18em] ${p.featured ? 'text-white/50' : 'text-slate-400'}`}>{p.label}</p>
            <h3 className="mt-2 font-heading text-3xl">{p.name}</h3>
            <p className={`mt-4 min-h-[72px] text-sm leading-relaxed ${p.featured ? 'text-white/65' : 'text-slate-600'}`}>{p.description}</p>
            <div className={`my-6 h-px ${p.featured ? 'bg-white/10' : 'bg-slate-200'}`} />
            <ul className="space-y-3">{p.features.map(f => <li key={f} className={`flex items-start gap-3 text-sm ${p.featured ? 'text-white/80' : 'text-slate-700'}`}><Check size={16} className={`mt-0.5 shrink-0 ${p.featured ? 'text-accent' : 'text-secondary'}`} />{f}</li>)}</ul>
            <p className={`mt-7 text-xs leading-relaxed ${p.featured ? 'text-white/45' : 'text-slate-500'}`}><strong className={p.featured ? 'text-white/70' : 'text-slate-700'}>Vhodné pro:</strong> {p.use}</p>
            <Link to={`/kontakt?produkt=${encodeURIComponent(`Smart ovládání ${p.name}`)}`} className={`mt-7 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all ${p.featured ? 'bg-white text-slate-950 hover:bg-white/90' : 'border border-slate-300 text-slate-900 hover:border-slate-500'}`}>Poptat {p.name} <ArrowRight size={15} /></Link>
          </motion.article>)}
        </div>
        <p className="mt-6 text-center text-xs text-slate-400">Cena a přesný rozsah se stanovují podle počtu zón, senzorů, způsobu připojení a požadované automatizace.</p>
      </div>
    </section>

    <section className="border-y border-slate-200 bg-slate-50 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.18em] text-slate-400">Integrace a rozšíření</p>
            <h2 className="mt-4 font-heading text-3xl tracking-tight text-slate-900 lg:text-4xl">Řízení, které může růst s projektem.</h2>
            <p className="mt-5 leading-relaxed text-slate-600">Základ může tvořit jedno mlžítko. Stejnou architekturu lze podle projektu rozšířit o další zóny, senzory a vzdálenou správu. Konkrétní komponenty vždy volíme podle technických podmínek instalace.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">{EXTENSIONS.map(({icon: Icon, title, text}) => <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6"><Icon size={28} strokeWidth={1.5} className="text-secondary" /><h3 className="mt-5 font-heading text-xl text-slate-900">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p></div>)}</div>
        </div>
      </div>
    </section>

    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">Veřejný prostor</p>
            <h2 className="mt-4 font-heading text-3xl tracking-tight text-slate-900 lg:text-4xl">Jedna správa. Více zařízení.</h2>
            <p className="mt-5 text-slate-600 leading-relaxed">Náměstí, park, dětské hřiště i sportoviště mohou fungovat jako samostatné zóny. Každá může mít vlastní časový režim a podmínky spuštění.</p>
            <div className="mt-8 space-y-3">{[['Náměstí','Mlžná brána · Zóna 01'],['Park','Bendy mlžiště · Zóna 02'],['Dětské hřiště','Mlžné body · Zóna 03'],['Sportoviště','Ochladicí zóna · Zóna 04']].map(([place, desc]) => <div key={place} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 px-5 py-4"><span className="flex items-center gap-3 font-semibold text-slate-900"><MapPin size={16} className="text-secondary" />{place}</span><span className="text-right text-xs text-slate-500">{desc}</span></div>)}</div>
          </div>
          <div className="rounded-3xl bg-slate-950 p-7 text-white sm:p-9">
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-accent">Příklad letního dne</p>
            <div className="mt-7 space-y-0">{[['07:00','19 °C','Mimo provoz'],['10:00','25 °C','Čeká na teplotu'],['12:18','27,5 °C','Mlžení aktivní'],['15:40','31 °C','Automatický režim'],['19:00','—','Automaticky vypnuto']].map(([time,temp,status], i) => <div key={time} className="grid grid-cols-[64px_70px_1fr] items-center gap-3 border-b border-white/10 py-4 last:border-0"><span className="font-mono text-xs text-white/45">{time}</span><span className="font-semibold">{temp}</span><span className={`text-right text-xs ${i === 2 || i === 3 ? 'text-accent' : 'text-white/55'}`}>{status}</span></div>)}</div>
          </div>
        </div>
      </div>
    </section>

    <section className="border-y border-slate-200 bg-slate-50 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl"><p className="font-mono text-[11px] uppercase tracking-[.18em] text-slate-400">Od návrhu po předání</p><h2 className="mt-4 font-heading text-3xl tracking-tight text-slate-900 lg:text-4xl">Jak probíhá realizace smart řízení.</h2></div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{STEPS.map(([num,title,text]) => <div key={num} className="rounded-2xl border border-slate-200 bg-white p-6"><span className="font-mono text-xs text-secondary">{num}</span><h3 className="mt-5 font-heading text-xl text-slate-900">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-500">{text}</p></div>)}</div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6"><ShieldCheck className="shrink-0 text-secondary" size={28}/><div><h3 className="font-heading text-xl text-slate-900">Pro veřejný provoz</h3><p className="mt-2 text-sm leading-relaxed text-slate-500">Při návrhu řešíme umístění technologie, provozní harmonogram, servisní přístup, sezónní odstavení a návaznost na vodní a elektrickou část instalace.</p></div></div>
          <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6"><Wrench className="shrink-0 text-secondary" size={28}/><div><h3 className="font-heading text-xl text-slate-900">Připraveno na servis</h3><p className="mt-2 text-sm leading-relaxed text-slate-500">Rozsah dodávky může zahrnovat řídicí jednotku, senzory, ventily, konfiguraci, uvedení do provozu, zaškolení a dokumentaci konkrétního projektu.</p></div></div>
        </div>
      </div>
    </section>

    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <div className="text-center"><p className="font-mono text-[11px] uppercase tracking-[.18em] text-slate-400">FAQ</p><h2 className="mt-4 font-heading text-3xl tracking-tight text-slate-900 lg:text-4xl">Nejčastější otázky.</h2></div>
        <div className="mt-10 divide-y divide-slate-200 border-y border-slate-200">{FAQ.map(([q,a]) => <details key={q} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-semibold text-slate-900"><span>{q}</span><span className="text-xl font-light text-slate-400 transition-transform group-open:rotate-45">+</span></summary><p className="max-w-3xl pt-3 text-sm leading-relaxed text-slate-500">{a}</p></details>)}</div>
      </div>
    </section>
  </>;
}
