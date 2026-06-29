import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, X, Loader, Droplets, Thermometer, Shield, Zap, Maximize2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ProductComparisonTable from '@/components/products/ProductComparisonTable';

// ─── Lightbox ────────────────────────────────────────────────────────────────
function Lightbox({ images, initialIndex, onClose }) {
  const [idx, setIdx] = useState(initialIndex);
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') setIdx(i => (i+1)%images.length); if (e.key === 'ArrowLeft') setIdx(i => (i-1+images.length)%images.length); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [images.length, onClose]);

  return (
    <div className="fixed inset-0 z-[200] bg-ink/97 backdrop-blur-xl flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
        <X size={18} />
      </button>
      <div className="relative max-w-5xl w-full mx-6" onClick={e => e.stopPropagation()}>
        <img src={images[idx]} alt="" className="w-full max-h-[85vh] object-contain" />
        {images.length > 1 && (
          <>
            <button onClick={() => setIdx(i => (i-1+images.length)%images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ink/70 border border-white/20 flex items-center justify-center text-white hover:bg-ink transition-all">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setIdx(i => (i+1)%images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ink/70 border border-white/20 flex items-center justify-center text-white hover:bg-ink transition-all">
              <ChevronRight size={18} />
            </button>
            <p className="text-center text-xs font-mono text-white/30 mt-3 tracking-widest">{idx + 1} / {images.length}</p>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Section image (clickable, opens lightbox) ────────────────────────────────
function SectionImage({ src, alt, onClick, className = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl group cursor-pointer ${className}`} onClick={onClick}>
      <img src={src} alt={alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-all duration-300" />
      <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-ink/50 border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
        <Maximize2 size={13} />
      </button>
    </div>
  );
}

// ─── Specs ─────────────────────────────────────────────────────────────────────
function buildSpecs(product) {
  const specs = [];
  if (product.material) specs.push({ label: 'Materiál', value: product.material, icon: Shield });
  if (product.pressure) specs.push({ label: 'Tlak vody', value: product.pressure, icon: Zap });
  if (product.micron_size) specs.push({ label: 'Kapky', value: product.micron_size + ' μm', icon: Droplets });
  if (product.water_consumption) specs.push({ label: 'Spotřeba vody', value: product.water_consumption, icon: Droplets });
  if (product.coverage_area) specs.push({ label: 'Pokrytí / dosah', value: product.coverage_area, icon: Thermometer });
  if (product.power_supply) specs.push({ label: 'Napájení & řízení', value: product.power_supply, icon: Zap });
  return specs;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProduktDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    base44.entities.Product.filter({ slug })
      .then(async results => {
        if (!results || results.length === 0) { setNotFound(true); return; }
        const p = results[0];
        setProduct(p);
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
  const specs = buildSpecs(product);

  // Split gallery into sections: hero, then pairs for alternating sections
  const galleryImages = allImages;
  // Build content sections from gallery images after first 2
  const sectionImages = galleryImages.slice(2);

  // Feature highlights derived from specs or product description
  const highlights = [
    { icon: Droplets, label: 'Mikro-kapičky 5–15 µm', desc: 'Okamžitě se odpaří — vzduch je chladný, ne mokrý.' },
    { icon: Thermometer, label: 'Ochlazení až −9 °C', desc: 'Průmyslové čerpadlo 70 bar, efektivní i při 40 °C.' },
    { icon: Shield, label: 'AISI 304/316L', desc: 'Potravinářská nerez, bez chemie, certifikováno pro veřejné prostory.' },
    { icon: Zap, label: 'Smart řízení', desc: 'WiFi, teplotní čidlo, automatika — app z telefonu.' },
  ];

  return (
    <div className="min-h-screen bg-ink">

      {/* ── FULLSCREEN HERO ── */}
      <div className="relative h-screen min-h-[600px] overflow-hidden">
        {galleryImages[0] ? (
          <img src={galleryImages[0]} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-surface" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-transparent" />

        {/* Back link */}
        <div className="absolute top-24 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-8">
          <Link to="/kolekce" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
            <ArrowLeft size={14} /> Zpět na produkty
          </Link>
        </div>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-8 pb-16 lg:pb-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-xs font-mono tracking-[0.3em] uppercase text-cyan mb-4">HolmTec · Mlžné sochy</p>
            <h1 className="font-heading font-extralight text-7xl lg:text-[9rem] text-white tracking-tight leading-none mb-3">
              {product.name}
            </h1>
            {product.short_description && (
              <p className="font-heading font-light text-3xl lg:text-4xl text-white/50 italic mb-8 max-w-2xl leading-tight">
                {product.short_description}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Link to="/kontakt" className="flex items-center gap-2 px-7 py-3.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-xl shadow-cyan/30">
                Nezávazná poptávka <ArrowRight size={16} />
              </Link>
              <a href="mailto:obchod1@holmtec.cz?subject=Video z instalací — žádost"
                className="flex items-center gap-2 px-7 py-3.5 bg-white/10 text-white text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm">
                Video z instalací
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 right-8 lg:right-12 flex flex-col items-center gap-2 text-white/25">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-white/25" />
          <span className="text-[9px] font-mono tracking-widest uppercase rotate-90 origin-center">scroll</span>
        </div>
      </div>

      {/* ── INTRO SECTION: text left, image right ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-6">O produktu</p>
            {product.description ? (
              <p className="text-white/70 text-lg lg:text-xl leading-relaxed font-light">{product.description}</p>
            ) : (
              <p className="text-white/70 text-lg leading-relaxed font-light">
                {product.name} je prémiová mlžná socha vyrobená z potravinářské nerezové oceli. Kombinuje estetickou dominantu prostoru s funkčním ochlazením okolí až o 9 °C. Zakázková výroba, montáž za 1 den.
              </p>
            )}
            {specs.length > 0 && (
              <div className="mt-10 grid grid-cols-2 gap-3">
                {specs.slice(0, 4).map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="p-4 rounded-xl bg-card_bg border border-white/10">
                      <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Icon size={10} className="text-cyan" />{s.label}</p>
                      <p className="text-sm font-medium text-white leading-snug">{s.value}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {galleryImages[1] && (
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <SectionImage
                src={galleryImages[1]}
                alt={product.name}
                className="aspect-[3/4]"
                onClick={() => setLightbox({ images: galleryImages, idx: 1 })}
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* ── HIGHLIGHTS: 4 icons ── */}
      <section className="bg-surface border-y border-white/8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <motion.div key={h.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center">
                    <Icon size={18} className="text-cyan" />
                  </div>
                  <p className="text-sm font-medium text-white">{h.label}</p>
                  <p className="text-xs text-white/40 leading-relaxed">{h.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ALTERNATING IMAGE SECTIONS (from gallery) ── */}
      {sectionImages.length >= 2 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32 space-y-24 lg:space-y-40">
          {/* Section A: image left, text right */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <SectionImage
              src={sectionImages[0]}
              alt={product.name}
              className="aspect-[4/3]"
              onClick={() => setLightbox({ images: galleryImages, idx: galleryImages.indexOf(sectionImages[0]) })}
            />
            <div>
              <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-4">Instalace & provoz</p>
              <h2 className="font-heading font-light text-3xl lg:text-4xl text-white mb-6 leading-tight">
                Montáž za jeden den.<br />Provoz bez starostí.
              </h2>
              <p className="text-white/50 text-base leading-relaxed">
                Přívod vody ½″, napájení 230 V — to je vše, co potřebujete. Socha je dodávána předmontovaná a připravená k zapojení. Naši technici provedou instalaci, kalibraci tlaku a prvotní spuštění přímo na místě.
              </p>
              <ul className="mt-6 space-y-3">
                {['Předmontovaná konstrukce z výroby', 'Čerpadlo 70 bar v základně nebo externě', 'Smart řízení přes mobilní app nebo časovač', 'Servis a náhradní díly vždy skladem'].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan mt-1.5 shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Section B: text left, image right */}
          {sectionImages[1] && (
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="lg:order-2">
                <SectionImage
                  src={sectionImages[1]}
                  alt={product.name}
                  className="aspect-[4/3]"
                  onClick={() => setLightbox({ images: galleryImages, idx: galleryImages.indexOf(sectionImages[1]) })}
                />
              </div>
              <div className="lg:order-1">
                <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-4">Zakázková výroba</p>
                <h2 className="font-heading font-light text-3xl lg:text-4xl text-white mb-6 leading-tight">
                  Navrženo přesně<br />pro váš prostor.
                </h2>
                <p className="text-white/50 text-base leading-relaxed">
                  Každý {product.name} je vyráběn na zakázku dle konkrétního projektu. Výška, průměr koruny, počet trysek, povrchová úprava — vše navrhujeme společně s architektem nebo projektantem.
                </p>
                <ul className="mt-6 space-y-3">
                  {['3D vizualizace do 48 h zdarma', 'Přizpůsobení výšky, tvaru a povrchu', 'Koordinace s architektem nebo projektantem', 'Referenční instalace k návštěvě'].map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan mt-1.5 shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </section>
      )}

      {/* ── GALLERY GRID (remaining images) ── */}
      {sectionImages.length >= 3 && (
        <section className="bg-surface border-y border-white/8 py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">Galerie</p>
            <h2 className="font-heading font-light text-3xl text-white mb-10">Fotografie z realizací</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {sectionImages.slice(2, 11).map((src, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                  className={i === 0 ? 'col-span-2 lg:col-span-1 row-span-2' : ''}>
                  <SectionImage
                    src={src}
                    alt={`${product.name} ${i+3}`}
                    className={i === 0 ? 'h-full min-h-[320px]' : 'aspect-[4/3]'}
                    onClick={() => setLightbox({ images: galleryImages, idx: galleryImages.indexOf(src) })}
                  />
                </motion.div>
              ))}
            </div>
            {allImages.length > 13 && (
              <p className="text-xs text-white/25 font-mono text-center mt-6">+ {allImages.length - 13} dalších fotografií k dispozici na vyžádání</p>
            )}
          </div>
        </section>
      )}

      {/* ── TECHNICAL DATASHEET ── */}
      {specs.length > 0 && (
        <section className="py-24 bg-ink">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
              <div>
                <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-4">Technický list</p>
                <h2 className="font-heading font-light text-3xl lg:text-4xl text-white mb-4 leading-tight">
                  Parametry pro<br />projektanty a architekty.
                </h2>
                <p className="text-white/40 text-sm mb-8">Všechny hodnoty jsou orientační — finální specifikace dle zakázkové konfigurace.</p>
                <a href={`mailto:obchod1@holmtec.cz?subject=Technický list — ${product.name}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-cyan/40 text-cyan text-xs font-mono tracking-widest uppercase rounded-full hover:bg-cyan/10 transition-all">
                  ↓ Vyžádat PDF technický list
                </a>
              </div>

              <div className="space-y-3">
                {specs.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="flex items-start justify-between gap-6 px-5 py-4 rounded-xl bg-card_bg border border-white/8">
                      <div className="flex items-center gap-3">
                        <Icon size={14} className="text-cyan/60 shrink-0 mt-0.5" />
                        <span className="text-xs font-mono text-white/35 tracking-widest uppercase">{s.label}</span>
                      </div>
                      <span className="text-sm font-medium text-white text-right">{s.value}</span>
                    </div>
                  );
                })}

                <div className="grid grid-cols-3 gap-3 pt-3">
                  <div className="p-4 rounded-xl bg-cyan/5 border border-cyan/20">
                    <p className="text-[10px] font-mono text-cyan tracking-widest uppercase mb-2">Instalace</p>
                    <p className="text-xs text-white/55 leading-relaxed">Montáž 1 den, přívod ½″, 230V</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/3 border border-white/10">
                    <p className="text-[10px] font-mono text-white/30 tracking-widest uppercase mb-2">Certifikace</p>
                    <p className="text-xs text-white/55 leading-relaxed">AISI 304/316L, bez chemie</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/3 border border-white/10">
                    <p className="text-[10px] font-mono text-white/30 tracking-widest uppercase mb-2">Záruka</p>
                    <p className="text-xs text-white/55 leading-relaxed">5 let konstrukce, 2 roky trysky</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── COMPARISON TABLE ── */}
      <ProductComparisonTable currentProductId={product.id} />

      {/* ── RELATED ── */}
      {relatedProducts.length > 0 && (
        <section className="py-20 bg-ink">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">Mohlo by vás zajímat</p>
            <h2 className="font-heading font-light text-3xl text-white mb-10">Podobné produkty</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedProducts.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Link to={`/produkt/${r.slug}`} className="group block rounded-2xl overflow-hidden bg-card_bg border border-white/10 hover:border-cyan/40 transition-all">
                    <div className="aspect-[4/3] overflow-hidden bg-white/5">
                      {r.image_url && <img src={r.image_url} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                    </div>
                    <div className="p-5 flex items-center justify-between">
                      <div>
                        <span className="font-normal text-white group-hover:text-cyan transition-colors">{r.name}</span>
                        {r.short_description && <p className="text-xs text-white/35 mt-0.5">{r.short_description}</p>}
                      </div>
                      <ArrowRight size={16} className="text-white/30 group-hover:text-cyan transition-colors shrink-0 ml-4" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-24 bg-surface border-t border-white/8">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-4">Zaujalo vás to?</p>
          <h2 className="font-heading font-light text-4xl lg:text-5xl text-white mb-4 leading-tight">
            Chcete {product.name}<br />pro váš prostor?
          </h2>
          <p className="text-white/40 mb-10">Nezávazná konzultace, 3D vizualizace do 48 h, montáž za jeden den.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/kontakt"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-xl shadow-cyan/30">
              ✦ Nezávazná poptávka <ArrowRight size={16} />
            </Link>
            <Link to="/kolekce"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 text-white text-sm font-medium rounded-full border border-white/20 hover:bg-white/10 transition-all">
              <ArrowLeft size={16} /> Zpět na kolekci
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox images={lightbox.images} initialIndex={lightbox.idx} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}