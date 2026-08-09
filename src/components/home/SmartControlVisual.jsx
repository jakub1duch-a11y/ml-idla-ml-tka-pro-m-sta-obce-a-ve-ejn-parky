import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Wifi } from 'lucide-react';

export default function SmartControlVisual() {
  return <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative mx-auto max-w-xl"><div className="overflow-hidden rounded-[2rem] border border-border bg-primary shadow-2xl"><img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9cf838258_MlzicisprchaaSMARTaplikace.png" alt="Ruka ovládající mlžítko v chytré domácí aplikaci" className="w-full object-cover aspect-[4/3]" /></div><motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-white/20 px-4 py-3 shadow-xl backdrop-blur bg-[hsl(var(--background))] text-[hsl(var(--popover))]"><Wifi size={15} className="text-accent ml-2" /></motion.div></motion.div>;
}