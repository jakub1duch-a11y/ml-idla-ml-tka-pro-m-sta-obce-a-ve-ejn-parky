import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Building2, Factory, Tent, Palette } from 'lucide-react';
import GateSlideCard from '@/components/kolekce/GateSlideCard';

const USE_CASES = [
{ icon: Building2, title: 'Vstup na náměstí a do parku', desc: 'Mlžná brána jako dominanta veřejného prostoru — chladí a zdobí zároveň.' },
{ icon: Factory, title: 'Vjezd do obchodního centra', desc: 'Reprezentativní vstupní portál pro komerční a administrativní areály.' },
{ icon: Tent, title: 'Vstup na event či festival', desc: 'Rychlá montáž, výrazný zážitek pro návštěvníky v horkých letních měsících.' },
{ icon: Palette, title: 'Architektonická dominanta', desc: 'Custom rozměry a tvar navržené přesně dle projektové dokumentace.' }];


const B2G_LINKS = [
{ label: 'Města a obce', path: '/kategorie/mesta-obce' },
{ label: 'Komerční prostory', path: '/kategorie/komercni' },
{ label: 'Eventy & festivaly', path: '/kategorie/eventy' },
{ label: 'Pro architekty', path: '/kategorie/architekti' }];


const GATES = [
  { name: 'GATE70-U', tagline: 'Rovný architektonický portál', short_description: 'Čistá pravoúhlá mlžná brána z AISI 316L. Reprezentativní vstup pro města, koupaliště, parky a komerční areály.', image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/17e1fc843_MlznabranaGATE70U.png' },
  { name: 'GATE70-V', tagline: 'Organický lomený oblouk', short_description: 'Výraznější architektonická silueta s jemnou mlhovou clonou. Vhodná tam, kde má ochlazení zároveň vytvářet vizuální dominantu.', image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6a116eb0b_mlnbranaGATE70U-mlzitkapromesta.png' },
  { name: 'LINEA CE70', tagline: 'Plynulý obloukový design', short_description: 'Elegantní obloukový systém z AISI 316L pro náměstí, bazény, aquaparky a moderní veřejný prostor.', image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/82914bed5_C-MlzitkoLINEA_CE70_couple1.png' },
  { name: 'GATE 60', tagline: 'Kompaktní mlžná brána', short_description: 'Praktické řešení pro vstupy, promenády, sportovní areály a eventy. Kompaktní rozměr, výrazný chladicí efekt.', image_url: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/e03a84d77_L-Mltko_GATE_60_3R-1.png' },
  { name: 'RAINBOW GATE', tagline: 'Interaktivní barevný oblouk', short_description: 'Půlkruhová mlžná brána s výrazným vizuálním charakterem. Ideální pro dětská mlhoviště, parky a zážitkové zóny.', image_url: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/7ee43ab21_generated_image.png' },
  { name: 'MARATON', tagline: 'Modulární mlžný tunel', short_description: 'Modulární průchozí systém pro velké návštěvnické zatížení, festivaly, sportovní akce a městské cooling zóny.', image_url: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/3a39f6017_generated_image.png' },
  { name: 'GATE CUSTOM', tagline: 'Zakázková mlžná brána', short_description: 'Tvar, výška, délka i technické řešení podle architektonického návrhu. Od konceptu a CAD podkladů po vlastní výrobu.', image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/2dcd39f66_MRKEV_rozkres1.png' }
];


export default function GatesSlider() {
  const scrollRef = useRef(null);
  const scrollBy = (amount) => scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' });

  return (
    <section className="bg-slate-950 py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10 lg:mb-12">
          <div>
            <p className="tracking-[.22em] uppercase text-cyan-300/70 mb-3 text-[10px] font-mono">Kolekce / Mlžné brány · 2026</p>
            <h2 className="font-heading font-light text-3xl lg:text-5xl text-white tracking-tight max-w-2xl">Vstupní portály, které ochladí prostor a vytvoří zážitek.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/45">Od kompaktní brány pro event až po monumentální zakázkový portál. Každý model vyrábíme z nerezové oceli a přizpůsobujeme konkrétnímu místu.</p>
          </div>
          <div className="hidden sm:flex gap-2">
            <button onClick={() => scrollBy(-420)} aria-label="Předchozí" className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all">
              <ChevronLeft size={15} />
            </button>
            <button onClick={() => scrollBy(420)} aria-label="Další" className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden mb-16" style={{ scrollbarWidth: 'none' }}>
          {GATES.map((gate, i) => <GateSlideCard key={gate.name} product={gate} index={i} />)}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {USE_CASES.map((uc, i) => {
            const Icon = uc.icon;
            return (
              <motion.div key={uc.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="rounded-2xl border border-white/10 p-5">
                <Icon size={20} className="mb-4 text-white/60" strokeWidth={1.6} />
                <h3 className="text-sm font-semibold text-white mb-1.5 [font-family:'Plus_Jakarta_Sans',_sans-serif]">{uc.title}</h3>
                <p className="text-xs leading-relaxed text-white/50">{uc.desc}</p>
              </motion.div>);
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {B2G_LINKS.map((link) =>
          <Link key={link.path} to={link.path} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/70 hover:border-white/40 hover:text-white transition-all">
              {link.label} <ArrowRight size={12} />
            </Link>
          )}
        </div>
      </div>
    </section>);

}
