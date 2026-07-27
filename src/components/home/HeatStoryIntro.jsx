import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Flame, ThermometerSun } from 'lucide-react';

export default function HeatStoryIntro() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const heatOpacity = useTransform(scrollYProgress, [0, 0.45, 1], [0.35, 1, 0.08]);
  const coolOpacity = useTransform(scrollYProgress, [0.55, 1], [0, 0.72]);
  const temperature = useTransform(scrollYProgress, [0.35, 1], ['47 °C', '29 °C']);
  return null;





}