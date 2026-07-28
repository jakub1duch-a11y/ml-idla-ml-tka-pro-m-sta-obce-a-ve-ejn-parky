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
    <section id="uvod" aria-label="Mlžidla.cz — nízkotlaké mlžné systémy" className="relative w-full rounded-[12px] bg-[#062238] text-white mx-auto max-w-[1000px]">
      <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/728d4c2eb_generated_550b2dcc.png" alt="Technický nákres mlžné brány" fetchPriority="high" decoding="async" className="pointer-events-none absolute -left-[8.83%] -top-[7.45%] h-auto w-[117.65%] max-w-none select-none" />
      <div className="absolute inset-0">
        <Link to="/mlzidla-mlzitka" aria-label="Prohlédnout mlžítka" className="absolute left-[10.9%] top-[57.2%] h-[5.5%] w-[17.5%] rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"><span className="sr-only">Prohlédnout mlžítka</span></Link>
        <Link to="/poptavka" aria-label="Navrhnout řešení" className="absolute left-[29.5%] top-[57.2%] h-[5.5%] w-[15.8%] rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan"><span className="sr-only">Navrhnout řešení</span></Link>
        {QUICK_LINKS.map(({ label, text, to }, index) => <Link key={to} to={to} aria-label={`${label} — ${text}`} className="absolute top-[79%] h-[13%] w-[19%] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan" style={{ left: `${10.9 + index * 20.4}%` }}><span className="sr-only">{label} — {text}</span></Link>)}
      </div>
    </section>);

}