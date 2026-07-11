import React, { useEffect } from 'react';
import { Building2, Leaf, Zap, ShieldCheck } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Proč HolmTec</p>
        <h1 className="text-4xl lg:text-5xl font-light text-slate-900 mb-6">Výhody mlžných systémů</h1>
        <p className="text-slate-500 text-lg leading-relaxed mb-12 max-w-2xl">
          Mlžení není jen o estetickém zážitku — přináší měřitelné přínosy pro města, životní prostředí i dlouhodobou návratnost investice.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BENEFITS.map((b, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4">
                <b.icon size={20} className="text-slate-700" />
              </div>
              <h3 className="text-slate-900 font-medium text-lg mb-2">{b.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{b.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/poptavka" className="btn-metallic-mist px-8 py-3 text-sm font-bold">
            Nezávazná poptávka <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}