import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Layers, Droplets, Cpu } from 'lucide-react';

const PROCESS = [
  {
    step: '01',
    icon: Layers,
    title: 'Analýza prostoru',
    desc: 'Prohlédneme místo, změníme provoz, návštěvnost i klimatické podmínky. Navrhneme konfiguraci trysek a pokrytí.',
  },
  {
    step: '02',
    icon: Droplets,
    title: 'Návrh a vizualizace',
    desc: 'Vytvoříme 3D vizualizaci, technický list a cenovou nabídku. Potvrdíme rozměry, kotvení a materiál.',
  },
  {
    step: '03',
    icon: Cpu,
    title: 'Výroba a Smart řízení',
    desc: 'Vyrábíme v Trutnově, nainstalujeme na místě. Připojíme Smart řízení SUPLA — čas, teplota, scénáře z mobilu.',
  },
];

export default function CustomDesignSection() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="relative bg-[#F4FAFC] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: reduceMotion ? 0 : 0.45 }}
            className="font-mono text-[11px] font-semibold uppercase tracking-[.2em] text-[#0B6B7A]"
          >
            Od zadání k realizaci
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.05 }}
            className="mt-4 font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[#0A1628]"
          >
            Jak vzniká vaše mlžítko na míru
          </motion.h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PROCESS.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: reduceMotion ? 0 : 0.45, delay: i * 0.1 }}
              className="relative rounded-sm border border-[#D3E2E8] bg-white p-8"
            >
              <div className="absolute right-6 top-6 font-heading text-5xl font-extrabold leading-none text-[#E7F4F8]">
                {item.step}
              </div>
              <div className="relative flex h-12 w-12 items-center justify-center rounded-sm bg-[#0A1628] text-[#22D3EE]">
                <item.icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="relative mt-5 font-heading text-lg font-semibold tracking-[-0.01em] text-[#0A1628]">
                {item.title}
              </h3>
              <p className="relative mt-2 text-sm leading-6 text-[#5A6B78]">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: reduceMotion ? 0 : 0.5 }}
          className="mt-12 flex flex-col items-center justify-center gap-4 rounded-sm border border-[#D3E2E8] bg-white px-8 py-10 text-center sm:flex-row sm:justify-between sm:text-left"
        >
          <div>
            <h3 className="font-heading text-xl font-bold tracking-[-0.01em] text-[#0A1628]">
              Máte prostor k ochlazení?
            </h3>
            <p className="mt-1 text-sm text-[#5A6B78]">
              Pošlete nám fotografie nebo zadání — do 48 hodin připravíme návrh a orientační kalkulaci.
            </p>
          </div>
          <Link
            to="/poptavka"
            className="btn-metallic-mist inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
          >
            Odeslat poptávku <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}