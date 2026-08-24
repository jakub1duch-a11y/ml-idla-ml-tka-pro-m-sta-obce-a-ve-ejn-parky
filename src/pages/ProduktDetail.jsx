import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, X, Loader, Ruler, Waves, Gauge, Droplets, Layers, Sparkles, Zap, Factory, Compass, Wifi, Wrench, Images, FileText } from 'lucide-react';
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
import RelatedProductCard from '@/components/produkt/RelatedProductCard';
import SmartValveProductSection from '@/components/produkt/SmartValveProductSection';
import ProductAEOSection, { buildAnswers } from '@/components/produkt/ProductAEOSection';
import OazaSignatureSection from '@/components/produkt/OazaSignatureSection';

const GATE_SLUGS = ['gate70', 'linea-el70', 'mlzna-brana-gate', 'bendy-brana'];

// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({ mediaItems, initialIndex, onClose, productName }) {
  const [idx, setIdx] = useState(initialIndex);
  const touchStart = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const h = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % mediaItems.length);
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + mediaItems.length) % mediaItems.length);
    };
    window.addEventListener('keydown', h);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', h);
    };
  }, [mediaItems.length, onClose]);

  const onTouchStart = (event) => { touchStart.current = event.touches?.[0]?.clientX ?? null; };
  const onTouchEnd = (event) => {
    if (touchStart.current == null) return;
    const end = event.changedTouches?.[0]?.clientX;
    if (end == null) return;
    const delta = end - touchStart.current;
    touchStart.current = null;
    if (Math.abs(delta) < 52 || mediaItems.length < 2) return;
    setIdx((i) => delta > 0 ? (i - 1 + mediaItems.length) % mediaItems.length : (i + 1) % mediaItems.length);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-[#02161d]/97 p-2 backdrop-blur-2xl sm:p-6" onClick={onClose}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(71,155,181,.14),transparent_36%),radial-gradient(circle_at_15%_80%,rgba(255,255,255,.04),transparent_28%)]" />
      <div className="absolute left-4 top-4 z-20 hidden max-w-[60%] sm:block sm:left-6 sm:top-6">
        <p className="truncate text-sm font-semibold text-white/90">{productName}</p>
        <p className="mt-1 font-mono text-[9px] uppercase tracking-[.18em] text-white/45">Foto a video galerie produktu</p>
      </div>
      <button onClick={onClose} aria-label="Zavřít galerii" className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20 sm:right-6 sm:top-6">
        <X size={18} />
      </button>
      <div className="relative z-10 flex h-full w-full max-w-7xl flex-col items-center justify-center pt-12 sm:pt-10" onClick={(e) => e.stopPropagation()}>
        <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden rounded-[24px] border border-white/10 bg-black/20 p-2 sm:rounded-[30px] sm:p-5">
          <AnimatePresence mode="wait" initial={false}>
            {mediaItems[idx]?.type === 'video' ? (
              <motion.video key={mediaItems[idx].url} src={mediaItems[idx].url} poster={mediaItems[idx].poster} controls playsInline preload="metadata" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .22 }} className="max-h-[78vh] max-w-full object-contain" />
            ) : (
              <motion.img key={mediaItems[idx]?.url} src={mediaItems[idx]?.url} alt={`${productName || 'Produkt'} – fotografie ${idx + 1}`} initial={{ opacity: 0, scale: .985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.01 }} transition={{ duration: .28, ease: [0.22, 1, 0.36, 1] }} className="max-h-[78vh] max-w-full object-contain" />
            )}
          </AnimatePresence>
          {mediaItems.length > 1 && <>
            <button onClick={() => setIdx((i) => (i - 1 + mediaItems.length) % mediaItems.length)} aria-label="Předchozí médium" className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-black/60 sm:left-5 sm:h-11 sm:w-11"><ChevronLeft size={19} /></button>
            <button onClick={() => setIdx((i) => (i + 1) % mediaItems.length)} aria-label="Další médium" className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/40 text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-black/60 sm:right-5 sm:h-11 sm:w-11"><ChevronRight size={19} /></button>
          </>}
        </div>
        {mediaItems.length > 1 && <div className="mt-3 flex w-full items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>{mediaItems.map((item, i) => <button key={`${item.type}-${item.url}-${i}`} type="button" onClick={() => setIdx(i)} aria-label={`Zobrazit ${item.type === 'video' ? 'video' : 'fotografii'} ${i + 1} z ${mediaItems.length}`} className={`relative aspect-[4/3] min-w-[76px] overflow-hidden rounded-xl border transition-all sm:min-w-[92px] ${idx === i ? 'border-white opacity-100 ring-2 ring-white/15' : 'border-white/10 opacity-45 hover:opacity-85'}`}>{item.type === 'video' ? <><img src={item.poster} alt={`Video náhled ${i + 1}`} className="h-full w-full object-cover" /><span className="absolute inset-x-1 bottom-1 rounded bg-black/65 px-1 py-0.5 text-center font-mono text-[8px] font-bold text-white">VIDEO</span></> : <img src={item.url} alt={`Náhled ${i + 1}`} className="h-full w-full object-cover" />}</button>)}</div>}
        <div className="mt-3 flex w-full items-center justify-between px-1">
          <p className="truncate text-xs text-white/55 sm:hidden">{productName}</p>
          <p className="ml-auto font-mono text-[10px] uppercase tracking-[.2em] text-white/45">{idx + 1} / {mediaItems.length}</p>
        </div>
      </div>
    </motion.div>);
}

// ─── Tabs config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: 'o-produktu', label: 'Přehled', hint: 'Design a realizace', icon: Compass },
  { id: 'technicke', label: 'Parametry', hint: 'Rozměry a provoz', icon: Ruler },
  { id: 'benefity', label: 'Přínosy', hint: 'Komfort a provoz', icon: Sparkles },
  { id: 'smart', label: 'Smart řízení', hint: 'Automatizace vody', icon: Wifi },
  { id: 'instalace', label: 'Instalace', hint: 'Kotvení a příprava', icon: Wrench },
  { id: 'video', label: 'Galerie', hint: 'Foto a video', icon: Images },
  { id: 'ke-stazeni', label: 'Ke stažení', hint: 'Výkresy a podklady', icon: FileText }
];


// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProduktDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [productMedia, setProductMedia] = useState([]);
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
    if (product) {
      const baseSEO = getProductSEO(product, stats);
      const faq = buildAnswers(product);
      setSEO({
        ...baseSEO,
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            baseSEO.jsonLd,
            {
              '@type': 'FAQPage',
              mainEntity: faq.map((item) => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: { '@type': 'Answer', text: item.a }
              }))
            }
          ]
        }
      });
    }
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
      const baseSEO = getProductSEO(p);
      const faq = buildAnswers(p);
      setSEO({
        ...baseSEO,
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            baseSEO.jsonLd,
            {
              '@type': 'FAQPage',
              mainEntity: faq.map((item) => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: { '@type': 'Answer', text: item.a }
              }))
            }
          ]
        }
      });
      const [related, nozzleResults, allProducts, mediaFiles] = await Promise.all([
      p.category_id ? base44.entities.Product.filter({ category_id: p.category_id }).catch(() => []) : [],
      base44.entities.Product.filter({ slug: 'mlzici-tryska' }).catch(() => []),
      base44.entities.Product.list().catch(() => []),
      base44.entities.MediaFile.filter({ product_slug: p.slug }).catch(() => [])]
      );
      setProductMedia((mediaFiles || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)));
      const sameCategory = (related || []).filter((r) => r.id !== p.id && r.slug !== 'mlzici-tryska');
      const fallback = (allProducts || []).filter((r) => r.id !== p.id && r.slug !== 'mlzici-tryska' && !sameCategory.some((item) => item.id === r.id));
      const similar = [...sameCategory, ...fallback].slice(0, 3);
      const nozzle = nozzleResults?.[0];
      setRelatedProducts(nozzle && nozzle.id !== p.id ? [...similar, nozzle] : similar);
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

  const scrollToElement = (element, offset = 0) => {
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const scrollToContact = () => scrollToElement(contactRef.current, 80);

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    scrollToElement(tabsNavRef.current, 64);
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

  // Sjednocená produktová galerie: fotografie i všechna videa přiřazená přes MediaFile.
  const isVideoUrl = (url) => typeof url === 'string' && /\.(mp4|webm|mov|m4v|m3u8)(\?|#|$)/i.test(url);
  const imageUrls = [product.image_url, ...(product.gallery_urls || []), ...productMedia.filter((m) => m.file_url && !isVideoUrl(m.file_url) && String(m.file_type || '').startsWith('image/')).map((m) => m.file_url)]
    .filter(Boolean)
    .filter((url, index, list) => list.indexOf(url) === index);
  const videoUrls = [product.video_url, ...productMedia.filter((m) => m.file_url && (isVideoUrl(m.file_url) || String(m.file_type || '').startsWith('video/'))).map((m) => m.file_url)]
    .filter(Boolean)
    .filter((url, index, list) => list.indexOf(url) === index);
  const allImages = imageUrls;
  const allMedia = [
    ...imageUrls.map((url) => ({ type: 'image', url })),
    ...videoUrls.map((url) => ({ type: 'video', url, poster: product.image_url || imageUrls[0] }))
  ];
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
        allMedia={allMedia}
        onOpenLightbox={(i) => setLightbox({ mediaItems: allMedia, idx: i })}
        onShowTechnical={() => handleTabClick(TABS[1])} />


      {/* ═══════ OÁZA SIGNATURE EXPERIENCE ═══════ */}
      {product.slug === 'oaza-aura-bendy' && (
        <OazaSignatureSection
          product={product}
          allImages={allImages}
          onOpenLightbox={(i) => setLightbox({ mediaItems: allImages.map((url) => ({ type: 'image', url })), idx: i })}
          onPoptat={scrollToContact}
          onShowSmart={() => handleTabClick(TABS[3])}
        />
      )}

      {/* ═══════ STICKY TABS NAV ═══════ */}
      <div ref={tabsNavRef} className="sticky top-16 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 sm:px-6 lg:px-10">
          <div className="flex shrink-0 items-center border-r border-slate-200 pr-3 sm:pr-5 lg:pr-6">
            <Link to="/mlzidla-mlzitka" className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-2 text-xs font-mono uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-900">
              <ArrowLeft size={12} /> <span className="hidden xs:inline">Zpět</span>
            </Link>
            <span className="ml-2 hidden max-w-[180px] truncate font-heading text-sm font-medium text-slate-900 md:inline lg:max-w-[240px]">{product.name}</span>
          </div>
          <div className="relative min-w-0 flex-1">
            {canScrollLeft &&
            <button type="button" onClick={() => scrollTabs(-160)} aria-label="Posunout záložky vlevo"
            className="absolute left-0 top-0 bottom-0 z-10 flex items-center justify-center w-9 bg-gradient-to-r from-white via-white/95 to-transparent">
              <ChevronLeft size={16} className="text-slate-500" />
            </button>
            }
            <div ref={tabsScrollRef} onScroll={updateArrowVisibility}
            className="flex gap-2 overflow-x-auto py-2.5 pr-2 [&::-webkit-scrollbar]:hidden sm:gap-2.5" style={{ scrollbarWidth: 'none' }}>
              {TABS.map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button key={t.id} onClick={() => handleTabClick(t)}
                    aria-pressed={isActive}
                    className={`group relative flex min-w-[148px] shrink-0 items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all sm:min-w-[158px] ${isActive ? 'border-[#0b4860]/25 bg-[#eef8fb] text-[#0b4860] shadow-[0_8px_24px_rgba(11,72,96,.08)]' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}>
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${isActive ? 'border-[#0b4860]/15 bg-white text-[#0b4860]' : 'border-slate-200 bg-slate-50 text-slate-500 group-hover:bg-white'}`}>
                      <Icon size={16} strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-semibold leading-tight">{t.label}</span>
                      <span className={`mt-1 block text-[10px] leading-tight ${isActive ? 'text-[#0b4860]/65' : 'text-slate-400'}`}>{t.hint}</span>
                    </span>
                    {isActive && <motion.span layoutId="produkt-tab-marker" className="absolute inset-x-4 -bottom-[3px] h-[3px] rounded-full bg-[#0b4860]" />}
                  </button>
                );
              })}
            </div>
            {canScrollRight &&
            <button type="button" onClick={() => scrollTabs(160)} aria-label="Posunout záložky vpravo"
            className="absolute right-0 top-0 bottom-0 z-10 flex items-center justify-center w-9 bg-gradient-to-l from-white via-white/95 to-transparent">
              <ChevronRight size={16} className="text-slate-500" />
            </button>
            }
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          {activeTab === 'o-produktu' && <OProduktuTab product={product} onOpenLightbox={(i, customImages) => setLightbox({ mediaItems: (customImages || allImages).map((url) => ({ type: 'image', url })), idx: i })} />}
          {activeTab === 'technicke' &&
          <>
              <SpecsTab product={product} techRows={techRows} />
              {GATE_SLUGS.includes(product.slug) && <GateComparisonTable />}
            </>
          }
          {activeTab === 'benefity' && <BenefityTab product={product} />}
          {activeTab === 'smart' && <SmartValveProductSection embedded product={product} onPoptat={scrollToContact} />}
          {activeTab === 'instalace' && <InstallationTab product={product} />}
          {activeTab === 'video' && <ZivaUkazkaTab product={product} allImages={allImages} onOpenLightbox={(i) => setLightbox({ mediaItems: allImages.map((url) => ({ type: 'image', url })), idx: i })} />}
          {activeTab === 'ke-stazeni' && <DownloadsTab product={product} />}
        </motion.div>
      </AnimatePresence>

      {/* ═══════ TAB FOOTER NAV ═══════ */}
      <div className="border-t border-slate-200 bg-slate-50 py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {nextTab ?
          <button onClick={() => handleTabClick(nextTab)}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full px-2 font-medium text-slate-600 transition-colors hover:text-slate-900 text-sm">
              Pokračovat: {nextTab.label} <ArrowRight size={15} />
            </button> :
          <span className="text-sm text-slate-400">Máte vše potřebné k rozhodnutí?</span>
          }
          <button type="button" onClick={scrollToContact}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#0b4860] px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_22px_rgba(11,72,96,.16)] transition-all hover:bg-[#08394c]">
            Poptat {product.name} <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* ═══════ AEO / FAQ ═══════ */}
      <ProductAEOSection product={product} />

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
                    <p className="text-sm text-white/75 leading-relaxed">{item.a}</p>
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
            <h2 className="font-heading font-semibold text-3xl text-slate-900 tracking-tight mb-10">Podobné produkty</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((r, i) =>
            <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <RelatedProductCard product={r} index={i} />
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
      <Lightbox mediaItems={lightbox.mediaItems} initialIndex={lightbox.idx} onClose={() => setLightbox(null)} productName={product.name} />
      }

      <ProductStickyFooterBar product={product} show={showStickyBar} onPoptat={scrollToContact} />
    </div>);
}