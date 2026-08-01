import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const rank = (product) => {
  const value = `${product.name} ${product.slug}`.toLowerCase();
  if (/trysk/.test(value)) return 999;
  if (/brán|brana|gate/.test(value)) return 0;
  return /mlžít|mlzit/.test(value) ? 50 : 25;
};

export default function ArticleProductSlider() {
  const [products, setProducts] = useState([]);
  const track = useRef(null);

  useEffect(() => {
    base44.entities.Product.list().then((items) => {
      setProducts((items || []).filter((item) => item.slug).sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name, 'cs')));
    });
  }, []);

  if (!products.length) return null;
  const move = (direction) => track.current?.scrollBy({ left: direction * 300, behavior: 'smooth' });

  return <section className="border-y border-slate-200 py-10" aria-labelledby="article-products">
    <div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-xs font-mono uppercase tracking-widest text-slate-400">Produkty MLŽIDLA®</p><h2 id="article-products" className="mt-2 font-heading text-2xl font-medium text-slate-900 sm:text-3xl">Prohlédněte si celé řešení</h2></div><div className="flex gap-2"><button onClick={() => move(-1)} aria-label="Předchozí produkty" className="rounded-full border border-slate-200 p-2.5 text-slate-700"><ChevronLeft size={18} /></button><button onClick={() => move(1)} aria-label="Další produkty" className="rounded-full border border-slate-200 p-2.5 text-slate-700"><ChevronRight size={18} /></button></div></div>
    <div ref={track} className="flex snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {products.map((product) => <Link key={product.id} to={`/produkt/${product.slug}`} className="group min-w-[78%] snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white sm:min-w-[42%] lg:min-w-[31%]"><div className="aspect-[4/3] overflow-hidden bg-slate-100">{product.image_url && <img src={product.image_url} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />}</div><div className="p-4"><h3 className="font-heading text-lg font-medium text-slate-900">{product.name}</h3><p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">{product.short_description}</p></div></Link>)}
    </div>
  </section>;
}