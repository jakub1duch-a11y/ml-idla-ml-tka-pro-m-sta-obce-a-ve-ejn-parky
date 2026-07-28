import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Droplets, Factory, MapPin, ThermometerSnowflake } from 'lucide-react';
import QuickBenefits from '@/components/home/QuickBenefits';

const HERO_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3c7f3e65f_copilot_image_1784351460863.jpg';
const MOBILE_BENDY_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ff03dd7df_export-1775421627756png.jpg';
const QUICK_LINKS = [{ icon: Droplets, label: '50–100 μm', text: 'velikost kapének', to: '/jak-funguje-mlzeni' }, { icon: ThermometerSnowflake, label: 'až −12 °C', text: 'pocitové ochlazení', to: '/vyhody' }, { icon: MapPin, label: 'celá ČR', text: 'realizace po celé zemi', to: '/galerie' }, { icon: Factory, label: 'na míru', text: 'zakázková výroba', to: '/katalog' }];

export default function MistCinematicHero() {
  return (
    <section id="uvod" className="relative overflow-hidden text-white bg-slate-950 min-h-[10svh]">
      <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/4af832dea_generated_image.png" alt="Mlžná brána v letním městském parku" fetchPriority="high" decoding="async" className="absolute inset-0 hidden h-full w-full object-cover md:block" />
      
      <div className="absolute bg-[linear-gradient(90deg,rgba(2,6,23,0.46)_20%,rgba(2,6,03,0.5)_55%,rgba(2,6,23,0.92)_100%)] inset-20" />
      <div className="hero-mist-overlay md:hidden"><span /><span /></div>
      <div className="site-container relative min-h-[70svh] z-10 flex items-center px-1">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan">Mlžidla.cz · nízkotlaké mlžné systémy</p>
          <h1 className="mt-5 font-heading font-light tracking-tight text-white leading-[1.08] text-3xl sm:text-3xl lg:text-3xl">Mlžící systémy, vodní mlha pro efektivní ochlazování</h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/75">Navrhujeme mlžítka, mlžné brány a ochlazení teras, parků i veřejných prostranství — účinně, úsporně a bez mokrého efektu.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/mlzidla-mlzitka" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-950 hover:bg-cyan">Prohlédnout mlžítka <ArrowRight size={17} /></Link>
            <Link to="/poptavka" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/30 bg-transparent px-7 py-4 text-sm font-bold text-white hover:bg-white/10">Navrhnout řešení</Link>
          </div>
        </div>
        <QuickBenefits className="absolute right-10 top-1/2 hidden w-[320px] -translate-y-1/2 grid-cols-1 lg:grid" compact limit={4} enableCooling />
      </div>
      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-slate-950/60 backdrop-blur-sm pt-12">
        <div className="site-container flex overflow-x-auto [&::-webkit-scrollbar]:hidden pt-3 pb-3">
          {QUICK_LINKS.map(({ icon: Icon, label, text, to }) => <Link key={to} to={to} className="flex min-h-12 min-w-[155px] flex-1 items-center gap-3 border-r border-white/10 px-4 text-left hover:bg-white/5"><Icon size={23} className="shrink-0 text-cyan size-12r" /><span><b className="block text-sm text-white size-">{label}</b><small className="block text-white/60 text-base">{text}</small></span></Link>)}
        </div>
      </div>
    </section>);

}