import HeroAtmosphere from '@/components/ui/HeroAtmosphere';
import AllProductsCatalog from '@/components/kategorie/AllProductsCatalog';
import ProductExperience from '@/components/ui/ProductExperience';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig } from 'framer-motion';
import { ArrowRight, Factory, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { sortByStructure } from '@/lib/productFamilies';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import CategoryInquiryForm from '@/components/kategorie/CategoryInquiryForm';
import B2BPortfolioNavigation from '@/components/kategorie/B2BPortfolioNavigation';
import ProductHoverImage from '@/components/ui/ProductHoverImage';

const USE_CASES = [
{ emoji: '🍽️', title: 'Terasy restaurací a kaváren', desc: 'Mlžení může zpříjemnit horké letní dny. Umístění doporučíme mimo bezprostřední okolí stolů a míst k sezení.' },
{ emoji: '🛍️', title: 'Nákupní centra', desc: 'Ochlazení vstupních zón, food courtů a venkovních průchodů.' },
{ emoji: '🎪', title: 'Výstavy a showroomy', desc: 'Mlžné prvky jako součást prezentace — design i chlad.' },
{ emoji: '🏭', title: 'Výrobní a průmyslové haly', desc: 'Možnosti technického ochlazování posoudíme podle provozu, hygienických požadavků a dostupného přívodu vody.' }];


export default function Komercni() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSEO(SEO_PAGES.komercni);
    base44.entities.Product.list().catch(() => []).then((p) => {
      setProducts(sortByStructure(p || []).slice(0, 6));
    }).finally(() => setLoading(false));
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
      <figure className="hero-content relative overflow-hidden rounded-3xl bg-slate-100"><img src="/media/optimized/03ba352a3_mlzitka-zahradni-hotely-restaurace.webp" alt="Mlžení pro zahrady, hotely a restaurace" fetchPriority="high" className="aspect-[4/5] w-full object-cover" /><figcaption className="p-5 text-sm text-slate-600">Příjemnější atmosféra venkovních prostor.</figcaption></figure>
      </div></MotionConfig>

      <section className="bg-slate-50 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {USE_CASES.map((u, i) =>
            <motion.div key={u.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
            className="p-6 rounded-2xl bg-white border border-slate-200">
                <span className="text-2xl mb-3 block">{u.emoji}</span>
                <h3 className="text-slate-900 font-medium text-sm mb-2">{u.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-light">{u.desc}</p>
              </motion.div>
            )}
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

      {/* Video */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden bg-slate-900">
        <video src="https://media.base44.com/videos/public/69d723859ec0e3321c6b8bb6/a155bfef6_mlzisteprokomercniprostory.mp4"
        className="absolute inset-0 w-full h-full object-cover opacity-20" autoPlay loop muted playsInline preload="metadata" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-slate-900/30" />
        <div className="relative h-full flex items-end">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-7xl mx-auto px-6 lg:px-10 pb-14 w-full max-w-2xl">
            <p className="text-xs font-mono tracking-widest uppercase text-white/60 mb-4">Mlžiště pro komerční prostory</p>
            <h2 className="text-white text-3xl md:text-4xl mb-4" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>
              Osvěžení<br /><span style={{ fontStyle: 'italic' }}>s ohledem na prostor.</span>
            </h2>
            <p className="text-white/70 leading-relaxed font-light max-w-xl">
              Umístění mlžítka navrhneme tak, aby doplnilo charakter venkovního provozu. Provozní režim přizpůsobíme skutečným podmínkám v místě.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Produkty</p>
        <h2 className="text-slate-900 text-3xl mb-8" style={{ fontWeight: 700, letterSpacing: '-0.04em' }}>Katalogové modely pro inspiraci.</h2>
        {loading ?
        <div className="flex justify-center py-12"><Loader size={24} className="animate-spin text-slate-300" /></div> :

        <ProductExperience products={products}>
<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {products.map((p, i) =>
            <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <Link to={`/produkt/${p.slug}`} className="group block bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 shadow-sm transition-all">
                  <ProductHoverImage product={p} alt={p.name} className="aspect-[4/3] bg-slate-100" fullBleed cleanPreview />
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-slate-900 font-medium">{p.name}</p>
                      {p.short_description && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{p.short_description}</p>}
                    </div>
                    <ArrowRight size={15} className="text-slate-300 group-hover:text-slate-900 transition-colors shrink-0" />
                  </div>
                </Link>
              </motion.div>
            )}
          </div>
</ProductExperience>
        }
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