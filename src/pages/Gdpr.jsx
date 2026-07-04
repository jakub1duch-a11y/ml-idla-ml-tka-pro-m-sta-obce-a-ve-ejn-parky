import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronDown } from 'lucide-react';
import { setSEO } from '@/lib/seo';

const SECTIONS = [
  {
    id: 'spravce',
    title: 'Správce osobních údajů',
    content: `Správcem osobních údajů je společnost HolmTec s.r.o., se sídlem Trutnov, Česká republika, IČO: [27486893], zapsaná v obchodním rejstříku vedeném u Krajského soudu.

Kontaktní údaje správce:
• E-mail: obchod1@holmtec.cz
• Telefon: +420 774 700 390
• Web: https://mlzidla.cz`,
  },
  {
    id: 'jake-udaje',
    title: 'Jaké osobní údaje zpracováváme',
    content: `Zpracováváme pouze ty osobní údaje, které nám sami poskytnete prostřednictvím kontaktního formuláře nebo poptávkového formuláře na webu:

• Jméno a příjmení
• E-mailová adresa
• Telefonní číslo (nepovinné)
• Název firmy / organizace (nepovinné)
• Obsah vaší zprávy / poptávky

Dále automaticky shromažďujeme technická data prostřednictvím souborů cookie (viz sekce Cookies níže).`,
  },
  {
    id: 'ucel',
    title: 'Účel a právní základ zpracování',
    content: `Vaše osobní údaje zpracováváme pro tyto účely:

1. Odpověď na poptávku nebo dotaz (čl. 6 odst. 1 písm. b GDPR — plnění smlouvy nebo kroky před uzavřením smlouvy)
2. Zasílání obchodních sdělení — pouze se souhlasem (čl. 6 odst. 1 písm. a GDPR)
3. Sledování návštěvnosti webu pomocí Google Analytics 4 — anonymizovaně (oprávněný zájem)
4. Plnění zákonných povinností (čl. 6 odst. 1 písm. c GDPR)`,
  },
  {
    id: 'doba',
    title: 'Doba uchovávání údajů',
    content: `Osobní údaje uchováváme po dobu nezbytnou k naplnění účelu zpracování:

• Poptávky a dotazy: po dobu obchodního případu + 3 roky
• Obchodní sdělení: do odvolání souhlasu
• Účetní doklady: 10 let dle zákona
• Analytická data (Google Analytics): 14 měsíců (anonymizováno)

Po uplynutí doby uchovávání jsou data bezpečně smazána nebo anonymizována.`,
  },
  {
    id: 'prijemci',
    title: 'Příjemci a předávání údajů',
    content: `Vaše osobní údaje neprodáváme třetím stranám. Ke zpracování využíváme tyto ověřené zpracovatele:

• Google LLC (Google Analytics 4, Google Ads) — se sídlem v USA, přenos dat na základě standardních smluvních doložek
• Base44 Inc. — poskytovatel hostingové platformy
• E-mailové služby pro zasílání odpovědí na poptávky

Všichni zpracovatelé jsou vázáni zpracovatelskou smlouvou a povinností mlčenlivosti.`,
  },
  {
    id: 'prava',
    title: 'Vaše práva',
    content: `Jako subjekt údajů máte tato práva (uplatňujte je na: obchod1@holmtec.cz):

• Právo na přístup — zjistit, zda a jaké údaje o vás zpracováváme
• Právo na opravu — opravit nepřesné nebo neúplné údaje
• Právo na výmaz ("být zapomenut") — smazání údajů, pokud pominul účel zpracování
• Právo na omezení zpracování
• Právo na přenositelnost údajů
• Právo vznést námitku — zejména proti zpracování pro marketingové účely
• Právo odvolat souhlas — kdykoliv, bez uvedení důvodu
• Právo podat stížnost u dozorového úřadu — Úřad pro ochranu osobních údajů (www.uoou.cz)

Na vaši žádost odpovíme nejpozději do 30 dnů.`,
  },
  {
    id: 'cookies',
    title: 'Soubory cookie (Cookies)',
    content: `Náš web používá tyto typy cookies:

NEZBYTNÉ COOKIES (nelze odmítnout):
• Zajišťují základní funkce webu (přihlášení, bezpečnost)
• Platnost: relace / 1 rok

ANALYTICKÉ COOKIES (se souhlasem):
• Google Analytics 4 — sledování návštěvnosti (anonymizovaná IP)
• Google Ads — měření konverzí z reklam
• Platnost: 14 měsíců

Souhlas s analytickými cookies můžete kdykoliv odvolat vymazáním cookies v nastavení prohlížeče nebo kontaktováním správce.`,
  },
  {
    id: 'bezpecnost',
    title: 'Zabezpečení údajů',
    content: `Přijímáme přiměřená technická a organizační opatření k ochraně vašich osobních údajů před neoprávněným přístupem, ztrátou nebo zničením:

• Veškerá komunikace probíhá přes šifrované připojení HTTPS (TLS 1.3)
• Přístupy k databázím jsou omezeny na oprávněné osoby
• Pravidelné zálohy a monitorování bezpečnostních incidentů
• Zpracovatelé jsou certifikováni nebo splňují požadavky GDPR`,
  },
  {
    id: 'zmeny',
    title: 'Změny zásad ochrany osobních údajů',
    content: `Tyto zásady ochrany osobních údajů mohou být průběžně aktualizovány v souladu s platnou legislativou nebo změnami v našich službách.

Datum poslední aktualizace: 30. 6. 2026

Doporučujeme tuto stránku pravidelně navštěvovat. V případě podstatných změn vás budeme informovat e-mailem (pokud nám jej máte poskytnuto) nebo prominentním upozorněním na webu.`,
  },
];

function GdprSection({ section }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border border-white/10 rounded-xl overflow-hidden transition-colors ${open ? 'bg-card_bg border-white/20' : 'bg-white/[0.02] hover:bg-white/[0.04]'}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
        <span className={`text-sm font-medium transition-colors ${open ? 'text-white' : 'text-white/70'}`}>{section.title}</span>
        <ChevronDown size={16} className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-cyan' : 'text-white/30'}`} />
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-white/8 pt-4">
          <pre className="text-sm text-white/55 leading-relaxed font-body whitespace-pre-wrap">{section.content}</pre>
        </div>
      )}
    </div>
  );
}

export default function Gdpr() {
  useEffect(() => {
    setSEO({
      title: 'GDPR a zásady ochrany osobních údajů',
      description: 'Zásady ochrany osobních údajů HolmTec s.r.o. — jaké údaje zpracováváme, k jakému účelu a jaká máte práva dle nařízení GDPR.',
      canonicalPath: '/gdpr',
    });
  }, []);
  return (
    <div className="min-h-screen bg-ink pt-28">

      <div className="max-w-4xl mx-auto px-6 lg:px-10 pb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center">
              <Shield size={18} className="text-cyan" />
            </div>
            <p className="text-xs font-mono tracking-widest uppercase text-cyan">Ochrana osobních údajů</p>
          </div>
          <h1 className="font-heading text-4xl lg:text-5xl text-white mb-4" style={{ fontWeight: 800, letterSpacing: '-0.04em' }}>
            GDPR & Zásady ochrany<br />osobních údajů
          </h1>
          <p className="text-white/50 text-base leading-relaxed max-w-2xl">
            Vaše soukromí bereme vážně. Níže najdete kompletní informace o tom, jaké osobní údaje zpracováváme, proč a jak dlouho — v souladu s nařízením EU 2016/679 (GDPR) a zákonem č. 110/2019 Sb.
          </p>
          <p className="text-white/30 text-xs font-mono mt-4">Poslední aktualizace: 30. 6. 2026</p>
        </motion.div>

        <div className="space-y-2">
          {SECTIONS.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <GdprSection section={s} />
            </motion.div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-cyan/5 border border-cyan/20">
          <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-2">Kontakt pro uplatnění práv</p>
          <p className="text-sm text-white/60 leading-relaxed">
            Pro uplatnění vašich práv nebo jakékoliv dotazy ohledně zpracování osobních údajů nás kontaktujte na{' '}
            <a href="mailto:obchod1@holmtec.cz" className="text-cyan hover:underline">obchod1@holmtec.cz</a>
            {' '}nebo telefonicky na{' '}
            <a href="tel:+420774700390" className="text-cyan hover:underline">+420 774 700 390</a>.
          </p>
        </div>
      </div>
    </div>
  );
}