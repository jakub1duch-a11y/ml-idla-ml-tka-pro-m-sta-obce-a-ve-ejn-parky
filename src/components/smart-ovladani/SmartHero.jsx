import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Clock3,
  Droplets,
  Gauge,
  MousePointer2,
  ThermometerSun,
  Wifi,
} from 'lucide-react';
import HeroAtmosphere from '@/components/ui/HeroAtmosphere';

const MODES = [
  {
    icon: ThermometerSun,
    title: 'Spuštění podle teploty',
    text: 'Provozní logika může reagovat na nastavenou teplotní podmínku podle konfigurace projektu.',
  },
  {
    icon: Clock3,
    title: 'Časové scénáře',
    text: 'Nastavte provozní okna a cykly podle toho, kdy se prostor skutečně používá.',
  },
  {
    icon: MousePointer2,
    title: 'Senzorové spuštění',
    text: 'U podporovaných sestav lze provoz navázat na další připojený senzor nebo podmínku.',
  },
  {
    icon: Gauge,
    title: 'Přehled provozu',
    text: 'Klientská vrstva může zobrazovat dostupná provozní data podle osazené konfigurace.',
  },
];

export default function SmartHero() {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '8%']);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.045]);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '-5%']);

  return (
    <section ref={ref} className="hero-motion-surface relative overflow-hidden bg-[#07131D] pt-[68px] text-white">
      <HeroAtmosphere />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[6%] top-20 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute right-[8%] top-0 h-[32rem] w-[32rem] rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[.12] [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <div className="relative mx-auto max-w-[1540px] px-5 pb-12 pt-16 sm:px-8 lg:px-12 lg:pb-20 lg:pt-20 xl:px-20">
        <div className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] xl:gap-16">
          <motion.div style={{ y: copyY }} className="relative z-10">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[.055] px-4 py-2 backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[#7AE1EF] shadow-[0_0_18px_rgba(122,225,239,.8)]" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-[.22em] text-white/62">AUTOMATIZACE / SUPLA</span>
              </div>

              <h1 className="mt-7 max-w-[11ch] font-heading text-[clamp(3.1rem,6.1vw,6.5rem)] font-black leading-[.9] tracking-[-.065em]">
                Nastavte pravidla. Systém poběží sám.
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-white/62 sm:text-lg">
                Automatizace propojuje mlžítko, ventil, provozní scénáře a dostupné senzory. Výsledkem je přehlednější správa a automatický provoz podle skutečné konfigurace instalace.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  to="/poptavka?produkt=Automatizace%20SUPLA%20ml%C5%BE%C3%ADtek"
                  className="product-sweep inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#7AE1EF] px-6 py-4 text-sm font-extrabold uppercase tracking-[.04em] text-[#07131D] shadow-[0_22px_60px_rgba(122,225,239,.22)] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Navrhnout automatizaci <ArrowRight size={17} />
                </Link>
                <a
                  href="#smart-automatizace"
                  className="product-sweep inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-white/14 bg-white/[.055] px-6 py-4 text-sm font-bold text-white backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#7AE1EF]/50"
                >
                  Jak funguje automatizace <ArrowRight size={16} />
                </a>
              </div>

              <div className="mt-10 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-7 sm:grid-cols-4">
                {[
                  ['01', 'Teplota'],
                  ['02', 'Čas'],
                  ['03', 'Senzory'],
                  ['04', 'Více zón'],
                ].map(([index, label]) => (
                  <div key={label}>
                    <p className="font-mono text-[10px] text-[#7AE1EF]">{index}</p>
                    <p className="mt-1 text-sm font-semibold text-white/72">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            style={{ y: mediaY, scale: mediaScale }}
            initial={reduced ? false : { opacity: 0, scale: 0.975, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(circle,rgba(122,225,239,.15),transparent_68%)] blur-2xl" />
            <div className="relative min-h-[500px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[.05] shadow-[0_38px_120px_rgba(0,0,0,.35)] backdrop-blur-xl sm:min-h-[620px]">
              <img
                src="/media/optimized/5c4b99749_Smartmlzitka-ovladanizmobilu.webp"
                alt="Automatizace mlžného systému v mobilní aplikaci"
                className="absolute inset-0 h-full w-full object-contain p-4 sm:p-8"
                loading="eager"
                fetchPriority="high"
              />
              <div className="absolute inset-x-5 bottom-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { icon: Wifi, label: 'Připojení', value: 'SUPLA / Wi‑Fi' },
                  { icon: Droplets, label: 'Zóna', value: 'Provozní stav' },
                  { icon: Gauge, label: 'Data', value: 'Dle konfigurace' },
                ].map(({ icon: Icon, label, value }, index) => (
                  <motion.div
                    key={label}
                    initial={reduced ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.32 + index * 0.08 }}
                    className="rounded-2xl border border-white/12 bg-[#07131D]/72 p-4 backdrop-blur-xl"
                  >
                    <Icon size={18} className="text-[#7AE1EF]" />
                    <p className="mt-3 font-mono text-[9px] uppercase tracking-[.18em] text-white/40">{label}</p>
                    <p className="mt-1 text-sm font-bold text-white">{value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {MODES.map(({ icon: Icon, title, text }, index) => (
            <motion.article
              key={title}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={reduced ? undefined : { y: -6 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="group rounded-[1.7rem] border border-white/10 bg-white/[.045] p-5 backdrop-blur-xl transition-colors hover:border-[#7AE1EF]/35 hover:bg-white/[.07]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#7AE1EF]/20 bg-[#7AE1EF]/10 text-[#7AE1EF]">
                  <Icon size={23} strokeWidth={1.7} />
                </span>
                <span className="font-mono text-[10px] text-white/24">0{index + 1}</span>
              </div>
              <h2 className="mt-6 font-heading text-xl font-bold tracking-[-.03em]">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/50">{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
