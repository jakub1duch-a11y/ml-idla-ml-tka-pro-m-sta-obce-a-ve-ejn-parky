import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function ArticleSafetyNotice() {
  return (
    <div className="my-10 p-6 rounded-2xl bg-slate-50 border border-slate-200 flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
        <ShieldCheck size={18} className="text-slate-700" />
      </div>
      <div>
        <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-1.5">Profesionální technologie HolmTec</p>
        <p className="text-sm text-slate-500 leading-relaxed font-light">
          Popisovaná mlžítka a mlžné sochy jsou nízkotlaké chladicí a designové prvky (provoz 3–5 bar, max. 7 bar) určené
          k osvěžení a estetickému ztvárnění prostoru — nejde o herní prvek, atrakci k šplhání ani prolézačku pro děti.
        </p>
      </div>
    </div>);

}