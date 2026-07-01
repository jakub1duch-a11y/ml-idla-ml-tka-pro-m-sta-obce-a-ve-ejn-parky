import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, X, Loader, Maximize2, Droplet, Zap, Gauge } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { trackProductView } from '@/lib/ga4';
import { setSEO, getProductSEO } from '@/lib/seo';
import ProductReviews from '@/components/reviews/ProductReviews';


// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({ images, initialIndex, onClose }) {
  const [idx, setIdx] = useState(initialIndex);
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx(i => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setIdx(i => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [images.length, onClose]);

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
        <X size={18} />
      </button>
      <div className="relative max-w-5xl w-full mx-6" onClick={e => e.stopPropagation()}>
        <img src={images[idx]} alt="" className="w-full max-h-[85vh] object-contain" />
        {images.length > 1 && (
          <>
            <button onClick={() => setIdx(i => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black transition-all">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setIdx(i => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black transition-all">
              <ChevronRight size={18} />
            </button>
            <p className="text-center text-xs font-mono text-white/30 mt-4 tracking-widest">{idx + 1} / {images.length}</p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Clickable image ──────────────────────────────────────────────────────────
function Photo({ src, alt, onClick, className = '' }) {
  return (
    <div className={`relative overflow-hidden group cursor-pointer ${className}`} onClick={onClick}>
      <img src={src} alt={alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300" />
      <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
        <Maximize2 size={12} />
      </div>
    </div>
  );
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
      description: form.phone ? `Tel: ${form.phone}` : '',
    }).catch(() => {});
    setSent(true);
    setSending(false);
    if (typeof window !== 'undefined' && window.trackHolmTec) {
      window.trackHolmTec('contact_form_submit', { product_name: productName, form_type: 'produkt' });
    }
  };

  if (sent) return (
    <div className="text-center py-8">
      <div className="w-12 h-12 rounded-full bg-cyan/20 border border-cyan/40 flex items-center justify-center mx-auto mb-4">
        <span className="text-cyan text-xl">✓</span>
      </div>
      <p className="text-white font-light text-lg">Poptávka odeslána.</p>
      <p className="text-white/40 text-sm mt-1">Odpovídáme do 24 h.</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-white/40 tracking-widest uppercase mb-2">Jméno a příjmení *</label>
          <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan/50 transition-colors"
            placeholder="Jan Novák" />
        </div>
        <div>
          <label className="block text-xs font-mono text-white/40 tracking-widest uppercase mb-2">Email *</label>
          <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan/50 transition-colors"
            placeholder="jan@firma.cz" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-mono text-white/40 tracking-widest uppercase mb-2">Telefon</label>
        <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan/50 transition-colors"
          placeholder="+420 000 000 000" />
      </div>
      <div>
        <label className="block text-xs font-mono text-white/40 tracking-widest uppercase mb-2">Popište váš projekt</label>
        <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={4}
          className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-cyan/50 transition-colors resize-none"
          placeholder="Kde plánujete instalaci, jaký prostor, přibližné rozměry..." />
      </div>
      <button type="submit" disabled={sending}
        className="w-full py-4 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/25 disabled:opacity-60 flex items-center justify-center gap-2">
        {sending ? <Loader size={16} className="animate-spin" /> : <>Odeslat poptávku na {productName} <ArrowRight size={16} /></>}
      </button>
    </form>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProduktDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const handleReviewStats = (stats) => {
    if (product) setSEO(getProductSEO(product, stats));
  };

  useEffect(() => {
    if (slug === 'gate70') { navigate('/gate70', { replace: true }); return; }
    setLoading(true);
    setNotFound(false);
    base44.entities.Product.filter({ slug })
      .then(async results => {
        if (!results || results.length === 0) { setNotFound(true); return; }
        const p = results[0];
        setProduct(p);
        trackProductView(p.name, p.slug, p.category_id);
        setSEO(getProductSEO(p));
        if (p.category_id) {
          const related = await base44.entities.Product.filter({ category_id: p.category_id }).catch(() => []);
          setRelatedProducts((related || []).filter(r => r.id !== p.id).slice(0, 3));
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-ink flex items-center justify-center">
      <Loader size={28} className="animate-spin text-cyan/50" />
    </div>
  );

  if (notFound || !product) return (
    <div className="min-h-screen bg-ink flex items-center justify-center pt-28">
      <div className="text-center">
        <p className="text-white/40 mb-4 text-lg">Produkt nenalezen.</p>
        <Link to="/kolekce" className="text-cyan hover:underline">← Zpět na kolekci</Link>
      </div>
    </div>
  );

  const allImages = [product.image_url, ...(product.gallery_urls || [])].filter(Boolean);
  const img = (i) => allImages[i] || null;

  // Tech specs rows
  const techRows = [
    product.coverage_area && { label: 'Výška', value: product.coverage_area },
    { label: 'Trysky', value: product.micron_size ? `AISI 316L, ${product.micron_size} μm` : 'AISI 316L' },
    product.pressure && { label: 'Tlak', value: product.pressure },
    product.water_consumption && { label: 'Spotřeba vody', value: product.water_consumption },
    product.material && { label: 'Materiál', value: product.material },
    { label: 'Povrch', value: 'Broušený / kartáčovaný' },
    { label: 'Instalace', value: 'Zemní patka nebo příruba' },
    product.power_supply && { label: 'Napájení & řízení', value: product.power_supply },
    { label: 'Výroba', value: 'Zakázková, 6–8 týdnů' },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-ink" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ═══════════════════════════════════════════════════════
          1. FULLSCREEN HERO
      ═══════════════════════════════════════════════════════ */}
      <div className="relative h-screen min-h-[600px] overflow-hidden">
        {img(0) ? (
          <img src={img(0)} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-surface" />
        )}
        {/* Dark overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent" />

        {/* Back */}
        <div className="absolute top-24 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-10">
          <Link to="/kolekce" className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-white/40 hover:text-white transition-colors">
            <ArrowLeft size={12} /> Zpět na produkty
          </Link>
        </div>

        {/* Hero text — product name + short description + specs icons + CTA */}
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-10 pb-14 lg:pb-20">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-cyan mb-3">HolmTec · Mlžné skulptury</p>
            {/* Bold product name */}
            <h1 style={{ fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 0.9 }}
              className="text-7xl lg:text-[10rem] text-white uppercase mb-6">
              {product.name}
            </h1>
            
            {/* Short description */}
            {product.short_description && (
              <p className="text-white/60 text-lg max-w-lg mb-8 leading-relaxed font-light">
                {product.short_description}
              </p>
            )}

            {/* Specs icons row */}
            <div className="flex flex-wrap gap-8 mb-10">
              {product.water_consumption && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center border border-cyan/20">
                    <Droplet size={18} className="text-cyan" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Průměrná spotřeba l/h</p>
                    <p className="text-sm text-white font-medium">{product.water_consumption}</p>
                  </div>
                </div>
              )}
              {product.micron_size && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center border border-cyan/20">
                    <Zap size={18} className="text-cyan" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Trysky (počet ks)</p>
                    <p className="text-sm text-white font-medium">{product.micron_size}</p>
                  </div>
                </div>
              )}
              {product.pressure && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center border border-cyan/20">
                    <Gauge size={18} className="text-cyan" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Tlak</p>
                    <p className="text-sm text-white font-medium">{product.pressure}</p>
                  </div>
                </div>
              )}
            </div>

            {/* CTA button */}
            <Link to="/kontakt"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-xl shadow-cyan/30">
              Poptat produkt <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 text-white/20">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/30" />
          <span className="text-[9px] font-mono tracking-[0.3em] uppercase">Scroll</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          2. THUMBNAIL STRIP + TAG
      ═══════════════════════════════════════════════════════ */}
      {allImages.length > 1 && (
        <div className="bg-surface border-b border-white/8">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center gap-4 overflow-x-auto scrollbar-none">
            <span className="shrink-0 text-[10px] font-mono tracking-widest uppercase text-white/25 mr-2">Galerie produktu</span>
            {allImages.slice(0, 5).map((src, i) => (
              <button key={i} onClick={() => setLightbox({ images: allImages, idx: i })}
                className="shrink-0 w-14 h-14 rounded-lg overflow-hidden border border-white/10 hover:border-cyan/40 transition-all">
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          3. SECTION: "Strom, který chladí vzduch" — text + image
      ═══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-3">Architektura přírody</p>
            {/* Two-line headline: normal + italic */}
            <h2 className="text-white mb-8" style={{ lineHeight: 1.0 }}>
              <span style={{ display: 'block', fontWeight: 700, fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.04em' }}>
                {product.name === 'OSTEV' ? 'Strom, který' : product.name + ','}
              </span>
              <span style={{ display: 'block', fontWeight: 700, fontStyle: 'italic', fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.04em' }}>
                {product.name === 'OSTEV' ? 'chladí vzduch.' : 'který osvěžuje.'}
              </span>
            </h2>
            <p className="text-white/60 text-base lg:text-lg leading-relaxed font-light mb-8">
              {product.name === 'OSTEV'
                ? 'OSTEV není pouhé mlžítko — je to skulptura s duší stromu. Mohutný nerezový kmen se větví do elegantních ramen, z jejichž konců tryskají jemné mlžné clony. Ochlazení až o 9 °C, bez kapek na zemi, bez hluku.'
                : `${product.name} kombinuje estetiku s funkcí. Průmyslové mlžení, prémiová nerezová ocel a smart řízení v jednom produktu.`}
            </p>
            <ul className="space-y-3 mb-10">
              {[
                product.coverage_area && `Výška ${product.coverage_area.split(',')[0]}`,
                product.material && `Materiál ${product.material.split(',')[0]}`,
                'Smart senzory, ovládání z mobilu',
              ].filter(Boolean).map(item => (
                <li key={item} className="flex items-center gap-3 text-sm text-white/60 font-light">
                  <span className="w-1 h-1 rounded-full bg-cyan shrink-0" />{item}
                </li>
              ))}
            </ul>
            {/* Stat pills */}
            <div className="flex flex-wrap gap-6">
              {[
                { val: '−9 °C', label: 'Ochlazení' },
                { val: product.pressure || '70 bar', label: 'Tlak mlžení' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p style={{ fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.04em', lineHeight: 1 }} className="text-white">{s.val}</p>
                  <p className="text-[10px] font-mono text-white/35 tracking-widest uppercase mt-1">{s.label}</p>
                </div>
              ))}
              <div className="flex flex-col gap-1 ml-2 justify-center">
                <span className="text-[11px] font-mono text-cyan/70 flex items-center gap-1.5">📱 Wi-Fi Smart App řízení</span>
              </div>
            </div>
          </motion.div>

          {img(2) && (
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <Photo src={img(2)} alt={product.name} className="aspect-[3/4] rounded-2xl"
                onClick={() => setLightbox({ images: allImages, idx: 2 })} />
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          4. SECTION: "Každá kapka nespadne na zem" — image left, text right
      ═══════════════════════════════════════════════════════ */}
      {img(3) && (
        <section className="bg-surface border-y border-white/8">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                <Photo src={img(3)} alt={product.name} className="aspect-[4/3] rounded-2xl"
                  onClick={() => setLightbox({ images: allImages, idx: 3 })} />
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
                <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-3">Materiál a detail</p>
                <h2 className="text-white mb-8" style={{ lineHeight: 1.0 }}>
                  <span style={{ display: 'block', fontWeight: 700, fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', letterSpacing: '-0.04em' }}>Každá kapka</span>
                  <span style={{ display: 'block', fontWeight: 700, fontStyle: 'italic', fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', letterSpacing: '-0.04em' }}>nespadne na zem.</span>
                </h2>
                <p className="text-white/60 text-base leading-relaxed font-light mb-8">
                  Trysky {product.micron_size ? product.micron_size : '10–50'} μm vytvářejí kapičky tak drobné, že se okamžitě odpařují ve vzduchu. Žádné mokré chodníky. Žádné louže. Jen příjemný chlad, který visí ve vzduchu jako ranní mlha.
                </p>
                <blockquote className="border-l-2 border-cyan/50 pl-6">
                  <p className="text-white/50 italic text-base font-light">"Vzduch se ochladí dřív, než si uvědomíte, co se děje."</p>
                </blockquote>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          5. FEATURES GRID: "Víc než mlžítko"
      ═══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
          <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-4">Vlastnosti</p>
          <h2 className="text-white" style={{ lineHeight: 1.0 }}>
            <span style={{ display: 'block', fontWeight: 700, fontSize: 'clamp(2.5rem, 4.5vw, 4rem)', letterSpacing: '-0.04em' }}>Víc než mlžítko.</span>
            <span style={{ display: 'block', fontWeight: 700, fontStyle: 'italic', fontSize: 'clamp(2.5rem, 4.5vw, 4rem)', letterSpacing: '-0.04em' }}>Prvek prostoru.</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8 rounded-2xl overflow-hidden border border-white/10">
          {[
            { icon: '💧', title: 'Mlžení 360°', desc: 'Každé rameno tryská jemnou mlhovou clonu. Ochlazení okolí až o 9 °C v okruhu 4 metrů.' },
            { icon: '🔩', title: 'AISI 316L Nerez', desc: 'Námořní nerez odolná UV záření, vandalismu i zimním teplotám. Záruka 5 let.' },
            { icon: '📱', title: 'Smart řízení', desc: 'Senzory teploty a pohybu automaticky aktivují mlžení. Ovládání z mobilu.' },
            { icon: '🛠️', title: 'Zakázková výroba', desc: `Výška 3–5 m, 4–8 ramen, povrchová úprava, příruba nebo zemní patka dle PD.` },
          ].map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="bg-card_bg p-7">
              <span className="text-2xl mb-3 block">{f.icon}</span>
              <h3 style={{ fontWeight: 600, fontSize: '1.05rem', letterSpacing: '-0.02em' }} className="text-white mb-3">{f.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed font-light">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          6. TECH PARAMS — "Preciznost v každém detailu"
      ═══════════════════════════════════════════════════════ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-4">Technické parametry</p>
              <h2 className="text-white mb-10" style={{ lineHeight: 1.0 }}>
                <span style={{ display: 'block', fontWeight: 700, fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', letterSpacing: '-0.04em' }}>Preciznost</span>
                <span style={{ display: 'block', fontWeight: 700, fontStyle: 'italic', fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', letterSpacing: '-0.04em' }}>v každém detailu.</span>
              </h2>
              <div className="rounded-2xl overflow-hidden border border-white/10">
                {techRows.map((row, i) => (
                  <div key={row.label} className={`flex items-center justify-between gap-6 px-6 py-4 ${i % 2 === 0 ? 'bg-card_bg' : 'bg-surface'}`}>
                    <span className="text-xs font-mono text-white/35 tracking-widest uppercase">{row.label}</span>
                    <span className="text-sm text-white font-medium text-right">{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/20 mt-4 font-mono leading-relaxed">* Všechny parametry jsou orientační. Finální specifikace vznikají v rámci zakázkového procesu dle konkrétního místa instalace.</p>
              <a href={`mailto:obchod1@holmtec.cz?subject=Technický list — ${product.name}`}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 border border-cyan/40 text-cyan text-xs font-mono tracking-widest uppercase rounded-full hover:bg-cyan/10 transition-all">
                ↓ Vyžádat PDF technický list
              </a>
            </motion.div>

            {img(3) && (
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-5">
                <Photo src={img(3)} alt={product.name} className="aspect-[4/3] rounded-2xl"
                  onClick={() => setLightbox({ images: allImages, idx: 3 })} />
                <blockquote className="text-center px-6">
                  <p className="text-white/40 italic text-sm font-light">"Přirozená forma stromu v nerezové dokonalosti."</p>
                </blockquote>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          7. VIDEO SECTION
      ═══════════════════════════════════════════════════════ */}
      <section id="videa" className="bg-surface border-y border-white/8 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-4">Videa z terénu</p>
          <h2 className="text-white mb-12" style={{ lineHeight: 1.0 }}>
            <span style={{ display: 'block', fontWeight: 700, fontSize: 'clamp(2.5rem, 4.5vw, 4rem)', letterSpacing: '-0.04em' }}>{product.name}</span>
            <span style={{ display: 'block', fontWeight: 700, fontStyle: 'italic', fontSize: 'clamp(2.5rem, 4.5vw, 4rem)', letterSpacing: '-0.04em' }}>v akci.</span>
          </h2>
          {/* Gallery of images shown as video previews if no video */}
          {allImages.length >= 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {allImages.slice(0, 2).map((src, i) => (
                <Photo key={i} src={src} alt={`${product.name} instalace ${i+1}`} className="aspect-video rounded-2xl"
                  onClick={() => setLightbox({ images: allImages, idx: i })} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          7. USE CASES: "Každý prostor má svůj ..."
      ═══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-32">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
          <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-4">Kde {product.name} roste</p>
          <h2 className="text-white" style={{ lineHeight: 1.0 }}>
            <span style={{ display: 'block', fontWeight: 700, fontSize: 'clamp(2.5rem, 4.5vw, 4rem)', letterSpacing: '-0.04em' }}>Každý prostor</span>
            <span style={{ display: 'block', fontWeight: 700, fontStyle: 'italic', fontSize: 'clamp(2.5rem, 4.5vw, 4rem)', letterSpacing: '-0.04em' }}>má svůj {product.name}.</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { emoji: '🏛️', title: 'Náměstí & piazzy', desc: 'Dominantní prvek veřejného prostoru, který chladí stovky lidí a stává se fotografovanou ikonou města.' },
            { emoji: '🎪', title: 'Festivaly & eventy', desc: 'Mobilní varianta s přírubou. Rychlá instalace, nezaměnitelná silueta, dokonalý chill-out prostor.' },
            { emoji: '🌳', title: 'Parky & promenády', desc: 'Přirozená forma stromu se harmonicky začlení mezi zeleň a zvýší atraktivitu procházky.' },
            { emoji: '🏨', title: 'Hotely & restaurace', desc: 'Exkluzivní detail terasy nebo vstupního prostoru, který hosty překvapí a přivítá chladivou mlhou.' },
            { emoji: '🏫', title: 'Školy & univerzity', desc: 'Bezpečný materiál, zábrany nezbytné není — mlha se odpaří dřív, než dosáhne na zem.' },
            { emoji: '🗺️', title: 'Orientační systém', desc: 'Větve nesou informační panely — slouží jako chladivý rozcestník bez nutnosti dalšího mobiliáře.' },
          ].map((u, i) => (
            <motion.div key={u.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="p-6 rounded-2xl bg-card_bg border border-white/10 hover:border-white/20 transition-all">
              <span className="text-2xl mb-4 block">{u.emoji}</span>
              <h3 style={{ fontWeight: 600, letterSpacing: '-0.02em' }} className="text-white text-base mb-2">{u.title}</h3>
              <p className="text-sm text-white/45 leading-relaxed font-light">{u.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          9. REALIZACE gallery: "OSTEV v reálném světě"
      ═══════════════════════════════════════════════════════ */}
      {allImages.length >= 4 && (
        <section className="bg-surface border-y border-white/8 py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-4">Realizace</p>
            <h2 className="text-white mb-12" style={{ lineHeight: 1.0 }}>
              <span style={{ display: 'block', fontWeight: 700, fontSize: 'clamp(2.5rem, 4.5vw, 4rem)', letterSpacing: '-0.04em' }}>{product.name}</span>
              <span style={{ display: 'block', fontWeight: 700, fontStyle: 'italic', fontSize: 'clamp(2.5rem, 4.5vw, 4rem)', letterSpacing: '-0.04em' }}>v reálném světě.</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {[
                { idx: 2, caption: 'Promenáda', sub: 'Nábřežní esplanáda', desc: 'Mlžení pro stovky procházejících' },
                { idx: 3, caption: 'Festival', sub: 'Letní food festival', desc: 'Chladivá oáza uprostřed davu' },
              ].filter(r => img(r.idx)).map(r => (
                <motion.div key={r.idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <div className="relative rounded-2xl overflow-hidden group cursor-pointer"
                    onClick={() => setLightbox({ images: allImages, idx: r.idx })}>
                    <img src={img(r.idx)} alt={r.caption} className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">{r.caption}</p>
                      <p className="text-white font-medium text-base mt-1">{r.sub}</p>
                      <p className="text-white/50 text-sm">{r.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Extra gallery grid */}
            {allImages.length > 4 && (
              <div className="grid grid-cols-3 gap-3 mt-5">
                {allImages.slice(4, 10).map((src, i) => (
                  <Photo key={i} src={src} alt={`${product.name} ${i+5}`} className="aspect-[4/3] rounded-xl"
                    onClick={() => setLightbox({ images: allImages, idx: i + 4 })} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          9.5 REVIEWS — Hodnocení zákazníků
      ═══════════════════════════════════════════════════════ */}
      <ProductReviews productId={product.id} onStatsLoaded={handleReviewStats} />

      {/* ═══════════════════════════════════════════════════════
          10. INLINE CONTACT FORM — "Váš prostor si zaslouží..."
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-surface border-t border-white/8 py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-4">Zakázková výroba</p>
              <h2 className="text-white mb-4" style={{ lineHeight: 1.0 }}>
                <span style={{ display: 'block', fontWeight: 700, fontSize: 'clamp(2rem, 3.5vw, 3rem)', letterSpacing: '-0.04em' }}>Váš prostor si zaslouží</span>
                <span style={{ display: 'block', fontWeight: 700, fontStyle: 'italic', fontSize: 'clamp(2rem, 3.5vw, 3rem)', letterSpacing: '-0.04em' }}>vlastní {product.name}.</span>
              </h2>
              <p className="text-white/40 text-sm font-light mb-8">Konzultace zdarma · 3D vizualizace do 48 h · Odpovídáme do 24 h</p>
              <div className="space-y-3 text-sm text-white/40 font-mono">
                <a href="tel:+420800123456" className="flex items-center gap-2 hover:text-cyan transition-colors">+420 800 123 456</a>
                <a href="mailto:info@holmtec.cz" className="flex items-center gap-2 hover:text-cyan transition-colors">obchod1@holmtec.cz</a>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
              <ContactForm productName={product.name} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          11. RELATED + BACK
      ═══════════════════════════════════════════════════════ */}
      {relatedProducts.length > 0 && (
        <section className="py-20 bg-ink border-t border-white/8">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-3">Mohlo by vás zajímat</p>
            <h2 style={{ fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.04em' }} className="text-white mb-10">Podobné produkty</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedProducts.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Link to={`/produkt/${r.slug}`} className="group block rounded-2xl overflow-hidden bg-card_bg border border-white/10 hover:border-cyan/40 transition-all">
                    <div className="aspect-[4/3] overflow-hidden bg-white/5">
                      {r.image_url && <img src={r.image_url} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                    </div>
                    <div className="p-5 flex items-center justify-between">
                      <div>
                        <span style={{ fontWeight: 600 }} className="text-white group-hover:text-cyan transition-colors">{r.name}</span>
                        {r.short_description && <p className="text-xs text-white/35 mt-0.5 font-light">{r.short_description}</p>}
                      </div>
                      <ArrowRight size={16} className="text-white/30 group-hover:text-cyan transition-colors shrink-0 ml-4" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Link to="/kolekce" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors font-mono">
                <ArrowLeft size={14} /> Zpět na celou kolekci
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightbox && (
        <Lightbox images={lightbox.images} initialIndex={lightbox.idx} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}