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
import SmartCloudTab from '@/components/produkt/tabs/SmartCloudTab';
import InstallationTab from '@/components/produkt/tabs/InstallationTab';
import BenefitsTab from '@/components/produkt/tabs/BenefitsTab';

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
function ContactForm({ productName }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    await base44.entities.ContactInquiry.create({
      name: form.name,
      email: form.email,
      message: `[${productName}] ${form.message || 'Zájem o produkt'}`,
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
      <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-4">
        <span className="text-slate-900 text-xl">✓</span>
      </div>
      <p className="text-slate-900 font-light text-lg">Poptávka odeslána.</p>
      <p className="text-slate-400 text-sm mt-1">Odpovídáme do 24 h.</p>
    </div>);

  return (
    <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Jméno a příjmení *</label>
          <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-slate-400 transition-colors"
          placeholder="Jan Novák" />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Email *</label>
          <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-slate-400 transition-colors"
          placeholder="jan@firma.cz" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Telefon</label>
        <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-slate-400 transition-colors"
        placeholder="+420 000 000 000" />
      </div>
      <div>
        <label className="block text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Popište váš projekt</label>
        <textarea value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} rows={4}
        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 text-sm placeholder-slate-300 focus:outline-none focus:border-slate-400 transition-colors resize-none"
        placeholder="Kde plánujete instalaci, jaký prostor, přibližné rozměry..." />
      </div>
      <button type="submit" disabled={sending}
      className="w-full py-4 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
        {sending ? <Loader size={16} className="animate-spin" /> : <>Odeslat poptávku na {productName} <ArrowRight size={16} /></>}
      </button>
    </form>);
}

// ─── Tabs config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: 'smart', label: 'Inteligentní řízení & Cloud' },
  { id: 'instalace', label: 'Instalace, kotvení & mobilita' },
  { id: 'benefity', label: 'Benefity a využití' },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProduktDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [activeTab, setActiveTab] = useState('smart');
  const tabsNavRef = useRef(null);

  const handleReviewStats = (stats) => {
    if (product) setSEO(getProductSEO(product, stats));
  };

  useEffect(() => {
    if (slug === 'gate70') {navigate('/gate70', { replace: true });return;}
    setLoading(true);
    setNotFound(false);
    setActiveTab('smart');
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

  const handleTabClick = (id) => {
    setActiveTab(id);
    if (tabsNavRef.current) {
      gsap.to(window, {
        duration: 0.9,
        scrollTo: { y: tabsNavRef.current, offsetY: 64 },
        ease: 'power2.inOut',
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
        <div className="absolute inset-0 to-white bg-gradient-to-l via-black/5 from-black/0" />

        <div className="absolute top-24 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-10">
          <Link to="/mlzidla-mlzitka" className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={12} /> Zpět na produkty
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-10 pb-14 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 items-end">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
              <p className="text-xs font-mono tracking-[0.3em] uppercase text-white/60 mb-3">Nízkotlaké mlžení 2–7 BAR</p>
              <h1 className="font-heading font-light tracking-tight leading-[0.95] text-4xl sm:text-5xl lg:text-8xl text-white mb-6">
                {product.name}
              </h1>

              {product.short_description &&
              <p className="text-white/60 text-lg max-w-lg mb-6 leading-relaxed font-light">
                  {product.short_description}
                </p>
              }

              <div className="flex flex-wrap items-center gap-5 mb-8">
                <p className="text-2xl font-light text-white">Cena: <span className="font-medium">na vyžádání</span></p>
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
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex gap-8 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) =>
          <button key={t.id} onClick={() => handleTabClick(t.id)}
          className={`relative py-5 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === t.id ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
              {t.label}
              {activeTab === t.id &&
            <motion.div layoutId="produkt-tab-underline" className="absolute left-0 right-0 -bottom-px h-0.5 bg-slate-900" />
            }
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          {activeTab === 'smart' && <SmartCloudTab />}
          {activeTab === 'instalace' && <InstallationTab product={product} techRows={techRows} />}
          {activeTab === 'benefity' &&
            <BenefitsTab product={product} allImages={allImages} onOpenLightbox={(i) => setLightbox({ images: allImages, idx: i })} />
          }
        </motion.div>
      </AnimatePresence>

      {/* ═══════ REVIEWS ═══════ */}
      <ProductReviews productId={product.id} onStatsLoaded={handleReviewStats} />

      {/* ═══════ INLINE CONTACT FORM ═══════ */}
      <section className="bg-slate-50 border-t border-slate-200 py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Zakázková výroba</p>
              <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight mb-4">
                Váš prostor si zaslouží<br /><span className="text-slate-400">vlastní {product.name}.</span>
              </h2>
              <p className="text-slate-400 text-sm font-light mb-8">Konzultace zdarma · 3D vizualizace do 48 h · Odpovídáme do 24 h</p>
              <div className="space-y-3 text-sm text-slate-500 font-mono">
                <a href="tel:+420774700390" className="flex items-center gap-2 hover:text-slate-900 transition-colors">+420 774700390 </a>
                <a href="mailto:info@holmtec.cz" className="flex items-center gap-2 hover:text-slate-900 transition-colors">obchod1@holmtec.cz</a>
              </div>
            </motion.div>
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