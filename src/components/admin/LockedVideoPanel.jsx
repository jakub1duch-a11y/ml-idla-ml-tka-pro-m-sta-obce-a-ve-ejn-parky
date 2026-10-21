import React from 'react';
import { ShieldCheck, Ruler, Images } from 'lucide-react';

// Panel PRODUCT LOCK pro video: rozměry produktu a přehled referencí (web + Mlžný disk).
export default function LockedVideoPanel({ plan, heightMm, diameterMm, setHeightMm, setDiameterMm, seconds, setSeconds }) {
  return (
    <div className="space-y-3 rounded-xl border border-cyan/20 bg-cyan/5 p-3">
      <p className="flex items-center gap-2 text-xs font-semibold text-white"><ShieldCheck size={14} className="text-cyan" /> Video s PRODUCT LOCK · tvar a rozměry podle skutečného produktu</p>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-xs text-white/40"><span className="flex items-center gap-1"><Ruler size={11} /> Výška produktu (mm)</span>
          <input type="number" min="0" value={heightMm} onChange={(e) => setHeightMm(e.target.value)} placeholder="např. 2200" className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/25" />
        </label>
        <label className="text-xs text-white/40"><span className="flex items-center gap-1"><Ruler size={11} /> Průměr profilu (mm)</span>
          <input type="number" min="0" value={diameterMm} onChange={(e) => setDiameterMm(e.target.value)} placeholder="např. 60" className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/25" />
        </label>
        <label className="text-xs text-white/40">Délka videa
          <select value={seconds} onChange={(e) => setSeconds(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-white/10 bg-[#111820] px-3 py-2.5 text-sm text-white">
            {[4, 6, 8, 10].map((s) => <option key={s} value={s}>{s} s</option>)}
          </select>
        </label>
      </div>
      {plan?.references?.length > 0 && (
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] text-white/50"><Images size={12} /> Reference předané generátoru: {plan.references.length} (web mlzidla.cz + Mlžný disk, k dispozici {plan.diskCount} snímků z disku)</p>
          <div className="flex gap-1.5 overflow-x-auto">{plan.references.map((u) => <img key={u} src={u} alt="Reference produktu" className="h-14 w-14 shrink-0 rounded-lg border border-white/10 bg-black/20 object-cover" />)}</div>
          {plan.credits != null && <p className="mt-1.5 text-[10px] text-white/35">Odhad spotřeby: {plan.credits} kreditů</p>}
        </div>
      )}
    </div>
  );
}