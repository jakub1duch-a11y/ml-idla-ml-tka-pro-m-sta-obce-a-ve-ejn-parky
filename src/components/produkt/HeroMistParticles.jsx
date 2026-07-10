import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// Simulates fine rising water mist droplets across the hero background
export default function HeroMistParticles() {
  const particles = useMemo(() => Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 3 + Math.random() * 6,
    duration: 6 + Math.random() * 6,
    delay: Math.random() * 6,
    drift: (Math.random() - 0.5) * 40
  })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) =>
      <motion.span key={p.id}
        className="absolute bottom-0 rounded-full bg-white/50 blur-[2px]"
        style={{ left: `${p.left}%`, width: p.size, height: p.size }}
        animate={{ y: ['0%', '-110%'], x: [0, p.drift], opacity: [0, 0.7, 0] }}
        transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeOut' }} />
      )}
    </div>);

}