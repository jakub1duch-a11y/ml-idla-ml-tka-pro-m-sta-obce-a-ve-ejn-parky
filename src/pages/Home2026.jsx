import React, { Suspense, lazy, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Building2, Factory, School, Trees, Wifi, Waves, Check, Droplets, Wrench, Clock3, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { MotionConfig } from 'framer-motion';
import { setSEO } from '@/lib/seo';
import '@/styles/home-2026-redesign.css';

const ProductPhotoGallery = lazy(() => import('@/components/home/new/ProductPhotoGallery'));
const ReferencesStrip = lazy(() => import('@/components/home/new/ReferencesStrip'));
const CooperationSteps = lazy(() => import('@/components/home/new/CooperationSteps'));
const HomeInquiryForm = lazy(() => import('@/components/home/new/HomeInquiryForm'));
const HomeHolmTec = lazy(() => import('@/components/home/new/HomeEditorialSections').then(m => ({ default: m.HomeHolmTec })));
const MobileStickyBar = lazy(() => import('@/components/home/new/MobileStickyBar'));

const HERO_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9ac50487d_mlzidla_homepage_hero_20261110.webp';
const MEDIA = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/';
const collections = [
  { index: '01', kicker: 'MLŽNÉ BRÁNY', name: 'STÉBLO GATE®', description: 'Vzdušná mlžná brána, která promění průchod v příjemný zážitek.', image: MEDIA + '9f27dc9cf_hero_steblo_gate_desktop_20261101.webp', path: '/produkt/mlzna-brana-steblo', className: 'gate' },
  { index: '02', kicker: 'MLŽNÉ SOCHY', name: 'MRAK 1414', description: 'Výrazná nerezová plastika pro osvěžení a atmosféru veřejného prostoru.', image: MEDIA + 'e88fa9954_mrak_desktop.webp', path: '/produkt/mlzny-mrak-1414', className: 'mrak' },
  { index: '03', kicker: 'ARCHITEKTONICKÉ PRVKY', name: 'KRUH', description: 'Čistá geometrie a jemná vodní mlha pro náměstí i zahrady.', image: MEDIA + 'bb98ea004_kruh_gate_hero_desktop.webp', path: '/produkt/mlzitko-kruh', className: 'kruh' },
];
const spaces = [
  { number: '01', icon: Building2, title: 'Města a náměstí', subtitle: 'Osvěžení veřejného prostoru', path: '/mestske-mlzitka' },
  { number: '02', icon: Trees, title: 'Parky a zahrady', subtitle: 'Příjemné zastavení v zeleni', path: '/zahradni-mlzitka' },
  { number: '03', icon: School, title: 'Školy a školky', subtitle: 'Pobytové zóny pro horké dny', path: '/kategorie/skoly-skolky-deti' },
  { number: '04', icon: Sparkles, title: 'Eventy a areály', subtitle: 'Výrazný zážitek pro návštěvníky', path: '/pronajem' },
];

function HomeHero() {
  return (
    <section className="ml-home26-hero" aria-labelledby="ml-home26-hero-title">
      <div className="ml-home26-hero-media" aria-hidden="true"><img src={HERO_URL} alt="" loading="eager" fetchPriority="high" decoding="async" /></div>
      <div className="ml-home26-hero-shade" aria-hidden="true" />
      <div className="ml-home26-container ml-home26-hero-inner">
        <div className="ml-home26-hero-copy">
          <p className="ml-home26-eyebrow ml-home26-eyebrow-light"><span className="ml-home26-dot" /> Vodní mlha × současný design</p>
          <h1 id="ml-home26-hero-title">Ochlazení,<br /><em>které má tvar.</em></h1>
          <p className="ml-home26-hero-perex">Designová mlžítka, mlžné brány a nerezové sochy, které promění rozpálená místa v příjemný prostor pro život.</p>
          <div className="ml-home26-actions">
            <Link className="ml-home26-btn ml-home26-btn-primary" to="/katalog-mlzitek">Prohlédnout produkty <ArrowRight size={18} aria-hidden="true" /></Link>
            <Link className="ml-home26-btn ml-home26-btn-outline" to="/poptavka">Poptat řešení <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
        <div className="ml-home26-hero-bottom">
          <div className="ml-home26-hero-microfacts"><span>01 / DESIGN A NEREZ</span><span>02 / ČESKÁ VÝROBA HOLMTEC</span><span>03 / CHYTRÉ ŘÍZENÍ</span></div>
          <a className="ml-home26-hero-discover" href="#ml-home26-intro">Objevte více <ArrowDown size={17} aria-hidden="true" /></a>
        </div>
      </div>
      <p className="ml-home26-hero-disclaimer">Ilustrační vizualizace · konkrétní tvar a provedení podle produktu</p>
    </section>
  );
}

function HomeIntro() {
  return (
    <section className="ml-home26-intro" id="ml-home26-intro" aria-labelledby="ml-home26-intro-title">
      <div className="ml-home26-container ml-home26-intro-grid">
        <div><p className="ml-home26-eyebrow">MLŽIDLA × HOLMTEC</p><h2 id="ml-home26-intro-title" className="ml-home26-heading">Funkční prvek.<br /><span>Silný vizuální zážitek.</span></h2></div>
        <div className="ml-home26-intro-info"><p>Propojujeme přesnou nerezovou výrobu s lehkostí vodní mlhy. Navrhujeme řešení pro městská náměstí, parky, školy, zahrady i architektonické projekty — od jediného mlžítka po celé ochlazovací zóny.</p><Link className="ml-home26-textlink" to="/katalog-mlzitek">Prozkoumat celý katalog <ArrowRight size={19} aria-hidden="true" /></Link></div>
      </div>
      <div className="ml-home26-container ml-home26-proof-grid">
        <div><Factory size={28} aria-hidden="true" /><span>01</span><strong>Vlastní návrh a výroba</strong><p>Česká kovovýroba HolmTec v Trutnově.</p></div>
        <div><Wrench size={28} aria-hidden="true" /><span>02</span><strong>Nerezové provedení</strong><p>Materiál a konstrukce podle zvolené sestavy.</p></div>
        <div><Wifi size={28} aria-hidden="true" /><span>03</span><strong>Řízení provozu</strong><p>Manuální nebo automatické ovládání.</p></div>
      </div>
    </section>
  );
}

function HomeCollections() {
  return (
    <section className="ml-home26-products" id="ml-home26-products" aria-labelledby="ml-home26-products-title">
      <div className="ml-home26-container">
        <div className="ml-home26-section-header"><div><p className="ml-home26-eyebrow">OBJEVTE KOLEKCE</p><h2 id="ml-home26-products-title" className="ml-home26-heading">Mlha, která mění<br /><span>charakter prostoru.</span></h2></div><p>Každý prostor si zaslouží vlastní řešení. Vyberte si tvar, který bude fungovat i vizuálně.</p></div>
        <div className="ml-home26-product-grid">
          {collections.map((p) => <Link key={p.index} to={p.path} className={`ml-home26-product-card ml-home26-product-card-${p.className}`} aria-label={`Prohlédnout produkt ${p.name}`}>
            <img src={p.image} alt="" loading="lazy" decoding="async" /><span className="ml-home26-product-vignette" aria-hidden="true" />
            <span className="ml-home26-product-index">{p.index} / {p.kicker}</span>
            <span className="ml-home26-product-copy"><strong>{p.name}</strong><span>{p.description}</span></span>
            <span className="ml-home26-product-arrow" aria-hidden="true"><ArrowRight size={24} /></span>
          </Link>)}
        </div>
        <div className="ml-home26-center-link"><Link className="ml-home26-btn ml-home26-btn-dark" to="/katalog-mlzitek">Všechny produkty <ArrowRight size={17} aria-hidden="true" /></Link></div>
      </div>
    </section>
  );
}

function HomeSpaces() {
  return <section className="ml-home26-spaces" id="ml-home26-spaces" aria-labelledby="ml-home26-spaces-title"><div className="ml-home26-container">
    <div className="ml-home26-section-header"><div><p className="ml-home26-eyebrow">PRO KAŽDÝ TYP PROSTORU</p><h2 id="ml-home26-spaces-title" className="ml-home26-heading">Jeden princip.<br /><span>Mnoho možností.</span></h2></div><Link className="ml-home26-textlink" to="/poptavka">Navrhnout řešení pro mé místo <ArrowRight size={18} aria-hidden="true" /></Link></div>
    <div className="ml-home26-spaces-grid">{spaces.map(({number,icon:Icon,title,subtitle,path})=><Link to={path} className="ml-home26-space" key={number}><span className="ml-home26-space-top"><span>{number}</span><Icon size={27} strokeWidth={1.6} aria-hidden="true" /></span><strong>{title}</strong><span>{subtitle}</span><ArrowRight size={20} aria-hidden="true" /></Link>)}</div>
  </div></section>;
}

function HomeSmart() {
  return <section className="ml-home26-smart" id="ml-home26-smart" aria-labelledby="ml-home26-smart-title"><div className="ml-home26-container ml-home26-smart-grid">
    <div><p className="ml-home26-eyebrow ml-home26-eyebrow-light">INTELIGENTNÍ AUTOMATIZACE</p><h2 id="ml-home26-smart-title" className="ml-home26-heading">Design je vidět.<br /><span>Technologie pracuje v pozadí.</span></h2><p>Provoz mlžítka může řídit časový režim, teplota či další zvolené podmínky. Systém SUPLA umožňuje chytré ovládání podle konkrétních komponent a možností instalace.</p><Link className="ml-home26-btn ml-home26-btn-primary" to="/smart-ovladani">Poznat chytré řízení <ArrowRight size={18} aria-hidden="true" /></Link></div>
    <div className="ml-home26-smart-panel" aria-label="Princip chytrého řízení mlžení"><span className="ml-home26-smart-panel-kicker">JAK TO FUNGUJE</span><div className="ml-home26-smart-track"><span><Droplets size={26} aria-hidden="true" /> Přívod vody</span><i>→</i><span><ShieldCheck size={26} aria-hidden="true" /> Filtrace a ventil</span><i>→</i><span><Waves size={26} aria-hidden="true" /> Jemná mlha</span></div><div className="ml-home26-smart-feature"><Clock3 size={19} aria-hidden="true" /><span>Časový režim</span><Check size={17} aria-hidden="true" /></div><div className="ml-home26-smart-feature"><Wifi size={19} aria-hidden="true" /><span>Vzdálené ovládání*</span><Check size={17} aria-hidden="true" /></div><div className="ml-home26-smart-feature"><MapPin size={19} aria-hidden="true" /><span>Konfigurace pro konkrétní místo</span><Check size={17} aria-hidden="true" /></div><small>* Dostupné funkce závisí na zvolených zařízeních, připojení a konfiguraci.</small></div>
  </div></section>;
}

function HomeFinalCTA() {
 return <section className="ml-home26-finalcta"><div className="ml-home26-container ml-home26-finalcta-row"><div><p className="ml-home26-eyebrow">PŘIPRAVME PROSTOR NA LÉTO</p><h2 className="ml-home26-heading">Máte místo.<br /><span>My máme nápad.</span></h2><p>Pošlete nám fotografii místa nebo krátký popis. Doporučíme vhodné mlžítko, umístění i technologii.</p></div><Link className="ml-home26-btn ml-home26-btn-dark" to="/poptavka">Nezávazně poptat projekt <ArrowRight size={18} aria-hidden="true" /></Link></div></section>;
}

export default function Home2026() {
  useEffect(() => {
    setSEO({
      title: 'Designová mlžítka, mlžné brány a mlžné sochy | MLŽIDLA.cz',
      description: 'Ochlazení, které má tvar. Česká výroba nerezových mlžítek, mlžných bran a mlžných soch od HolmTec. Pro města, parky, školy i zahrady.',
      keywords: 'mlžítka, mlžné brány, mlžné sochy, městské ochlazování, vodní mlha, česká výroba mlžítek, SUPLA',
      canonicalPath: '/', robots: 'index, follow',
    });
  }, []);

  return <div className="ml-home26"><MotionConfig reducedMotion="user">
    <HomeHero />
    <HomeIntro />
    <HomeCollections />
    <HomeSpaces />
    <Suspense fallback={<div className="ml-home26-loading" aria-hidden="true" />}><ProductPhotoGallery /></Suspense>
    <HomeSmart />
    <Suspense fallback={null}><ReferencesStrip /><HomeHolmTec /><CooperationSteps /></Suspense>
    <HomeFinalCTA />
    <Suspense fallback={null}><HomeInquiryForm /><MobileStickyBar /></Suspense>
  </MotionConfig></div>;
}
