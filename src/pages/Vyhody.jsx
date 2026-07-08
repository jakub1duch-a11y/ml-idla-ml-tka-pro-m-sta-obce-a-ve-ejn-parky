import React, { useEffect } from 'react';
import { Building2, Leaf, Zap, ShieldCheck } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import { Link } from 'react-router-dom';

const BENEFITS = [
  { icon: Building2, title: 'Přínos pro města', text: 'Ochlazení veřejných prostranství snižuje efekt tepelného ostrova, zvyšuje komfort obyvatel a atraktivitu veřejného prostoru.' },
  { icon: Zap, title: 'Úspora energie', text: 'Ve srovnání s klimatizací mají mlžné systémy výrazně nižší spotřebu energie při srovnatelném pocitovém ochlazení venkovních prostor.' },
  { icon: Leaf, title: 'Ekologický dopad', text: 'Nízká spotřeba vody, žádné chemikálie a minimální energetická náročnost dělají z mlžení šetrné řešení pro městské prostředí.' },
  { icon: ShieldCheck, title: 'Odolnost materiálů', text: 'Nerezová ocel AISI 316L odolává korozi, povětrnostním vlivům i UV záření — systémy tak vydrží desítky let provozu.' },
];

export default function Vyhody() {
  useEffect(() => {
    setSEO({
      title: 'Výhody mlžných systémů',
      description: 'Přehled benefitů mlžných systémů HolmTec: přínos pro města, úspora energie, ekologický dopad a odolnost materiálů.',
      keywords: 'výhody mlžení, benefity mlžný systém, úspora energie chlazení, ekologické chlazení měst',
      canonicalPath: '/vyhody',
    });
  }, []);

  return (
    <div className="min-h-screen bg-ink pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-2">Proč HolmTec</p>
        <h1 className="text-4xl lg:text-5xl font-light text-white mb-6">Výhody mlžných systémů</h1>
        <p className="text-white/60 text-lg leading-relaxed mb-12 max-w-2xl">
          Mlžení není jen o estetickém zážitku — přináší měřitelné přínosy pro města, životní prostředí i dlouhodobou návratnost investice.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BENEFITS.map((b, i) => (
            <div key={i} className="bg-card_bg border border-white/10 rounded-2xl p-6">
              <div className="w-11 h-11 rounded-full bg-cyan/10 flex items-center justify-center mb-4">
                <b.icon size={20} className="text-cyan" />
              </div>
              <h3 className="text-white font-medium text-lg mb-2">{b.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/poptavka" className="inline-block px-8 py-3 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all">
            Nezávazná poptávka
          </Link>
        </div>
      </div>
    </div>
  );
}