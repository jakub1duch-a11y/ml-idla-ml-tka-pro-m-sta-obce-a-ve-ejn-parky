import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { setSEO } from '@/lib/seo';
import { FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    id: 'zakladni-ustanoveni',
    title: 'I. Základní ustanovení',
    content: `Tyto všeobecné obchodní podmínky (dále jen „VOP") upravují smluvní vztahy mezi společností HolmTec s.r.o., IČO: 27486893, se sídlem Horní staré město 698, 541 02 Trutnov (dále jen „Prodávající") a fyzickými či právnickými osobami (dále jen „Kupující") při prodeji zboží a poskytování služeb prostřednictvím webového rozhraní na adrese mlzidla.cz.

Kupující odesláním závazné poptávky nebo objednávky potvrzuje, že se s těmito VOP seznámil a souhlasí s jejich zněním. Tyto VOP jsou dostupné na webových stránkách Prodávajícího.

Veškeré smluvní vztahy se řídí právním řádem České republiky. Věci neupravené těmito VOP se řídí příslušnými ustanoveními občanského zákoníku (zákon č. 89/2012 Sb.) a dalšími relevantními právními předpisy.`,
  },
  {
    id: 'uzavreni-smlouvy',
    title: 'II. Uzavření smlouvy',
    content: `Produkty prezentované na webu mlzidla.cz jsou vyráběny zakázkově dle specifikace Kupujícího. Poptávka odeslání prostřednictvím kontaktního formuláře nebo e-mailem není závaznou objednávkou, ale žádostí o zpracování cenové nabídky.

Kupní smlouva je uzavřena okamžikem písemného přijetí nabídky Kupujícím (potvrzením proforma faktury / objednávky) a připsáním zálohy ve výši 50 % z celkové ceny na účet Prodávajícího.

Prodávající si vyhrazuje právo odmítnout poptávku bez udání důvodu, zejména v případě technické nerealizovatelnosti, kapacitního vytížení nebo nesplnění podmínek Kupujícího.

Veškerá komunikace probíhá v českém jazyce, případně anglicky po dohodě stran.`,
  },
  {
    id: 'ceny-platby',
    title: 'III. Ceny a platební podmínky',
    content: `Ceny produktů jsou sdělovány individuálně na základě poptávky a liší se dle konfigurace, rozměrů, počtu trysek a povrchové úpravy. Orientační ceny jsou uváděny jako „cena od" a nezahrnují montáž, dopravu ani projektovou dokumentaci, pokud není výslovně uvedeno jinak.

Všechny ceny jsou uváděny v Kč (CZK) bez DPH. K cenám bude připočtena DPH ve výši platné ke dni zdanitelného plnění.

Platební podmínky:
• 50 % ceny splatných jako záloha při podpisu smlouvy / přijetí objednávky
• 50 % ceny splatných před expedicí hotového výrobku nebo dle dohody

Platba se provádí bezhotovostně na bankovní účet Prodávajícího uvedený na faktuře. Záloha je nevratná v případě zrušení objednávky Kupujícím po zahájení výroby.`,
  },
  {
    id: 'dodaci-podminky',
    title: 'IV. Dodací podmínky',
    content: `Zakázkové mlžné produkty jsou vyráběny v době 6–8 týdnů od uhrazení zálohy a potvrzení technické specifikace. Přesná dodací lhůta je vždy uvedena v potvrzení objednávky.

Způsoby předání:
• Osobní odběr v sídle Prodávajícího (Trutnov)
• Doručení přepravní službou — cena dopravy dle aktuálního ceníku
• Instalace na místě určení — dle dohody, příplatek za montáž

Prodávající je oprávněn dodat zboží i před uplynutím dohodnuté lhůty. Kupující je povinen zboží převzít a případné vady neprodleně oznámit.

Přechod nebezpečí škody na zboží přechází na Kupujícího okamžikem předání zboží prvnímu přepravci nebo osobním odběrem.`,
  },
  {
    id: 'zaruka-reklamace',
    title: 'V. Záruka a reklamační řád',
    content: `Prodávající poskytuje na veškeré produkty záruku v délce 24 měsíců od data předání zboží Kupujícímu, pokud není v konkrétní smlouvě dohodnuto jinak.

Záruka se nevztahuje na:
• Opotřebení způsobené běžným užíváním
• Poškození způsobené nevhodnou instalací provedenou v rozporu s instalačním manuálem
• Mechanické poškození způsobené vnějšími vlivy (vandalismus, nehody, přírodní katastrofy)
• Poškození způsobené užíváním produktu k jiným účelům, než ke kterým je určen (věšení, mechanická zátěž, lezení)
• Neodborné zásahy do produktu třetí stranou

Postup reklamace: Kupující je povinen reklamaci uplatnit písemně na e-mail obchod1@holmtec.cz s popisem vady, fotografickou dokumentací a číslem objednávky. Prodávající se k reklamaci vyjádří do 30 dnů od jejího obdržení.

V případě uznané reklamace zajistí Prodávající bezplatnou opravu, výměnu vadné části nebo slevu z kupní ceny dle závažnosti vady.`,
  },
  {
    id: 'odstoupeni',
    title: 'VI. Odstoupení od smlouvy',
    content: `Vzhledem k zakázkové povaze výrobků (produkty jsou vyráběny dle konkrétní specifikace Kupujícího) nevzniká Kupujícímu — spotřebiteli nárok na odstoupení od smlouvy ve lhůtě 14 dní dle § 1837 písm. d) občanského zákoníku, neboť zboží bylo upraveno dle přání Kupujícího.

Kupující — podnikatel může od smlouvy odstoupit pouze s písemným souhlasem Prodávajícího. V takovém případě je Kupující povinen uhradit Prodávajícímu vzniklé náklady na výrobu a materiál, minimálně ve výši uhrazené zálohy.

Prodávající je oprávněn od smlouvy odstoupit v případě výrazného nárůstu cen vstupů nebo při prokázané nemožnosti plnění. V takovém případě vrátí uhrazenou zálohu v plné výši.`,
  },
  {
    id: 'ochrana-udaju',
    title: 'VII. Ochrana osobních údajů',
    content: `Zpracování osobních údajů probíhá v souladu s Nařízením Evropského parlamentu a Rady (EU) 2016/679 (GDPR) a zákonem č. 110/2019 Sb., o zpracování osobních údajů.

Správcem osobních údajů je HolmTec s.r.o., IČO: 27486893. Osobní údaje jsou zpracovávány za účelem plnění smluvních závazků, vedení účetnictví a marketingové komunikace (pokud byl udělen souhlas).

Podrobné informace o zpracování osobních údajů jsou dostupné v dokumentu Ochrana osobních údajů (GDPR) na adrese mlzidla.cz/gdpr.

Kupující má právo na přístup ke svým osobním údajům, jejich opravu, výmaz, přenositelnost a právo podat stížnost u Úřadu pro ochranu osobních údajů (www.uoou.cz).`,
  },
  {
    id: 'zaverecna-ustanoveni',
    title: 'VIII. Závěrečná ustanovení',
    content: `Tyto VOP nabývají účinnosti dnem 1. 1. 2025 a jsou platné do jejich nahrazení novým zněním.

Prodávající si vyhrazuje právo VOP měnit. O změnách bude Kupující informován prostřednictvím webových stránek mlzidla.cz. Smluvní vztahy vzniklé před změnou VOP se řídí VOP platným v době vzniku smluvního vztahu.

Veškeré spory vzniklé v souvislosti s těmito VOP budou řešeny přednostně smírnou cestou. Nepodaří-li se spor vyřešit smírně, jsou příslušné soudy České republiky, a to místně příslušný soud dle sídla Prodávajícího.

Kupující — spotřebitel má právo využít platformu pro řešení sporů online (ODR) dostupnou na adrese: http://ec.europa.eu/consumers/odr/

Pro mimosoudní řešení spotřebitelských sporů je příslušná Česká obchodní inspekce (www.coi.cz).`,
  },
];

export default function ObchodniPodminky() {
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    setSEO({
      title: 'Obchodní podmínky — HolmTec s.r.o.',
      description: 'Všeobecné obchodní podmínky a reklamační řád HolmTec s.r.o. — výrobce mlžných soch a chladicích systémů. Platné od 1. 1. 2025.',
      keywords: 'obchodní podmínky HolmTec, reklamační řád mlžítka, VOP mlžné sochy, záruční podmínky mlhoviště',
      canonicalPath: '/obchodni-podminky',
    });
  }, []);

  return (
    <div className="min-h-screen bg-white pt-24 pb-24">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-3">Právní dokumenty</p>
          <h1 className="font-heading font-light text-4xl lg:text-5xl text-slate-900 tracking-tight mb-3">
            Všeobecné obchodní podmínky
          </h1>
          <p className="text-slate-500 font-light">HolmTec s.r.o. · Platné od 1. 1. 2025 · IČO: 27486893</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <span className="px-3 py-1.5 bg-slate-100 text-slate-500 text-xs font-mono rounded-full">VOP</span>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-500 text-xs font-mono rounded-full">Reklamační řád</span>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-500 text-xs font-mono rounded-full">Záruční podmínky</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
          {/* Navigation */}
          <div className="lg:sticky lg:top-24 self-start">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-3">Obsah</p>
            <nav className="space-y-0.5">
              {SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`} onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${activeSection === s.id ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                  <ChevronRight size={13} className="shrink-0" />
                  {s.title.replace(/^[IVX]+\.\s/, '')}
                </a>
              ))}
            </nav>
            <div className="mt-6 pt-6 border-t border-slate-200">
              <Link to="/gdpr" className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-900 transition-colors">
                <FileText size={14} /> GDPR a ochrana dat
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-10">
            {SECTIONS.map((s, i) => (
              <motion.section key={s.id} id={s.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <h2 className="font-heading font-medium text-slate-900 text-xl mb-4 pb-3 border-b border-slate-200">
                  {s.title}
                </h2>
                <div className="text-slate-600 text-sm leading-relaxed font-light space-y-3">
                  {s.content.split('\n\n').map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                </div>
              </motion.section>
            ))}

            {/* Footer contact */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-sm">
              <p className="font-medium text-slate-900 mb-1">Kontakt pro smluvní záležitosti</p>
              <p className="text-slate-500 font-light">HolmTec s.r.o. · Horní staré město 698, 541 02 Trutnov</p>
              <p className="text-slate-500 font-light">
                E-mail: <a href="mailto:obchod1@holmtec.cz" className="text-slate-900 hover:underline">obchod1@holmtec.cz</a>
                {' · '}Tel.: <a href="tel:+420774700390" className="text-slate-900 hover:underline">+420 774 700 390</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}