import React, { useState, useEffect } from 'react';
import { Wrench, Snowflake, Headphones } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import { Link } from 'react-router-dom';
import FaqAccordionItem from '@/components/common/FaqAccordionItem';

const STEPS = [
  { icon: Wrench, title: 'Pravidelná údržba', text: 'Doporučujeme kontrolu trysek, filtrů a čerpadla 1–2× ročně. Předejdete tak usazeninám vodního kamene a udržíte optimální jemnost mlhy.' },
  { icon: Snowflake, title: 'Zazimování', text: 'Před prvními mrazy je nutné systém odstavit, vypustit vodu z rozvodů a čerpadla, aby nedošlo k poškození mrazem. Rádi vám s tím pomůžeme.' },
  { icon: Headphones, title: 'Technická podpora', text: 'V případě poruchy nebo dotazu k provozu je vám k dispozici náš servisní tým — telefonicky i emailem.' },
];

const FAQ_ITEMS = [
  { q: 'Jak často je potřeba mlžítka servisovat?', a: 'Doporučujeme základní servis jednou ročně — vždy na začátku nebo konci sezóny. Servis zahrnuje kontrolu a čištění trysek, kontrolu tlakového čerpadla, filtrů a elektrické části. Nabízíme roční servisní smlouvy.' },
  { q: 'Jak čistit trysky mlžítek?', a: 'Trysky z AISI 316L jsou odolné vůči usazování vodního kamene. Při používání tvrdé vody doporučujeme instalaci změkčovacího filtru. Trysky lze ručně demontovat a propláchnout citrovým roztokem. Podrobný postup je součástí manuálu.' },
  { q: 'Co dělat, když mlžítko přestane mlžit?', a: 'Nejprve zkontrolujte přívod vody a tlak (min. 3 bar). Poté zkontrolujte filtr před čerpadlem — může být ucpaný. Dále ověřte, zda je čerpadlo v provozu a zda řídící jednotka signalizuje chybu. Pokud problém přetrvává, kontaktujte náš servis.' },
  { q: 'Jak připravit mlžítko na zimu?', a: 'Před zimním obdobím je nutné odvodnit celý systém — vypustit vodu z trubek, čerpadla i filtrů, aby nedošlo k poškození mrazem. Podrobný postup zimování je součástí manuálu. Nabízíme také službu zimování v rámci servisní smlouvy.' },
  { q: 'Je nerezová konstrukce mlžítek odolná vůči vandalismu?', a: 'Ano. Materiál AISI 316L je velmi odolný vůči mechanickému poškození, UV záření i chemikáliím. Trysky jsou zapuštěny do trubkového systému. Na konstrukci poskytujeme záruku 5 let. V případě poškození vandaly lze většinou vyměnit pouze poškozený díl.' },
];

export default function ServisUdrzba() {
  const [openIdx, setOpenIdx] = useState(null);

  useEffect(() => {
    setSEO({
      title: 'Servis a údržba',
      description: 'Pravidelná údržba, zimní zazimování, technická podpora a nejčastější dotazy k servisu mlžných systémů HolmTec.',
      keywords: 'servis mlžení, údržba mlžný systém, zazimování mlhoviště, technická podpora',
      canonicalPath: '/servis-udrzba',
    });
  }, []);

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Podpora</p>
        <h1 className="text-4xl lg:text-5xl font-light text-slate-900 mb-6">Servis a údržba</h1>
        <p className="text-slate-500 text-lg leading-relaxed mb-12 max-w-2xl">
          Aby vám mlžný systém sloužil co nejdéle, doporučujeme dodržovat pravidelný servisní cyklus. Postaráme se
          o vaši instalaci od uvedení do provozu až po dlouhodobou podporu.
        </p>

        <div className="space-y-6 mb-16">
          {STEPS.map((s, i) => (
            <div key={i} className="flex gap-5 bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <div className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                <s.icon size={20} className="text-slate-700" />
              </div>
              <div>
                <h3 className="text-slate-900 font-medium text-lg mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-light text-slate-900 mb-6">Nejčastější dotazy k servisu a údržbě</h2>
        <div className="space-y-2 mb-12">
          {FAQ_ITEMS.map((item, idx) => (
            <FaqAccordionItem
              key={idx}
              question={item.q}
              answer={item.a}
              isOpen={openIdx === idx}
              onToggle={() => setOpenIdx(openIdx === idx ? null : idx)}
            />
          ))}
        </div>

        <div className="text-center">
          <Link to="/kontakt" className="btn-metallic-mist px-8 py-3 text-sm font-bold">
            Objednat servis
          </Link>
        </div>
      </div>
    </div>
  );
}