import React from 'react';
import { motion } from 'framer-motion';

const IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/094418f68_generated_image.png';

export default function PrislusenstviHero() {
  return (
    <div className="relative w-full overflow-hidden bg-slate-900 h-[70vh] min-h-[480px]">
      <img src={IMAGE} alt="Mlžné příslušenství a SMART moduly" className="absolute inset-0 w-full h-full object-cover" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="absolute z-10 flex flex-col justify-end px-8 lg:px-16 pb-12 inset-0">
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="font-heading font-extralight text-3xl lg:text-5xl text-white max-w-2xl leading-tight tracking-tight">
          Mlžné příslušenství<br />a moduly.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="text-white/60 text-sm lg:text-base max-w-xl mt-4 leading-relaxed">
          Trysky, čerpadla, filtry a Smart moduly pro řízení a automatizaci. Náhradní díly a rozšíření pro každý mlžný systém HolmTec.
        </motion.p>
      </div>
    </div>
  );
}