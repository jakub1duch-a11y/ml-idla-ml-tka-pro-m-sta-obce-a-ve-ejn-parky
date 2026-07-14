import React from 'react';
import { motion } from 'framer-motion';
import DarkProcessFlow from '@/components/home/darkglass/DarkProcessFlow';
import DarkBenefitsGrid from '@/components/home/darkglass/DarkBenefitsGrid';

export default function DarkHowItWorks() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
      <h2 className="font-heading font-bold text-2xl text-white uppercase tracking-tight mb-5">Jak to funguje</h2>
      <DarkProcessFlow />
      <h3 className="font-heading font-bold text-lg text-white uppercase tracking-tight mt-8 mb-4">Výhody systémů</h3>
      <DarkBenefitsGrid />
    </motion.div>
  );
}