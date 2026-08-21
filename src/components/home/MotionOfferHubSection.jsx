import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Boxes, Camera, FileCheck2, Film, Gauge, ImagePlus, Layers3, Sparkles } from 'lucide-react';

const STEPS = [
  {
    icon: Camera,
    title: '1 · Podklady a prostor',
    text: 'Klient pošle poptávku, fotografii prostoru, nákres nebo vlastní tvar. Hub z toho vytvoří projektový brief a kontrolní seznam.',
  },
  {
    icon: ImagePlus,
    title: '2 · Vizualizace a produktové foto',
    text: 'Pro každý produkt a variantu vznikne vlastní katalogový náhled, realistická scéna, detail materiálu a případně zákres do prostoru.',
  },
  {
    icon: Film,
    title: '3 · Motion prezentace',
    text: 'Z nabídky vznikne prezentační výstup: PDF, Gamma / Slides, video náhled, ikony a grafika pro klientský portál.',
  },
  {
    icon: FileCheck2,
    title: '4 · Nabídka a objednávka',
    text: 'Klient vše vidí v Můj projekt, může se zeptat, schválit příplatky a závazně objednat nabídku online.',
  },
];

const OUTPUTS = ['PDF nabídka', 'Prezentace', 'Video hero', 'Produktové foto', 'Ikony', 'Zákres do prostoru'];

export default function MotionOfferHubSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="home-content" className="relative overflow-hidden bg-[#eef3f4] py-20 sm:py-24 lg:py-28">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { x: [0, 36, 0], y: [0, -18, 0], opacity: [0.16, 0.3, 0.16] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-cyan-300/35 blur-[120px]"
      />
      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { x: [0, -44, 0], scale: [1, 1.12, 1], opacity: [0.11, 0.24, 0.11] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute right-[-8rem] bottom-10 h-96 w-96 rounded-full bg-slate-400/25 blur-[140px]"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[.95fr_1.05fr] lg:gap-16">
          <div>
            <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.55 }} className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur">
              <Sparkles size={14} className="text-cyan-700" />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-cyan-800">Offer Hub · motion workflow</span>
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.65, delay: 0.05 }} className="mt-6 max-w-3xl font-heading text-[clamp(2.4rem,4.8vw,5.2rem)] font-light leading-[.96] tracking-[-.045em] text-[#0d2d38]">
              Nabídka, která působí jako architektonická prezentace.
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, delay: 0.12 }} className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
              Sales Hub spojuje poptávku, technické zadání, vizualizace, produktové fotografie, video, PDF nabídku a klientský portál do jednoho prémiového procesu. Technická data se do nabídky propisují pouze ze zdrojů; neznámé parametry zůstávají prázdné a nedopočítávají se odhadem.
            </motion.p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/poptavka" className="btn-metallic-mist inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0d2d38] px-6 py-3 text-sm font-bold text-white shadow-[0_16px_45px_rgba(13,45,56,.18)]">
                Začít návrh nabídky <ArrowRight size={15} />
              </Link>
              <Link to="/obchodni-nabidky" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-[#0d2d38] backdrop-blur hover:border-cyan-300">
                Otevřít Sales Hub
              </Link>
            </div>

            <div className="mt-9 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {OUTPUTS.map((item) => <div key={item} className="rounded-2xl border border-white bg-white/70 px-3.5 py-3 text-xs font-semibold text-slate-700 shadow-sm">{item}</div>)}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[36px] bg-gradient-to-br from-cyan-200/40 via-white/20 to-slate-300/40 blur-2xl" />
            <div className="relative overflow-hidden rounded-[34px] border border-white bg-white/82 p-4 shadow-[0_28px_90px_rgba(13,45,56,.10)] backdrop-blur-xl sm:p-5">
              <div className="rounded-[28px] bg-[#0d2d38] p-5 text-white sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#70dce9]">Live offer cockpit</p>
                    <h3 className="mt-2 text-2xl font-light">Hub nabídky MLŽIDLA®</h3>
                  </div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[.07] text-[#70dce9]"><Layers3 size={21}/></span>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[['Vizualizace', '6'], ['Dokumenty', '4'], ['Akce', '2–3 týdny']].map(([label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[.06] p-4"><p className="text-[10px] uppercase tracking-[.14em] text-white/38">{label}</p><p className="mt-2 text-xl font-semibold text-white">{value}</p></div>)}
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {STEPS.map((step, index) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                    className="grid grid-cols-[44px_1fr] gap-3 rounded-2xl border border-slate-100 bg-slate-50/90 p-4"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-cyan-700 shadow-sm"><step.icon size={18}/></span>
                    <span>
                      <strong className="block text-sm text-slate-950">{step.title}</strong>
                      <span className="mt-1 block text-xs leading-5 text-slate-500">{step.text}</span>
                    </span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4">
                  <Gauge size={17} className="text-cyan-800" />
                  <p className="mt-2 text-sm font-semibold text-slate-950">Technická přesnost</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">Parametry bez odhadování: pokud zdroj neobsahuje údaj, uloží se null.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <Boxes size={17} className="text-slate-700" />
                  <p className="mt-2 text-sm font-semibold text-slate-950">Varianty produktu</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">SINGLE, DUO a ALEJ mají vlastní náhledy i odpovídající počet prvků.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
