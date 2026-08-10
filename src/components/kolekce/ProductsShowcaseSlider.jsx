import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const EXCLUDED = ['Zemní vrut – rychlá mobilní instalace', 'SMART řízení mlžítek', 'Filtrační a jiné Moduly', 'Trysky HT-LT', 'senzory', 'GATE70', 'LINEA CE70'];

const BENDY_IMAGE = 'https://media.base44.com/images/public/69d723859ec0e3321c6b8bb6/910eb2c63_bendymlzitko-steblo.jpeg';
const COLLECTIONS = [
  { name: 'BENDY', eyebrow: 'ORGANICKÁ KOLEKCE', description: 'Ohýbaný nerezový tvar, který pracuje s prostorem jako designový objekt.', variants: [
    { name: 'BENDY ARC', subtitle: 'Elegantní oblouk', image: BENDY_IMAGE },
    { name: 'BENDY DUO', subtitle: 'Dvojitá kompozice', image: BENDY_IMAGE }
  ]},
  { name: 'MRAK', eyebrow: 'AUTORSKÁ KOLEKCE', description: 'Jemná mlha v organické skulptuře. Výrazný objekt pro zahrady i veřejný prostor.', variants: [{ name: 'MRAK', subtitle: 'Mlžná skulptura', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/68953132b_IMG_3524.jpg' }] },
  { name: 'AURA', eyebrow: 'RESIDENTIAL', description: 'Diskrétní nerezové řešení pro terasy, pergoly, hotely a privátní zahrady.', variants: [{ name: 'AURA', subtitle: 'Čistý minimalismus', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/b94c771e1_a982a794f_mlzitkosteblo.jpg' }] }
];

function CollectionCard({ collection, index }) {
  return <article className="group relative shrink-0 w-[88vw] sm:w-[620px] lg:w-[720px] rounded-[28px] overflow-hidden snap-start border border-white/10 bg-[#0b151a] shadow-2xl">
    <div className="grid md:grid-cols-[.8fr_1.2fr] min-h-[390px]">
      <div className="relative overflow-hidden bg-[#111b20] p-6 md:p-7 flex flex-col justify-between">
        <div><p className="text-[9px] font-mono tracking-[.22em] uppercase text-cyan-300/70">{collection.eyebrow}</p><h3 className="mt-3 text-3xl lg:text-4xl font-light text-white tracking-tight">{collection.name}</h3><p className="mt-4 text-sm leading-6 text-white/45">{collection.description}</p></div>
        <span className="inline-flex items-center gap-2 text-xs font-bold text-white/75">Kolekce <ArrowRight size={13}/></span>
      </div>
      <div className="grid grid-cols-2 gap-px bg-white/10">
        {collection.variants.map((variant, i) => <Link key={variant.name} to={`/mlzidla-mlzitka?variant=${encodeURIComponent(variant.name)}`} className="group/variant relative min-h-[390px] overflow-hidden bg-[#151d20]">
          <img src={variant.image} alt={variant.name} className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover/variant:scale-105 group-hover/variant:opacity-70" loading="lazy"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent"/>
          <div className="absolute top-4 left-4 rounded-full border border-white/15 bg-black/30 px-2.5 py-1.5 text-[8px] font-mono tracking-widest text-white/65 backdrop-blur-md">{i === 0 ? '01' : '02'} / VARIANT</div>
          <div className="absolute bottom-4 left-4 right-4"><p className="text-[9px] font-mono tracking-widest uppercase text-white/50">{variant.subtitle}</p><h4 className="mt-1 text-xl font-medium text-white">{variant.name}</h4><span className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-bold text-cyan-300 opacity-0 transition-all group-hover/variant:opacity-100">Studio preview <ArrowRight size={11}/></span></div>
        </Link>)}
      </div>
    </div>
  </article>;
}

function SlideCard({ product, index }) {
  return <Link to={product.slug ? `/produkt/${product.slug}` : '/kontakt'} className="group relative shrink-0 w-[75vw] sm:w-[340px] lg:w-[360px] aspect-[3/4] rounded-2xl overflow-hidden snap-start bg-slate-800">
    {product.image_url ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" /> : <div className="w-full h-full flex items-center justify-center text-white/20 text-4xl">📷</div>}
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
    <span className="absolute top-4 right-4 text-white/50 text-3xl font-light">{String(index + 1).padStart(2, '0')}</span>
    <div className="absolute bottom-0 left-0 right-0 p-5"><h3 className="text-xl text-white mb-2 font-semibold">{product.name}</h3><p className="font-light line-clamp-2 mb-4 text-sm text-white/80">{product.short_description}</p><span className="inline-flex items-center gap-1.5 text-xs font-bold text-white group-hover:gap-2.5 transition-all">Detail produktu <ArrowRight size={12} /></span></div>
  </Link>;
}

export default function ProductsShowcaseSlider() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    base44.entities.Product.list().
    then((items) => {
      setProducts((items || []).filter((p) => !EXCLUDED.includes(p.name)));
    }).
    catch(() => setProducts([])).
    finally(() => setLoading(false));
  }, []);

  const scrollBy = (amount) => scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' });

  if (!loading && products.length === 0) return null;

  return (
    <section className="relative py-20 lg:py-24 overflow-hidden bg-[#034b68]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 lg:mb-10">
          <div>
            <p className="font-mono tracking-widest uppercase text-white/40 mb-2 text-lg">KOMPLETNÍ NABÍDKA</p>
            <h2 className="text-3xl lg:text-4xl text-white tracking-tight [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-semibold">Prohlédněte si
celou kolekci mlžítek.
            </h2>
          </div>
          <div className="hidden sm:flex gap-2">
            <button onClick={() => scrollBy(-380)} aria-label="Předchozí"
            className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all">
              <ChevronLeft size={15} />
            </button>
            <button onClick={() => scrollBy(380)} aria-label="Další"
            className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all">
              <ChevronRight size={15} />
            </button>
          </div>
        </motion.div>

        {loading ?
        <div className="flex justify-center py-16">
            <Loader size={22} className="animate-spin text-white/30" />
          </div> :

        <div ref={scrollRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            {products.map((p, i) => <SlideCard key={p.id} product={p} index={i} />)}
          </div>
        }
      </div>
    </section>);

}