import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import Gate70ProductCard from '@/components/katalog/Gate70ProductCard';
import GateCollectionCards from '@/components/katalog/GateCollectionCards';
import CatalogProductCard from '@/components/katalog/CatalogProductCard';

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
        <p className="content-eyebrow mb-3">Mlžné brány</p>
        <h2 className="content-title text-3xl">Vstupní a lineární mlžné brány.</h2>
        <p className="content-lead mt-3 max-w-2xl">Nerezové brány pro vstupy, náměstí, koupaliště a pěší trasy.</p>
      </div>
      <GateCollectionCards />
      <div className="mb-10 mt-16">
        <p className="content-eyebrow mb-3">Celý katalog</p>
        <h2 className="content-title text-3xl">Designová architektonická mlžítka — stromy, mraky, stébla i monolity.</h2>
      </div>

      {loading ?
      <div className="flex justify-center py-24"><Loader size={24} className="animate-spin text-slate-300" /></div> :

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Gate70ProductCard />
          {products.map((product, index) => <motion.div key={product.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}><CatalogProductCard product={product} /></motion.div>)}
          {products.length === 0 && <p className="col-span-4 text-center text-slate-400 py-16 text-sm">Žádné produkty v této kategorii.</p>}
        </div>
      }
    </div>);

}