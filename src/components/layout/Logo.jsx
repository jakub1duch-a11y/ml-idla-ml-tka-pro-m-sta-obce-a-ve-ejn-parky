import React from 'react';
import { motion } from 'framer-motion';

const LOGO_URL = '/media/logo/mlzidla.svg';

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