import React from 'react';
import { motion } from 'framer-motion';
import { Droplet } from 'lucide-react';

export default function Logo({ size = 'md' }) {
  const iconSize = size === 'sm' ? 20 : 24;
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.8, ease: 'easeOut' }}
      className="inline-flex items-center gap-2">
      
      <Droplet size={iconSize} className="shrink-0 text-[#40a2d4] fill-[#40a2d4]/20" />
      <span className="font-heading text-lg font-semibold tracking-wide uppercase">
        mlžidla<span className="text-[#40a2d4] text-base normal-case px-0.5" style={{ letterSpacing: '0.06em' }}>.cz</span>
      </span>
    </motion.div>);

}