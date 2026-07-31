import React from 'react';
import { motion } from 'framer-motion';

const MIST_LAYERS = [
  { className: 'top-[24%] h-24 w-[72%] opacity-45 blur-2xl', duration: 9, delay: 0 },
  { className: 'top-[36%] h-32 w-[88%] opacity-30 blur-3xl', duration: 12, delay: 1.8 },
  { className: 'top-[48%] h-20 w-[62%] opacity-25 blur-2xl', duration: 10.5, delay: 3.4 },
];

export default function WindMistOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {MIST_LAYERS.map((layer, index) => (
        <motion.span
          key={index}
          initial={{ x: '-85%', opacity: 0 }}
          animate={{ x: ['-85%', '18%', '115%'], y: [0, -8, 4], opacity: [0, 0.7, 0] }}
          transition={{ duration: layer.duration, delay: layer.delay, repeat: Infinity, ease: 'linear' }}
          className={`absolute -left-1/3 rounded-full bg-gradient-to-r from-transparent via-primary-foreground to-transparent ${layer.className}`}
        />
      ))}
    </div>
  );
}