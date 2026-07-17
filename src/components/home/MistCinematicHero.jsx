import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';

const VIDEOS = [
  'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/aba1e0ccb_Mln_brna_video.mp4',
  'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/57b2e36fa_VID_20260715_144946_037.mp4',
  'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/2a9d10fda_VID_20260715_144952_432.mp4',
];

export default function MistCinematicHero() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1.03, 1.18]);
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-3%']);
  const blur = useTransform(scrollYProgress, [0, 0.75, 1], ['blur(0px)', 'blur(0px)', 'blur(8px)']);
  const opacityOne = useTransform(scrollYProgress, [0, 0.26, 0.38], [1, 1, 0]);
  const opacityTwo = useTransform(scrollYProgress, [0.25, 0.42, 0.62, 0.74], [0, 1, 1, 0]);
  const opacityThree = useTransform(scrollYProgress, [0.62, 0.78, 1], [0, 1, 1]);
  const opacities = [opacityOne, opacityTwo, opacityThree];
  return <section className="relative h-[230svh] bg-slate-950 text-white"><div className="sticky top-0 h-[100svh] overflow-hidden"><div className="absolute inset-0 overflow-hidden">{VIDEOS.map((video, index) => <motion.video key={video} src={video} autoPlay muted loop playsInline preload={index === 0 ? 'auto' : 'metadata'} style={{ opacity: opacities[index], scale, x, filter: blur }} className="absolute inset-0 h-full w-full scale-105 object-cover" />)}<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_35%,rgba(207,250,254,0.16),transparent_42%),linear-gradient(100deg,rgba(2,6,23,0.78)_0%,rgba(2,6,23,0.35)_55%,rgba(2,6,23,0.18)_100%)]" /><div className="mist-hero-glow" /></div><motion.div style={{ opacity: useTransform(scrollYProgress, [0, 0.82, 1], [1, 1, 0]) }} className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-14 pt-32 lg:px-10 lg:pb-20"><p className="mb-5 text-xs font-bold uppercase tracking-[0.24em] text-cyan">TeePe · městské mlžení</p><h1 className="max-w-4xl font-heading text-5xl font-medium leading-[0.94] tracking-tight text-white lg:text-7xl">Oáza pro<br />naše město.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 lg:text-xl">Moderní mlžítka pro historická náměstí, parky, školy, veřejný prostor a architekturu.</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/reference" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan">Prohlédnout realizace <ArrowRight size={16} /></Link><Link to="/poptavka" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">Navrhnout řešení</Link></div><a href="#navigace-uvod" className="mt-12 inline-flex w-fit items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-white/65 transition hover:text-white"><ArrowDown size={15} /> Objevte možnosti</a></motion.div></div></section>;
}