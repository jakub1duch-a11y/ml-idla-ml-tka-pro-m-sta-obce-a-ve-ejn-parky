import React from 'react';
import { motion } from 'framer-motion';

export default function Logo({ size = 'md' }) {
  const compact = size === 'sm';
  const iconSize = compact ? 'h-8 w-8' : 'h-11 w-11';
  const wordSize = compact ? 'text-xl' : 'text-3xl';
  return <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="inline-flex items-center gap-2.5 text-primary">
    <motion.svg viewBox="0 0 48 48" aria-hidden="true" className={`${iconSize} shrink-0`} animate={{ y: [0, -1, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}>
      <path d="M8 36V22c0-7.7 6.3-14 14-14s14 6.3 14 14v14" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M19 37c0-4.5 2.2-8.1 5-12 2.8 3.9 5 7.5 5 12a5 5 0 0 1-10 0Z" fill="currentColor" className="text-accent" />
      <circle cx="24" cy="37" r="1.5" fill="white" />
    </motion.svg>
    <span className={`${wordSize} font-heading font-extrabold leading-none tracking-[0.06em]`}>MLŽIDLA</span>
  </motion.div>;
}