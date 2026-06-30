import React, { useState, useEffect } from 'react';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Wrench, Droplets, Package, Phone, Mail } from 'lucide-react';

const FAQ_SECTIONS = [
  {
    id: 'instalace',
    icon: Package,
    title: 'Instalace',
    color: 'text-cyan',
    bg: 'bg-cyan/10',
    border: 'border-cyan/20',
    items: [
      {
        q: 'Jak dlouho trvá instalace mlžítka?',
        a: 'Standardní instalace trvá zpravidla jeden pracovní den. Závisí to na typu produktu, způsobu ukotvení (zemní patka nebo příruba) a přípravě místa. U větších instalací s více prvky počítejte s 2–3 dny.',
      },
      {
        q: 'Co je potřeba připravit před instalací?',
        a: 'Před instalací je nutné zajistit přívod vody (min. 3 bar, ideálně 4–6 bar), zdroj elektrické energie 230 V pro čerpadlo a řídící jednotku, a připravit základy dle výkresové dokumentace, kterou dodáváme.',
      },
      {
        q: 'Mohu si mlžítko nainstalovat sám?',
        a: 'Jednodušší modely (START, PARK) jsou navrženy tak, aby je zvládl instalovat zkušený řemeslník. Pro složitější mlžné sochy a systémy s vysokotlakým čerpadlem doporučujeme naši servisní instalaci — zajistíme správné nastavení tlaku, tryskového systému a řídící elektroniky.',
      },
      {
        q: 'Na jaký typ povrchu lze mlžítko instalovat?',
        a: 'Mlžítka lze kotvit do betonu, asfaltu, dlažby i přírodního povrchu. Dodáváme různé typy patek a přírub. Pro instalaci do stávající dlažby nabízíme minimálně invazivní řešení s vrtanou kotvou.',
      },
      {
        q: 'Lze mlžítko přemístit na jiné místo?',
        a: 'Ano. Produkty s přírubovým uchycením lze demontovat a přemístit relativně snadno. Zemní patky jsou trvalejší instalací, ale i ty lze s odbornou pomocí přemístit. Kontaktujte nás pro posouzení konkrétního případu.',
      },
    ],
  },
  {
    id: 'udrzba',
    icon: Wrench,
    title: 'Údržba a servis',
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    items: [
      {
        q: 'Jak často je potřeba mlžítko servisovat?',
        a: 'Doporučujeme základní servis jednou ročně — vždy na začátku nebo konci sezóny. Servis zahrnuje kontrolu a čištění trysek, kontrolu tlakového čerpadla, filtrů a elektrické části. Nabízíme roční servisní smlouvy.',
      },
      {
        q: 'Jak čistit trysky?',
        a: 'Trysky z AISI 316L jsou odolné vůči usazování vodního kamene. Při používání tvrdé vody doporučujeme instalaci změkčovacího filtru. Trysky lze ručně demontovat a propláchnout citrovým roztokem. Podrobný postup je součástí manuálu.',
      },
      {
        q: 'Co dělat, když mlžítko přestane mlžit?',
        a: 'Nejprve zkontrolujte přívod vody a tlak (min. 3 bar). Poté zkontrolujte filtr před čerpadlem — může být ucpaný. Dále ověřte, zda je čerpadlo v provozu a zda řídící jednotka signalizuje chybu. Pokud problém přetrvává, kontaktujte náš servis.',
      },
      {
        q: 'Jak připravit mlžítko na zimu?',
        a: 'Před zimním obdobím je nutné odvodnit celý systém — vypustit vodu z trubek, čerpadla i filtrů, aby nedošlo k poškození mrazem. Podrobný postup zimování je součástí manuálu. Nabízíme také službu zimování v rámci servisní smlouvy.',
      },
      {
        q: 'Je nerezová konstrukce odolná vůči vandalismu?',
        a: 'Ano. Materiál AISI 316L je velmi odolný vůči mechanickému poškození, UV záření i chemikáliím. Trysky jsou zapuštěny do trubkového systému. Na konstrukci poskytujeme záruku 5 let. V případě poškození vandaly lze většinou vyměnit pouze poškozený díl.',
      },
    ],
  },
  {
    id: 'spotrebaVody',
    icon: Droplets,
    title: 'Spotřeba vody a provoz',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    items: [
      {
        q: 'Jaká je spotřeba vody mlžítka za hodinu?',
        a: 'Spotřeba závisí na počtu trysek a provozním tlaku. Orientačně: malé mlžítko (2–4 trysky) spotřebuje cca 20–60 l/hod. Středně velká instalace (8–12 trysek) cca 80–150 l/hod. Velká mlžná socha s 20+ tryskami může spotřebovat 200–400 l/hod. Přesné údaje jsou v technickém listu každého produktu.',
      },
      {
        q: 'Padá voda na zem a tvoří se louže?',
        a: 'Ne. Trysky rozptylují kapičky o velikosti 10–50 μm, které se okamžitě odpaří ve vzduchu (evaporativní chlazení). Za normálních podmínek (teplota nad 20 °C, nízká vzdušná vlhkost) se voda zcela odpaří a na zemi nezůstávají louže ani mokré povrchy.',
      },
      {
        q: 'Jaký tlak vody je potřeba?',
        a: 'Standardní přívod z vodovodní sítě (3–6 bar) postačí pro systémy s interním vysokotlakým čerpadlem. Čerpadlo zvýší tlak na 50–70 bar, který je potřebný pro správnou atomizaci kapének. Systémy bez vlastního čerpadla vyžadují min. 4 bar vstupního tlaku.',
      },
      {
        q: 'Lze použít dešťovou nebo recyklovanou vodu?',
        a: 'Je to možné, ale vyžaduje kvalitní filtraci — alespoň mechanický filtr 5 μm a UV dezinfekci. Nedoporučujeme používat chlorovanou vodu ve vysoké koncentraci (poškozuje trysky). Pro konkrétní doporučení rádi zpracujeme analýzu vaší vody.',
      },
      {
        q: 'Jaká je spotřeba elektrické energie?',
        a: 'Vysokotlaké čerpadlo má příkon typicky 300–900 W podle výkonu. Řídící jednotka s displejem spotřebuje cca 10–20 W. Celkový roční provoz při průměrném využití (3–4 hodiny denně, 120 dnů v roce) odpovídá spotřebě běžného vysavače.',
      },
    ],
  },
];

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className={`border border-white/10 rounded-xl overflow-hidden transition-colors ${isOpen ? 'bg-card_bg border-white/20' : 'bg-white/[0.02] hover:bg-white/[0.04]'}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className={`text-sm font-medium leading-snug transition-colors ${isOpen ? 'text-white' : 'text-white/70'}`}>
          {item.q}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-white/30 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="px-6 pb-5 text-sm text-white/55 leading-relaxed font-light border-t border-white/8 pt-4">
              {item.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Podpora() {
  const [openItems, setOpenItems] = useState({});
  useEffect(() => { setSEO(SEO_PAGES.podpora); }, []);

  const toggle = (sectionId, idx) => {
    const key = `${sectionId}-${idx}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-ink pt-28">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-4">PODPORA</p>
          <h1 className="font-heading text-4xl lg:text-6xl text-white tracking-tight mb-4" style={{ fontWeight: 800, letterSpacing: '-0.04em' }}>
            Nejčastější dotazy
          </h1>
          <p className="text-white/50 max-w-xl leading-relaxed">
            Odpovědi na nejčastější otázky ohledně instalace, údržby a provozu mlžných systémů HolmTec. Nenašli jste odpověď? Kontaktujte nás.
          </p>
        </motion.div>

        {/* Category anchors */}
        <div className="flex flex-wrap gap-3 mt-8">
          {FAQ_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-mono tracking-widest uppercase transition-all hover:bg-white/5 ${s.border} ${s.color}`}
            >
              <s.icon size={13} />
              {s.title}
            </a>
          ))}
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-24 space-y-16">
        {FAQ_SECTIONS.map((section, si) => (
          <motion.section
            key={section.id}
            id={section.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: si * 0.05 }}
          >
            {/* Section header */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-11 h-11 rounded-xl ${section.bg} border ${section.border} flex items-center justify-center`}>
                <section.icon size={20} className={section.color} />
              </div>
              <div>
                <h2 className="text-white text-xl" style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>{section.title}</h2>
                <p className="text-xs font-mono text-white/30 mt-0.5">{section.items.length} otázek</p>
              </div>
            </div>

            {/* FAQ items */}
            <div className="space-y-2">
              {section.items.map((item, idx) => (
                <FaqItem
                  key={idx}
                  item={item}
                  isOpen={!!openItems[`${section.id}-${idx}`]}
                  onToggle={() => toggle(section.id, idx)}
                />
              ))}
            </div>
          </motion.section>
        ))}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-10 rounded-2xl bg-cyan/5 border border-cyan/20 flex flex-col lg:flex-row items-center justify-between gap-8"
        >
          <div>
            <h3 className="text-white text-xl mb-2" style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>Nenašli jste odpověď?</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-4">Obraťte se přímo na náš tým — rádi zodpovíme jakýkoliv dotaz.</p>
            <div className="flex flex-col sm:flex-row gap-4 text-sm font-mono text-white/50">
              <a href="tel:+420774700390" className="flex items-center gap-2 hover:text-cyan transition-colors">
                <Phone size={13} className="text-cyan" /> +420 774 700 390
              </a>
              <a href="mailto:obchod1@holmtec.cz" className="flex items-center gap-2 hover:text-cyan transition-colors">
                <Mail size={13} className="text-cyan" /> obchod1@holmtec.cz
              </a>
            </div>
          </div>
          <Link
            to="/poptavka"
            className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/25 whitespace-nowrap"
          >
            Nezávazná poptávka <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}