import React from 'react';
import { motion } from 'framer-motion';

const BLOBS = [
  { size: 460, top: '-18%', left: '-8%', duration: 24, delay: 0, color: 'rgba(148,197,219,0.35)' },
  { size: 360, top: '10%', left: '60%', duration: 30, delay: 3, color: 'rgba(203,213,225,0.45)' },
  { size: 300, top: '55%', left: '25%', duration: 26, delay: 5, color: 'rgba(226,232,240,0.5)' },
];

const WISPS = [
  { top: '18%', width: '70%', duration: 18, delay: 0 },
  { top: '48%', width: '55%', duration: 22, delay: 4 },
  { top: '75%', width: '65%', duration: 20, delay: 8 },
];

export default function ProductHeroMist() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Soft drifting fog blobs */}
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{ width: b.size, height: b.size, top: b.top, left: b.left, background: b.color }}
          animate={{ x: [0, 50, -30, 0], y: [0, -30, 25, 0], scale: [1, 1.08, 0.96, 1] }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Thin horizontal mist streaks for a dynamic drifting feel */}
      {WISPS.map((w, i) => (
        <motion.div
          key={`w-${i}`}
          className="absolute left-0 h-16 rounded-full blur-2xl bg-gradient-to-r from-transparent via-white/70 to-transparent"
          style={{ top: w.top, width: w.width }}
          animate={{ x: ['-20%', '20%', '-20%'], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: w.duration, delay: w.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Subtle top fade to keep content crisp */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/60" />
    </div>
  );
}