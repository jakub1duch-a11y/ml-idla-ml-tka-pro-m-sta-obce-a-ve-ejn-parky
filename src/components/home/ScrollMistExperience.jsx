import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MistStoryScene from '@/components/home/MistStoryScene';
import { HERO_IMAGE, MIST_STORY_SCENES } from '@/components/home/mistStoryData';
import HeatStoryIntro from '@/components/home/HeatStoryIntro';

export default function ScrollMistExperience() {
  return <section id="pribeh" className="bg-slate-950">
    <HeatStoryIntro />
    {MIST_STORY_SCENES.map(scene => <MistStoryScene key={scene.number} scene={scene} />)}
    <section className="relative overflow-hidden bg-slate-950 text-white"><img src={HERO_IMAGE} alt="Mlžítko TeePe Mist v městském prostoru" className="absolute inset-0 h-full w-full object-cover opacity-35" loading="lazy" /><div className="absolute inset-0 bg-slate-950/65" /><div className="relative z-10 mx-auto max-w-5xl px-6 py-28 text-center lg:px-10 lg:py-40"><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan">Váš chladivý okamžik</p><h2 className="mx-auto mt-5 max-w-3xl font-heading text-4xl font-medium leading-tight tracking-tight lg:text-6xl">Zažijte chladící okamžik i ve vašem městě.</h2><div className="mt-9 flex flex-wrap justify-center gap-3"><Link to="/katalog" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-950">Prohlédnout produkty <ArrowRight size={16} /></Link><Link to="/poptavka" className="inline-flex items-center rounded-full border border-white/30 px-7 py-4 text-sm font-bold text-white">Nezávazná poptávka</Link></div></div></section>
  </section>;
}