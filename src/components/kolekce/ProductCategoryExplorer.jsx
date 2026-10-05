import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  { name: 'Sloupková mlžítka', text: 'Čisté linie pro parky, promenády a pobytové zóny.', href: '/sloupkova-mlzitka', image: '/media/optimized/fc2d57e81_C-MlzitkoLINEA_CE70_single1.webp' },
  { name: 'Mlžné brány a oblouky', text: 'Průchozí osvěžení v přirozeném rytmu místa.', href: '/mlzne-brany', image: '/media/optimized/da0942c09_mlzidla-mlzitka-pro-mesta-obce.webp' },
  { name: 'Ateliérové prvky', text: 'Výrazný tvar a vlastní příběh vašeho prostoru.', href: '/atelierove-prvky', image: '/media/optimized/db-4098079e74-84805a215_mlnprvek-mrak-mlzidla02.webp' },
];
export default function ProductCategoryExplorer() {
  const reduced = useReducedMotion();
  return <section className="border-y border-[#d3deda] bg-[#f4f6f3] py-16 lg:py-24" aria-labelledby="category-explorer-title">
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <p className="font-mono text-xs uppercase tracking-widest text-[#0e5b67]">Design podle prostoru</p>
      <h2 id="category-explorer-title" className="mb-10 mt-4 max-w-2xl font-heading text-3xl tracking-tight text-[#0d2d38] sm:text-4xl">Tři přístupy. Společný smysl pro místo.</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {CATEGORIES.map((category, index) => <motion.article key={category.href} initial={reduced ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: .45, delay: index * .06 }}>
          <Link to={category.href} className="group block overflow-hidden rounded-lg border border-[#d3deda] bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0e5b67]">
            <div className="aspect-[4/3] overflow-hidden bg-[#e5ece8]"><img src={category.image} alt={category.name} loading="lazy" width="640" height="480" className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" /></div>
            <div className="p-6"><p className="mb-5 font-mono text-xs text-[#0e5b67]">0{index + 1}</p><h3 className="flex items-center justify-between gap-4 font-heading text-2xl text-[#0d2d38]">{category.name}<ArrowUpRight size={20} className="shrink-0" /></h3><p className="mt-3 text-sm leading-6 text-slate-600">{category.text}</p><span className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-[#0e5b67]">Prohlédnout produkty</span></div>
          </Link>
        </motion.article>)}
      </div>
    </div>
  </section>;
}
