import React, { useEffect } from 'react';
import { Wind, Sparkles, HeartPulse } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import { Link } from 'react-router-dom';

const POINTS = [
  { icon: Wind, title: 'Snížení prašnosti', text: 'Jemné vodní kapičky vážou prachové částice ve vzduchu a urychlují jejich usazení, čímž snižují množství prachu v ovzduší veřejných prostor.' },
  { icon: Sparkles, title: 'Zachycení pylu', text: 'Mlha pomáhá vázat pylová zrna a alergeny, což může přinést úlevu zejména v období vysoké pylové zátěže.' },
  { icon: HeartPulse, title: 'Zlepšení kvality ovzduší', text: 'Kombinace ochlazení a vázání částic přispívá k příjemnějšímu a čistšímu vzduchu v hustě osídlených městských oblastech.' },
];

export default function OchranaZdravi() {
  useEffect(() => {
    setSEO({
      title: 'Ochrana zdraví a kvalita ovzduší',
      description: 'Jak mlžení pomáhá snižovat prašnost, pyl a zlepšovat kvalitu ovzduší v městském prostředí.',
      keywords: 'ochrana zdraví mlžení, snížení prašnosti, pyl mlžení, kvalita ovzduší město',
      canonicalPath: '/ochrana-zdravi',
    });
  }, []);

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Zdraví & prostředí</p>
        <h1 className="text-4xl lg:text-5xl font-light text-slate-900 mb-6">Ochrana zdraví</h1>
        <p className="text-slate-500 text-lg leading-relaxed mb-12 max-w-2xl">
          Mlžení má vliv nejen na teplotu, ale i na kvalitu vzduchu, kterým dýcháme. Jemné vodní kapičky pomáhají
          vázat prachové částice a alergeny přímo ve vzduchu veřejných prostor.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {POINTS.map((p, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4">
                <p.icon size={20} className="text-slate-700" />
              </div>
              <h3 className="text-slate-900 font-medium text-lg mb-2">{p.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/kontakt" className="btn-metallic-mist px-8 py-3 text-sm font-bold">
            Zjistit více
          </Link>
        </div>
      </div>
    </div>
  );
}