import React, { useState } from 'react';
import { Check, Download, FileText, Mail } from 'lucide-react';
import MlzidlaProduktDiagram from './MlzidlaProduktDiagram';

const TABS = ['Popis produktu', 'Technické údaje', 'Materiály a provedení', 'Dokumentace ke stažení'];

export default function MlzidlaProduktTabs({ product }) {
  const [tab, setTab] = useState(TABS[0]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200">
      <div className="flex border-b border-slate-200 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-4 text-xs font-bold uppercase tracking-wide whitespace-nowrap border-b-2 transition-colors ${tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-6 lg:p-8">
        {tab === 'Popis produktu' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_1fr] gap-8">
            <div>
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">O produktu</p>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">{product.longDescription}</p>
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">Vhodné pro</p>
              <div className="space-y-2">
                {product.suitableFor.map((s) => (
                  <div key={s} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check size={14} className="text-blue-600 shrink-0" /> {s}
                  </div>
                ))}
              </div>
            </div>
            <MlzidlaProduktDiagram product={product} />
            <div className="bg-slate-50 rounded-xl p-5">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-4">Základní parametry</p>
              <div className="space-y-2.5">
                {product.baseParams.map((p) => (
                  <div key={p.label} className="flex justify-between text-xs">
                    <span className="text-slate-400">{p.label}</span>
                    <span className="text-slate-700 font-semibold text-right">{p.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'Technické údaje' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
            {product.baseParams.map((p) => (
              <div key={p.label} className="flex justify-between text-sm border-b border-slate-100 py-2">
                <span className="text-slate-400">{p.label}</span>
                <span className="text-slate-800 font-semibold">{p.value}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'Materiály a provedení' && (
          <div className="text-sm text-slate-500 leading-relaxed space-y-3 max-w-2xl">
            <p>Konstrukce je vyrobena z nerezové oceli {product.baseParams.find((p) => p.label === 'Materiál')?.value || 'AISI 304 / 316'} s povrchovou úpravou {product.baseParams.find((p) => p.label === 'Povrchová úprava')?.value?.toLowerCase() || 'broušenou'}.</p>
            <p>Nerezová ocel zaručuje vysokou odolnost proti korozi, povětrnostním vlivům i chlorované vodě, a je tak vhodná pro trvalý venkovní provoz bez nutnosti dodatečné údržby.</p>
            <p>Veškeré spoje a trysky jsou provedeny bez ostrých hran, konstrukce splňuje bezpečnostní požadavky pro provoz v prostředí s dětmi.</p>
          </div>
        )}

        {tab === 'Dokumentace ke stažení' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <a href="/ke-stazeni" className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
              <FileText size={18} className="text-blue-600 shrink-0" />
              <span className="text-sm font-semibold text-slate-700">Technický list produktu</span>
              <Download size={14} className="ml-auto text-slate-400" />
            </a>
            <a href={`mailto:obchod1@holmtec.cz?subject=Poptávka dokumentace — ${product.name}`} className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
              <Mail size={18} className="text-blue-600 shrink-0" />
              <span className="text-sm font-semibold text-slate-700">Vyžádat 3D model / výkres</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}