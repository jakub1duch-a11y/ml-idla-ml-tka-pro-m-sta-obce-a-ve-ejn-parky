import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const BG_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/b1ef284f1_generated_image.png';

export default function ReferenceHero() {
  return (
    <div className="px-6 lg:px-8 py-8 lg:py-10">
      <div className="relative mx-auto max-w-7xl rounded-3xl overflow-hidden min-h-[620px] flex items-center justify-center text-center">
        <div className="absolute inset-0">
          <img src={BG_IMAGE} alt="Mlžný oblak nad vodní hladinou" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/80" />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative px-6 py-16 max-w-3xl mx-auto">
          <p className="text-sm font-medium tracking-wide text-slate-300 mb-4">Reference</p>
          <h1 className="font-heading font-bold text-4xl lg:text-5xl text-white tracking-tight mb-6 leading-[1.15]">
            Osvěžující mlžné sochy<br />pro moderní prostory
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto text-base lg:text-lg font-normal mb-10 leading-relaxed">
            Luxusní design z nerezové oceli AISI 316L, jemná <span className="font-semibold text-slate-100">mlhová clona a ochlazení okolního vzduchu</span> až o 9 °C — bez kapek na zemi, bez hluku.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/poptavka" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium rounded-full hover:bg-white/20 transition-all">
              Nezávazná poptávka <ArrowRight size={15} />
            </Link>
            <a href="#realizace" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium rounded-full hover:bg-white/20 transition-all">
              Sledovat realizace
            </a>
            <Link to="/video-ukazky" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium rounded-full hover:bg-white/20 transition-all">
              Video ukázky mlžení
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}