import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Box,
  CloudSun,
  Droplets,
  Gauge,
  Radio,
  Thermometer,
  Timer,
  Waves,
  Wifi,
} from 'lucide-react';

const FLOW = [
  { Icon: Thermometer, label: 'PODMÍNKA', value: 'TEPLOTA / ČAS', note: 'podle nastavení konkrétní zóny' },
  { Icon: Radio, label: 'SMART ŘÍZENÍ', value: 'AUTOMATIKA', note: 'vyhodnocení pravidel' },
  { Icon: Gauge, label: 'VENTIL', value: 'ŘÍZENÁ ZÓNA', note: 'otevření nebo uzavření přívodu' },
  { Icon: Droplets, label: 'MLŽÍTKO', value: 'PROVOZNÍ REŽIM', note: 'jemná vodní mlha podle scénáře' },
];

const STEPS = [
  { Icon: Thermometer, number: '01', title: 'Systém načte podmínky', text: 'Vyhodnotí dostupné vstupy, například teplotu, časové okno nebo další připojené podmínky.' },
  { Icon: CloudSun, number: '02', title: 'Ověří pravidla zóny', text: 'Automatizace porovná aktuální stav s nastaveným scénářem pro konkrétní místo.' },
  { Icon: Timer, number: '03', title: 'Spustí správný scénář', text: 'Řízení aktivuje příslušnou vodní zónu na nastavený čas nebo cyklus.' },
  { Icon: Waves, number: '04', title: 'Ukončí provoz bezpečně', text: 'Po skončení podmínky nebo scénáře se zóna automaticky uzavře.' },
];

const spring = { type: 'spring', stiffness: 120, damping: 18, mass: 0.7 };

export default function SmartAutomationFlow() {
  const reduced = useReducedMotion();

  return (
    <section id="jak-to-funguje" className="smart-motion-section relative scroll-mt-24 overflow-hidden bg-[#07131D] py-20 text-white lg:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[8%] top-10 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute bottom-0 right-[8%] h-96 w-96 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1540px] px-5 sm:px-8 lg:px-12 xl:px-20">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <p className="font-mono text-[11px] uppercase tracking-[.22em] text-[#7AE1EF]">Automatizace / 01</p>
            <h2 className="mt-5 max-w-[12ch] font-heading text-[clamp(2.5rem,5vw,5rem)] font-black leading-[.95] tracking-[-.055em]">
              Nastavte podmínky. Systém pracuje za vás.
            </h2>
          </motion.div>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.62, delay: 0.08 }}
            className="max-w-2xl text-base leading-8 text-white/62 lg:justify-self-end"
          >
            Smart řízení propojuje vstupy, provozní pravidla a jednotlivé vodní zóny. Konkrétní funkce se vždy zobrazují podle skutečně osazené konfigurace projektu.
          </motion.p>
        </div>

        <div className="mt-12 grid gap-3 lg:grid-cols-4">
          {FLOW.map(({ Icon, label, value, note }, index) => (
            <React.Fragment key={label}>
              <motion.article
                initial={reduced ? false : { opacity: 0, y: 24, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={reduced ? undefined : { y: -6 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ ...spring, delay: index * 0.06 }}
                className="smart-flow-card group relative min-h-[220px] overflow-hidden rounded-[28px] border border-white/10 bg-white/[.055] p-5 backdrop-blur-xl"
              >
                <div className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-transparent via-[#7AE1EF] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#7AE1EF]/25 bg-[#7AE1EF]/10 text-[#7AE1EF]">
                    <Icon size={23} strokeWidth={1.7} />
                  </span>
                  <span className="font-mono text-[10px] tracking-[.16em] text-white/38">0{index + 1}</span>
                </div>
                <p className="mt-8 font-mono text-[10px] uppercase tracking-[.18em] text-white/44">{label}</p>
                <p className="mt-2 font-heading text-xl font-bold tracking-[-.025em]">{value}</p>
                <p className="mt-2 text-sm leading-6 text-white/52">{note}</p>
                {index < 3 && <ArrowRight size={17} className="absolute -right-[11px] top-1/2 z-10 hidden -translate-y-1/2 text-[#7AE1EF] lg:block" />}
              </motion.article>
            </React.Fragment>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { Icon: Box, title: 'Řídicí box', text: 'Logika scénářů, času a jednotlivých zón.' },
            { Icon: Gauge, title: 'Ventilová zóna', text: 'Řízené otevření a uzavření přívodu vody.' },
            { Icon: Wifi, title: 'Vzdálená správa', text: 'Dostupná u podporovaných SMART konfigurací.' },
          ].map(({ Icon, title, text }, index) => (
            <motion.div
              key={title}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={reduced ? undefined : { y: -4 }}
              viewport={{ once: true }}
              transition={{ duration: 0.48, delay: index * 0.05 }}
              className="rounded-[24px] border border-white/10 bg-white/[.035] p-5"
            >
              <Icon size={21} className="text-[#7AE1EF]" />
              <p className="mt-4 text-sm font-bold text-white">{title}</p>
              <p className="mt-2 text-sm leading-6 text-white/48">{text}</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-16 font-mono text-[10px] uppercase tracking-[.2em] text-white/36">Automatizace krok za krokem</p>
        <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ Icon, number, title, text }, index) => (
            <motion.div
              key={title}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, delay: index * 0.07 }}
              className="border-t border-white/14 pt-6"
            >
              <div className="flex items-center justify-between">
                <Icon size={30} className="text-[#7AE1EF]" />
                <span className="font-mono text-xs text-white/28">{number}</span>
              </div>
              <h3 className="mt-10 font-heading text-xl font-bold tracking-[-.03em]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/50">{text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
          className="mt-16 grid overflow-hidden rounded-[32px] border border-white/10 bg-white/[.04] shadow-[0_35px_120px_rgba(0,0,0,.28)] lg:grid-cols-[1.1fr_.9fr]"
        >
          <div className="relative min-h-[320px] overflow-hidden bg-white">
            <motion.img
              src="/media/optimized/5c4b99749_Smartmlzitka-ovladanizmobilu.webp"
              alt="Smart řízení mlžného systému v mobilní aplikaci"
              className="absolute inset-0 h-full w-full object-contain p-4 sm:p-8"
              whileHover={reduced ? undefined : { scale: 1.025 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
            <p className="font-mono text-[11px] uppercase tracking-[.2em] text-[#7AE1EF]">Technologie v praxi</p>
            <h3 className="mt-4 max-w-lg font-heading text-3xl font-bold leading-[1.05] tracking-[-.04em] sm:text-4xl">
              Jedno řízení. Jedna nebo více vodních zón.
            </h3>
            <p className="mt-5 text-sm leading-7 text-white/54">
              Řídicí část se navrhuje podle rozsahu instalace. Každá zóna může mít vlastní provozní režim a automatizační podmínky; konkrétní sestava se volí podle skutečné hydrauliky, napájení a požadovaných funkcí projektu.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Teplota', 'Čas', 'Počasí podle konfigurace', 'Senzor podle konfigurace', 'Více zón'].map((item) => (
                <span key={item} className="rounded-full border border-white/12 bg-white/[.04] px-3 py-1.5 text-xs font-medium text-white/62">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
