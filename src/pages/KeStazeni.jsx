import React, { useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import { setSEO } from '@/lib/seo';

const DOCS = [
  { title: 'Produktový katalog 2026', desc: 'Kompletní přehled všech mlžítek, mlžných bran a mlhovišť.', category: 'Katalog' },
  { title: 'Technický list — Mlžítka', desc: 'Rozměry, materiálové provedení, spotřeba vody a tlakové parametry.', category: 'Technický list' },
  { title: 'Technický list — Mlhoviště', desc: 'Parametry systémů START, PARK a ARENA pro veřejné prostory.', category: 'Technický list' },
  { title: 'Instalační manuál', desc: 'Postup montáže, zapojení a uvedení systému do provozu.', category: 'Manuál' },
  { title: 'Manuál zazimování', desc: 'Postup přípravy systému na zimní období a jeho ochrany před mrazem.', category: 'Manuál' },
];

export default function KeStazeni() {
  useEffect(() => {
    setSEO({
      title: 'Ke stažení',
      description: 'Stáhněte si technické listy, instalační manuály a produktové katalogy mlžných systémů HolmTec ve formátu PDF.',
      keywords: 'ke stažení, technický list mlžení, katalog mlžných systémů PDF, instalační manuál mlhoviště',
      canonicalPath: '/ke-stazeni',
    });
  }, []);

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Dokumenty</p>
        <h1 className="text-4xl lg:text-5xl font-light text-slate-900 mb-4">Ke stažení</h1>
        <p className="text-slate-500 mb-10">Technické listy, instalační manuály a produktové katalogy v PDF formátu.</p>

        <div className="space-y-4">
          {DOCS.map((doc, i) => (
            <div key={i} className="flex items-center justify-between gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                  <FileText size={20} className="text-slate-700" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{doc.category}</span>
                  <h3 className="text-slate-900 font-medium">{doc.title}</h3>
                  <p className="text-slate-400 text-sm">{doc.desc}</p>
                </div>
              </div>
              <a href="mailto:obchod1@holmtec.cz?subject=Žádost o dokument" className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white text-slate-600 text-xs rounded-full hover:bg-slate-100 transition-all border border-slate-200">
                <Download size={14} /> Vyžádat
              </a>
            </div>
          ))}
        </div>

        <p className="text-slate-400 text-sm text-center mt-10">
          Potřebujete konkrétní dokumentaci k projektu? Napište nám na{' '}
          <a href="mailto:obchod1@holmtec.cz" className="text-slate-900 hover:underline">obchod1@holmtec.cz</a>.
        </p>
      </div>
    </div>
  );
}