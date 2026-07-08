import React from 'react';
import { motion } from 'framer-motion';

const BLOBS = [
  { size: 380, top: '-10%', left: '5%', duration: 22, delay: 0 },
  { size: 320, top: '40%', left: '70%', duration: 26, delay: 2 },
  { size: 260, top: '65%', left: '15%', duration: 20, delay: 4 },
];

export default function MistFogEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10 blur-3xl"
          style={{ width: b.size, height: b.size, top: b.top, left: b.left }}
          animate={{ x: [0, 40, -20, 0], y: [0, -20, 20, 0], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}