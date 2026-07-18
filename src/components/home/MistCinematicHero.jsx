import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, Factory, MapPin, ThermometerSnowflake } from 'lucide-react';
import QuickBenefits from '@/components/home/QuickBenefits';

const HERO_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3c7f3e65f_copilot_image_1784351460863.jpg';
const QUICK_LINKS = [
  { icon: Droplets, label: '5–15 μm', text: 'velikost kapének', to: '/jak-funguje-mlzeni' },
  { icon: ThermometerSnowflake, label: 'až −12 °C', text: 'pocitové ochlazení', to: '/vyhody' },
  { icon: MapPin, label: 'celá ČR', text: 'realizace po celé zemi', to: '/galerie' },
  { icon: Factory, label: 'na míru', text: 'zakázková výroba', to: '/katalog' },
];

export default function MistCinematicHero() {
  return <section id="uvod" className="relative min-h-[100svh] overflow-hidden bg-slate-950 text-white">
    <img src={HERO_IMAGE} alt="Mlžná brána v letním městském parku" fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.84)_0%,rgba(2,6,23,0.58)_46%,rgba(2,6,23,0.18)_100%)]" />
    <div className="site-container relative z-10 flex min-h-[100svh] items-center py-32">
      <div className="max-w-xl"><p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan">Mlžidla.cz · nízkotlaké mlžné systémy</p><h1 className="mt-5 text-white">Nízkotlaké mlžení<br />a mlžné brány pro horké dny.</h1><p className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">Navrhujeme mlžítka, mlžné brány a ochlazení teras, parků i veřejných prostranství — účinně, úsporně a bez mokrého efektu.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link to="/mlzidla-mlzitka" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-slate-950 transition-colors hover:bg-cyan">Prohlédnout mlžítka <ArrowRight size={17} /></Link><Link to="/poptavka" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/45 bg-white/5 px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-white/15">Navrhnout řešení</Link></div></div>
      <QuickBenefits className="absolute right-10 top-1/2 hidden w-[320px] -translate-y-1/2 grid-cols-2 lg:grid" compact limit={4} />
    </div>
    <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/20 bg-slate-950/50"><div className="site-container flex overflow-x-auto py-3 [&::-webkit-scrollbar]:hidden">{QUICK_LINKS.map(({ icon: Icon, label, text, to }) => <Link key={to} to={to} className="flex min-h-12 min-w-[155px] flex-1 items-center gap-3 border-r border-white/15 px-4 text-left transition-colors hover:bg-white/10"><Icon size={23} className="shrink-0 text-cyan" /><span><b className="block text-sm text-white">{label}</b><small className="block text-[11px] text-white/65">{text}</small></span></Link>)}</div></div>
  </section>;
}