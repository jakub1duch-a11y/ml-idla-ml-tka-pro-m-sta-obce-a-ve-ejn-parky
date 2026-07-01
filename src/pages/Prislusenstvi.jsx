import React, { useState, useEffect } from 'react';
import KolekceHero from '@/components/kolekce/KolekceHero';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader, Building2, Users, Home, Warehouse, Baby } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO } from '@/lib/seo';

const ACCESSORY_KEYWORDS = ['tryska', 'trysky', 'cerpadl', 'čerpadl', 'filtr', 'holmapp', 'modul', 'senzor', 'ovladani', 'ovládání'];

const audienceSegments = [
{ icon: Building2, label: 'Města a obce', desc: 'Náhradní díly a rozšíření pro instalované systémy ve veřejném prostoru.' },
{ icon: Users, label: 'Instalační firmy', desc: 'Komponenty pro montáž a servis mlžných systémů třetích stran.' },
{ icon: Home, label: 'Rezidenční', desc: 'Doplňky pro rozšíření zahradních a terasových mlžítek.' },
{ icon: Warehouse, label: 'Průmysl a servis', desc: 'Náhradní trysky, čerpadla a filtry pro průmyslové instalace.' },
{ icon: Baby, label: 'Správci hřišť', desc: 'Bezpečné náhradní díly a Smart moduly pro dětská hřiště.' }];


const FALLBACK_IMAGE = 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/dec576b4e_upscaled_7fc9b4e64_mlzitko_upraveno_Z09_3544_zmenseno.jpg';

function ProductCard({ product, i }) {
  const imgSrc = product.image_url || FALLBACK_IMAGE;
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
      <Link to={product.slug ? `/produkt/${product.slug}` : '/kontakt'}
      className="group block bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-300 h-full">
        <div className="aspect-[4/3] overflow-hidden relative bg-slate-100">
          <img src={imgSrc} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" decoding="async" />
          {product.featured &&
          <span className="absolute top-3 left-3 bg-slate-900 text-white text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded-full">
              Výběr
            </span>
          }
        </div>
        <div className="p-6">
          <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Příslušenství</p>
          <h3 className="text-xl font-normal text-slate-900 mb-1">{product.name}</h3>
          <p className="text-sm text-slate-500 mb-3 line-clamp-2">{product.short_description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">{product.material || 'AISI 316L'}</span>
            <div className="flex items-center gap-1 text-xs text-slate-900 font-medium">
              Detail <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>);

}

export default function Prislusenstvi() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setSEO({
      title: 'Mlžné příslušenství a moduly — Trysky, čerpadla, Smart moduly',
      description: 'Příslušenství pro mlžné systémy HolmTec: trysky AISI 316L, čerpadla, filtry a Smart moduly pro řízení a automatizaci. Náhradní díly a rozšíření.',
      keywords: 'mlžné příslušenství, trysky HolmTec, čerpadlo mlžení, filtr mlžný systém, Smart modul mlžení',
      canonicalPath: '/prislusenstvi',
    });
  }, []);

  useEffect(() => {
    base44.entities.Product.list().catch(() => []).then((prods) => {
      const accessories = (prods || []).filter((p) => {
        const text = `${p.name} ${p.slug} ${p.short_description}`.toLowerCase();
        return ACCESSORY_KEYWORDS.some((kw) => text.includes(kw));
      });
      setProducts(accessories);
    }).finally(() => setLoading(false));
  }, []);

  const displayedProducts = products.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (p.name || '').toLowerCase().includes(q) || (p.short_description || '').toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-white pt-16">

      <KolekceHero />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading font-light text-4xl lg:text-5xl text-slate-900 tracking-tight mb-4">
            Mlžné příslušenství<br /><span className="text-slate-400">a moduly.</span>
          </h1>
          <p className="text-slate-500 max-w-xl text-lg leading-relaxed">
            Trysky, čerpadla, filtry a Smart moduly pro řízení a automatizaci. Náhradní díly a rozšíření pro každý mlžný systém HolmTec.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-8">
        <input
          type="text"
          placeholder="Hledat příslušenství..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:border-slate-400 focus:outline-none transition-all" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-8">
          Všechno příslušenství {!loading && <span className="ml-2 text-slate-300">({displayedProducts.length})</span>}
        </p>
        {loading ?
        <div className="flex justify-center py-24">
            <Loader size={24} className="animate-spin text-slate-300" />
          </div> :

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedProducts.map((p, i) => <ProductCard key={p.id} product={p} i={i} />)}
            {displayedProducts.length === 0 &&
          <p className="col-span-3 text-center text-slate-400 py-16 text-sm">Žádné produkty nenalezeny.</p>
          }
          </div>
        }
      </div>

      <div className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Pro koho je příslušenství určeno</p>
            <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight">Řešení pro každé publikum.</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {audienceSegments.map((seg, i) => {
              const Icon = seg.icon;
              return (
                <motion.div key={seg.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center mb-3">
                    <Icon size={16} className="text-slate-900" />
                  </div>
                  <h4 className="text-sm font-normal text-slate-900 mb-2">{seg.label}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{seg.desc}</p>
                </motion.div>);

            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="p-10 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Potřebujete poradit?</p>
            <h3 className="font-heading font-light text-2xl text-slate-900">Najdeme vhodné příslušenství pro váš systém.</h3>
            <p className="text-sm text-slate-400 mt-1">Konzultace zdarma · Odpovídáme do 24 h</p>
          </div>
          <Link to="/poptavka"
          className="px-7 py-3.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all whitespace-nowrap">
            Nezávazná poptávka
          </Link>
        </div>
      </div>
    </div>);

}