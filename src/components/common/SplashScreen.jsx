import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MistNozzleIcon from '@/components/layout/MistNozzleIcon';

export default function SplashScreen({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-ink flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="flex flex-col items-center gap-4"
          >
            <MistNozzleIcon className="scale-[2.4]" color="#ffffff" accent="#40a2d4" />
            <p className="text-white text-2xl tracking-[0.2em] uppercase" style={{ fontFamily: "'Urbanist', sans-serif", fontWeight: 600 }}>
              mlžidla<span style={{ color: '#40a2d4' }}>.cz</span>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}