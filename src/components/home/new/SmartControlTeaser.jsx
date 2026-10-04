import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Clock3, Droplets, Gauge, Smartphone, ThermometerSun, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';

const SCENARIOS = [
  { Icon: ThermometerSun, title: 'Podle teploty', text: 'Mlžení se spustí až při nastavené venkovní teplotě.' },
  { Icon: Clock3, title: 'Podle času', text: 'Nastavíte provozní okna pro ráno, odpoledne, akci nebo víkend.' },
  { Icon: Smartphone, title: 'Kdykoli z aplikace', text: 'Obsluha může mlžítko ručně zapnout či vypnout na dálku.' },
  { Icon: Droplets, title: 'Více vodních zón', text: 'Město, sportoviště nebo zahrada může mít samostatně řízené okruhy.' },
];

export default function SmartControlTeaser() {
  const [activeScenario, setActiveScenario] = useState(0);
  const reducedMotion = useReducedMotion();
  return (
    <section className="overflow-hidden bg-[#071f37] py-20 text-white lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[.9fr_1.1fr] lg:gap-20 lg:px-10">
        <div>
          <div className="inline-flex items-center gap-2 border border-cyan/30 bg-cyan/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.16em] text-cyan">
            <Wifi size={14} /> Volitelné chytré řízení
          </div>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[.18em] text-cyan/80">Smart ventil + aplikace SUPLA</p>
          <h2 className="mt-4 max-w-xl font-heading text-3xl leading-tight sm:text-4xl lg:text-5xl">
            Osvěžení přesně tehdy,<br />kdy je potřeba.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">
            Chytré řízení SUPLA propojuje mlžítka, ventil, senzory a provozní scénáře do jedné přehledné vrstvy. Pro města, sportoviště i rezidenční instalace lze nastavit osvěžení podle teploty, času a konkrétní zóny.
          </p>
          <p className="mt-5 max-w-xl border-l-2 border-cyan pl-4 text-sm leading-relaxed text-white/58">
            Konkrétní zapojení, počet zón a vhodný ventil vždy navrhujeme podle přívodu vody a režimu instalace.
          </p>
          <Link to="/smart-ovladani" className="btn-metallic-mist mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold">
            Jak funguje chytré řízení <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {SCENARIOS.map(({ Icon, title, text }, index) => (
            <button key={title} type="button" aria-pressed={activeScenario === index} aria-controls="supla-scenario-preview" onClick={() => setActiveScenario(index)} className={`relative min-h-[190px] rounded-lg border p-6 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan ${activeScenario === index ? "border-cyan bg-cyan/10" : "border-white/20 bg-white/[.045] hover:border-cyan/60"}`}>
              <span className="font-mono text-[10px] tracking-widest text-cyan">0{index + 1}</span>
              <Icon size={25} className="mt-7 text-cyan" />
              <h3 className="mt-5 font-heading text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{text}</p>
            </button>
          ))}
          <div id="supla-scenario-preview" className="relative min-h-[230px] overflow-hidden rounded-lg border border-cyan/20 bg-cyan/10 p-6 sm:col-span-2">
            <img src="/media/optimized/5c4b99749_Smartmlzitka-ovladanizmobilu.webp" alt="Chytré řízení SUPLA v mobilní aplikaci" className="absolute inset-y-0 right-0 hidden h-full w-1/2 object-contain p-4 opacity-90 sm:block" loading="lazy" decoding="async" />
            <Gauge size={24} className="text-cyan" />
            <div className="relative sm:w-1/2 sm:pr-4" aria-live="polite" aria-atomic="true">
              <p className="mt-4 text-xs font-semibold text-cyan">Ukázka provozního scénáře</p>
              <motion.div key={activeScenario} initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <h3 className="mt-2 font-heading text-xl font-semibold">{SCENARIOS[activeScenario].title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">{SCENARIOS[activeScenario].text}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}