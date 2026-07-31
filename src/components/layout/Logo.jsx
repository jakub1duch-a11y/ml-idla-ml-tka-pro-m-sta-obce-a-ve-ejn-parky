import React from 'react';
import { motion } from 'framer-motion';

const ICON_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/a7bf1f951_favicon.png';

export default function Logo({ size = 'md' }) {
  const compact = size === 'sm';
  return <motion.div initial={{ opacity: 0, filter: 'blur(8px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ duration: 0.7 }} className="inline-flex items-center gap-2.5 text-primary">
    <img src={ICON_URL} alt="" className={`${compact ? 'h-7 w-7' : 'h-10 w-10'} object-contain`} />
    <span className={`${compact ? 'text-xl' : 'text-3xl'} font-heading font-extrabold leading-none tracking-[0.04em]`}>MLŽIDLA</span>
  </motion.div>;
}