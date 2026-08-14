import React, { useEffect } from 'react';
import { ArrowRight, Building2, Trees, Hotel, Utensils, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { setSEO } from '@/lib/seo';
import ReferenceMetrics from '@/components/premium/ReferenceMetrics';
import ReferenceShowcase from '@/components/premium/ReferenceShowcase';

const HERO_IMAGE = 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/3824f85eb_1000005519.jpg';

const sectors = [
  [Building2, 'Města', '/kategorie/mesta-obce'],
  [Trees, 'Parky', '/kategorie/parky-hriste'],
  [Hotel, 'Hotely', '/kategorie/komercni'],
  [Utensils, 'Restaurace', '/kategorie/komercni'],
];

export default function Reference() {
  useEffect(() => setSEO({
    title: 'Realizace mlžítek a mlžných bran | MLŽIDLA®',
    description: 'Realizace nerezových mlžítek a mlžných bran pro města, parky, zahrady, hotely, restaurace a veřejné instituce.',
    canonicalPath: '/reference'
  }), []);

  return (
    <div className="bg-background pt-16">
      <section className="relative min-h-[680px] overflow-hidden bg-primary lg:min-h-[760px]">
        <img src={HERO_IMAGE} alt="Realizace mlžítek v ZOO Praha" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#041c28]/98 via-[#082f3f]/84 to-[#0a3b4d]/38" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#041c28]/78 via-transparent to-[#041c28]/16" />

        <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-end gap-10 px-6 pb-16 pt-28 lg:min-h-[760px] lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:pb-20">
          <div className="max-w-3xl">
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">Reference MLŽIDLA®</p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl leading-[1.02] tracking-[-0.02em] text-white">Realizace, které dávají veřejnému prostoru nový důvod zůstat.</h1>
            <p className="mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-white/88">Od ZOO Praha přes náměstí a parky až po hotely a soukromé zahrady. Navrhujeme nerezové mlžicí systémy, které spojují funkci, design a spolehlivý provoz.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/poptavka" className="inline-flex items-center gap-2 bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5">Navrhnout váš prostor <ArrowRight size={16} /></Link>
              <a href="#realizace" className="inline-flex items-center gap-2 border border-white/35 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10">Prohlédnout realizace <ArrowRight size={16} /></a>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/82">
              <span className="inline-flex items-center gap-2"><ShieldCheck size={16} className="text-cyan" /> Český návrh a výroba</span>
              <span className="inline-flex items-center gap-2"><MapPin size={16} className="text-cyan" /> Realizace po celé ČR</span>
            </div>
          </div>

          <div className="hidden lg:block">
            <Link to="/reference/mlzitka-pro-zoo-praha" className="group ml-auto block max-w-md border border-white/20 bg-[#062d3b]/88 p-7 text-white shadow-2xl backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan/60 hover:bg-[#062d3b]/95">
              <div className="flex items-center gap-3"><Sparkles size={18} className="text-cyan" /><p className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan">Vybraná reference</p></div>
              <h2 className="mt-5 font-heading text-3xl tracking-[-0.01em]">ZOO Praha</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/82">Mlžítka v jednom z nejnavštěvovanějších veřejných areálů v Česku. Důraz na odolnost, provozní spolehlivost a komfort návštěvníků.</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white transition group-hover:text-cyan">Zobrazit realizaci <ArrowRight size={15} /></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
          <p className="mb-6 text-center font-mono text-[10px] uppercase tracking-[.18em] text-slate-400">Vybrané realizace a partneři</p>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-6 sm:px-8 lg:px-10">
            <img src="/reference-logos.svg" alt="Reference: Praha 8, Praha 5, Město Polná, Jičín a ZOO Praha" className="mx-auto h-auto w-full max-w-5xl opacity-90" />
          </div>
        </div>
      </section>

      <ReferenceMetrics />

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid grid-cols-2 overflow-hidden border border-slate-200 bg-white lg:grid-cols-4">
          {sectors.map(([Icon, label, path]) => (
            <Link to={path} key={label} className="group flex items-center justify-center gap-3 border-b border-r border-slate-200 px-4 py-6 transition hover:bg-slate-50 lg:border-b-0 last:border-r-0">
              <Icon size={19} className="text-teal-700 transition-transform group-hover:scale-110" />
              <span className="font-medium text-slate-700">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      <div id="realizace"><ReferenceShowcase /></div>

      <section className="bg-[#062d3b] py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-end gap-8 px-6 lg:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-cyan">Váš projekt</p>
            <h2 className="max-w-3xl font-heading text-4xl text-white lg:text-6xl">Navrhneme řešení, které obstojí vizuálně i v každodenním provozu.</h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/78">Pošlete nám fotografii, rozměry nebo situační plán. Doporučíme vhodný produkt, způsob instalace a další postup.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/poptavka" className="bg-cyan px-6 py-3 text-sm font-bold text-slate-950">Popsat projekt</Link>
            <Link to="/kontakt" className="border border-white/35 px-6 py-3 text-sm font-semibold text-white">Probrat záměr</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
