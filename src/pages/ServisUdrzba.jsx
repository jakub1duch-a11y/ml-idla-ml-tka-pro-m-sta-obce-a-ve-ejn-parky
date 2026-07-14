import React, { useState, useEffect } from 'react';
import { Wrench, Snowflake, Headphones, Download, ChevronDown } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NOZZLE_PDF = 'https://media.base44.com/files/public/6a3ee88c10959cd3588c4d68/96db07d39_drbatrysek.pdf';
const NOZZLE_IMG = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/af0d47654_drbatrysek.png';

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

function FaqItem({ q, a, isOpen, onToggle, idx }) {
  return (
    <div className={`rounded-2xl border transition-all ${isOpen ? 'border-slate-300 bg-white shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
      <button onClick={onToggle} className="w-full flex items-start gap-4 px-6 py-5 text-left">
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 text-slate-500 text-xs font-mono flex items-center justify-center mt-0.5">{String(idx + 1).padStart(2,'0')}</span>
        <span className="flex-1 text-slate-900 font-medium text-sm leading-snug pr-2">{q}</span>
        <ChevronDown size={18} className={`flex-shrink-0 text-slate-400 mt-0.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div key="answer" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            <p className="px-6 pb-5 text-sm text-slate-500 font-light leading-relaxed border-t border-slate-100 pt-4 ml-11">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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

        {/* Nozzle maintenance section */}
        <div className="mb-16 rounded-3xl overflow-hidden border border-slate-200 bg-slate-50">
          <div className="px-6 lg:px-8 pt-8 pb-4">
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-2">Postup čištění</p>
            <h2 className="text-2xl font-light text-slate-900 mb-1">Údržba mlžících trysek</h2>
            <p className="text-sm text-slate-500 font-light mb-6 max-w-xl">
              Pokud dojde ke snížení výkonu trysky, ucpání nebo usazení vodního kamene, proveďte vyčištění dle níže uvedeného postupu.
            </p>
          </div>
          <div className="px-6 lg:px-8 pb-8">
            <img src={NOZZLE_IMG} alt="Údržba mlžících trysek — postup čištění"
              className="w-full max-w-2xl rounded-2xl border border-slate-200 shadow-sm mb-6" loading="lazy" />
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={NOZZLE_PDF} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all w-fit">
                <Download size={15} /> Stáhnout PDF manuál
              </a>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="px-2 py-1 bg-amber-50 border border-amber-200 text-amber-600 rounded-full">Tip:</span>
                Používejte ocet nebo kyselinu citronovou — nepoužívejte ocelové kartáče.
              </div>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-2">Podpora</p>
          <h2 className="text-2xl font-light text-slate-900 mb-6">Nejčastější dotazy k servisu a údržbě</h2>
        </div>
        <div className="space-y-2 mb-12">
          {FAQ_ITEMS.map((item, idx) => (
            <FaqItem key={idx} q={item.q} a={item.a} idx={idx} isOpen={openIdx === idx} onToggle={() => setOpenIdx(openIdx === idx ? null : idx)} />
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