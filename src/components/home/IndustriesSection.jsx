import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Building2, Trees, Waves, UtensilsCrossed, Sparkles, Calendar, PenTool, Factory, ArrowRight } from 'lucide-react';

const INDUSTRIES = [
  {
    icon: Building2,
    title: 'Města a obce',
    desc: 'Náměstí, promenády, ulice — ochlazení veřejného prostoru s důrazem na provoz a bezpečnost.',
    href: '/kategorie/mesta-obce',
  },
  {
    icon: Trees,
    title: 'Parky a hřiště',
    desc: 'Mlžné ostrovy a aleje pro komfort obyvatel i návštěvníků v letních měsících.',
    href: '/kategorie/parky-hriste',
  },
  {
    icon: Waves,
    title: 'Koupaliště a aquaparky',
    desc: 'Ochlazení zón kolem bazénů a lehátek — příjemnější pobyt pro návštěvníky.',
    href: '/kategorie/koupaliste',
  },
  {
    icon: UtensilsCrossed,
    title: 'Gastro a terasy',
    desc: 'Restaurace, kavárny, hotelové terasy — komfort hostů i v největším horku.',
    href: '/kategorie/komercni',
  },
  {
    icon: Sparkles,
    title: 'Wellness a hotely',
    desc: 'Prémiový detail pro venkovní wellness zóny, bazény a odpočinkové prostory.',
    href: '/kategorie/komercni',
  },
  {
    icon: Calendar,
    title: 'Eventy a festivaly',
    desc: 'Pronájem mobilních mlžných systémů pro festivaly, konference a venkovní akce.',
    href: '/kategorie/eventy',
  },
  {
    icon: PenTool,
    title: 'Architekti a developeři',
    desc: 'Technicky čistý prvek pro koordinaci s projektovou dokumentací a vizualizacemi.',
    href: '/kategorie/architekti',
  },
  {
    icon: Factory,
    title: 'Průmysl a venkovní prostory',
    desc: 'Ochlazení pracovišť, hal a venkovních provozů — produktivita i v horkých dnech.',
    href: '/kategorie/komercni',
  },
];

export default function IndustriesSection() {
  const reduceMotion = useReducedMotion();
  return (
    <section className="relative bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: reduceMotion ? 0 : 0.45 }}
            className="font-mono text-[11px] font-semibold uppercase tracking-[.2em] text-[#0B6B7A]"
          >
            Kompletní řešení pro všechna odvětví
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.05 }}
            className="mt-4 font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[#0A1628]"
          >
            Jeden systém mlžení. Každé prostředí.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.12 }}
            className="mt-5 text-base leading-7 text-[#5A6B78] sm:text-lg"
          >
            Od náměstí po zahradu, od festivalu po průmyslovou halu. Navrhujeme, vyrábíme a instalujeme
            nerezová mlžítka přizpůsobená konkrétnímu prostoru a provozu.
          </motion.p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-[#D3E2E8] bg-[#D3E2E8] sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: reduceMotion ? 0 : 0.4, delay: (i % 4) * 0.06 }}
            >
              <Link
                to={item.href}
                className="group flex h-full flex-col bg-white p-7 transition-colors hover:bg-[#F4FAFC]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#E7F4F8] text-[#0B6B7A] transition-colors group-hover:bg-[#22D3EE] group-hover:text-white">
                  <item.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="mt-5 font-heading text-lg font-semibold tracking-[-0.01em] text-[#0A1628]">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-[#5A6B78]">{item.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0B6B7A] transition-transform group-hover:translate-x-1">
                  Více <ArrowRight size={14} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}