import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function MotionHeading({ as = 'h2', children, ...props }) {
  const reduced = useReducedMotion();
  const Tag = as === 'h3' ? motion.h3 : motion.h2;
  return <Tag {...props} initial={reduced ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}>{children}</Tag>;
}
