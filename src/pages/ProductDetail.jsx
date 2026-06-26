import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, ChevronRight } from 'lucide-react';

const DEFAULT_IMG = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/a512a9b9b_generated_bf3f8a6d.png';

const specLabels = {
  micron_size: 'Velikost kapek',
  water_consumption: 'Spotřeba vody',
  material: 'Materiál',
  pressure: 'Provozní tlak',
  coverage_area: 'Pokrytí plochy',
  power_supply: 'Napájení',
};

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInquiry, setShowInquiry] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', project_scope: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    try {
      const products = await base44.entities.Product.filter({ slug });
      if (products.length > 0) {
        setProduct(products[0]);
      } else {
        const all = await base44.entities.Product.list('-created_date', 100);
        const found = all.find(p => p.id === slug || p.slug === slug);
        if (found) setProduct(found);
      }
    } catch (err) {
      // product not found
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await base44.entities.ContactInquiry.create({
        ...form,
        product_id: product?.id,
        message: `[Produkt: ${product?.name}] ${form.message}`,
      });
      setSent(true);
    } catch (err) {
      // error
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-2 border-steel border-t-hydro rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-screen">
        <p className="text-tectonic/50 text-lg mb-4">Produkt nebyl nalezen</p>
        <Link to="/katalog" className="text-hydro flex items-center gap-2 text-sm">
          <ArrowLeft size={16} /> Zpět do katalogu
        </Link>
      </div>
    );
  }

  const specs = Object.entries(specLabels)
    .filter(([key]) => product[key])
    .map(([key, label]) => ({ label, value: product[key] }));

  const images = [product.image_url || DEFAULT_IMG, ...(product.gallery_urls || [])];

  return (
    <div className="pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-6">
        <div className="flex items-center gap-2 text-sm text-tectonic/40">
          <Link to="/" className="hover:text-hydro transition-colors">Domů</Link>
          <ChevronRight size={14} />
          <Link to="/katalog" className="hover:text-hydro transition-colors">Katalog</Link>
          <ChevronRight size={14} />
          <span className="text-tectonic/70">{product.name}</span>
        </div>
      </div>

      {/* Product Layout */}
      <div className="max-w-7xl mx-auto px-6 lg:px-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left - Images */}
          <div className="lg:col-span-3 space-y-4">
            {images.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.15 }}
              >
                <img
                  src={img}
                  alt={`${product.name} - ${i + 1}`}
                  className="w-full aspect-[4/3] object-cover"
                />
              </motion.div>
            ))}
          </div>

          {/* Right - Sticky Spec Sheet */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-28">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {product.material && (
                  <p className="text-xs font-mono text-hydro tracking-widest uppercase mb-2">{product.material}</p>
                )}
                <h1 className="text-3xl lg:text-4xl font-heading font-light text-tectonic tracking-tight mb-4">
                  {product.name}
                </h1>

                {product.short_description && (
                  <p className="text-tectonic/60 mb-8 leading-relaxed">{product.short_description}</p>
                )}

                {product.description && (
                  <div className="text-sm text-tectonic/50 leading-relaxed mb-8">
                    <p>{product.description}</p>
                  </div>
                )}

                {/* Spec Table */}
                {specs.length > 0 && (
                  <div className="border-t border-steel mb-8">
                    <h3 className="text-xs font-mono text-tectonic/40 uppercase tracking-widest mt-6 mb-4">
                      Technické specifikace
                    </h3>
                    <div className="space-y-0">
                      {specs.map((spec, i) => (
                        <div key={i} className="flex justify-between py-3 border-b border-steel/50">
                          <span className="text-sm text-tectonic/50">{spec.label}</span>
                          <span className="text-sm font-mono text-tectonic font-medium">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <button
                  onClick={() => setShowInquiry(!showInquiry)}
                  className="w-full px-8 py-4 bg-hydro text-white text-sm font-medium tracking-wider uppercase hover:bg-hydro/90 transition-all flex items-center justify-center gap-3"
                >
                  Poptat Projekt <Send size={16} />
                </button>

                {/* Inline Inquiry Form */}
                {showInquiry && !sent && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-4 border-t border-steel pt-6"
                  >
                    <input
                      type="text"
                      required
                      placeholder="Jméno"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 border border-steel text-sm bg-white focus:border-hydro outline-none"
                    />
                    <input
                      type="email"
                      required
                      placeholder="E-mail"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 border border-steel text-sm bg-white focus:border-hydro outline-none"
                    />
                    <select
                      value={form.project_scope}
                      onChange={(e) => setForm({ ...form, project_scope: e.target.value })}
                      className="w-full px-4 py-3 border border-steel text-sm bg-white focus:border-hydro outline-none text-tectonic/70"
                    >
                      <option value="">Typ projektu (volitelné)</option>
                      <option value="urban">Veřejný prostor</option>
                      <option value="industrial">Průmyslový provoz</option>
                      <option value="private">Rezidenční / Soukromé</option>
                      <option value="event">Event / Gastronomie</option>
                    </select>
                    <textarea
                      required
                      rows={3}
                      placeholder="Popište váš projekt..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 border border-steel text-sm bg-white focus:border-hydro outline-none resize-none"
                    />
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full px-6 py-3 bg-tectonic text-white text-sm font-medium tracking-wider uppercase hover:bg-tectonic/90 transition-all disabled:opacity-50"
                    >
                      {sending ? 'Odesílám...' : 'Odeslat poptávku'}
                    </button>
                  </motion.form>
                )}

                {sent && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 text-center py-6 border-t border-steel"
                  >
                    <p className="text-hydro font-medium">Poptávka odeslána ✓</p>
                    <p className="text-sm text-tectonic/40 mt-1">Ozveme se vám do 24 hodin.</p>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating CTA on mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden z-40">
        <button
          onClick={() => {
            setShowInquiry(true);
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          }}
          className="px-6 py-3 bg-hydro text-white text-sm font-medium tracking-wider shadow-lg shadow-hydro/30 flex items-center gap-2"
        >
          Poptat <Send size={14} />
        </button>
      </div>
    </div>
  );
}