import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import { Link } from 'react-router-dom';

const FAQS = [
  { q: 'Jaká je velikost kapiček mlhy?', a: 'Naše systémy pracují s kapičkami o velikosti 10–50 mikronů. Tak jemná mlha se odpařuje dříve, než dopadne na zem nebo na osoby — prostor tak ochladíte, aniž by bylo cokoliv mokré.' },
  { q: 'Jaká je spotřeba vody?', a: 'Spotřeba se liší dle modelu a počtu trysek, typicky od 2 do 15 litrů za hodinu. Přesnou hodnotu najdete v technickém listu konkrétního produktu.' },
  { q: 'Jak náročná je údržba?', a: 'Systémy jsou navrženy na minimální údržbu — doporučujeme kontrolu trysek a filtrů 1–2× ročně. Na zimu je nutné systém zazimovat (viz stránka Servis a údržba).' },
  { q: 'Je mlžení bezpečné pro děti?', a: 'Ano. Používáme potravinářskou nerezovou ocel AISI 316L a čistou vodu bez chemie, systémy jsou proto bezpečné i na dětských hřištích.' },
  { q: 'Jak probíhá objednávka?', a: 'Vše začíná nezávaznou poptávkou — na základě vašeho prostoru a požadavků připravíme návrh a cenovou nabídku, po odsouhlasení následuje výroba a instalace.' },
  { q: 'Lze systém provozovat celoročně?', a: 'V zimním období je nutné systém odstavit a zazimovat, aby nedošlo k poškození mrazem. Provoz je určen především pro teplé měsíce.' },
  { q: 'Jak dlouho trvá výroba a dodání?', a: 'Standardní doba výroby je 4–8 týdnů od odsouhlasení nabídky, v závislosti na rozsahu zakázky a aktuální vytíženosti výroby.' },
  { q: 'Nabízíte i instalaci?', a: 'Ano, v rámci realizace zajišťujeme i montáž a zapojení systému, případně předáme detailní instalační manuál pro vlastní realizaci.' },
];

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-white/10">
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 py-6 text-left">
        <span className="text-white font-medium text-lg">{item.q}</span>
        {isOpen ? <Minus size={20} className="text-cyan flex-shrink-0" /> : <Plus size={20} className="text-white/40 flex-shrink-0" />}
      </button>
      {isOpen && <p className="text-white/60 leading-relaxed pb-6 pr-8">{item.a}</p>}
    </div>
  );
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    setSEO({
      title: 'Časté dotazy',
      description: 'Odpovědi na nejčastější otázky o mlžných systémech HolmTec: technické parametry, spotřeba vody, údržba a proces objednávky.',
      keywords: 'FAQ mlžení, časté dotazy mlžné systémy, otázky mlhoviště, objednávka mlžná socha',
      canonicalPath: '/faq',
    });
  }, []);

  return (
    <div className="min-h-screen bg-ink pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-2">Podpora</p>
        <h1 className="text-4xl lg:text-5xl font-light text-white mb-4">Časté dotazy</h1>
        <p className="text-white/50 mb-10">Technické parametry, údržba systémů a proces objednávky vysvětlené na jednom místě.</p>

        <div>
          {FAQS.map((item, i) => (
            <FaqItem key={i} item={item} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
          ))}
        </div>

        <div className="mt-12 p-6 bg-card_bg border border-white/10 rounded-2xl text-center">
          <p className="text-white/70 mb-4">Nenašli jste odpověď na svou otázku?</p>
          <Link to="/kontakt" className="inline-block px-6 py-3 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all">
            Kontaktujte nás
          </Link>
        </div>
      </div>
    </div>
  );
}