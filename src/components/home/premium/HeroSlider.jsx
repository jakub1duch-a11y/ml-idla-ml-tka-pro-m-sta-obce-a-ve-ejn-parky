import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight, Building2, Droplets, ShieldCheck, Sparkles, Wifi } from 'lucide-react';

const HERO_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e3b9629f2_mlzidla-vizual__5_.webp';

const FACTS = [
  { icon: Droplets, label: 'Vodní mlha', value: 'Nízkotlaké řešení' },
  { icon: ShieldCheck, label: 'Konstrukce', value: 'Nerezové provedení' },
  { icon: Wifi, label: 'Řízení', value: 'Smart / Wi‑Fi' },
  { icon: Building2, label: 'Použití', value: 'Veřejný prostor' },
];

export default function HeroSlider() {
  const sectionRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '10%']);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '-8%']);
  const glowY = useTransform(scrollYProgress, [0, 1], ['0%', reduceMotion ? '0%' : '24%']);
  const opacity = useTransform(scrollYProgress, [0, 0.72, 1], [1, 0.92, 0.12]);

  return (
    <section ref={sectionRef} className="relative isolate min-h-[100svh] overflow-hidden bg-[#071d26] text-white">
      <motion.div style={{ y: imageY, opacity }} className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Architektonické mlžítko MLŽIDLA® ve veřejném prostoru"
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
      </motion.div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,25,34,.93)_0%,rgba(5,25,34,.72)_42%,rgba(5,25,34,.22)_72%,rgba(5,25,34,.08)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,29,38,.32)_0%,rgba(7,29,38,.04)_42%,rgba(7,29,38,.74)_100%)]" />

      <motion.div style={{ y: glowY }} aria-hidden="true" className="pointer-events-none absolute -left-32 top-[22%] h-80 w-80 rounded-full bg-cyan-300/20 blur-[110px]" />
      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { x: [0, 46, 0], y: [0, -24, 0], opacity: [0.12, 0.28, 0.12] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute right-[8%] top-[18%] h-52 w-52 rounded-full bg-white/15 blur-[88px]"
      />
      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { x: [0, -34, 0], scale: [1, 1.15, 1], opacity: [0.08, 0.2, 0.08] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute bottom-[12%] right-[25%] h-72 w-72 rounded-full bg-cyan-100/15 blur-[120px]"
      />

      <div className="pointer-events-none absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_72%)]" />

      <motion.div style={{ y: copyY }} className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col justify-between px-5 pb-7 pt-28 sm:px-8 sm:pb-9 lg:px-10 lg:pb-10 lg:pt-32">
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_.92fr] lg:gap-16">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-4 py-2 backdrop-blur-xl"
            >
              <Sparkles size={13} className="text-[#70dce9]" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-white/80">MLŽIDLA® · Cooling architecture</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08 }}
              className="max-w-[13ch] font-heading text-[clamp(3rem,7vw,7rem)] font-medium leading-[.93] tracking-[-.055em] text-white"
            >
              Mlha jako součást architektury.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18 }}
              className="mt-7 max-w-2xl text-[clamp(1rem,1.35vw,1.22rem)] leading-8 text-white/72"
            >
              Navrhujeme a vyrábíme nerezová mlžítka a mlžné prvky pro města, parky, promenády a architektonické projekty. Nízkotlaká mlha bez samostatného vysokotlakého čerpadla, s možností chytrého řízení.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link to="/mlzidla-mlzitka" className="btn-metallic-mist inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#61d5e5] px-7 py-4 text-sm font-bold text-[#082934] shadow-[0_16px_45px_rgba(97,213,229,.24)] transition hover:-translate-y-0.5">
                Prohlédnout kolekce <ArrowRight size={16} />
              </Link>
              <Link to="/poptavka" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-white/22 bg-white/[.07] px-7 py-4 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/[.13]">
                Navrhnout řešení
              </Link>
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.22 }}
            className="hidden lg:block"
          >
            <div className="ml-auto max-w-md overflow-hidden rounded-[30px] border border-white/16 bg-[#0b2934]/50 p-2 shadow-[0_30px_90px_rgba(0,0,0,.24)] backdrop-blur-2xl">
              <div className="rounded-[24px] border border-white/10 bg-white/[.06] p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#8fe4ef]">Systémový princip</p>
                    <p className="mt-2 text-lg font-semibold">Voda · objekt · řízení</p>
                  </div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[.06] text-[#8fe4ef]"><Droplets size={19}/></span>
                </div>
                <div className="mt-6 space-y-2.5">
                  {FACTS.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, delay: 0.36 + index * 0.07 }}
                      className="grid grid-cols-[34px_1fr_auto] items-center gap-3 rounded-2xl border border-white/8 bg-black/10 px-3.5 py-3"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/[.07] text-[#7cdce8]"><item.icon size={15}/></span>
                      <span className="text-xs text-white/48">{item.label}</span>
                      <strong className="text-right text-xs font-semibold text-white/88">{item.value}</strong>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-5 border-t border-white/10 pt-5">
                  <p className="text-[11px] leading-5 text-white/45">Každý projekt navrhujeme podle konkrétního prostoru, požadovaného účinku, hydrauliky a provozních podmínek.</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>

        <div className="mt-12 grid gap-4 border-t border-white/12 pt-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:max-w-3xl">
            {FACTS.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[.055] px-3 py-3 backdrop-blur-lg lg:hidden">
                <item.icon size={15} className="text-[#7edce8]" />
                <p className="mt-2 text-[9px] uppercase tracking-[.13em] text-white/38">{item.label}</p>
                <p className="mt-1 text-[11px] font-semibold leading-4 text-white/82">{item.value}</p>
              </div>
            ))}
          </div>
          <a href="#home-content" className="hidden items-center gap-2 text-[10px] font-mono uppercase tracking-[.16em] text-white/50 transition hover:text-white sm:inline-flex">
            Objevte řešení <motion.span animate={reduceMotion ? undefined : { y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity }}><ArrowDown size={14}/></motion.span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
