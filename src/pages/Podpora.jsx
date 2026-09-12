import React, { useState, useEffect } from 'react';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Wrench, Droplets, Package, Phone, Mail } from 'lucide-react';
import ReviewsSection from '@/components/reviews/ReviewsSection';

const FAQ_SECTIONS = [
  {
    id: 'instalace',
    icon: Package,
    title: 'Instalace mlžítek',
    items: [
      {
        q: 'Jak dlouho trvá instalace mlžítka?',
        a: 'Standardní instalace mlžítek trvá zpravidla jeden pracovní den. Závisí to na typu mlžítka, způsobu ukotvení (zemní patka nebo příruba) a přípravě místa. U větších instalací s více prvky počítejte s 2–3 dny.',
      },
      {
        q: 'Co je potřeba připravit před instalací mlžítek?',
        a: 'Základem je přívod pitné vody v místě instalace a připravenost kotvení podle zvoleného řešení. Většina našich nízkotlakých mlžítek pracuje přímo z vodovodního řadu bez samostatného vysokotlakého čerpadla. Elektrické napájení je potřeba jen pro zvolené chytré ovládání nebo další aktivní prvky.',
      },
      {
        q: 'Mohu si mlžítka nainstalovat sám?',
        a: 'U jednodušších typových prvků lze instalaci provést podle dodané technické dokumentace zkušenou realizační firmou. U městských, dětských a atypických instalací doporučujeme naši montáž nebo technický dohled — ověříme kotvení, přívod vody, trysky i nastavení chytrého řízení.',
      },
      {
        q: 'Na jaký typ povrchu lze mlžítka instalovat?',
        a: 'Mlžítka lze kotvit do betonu, asfaltu, dlažby i přírodního povrchu. Dodáváme různé typy patek a přírub. Pro instalaci do stávající dlažby nabízíme minimálně invazivní řešení s vrtanou kotvou.',
      },
      {
        q: 'Lze mlžítka přemístit na jiné místo?',
        a: 'Ano. Produkty s přírubovým uchycením lze demontovat a přemístit relativně snadno. Zemní patky jsou trvalejší instalací, ale i ty lze s odbornou pomocí přemístit. Kontaktujte nás pro posouzení konkrétního případu.',
      },
    ],
  },
  {
    id: 'udrzba',
    icon: Wrench,
    title: 'Údržba a servis mlžidel',
    items: [
      {
        q: 'Jak často je potřeba mlžítka servisovat?',
        a: 'Doporučujeme základní kontrolu minimálně jednou ročně, ideálně před hlavní sezónou. Servis zahrnuje kontrolu a čištění trysek, filtrů, přívodu vody, ventilů a případného chytrého řízení. U veřejných instalací lze nastavit pravidelný servisní režim.',
      },
      {
        q: 'Jak čistit trysky mlžítek?',
        a: 'Trysky z AISI 316L jsou odolné vůči usazování vodního kamene. Při používání tvrdé vody doporučujeme instalaci změkčovacího filtru. Trysky lze ručně demontovat a propláchnout citrovým roztokem. Podrobný postup je součástí manuálu.',
      },
      {
        q: 'Co dělat, když mlžítko přestane mlžit?',
        a: 'Nejprve zkontrolujte přívod vody, uzavírací nebo chytrý ventil a filtr. Poté ověřte, zda nejsou zanesené jednotlivé trysky. Pokud používáte SUPLA nebo TUYA, zkontrolujte také stav ovládání a nastavený scénář. Pokud problém přetrvává, kontaktujte servis.',
      },
      {
        q: 'Jak připravit mlžítko na zimu?',
        a: 'Před zimním obdobím je nutné odvodnit celý systém — vypustit vodu z trubek, čerpadla i filtrů, aby nedošlo k poškození mrazem. Podrobný postup zimování je součástí manuálu. Nabízíme také službu zimování v rámci servisní smlouvy.',
      },
      {
        q: 'Je nerezová konstrukce mlžítek odolná vůči vandalismu?',
        a: 'Ano. Materiál AISI 316L je velmi odolný vůči mechanickému poškození, UV záření i chemikáliím. Trysky jsou zapuštěny do trubkového systému. Na konstrukci poskytujeme záruku 5 let. V případě poškození vandaly lze většinou vyměnit pouze poškozený díl.',
      },
    ],
  },
  {
    id: 'spotrebaVody',
    icon: Droplets,
    title: 'Spotřeba vody a provoz mlžítek',
    items: [
      {
        q: 'Jaká je spotřeba vody mlžítka za hodinu?',
        a: 'Spotřeba závisí na počtu trysek mlžítka a provozním tlaku. Orientačně: malé mlžítko (2–4 trysky) spotřebuje cca 20–60 l/hod. Středně velká instalace (8–12 trysek) cca 80–150 l/hod. Velká mlžná socha s 20+ tryskami může spotřebovat 200–400 l/hod. Přesné údaje jsou v technickém listu každého produktu.',
      },
      {
        q: 'Padá voda na zem a tvoří se louže?',
        a: 'Správně navržené mlžení vytváří velmi jemné kapky přibližně 50–100 μm a je nastavené tak, aby se velká část vody odpařila ve vzduchu. Výsledný efekt závisí na teplotě, vlhkosti, větru, počtu trysek a jejich umístění. Návrh proto vždy přizpůsobujeme konkrétnímu prostoru.',
      },
      {
        q: 'Jaký tlak vody je potřeba pro mlžítka?',
        a: 'Naše hlavní produktové řady jsou navržené jako nízkotlaké řešení napojené přímo na vodovodní síť bez vysokotlakého čerpadla. Konkrétní požadovaný tlak ověřujeme podle počtu trysek, délky rozvodů a místních podmínek. Před realizací doporučujeme změřit dostupný tlak a průtok.',
      },
      {
        q: 'Lze použít dešťovou nebo recyklovanou vodu?',
        a: 'Je to možné, ale vyžaduje kvalitní filtraci — alespoň mechanický filtr 5 μm a UV dezinfekci. Nedoporučujeme používat chlorovanou vodu ve vysoké koncentraci (poškozuje trysky). Pro konkrétní doporučení rádi zpracujeme analýzu vaší vody.',
      },
      {
        q: 'Jaká je spotřeba elektrické energie?',
        a: 'Samotné nízkotlaké mlžítko nevyžaduje elektrický příkon čerpadla. Elektřina je potřeba pouze pro zvolené ovládání, například Wi‑Fi ventil SUPLA nebo TUYA a případné doplňkové prvky. Díky tomu zůstává provoz technicky jednoduchý a energeticky úsporný.',
      },
    ],
  },
];

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${isOpen ? 'bg-white border-slate-300' : 'bg-slate-50 border-slate-200 hover:bg-slate-100/60'}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className={`text-sm font-medium leading-snug transition-colors ${isOpen ? 'text-slate-900' : 'text-slate-600'}`}>
          {item.q}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-slate-900' : ''}`}
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
            <div className="px-6 pb-5 text-sm text-slate-500 leading-relaxed font-light border-t border-slate-200 pt-4">
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
  useEffect(() => {
    const faqJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_SECTIONS.flatMap((s) => s.items).map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    };
    setSEO({ ...SEO_PAGES.podpora, jsonLd: faqJsonLd });
  }, []);

  const toggle = (sectionId, idx) => {
    const key = `${sectionId}-${idx}`;
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-white pt-28">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-8 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-cyan-50/50 p-7 shadow-sm lg:grid-cols-[1.3fr_.7fr] lg:p-10">
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-cyan-700 mb-4">Podpora MLŽIDLA.cz</p>
            <h1 className="font-heading font-light text-4xl lg:text-6xl text-slate-900 tracking-tight mb-4" style={{ letterSpacing: '-0.03em' }}>
              Odpovědi, servis a technická pomoc na jednom místě.
            </h1>
            <p className="text-slate-500 max-w-2xl leading-relaxed font-light">
              Rychlá orientace pro investory, správce, architekty i realizační firmy. Instalace, údržba, spotřeba vody, chytré ovládání i příprava místa bez zbytečného technického balastu.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <Link to="/servis-udrzba" className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"><Wrench size={19} className="mb-3 text-cyan-700" /><p className="font-semibold text-slate-900">Servis a údržba</p><p className="mt-1 text-xs leading-relaxed text-slate-500">Sezónní kontrola, čištění a řešení provozních stavů.</p></Link>
            <Link to="/ke-stazeni" className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"><Package size={19} className="mb-3 text-cyan-700" /><p className="font-semibold text-slate-900">Dokumentace</p><p className="mt-1 text-xs leading-relaxed text-slate-500">Manuály, podklady a technické informace pro projekt.</p></Link>
            <Link to="/smart-ovladani" className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md"><Droplets size={19} className="mb-3 text-cyan-700" /><p className="font-semibold text-slate-900">Chytré ovládání</p><p className="mt-1 text-xs leading-relaxed text-slate-500">SUPLA / TUYA, časové scénáře a řízení provozu.</p></Link>
          </div>
        </motion.div>

        {/* Category anchors */}
        <div className="flex flex-wrap gap-3 mt-8">
          {FAQ_SECTIONS.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-xs font-mono tracking-widest uppercase text-slate-600 transition-all hover:bg-slate-50 hover:border-slate-300"
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
              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                <section.icon size={20} className="text-slate-700" />
              </div>
              <div>
                <h2 className="font-heading font-light text-xl text-slate-900 tracking-tight">{section.title}</h2>
                <p className="text-xs font-mono text-slate-400 mt-0.5">{section.items.length} otázek</p>
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

        <ReviewsSection />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-10 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-8"
        >
          <div>
            <h3 className="font-heading font-light text-xl text-slate-900 tracking-tight mb-2">Nenašli jste odpověď?</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">Obraťte se přímo na náš tým — rádi zodpovíme jakýkoliv dotaz.</p>
            <div className="flex flex-col sm:flex-row gap-4 text-sm font-mono text-slate-500">
              <a href="tel:+420774700390" className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                <Phone size={13} /> +420 774 700 390
              </a>
              <a href="mailto:obchod1@holmtec.cz" className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                <Mail size={13} /> obchod1@holmtec.cz
              </a>
            </div>
          </div>
          <Link
            to="/poptavka"
            className="btn-metallic-mist shrink-0 px-7 py-3.5 text-sm font-bold whitespace-nowrap"
          >
            Nezávazná poptávka <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}