import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, X, Loader, Ruler, Waves, Gauge, Droplets, Layers, Sparkles, Zap, Factory } from 'lucide-react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { base44 } from '@/api/base44Client';
import { trackProductView } from '@/lib/ga4';
import { setSEO, getProductSEO } from '@/lib/seo';
import ProductReviews from '@/components/reviews/ProductReviews';
import ProductHero from '@/components/produkt/ProductHero';
import ProductStickyFooterBar from '@/components/produkt/ProductStickyFooterBar';
import OProduktuTab from '@/components/produkt/tabs/OProduktuTab';
import SpecsTab from '@/components/produkt/tabs/SpecsTab';
import BenefityTab from '@/components/produkt/tabs/BenefityTab';
import InstallationTab from '@/components/produkt/tabs/InstallationTab';
import ZivaUkazkaTab from '@/components/produkt/tabs/ZivaUkazkaTab';
import DownloadsTab from '@/components/produkt/tabs/DownloadsTab';
import MistFogEffect from '@/components/produkt/MistFogEffect';
import ProductContactForm from '@/components/produkt/ProductContactForm';
import GateComparisonTable from '@/components/produkt/GateComparisonTable';

const GATE_SLUGS = ['gate70', 'linea-el70'];

gsap.registerPlugin(ScrollToPlugin);

// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({ images, initialIndex, onClose }) {
  const [idx, setIdx] = useState(initialIndex);
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [images.length, onClose]);

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} aria-label="Zavřít galerii" className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
        <X size={18} />
      </button>
      <div className="relative max-w-5xl w-full mx-6" onClick={(e) => e.stopPropagation()}>
        <img src={images[idx]} alt={`Fotografie ${idx + 1}`} className="w-full max-h-[85vh] object-contain" />
        {images.length > 1 &&
        <>
            <button onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)} aria-label="Předchozí fotografie" className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black transition-all">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setIdx((i) => (i + 1) % images.length)} aria-label="Další fotografie" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black transition-all">
              <ChevronRight size={18} />
            </button>
            <p className="text-center text-xs font-mono text-white/30 mt-4 tracking-widest">{idx + 1} / {images.length}</p>
          </>
        }
      </div>
    </div>);
}

// ─── Tabs config ───────────────────────────────────────────────────────────────
const TABS = [
{ id: 'o-produktu', label: 'O produktu' },
{ id: 'technicke', label: 'Technické informace' },
{ id: 'benefity', label: 'Benefity a přínosy' },
{ id: 'instalace', label: 'Kotvení a instalace' },
{ id: 'video', label: 'Živá ukázka' },
{ id: 'ke-stazeni', label: 'Ke stažení' }];


// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProduktDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [activeTab, setActiveTab] = useState('o-produktu');
  const [showStickyBar, setShowStickyBar] = useState(false);
  const tabsNavRef = useRef(null);
  const contactRef = useRef(null);
  const tabsScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleReviewStats = (stats) => {
    if (product) setSEO(getProductSEO(product, stats));
  };

  useEffect(() => {
    base44.entities.ProductCategory.list().then(setCategories).catch(() => []);
  }, []);

  useEffect(() => {
    if (slug === 'gate70') {navigate('/gate70', { replace: true });return;}
    setLoading(true);
    setNotFound(false);
    const urlParams = new URLSearchParams(window.location.search);
    const requestedTab = urlParams.get('tab');
    setActiveTab(TABS.some((t) => t.id === requestedTab) ? requestedTab : 'o-produktu');
    base44.entities.Product.filter({ slug }).
    then(async (results) => {
      if (!results || results.length === 0) {setNotFound(true);return;}
      const p = results[0];
      setProduct(p);
      trackProductView(p.name, p.slug, p.category_id);
      setSEO(getProductSEO(p));
      if (p.category_id) {
        const related = await base44.entities.Product.filter({ category_id: p.category_id }).catch(() => []);
        setRelatedProducts((related || []).filter((r) => r.id !== p.id).slice(0, 3));
      }
    }).
    catch(() => setNotFound(true)).
    finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 520);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const updateArrowVisibility = () => {
    const el = tabsScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scrollTabs = (amount) => {
    tabsScrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  };

  useEffect(() => {
    updateArrowVisibility();
  }, [product]);

  const scrollToContact = () => {
    if (contactRef.current) {
      gsap.to(window, { duration: 0.9, scrollTo: { y: contactRef.current, offsetY: 80 }, ease: 'power2.inOut' });
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    if (tabsNavRef.current) {
      gsap.to(window, { duration: 0.9, scrollTo: { y: tabsNavRef.current, offsetY: 64 }, ease: 'power2.inOut' });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader size={28} className="animate-spin text-slate-300" />
    </div>);

  if (notFound || !product) return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-28">
      <div className="text-center">
        <p className="text-slate-400 mb-4 text-lg">Produkt nenalezen.</p>
        <Link to="/mlzidla-mlzitka" className="text-slate-900 hover:underline">← Zpět na mlžítka</Link>
      </div>
    </div>);

  const allImages = [product.image_url, ...(product.gallery_urls || [])].filter(Boolean);
  const categoryName = categories.find((c) => c.id === product.category_id)?.name || '';

  const techRows = [
  product.coverage_area && { label: 'Výška', value: product.coverage_area, icon: Ruler, desc: 'Celková výška konstrukce ovlivňuje dosah a pokrytí mlžného oblaku v prostoru.' },
  { label: 'Trysky', value: product.micron_size ? `AISI 316L, ${product.micron_size} μm` : 'AISI 316L', icon: Waves, desc: 'Nerezové trysky rozprašují vodu na mikrokapky, které se okamžitě odpaří — bez mokrého povrchu.' },
  product.pressure && { label: 'Tlak', value: product.pressure, icon: Gauge, desc: 'Nízkotlaký provoz (2–7 BAR) umožňuje přímé napojení na běžný vodovodní řad bez čerpadla.' },
  product.water_consumption && { label: 'Spotřeba vody', value: product.water_consumption, icon: Droplets, desc: 'Reálná spotřeba při plynulém provozu — určuje i orientační provozní náklady.' },
  product.material && { label: 'Materiál', value: product.material, icon: Layers, desc: 'Potravinářská nerez odolná korozi, vhodná pro celoroční venkovní provoz.' },
  { label: 'Povrch', value: 'Broušený / kartáčovaný', icon: Sparkles, desc: 'Ruční broušený povrch potlačuje odlesky a otisky prstů, zachovává prémiový vzhled.' },
  product.power_supply && { label: 'Napájení & řízení', value: product.power_supply, icon: Zap, desc: 'Elektronické řízení mlžení, kompatibilní se SMART moduly a časovači.' },
  { label: 'Výroba', value: 'Zakázková, 6–8 týdnů', icon: Factory, desc: 'Každý kus se vyrábí na zakázku v ČR dle rozměrů a požadavků konkrétní instalace.' }].
  filter(Boolean);

  const contentTabs = TABS;
  const idx = contentTabs.findIndex((t) => t.id === activeTab);
  const nextTab = contentTabs[idx + 1];

  return (
    <div className="min-h-screen bg-white">

      {/* ═══════ HERO ═══════ */}
      <ProductHero
        product={product}
        categoryName={categoryName}
        allImages={allImages}
        onOpenLightbox={(i) => setLightbox({ images: allImages, idx: i })}
        onShowTechnical={() => handleTabClick(TABS[1])}
      />

      {/* ═══════ STICKY TABS NAV ═══════ */}
      <div ref={tabsNavRef} className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row sm:items-center">
          <div className="relative flex-1 min-w-0 order-1">
            {canScrollLeft &&
            <button type="button" onClick={() => scrollTabs(-160)} aria-label="Posunout záložky vlevo"
              className="absolute left-0 top-0 bottom-0 z-10 flex items-center justify-center w-8 bg-gradient-to-r from-white via-white/95 to-transparent lg:hidden">
              <ChevronLeft size={16} className="text-slate-500" />
            </button>
            }
            <div ref={tabsScrollRef} onScroll={updateArrowVisibility}
              className="flex gap-2 sm:gap-6 lg:gap-8 overflow-x-auto flex-row whitespace-nowrap py-3 sm:py-0 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
              {TABS.map((t) =>
              <button key={t.id} onClick={() => handleTabClick(t)}
              className={`relative py-2.5 px-4 sm:py-5 sm:px-0 text-sm font-medium whitespace-nowrap transition-colors shrink-0 rounded-full sm:rounded-none min-h-[44px] sm:min-h-0 flex items-center ${activeTab === t.id ? 'bg-slate-900 text-white sm:bg-transparent sm:text-slate-900' : 'bg-slate-100 text-slate-500 sm:bg-transparent hover:text-slate-700'}`}>
                  {t.label}
                  {activeTab === t.id &&
                <motion.div layoutId="produkt-tab-underline" className="hidden sm:block absolute left-0 right-0 -bottom-px h-0.5 bg-slate-900" />
                }
                </button>
              )}
            </div>
            {canScrollRight &&
            <button type="button" onClick={() => scrollTabs(160)} aria-label="Posunout záložky vpravo"
              className="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-center w-8 bg-gradient-to-l from-white via-white/95 to-transparent lg:hidden">
              <ChevronRight size={16} className="text-slate-500" />
            </button>
            }
          </div>
          <div className="flex items-center gap-3 py-2.5 sm:py-4 border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-6 lg:pl-8 shrink-0 order-2 sm:order-first">
            <Link to="/mlzidla-mlzitka" className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest text-slate-400 hover:text-slate-900 transition-colors uppercase">
              <ArrowLeft size={12} /> Zpět
            </Link>
            <span className="hidden sm:inline text-sm font-heading font-medium text-slate-900 whitespace-nowrap">{product.name}</span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          {activeTab === 'o-produktu' && <OProduktuTab product={product} onOpenLightbox={(i, customImages) => setLightbox({ images: customImages || allImages, idx: i })} />}
          {activeTab === 'technicke' && (
            <>
              <SpecsTab product={product} techRows={techRows} />
              {GATE_SLUGS.includes(product.slug) && <GateComparisonTable />}
            </>
          )}
          {activeTab === 'benefity' && <BenefityTab product={product} />}
          {activeTab === 'instalace' && <InstallationTab product={product} />}
          {activeTab === 'video' && <ZivaUkazkaTab product={product} allImages={allImages} onOpenLightbox={(i) => setLightbox({ images: allImages, idx: i })} />}
          {activeTab === 'ke-stazeni' && <DownloadsTab product={product} />}
        </motion.div>
      </AnimatePresence>

      {/* ═══════ TAB FOOTER NAV ═══════ */}
      <div className="border-t border-slate-200 bg-slate-50 py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {nextTab ?
          <button onClick={() => handleTabClick(nextTab)}
          className="inline-flex items-center gap-2 font-medium text-slate-600 hover:text-slate-900 transition-colors uppercase text-sm">
              Pokračovat: {nextTab.label} <ArrowRight size={15} />
            </button> :
          <span />
          }
          <button onClick={scrollToContact}
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all">
            Poptat produkt zdarma <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* ═══════ REVIEWS ═══════ */}
      <ProductReviews productId={product.id} onStatsLoaded={handleReviewStats} />

      {/* ═══════ INLINE CONTACT FORM ═══════ */}
      <section ref={contactRef} className="bg-gradient-to-b from-slate-900 to-slate-800 py-24 relative overflow-hidden">
        <MistFogEffect />
        <div className="max-w-6xl mx-auto lg:px-10 relative px-5">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-16 items-start">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <span className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 text-white text-xs font-bold tracking-widest uppercase rounded-full mb-5">Nezávazná poptávka</span>
                <h2 className="font-heading font-semibold text-3xl lg:text-4xl text-white tracking-tight mb-4">
                  Váš prostor si zaslouží<br /><span className="[font-family:'Inter',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-light text-[#70c1ff]">vlastní {product.name}.</span>
                </h2>
                <p className="text-sm normal-case text-left [font-family:'Inter',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-medium mb-16 text-[hsl(var(--card))]">Konzultace zdarma · 3D vizualizace do 48 h · Odpovídáme do 24 h</p>
              </motion.div>

              {/* FAQ o poptávce a realizaci */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="space-y-4 mb-8">
                {[
                { q: 'Jak dlouho trvá zpracování poptávky?', a: 'Ozveme se vám do 24 hodin s konzultací a předběžnou nabídkou.' },
                { q: 'Jak probíhá realizace?', a: 'Konzultace → 3D vizualizace do 48 h → zakázková výroba (6–8 týdnů) → instalace na místě.' },
                { q: 'Je konzultace a vizualizace zdarma?', a: 'Ano, nezávazně a bez skrytých poplatků.' },
                { q: 'Poskytujete servis po instalaci?', a: 'Ano, včetně pravidelné údržby a rychlého záručního i pozáručního servisu.' }].
                map((item) =>
                <div key={item.q} className="border-b border-white/10 pb-4">
                    <p className="text-sm font-semibold text-white mb-1">{item.q}</p>
                    <p className="text-sm text-white/50 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </motion.div>

              {/* Podpora 24/7 */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/15 rounded-2xl p-6">
                <span className="inline-block px-3 py-1 bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold tracking-widest uppercase rounded-full mb-3">Podpora 24/7</span>
                <p className="text-sm font-semibold text-white mb-3">Ing. Radek Meduna</p>
                <div className="space-y-2 text-sm text-white/60 font-mono">
                  <a href="tel:+420774700390" className="flex items-center gap-2 hover:text-white transition-colors">Tel.: +420 774700390</a>
                  <a href="mailto:meduna@holmtec.cz" className="flex items-center gap-2 hover:text-white transition-colors">Email: meduna@holmtec.cz</a>
                </div>
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
              <ProductContactForm productName={product.name} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ RELATED + BACK ═══════ */}
      {relatedProducts.length > 0 &&
      <section className="py-20 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Mohlo by vás zajímat</p>
            <h2 className="font-heading font-light text-3xl text-slate-900 tracking-tight mb-10">Podobné produkty</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedProducts.map((r, i) =>
            <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Link to={`/produkt/${r.slug}`} className="group block rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-slate-300 transition-all">
                    <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                      {r.image_url && <img src={r.image_url} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                    </div>
                    <div className="p-5 flex items-center justify-between">
                      <div>
                        <span className="text-slate-900 font-medium group-hover:text-slate-600 transition-colors">{r.name}</span>
                        {r.short_description && <p className="text-xs text-slate-400 mt-0.5 font-light">{r.short_description}</p>}
                      </div>
                      <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-900 transition-colors shrink-0 ml-4" />
                    </div>
                  </Link>
                </motion.div>
            )}
            </div>
            <div className="mt-10 flex justify-center">
              <Link to="/mlzidla-mlzitka" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-900 transition-colors font-mono">
                <ArrowLeft size={14} /> Zpět na celou kolekci
              </Link>
            </div>
          </div>
        </section>
      }

      {lightbox &&
      <Lightbox images={lightbox.images} initialIndex={lightbox.idx} onClose={() => setLightbox(null)} />
      }

      <ProductStickyFooterBar product={product} show={showStickyBar} onPoptat={scrollToContact} />
    </div>);
}