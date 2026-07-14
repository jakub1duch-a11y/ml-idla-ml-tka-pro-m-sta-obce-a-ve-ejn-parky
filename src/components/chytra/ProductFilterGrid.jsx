import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { trackProductClick } from '@/lib/ga4';

const ACCESSORY_CATEGORY_ID = '6a5119a4abdfd991c476d9fc';

export default function ProductFilterGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Product.list().catch(() => []).then((prods) => {
      setProducts((prods || []).filter((p) => p.category_id !== ACCESSORY_CATEGORY_ID));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-24">
      <div className="mb-10">
        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Celý katalog</p>
        <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight">Vyberte si mlžítko z naší KOLEKCE2026</h2>
      </div>

      {loading ?
      <div className="flex justify-center py-24"><Loader size={24} className="animate-spin text-slate-300" /></div> :

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((p, i) =>
        <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link to={p.slug ? `/produkt/${p.slug}` : '/kontakt'} onClick={() => trackProductClick(p.name, p.slug, 'chytra_mlzidla')}
            className="group block bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all h-full">
                <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                  {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />}
                </div>
                <div className="p-5">
                  <h3 className="text-slate-900 font-medium mb-1">{p.name}</h3>
                  <p className="text-xs text-slate-400 mb-3 line-clamp-2">{p.short_description}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-900 font-medium">
                    Detail produktu <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            </motion.div>
        )}
          {products.length === 0 && <p className="col-span-4 text-center text-slate-400 py-16 text-sm">Žádné produkty v této kategorii.</p>}
        </div>
      }
    </div>);

}