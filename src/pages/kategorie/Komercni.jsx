import HeroAtmosphere from '@/components/ui/HeroAtmosphere';
import AllProductsCatalog from '@/components/kategorie/AllProductsCatalog';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig } from 'framer-motion';
import { ArrowRight, Factory } from 'lucide-react';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import CategoryInquiryForm from '@/components/kategorie/CategoryInquiryForm';
import B2BPortfolioNavigation from '@/components/kategorie/B2BPortfolioNavigation';

const USE_CASES = [
  { number: '01', title: 'Restaurace a kavárny', desc: 'Nerezové mlžítko jako samostatný prvek mimo bezprostřední posezení, navržený s ohledem na pohyb hostů.' },
  { number: '02', title: 'Hotely a resorty', desc: 'Řešení pro nádvoří, vstupy a zahrady s důrazem na architekturu, technické napojení a údržbu.' },
  { number: '03', title: 'Kiosky a sezónní stánky', desc: 'Výrazné místo osvěžení u stánku či promenády, s umístěním podle prostoru a provozu.' },
  { number: '04', title: 'Fotopointy na míru', desc: 'Mlžná brána nebo zakázkový tvar jako vizuální prvek pro areál, vstupní prostor či letní akci.' },
];

export default function Komercni() {
  useEffect(() => {
    setSEO(SEO_PAGES.komercni);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <MotionConfig reducedMotion="user"><div className="hero-motion-surface max-w-7xl mx-auto grid items-center gap-10 px-6 lg:px-10 pt-24 pb-16 lg:grid-cols-2">
        <HeroAtmosphere />
        <motion.div className="hero-content relative" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
              <Factory size={18} className="text-slate-900" />
            </div>
            <p className="font-mono tracking-widest uppercase text-slate-500 text-sm">Komerční a industriální prostory</p>
          </div>
          <h1 className="font-heading text-4xl lg:text-6xl text-slate-900 mb-6" style={{ fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
            Ochlazení, které podporuje<br /><span style={{ fontStyle: 'italic' }}>komfort hostů i provozu.</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed font-light mb-8">
            Pro gastro, wellness, hotelové terasy a zahrady i komerční provozy navrhujeme mlžné systémy podle skutečného využití místa. Jemná vodní mlha vytváří příjemnější místo pro chvíli odpočinku i společné setkání.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="#poptavka" className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">
              Probrat záměr <ArrowRight size={15} />
            </a>
            <a href="tel:+420774700390" className="inline-flex items-center gap-2 px-7 py-3.5 border border-slate-300 text-slate-900 text-sm rounded-full hover:bg-slate-100 transition-all">
              Zavolat (+420774700390)
            </a>
          </div>
        </motion.div>
      <figure className="hero-content relative overflow-hidden rounded-3xl bg-slate-100"><img src="/media/optimized/03ba352a3_mlzitka-zahradni-hotely-restaurace.webp" alt="Ilustrační vizualizace nerezového mlžítka u venkovní terasy" fetchPriority="high" className="aspect-[4/5] w-full object-cover" /><figcaption className="p-5 text-xs leading-5 text-slate-600">Katalogová vizualizace využití mlžítka u terasy; nejde o fotografii potvrzené realizace.</figcaption></figure>
      </div></MotionConfig>

      <section className="border-y border-[#D9E6E9] bg-white py-16 sm:py-20" aria-labelledby="commercial-usecases-title">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="mb-9 max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#21768B]">Podle typu provozu</p>
            <h2 id="commercial-usecases-title" className="mt-3 font-heading text-3xl font-semibold tracking-[-.035em] text-[#102E3D] sm:text-4xl">
              Každý prostor potřebuje jiné umístění.
            </h2>
          </div>
          <div className="grid gap-x-10 border-t border-[#CFDFE4] md:grid-cols-2">
            {USE_CASES.map(({ number, title, desc }) => (
              <article key={number} className="grid grid-cols-[42px_1fr] gap-3 border-b border-[#CFDFE4] py-7 sm:py-9">
                <span className="font-mono text-xs font-bold text-[#24788D]">{number}</span>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-[#102E3D]">{title}</h3>
                  <p className="mt-2 max-w-lg text-sm leading-7 text-[#536F79]">{desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#DAE5E9] bg-[#F4F8F9] py-16" aria-labelledby="commercial-placement-title">
        <div className="mx-auto grid max-w-7xl gap-9 px-6 lg:grid-cols-[.82fr_1.18fr] lg:items-start lg:px-10">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.17em] text-[#24758A]">Návrh podle prostoru</p>
            <h2 id="commercial-placement-title" className="mt-3 font-heading text-3xl font-semibold leading-[1.12] tracking-[-.035em] text-[#0C3042] sm:text-4xl">
              Osvěžení, které respektuje provoz terasy.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#4B6572]">
              Důležité je správné umístění mlžítka, proudění vzduchu, přívod vody a možnost regulace. Řešení připravíme podle fotografie, rozměrů a způsobu využití místa.
            </p>
          </div>
          <div className="grid gap-0 border-t border-[#CADCE2]">
            {[
              ['01', 'Mimo bezprostřední posezení', 'Nízkotlaké mlžítko nedoporučujeme instalovat přímo mezi stoly a lavičky. Konkrétní odstup určíme podle prostoru a provozu.'],
              ['02', 'Počítat s větrem', 'Mlha se může šířit po větru i několik metrů. Za různých teplot a vlhkosti nelze vždy zaručit suchý povrch.'],
              ['03', 'Připravený provoz', 'Napojení vody, filtrace, údržba a případné intervalové řízení se navrhují podle konkrétní instalace.'],
            ].map(([number, title, detail]) => (
              <article key={number} className="grid gap-4 border-b border-[#CADCE2] py-5 sm:grid-cols-[38px_1fr]">
                <span className="font-mono text-xs font-semibold text-[#24758A]">{number}</span>
                <div>
                  <h3 className="font-heading text-base font-semibold text-[#0C3042]">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-[#4B6572]">{detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#082738] py-16 text-white sm:py-20" aria-labelledby="commercial-photopoint-title">
        <div className="mx-auto grid max-w-7xl items-center gap-9 px-6 lg:grid-cols-[1.04fr_.96fr] lg:gap-16 lg:px-10">
          <figure className="overflow-hidden rounded-[1.5rem] border border-white/15 bg-[#153E4E]">
            <img
              src="/media/optimized/58e5e3931_MestskabranaGATE.webp"
              alt="Ilustrační vizualizace nerezové mlžné brány jako fotopointu ve veřejném prostoru"
              width="1024"
              height="680"
              loading="lazy"
              decoding="async"
              className="aspect-[4/3] w-full object-cover object-center"
            />
            <figcaption className="px-5 py-3 text-[11px] leading-5 text-white/70">
              Ilustrační vizualizace mlžné brány. Přesnou geometrii, rozměry a umístění určuje vybraný model a konkrétní projekt.
            </figcaption>
          </figure>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[.17em] text-[#9EE4EF]">Fotopoint a zakázková výroba</p>
            <h2 id="commercial-photopoint-title" className="mt-4 max-w-xl font-heading text-3xl font-semibold leading-[1.1] tracking-[-.035em] sm:text-4xl">
              Výrazný prvek, který přirozeně patří k vašemu místu.
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/80">
              Mlžná brána, kruhový motiv nebo vlastní tvar mohou doplnit vstupní prostor, letní akci i prezentaci značky. V HolmTec ověříme proveditelnou geometrii a způsob instalace.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/zakazkova-mlzitka" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#9BE4EE] px-5 py-3 text-sm font-semibold text-[#092B3B] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                Výroba na míru <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a href="#poptavka" className="inline-flex min-h-12 items-center gap-2 border-b border-white/50 px-2 py-3 text-sm font-semibold text-white hover:border-white">
                Probrat vlastní nápad <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="poptavka" className="max-w-7xl mx-auto px-6 lg:px-10 pb-20 scroll-mt-24">
        <div className="p-10 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h3 className="text-slate-900 text-2xl mb-2" style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>Připravíme nabídku pro váš provoz.</h3>
            <p className="text-slate-500 text-sm mb-6">Pošlete nám fotografii terasy, základní rozměry a informaci o dostupnosti vody.</p>
            <Link to="/reference" className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-900 text-sm rounded-full hover:bg-slate-100 transition-all">
              Reference realizací <ArrowRight size={14} />
            </Link>
          </div>
          <CategoryInquiryForm category="Komerční prostory" projectScope="industrial" />
        </div>
      </section>
      <AllProductsCatalog categoryTitle="gastro, hotely a komerční provozy" />
      <B2BPortfolioNavigation current="Komerční prostory" />
    </div>);

}