import React from 'react';

export default function MlzidlaProduktDiagram({ product }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-6">
      <svg viewBox="0 0 200 220" className="w-32 h-auto mb-4">
        <path
          d="M60 210 L60 100 Q40 90 45 65 Q35 45 55 35 Q55 15 80 15 Q95 5 115 15 Q140 15 140 40 Q160 50 150 70 Q155 90 140 100 L140 210"
          fill="none" stroke="#94a3b8" strokeWidth="2"
        />
      </svg>
      <div className="w-full max-w-[220px] space-y-2 text-center">
        <p className="text-[11px] text-slate-400">Výška: <span className="text-slate-700 font-semibold">{product.dimensions.height}</span></p>
        <p className="text-[11px] text-slate-400">Šířka: <span className="text-slate-700 font-semibold">{product.dimensions.width}</span></p>
        <p className="text-[11px] text-slate-400">Hloubka: <span className="text-slate-700 font-semibold">{product.dimensions.depth}</span></p>
      </div>
    </div>
  );
}