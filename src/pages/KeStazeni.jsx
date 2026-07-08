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
    <div className="min-h-screen bg-ink pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-2">Dokumenty</p>
        <h1 className="text-4xl lg:text-5xl font-light text-white mb-4">Ke stažení</h1>
        <p className="text-white/50 mb-10">Technické listy, instalační manuály a produktové katalogy v PDF formátu.</p>

        <div className="space-y-4">
          {DOCS.map((doc, i) => (
            <div key={i} className="flex items-center justify-between gap-4 bg-card_bg border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-cyan/10 flex items-center justify-center flex-shrink-0">
                  <FileText size={20} className="text-cyan" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-cyan uppercase tracking-widest">{doc.category}</span>
                  <h3 className="text-white font-medium">{doc.title}</h3>
                  <p className="text-white/40 text-sm">{doc.desc}</p>
                </div>
              </div>
              <a href="mailto:obchod1@holmtec.cz?subject=Žádost o dokument" className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white/5 text-white/70 text-xs rounded-full hover:bg-white/10 transition-all">
                <Download size={14} /> Vyžádat
              </a>
            </div>
          ))}
        </div>

        <p className="text-white/40 text-sm text-center mt-10">
          Potřebujete konkrétní dokumentaci k projektu? Napište nám na{' '}
          <a href="mailto:obchod1@holmtec.cz" className="text-cyan hover:text-cyan/80">obchod1@holmtec.cz</a>.
        </p>
      </div>
    </div>
  );
}