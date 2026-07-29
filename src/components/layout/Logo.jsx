import React from 'react';
import { motion } from 'framer-motion';
const LOGO_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/f1140a8ea_gemini-svg6.svg';

export default function Logo({ size = 'md' }) {
  const iconSize = size === 'sm' ? 26 : 34;
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.8, ease: 'easeOut' }}
      className="inline-flex items-center gap-2">
      
      <img src={LOGO_URL} alt="Mlžidla.cz" width={iconSize} height={iconSize} className="shrink-0" style={{ height: iconSize, width: 'auto' }} />
      <span className="font-heading text-lg font-semibold tracking-wide uppercase">
        mlžidla<span className="text-[#40a2d4] text-base normal-case px-0.5" style={{ letterSpacing: '0.06em' }}>.cz</span>
      </span>
    </motion.div>);

}