import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Droplets,
  Gauge,
  SlidersHorizontal,
  Building2,
  ShieldCheck,
  Ruler,
  ArrowRight,
} from 'lucide-react';

const BENEFITS = [
  {
    icon: Droplets,
    index: '01',
    label: 'Princip',
    title: 'Ochlazení odparem',
    text: 'Jemné kapky se v kontaktu se vzduchem částečně odpařují. Při změně vody na páru se spotřebovává teplo z okolí a lokálně se zlepšuje tepelný komfort.',
    note: 'Evaporace místo kompresorového chlazení',
  },
  {
    icon: Gauge,
    index: '02',
    label: 'Hydraulika',
    title: 'Bez vysokotlakého čerpadla',
    text: 'Nízkotlaké řady MLŽIDLA® navrhujeme pro napojení na vodovodní řád. Konkrétní tlak, průtok a tryska se volí podle modelu a podmínek projektu.',
    note: 'Jednodušší technologické zázemí',
  },
  {
    icon: SlidersHorizontal,
    index: '03',
    label: 'Řízení',
    title: 'Provoz jen tehdy, kdy dává smysl',
    text: 'Časový program, teplotní podmínka a volitelné senzory mohou omezit provoz na situace, kdy je mlžení účelné. Rozsah automatizace se volí podle projektu.',
    note: 'Manuální i smart konfigurace',
  },
  {
    icon: Building2,
    index: '04',
    label: 'Architektura',
    title: 'Technologie jako součást prostoru',
    text: 'Výška, směr mlhy, rozteč prvků a pohyb lidí se řeší společně s tvarem produktu. Mlžítko tak není dodatečný technický doplněk, ale navržený prvek místa.',
    note: 'Město · park · terasa · zahrada',
  },
  {
    icon: ShieldCheck,
    index: '05',
    label: 'Provoz',
    title: 'Hygiena a servis už v návrhu',
    text: 'Projekt počítá s kvalitou přiváděné vody, filtrací, omezením stagnace, proplachem a přístupem k servisním částem. Provozní režim se přizpůsobuje typu instalace.',
    note: 'Servisovatelný systém od začátku',
  },
  {
    icon: Ruler,
    index: '06',
    label: 'Návrh',
    title: 'Projektové dimenzování místo univerzálního čísla',
    text: 'Účinek ovlivňuje teplota, relativní vlhkost, proudění vzduchu, výška a hustota trysek i jejich konkrétní charakteristika. Proto návrh dimenzujeme pro dané místo.',
    note: 'Parametry podle prostředí a provozu',
  },
];

export default function BenefitsSlider() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const current = BENEFITS[active];
  const Icon = current.icon;

  useEffect(() => {
    if (paused || reduceMotion) return undefined;
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % BENEFITS.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [paused, reduceMotion]);

  const droplets = useMemo(() => Array.from({ length: 22 }, (_, i) => ({
    id: i,
    left: `${8 + ((i * 17) % 84)}%`,
    top: `${8 + ((i * 29) % 76)}%`,
    size: 3 + (i % 5),
    delay: (i % 7) * 0.22,
    duration: 2.6 + (i % 6) * 0.35,
  })), []);

  return (
    <section className="border-y border-border bg-primary py-20 text-white lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:gap-10">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.18em] text-accent">Přínosy systému</p>
            <h2 className="mt-4 max-w-xl font-heading text-4xl leading-[1.04] tracking-[-.03em] lg:text-5xl">
              Co dobře navržené mlžení přináší.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/65">
              Nejen mlhu. Správný návrh propojuje fyzikální princip, hydrauliku, řízení, architekturu a dlouhodobý provoz.
            </p>

            <div className="mt-8 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0" role="tablist" aria-label="Přínosy mlžicího systému">
              {BENEFITS.map((item, index) => {
                const TabIcon = item.icon;
                const selected = index === active;
                return (
                  <button
                    key={item.title}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActive(index)}
                    className={`group flex min-w-[220px] items-center gap-3 rounded-2xl border px-4 py-3 text-left transition lg:min-w-0 ${
                      selected
                        ? 'border-white/25 bg-white/12 text-white'
                        : 'border-white/10 bg-white/[.035] text-white/60 hover:border-white/20 hover:bg-white/[.07] hover:text-white'
                    }`}
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-accent/60 bg-accent/10 text-accent' : 'border-white/10 text-white/55'}`}>
                      <TabIcon size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[9px] uppercase tracking-[.14em] opacity-60">{item.index} / {item.label}</span>
                      <span className="mt-0.5 block truncate text-sm font-semibold">{item.title}</span>
                    </span>
                    <ArrowRight size={14} className={`ml-auto shrink-0 transition-transform ${selected ? 'translate-x-0 text-accent' : '-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-white/12 bg-white/[.045]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
              <div className="absolute -bottom-16 left-1/4 h-64 w-64 rounded-full bg-white/[.045] blur-3xl" />
              {droplets.map((drop) => (
                <motion.span
                  key={drop.id}
                  className="absolute rounded-full border border-white/20 bg-white/10"
                  style={{ left: drop.left, top: drop.top, width: drop.size, height: drop.size }}
                  animate={reduceMotion ? undefined : { y: [0, -16, 0], opacity: [0.16, 0.55, 0.16], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: drop.duration, repeat: Infinity, delay: drop.delay, ease: 'easeInOut' }}
                />
              ))}
              <motion.div
                className="absolute left-1/2 top-[43%] h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
                animate={reduceMotion ? undefined : { scale: [0.82, 1.05, 0.82], opacity: [0.35, 0.12, 0.35] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute left-1/2 top-[43%] h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[.07]"
                animate={reduceMotion ? undefined : { scale: [0.84, 1.08, 0.84], opacity: [0.22, 0.05, 0.22] }}
                transition={{ duration: 5.3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              />
            </div>

            <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-between p-7 sm:p-10 lg:p-12" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.42 }}
                  className="max-w-xl"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[11px] uppercase tracking-[.18em] text-white/45">{current.index} / {current.label}</span>
                    <span className="rounded-full border border-white/12 bg-black/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.14em] text-white/55">MLŽIDLA® SYSTEM</span>
                  </div>
                  <div className="mt-12 flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/35 bg-accent/10 text-accent">
                    <Icon size={28} strokeWidth={1.6} />
                  </div>
                  <h3 className="mt-7 max-w-lg font-heading text-4xl leading-[1.04] tracking-[-.03em] sm:text-5xl">{current.title}</h3>
                  <p className="mt-5 max-w-xl text-base leading-7 text-white/70 sm:text-lg">{current.text}</p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-10">
                <div className="mb-3 flex items-center justify-between gap-4 text-sm">
                  <span className="text-white/55">{current.note}</span>
                  <span className="font-mono text-[10px] tracking-[.12em] text-white/35">{active + 1} / {BENEFITS.length}</span>
                </div>
                <div className="h-px overflow-hidden bg-white/12">
                  <motion.div
                    key={`progress-${active}`}
                    className="h-full bg-accent"
                    initial={{ width: reduceMotion ? `${((active + 1) / BENEFITS.length) * 100}%` : '0%' }}
                    animate={{ width: reduceMotion ? `${((active + 1) / BENEFITS.length) * 100}%` : '100%' }}
                    transition={{ duration: reduceMotion ? 0 : 5.2, ease: 'linear' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
