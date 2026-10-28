import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BrandLoadingContent from '@/components/common/BrandLoadingContent';

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
            <BrandLoadingContent />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}