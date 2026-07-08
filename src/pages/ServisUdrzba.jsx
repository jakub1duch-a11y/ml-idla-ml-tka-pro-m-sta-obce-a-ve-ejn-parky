import React, { useEffect } from 'react';
import { Wrench, Snowflake, Headphones } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import { Link } from 'react-router-dom';

const STEPS = [
  { icon: Wrench, title: 'Pravidelná údržba', text: 'Doporučujeme kontrolu trysek, filtrů a čerpadla 1–2× ročně. Předejdete tak usazeninám vodního kamene a udržíte optimální jemnost mlhy.' },
  { icon: Snowflake, title: 'Zazimování', text: 'Před prvními mrazy je nutné systém odstavit, vypustit vodu z rozvodů a čerpadla, aby nedošlo k poškození mrazem. Rádi vám s tím pomůžeme.' },
  { icon: Headphones, title: 'Technická podpora', text: 'V případě poruchy nebo dotazu k provozu je vám k dispozici náš servisní tým — telefonicky i emailem.' },
];

export default function ServisUdrzba() {
  useEffect(() => {
    setSEO({
      title: 'Servis a údržba',
      description: 'Pravidelná údržba, zimní zazimování a technická podpora mlžných systémů HolmTec.',
      keywords: 'servis mlžení, údržba mlžný systém, zazimování mlhoviště, technická podpora',
      canonicalPath: '/servis-udrzba',
    });
  }, []);

  return (
    <div className="min-h-screen bg-ink pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-2">Podpora</p>
        <h1 className="text-4xl lg:text-5xl font-light text-white mb-6">Servis a údržba</h1>
        <p className="text-white/60 text-lg leading-relaxed mb-12 max-w-2xl">
          Aby vám mlžný systém sloužil co nejdéle, doporučujeme dodržovat pravidelný servisní cyklus. Postaráme se
          o vaši instalaci od uvedení do provozu až po dlouhodobou podporu.
        </p>

        <div className="space-y-6">
          {STEPS.map((s, i) => (
            <div key={i} className="flex gap-5 bg-card_bg border border-white/10 rounded-2xl p-6">
              <div className="w-11 h-11 rounded-full bg-cyan/10 flex items-center justify-center flex-shrink-0">
                <s.icon size={20} className="text-cyan" />
              </div>
              <div>
                <h3 className="text-white font-medium text-lg mb-2">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/kontakt" className="inline-block px-8 py-3 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all">
            Objednat servis
          </Link>
        </div>
      </div>
    </div>
  );
}