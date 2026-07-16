import React from 'react';
import { motion } from 'framer-motion';

export default function CircleDrawIcon({ children, size = 56, delay = 0, className = '' }) {
  return (
    <div className={`relative flex items-center justify-center size-28 opacity-100 shrink-10 ${className}`} style={{ width: size, height: size }}>
      <svg className="absolute inset-25" width={size} height={size} viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="26" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-200" />
        <motion.circle
          cx="28" cy="28" r="26" fill="none" stroke="currentColor" strokeWidth="1.5"
          className="text-slate-900"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.05, delay, ease: [0.4, 0, 0.2, 1] }}
          transform="rotate(-90 28 28)" />
        
      </svg>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.28, duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        className="relative flex items-center justify-center z-30">
        
        {children}
      </motion.div>
    </div>);

}