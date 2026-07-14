import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

export default function LiveDemoSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);
  const y = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);

  return (
    <div ref={ref} className="relative h-[80vh] min-h-[520px] overflow-hidden">
      <motion.video
        style={{ scale, y }}
        src="https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/5a2af0f9e_Efektmlhy-mlznabrana-zivynahled.mov"
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
      <div className="relative h-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col justify-end pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/25 text-white text-xs font-mono tracking-widest uppercase rounded-full mb-5">
            <Play size={11} /> Živá ukázka
          </span>
          <h2 className="font-heading font-light text-4xl lg:text-5xl text-white tracking-tight max-w-xl mb-4">
            Podívejte se, jak mlžítko ožívá.
          </h2>
          <p className="text-white/60 max-w-lg font-light leading-relaxed mb-8">
            Jemná mlha, dramatický vizuální efekt a okamžité ochlazení prostoru — přesně takový je zážitek z instalací HolmTec v reálném provozu.
          </p>
          <Link to="/technologie" className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">
            Videa, živé ukázky a detail mlžení <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}