import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Droplets } from 'lucide-react';

const products = [
  {
    name: 'STÉBLO',
    type: 'Organické mlžítko',
    description: 'Jemná nerezová linie pro zahrady, parky a pobytové zóny, kde má technologie přirozeně splynout s okolím.',
    image: '/media/optimized/b94c771e1_a982a794f_mlzitkosteblo.webp',
    link: '/produkt/mlzitko-steblo',
    position: 'object-center',
  },
  {
    name: 'LINEA',
    type: 'Sloupové mlžítko',
    description: 'Čistý vertikální prvek pro náměstí, promenády, vstupy a současný veřejný prostor.',
    image: '/media/optimized/bcb5c5f4d_C-MlzitkoLINEA_CE70_single.webp',
    link: '/produkt/linea-mlzitko',
    position: 'object-center',
  },
];

export default function StebloLineaShowcase() {
  return (
    <section className="overflow-hidden bg-[#F4F8FA] py-16 sm:py-20 lg:py-28" aria-labelledby="steblo-linea-title">
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="mb-9 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.22em] text-[#0B8EC5]">// Dvě linie, dva charaktery prostoru</p>
            <h2 id="steblo-linea-title" className="mt-3 max-w-4xl font-heading text-3xl font-bold leading-tight tracking-[-.045em] text-[#07131D] sm:text-4xl lg:text-5xl">
              STÉBLO a LINEA v detailu.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#516574]">
              Organický tvar pro přirozené prostředí a přesná sloupová linie pro moderní architekturu.
            </p>
          </div>
          <Link to="/mlzidla-mlzitka" className="inline-flex items-center gap-2 self-start rounded-full border border-[#C9DCE5] bg-white px-5 py-3 text-sm font-bold text-[#07131D] transition hover:border-[#0B8EC5] hover:text-[#0B8EC5] sm:self-auto">
            Porovnat produkty <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {products.map((product, index) => (
            <motion.article
              key={product.name}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="group overflow-hidden rounded-[2rem] border border-[#DCE8ED] bg-white shadow-[0_22px_70px_rgba(7,19,29,.09)]"
            >
              <Link to={product.link} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#26C6E9]">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#DDE8EC] sm:aspect-[16/11]">
                  <img
                    src={product.image}
                    alt={`${product.name} — ${product.type} MLŽIDLA.cz`}
                    className={`h-full w-full object-cover ${product.position} transition duration-700 group-hover:scale-[1.035]`}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07131D]/88 via-[#07131D]/8 to-transparent" />
                  <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#07131D]/42 px-4 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-white backdrop-blur-md">
                    <Droplets size={14} className="text-[#26C6E9]" />
                    {product.type}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                    <h3 className="font-heading text-4xl font-bold tracking-[-.05em] sm:text-5xl">{product.name}</h3>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-white/78 sm:text-base">{product.description}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-[#26C6E9] transition group-hover:translate-x-1">
                      Detail produktu <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
