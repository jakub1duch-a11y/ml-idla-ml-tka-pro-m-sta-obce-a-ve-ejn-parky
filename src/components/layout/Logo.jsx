import React from 'react';
import { motion } from 'framer-motion';

export default function Logo({ size = 'md' }) {
  const compact = size === 'sm';
  const iconSize = compact ? 'h-9 w-9' : 'h-12 w-12';
  const wordSize = compact ? 'text-xl' : 'text-3xl';
  return <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="inline-flex items-center gap-2.5 text-primary">
    <motion.svg viewBox="0 0 48 48" aria-hidden="true" className={`${iconSize} shrink-0 drop-shadow-[0_3px_7px_rgba(34,211,238,.32)]`} animate={{ y: [0, -1, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}>
      <defs><linearGradient id="brand-gradient" x1="8" y1="8" x2="38" y2="40"><stop stopColor="#0d2d38" /><stop offset="0.52" stopColor="#0e5b67" /><stop offset="1" stopColor="#61d5e5" /></linearGradient></defs>
      <path d="M8 36V22c0-7.7 6.3-14 14-14s14 6.3 14 14v14" fill="none" stroke="url(#brand-gradient)" strokeWidth="5" strokeLinecap="round" />
      <path d="M19 37c0-4.5 2.2-8.1 5-12 2.8 3.9 5 7.5 5 12a5 5 0 0 1-10 0Z" fill="url(#brand-gradient)" />
      <circle cx="24" cy="37" r="1.5" fill="white" />
    </motion.svg>
    <span className={`${wordSize} bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text font-heading font-extrabold leading-none tracking-[0.06em] text-transparent`}>MLŽIDLA</span>
  </motion.div>;
}