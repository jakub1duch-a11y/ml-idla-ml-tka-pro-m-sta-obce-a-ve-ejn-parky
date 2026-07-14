import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Loader, Building2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const EXCLUDED = ['SMART řízení mlžítek', 'Filtrační a jiné Moduly', 'Trysky HT-LT', 'senzory', 'Zemní vrut – rychlá mobilní instalace'];

const GATES = [
{ name: 'GATE70', slug: null, href: '/gate70', short_description: 'Designová mlžná brána z nerezové oceli AISI 316L — ochlazení až −9 °C.', image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/17e1fc843_MlznabranaGATE70U.png', isGate: true },
{ name: 'LINEA CE70', slug: 'linea-el70', href: '/produkt/linea-el70', short_description: 'Zakřivený obloukový design z nerezi AISI 316L pro náměstí a veřejné prostory.', image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/82914bed5_C-MlzitkoLINEA_CE70_couple1.png', isGate: true }];

function SlideCard({ item, index }) {
  return (
    <Link to={item.href || (item.slug ? `/produkt/${item.slug}` : '/kontakt')}
      className="group relative shrink-0 w-[75vw] sm:w-[300px] lg:w-[320px] aspect-[3/4] overflow-hidden rounded-[2rem] snap-start bg-slate-100">
      {item.image_url ? (
        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-slate-300 text-4xl">📷</div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      {item.isGate && (
        <span className="absolute top-4 left-4 inline-flex items-center gap-1 bg-white/90 text-slate-900 text-[10px] font-medium tracking-widest uppercase px-2.5 py-1 rounded-full">
          <Building2 size={11} /> Mlžná brána
        </span>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-heading font-medium text-xl text-white tracking-tight mb-2 leading-snug">{item.name}</h3>
        <p className="text-xs text-white/70 font-light line-clamp-2 mb-4">{item.short_description}</p>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white group-hover:gap-2.5 transition-all">
          Detail <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}

export default function MinimalProducts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    base44.entities.Product.list()
      .then((products) => {
        const filtered = (products || [])
          .filter((p) => p.image_url && !EXCLUDED.includes(p.name))
          .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        setItems([...filtered, ...GATES]);
      })
      .catch(() => setItems(GATES))
      .finally(() => setLoading(false));
  }, []);

  const scrollBy = (amount) => scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' });

  return (
    <section className="py-24 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[11px] tracking-widest uppercase text-teal-600 mb-2">Naše produkty</p>
            <h2 className="font-heading font-extralight text-3xl lg:text-4xl text-slate-900 tracking-tight">
              Nejoblíbenější mlžítka a brány.
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/mlzidla-mlzitka" className="hidden sm:flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium whitespace-nowrap">
              Celá kolekce <ArrowRight size={14} />
            </Link>
            <div className="hidden sm:flex gap-2">
              <button onClick={() => scrollBy(-340)} aria-label="Předchozí" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all">
                <ChevronLeft size={15} />
              </button>
              <button onClick={() => scrollBy(340)} aria-label="Další" className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader size={22} className="animate-spin text-slate-300" /></div>
        ) : (
          <div ref={scrollRef} className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            {items.map((item, i) => <SlideCard key={item.id || item.name} item={item} index={i} />)}
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 text-center">
          <Link to="/kontakt" className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-slate-700 transition-colors">
            Nezávazná poptávka <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}