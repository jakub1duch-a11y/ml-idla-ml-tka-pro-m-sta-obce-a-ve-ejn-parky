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
{
  name: 'GATE70',
  tagline: 'Vstupní mlžná brána',
  short_description: 'Designová mlžná brána z nerezové oceli AISI 316L — ochlazení až −9 °C bez kapek na zemi, smart Wi-Fi řízení.',
  image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/17e1fc843_MlznabranaGATE70U.png'
},
{
  name: 'LINEA CE70',
  tagline: 'Obloukový mlžný systém',
  short_description: 'Zakřivený obloukový design z nerezi AISI 316L — ikonická architektura pro náměstí, bazény a veřejné prostory.',
  image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/82914bed5_C-MlzitkoLINEA_CE70_couple1.png'
}];


export default function GatesSlider() {
  const scrollRef = useRef(null);
  const scrollBy = (amount) => scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' });

  return (
    <section className="relative py-20 lg:py-24 bg-slate-950 overflow-hidden hidden">
      <div className="absolute -top-20 left-1/4 w-96 h-96 rounded-full bg-sky-500/10 blur-3xl animate-mist-drift" style={{ animationDuration: '14s' }} />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-slate-400/10 blur-3xl animate-mist-drift" style={{ animationDuration: '18s' }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 lg:mb-10">
          <div>
            <p className="text-[11px] font-mono tracking-widest uppercase text-white/40 mb-2">Mlžné brány a portály</p>
            <h2 className="font-heading font-light text-3xl lg:text-4xl text-white tracking-tight">
              Vstup skrze mlhu.<br /><span className="text-white/40 italic font-extralight">Nezapomenutelný moment.</span>
            </h2>
          </div>
          <div className="hidden sm:flex gap-2">
            <button onClick={() => scrollBy(-400)} aria-label="Předchozí"
            className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all">
              <ChevronLeft size={15} />
            </button>
            <button onClick={() => scrollBy(400)} aria-label="Další"
            className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all">
              <ChevronRight size={15} />
            </button>
          </div>
        </motion.div>

        <div ref={scrollRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
          {GATES.map((gate, i) =>
          <motion.div key={gate.name} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <GateSlideCard product={gate} index={i} />
            </motion.div>
          )}
        </div>

        <Link to="/gate70" className="inline-flex items-center gap-2 mt-8 text-sm text-white/60 font-light hover:text-white hover:gap-3 transition-all">
          Detail mlžné brány GATE70 <ArrowRight size={14} />
        </Link>

        {/* Využití ve městských projektech */}
        <div className="mt-16 lg:mt-20 pt-12 border-t border-white/10">
          <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-[11px] font-mono tracking-widest uppercase text-white/40 mb-6">
            Využití v městských a veřejných projektech
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {USE_CASES.map((u, i) =>
            <motion.div key={u.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
            className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 transition-all">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                  <u.icon size={16} className="text-white/80" />
                </div>
                <h4 className="text-sm text-white font-medium mb-1.5">{u.title}</h4>
                <p className="text-xs text-white/50 leading-relaxed font-light">{u.desc}</p>
              </motion.div>
            )}
          </div>

          {/* B2G kategorie */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-white/40 font-mono tracking-widest uppercase mr-1">Kategorie využití:</span>
            {B2G_LINKS.map((l) =>
            <Link key={l.path} to={l.path}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/15 text-white/70 text-xs font-medium hover:text-white hover:border-white/40 transition-all">
                {l.label} <ArrowRight size={11} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>);

}