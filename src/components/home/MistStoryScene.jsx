import React, { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, Gauge, Snowflake, Wind } from 'lucide-react';
import StoryImageCrossfade from '@/components/home/StoryImageCrossfade';

const COOLING_STEPS = ['Mlha aktivní', 'Vzduch příjemnější', 'Místo pro setkání'];

export default function MistStoryScene({ scene }) {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const inView = useInView(ref, { amount: 0.38, once: true });
  const isHeatScene = scene.mode === 'heat';
  const cooled = isHeatScene && inView;
  const cooling = scene.mode !== 'heat' || cooled;
  const hasPhoto = Boolean(scene.image || scene.images?.length);

  useEffect(() => {
    if (inView) videoRef.current?.play();
  }, [inView, cooled]);

  const video = cooled ? scene.coolingVideo || scene.video : scene.video;
  const title = cooled ? 'Mlha vrací místu příjemný rytmus.' : scene.title;
  const text = cooled ? 'Jemné nízkotlaké mlžení vytvoří během okamžiku viditelnou chladivou zónu, kde se lidé mohou znovu zastavit.' : scene.text;

  return <motion.article ref={ref} initial={{ opacity: 0.25, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ amount: 0.35 }} transition={{ duration: 0.7 }} className="relative min-h-[78svh] overflow-hidden border-y border-white/10 bg-slate-950 text-white">
    {isHeatScene && scene.coolingVideo && <video src={scene.coolingVideo} preload="auto" muted playsInline className="hidden" />}
    {scene.images ? <StoryImageCrossfade images={scene.images} alt={scene.imageAlt || scene.title} /> : scene.image ? <img src={scene.image} alt={scene.imageAlt || 'Mlžítko ve veřejném prostoru'} className="absolute inset-0 h-full w-full object-cover" loading="lazy" /> : <video ref={videoRef} key={video} src={video} muted loop playsInline preload="metadata" className={`absolute inset-0 h-full w-full object-cover transition-all duration-1000 ${isHeatScene && !cooled ? 'scale-110 saturate-150 sepia-[.18]' : 'scale-100 opacity-80'}`} />}
    <div className={`absolute inset-0 transition-all duration-700 ${isHeatScene && !cooled ? 'bg-gradient-to-r from-orange-950/90 via-red-950/62 to-slate-950/75' : hasPhoto ? 'bg-gradient-to-r from-slate-950/95 via-slate-950/52 to-slate-950/75' : 'bg-gradient-to-r from-slate-950/88 via-cyan-950/52 to-slate-950/70'}`} />
    {isHeatScene && !cooled && <div className="absolute inset-0 opacity-45 mix-blend-screen" style={{ backgroundImage: 'repeating-linear-gradient(115deg, transparent 0, transparent 20px, rgba(251,146,60,.2) 21px, transparent 23px)' }} />}
    {cooling && <><div className="mist-scene-cloud" /><div className="mist-particles"><i /><i /><i /><i /></div><div className="absolute bg-[size:7px_7px] mix-blend-screen inset-5 bg-[radial-gradient(rgba(207,250,254,.85)_0.5px,transparent_0.7px)] opacity-45" /></>}
    {scene.mode === 'map' && <div className="cooling-rings"><span /><span /><span /></div>}
    <div className="relative z-10 mx-auto flex min-h-[78svh] max-w-7xl items-end px-6 py-14 lg:px-10 lg:py-20"><motion.div whileInView={{ y: [32, 0] }} viewport={{ once: true }} transition={{ duration: 0.65 }} className="max-w-2xl"><p className={`mb-5 text-xs font-bold uppercase tracking-[0.22em] ${isHeatScene && !cooled ? 'text-orange-200' : 'text-cyan'}`}>{scene.number} · {cooled ? 'Ochladivý přechod' : scene.eyebrow}</p><h2 className="font-heading text-4xl font-medium leading-[1.02] tracking-tight text-white lg:text-6xl">{title}</h2><p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 lg:text-lg">{text}</p>{isHeatScene && cooled ? <div className="mt-8 flex flex-wrap gap-3">{COOLING_STEPS.map((step, index) => <motion.span key={step} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.18 }} className="inline-flex items-center gap-2 rounded-full border border-cyan/40 px-3 py-2 text-xs font-semibold text-cyan bg-[#0f1729]/[0.6]"><Snowflake size={14} />{step}</motion.span>)}</div> : <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">{scene.tags.map((tag, index) => {const Icon = [Gauge, Droplets, Wind][index % 3];return <motion.span key={tag} whileHover={{ x: 3 }} className="inline-flex items-center gap-2 text-xs font-semibold bg-[#0f1729]/[0.6] text-cyan px-3 py-2 rounded-full border border-cyan/40"><Icon size={16} className={`${isHeatScene ? 'text-orange-200' : 'text-cyan'} drop-shadow-[0_0_10px_rgba(103,232,249,.75)]`} />{tag}</motion.span>;})}</div>}{scene.actions && <div className="mt-8 flex flex-wrap gap-3">{scene.actions.map((action) => <Link key={action.label} to={action.to} className={action.primary ? 'inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-50' : 'inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10'}>{action.label} <ArrowRight size={15} /></Link>)}</div>}</motion.div></div>
  </motion.article>;
}