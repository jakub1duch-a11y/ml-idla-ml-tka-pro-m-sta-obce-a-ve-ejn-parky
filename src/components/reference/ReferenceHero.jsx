import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle } from 'lucide-react';
import MistAmbientBackground from '@/components/reference/MistAmbientBackground';

export default function ReferenceHero() {
  return (
    <div className="overflow-hidden max-w-1xl lg:px-8 relative mx-auto py-20">
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
            <Link to="/video-ukazky" className="inline-flex items-center gap-2 px-7 py-3.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-full hover:bg-slate-50 transition-all">
              Video ukázky mlžení
            </Link>
          </div>
        </motion.div>

        {/* Right — framed video */}
        









        
      </div>
    </div>);

}