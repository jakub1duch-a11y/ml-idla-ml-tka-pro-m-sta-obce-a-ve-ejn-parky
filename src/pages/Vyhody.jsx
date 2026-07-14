import React, { useEffect } from 'react';
import { Building2, Leaf, Zap, ShieldCheck, Wind, Sparkles, HeartPulse, Thermometer } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const BENEFITS = [
  { icon: Building2, title: 'Přínos pro města', text: 'Ochlazení veřejných prostranství snižuje efekt tepelného ostrova, zvyšuje komfort obyvatel a atraktivitu veřejného prostoru.' },
  { icon: Zap, title: 'Úspora energie', text: 'Ve srovnání s klimatizací mají mlžné systémy výrazně nižší spotřebu energie při srovnatelném pocitovém ochlazení venkovních prostor.' },
  { icon: Leaf, title: 'Ekologický dopad', text: 'Nízká spotřeba vody, žádné chemikálie a minimální energetická náročnost dělají z mlžení šetrné řešení pro městské prostředí.' },
  { icon: ShieldCheck, title: 'Odolnost materiálů', text: 'Nerezová ocel AISI 316L odolává korozi, povětrnostním vlivům i UV záření — systémy tak vydrží desítky let provozu.' },
];

const HEALTH_POINTS = [
  { icon: Wind, title: 'Snížení prašnosti', text: 'Jemné vodní kapičky vážou prachové částice ve vzduchu a urychlují jejich usazení, čímž snižují množství prachu v ovzduší veřejných prostor.' },
  { icon: Sparkles, title: 'Zachycení pylu', text: 'Mlha pomáhá vázat pylová zrna a alergeny, což může přinést úlevu zejména v období vysoké pylové zátěže.' },
  { icon: HeartPulse, title: 'Zlepšení kvality ovzduší', text: 'Kombinace ochlazení a vázání částic přispívá k příjemnějšímu a čistšímu vzduchu v hustě osídlených městských oblastech.' },
];

const STATS = [
  { value: 'až −9 °C', label: 'Ochlazení vzduchu' },
  { value: '95 %', label: 'Úspora oproti klimatizaci' },
  { value: '10–50 μm', label: 'Velikost kapky' },
  { value: 'AISI 316L', label: 'Nerezový materiál' },
];

export default function Vyhody() {
  useEffect(() => {
    setSEO({
      title: 'Přínosy mlžítek — výhody, úspora a ochrana zdraví',
      description: 'Přehled přínosů mlžných systémů HolmTec: přínos pro města, úspora energie, ekologický dopad, odolnost materiálů a ochrana zdraví — snížení prašnosti a pylu.',
      keywords: 'přínosy mlžítek, výhody mlžení, benefity mlžný systém, úspora energie chlazení, ochrana zdraví mlžení',
      canonicalPath: '/vyhody',
    });
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* HERO */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 pt-32 pb-14 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-3">Proč HolmTec</p>
          <h1 className="font-heading font-light text-4xl lg:text-6xl text-slate-900 tracking-tight mb-5">Přínosy mlžítek</h1>
          <p className="text-slate-500 text-lg leading-relaxed max-w-2xl mx-auto font-light">
            Mlžení není jen o estetickém zážitku — přináší měřitelné přínosy pro města, životní prostředí, lidské zdraví i dlouhodobou návratnost investice.
          </p>
        </motion.div>
      </div>

      {/* STATS STRIP — dynamic loading */}
      <div className="bg-slate-50 border-y border-slate-200 py-8">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <p className="font-heading font-light text-2xl text-slate-900 mb-1">{s.value}</p>
                <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* KEY BENEFITS */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 pt-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <h2 className="font-heading font-light text-2xl lg:text-3xl text-slate-900 tracking-tight">Přínosy pro provoz a životní prostředí</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BENEFITS.map((b, i) => (
            <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4">
                <b.icon size={20} className="text-slate-700" />
              </div>
              <h3 className="text-slate-900 font-medium text-lg mb-2">{b.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{b.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* HEALTH & ENVIRONMENT — merged from Ochrana zdraví */}
      <div className="bg-slate-950 mt-20 py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <p className="text-xs font-mono text-cyan-300/70 tracking-widest uppercase mb-2">Zdraví &amp; prostředí</p>
            <h2 className="font-heading font-light text-3xl lg:text-4xl text-white tracking-tight mb-4">Ochrana zdraví</h2>
            <p className="text-white/50 leading-relaxed font-light max-w-2xl">
              Mlžení má vliv nejen na teplotu, ale i na kvalitu vzduchu, kterým dýcháme. Jemné vodní kapičky pomáhají
              vázat prachové částice a alergeny přímo ve vzduchu veřejných prostor.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {HEALTH_POINTS.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <p.icon size={20} className="text-cyan-300" />
                </div>
                <h3 className="text-white font-medium text-lg mb-2">{p.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{p.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-8 flex items-center gap-3 p-5 rounded-2xl bg-white/5 border border-white/10">
            <Thermometer size={18} className="text-cyan-300 shrink-0" />
            <p className="text-sm text-white/60 font-light">Ochlazení a čistší vzduch dohromady zlepšují komfort návštěvníků i zaměstnanců ve veřejném prostoru.</p>
          </motion.div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link to="/poptavka" className="btn-metallic-mist px-8 py-4 text-sm font-bold">
          Nezávazná poptávka <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}