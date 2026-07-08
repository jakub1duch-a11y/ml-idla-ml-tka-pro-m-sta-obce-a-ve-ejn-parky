import React from 'react';
import { motion } from 'framer-motion';

const LOGO_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ea354774f_generated_image.png';

export default function Logo({ dark = false, size = 'md' }) {
  const iconSize = size === 'sm' ? 22 : 28;
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 1.8, ease: 'easeOut' }}
      className="flex items-center gap-2.5"
    >
      <img src={LOGO_URL} alt="Mlžidla.cz" width={iconSize} height={iconSize} className="shrink-0" />
      <div className="flex flex-col leading-none">
        <span
          style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 500, letterSpacing: '0.05em' }}
          className={`text-2xl uppercase transition-colors duration-500 ${dark ? 'text-slate-900' : 'text-white'}`}
        >
          mlžidla<span className="text-[#40a2d4] text-xl normal-case px-0.5" style={{ letterSpacing: '0.06em' }}>.cz</span>
        </span>
        <span className={`text-[9px] font-mono tracking-[0.15em] uppercase transition-colors duration-500 ${dark ? 'text-slate-400' : 'text-white/60'}`}>
          Mlžítka a mlžné brány · HolmTec
        </span>
      </div>
    </motion.div>
  );
}