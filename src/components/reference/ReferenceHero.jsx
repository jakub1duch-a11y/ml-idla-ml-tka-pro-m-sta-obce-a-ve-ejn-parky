import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';
import MistAmbientBackground from '@/components/reference/MistAmbientBackground';
import WaterCostWidget from '@/components/reference/WaterCostWidget';

export default function ReferenceHero() {
  return (
    <div className="relative overflow-hidden max-w-7xl mx-auto px-6 lg:px-8 pb-16">
      <MistAmbientBackground />
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* Left — text + CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Reference</p>
          <h1 className="font-heading font-light text-4xl lg:text-6xl text-slate-900 tracking-tight mb-5 leading-[1.05]">
            Osvěžující mlžné sochy<br />pro moderní prostory
          </h1>
          <p className="text-slate-500 max-w-lg text-lg font-light mb-8">
            Luxusní design z nerezové oceli AISI 316L, jemná mlhová clona a ochlazení okolního vzduchu až o 9 °C — bez kapek na zemi, bez hluku.
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Link to="/poptavka" className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">
              Nezávazná poptávka <ArrowRight size={15} />
            </Link>
            <a href="#realizace" className="inline-flex items-center gap-2 px-7 py-3.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-full hover:bg-slate-50 transition-all">
              Sledovat realizace
            </a>
          </div>
          <WaterCostWidget />
        </motion.div>

        {/* Right — framed video */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="relative">
          <span className="absolute -top-3 left-6 z-10 inline-flex items-center gap-1.5 text-[10px] font-mono text-white tracking-widest uppercase px-3 py-1.5 bg-slate-900 rounded-full shadow">
            <PlayCircle size={11} /> Živá ukázka
          </span>
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-[4/5] lg:aspect-[4/5]">
            <video
              src="https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/30dac59df_Mlzitkaostev-zivaukazkamlznystrom.mov"
              autoPlay muted loop playsInline
              className="w-full h-full object-cover" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}