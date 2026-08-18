import React, { useEffect } from 'react';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Palette, Download, Mail, FileText, Box, Ruler } from 'lucide-react';
import CategoryInquiryForm from '@/components/kategorie/CategoryInquiryForm';
import B2BPortfolioNavigation from '@/components/kategorie/B2BPortfolioNavigation';
import SegmentReferenceShowcase from '@/components/kategorie/SegmentReferenceShowcase';
import { trackFunnelStep } from '@/lib/ga4';

const DOWNLOADS = [
  { icon: Box, title: 'Projektové podklady', desc: '2D/3D a BIM podklady podle konkrétního produktu, technické listy, rozměry, kotvení a připojovací požadavky.', tag: 'DWG · 3D · BIM' },
  { icon: Ruler, title: 'Zakázkové provedení', desc: 'Rozměry, geometrie, povrch a rozmístění trysek lze přizpůsobit návrhu a charakteru konkrétního prostoru.', tag: 'Výroba na míru' },
  { icon: FileText, title: 'Technická konzultace', desc: 'Podpora od studie po realizační dokumentaci: stavební připravenost, napojení, kotvení, servisní přístup a Smart řízení.', tag: 'Projektová podpora' },
];

const REASONS = [
  '2D/3D a BIM podklady podle konkrétního produktu',
  'Technické listy: rozměry, kotvení, přípojky a provoz',
  'Povrchové úpravy a materiálové varianty podle projektu',
  'Konzultace od studie po realizační dokumentaci',
  'Podklady pro koordinaci profesí a stavební připravenost',
];

const GALLERY = [
  { title: 'Veřejná prostranství', image: 'https://media.base44.com/images/public/69d723859ec0e3321c6b8bb6/df243f3f7_mlzitkapromesta.jpeg' },
  { title: 'Mlžící zóny', image: 'https://media.base44.com/images/public/69d723859ec0e3321c6b8bb6/75ba202be_mlzicizony.jpeg' },
  { title: 'Mlhoviště', image: 'https://media.base44.com/images/public/69d723859ec0e3321c6b8bb6/c7880a54f_mlhoviste.jpg' },
  { title: 'AURA série', image: 'https://media.base44.com/images/public/69d723859ec0e3321c6b8bb6/b023d9933_mlzitkoaura-vysic.jpg' },
  { title: 'Bendy Stéblo', image: 'https://media.base44.com/images/public/69d723859ec0e3321c6b8bb6/910eb2c63_bendymlzitko-steblo.jpeg' },
];

const PRODUCTS = [
  { title: 'GATE70', slug: 'gate70', desc: 'Monumentální mlžná brána — vstupní portál pro náměstí, parky a veřejné budovy.', image: 'https://media.base44.com/images/public/69d723859ec0e3321c6b8bb6/b7a9a40cb_export-1775419649292.jpg' },
  { title: 'AURA', slug: 'aura', desc: 'Výškově dominantní skulptura (120–220 cm) pro atria, lobby a reprezentativní prostory.', image: 'https://media.base44.com/images/public/69d723859ec0e3321c6b8bb6/b023d9933_mlzitkoaura-vysic.jpg' },
  { title: 'BENDY 60', slug: 'bendy-60', desc: 'Flexibilní organický tvar — ideální pro zahradní architekturu a krajinářské projekty.', image: 'https://media.base44.com/images/public/69d723859ec0e3321c6b8bb6/910eb2c63_bendymlzitko-steblo.jpeg' },
];

const FINISHES = [
  { title: 'Polished', desc: 'Vysoký lesk, zrcadlový efekt — pro moderní minimalistickou architekturu.' },
  { title: 'Brushed', desc: 'Jemně broušený nerez — univerzální, ladí s přírodními materiály.' },
  { title: 'PVD Graphite', desc: 'Tmavá grafitová úprava — industriální a sofistikovaný vzhled.' },
  { title: 'PVD Champagne', desc: 'Teplý zlatavý nádech — luxusní akcent pro reprezentativní prostory.' },
];

export default function Architekti() {
  useEffect(() => {
    setSEO(SEO_PAGES.architekti);
    trackFunnelStep('architects', 'landing_view', 'Pro architekty');
  }, []);
  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative h-[80vh] min-h-[560px] w-full overflow-hidden bg-slate-900">
        <video src="https://media.base44.com/videos/public/69d723859ec0e3321c6b8bb6/74b224ffb_mlzitkaamlznesochy.mp4"
          className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-slate-900/20" />
        <div className="relative h-full flex items-end">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto px-6 lg:px-10 pb-16 w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <Palette size={18} className="text-white" />
              </div>
              <p className="text-xs font-mono tracking-widest uppercase text-white/70">Architekti · Zahradní designéři · Krajináři · Ateliéry</p>
            </div>
            <h1 className="font-heading text-4xl lg:text-6xl text-white mb-6" style={{ fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
              Navrhněte prostor,<br />který dýchá. <span style={{ fontStyle: 'italic' }}>My dodáme mlhu.</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl leading-relaxed font-light mb-8">
              Jsme technickým partnerem architektů, krajinářů a designérů. Připravíme BIM modely, technické listy, konzultaci i podklady potřebné od studie po realizaci.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#projektova-konzultace"
                onClick={() => trackFunnelStep('architects', 'consultation_click', 'hero')}
                className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">
                Konzultovat projekt <ArrowRight size={15} />
              </a>
              <Link to="/ke-stazeni"
                onClick={() => trackFunnelStep('architects', 'downloads_click', 'hero')}
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/30 text-white text-sm rounded-full hover:bg-white/10 transition-all">
                Projektové podklady <Download size={15} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Konverzní cesta pro projektanty */}
      <section className="border-b border-slate-200 bg-white" data-analytics-section="architects-funnel">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ['01', 'Pošlete záměr', 'Typ prostoru, lokalita, fáze projektu a orientační rozsah. Stačí základní informace.'],
              ['02', 'Doplníme podklady', 'Doporučíme vhodný produkt, konfiguraci, technické podklady a podle potřeby vizualizaci.'],
              ['03', 'Koordinujeme řešení', 'Pomůžeme s napojením, kotvením, Smart řízením a návazností na realizační dokumentaci.'],
            ].map(([number, heading, text]) => (
              <div key={number} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <span className="font-mono text-[11px] tracking-widest text-slate-400">{number}</span>
                <h2 className="mt-4 text-lg font-semibold text-slate-900">{heading}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 font-light">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/ai-vizualizace" onClick={() => trackFunnelStep('architects', 'visualizer_click', 'funnel')}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors">
              Otevřít AI vizualizaci <ArrowRight size={14} />
            </Link>
            <Link to="/ke-stazeni" onClick={() => trackFunnelStep('architects', 'downloads_click', 'funnel')}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors">
              Projektové podklady <Download size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Mlha jako materiál */}
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden bg-slate-900">
        <video src="https://media.base44.com/videos/public/69d723859ec0e3321c6b8bb6/7e305c760_mlzitkaholmtec.mp4"
          className="absolute inset-0 w-full h-full object-cover" autoPlay loop muted playsInline preload="metadata" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-slate-900/30" />
        <div className="relative h-full flex items-end">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="max-w-7xl mx-auto px-6 lg:px-10 pb-16 w-full max-w-2xl">
            <p className="text-xs font-mono tracking-widest uppercase text-white/60 mb-4">Mlha jako materiál</p>
            <h2 className="text-white text-3xl mb-5" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>
              Pátý živel<br /><span style={{ fontStyle: 'italic' }}>vašeho návrhu.</span>
            </h2>
            <p className="text-white/70 leading-relaxed font-light">
              Mlha není jen chlazení — je to prostorový materiál. Pracuje se světlem, mění atmosféru, definuje hranice bez zdí. Nový nástroj v rukou architekta.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ke stažení */}
      <section className="bg-slate-50 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Proč architekti volí Mlžidla.cz</p>
          <h2 className="text-slate-900 text-3xl mb-10" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>
            Od první skici<br /><span style={{ fontStyle: 'italic' }}>po finální realizaci.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {DOWNLOADS.map((d, i) => (
              <motion.div key={d.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-7 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all group">
                <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-4">
                  <d.icon size={20} className="text-slate-900" />
                </div>
                <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">{d.tag}</span>
                <h3 className="text-slate-900 font-medium mt-2 mb-2">{d.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-light mb-5">{d.desc}</p>
                <a href="mailto:obchod1@holmtec.cz?subject=Žádost o podklady ke stažení"
                  className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-slate-900 transition-colors">
                  <Mail size={12} /> Vyžádat e-mailem
                </a>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {REASONS.map((r) => (
              <div key={r} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900 shrink-0" />
                <p className="text-sm text-slate-600 font-light">{r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vizuální inspirace */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Vizuální inspirace</p>
        <h2 className="text-slate-900 text-3xl mb-10" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>
          Mlha v kontextu<br /><span style={{ fontStyle: 'italic' }}>prostoru.</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {GALLERY.map((g, i) => (
            <motion.div key={g.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="rounded-2xl overflow-hidden group">
              <div className="aspect-[3/4] overflow-hidden">
                <img src={g.image} alt={g.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <p className="text-sm text-slate-700 font-medium mt-2">{g.title}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Co nabízíme */}
      <section className="bg-slate-50 border-y border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Co nabízíme</p>
          <h2 className="text-slate-900 text-3xl mb-10" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>
            Produkty pro<br /><span style={{ fontStyle: 'italic' }}>každý kontext.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRODUCTS.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={`/produkt/${p.slug}`} className="group block rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-slate-300 transition-all">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-slate-900 font-medium">{p.title}</h3>
                      <ArrowRight size={15} className="text-slate-300 group-hover:text-slate-900 transition-colors shrink-0" />
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed font-light">{p.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Materiály a povrchy */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Materiály a povrchy</p>
        <h2 className="text-slate-900 text-3xl mb-4" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>
          Nerez AISI 316<br /><span style={{ fontStyle: 'italic' }}>ve čtyřech úpravách.</span>
        </h2>
        <p className="text-slate-500 max-w-2xl font-light mb-10">Vyberte povrchovou úpravu, která ladí s materiálovým konceptem vašeho projektu. Vzorník zašleme na vyžádání zdarma.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FINISHES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white border border-slate-200">
              <h3 className="text-slate-900 font-medium mb-2 text-sm">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-light">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="p-10 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h3 className="text-slate-900 text-2xl mb-2" style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>Proberme technické řešení vašeho návrhu.</h3>
            <p className="text-slate-500 text-sm mb-6">Získejte přístup k BIM modelům, technickým listům a prioritní podpoře. Připojte se k partnerskému programu Holmtec.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/reference" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-900 text-sm rounded-full hover:bg-slate-100 transition-all whitespace-nowrap">
                Reference realizací
              </Link>
              <a href="mailto:obchod1@holmtec.cz?subject=Architektonická spolupráce"
                className="btn-metallic-mist px-6 py-3 text-sm font-bold whitespace-nowrap">
                Partnerský program <ArrowRight size={14} />
              </a>
            </div>
          </div>
          <CategoryInquiryForm category="Architekti" projectScope="private" />
        </div>
      </section>
      <B2BPortfolioNavigation current="Pro architekty" />
    </div>
  );
}