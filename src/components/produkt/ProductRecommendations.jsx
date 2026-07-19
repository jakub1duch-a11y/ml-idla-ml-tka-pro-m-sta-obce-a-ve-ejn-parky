import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const ACCESSORY_ID = '6a5119a4abdfd991c476d9fc';
const group = (product) => {
  const text = `${product.name || ''} ${product.slug || ''}`.toLowerCase();
  if (product.category_id === ACCESSORY_ID) return 'accessory';
  if (/gate|linea|brán|portal/.test(text)) return 'gate';
  return 'sculpture';
};

export default function ProductRecommendations({ product }) {
  const [items, setItems] = useState([]);
  useEffect(() => { base44.entities.Product.list().then((all) => {
    const others = (all || []).filter((item) => item.id !== product.id);
    const similar = others.filter((item) => group(item) === group(product));
    setItems([...similar, ...others.filter((item) => !similar.includes(item))].slice(0, 3));
  }); }, [product.id]);
  if (!items.length) return null;
  return <section className="border-t border-slate-200 bg-slate-50 py-14 lg:py-16"><div className="site-container"><p className="content-eyebrow mb-3">Doporučené produkty</p><div className="flex flex-wrap items-end justify-between gap-4"><h2 className="m-0 font-heading text-3xl font-medium text-slate-950">Podobná a vhodná řešení</h2><Link to="/katalog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">Všechny produkty <ArrowRight size={15} /></Link></div><div className="mt-7 grid gap-4 md:grid-cols-3">{items.map((item) => <Link key={item.id} to={`/produkt/${item.slug}`} className="group grid grid-cols-[92px_1fr] overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-md"><div className="bg-slate-100">{item.image_url && <img src={item.image_url} alt={item.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}</div><div className="p-4"><h3 className="m-0 text-base font-semibold text-slate-950">{item.name}</h3><p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{item.short_description}</p></div></Link>)}</div></div></section>;
}