import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function ArticleSafetyNotice() {
  return (
    <div className="my-10 p-6 rounded-2xl bg-cyan/5 border border-cyan/20 flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center shrink-0">
        <ShieldCheck size={18} className="text-cyan" />
      </div>
      <div>
        <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-1.5">Profesionální technologie HolmTec</p>
        <p className="text-sm text-white/55 leading-relaxed font-light">
          Popisovaná mlžítka a mlžné sochy jsou nízkotlaké chladicí a designové prvky (provoz 3–5 bar, max. 7 bar) určené
          k osvěžení a estetickému ztvárnění prostoru — nejde o herní prvek, atrakci k šplhání ani prolézačku pro děti.
        </p>
      </div>
    </div>);

}