import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Building2,
  ShoppingBag,
  Trees,
  Armchair,
  ThermometerSun,
  Clock3,
  Wifi,
  Droplets,
  Gauge,
  Wind,
  Sparkles,
} from 'lucide-react';

const USE_CASES = [
  {
    id: 'city',
    short: 'Města a obce',
    icon: Building2,
    eyebrow: 'Veřejný prostor',
    title: 'Chytré mlžení pro místa, kde se lidé potkávají.',
    text: 'Náměstí, promenády, parky, školy nebo vstupy do veřejných budov. Mlžení se spouští podle teploty, času a zvoleného provozního scénáře.',
    image: '/media/optimized/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.webp',
    imagePosition: 'center 54%',
    stats: [['5–10 °C', 'snížení pocitové teploty'], ['SMART', 'řízení provozu'], ['NEREZ', 'odolné veřejné řešení']],
  },
  {
    id: 'retail',
    short: 'Obchodní zóny',
    icon: ShoppingBag,
    eyebrow: 'Retail & hospitality',
    title: 'Komfort mezi obchody, na terase i v čekací zóně.',
    text: 'Pro obchodní centra, retail parky, gastro a hotelové provozy navrhujeme mlžné body tak, aby podporovaly pobyt venku bez vizuálního zahlcení prostoru.',
    image: '/media/optimized/03ba352a3_mlzitka-zahradni-hotely-restaurace.webp',
    imagePosition: 'center',
    stats: [['ZÓNY', 'cílené ochlazení'], ['ČAS', 'provozní harmonogram'], ['APP', 'vzdálené ovládání']],
  },
  {
    id: 'garden',
    short: 'Zahrady a bazény',
    icon: Trees,
    eyebrow: 'Rezidenční architektura',
    title: 'Mlha jako jemná součást zahrady, terasy nebo okolí bazénu.',
    text: 'Pro soukromé zahrady a prémiové rezidence pracujeme s menším měřítkem, klidem a čistou kompozicí. Technika ustupuje architektuře a atmosféře.',
    image: '/media/optimized/3bd7f70e9_MlitkoAURA-zahradnimlzidlo.webp',
    imagePosition: 'center',
    stats: [['TICHÝ', 'nenápadný provoz'], ['SCÉNY', 'den / večer / vedro'], ['DESIGN', 'vazba na architekturu']],
  },
  {
    id: 'lounge',
    short: 'Mlhoviště & sezení',
    icon: Armchair,
    eyebrow: 'Pobytová zóna',
    title: 'Osvěžující místo pro sezení místo další vodní plochy.',
    text: 'Mlhoviště může vytvořit pobytový bod se sezením, stínem a jemnou vodní mlhou. Vhodné tam, kde chcete osvěžení a atmosféru bez klasického bazénu.',
    image: '/media/optimized/81c84ca33_Mrakmlzitko-skolnizahrada.webp',
    imagePosition: 'center',
    stats: [['MLHA', 'jemné osvěžení'], ['POBYT', 'místo k zastavení'], ['KOMPAKTNÍ', 'alternativa k vodní ploše']],
  },
];

const FLOW = [
  { icon: ThermometerSun, label: 'Teplota', detail: 'Podmínka spuštění' },
  { icon: Clock3, label: 'Čas', detail: 'Provozní okna' },
  { icon: Wifi, label: 'Smart řízení', detail: 'SUPLA / automatizace' },
  { icon: Droplets, label: 'Mlžení', detail: 'Jemná vodní mlha' },
  { icon: Gauge, label: 'Přehled', detail: 'Provoz a data' },
];

function MistLayers({ reduced }) {
  if (reduced) return null;
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute -left-[8%] top-[28%] h-40 w-[62%] rounded-full bg-[#7DD3FC]/20 blur-3xl"
        animate={{ x: [0, 42, 0], y: [0, -10, 0], opacity: [.18, .38, .18] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[-12%] top-[44%] h-56 w-[60%] rounded-full bg-[#00B7FF]/15 blur-3xl"
        animate={{ x: [0, -34, 0], y: [0, 14, 0], opacity: [.14, .34, .14] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

export default function SmartUseCasesExperience({ compact = false }) {
  const [activeId, setActiveId] = useState('city');
  const reduced = useReducedMotion();
  const active = useMemo(() => USE_CASES.find((item) => item.id === activeId) || USE_CASES[0], [activeId]);

  return (
    <section className="relative overflow-hidden bg-[#071A2F] text-white" aria-labelledby="smart-usecases-heading">
      <MistLayers reduced={reduced} />
      <div className={`relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 ${compact ? 'py-16 lg:py-20' : 'py-20 lg:py-28'}`}>
        <div className="grid gap-10 lg:grid-cols-[.76fr_1.24fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.24em] text-[#00B7FF]">MLŽIDLA® · chytré řešení prostoru</p>
            <h2 id="smart-usecases-heading" className="mt-5 max-w-[12ch] font-heading text-4xl font-bold leading-[1.02] tracking-[-.045em] sm:text-5xl lg:text-6xl">
              Jemná atraktivní mlha. Pro lepší klima.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/68 sm:text-lg">
              Jeden systém, různé scénáře použití. Architektura, provoz a chytré řízení jsou navržené jako jeden celek.
            </p>
            <p className="mt-5 font-brand-script text-3xl leading-none text-[#16BFFF] sm:text-4xl">Architektura, která dýchá.</p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {USE_CASES.map((item) => {
              const Icon = item.icon;
              const activeTab = item.id === activeId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={`group min-h-24 border p-4 text-left transition-all duration-300 ${activeTab ? 'border-[#00B7FF]/60 bg-[#00B7FF]/12 shadow-[0_0_40px_rgba(0,183,255,.12)]' : 'border-white/10 bg-white/[.035] hover:border-white/25 hover:bg-white/[.06]'}`}
                  aria-pressed={activeTab}
                >
                  <Icon size={20} className={activeTab ? 'text-[#00B7FF]' : 'text-white/55 group-hover:text-white'} />
                  <span className="mt-4 block text-sm font-semibold leading-5 text-white">{item.short}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 overflow-hidden border border-white/10 bg-white/[.035] lg:mt-12">
          <div className="grid lg:grid-cols-[1.2fr_.8fr]">
            <div className="relative min-h-[430px] overflow-hidden sm:min-h-[520px]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={active.image}
                  src={active.image}
                  alt={`${active.short} — použití mlžítek MLŽIDLA®`}
                  initial={{ opacity: 0, scale: 1.035 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.015 }}
                  transition={{ duration: reduced ? 0 : .55, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: active.imagePosition }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,26,47,.05)_0%,rgba(7,26,47,.12)_50%,rgba(7,26,47,.7)_100%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(7,26,47,.72)_0%,transparent_52%)]" />

              <div className="absolute left-5 top-5 flex items-center gap-2 border border-white/16 bg-[#071A2F]/60 px-3 py-2 backdrop-blur-md sm:left-7 sm:top-7">
                <Sparkles size={14} className="text-[#00B7FF]" />
                <span className="font-mono text-[9px] uppercase tracking-[.18em] text-white/80">živá prezentační vrstva</span>
              </div>

              <div className="absolute bottom-6 left-5 right-5 grid gap-3 sm:bottom-7 sm:left-7 sm:right-7 sm:grid-cols-3">
                {active.stats.map(([value, label], index) => (
                  <motion.div
                    key={`${active.id}-${value}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduced ? 0 : index * .08 }}
                    className="border border-white/12 bg-[#071A2F]/58 p-3.5 backdrop-blur-lg"
                  >
                    <strong className="block font-heading text-lg text-[#7DD3FC]">{value}</strong>
                    <span className="mt-1 block text-[11px] leading-4 text-white/65">{label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative flex min-h-[430px] flex-col justify-between p-6 sm:p-8 lg:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: reduced ? 0 : .34 }}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#00B7FF]">{active.eyebrow}</p>
                  <h3 className="mt-4 font-heading text-3xl font-bold leading-tight tracking-[-.035em] sm:text-4xl">{active.title}</h3>
                  <p className="mt-5 text-sm leading-7 text-white/66 sm:text-base">{active.text}</p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-10">
                <p className="mb-4 font-mono text-[9px] uppercase tracking-[.2em] text-white/42">Product flow</p>
                <div className="grid grid-cols-5 gap-1.5">
                  {FLOW.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.label} className="relative min-w-0">
                        <div className="flex h-10 w-10 items-center justify-center border border-[#00B7FF]/25 bg-[#00B7FF]/10 text-[#7DD3FC]">
                          <Icon size={17} />
                        </div>
                        {index < FLOW.length - 1 && <span className="absolute left-10 top-5 h-px w-[calc(100%-2.5rem)] bg-gradient-to-r from-[#00B7FF]/50 to-white/5" />}
                        <span className="mt-2 block truncate text-[9px] font-semibold text-white/75 sm:text-[10px]">{step.label}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link to="/chytre-reseni-pro-prostor" className="btn-brand-primary-dark justify-center">Prohlédnout celé řešení <ArrowRight size={16} /></Link>
                  <Link to="/poptavka" className="btn-brand-outline-dark justify-center">Navrhnout pro můj prostor</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!compact && (
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="border border-white/10 bg-white/[.025] p-5"><Wind size={18} className="text-[#7DD3FC]"/><h4 className="mt-4 font-heading text-lg font-semibold">Vrstvená animace</h4><p className="mt-2 text-sm leading-6 text-white/55">Mlha, světlo a datové vrstvy se pohybují jemně a neodvádějí pozornost od produktu.</p></div>
            <div className="border border-white/10 bg-white/[.025] p-5"><Droplets size={18} className="text-[#7DD3FC]"/><h4 className="mt-4 font-heading text-lg font-semibold">Reálný produkt</h4><p className="mt-2 text-sm leading-6 text-white/55">Používáme skutečné produktové fotografie; geometrie mlžítek zůstává beze změn.</p></div>
            <div className="border border-white/10 bg-white/[.025] p-5"><Gauge size={18} className="text-[#7DD3FC]"/><h4 className="mt-4 font-heading text-lg font-semibold">Interaktivní informace</h4><p className="mt-2 text-sm leading-6 text-white/55">Uživatel si přepíná scénář a okamžitě vidí benefity, způsob řízení a vhodné použití.</p></div>
          </div>
        )}
      </div>
    </section>
  );
}
