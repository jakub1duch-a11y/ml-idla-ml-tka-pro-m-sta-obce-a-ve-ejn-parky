import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Loader, Building2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { trackProductClick } from '@/lib/ga4';
import CoolingCardEffect from '@/components/home/CoolingCardEffect';

const EXCLUDED = ['SMART řízení mlžítek', 'Filtrační a jiné Moduly', 'Trysky HT-LT', 'senzory', 'Zemní vrut – rychlá mobilní instalace'];

const GATES = [
{
  name: 'GATE70',
  slug: null,
  href: '/gate70',
  tagline: 'Vstupní mlžná brána',
  short_description: 'Designová mlžná brána z nerezové oceli AISI 316L — ochlazení až −9 °C, smart Wi-Fi řízení.',
  image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/17e1fc843_MlznabranaGATE70U.png',
  isGate: true
},
{
  name: 'LINEA CE70',
  slug: 'linea-el70',
  href: '/produkt/linea-el70',
  tagline: 'Obloukový mlžný systém',
  short_description: 'Zakřivený obloukový design z nerezi AISI 316L — ikonická architektura pro náměstí a veřejné prostory.',
  image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/82914bed5_C-MlzitkoLINEA_CE70_couple1.png',
  isGate: true
}];


function SlideCard({ item, index, isCoolingCard }) {
  return (
    <Link to={item.href || (item.slug ? `/produkt/${item.slug}` : '/kontakt')} onClick={() => trackProductClick(item.name, item.slug || item.href, 'home_featured')}
    className="group relative shrink-0 w-[82vw] sm:w-[320px] lg:w-[340px] aspect-[3/4] rounded-2xl overflow-hidden snap-start bg-slate-800">
      {item.image_url ?
      <img src={item.image_url} alt={item.name}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" /> :

      <div className="w-full h-full flex items-center justify-center text-white/20 text-4xl">📷</div>
      }
      <CoolingCardEffect active={isCoolingCard} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
      {item.featured && !item.isGate &&
      <span className="absolute top-4 left-4 bg-white text-slate-900 text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full">
          Oblíbené
        </span>
      }
      {item.isGate &&
      <span className="absolute top-4 left-4 inline-flex items-center gap-1 bg-white/15 backdrop-blur-md border border-white/25 text-white text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full">
          <Building2 size={11} /> Mlžná brána
        </span>
      }
      <span className="absolute top-4 right-4 font-mono text-white/20 text-2xl font-black">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-heading font-light text-xl text-white tracking-tight mb-2 leading-snug">{item.name}</h3>
        <p className="text-xs text-white/60 font-light line-clamp-2 mb-4">{item.short_description}</p>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white group-hover:gap-2.5 transition-all">
          Detail {item.isGate ? 'brány' : 'produktu'} <ArrowRight size={12} />
        </span>
      </div>
    </Link>);

}

export default function FeaturedProductsSection({ enableCooling = false }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coolingIndex, setCoolingIndex] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    base44.entities.Product.list().
    then((products) => {
      const filtered = (products || []).
      filter((p) => p.image_url && !EXCLUDED.includes(p.name)).
      sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      const nextItems = [...filtered, ...GATES];
      setItems(nextItems);
      if (enableCooling) setCoolingIndex(Math.floor(Math.random() * nextItems.length));
    }).
    catch(() => setItems(GATES)).
    finally(() => setLoading(false));
  }, []);

  const scrollBy = (amount) => scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' });

  return (
    <section id="produkty" className="py-20 bg-slate-950 border-t border-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 lg:mb-10">
          <div>
            <p className="text-[11px] font-mono tracking-widest uppercase text-white/40 mb-2">NAŠE PRODUKTY</p>
            <h2 className="font-light text-3xl lg:text-4xl text-white tracking-tight [font-family:'DM_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] no-underline not-italic">Nejoblíbenější mlžítka
a mlžné brány.
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/mlzidla-mlzitka" className="hidden sm:flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors font-medium whitespace-nowrap">
              Celá kolekce <ArrowRight size={14} />
            </Link>
            <div className="hidden sm:flex gap-2">
              <button onClick={() => scrollBy(-360)} aria-label="Předchozí"
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all">
                <ChevronLeft size={15} />
              </button>
              <button onClick={() => scrollBy(360)} aria-label="Další"
              className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all">
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </motion.div>

        {loading ?
        <div className="flex justify-center py-16">
            <Loader size={22} className="animate-spin text-white/30" />
          </div> :

        <div ref={scrollRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            {items.map((item, i) => <SlideCard key={item.id || item.name} item={item} index={i} isCoolingCard={i === coolingIndex} />)}
          </div>
        }

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-10 text-center">
          <Link to="/kontakt"
          className="btn-metallic-mist px-8 py-4 text-sm font-bold">
            ✦ Nezávazná poptávka <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>);

}