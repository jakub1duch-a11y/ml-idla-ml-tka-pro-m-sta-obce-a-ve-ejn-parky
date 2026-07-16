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
import ConceptToRealitySection from '@/components/home/ConceptToRealitySection';

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
      description: 'Jak fungují mlžné systémy HolmTec: princip evaporace, mikrokapky a proč je mlžení extrémně úsporné.',
      keywords: 'technologie mlžení, jak funguje mlžný systém, mikrokapky, evaporační chlazení',
      canonicalPath: '/technologie'
    });
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* ── HERO IMAGE ── */}
      <div className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <img
          src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e9a099936_generated_image.png"
          alt="Mlžná socha v městském parku"
          className="w-full h-full object-cover" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-5xl mx-auto px-6 lg:px-8 pb-12">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-xs font-mono text-white/70 tracking-widest uppercase mb-3">
            Jak to funguje
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading font-light text-4xl lg:text-6xl text-white tracking-tight">
            Technologie mlžení
          </motion.h1>
        </div>
      </div>

      {/* ── SNIŽUJEME POCITOVOU TEPLOTU ── */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 pt-16 pb-14">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight leading-snug">
            Snižujeme pocitovou teplotu okolí<br />o <span className="font-medium">5 až 10 °C</span>.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {BENEFITS.map((b, i) =>
          <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
          className="bg-slate-50 border border-slate-200 rounded-2xl p-7 text-center">
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto mb-4">
                <b.icon size={20} className="text-slate-700" />
              </div>
              <h3 className="text-slate-900 font-medium text-base mb-2">{b.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{b.text}</p>
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
              <h3 className="text-slate-900 font-medium text-base mb-2">{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{s.text}</p>
            </motion.div>
          )}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="bg-slate-900 rounded-2xl p-8 text-center">
          <p className="text-white/60 text-xs font-mono tracking-widest uppercase mb-2">Extrémně úsporný provoz</p>
          <p className="text-white text-lg font-light">
            Spotřeba vody se pohybuje pouze v jednotkách litrů za hodinu.
          </p>
        </motion.div>
      </div>

      <AnatomySection />
      <SmartManagementSection />
      <FormFunctionSection />
      <IntegrationSection />
      <ProcessSection />
      <InstallationComparisonSection />
      <ConceptToRealitySection />

      <div className="text-center mt-14 hidden">
        <Link to="/poptavka" className="btn-metallic-mist px-8 py-3 text-sm font-bold">
          Nezávazná poptávka <ArrowRight size={16} />
        </Link>
      </div>
    </div>);

}