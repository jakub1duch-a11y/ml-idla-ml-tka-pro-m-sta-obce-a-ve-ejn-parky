import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Gauge, Wind } from 'lucide-react';

export default function MistStoryScene({ scene }) {
  const cooling = scene.mode !== 'heat';
  return <motion.article initial={{ opacity: 0.25, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ amount: 0.35 }} transition={{ duration: 0.7 }} className="relative min-h-[78svh] overflow-hidden border-y border-white/10 bg-slate-950 text-white">
    <video src={scene.video} autoPlay muted loop playsInline className={`absolute inset-0 h-full w-full object-cover ${scene.mode === 'heat' ? 'scale-110 saturate-150 sepia-[.18]' : 'opacity-70'}`} />
    <div className={`absolute inset-0 ${scene.mode === 'heat' ? 'bg-gradient-to-r from-orange-950/80 via-slate-950/50 to-slate-950/75' : 'bg-gradient-to-r from-slate-950/90 via-slate-950/52 to-cyan-950/45'}`} />
    {cooling && <><div className="mist-scene-cloud" /><div className="mist-particles"><i /><i /><i /><i /></div></>}
    {scene.mode === 'map' && <div className="cooling-rings"><span /><span /><span /></div>}
    <div className="relative z-10 mx-auto flex min-h-[78svh] max-w-7xl items-end px-6 py-14 lg:px-10 lg:py-20">
      <motion.div whileInView={{ y: [32, 0] }} viewport={{ once: true }} transition={{ duration: 0.65 }} className="max-w-2xl">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-cyan">{scene.number} · {scene.eyebrow}</p>
        <h2 className="font-heading text-4xl font-medium leading-[1.02] tracking-tight text-white lg:text-6xl">{scene.title}</h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 lg:text-lg">{scene.text}</p>
        <div className="mt-8 flex flex-wrap gap-2">{scene.tags.map((tag, index) => { const Icon = [Gauge, Droplets, Wind][index % 3]; return <span key={tag} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/40 px-4 py-2 text-xs font-semibold text-white/90 backdrop-blur"><Icon size={14} className="text-cyan" />{tag}</span>; })}</div>
      </motion.div>
    </div>
  </motion.article>;
}