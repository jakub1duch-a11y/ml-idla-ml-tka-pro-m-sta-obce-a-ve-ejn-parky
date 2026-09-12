import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { isArchived } from '@/lib/newMedia';
import { FAMILIES, getFamily, sortByStructure } from '@/lib/productFamilies';

export default function PdCollectionContext({ product }) {
  const [products, setProducts] = useState([]);
  const activeId = getFamily(product).id;

  useEffect(() => {
    base44.entities.Product.list('name', 200).then((all) => setProducts((all || []).filter((p) => !isArchived(p.slug))));
  }, []);

  const tiles = useMemo(() => FAMILIES.map((f) => {
    const inFamily = sortByStructure(products.filter((p) => getFamily(p).id === f.id));
    const cover = inFamily.find((p) => p.image_url && p.id !== product.id) || inFamily.find((p) => p.image_url);
    return { ...f, count: inFamily.length, cover: cover?.image_url };
  }), [products, product.id]);

  return (
    <section className="border-t border-[#D3E2E8] bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#153863]">// Kategorie produktů</p>
            <h2 className="mt-3 font-heading text-2xl font-semibold text-[#0A1628] sm:text-3xl">Kde tento produkt patří v katalogu</h2>
          </div>
          <Link to="/mlzidla-mlzitka#catalog" className="btn-brand-accent-link shrink-0">Celý katalog <ArrowRight size={14} /></Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((f, i) => {
            const active = f.id === activeId;
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -5 }}
              >
                <Link
                  to="/mlzidla-mlzitka#catalog"
                  className={`group flex h-full flex-col overflow-hidden border transition-colors ${active ? 'border-[#0A1628] bg-[#0A1628] text-white' : 'border-[#D3E2E8] bg-white text-[#0A1628] hover:border-[#153863]'}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#E7F4F8]">
                    {f.cover && <img src={f.cover} alt={f.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />}
                    <span className="absolute left-4 top-4 font-mono text-[11px] tracking-[.14em] text-[#22D3EE]">// {f.code}</span>
                    {active && <span className="absolute right-3 top-3 inline-flex items-center gap-1 bg-[#22D3EE] px-2 py-1 font-mono text-[10px] tracking-[.12em] text-[#0A1628]"><Check size={11} /> TENTO PRODUKT</span>}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-heading text-base font-bold">{f.label}</h3>
                    <p className={`mt-1.5 flex-1 text-[13px] leading-relaxed ${active ? 'text-white/70' : 'text-[#5A6B78]'}`}>{f.title}</p>
                    <span className={`mt-4 font-mono text-[11px] tracking-[.12em] ${active ? 'text-[#22D3EE]' : 'text-[#5A6B78]'}`}>{f.count} produktů</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}