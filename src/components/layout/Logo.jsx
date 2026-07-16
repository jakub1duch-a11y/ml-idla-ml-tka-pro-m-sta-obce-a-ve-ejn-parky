import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Logo({ size = 'md' }) {
  const compact = size === 'sm';
  return (
    <motion.div initial={{ opacity: 0, filter: 'blur(10px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }} className="inline-flex h-full items-center gap-2 text-white whitespace-nowrap leading-none">
      <Link to="/" aria-label="Mlžidla.cz" className={`${compact ? "" : ""} tracking-tight font-semibold font-heading text-3xl`}><span className="text-cyan">mlž</span>idla</Link>
      <span className="text-white/25" aria-hidden="true">|</span>
      <a href="https://hometec.cz" target="_blank" rel="noopener noreferrer" aria-label="dceřiná společnost HolmTec s.r.o." title="dceřiná společnost HolmTec s.r.o." className="text-[8px] font-semibold tracking-[0.16em] text-white/55 hover:text-white transition-colors">HOLMTEC</a>
    </motion.div>);

}