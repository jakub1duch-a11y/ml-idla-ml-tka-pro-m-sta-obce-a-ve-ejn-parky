import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Building2, Droplets, ShieldCheck, ThermometerSnowflake, Trees } from 'lucide-react';

const HERO_VIDEOS = [
'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/6297e30bb_Svaovnukzkazive.mov',
'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/16e481607_Mlzitkaostev-zivaukazkamlznystrom.mov',
'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/2b83755fa_instalace-mlzitka-mrak1.MOV',
'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/9d016456c_EFC9FCE8-7138-44C3-AAE6-246F88644813.MOV',
'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/66dee6ceb_1283CEC3-EA3F-42B3-9E58-3788630B07A6.MOV'];


const BENEFITS = [
{ icon: ThermometerSnowflake, label: 'Ochlazení až o 10 °C' },
{ icon: Trees, label: 'Pro parky a náměstí' },
{ icon: Droplets, label: 'Jemná mlha bez kaluží' },
{ icon: ShieldCheck, label: 'Bezpečné pro občany' }];


export default function UrbanHero() {
  const [activeVideo, setActiveVideo] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveVideo((current) => (current + 1) % HERO_VIDEOS.length);
    }, 7000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[760px] h-[100svh] overflow-hidden bg-slate-950 flex items-end">
      <AnimatePresence mode="wait">
        <motion.video key={HERO_VIDEOS[activeVideo]} src={HERO_VIDEOS[activeVideo]} autoPlay muted loop playsInline preload="auto" initial={{ opacity: 0, scale: 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }} className="absolute inset-0 w-full h-full object-cover" />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/10" />
      <div className="absolute inset-0 bg-gradient-to-r to-transparen9 from-slate-700/82 via-slate-650/95" />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-10 pb-10 sm:pb-14">
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }} className="max-w-3xl py-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 backdrop-blur-md text-white font-semibold tracking-widest uppercase mb-5 text-base">VEŘEJNÝ PROSTOR PRO KAŽDÉHO</span>
          <h1 className="text-white tracking-tight [font-family:'DM_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-normal text-4xl leading-[1.02] sm:text-4xl lg:text-4xl text-left">Chladivé městské prostory, kde se lidé chtějí zastavit.</h1>
          <p className="text-white/80 text-base sm:text-lg leading-relaxed text-measure mt-6">Navrhujeme mlžítka a mlžné brány pro města, parky, školní dvory i náměstí. Přinášejí občanům úlevu v horkých dnech a místům nový přirozený život.</p>
          <div className="flex flex-wrap gap-3 mt-8"><Link to="/poptavka" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-slate-950 text-sm font-bold hover:bg-slate-100 transition-colors">Nezávazná konzultace <ArrowRight size={16} /></Link><Link to="/kategorie/mesta-obce" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/35 text-white text-sm font-semibold hover:bg-white/10 transition-colors">Řešení pro města</Link></div>
        </motion.div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mt-10 max-w-4xl">{BENEFITS.map((benefit, index) => <motion.div key={benefit.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 + index * 0.08, ease: [0.4, 0, 0.2, 1] }} className="flex items-center gap-3 rounded-xl border border-white/15 backdrop-blur-md px-3.5 py-3.5 bg-white/00"><benefit.icon size={17} className="text-white shrink-0 size-20" /><span className="text-white/90 leading-snug text-base">{benefit.label}</span></motion.div>)}</div>
      </div>
    </section>);

}