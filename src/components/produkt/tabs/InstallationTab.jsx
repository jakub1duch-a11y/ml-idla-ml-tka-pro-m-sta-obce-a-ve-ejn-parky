import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Construction, Droplets, PlugZap, ShieldCheck, Snowflake, TimerReset, Wrench } from 'lucide-react';
import AnchoringGallery from '@/components/produkt/AnchoringGallery';

const OPTIONS = [
  {
    value: 'full_excavation',
    code: 'A',
    icon: Construction,
    label: 'Na klíč',
    title: 'Kompletní instalace včetně výkopu',
    description: 'HolmTec zajistí přípravu trasy, výkop, podklad, kotvení, přívod vody, montáž, zkoušku i obnovu povrchu.',
    bullets: ['Nejmenší nárok na koordinaci klienta', 'Cena podle délky trasy a skladby povrchu', 'Vyžaduje fotografie, zaměření a informace o sítích'],
    questions: ['Povrch a jeho skladba', 'Délka a hloubka trasy', 'Přístup mechanizace', 'Obnova dlažby, asfaltu nebo zeleně']
  },
  {
    value: 'prepared_water',
    code: 'B',
    icon: PlugZap,
    label: 'Doporučené',
    title: 'Bez výkopu · připravený přívod vody',
    description: 'Klient připraví vodu přímo k místu instalace. HolmTec provede kotvení, montáž, napojení, nastavení a zprovoznění.',
    bullets: ['Nejpřesnější a obvykle nejnižší instalační cena', 'Minimum stavebních zásahů na místě', 'Ideální pro nový projekt nebo připravené náměstí'],
    questions: ['Poloha a dimenze přívodu', 'Uzávěr a filtrace', 'Typ nosného podkladu', 'Připravené napájení pro smart řízení']
  },
  {
    value: 'temporary_manhole',
    code: 'C',
    icon: TimerReset,
    label: 'Sezónní',
    title: 'Dočasně u víka kanalizace',
    description: 'Pro pilotní, eventovou nebo sezónní instalaci lze využít bezpečně dostupný přívod vody v kanále bez trvalého výkopu.',
    bullets: ['Rychlé uvedení do provozu', 'Minimální zásah do povrchu', 'Vhodné pro ověření lokality před trvalou instalací'],
    questions: ['Typ a rozměr víka', 'Bezpečný průchod hadice', 'Ochrana proti zakopnutí a manipulaci', 'Povolení správce kanalizace nebo prostoru']
  }
];

export default function InstallationTab({ product }) {
  const [active, setActive] = useState('prepared_water');
  const selected = OPTIONS.find((option) => option.value === active) || OPTIONS[1];

  const continueToQuote = (value) => {
    setActive(value);
    window.dispatchEvent(new CustomEvent('mlzidla:installation-select', { detail: { value } }));
    window.setTimeout(() => document.getElementById('produkt-poptavka')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 max-w-3xl">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-slate-400">Kotvení · přívod vody · rozsah prací</p>
          <h2 className="font-heading text-4xl font-light tracking-tight text-slate-900 lg:text-5xl">Tři cesty k instalaci.<br /><span className="text-slate-400">Vyberte podle připravenosti místa.</span></h2>
          <p className="mt-5 text-base font-light leading-relaxed text-slate-500">Cena produktu zůstává stejná. Instalační část počítáme samostatně podle povrchu, přívodu vody, kotvení a požadovaného rozsahu prací.</p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {OPTIONS.map((option) => {
            const Icon = option.icon;
            const isActive = active === option.value;
            return (
              <motion.button key={option.value} type="button" onClick={() => setActive(option.value)} whileHover={{ y: -3 }} className={'relative overflow-hidden rounded-[26px] border-2 p-6 text-left transition-all ' + (isActive ? 'border-[#0b4860] bg-[#eef8fb] shadow-[0_18px_45px_rgba(11,72,96,.12)]' : 'border-slate-200 bg-white hover:border-slate-300')}>
                <div className="flex items-start justify-between gap-4">
                  <span className={'flex h-11 w-11 items-center justify-center rounded-2xl ' + (isActive ? 'bg-[#0b4860] text-white' : 'bg-slate-100 text-slate-600')}><Icon size={20} /></span>
                  <span className={'rounded-full px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[.16em] ' + (option.label === 'Doporučené' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500')}>{option.label}</span>
                </div>
                <p className="mt-6 font-mono text-[10px] font-bold uppercase tracking-[.2em] text-cyan-700">Varianta {option.code}</p>
                <h3 className="mt-2 text-xl font-semibold leading-tight text-slate-950">{option.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{option.description}</p>
                <div className="mt-5 space-y-2">
                  {option.bullets.map((bullet) => <span key={bullet} className="flex items-start gap-2 text-xs leading-relaxed text-slate-600"><Check size={14} className="mt-0.5 shrink-0 text-cyan-700" />{bullet}</span>)}
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.div key={selected.value} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="my-10 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 text-white">
          <div className="grid lg:grid-cols-[.85fr_1.15fr]">
            <div className="border-b border-white/10 p-7 sm:p-9 lg:border-b-0 lg:border-r">
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-cyan-300">Co potřebujeme pro přesnou cenu</p>
              <h3 className="mt-3 font-heading text-2xl">{selected.title}</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {selected.questions.map((question, index) => <div key={question} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.05] px-4 py-3"><span className="font-mono text-[10px] text-cyan-300">0{index + 1}</span><span className="text-sm text-white/75">{question}</span></div>)}
              </div>
              <button type="button" onClick={() => continueToQuote(selected.value)} className="mt-7 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-[#0b4860] transition-transform hover:scale-[1.02]">
                Vybrat variantu a doplnit podklady <ArrowRight size={16} />
              </button>
            </div>

            <div className="relative min-h-[360px] overflow-hidden bg-[radial-gradient(circle_at_70%_25%,rgba(65,194,215,.22),transparent_30%),linear-gradient(145deg,#082d3b,#03181f)] p-7 sm:p-9">
              <div className="absolute inset-x-10 bottom-14 h-px bg-white/20" />
              <div className="absolute bottom-14 left-[18%] h-44 w-5 rounded-t-full bg-gradient-to-r from-slate-500 via-white to-slate-600 shadow-[0_0_28px_rgba(255,255,255,.12)]" />
              <div className="absolute bottom-[54px] left-[calc(18%_-_18px)] h-3 w-14 rounded bg-slate-400/70" />
              <div className={'absolute bottom-10 left-[20%] h-2 rounded-full bg-cyan-300/80 shadow-[0_0_18px_rgba(103,232,249,.7)] ' + (selected.value === 'full_excavation' ? 'w-[62%]' : selected.value === 'prepared_water' ? 'w-20' : 'w-[48%] border border-dashed border-cyan-100')} />
              {selected.value === 'temporary_manhole' && <div className="absolute bottom-[26px] right-[16%] h-12 w-24 rounded-[50%] border-4 border-slate-500 bg-slate-800 shadow-xl" />}
              <div className="relative ml-auto max-w-xs rounded-2xl border border-white/10 bg-black/20 p-5 backdrop-blur">
                <p className="font-mono text-[9px] uppercase tracking-[.18em] text-white/45">Schematický princip</p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{selected.value === 'full_excavation' ? 'Nová podzemní trasa vody a finální obnova povrchu.' : selected.value === 'prepared_water' ? 'Přívod vyústí přímo u skryté kotvící patky.' : 'Dočasná chráněná trasa od dostupného kanálu k mlžítku.'}</p>
                <p className="mt-3 text-[11px] leading-relaxed text-white/40">Finální rozměry základu, kotev a trasy určí technik podle produktu a lokality.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <AnchoringGallery />

        <div className="mb-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, title: 'Bezpečný projekt', desc: 'Kotvení a trasa vody respektují provoz místa, podloží a statický návrh.' },
            { icon: Droplets, title: 'Filtrace vody', desc: 'Filtrace a uzávěr chrání trysky a usnadňují dlouhodobý provoz.' },
            { icon: Wrench, title: 'Bez vysokého tlaku', desc: 'Systém se připojuje na běžný vodovod podle parametrů konkrétního produktu.' },
            { icon: Snowflake, title: 'Servis a zima', desc: 'Řešení počítá s vypuštěním, kontrolou a bezpečnou sezónní odstávkou.' }
          ].map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <feature.icon size={20} className="mb-3 text-slate-500" />
              <h3 className="mb-1.5 text-sm font-medium text-slate-900">{feature.title}</h3>
              <p className="text-xs font-light leading-relaxed text-slate-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
