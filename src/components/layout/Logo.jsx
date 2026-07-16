import React from 'react';
import { motion } from 'framer-motion';

export default function Logo({ size = 'md' }) {
  const compact = size === 'sm';
  return (
    <motion.div initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }} className="inline-flex items-center gap-2 text-white whitespace-nowrap leading-none">
      <span className={`${compact ? 'text-base' : 'text-lg'} font-heading font-semibold tracking-tight`}><span className="text-cyan">mlž</span>idla</span>
      <span className="text-white/25">|</span><span className="text-[7px] font-semibold tracking-[0.16em] text-white/55">HOLMTEC</span>
    </motion.div>
  );
}