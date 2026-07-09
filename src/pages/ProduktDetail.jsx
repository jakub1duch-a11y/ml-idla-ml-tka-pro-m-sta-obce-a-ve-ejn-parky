import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, X, Loader, Maximize2, Truck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { base44 } from '@/api/base44Client';
import { trackProductView } from '@/lib/ga4';
import { setSEO, getProductSEO } from '@/lib/seo';
import ProductReviews from '@/components/reviews/ProductReviews';
import CostCalculatorWidget from '@/components/produkt/CostCalculatorWidget';
import InstallationTab from '@/components/produkt/tabs/InstallationTab';
import BenefitsTab from '@/components/produkt/tabs/BenefitsTab';
import VideoTab from '@/components/produkt/tabs/VideoTab';
import DetailTab from '@/components/produkt/tabs/DetailTab';
import SpecsTab from '@/components/produkt/tabs/SpecsTab';
import SmartModulesTab from '@/components/produkt/tabs/SmartModulesTab';
import DownloadsTab from '@/components/produkt/tabs/DownloadsTab';
import MistFogEffect from '@/components/produkt/MistFogEffect';

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
      <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
        <X size={18} />
      </button>
      <div className="relative max-w-5xl w-full mx-6" onClick={(e) => e.stopPropagation()}>
        <img src={images[idx]} alt="" className="w-full max-h-[85vh] object-contain" />
        {images.length > 1 &&
        <>
            <button onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black transition-all">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setIdx((i) => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black transition-all">
              <ChevronRight size={18} />
            </button>
            <p className="text-center text-xs font-mono text-white/30 mt-4 tracking-widest">{idx + 1} / {images.length}</p>
          </>
        }
      </div>
    </div>);
}

// ─── Inline contact form ──────────────────────────────────────────────────────
const ANCHORING_PHOTO_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/44f2b5c20_moznostikotveni.webp';

function ContactForm({ productName }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', smartModule: false, ledLighting: false, installationType: 'mobile' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    const extras = [
    form.smartModule && 'Smart modul – chytré řízení mlžítek',
    form.ledLighting && 'LED nasvícení',
    form.installationType === 'mobile' ? 'Instalace: Mobilní – zemní vrut (do 30 min)' : 'Instalace: Trvalé a stabilní – kotvení do betonu'].
    filter(Boolean).join(', ');
    await base44.entities.ContactInquiry.create({
      name: form.name,
      email: form.email,
      message: `[${productName}] ${form.message || 'Zájem o produkt'} | ${extras}`,
      description: form.phone ? `Tel: ${form.phone}` : ''
    }).catch(() => {});
    setSent(true);
    setSending(false);
    if (typeof window !== 'undefined' && window.trackHolmTec) {
      window.trackHolmTec('contact_form_submit', { product_name: productName, form_type: 'produkt' });
    }
  };

  if (sent) return (
    <div className="text-center py-8">
      <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
        <span className="text-emerald-600 text-xl">✓</span>
      </div>
      <p className="text-slate-900 font-medium text-lg">Poptávka odeslána.</p>
      <p className="text-slate-400 text-sm mt-1">Odpovídáme do 24 h.</p>
    </div>);

  return (
    <form onSubmit={submit} className="space-y-5 p-7 lg:p-8 rounded-3xl border-2 border-slate-900 shadow-xl bg-TRANSPARENT">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Jméno a příjmení *</label>
          <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm placeholder-slate-300 focus:outline-none focus:border-slate-900 transition-colors text-[hsl(var(--popover))]"
          placeholder="Jan Novák" />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Email *</label>
          <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-slate-900 transition-colors"
          placeholder="jan@firma.cz" />
        </div>
      </div>
      <div className="opacity-100">
        <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Telefon</label>
        <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-slate-900 transition-colors"
        placeholder="+420 000 000 000" />
      </div>

      {/* Doplňkové možnosti */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
        <p className="text-xs font-mono text-slate-400 tracking-widest uppercase">Doplňkové možnosti</p>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.smartModule} onChange={(e) => setForm((f) => ({ ...f, smartModule: e.target.checked }))}
          className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
          <span className="text-sm text-slate-700">Smart modul – chytré řízení mlžítek</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.ledLighting} onChange={(e) => setForm((f) => ({ ...f, ledLighting: e.target.checked }))}
          className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
          <span className="text-sm text-slate-700">LED nasvícení</span>
        </label>

        <div>
          <p className="text-sm text-slate-700 mb-2">Typ instalace</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className={`flex flex-col gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all ${form.installationType === 'mobile' ? 'border-slate-900 bg-white' : 'border-slate-200 bg-white/50'}`}>
              <span className="flex items-center gap-2">
                <input type="radio" name="installationType" checked={form.installationType === 'mobile'} onChange={() => setForm((f) => ({ ...f, installationType: 'mobile' }))}
                className="w-4 h-4 text-slate-900 focus:ring-slate-900" />
                <span className="text-sm font-medium text-slate-900">Mobilní</span>
              </span>
              <span className="text-xs text-slate-500 pl-6">Zemní vrut (instalace do 30 min)</span>
            </label>
            <label className={`flex flex-col gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all ${form.installationType === 'permanent' ? 'border-slate-900 bg-white' : 'border-slate-200 bg-white/50'}`}>
              <span className="flex items-center gap-2">
                <input type="radio" name="installationType" checked={form.installationType === 'permanent'} onChange={() => setForm((f) => ({ ...f, installationType: 'permanent' }))}
                className="w-4 h-4 text-slate-900 focus:ring-slate-900" />
                <span className="text-sm font-medium text-slate-900">Trvalé a stabilní</span>
              </span>
              <span className="text-xs text-slate-500 pl-6">Kotvení do betonu</span>
            </label>
          </div>
          <a href={ANCHORING_PHOTO_URL} target="_blank" rel="noopener noreferrer"
          className="inline-block text-xs text-slate-400 hover:text-slate-900 underline mt-2">
            Zobrazit náhled možností kotvení
          </a>
        </div>
      </div>

      <div className="text-[hsl(var(--popover))]">
        <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Popište váš projekt</label>
        <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} rows={4}
        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-slate-900 transition-colors resize-none"
        placeholder="Kde plánujete instalaci, jaký prostor, přibližné rozměry..." />
      </div>
      <button type="submit" disabled={sending}
      className="w-full py-5 text-white rounded-full hover:bg-slate-800 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg normal-case font-normal text-sm bg-[#295189]">
        {sending ? <Loader size={18} className="animate-spin" /> : <>Poptat produkt zdarma <ArrowRight size={18} /></>}
      </button>
    </form>);
}

// ─── Tabs config ───────────────────────────────────────────────────────────────
const TABS = [
{ id: 'detail', label: 'Detail produktu' },
{ id: 'galerie', label: 'Galerie a realizované projekty' },
{ id: 'specifikace', label: 'Technické specifikace' },
{ id: 'smart', label: 'SMART moduly' },
{ id: 'instalace', label: 'Instalace' },
{ id: 'video', label: 'Videa - ukázka v akci' },
{ id: 'ke-stazeni', label: 'Ke stažení' },
{ id: 'poptat', label: 'Poptat produkt', action: 'scroll' }];


// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProduktDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [activeTab, setActiveTab] = useState('detail');
  const tabsNavRef = useRef(null);
  const contactRef = useRef(null);

  const handleReviewStats = (stats) => {
    if (product) setSEO(getProductSEO(product, stats));
  };

  useEffect(() => {
    if (slug === 'gate70') {navigate('/gate70', { replace: true });return;}
    setLoading(true);
    setNotFound(false);
    setActiveTab('detail');
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

  const handleTabClick = (tab) => {
    if (tab.action === 'scroll') {
      if (contactRef.current) {
        gsap.to(window, {
          duration: 0.9,
          scrollTo: { y: contactRef.current, offsetY: 80 },
          ease: 'power2.inOut'
        });
      }
      return;
    }
    setActiveTab(tab.id);
    if (tabsNavRef.current) {
      gsap.to(window, {
        duration: 0.9,
        scrollTo: { y: tabsNavRef.current, offsetY: 64 },
        ease: 'power2.inOut'
      });
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
  const img = (i) => allImages[i] || null;

  const techRows = [
  product.coverage_area && { label: 'Výška', value: product.coverage_area },
  { label: 'Trysky', value: product.micron_size ? `AISI 316L, ${product.micron_size} μm` : 'AISI 316L' },
  product.pressure && { label: 'Tlak', value: product.pressure },
  product.water_consumption && { label: 'Spotřeba vody', value: product.water_consumption },
  product.material && { label: 'Materiál', value: product.material },
  { label: 'Povrch', value: 'Broušený / kartáčovaný' },
  product.power_supply && { label: 'Napájení & řízení', value: product.power_supply },
  { label: 'Výroba', value: 'Zakázková, 6–8 týdnů' }].
  filter(Boolean);

  return (
    <div className="min-h-screen bg-white">

      {/* ═══════ FIXNÍ ÚVODNÍ SEKCE — HERO ═══════ */}
      <div className="relative h-screen min-h-[640px] overflow-hidden">
        {img(0) ?
        <img src={img(0)} alt={product.name} className="w-full h-full object-cover" /> :
        <div className="w-full h-full bg-slate-100" />
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
        <div className="absolute inset-0 to-white bg-gradient-to-l via-black/5 from-black/" />

        <div className="absolute top-24 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-10">
          <Link to="/mlzidla-mlzitka" className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={12} /> Zpět na produkty
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-10 pb-14 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 items-end">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
              <p className="text-xs font-mono tracking-[0.3em] uppercase text-white/60 mb-3">Nízkotlaké mlžÍTKO - 2–7 BAR</p>
              <h1 className="font-heading font-light tracking-tight leading-[0.95] text-4xl sm:text-5xl lg:text-8xl text-white mb-6">
                {product.name}
              </h1>

              {product.short_description &&
              <p className="text-white/60 text-lg max-w-lg mb-6 leading-relaxed font-light">
                  {product.short_description}
                </p>
              }

              <div className="flex flex-wrap items-center gap-5 mb-8">
                <p className="text-2xl font-light text-white">Cena: <span className="font-lght">od {product.price_from ? `${product.price_from} Kč` : ''} (na vyžádání)</span></p>
                <span className="flex items-center gap-1.5 text-xs font-mono tracking-widest uppercase text-emerald-300">
                  <Truck size={14} /> Doprava zdarma
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/kontakt"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-slate-900 text-sm font-bold rounded-full hover:bg-white/90 transition-all">
                  Poptat individuální řešení <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15 }}>
              <CostCalculatorWidget waterConsumption={product.water_consumption} />
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 text-white/20">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/30" />
          <span className="text-[9px] font-mono tracking-[0.3em] uppercase">Scroll</span>
        </div>
      </div>

      {/* ═══════ STICKY TABS NAV ═══════ */}
      <div ref={tabsNavRef} className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center gap-4 lg:gap-8">
          <div className="flex items-center gap-3 py-4 border-r border-slate-200 pr-4 lg:pr-8 shrink-0">
            <Link to="/mlzidla-mlzitka" className="inline-flex items-center gap-1.5 text-xs font-mono tracking-widest text-slate-400 hover:text-slate-900 transition-colors text-left uppercase">ZPĚT DO KOLEKCE

            </Link>
            <span className="hidden lg:inline text-sm font-heading font-medium text-slate-900 whitespace-nowrap">{product.name}</span>
          </div>
          <div className="flex gap-8 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {TABS.map((t) =>
            <button key={t.id} onClick={() => handleTabClick(t)}
            className={`relative py-5 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === t.id && t.action !== 'scroll' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
                {t.label}
                {activeTab === t.id && t.action !== 'scroll' &&
              <motion.div layoutId="produkt-tab-underline" className="absolute left-0 right-0 -bottom-px h-0.5 bg-slate-900" />
              }
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          {activeTab === 'detail' && <DetailTab product={product} />}
          {activeTab === 'galerie' &&
          <BenefitsTab product={product} allImages={allImages} onOpenLightbox={(i) => setLightbox({ images: allImages, idx: i })} />
          }
          {activeTab === 'specifikace' && <SpecsTab product={product} techRows={techRows} />}
          {activeTab === 'smart' && <SmartModulesTab product={product} />}
          {activeTab === 'instalace' && <InstallationTab product={product} />}
          {activeTab === 'video' && <VideoTab product={product} />}
          {activeTab === 'ke-stazeni' && <DownloadsTab product={product} />}
        </motion.div>
      </AnimatePresence>

      {/* ═══════ TAB FOOTER NAV ═══════ */}
      {(() => {
        const contentTabs = TABS.filter((t) => t.action !== 'scroll');
        const idx = contentTabs.findIndex((t) => t.id === activeTab);
        const nextTab = contentTabs[idx + 1];
        return (
          <div className="border-t border-slate-200 bg-slate-50 py-6">
            <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              {nextTab ?
              <button onClick={() => handleTabClick(nextTab)}
              className="inline-flex items-center gap-2 font-medium text-slate-600 hover:text-slate-900 transition-colors uppercase text-sm">
                  Pokračovat: {nextTab.label} <ArrowRight size={15} />
                </button> :
              <span />
              }
              <button onClick={() => handleTabClick({ action: 'scroll' })}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all">
                Poptat produkt zdarma <ArrowRight size={16} />
              </button>
            </div>
          </div>);

      })()}

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
              <ContactForm productName={product.name} />
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
    </div>);
}