import React, { useState, useEffect } from 'react';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Wrench, Droplets, Package, Phone, Mail } from 'lucide-react';
import ReviewsSection from '@/components/reviews/ReviewsSection';
import FaqAccordionItem from '@/components/common/FaqAccordionItem';

const FAQ_SECTIONS = [
{
  id: 'instalace',
  icon: Package,
  title: 'Instalace mlžítek',
  items: [
  {
    q: 'Jak dlouho trvá instalace mlžítka?',
    a: 'Standardní instalace mlžítek trvá zpravidla jeden pracovní den. Závisí to na typu mlžítka, způsobu ukotvení (zemní patka nebo příruba) a přípravě místa. U větších instalací s více prvky počítejte s 2–3 dny.'
  },
  {
    q: 'Co je potřeba připravit před instalací mlžítek?',
    a: 'Před instalací je nutné zajistit přívod vody (min. 3 bar, ideálně 4–6 bar), zdroj elektrické energie 230 V pro čerpadlo a řídící jednotku, a připravit základy dle výkresové dokumentace, kterou dodáváme.'
  },
  {
    q: 'Mohu si mlžítka nainstalovat sám?',
    a: 'Jednodušší modely (START, PARK) jsou navrženy tak, aby je zvládl instalovat zkušený řemeslník. Pro složitější mlžné sochy a rozsáhlejší nízkotlaké systémy doporučujeme naši servisní instalaci — zajistíme správné nastavení tlaku v rozsahu 3–8 barů, trysek a řídící elektroniky.'
  },
  {
    q: 'Na jaký typ povrchu lze mlžítka instalovat?',
    a: 'Mlžítka lze kotvit do betonu, asfaltu, dlažby i přírodního povrchu. Dodáváme různé typy patek a přírub. Pro instalaci do stávající dlažby nabízíme minimálně invazivní řešení s vrtanou kotvou.'
  },
  {
    q: 'Lze mlžítka přemístit na jiné místo?',
    a: 'Ano. Produkty s přírubovým uchycením lze demontovat a přemístit relativně snadno. Zemní patky jsou trvalejší instalací, ale i ty lze s odbornou pomocí přemístit. Kontaktujte nás pro posouzení konkrétního případu.'
  }]

},
{
  id: 'udrzba',
  icon: Wrench,
  title: 'Údržba a servis mlžidel',
  items: [
  {
    q: 'Jak často je potřeba mlžítka servisovat?',
    a: 'Doporučujeme základní servis jednou ročně — vždy na začátku nebo konci sezóny. Servis zahrnuje kontrolu a čištění trysek, kontrolu tlakového čerpadla, filtrů a elektrické části. Nabízíme roční servisní smlouvy.'
  },
  {
    q: 'Jak čistit trysky mlžítek?',
    a: 'Trysky z AISI 316L jsou odolné vůči usazování vodního kamene. Při používání tvrdé vody doporučujeme instalaci změkčovacího filtru. Trysky lze ručně demontovat a propláchnout citrovým roztokem. Podrobný postup je součástí manuálu.'
  },
  {
    q: 'Co dělat, když mlžítko přestane mlžit?',
    a: 'Nejprve zkontrolujte přívod vody a tlak (min. 3 bar). Poté zkontrolujte filtr před čerpadlem — může být ucpaný. Dále ověřte, zda je čerpadlo v provozu a zda řídící jednotka signalizuje chybu. Pokud problém přetrvává, kontaktujte náš servis.'
  },
  {
    q: 'Jak připravit mlžítko na zimu?',
    a: 'Před zimním obdobím je nutné odvodnit celý systém — vypustit vodu z trubek, čerpadla i filtrů, aby nedošlo k poškození mrazem. Podrobný postup zimování je součástí manuálu. Nabízíme také službu zimování v rámci servisní smlouvy.'
  },
  {
    q: 'Je nerezová konstrukce mlžítek odolná vůči vandalismu?',
    a: 'Ano. Materiál AISI 316L je velmi odolný vůči mechanickému poškození, UV záření i chemikáliím. Trysky jsou zapuštěny do trubkového systému. Na konstrukci poskytujeme záruku 5 let. V případě poškození vandaly lze většinou vyměnit pouze poškozený díl.'
  }]

},
{
  id: 'spotrebaVody',
  icon: Droplets,
  title: 'Spotřeba vody a provoz mlžítek',
  items: [
  {
    q: 'Jaká je spotřeba vody mlžítka za hodinu?',
    a: 'Spotřeba závisí na počtu trysek mlžítka a provozním tlaku. Orientačně: malé mlžítko (2–4 trysky) spotřebuje cca 20–60 l/hod. Středně velká instalace (8–12 trysek) cca 80–150 l/hod. Velká mlžná socha s 20+ tryskami může spotřebovat 200–400 l/hod. Přesné údaje jsou v technickém listu každého produktu.'
  },
  {
    q: 'Padá voda na zem a tvoří se louže?',
    a: 'Ne. Trysky rozptylují kapičky o velikosti 10–50 μm, které se okamžitě odpaří ve vzduchu (evaporativní chlazení). Za normálních podmínek (teplota nad 20 °C, nízká vzdušná vlhkost) se voda zcela odpaří a na zemi nezůstávají louže ani mokré povrchy.'
  },
  {
    q: 'Jaký tlak vody je potřeba pro mlžítka?',
    a: 'Pro nízkotlaké mlžení postačí standardní přívod z vodovodní sítě v rozsahu 3–8 barů. Přesný provozní tlak se nastavuje podle typu instalace, počtu trysek a požadovaného efektu mlžení.'
  },
  {
    q: 'Lze použít dešťovou nebo recyklovanou vodu?',
    a: 'Je to možné, ale vyžaduje kvalitní filtraci — alespoň mechanický filtr 5 μm a UV dezinfekci. Nedoporučujeme používat chlorovanou vodu ve vysoké koncentraci (poškozuje trysky). Pro konkrétní doporučení rádi zpracujeme analýzu vaší vody.'
  },
  {
    q: 'Jaká je spotřeba elektrické energie?',
    a: 'Nízkotlaký systém má nízké energetické nároky podle rozsahu instalace. Řídící jednotka s displejem spotřebuje cca 10–20 W. Celkový roční provoz při průměrném využití (3–4 hodiny denně, 120 dnů v roce) odpovídá spotřebě běžného vysavače.'
  }]

}];


export default function Podpora() {
  const [openItems, setOpenItems] = useState({});
  useEffect(() => {
    const faqJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_SECTIONS.flatMap((s) => s.items).map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a }
      }))
    };
    setSEO({ ...SEO_PAGES.podpora, canonicalPath: window.location.pathname === '/faq' ? '/faq' : '/podpora', jsonLd: faqJsonLd });
  }, []);

  const toggle = (sectionId, idx) => {
    const key = `${sectionId}-${idx}`;
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-white pt-28">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold text-techblue mb-4">Podpora</p>
          <h1 className="font-heading font-light text-4xl lg:text-6xl text-slate-900 tracking-tight mb-4" style={{ letterSpacing: '-0.03em' }}>
            Nejčastější dotazy
          </h1>
          <p className="text-slate-500 max-w-xl leading-relaxed font-light">
            Odpovědi na nejčastější otázky ohledně instalace, údržby a provozu mlžných systémů, mlžítek - Mlžidla.cz. Nenašli jste odpověď? Kontaktujte nás.
          </p>
        </motion.div>

        {/* Category anchors */}
        <div className="flex flex-wrap gap-3 mt-8">
          {FAQ_SECTIONS.map((s) =>
          <a
            key={s.id}
            href={`#${s.id}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 text-sm font-medium text-slate-600 transition-all hover:bg-slate-200">
            
              <s.icon size={13} />
              {s.title}
            </a>
          )}
        </div>
      </div>

      {/* FAQ Sections */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-24 space-y-16">
        {FAQ_SECTIONS.map((section, si) =>
        <motion.section
          key={section.id}
          id={section.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: si * 0.05 }}>
          
            {/* Section header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                <section.icon size={20} className="size-20 text-slate-00" />
              </div>
              <div>
                <h2 className="font-heading font-light text-slate-900 tracking-tight text-xxl">{section.title}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{section.items.length} otázek</p>
              </div>
            </div>

            {/* FAQ items */}
            <div className="space-y-2">
              {section.items.map((item, idx) =>
            <FaqAccordionItem
              key={idx}
              question={item.q}
              answer={item.a}
              isOpen={!!openItems[`${section.id}-${idx}`]}
              onToggle={() => toggle(section.id, idx)} />

            )}
            </div>
          </motion.section>
        )}

        <ReviewsSection />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-10 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          <div>
            <h3 className="font-heading font-light text-xl text-slate-900 tracking-tight mb-2">Nenašli jste odpověď?</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">Obraťte se přímo na náš tým — rádi zodpovíme jakýkoliv dotaz.</p>
            <div className="flex flex-col sm:flex-row gap-4 text-sm text-slate-500">
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
            className="btn-metallic-mist shrink-0 px-7 py-3.5 text-sm font-bold whitespace-nowrap">
            
            Nezávazná poptávka <ArrowRight size={15} />
          </Link>
        </motion.div>
      </div>
    </div>);

}