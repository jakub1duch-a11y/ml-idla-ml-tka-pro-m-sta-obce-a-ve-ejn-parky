import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, Droplets, Thermometer, Zap, Shield, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// ─── Gallery ───────────────────────────────────────────────────────────────────
function Gallery({ images }) {
  const [active, setActive] = useState(0);
  const validImages = (images || []).filter(Boolean);

  if (validImages.length === 0) return null;

  const prev = () => setActive(i => (i - 1 + validImages.length) % validImages.length);
  const next = () => setActive(i => (i + 1) % validImages.length);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-card_bg">
        <motion.img
          key={active}
          src={validImages[active]}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full object-cover"
        />
        {validImages.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-ink/70 border border-white/20 flex items-center justify-center text-white hover:bg-ink transition-all backdrop-blur-sm">
              <ChevronLeft size={18} />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-ink/70 border border-white/20 flex items-center justify-center text-white hover:bg-ink transition-all backdrop-blur-sm">
              <ChevronRight size={18} />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {validImages.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} className={`h-1.5 rounded-full transition-all ${i === active ? 'bg-cyan w-4' : 'w-1.5 bg-white/40'}`} />
              ))}
            </div>
          </>
        )}
      </div>
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {validImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${i === active ? 'border-cyan' : 'border-white/10 hover:border-white/30'}`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Specs derived from product fields ────────────────────────────────────────
function buildSpecs(product) {
  const specs = [];
  if (product.material) specs.push({ label: 'Materiál', value: product.material });
  if (product.pressure) specs.push({ label: 'Tlak vody', value: product.pressure });
  if (product.micron_size) specs.push({ label: 'Kapky', value: product.micron_size + ' μm' });
  if (product.water_consumption) specs.push({ label: 'Spotřeba vody', value: product.water_consumption });
  if (product.coverage_area) specs.push({ label: 'Pokrytí', value: product.coverage_area });
  if (product.power_supply) specs.push({ label: 'Napájení', value: product.power_supply });
  return specs;
}

const FEATURE_ICONS = [Droplets, Thermometer, Shield, Zap];

// ─── Main component ───────────────────────────────────────────────────────────
export default function ProduktDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    base44.entities.Product.filter({ slug })
      .then(async results => {
        if (!results || results.length === 0) {
          setNotFound(true);
          return;
        }
        const p = results[0];
        setProduct(p);

        // Load related products from same category (exclude current)
        if (p.category_id) {
          const related = await base44.entities.Product.filter({ category_id: p.category_id }).catch(() => []);
          setRelatedProducts((related || []).filter(r => r.id !== p.id).slice(0, 3));
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <Loader size={28} className="animate-spin text-cyan/50" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center pt-28">
        <div className="text-center">
          <p className="text-white/40 mb-4 text-lg">Produkt nenalezen.</p>
          <Link to="/kolekce" className="text-cyan hover:underline">← Zpět na kolekci</Link>
        </div>
      </div>
    );
  }

  const heroImage = product.image_url;
  const allImages = [product.image_url, ...(product.gallery_urls || [])].filter(Boolean);
  const specs = buildSpecs(product);

  return (
    <div className="min-h-screen bg-ink">

      {/* Fullscreen hero */}
      {heroImage && (
        <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <img src={heroImage} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-8 pb-12">
            <Link to="/kolekce" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors">
              <ArrowLeft size={14} /> Zpět na produkty
            </Link>
            <h1 className="font-heading font-extralight text-6xl lg:text-8xl text-white tracking-tight leading-none mb-4">{product.name}</h1>
            {product.short_description && (
              <p className="text-white/60 text-xl max-w-lg">{product.short_description}</p>
            )}
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to="/kontakt" className="flex items-center gap-2 px-7 py-3.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-xl shadow-cyan/30">
                Nezávazná poptávka <ArrowRight size={16} />
              </Link>
              <a href="mailto:obchod1@holmtec.cz?subject=Katalog — žádost o PDF"
                className="flex items-center gap-2 px-7 py-3.5 bg-white/10 text-white text-sm font-medium rounded-full border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm">
                Katalog PDF
              </a>
            </div>
          </div>
        </div>
      )}

      {/* No hero fallback header */}
      {!heroImage && (
        <div className="pt-28 pb-8 max-w-7xl mx-auto px-6 lg:px-8">
          <Link to="/kolekce" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={14} /> Zpět na produkty
          </Link>
          <h1 className="font-heading font-extralight text-5xl lg:text-7xl text-white tracking-tight">{product.name}</h1>
        </div>
      )}

      {/* Gallery + Info */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Gallery images={allImages} />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:sticky lg:top-24">
            {product.description && (
              <p className="text-white/60 leading-relaxed mb-8 text-lg">{product.description}</p>
            )}

            {/* Quick specs */}
            {specs.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-8">
                {specs.slice(0, 4).map(s => (
                  <div key={s.label} className="p-4 rounded-xl bg-card_bg border border-white/10">
                    <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">{s.label}</p>
                    <p className="text-sm font-semibold text-white">{s.value}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/kontakt"
                className="flex-1 text-center px-6 py-4 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/25">
                ✦ Nezávazná poptávka
              </Link>
              <a href="mailto:obchod1@holmtec.cz?subject=Katalog — žádost o PDF"
                className="flex-1 text-center px-6 py-4 bg-white/5 text-white text-sm font-medium rounded-full border border-white/20 hover:bg-white/10 transition-all">
                Katalog PDF
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Full specs table */}
      {specs.length > 0 && (
        <div className="py-20 bg-surface">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">Technická data</p>
            <h2 className="font-heading font-light text-3xl text-white mb-10">Technické parametry</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 rounded-2xl overflow-hidden">
              {specs.map((s, i) => (
                <div key={s.label} className={`flex items-center justify-between gap-6 px-6 py-4 bg-card_bg ${i === specs.length - 1 && specs.length % 2 !== 0 ? 'md:col-span-2' : ''}`}>
                  <span className="text-xs font-mono text-white/40 tracking-widest uppercase whitespace-nowrap">{s.label}</span>
                  <span className="text-sm font-semibold text-white text-right">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="py-20 bg-ink">
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
                      <span className="font-normal text-white group-hover:text-cyan transition-colors">{r.name}</span>
                      <ArrowRight size={16} className="text-white/30 group-hover:text-cyan transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="py-20 bg-surface">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-white mb-4">
            Chcete {product.name} pro váš prostor?
          </h2>
          <p className="text-white/50 mb-8">Nezávazná poptávka, 3D vizualizace do 48 h, montáž za jeden den.</p>
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
      </div>

    </div>
  );
}