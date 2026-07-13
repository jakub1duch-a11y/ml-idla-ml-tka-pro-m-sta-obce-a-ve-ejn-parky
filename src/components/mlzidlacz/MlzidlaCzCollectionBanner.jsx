import React from 'react';
import { Sparkles } from 'lucide-react';

export default function MlzidlaCzCollectionBanner() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/90 tracking-widest uppercase px-3 py-1 bg-white/15 rounded-full mb-3">
          <Sparkles size={12} /> Nová kolekce 2026
        </span>
        <h1 className="font-heading font-black text-2xl lg:text-3xl text-white tracking-tight leading-tight">
          Mlžítka, brány, linie a trysky pro každý prostor
        </h1>
        <p className="text-white/80 text-sm mt-2 max-w-xl">
          Projděte si celou kolekci mlžných systémů HolmTec — porovnejte typy, výhody i technické parametry a vyberte řešení přesně pro váš projekt.
        </p>
      </div>
    </div>
  );
}