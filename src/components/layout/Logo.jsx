import React from 'react';
import { motion } from 'framer-motion';

const LOGO_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/4b2ec32a3_mlzidla_logo_bez_pozadi.png';

export default function Logo({ size = 'md' }) {
  const width = size === 'sm' ? 124 : 168;
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.8, ease: 'easeOut' }}
      className="inline-flex items-center gap-2">
      <img src={LOGO_URL} alt="MLŽIDLA" width={width} className="block h-auto w-auto" style={{ width }} />
    </motion.div>);

}