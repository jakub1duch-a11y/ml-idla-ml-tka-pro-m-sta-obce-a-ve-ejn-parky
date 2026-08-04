import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Thermometer, Wind, Eye, Droplet, Flame, Gauge, Sparkles, ArrowRight } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import AnatomySection from '@/components/technologie/AnatomySection';
import SmartManagementSection from '@/components/technologie/SmartManagementSection';
import FormFunctionSection from '@/components/technologie/FormFunctionSection';
import IntegrationSection from '@/components/technologie/IntegrationSection';
import ProcessSection from '@/components/technologie/ProcessSection';
import InstallationComparisonSection from '@/components/technologie/InstallationComparisonSection';

const BENEFITS = [
{ icon: Thermometer, title: 'Ochlazení', text: 'Zlepšení mikroklimatu přirozeným odpařováním.' },
{ icon: Wind, title: 'Čistší vzduch', text: 'Významné snížení prašnosti a pylových částic.' },
{ icon: Eye, title: 'Vizuální atraktivita', text: 'Zvýšení turistického potenciálu a zlepšení nálady bez narušení rázu okolí.' }];


const STEPS = [
{ icon: Droplet, num: '1', title: 'Mikrokapky', text: 'Integrované mikrotrysky tvoří kapky o velikosti 10–50 μm.' },
{ icon: Flame, num: '2', title: 'Absorpce tepla', text: 'Mlha okamžitě pohlcuje tepelnou energii ze vzduchu.' },
{ icon: Gauge, num: '3', title: 'Rychlý odpar', text: 'Voda se odpaří dříve, než dopadne na zem — nevznikají kaluže.' },
{ icon: Sparkles, num: '4', title: 'Sekundární efekt', text: 'Vlhká plocha bezprostředně pod tryskou dále ochlazuje okolní vzduch.' }];


export default function Technologie() {
  useEffect(() => {
    setSEO({
      title: 'Technologie mlžení',
      description: 'Jak fungují mlžné systémy HolmTec: princip evaporace, mikrokapky a úsporný provoz.',
      keywords: 'technologie mlžení, jak funguje mlžný systém, mikrokapky, evaporační chlazení',
      canonicalPath: '/technologie'
    });
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ── HERO IMAGE ── */}
      <div className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6a220ebf9_Reference-mstoPolna03.png"

        alt="Mlžná socha v městském parku"
        className="w-full h-full object-cover" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/45 to-primary/10" />
        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-6 lg:px-8 pb-12">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-xs font-mono text-white/70 tracking-widest uppercase mb-3">
            Technologie MLŽIDLA®
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-4xl lg:text-6xl text-white tracking-tight">
            Chladíme architekturu
          </motion.h1>
        </div>
      </div>

      {/* ── SNIŽUJEME POCITOVOU TEPLOTU ── */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 pt-16 pb-14">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight leading-snug">
            Snižujeme pocitovou teplotu okolí<br />o <span className="[font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-bold">5 až 10 °C</span>.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {BENEFITS.map((b, i) =>
          <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
          className="bg-card border border-border rounded-2xl p-7 text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto mb-4">
                <b.icon size={20} className="text-slate-700" />
              </div>
              <h3 className="text-slate-900 mb-2 [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-bold text-2xl">{b.title}</h3>
              <p className="text-slate-500 leading-relaxed text-base [font-family:'Inter',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif]">{b.text}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── TECHNICKÝ PROCES ── */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-14 border-t border-slate-100">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 max-w-2xl">
          <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Princip mlžení</p>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight">Od mikrokapky k ochlazení</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {STEPS.map((s, i) =>
          <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
          className="relative bg-white border border-slate-200 rounded-2xl p-6">
              <span className="absolute top-4 right-5 text-3xl font-heading font-light text-slate-100">{s.num}</span>
              <div className="w-11 h-11 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
                <s.icon size={19} className="text-slate-700" />
              </div>
              <h3 className="text-slate-900 mb-2 text-2xl [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-bold">{s.title}</h3>
              <p className="text-slate-500 leading-relaxed text-base [font-family:'Inter',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif]">{s.text}</p>
            </motion.div>
          )}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-primary rounded-2xl p-8 text-center border border-secondary/30">
          <p className="text-white/60 font-mono tracking-widest uppercase mb-2 text-xl">ÚSPORNÝ PROVOZ</p>
          <p className="text-white font-light text-lg">Spotřeba vody se pohybuje pouze v jednotkách litrů za hodinu.

          </p>
        </motion.div>
      </div>

      <AnatomySection />
      <SmartManagementSection />
      <FormFunctionSection />
      <IntegrationSection />
      <ProcessSection />
      <InstallationComparisonSection />

      <div className="text-center mt-14">
        <Link to="/poptavka" className="btn-metallic-mist px-8 py-3 text-sm font-bold">
          Popsat projekt <ArrowRight size={16} />
        </Link>
      </div>
    </div>);

}