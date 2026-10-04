import React from 'react';
import { Loader, Save, RefreshCw } from 'lucide-react';

export default function BrandVisualResult({ url, saving, onSave, onRegenerate, onDiscard, productName }) {
  return (
    <div className="rounded-xl border border-cyan/20 bg-cyan/5 p-3">
      <p className="text-xs text-cyan font-mono uppercase tracking-wider mb-2">Náhled — kontrola proti identitě</p>
      <img src={url} alt="Vygenerovaný značkový prvek" className="w-full max-w-md rounded-lg bg-[#F4FAFC]" />
      <p className="text-[11px] text-white/40 mt-2">
        {productName ? `Uloží se ke produktu: ${productName}` : 'Uloží se do obecné značkové knihovny.'}
      </p>
      <div className="flex flex-wrap gap-2 mt-3">
        <button onClick={onSave} disabled={saving}
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 disabled:opacity-40 transition-all">
          {saving ? <Loader size={13} className="animate-spin" /> : <Save size={13} />}
          {saving ? 'Ukládám…' : 'Uložit do knihovny'}
        </button>
        <button onClick={onRegenerate}
          className="inline-flex items-center gap-2 border border-cyan/30 text-cyan px-4 py-2 rounded-lg text-xs font-medium hover:bg-cyan/10 transition-all">
          <RefreshCw size={13} /> Vygenerovat jinou variantu
        </button>
        <button onClick={onDiscard}
          className="inline-flex items-center gap-2 border border-white/15 text-white/50 px-4 py-2 rounded-lg text-xs font-medium hover:text-white transition-all">
          Zahodit
        </button>
      </div>
    </div>
  );
}