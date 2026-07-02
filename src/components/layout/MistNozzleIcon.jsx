import React from 'react';
import { motion } from 'framer-motion';

// Small animated misting-nozzle icon: sprays soft fading mist puffs upward
export default function MistNozzleIcon({ className = '', color = '#0f172a', accent = '#40a2d4' }) {
  const puffs = [0, 1, 2];
  return (
    <div className={`relative flex items-end justify-center shrink-0 ${className}`} style={{ width: 22, height: 26 }}>
      {puffs.map((i) =>
      <motion.span
        key={i}
        className="absolute rounded-full"
        style={{ background: accent, width: 4 + i, height: 4 + i, bottom: 13 }}
        initial={{ opacity: 0, x: '-50%', y: 0, scale: 0.6 }}
        animate={{
          opacity: [0, 0.65, 0],
          y: [0, -14 - i * 3],
          x: [`-50%`, `${-50 + (i - 1) * 16}%`],
          scale: [0.6, 1, 1.25]
        }}
        transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }} />

      )}
      <svg width="16" height="18" viewBox="0 0 16 18" fill="none" className="relative z-10 hidden">
        <rect x="6" y="0" width="4" height="6" rx="1" fill={accent} />
        <rect x="1" y="6.2" width="14" height="2.2" rx="1.1" fill={color} />
        <path d="M2.5 8.4 L13.5 8.4 L11 17 C11 17 9.3 18 8 18 C6.7 18 5 17 5 17 L2.5 8.4Z" fill={color} fillOpacity="0.92" />
      </svg>
    </div>);

}