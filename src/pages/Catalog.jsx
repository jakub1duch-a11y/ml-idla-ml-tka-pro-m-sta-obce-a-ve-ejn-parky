import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';

const CATEGORY_IMAGES = {
  'verejne-prostory': 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/bf20c5485_generated_02071575.png',
  'prumyslove-chlazeni': 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/f2a05a7ea_generated_23c47c5e.png',
  'rezidencni-mlzeni': 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/a03b14a07_generated_54f692da.png',
  'eventy': 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/83e0506f1_generated_fd2118cd.png',
};

const PRODUCT_IMG = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/a512a9b9b_generated_bf3f8a6d.png';

export default function Catalog() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    if (cat) setActiveCategory(cat);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cats, prods] = await Promise.all([
        base44.entities.ProductCategory.list('order', 50),
        base44.entities.Product.list('-created_date', 100),
      ]);
      setCategories(cats);
      setProducts(prods);
    } catch (err) {
      // entities might be empty
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = !activeCategory || categories.find(c => c.slug === activeCategory && c.id === p.category_id);
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeCategoryData = categories.find(c => c.slug === activeCategory);

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-tectonic py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <p className="text-hydro text-sm font-mono tracking-widest uppercase mb-3">Produktový katalog</p>
          <h1 className="text-3xl lg:text-5xl font-heading font-light text-white tracking-tight">
            Mlžné systémy & komponenty
          </h1>
          <p className="mt-4 text-white/40 max-w-xl">
            Kompletní portfolio nízkotlakých mlžných technologií pro každou aplikaci.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-12">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-12">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-5 py-2.5 text-sm border transition-all ${
                !activeCategory
                  ? 'border-hydro bg-hydro/10 text-hydro'
                  : 'border-steel text-tectonic/60 hover:border-tectonic/40'
              }`}
            >
              Vše
            </button>
            {[
              { slug: 'verejne-prostory', label: 'Veřejné prostory' },
              { slug: 'prumyslove-chlazeni', label: 'Průmyslové' },
              { slug: 'rezidencni-mlzeni', label: 'Rezidenční' },
              { slug: 'eventy', label: 'Eventy' },
            ].map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(activeCategory === cat.slug ? null : cat.slug)}
                className={`px-5 py-2.5 text-sm border transition-all ${
                  activeCategory === cat.slug
                    ? 'border-hydro bg-hydro/10 text-hydro'
                    : 'border-steel text-tectonic/60 hover:border-tectonic/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-tectonic/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Hledat produkt..."
              className="pl-10 pr-4 py-2.5 border border-steel text-sm bg-white focus:border-hydro outline-none w-64"
            />
          </div>
        </div>

        {/* Category Banner */}
        {activeCategory && CATEGORY_IMAGES[activeCategory] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-48 lg:h-64 mb-12 overflow-hidden"
          >
            <img
              src={CATEGORY_IMAGES[activeCategory]}
              alt={activeCategory}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-tectonic/60 flex items-end p-8">
              <h2 className="text-2xl lg:text-3xl font-heading font-light text-white">
                {activeCategoryData?.name || activeCategory.replace(/-/g, ' ')}
              </h2>
            </div>
          </motion.div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-steel border-t-hydro rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/produkt/${product.slug || product.id}`} className="group block">
                  <div className="aspect-[4/3] overflow-hidden bg-mist mb-4">
                    <img
                      src={product.image_url || PRODUCT_IMG}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    {product.material && (
                      <p className="text-xs font-mono text-hydro tracking-wider uppercase mb-1">{product.material}</p>
                    )}
                    <h3 className="text-lg font-heading font-medium text-tectonic group-hover:text-hydro transition-colors">
                      {product.name}
                    </h3>
                    {product.short_description && (
                      <p className="text-sm text-tectonic/50 mt-1 line-clamp-2">{product.short_description}</p>
                    )}
                    <div className="mt-3 flex items-center gap-2 text-sm text-tectonic/40 group-hover:text-hydro transition-colors">
                      Detail produktu <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-tectonic/40 text-lg">Zatím zde nejsou žádné produkty.</p>
            <p className="text-tectonic/30 text-sm mt-2">Produkty můžete přidat v administraci.</p>
          </div>
        )}
      </div>
    </div>
  );<iframe src="https://storage.googleapis.com/maps-solutions-83fe85uy80/commutes/l652/commutes.html"
  width="100%" height="100%"
  style="border:0;"
  loading="lazy">
</iframe>
}