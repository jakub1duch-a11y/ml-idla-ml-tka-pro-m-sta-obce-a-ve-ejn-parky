import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Clock3, Droplets, MapPin, ShieldCheck, SlidersHorizontal, Smartphone, ThermometerSun, Wifi } from 'lucide-react';
import HeroAtmosphere from '@/components/ui/HeroAtmosphere';

const PRESETS = [
  { id: 'short', name: 'Krátké pulzy', on: 2, off: 8 },
  { id: 'balanced', name: 'Vyvážený režim', on: 5, off: 15 },
  { id: 'frequent', name: 'Častější mlžení', on: 5, off: 5 },
];

const FEATURES = [
  { icon: Clock3, title: 'Intervalové řízení', text: 'Střídání mlžení a pauz v nastaveném provozním okně.' },
  { icon: ThermometerSun, title: 'Teplotní podmínky', text: 'Automatické spuštění po doplnění vhodného čidla.' },
  { icon: Smartphone, title: 'Ovládání SUPLA', text: 'Dálková správa u kompatibilní řídicí sestavy.' },
];

function IntervalDemo() {
  const [presetId, setPresetId] = useState('balanced');
  const preset = PRESETS.find((item) => item.id === presetId) || PRESETS[1];

  return (
    <div className="relative z-10 mt-auto overflow-hidden rounded-[1.65rem] border border-cyan-100/25 bg-[#071e30]/95 p-4 shadow-[0_25px_70px_rgba(0,0,0,.3)] backdrop-blur-xl sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.15em] text-[#A2EFF6]">
            <SlidersHorizontal size={15} aria-hidden="true" /> Interaktivní ukázka
          </p>
          <h2 className="mt-2 font-heading text-lg font-bold text-white sm:text-xl">Mlžení. Pauza. Opakovat.</h2>
        </div>
        <span className="rounded-full border border-cyan-200/30 bg-cyan-200/10 px-3 py-1.5 text-[10px] font-bold text-cyan-100">DEMO</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Výběr ukázkového intervalového režimu">
        {PRESETS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={presetId === item.id}
            onClick={() => setPresetId(item.id)}
            className={
              'min-h-11 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#99EAF5] ' +
              (presetId === item.id
                ? 'border-[#A8EEF6] bg-[#A8EEF6] text-[#072235]'
                : 'border-white/25 bg-white/10 text-white hover:bg-white/20')
            }
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="mt-5 flex justify-between gap-3 text-xs font-semibold text-white/85">
        <span>Ukázka dvou cyklů</span>
        <span className="tabular-nums">{preset.on + preset.off} min / cyklus</span>
      </div>
      <div
        className="mt-2 flex gap-1.5"
        role="img"
        aria-label={'Dva cykly, každý ' + preset.on + ' minut mlžení a ' + preset.off + ' minut pauzy.'}
      >
        {[1, 2].map((cycle) => (
          <div className="flex h-9 min-w-0 flex-1 gap-[3px] overflow-hidden rounded-lg" key={cycle} aria-hidden="true">
            <span style={{ flex: preset.on }} className="min-w-0 rounded-md bg-gradient-to-r from-cyan-400 to-[#A2EDF6] transition-[flex] duration-300 motion-reduce:transition-none" />
            <span style={{ flex: preset.off }} className="min-w-0 rounded-md border border-white/10 bg-white/20 transition-[flex] duration-300 motion-reduce:transition-none" />
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-cyan-200/20 bg-cyan-200/10 p-3 sm:p-4">
          <p className="flex items-center gap-2 text-xs font-medium text-cyan-100"><Droplets size={16} aria-hidden="true" /> Mlžení</p>
          <p className="mt-1 font-heading text-2xl font-bold tabular-nums text-white">{preset.on} <span className="text-sm font-normal">min</span></p>
        </div>
        <div className="rounded-xl border border-white/15 bg-white/[.07] p-3 sm:p-4">
          <p className="flex items-center gap-2 text-xs font-medium text-white/85"><Clock3 size={16} aria-hidden="true" /> Pauza</p>
          <p className="mt-1 font-heading text-2xl font-bold tabular-nums text-white">{preset.off} <span className="text-sm font-normal">min</span></p>
        </div>
      </div>

      <p className="mt-4 flex items-start gap-2 text-[11px] leading-5 text-white/80">
        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-cyan-200" aria-hidden="true" />
        Jen ilustrační nastavení. Skutečné intervaly a režim hygienického provozu závisí na konkrétním projektu.
      </p>
    </div>
  );
}

export default function SmartHero() {
  const reduced = useReducedMotion();

  return (
    <section aria-labelledby="smart-interval-hero-title" className="hero-motion-surface relative isolate overflow-hidden bg-[#071824] pt-[68px] text-white">
      <HeroAtmosphere />
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -left-32 top-24 h-[30rem] w-[30rem] rounded-full bg-cyan-400/10 blur-[100px]" />
        <div className="absolute right-0 top-0 h-[36rem] w-[36rem] rounded-full bg-sky-400/[.08] blur-[110px]" />
        <div className="absolute inset-0 opacity-[.09] [background-image:linear-gradient(rgba(207,245,251,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(207,245,251,.18)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>
      <div className="relative mx-auto max-w-[1500px] px-5 pb-14 pt-14 sm:px-8 sm:pt-20 lg:px-12 lg:pb-20 xl:px-20">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,.92fr)_minmax(0,1.08fr)] xl:gap-16">
          <motion.div
            className="relative z-10 min-w-0"
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .65, ease: 'easeOut' }}
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-cyan-200/25 bg-cyan-100/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[.13em] text-cyan-100">
              <Wifi size={15} aria-hidden="true" /> Automatizace · intervalové mlžení
            </p>
            <h1 id="smart-interval-hero-title" className="mt-7 max-w-[14ch] font-heading text-[clamp(2.85rem,5.1vw,5.4rem)] font-bold leading-[1.03] tracking-[-.055em] text-white">
              Mlžení ve správný čas.
              <span className="mt-2 block text-[#9AEAF3]">Pauza přesně podle plánu.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
              Nastavte střídání mlžení a pauz podle potřeb prostoru. Podle technického řešení lze přidat časové plány, teplotní podmínky a ovládání SUPLA.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/poptavka?produkt=Automatizace%20SUPLA%20ml%C5%BE%C3%ADtek"
                className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-xl bg-[#98E6F0] px-6 py-3.5 text-sm font-bold text-[#062238] shadow-[0_20px_50px_rgba(100,226,240,.18)] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Navrhnout intervalové řízení <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a
                href="#smart-automatizace"
                className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-xl border border-white/30 bg-white/[.07] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-cyan-200/70 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
              >
                Jak intervaly fungují <ArrowRight size={17} aria-hidden="true" />
              </a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-6 text-xs font-medium text-white/85">
              {['Nastavitelný cyklus', 'Volitelná čidla', 'Řízení podle sestavy'].map((label) => (
                <span key={label} className="inline-flex items-center gap-2">
                  <CheckCircle2 size={15} className="shrink-0 text-[#9AEAF3]" aria-hidden="true" />
                  {label}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative min-w-0"
            initial={reduced ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .75, delay: .1, ease: 'easeOut' }}
          >
            <div className="pointer-events-none absolute -inset-5 -z-10 rounded-[3rem] bg-[radial-gradient(circle,rgba(80,220,240,.19),transparent_69%)] blur-2xl" />
            <div className="group relative flex min-h-[635px] flex-col overflow-hidden rounded-[2rem] border border-cyan-100/25 bg-[#092131] p-4 shadow-[0_35px_100px_rgba(0,0,0,.35)] sm:min-h-[675px] sm:p-6">
              <img
                src="/media/optimized/6a220ebf9_Reference-mstoPolna03.webp"
                alt="Fotografie skutečné realizace mlžítka v Polné"
                width="1024"
                height="572"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="absolute inset-0 h-full w-full object-cover object-center opacity-80 transition-transform duration-700 motion-safe:group-hover:scale-[1.035] motion-reduce:transition-none"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,24,36,.12)_0%,rgba(7,24,36,.40)_28%,rgba(7,24,36,.91)_63%,rgba(7,24,36,.97)_100%)]" aria-hidden="true" />
              <div className="relative z-10 mb-8 flex flex-wrap justify-between gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-[#071824]/80 px-3 py-2 text-[10px] font-bold uppercase text-white backdrop-blur-md"><Droplets size={14} className="text-cyan-200" aria-hidden="true" /> Mlžítka v prostoru</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-[#071824]/80 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md"><MapPin size={14} className="text-cyan-200" aria-hidden="true" /> Polná · realizace</span>
              </div>
              <IntervalDemo />
            </div>
            <p className="mt-3 px-1 text-xs leading-5 text-white/75">
              Fotografie realizace v Polné. Ovládací panel je ilustrační ukázka, nikoli data ani potvrzení použitého řízení na této realizaci.
            </p>
          </motion.div>
        </div>

        <div className="mt-12 grid gap-3 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-4 rounded-2xl border border-white/15 bg-white/[.05] p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-200/10 text-cyan-200"><Icon size={21} aria-hidden="true" /></span>
              <div>
                <h2 className="font-heading text-base font-semibold text-white">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-white/75">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
