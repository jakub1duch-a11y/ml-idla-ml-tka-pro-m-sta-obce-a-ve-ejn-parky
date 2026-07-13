import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import CostCalculatorWidget from '@/components/produkt/CostCalculatorWidget';

export default function MlzidlaCzCalculatorSection({ product }) {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div>
        <p className="text-[11px] font-bold text-cyan-400 tracking-widest uppercase mb-2">Kalkulace nákladů</p>
        <h2 className="font-heading font-black text-2xl text-white tracking-tight mb-3">
          Kolik vás bude stát provoz {product?.name || 'mlžítka'}?
        </h2>
        <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-md">
          Spočítejte si orientační denní náklad na vodu a energii podle délky provozu a vyžádejte si nezávaznou nabídku na míru.
        </p>
        <Link to="/poptavka" className="inline-flex items-center gap-2 bg-white text-slate-900 text-sm font-bold px-5 py-3 rounded-full hover:bg-white/90 transition-colors">
          Nezávazná poptávka <ArrowRight size={15} />
        </Link>
      </div>
      <CostCalculatorWidget waterConsumption={product?.water_consumption} />
    </div>
  );
}