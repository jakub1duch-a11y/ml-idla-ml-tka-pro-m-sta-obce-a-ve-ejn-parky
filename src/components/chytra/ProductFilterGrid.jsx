import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader, PenTool } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import CatalogProductCard from '@/components/katalog/CatalogProductCard';
import Gate70ProductCard from '@/components/katalog/Gate70ProductCard';

const ACCESSORY_ID = '6a5119a4abdfd991c476d9fc';
const isGate = (product) => ['gate-60-76', 'linea-el70'].includes(product.slug);
const copy = {
  gates: { eyebrow: 'Mlžné brány a vstupní portály', title: 'Brány pro průchod, vstup a lineární ochlazení.', text: 'Modely GATE a LINEA přehledně na jednom místě pro eventy, náměstí, koupaliště i pěší trasy.' },
  sculptures: { eyebrow: 'Designová architektonická mlžítka', title: 'Samostatné modely mlžítek a mlžných soch.', text: 'Mrak, BENDY, OSTREV, AURA, LÍZÁTKO a další modely pro zahrady, parky i veřejný prostor.' }
};

export default function ProductFilterGrid({ mode = 'sculptures' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {base44.entities.Product.list().catch(() => []).then((items) => {
      const physical = (items || []).filter((item) => item.category_id !== ACCESSORY_ID);
      setProducts(physical.filter((item) => mode === 'gates' ? isGate(item) : !isGate(item)));
    }).finally(() => setLoading(false));}, [mode]);
  const content = copy[mode];
  return <section className="site-container lg:py-1 0 py-6">
    <div className="mb-9 max-w-3xl"></div>
    {loading ? <div className="flex justify-center py-24"><Loader size={24} className="animate-spin text-slate-300" /></div> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {mode === 'gates' && <Gate70ProductCard />}
      {products.map((product, index) => <motion.div key={product.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }}><CatalogProductCard product={product} /></motion.div>)}
      {mode === 'sculptures' && <Link to="/poptavka?produkt=Mlžítko%20na%20míru" className="group flex min-h-80 flex-col justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 transition hover:border-slate-500"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow-sm"><PenTool size={19} /></span><div><p className="content-eyebrow mb-2">Zakázková výroba</p><h3 className="m-0 text-xl font-semibold text-slate-950">Mlžítko na míru</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">Navrhneme tvar, rozměry, počet trysek i kotvení pro váš prostor.</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-slate-900">Poslat představu <ArrowRight size={15} /></span></div></Link>}
      {!products.length && <p className="col-span-full py-14 text-center text-slate-400 text-base">V této kategorii zatím nejsou produkty.</p>}
    </div>}
  </section>;
}