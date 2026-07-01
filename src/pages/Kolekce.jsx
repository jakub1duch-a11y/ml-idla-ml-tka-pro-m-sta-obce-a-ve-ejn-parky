import React, { useState, useEffect } from 'react';
import KolekceHero from '@/components/kolekce/KolekceHero';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Trees, Landmark, Flame, Building2, Home, Users, Warehouse, Baby, Loader, SlidersHorizontal, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO, SEO_PAGES } from '@/lib/seo';

const HEIGHT_OPTIONS = [
{ value: 'all', label: 'Všechny výšky' },
{ value: 'low', label: 'Do 1 m' },
{ value: 'medium', label: '1–3 m' },
{ value: 'tall', label: '3 m a více' }];


const INSTALL_OPTIONS = [
{ value: 'all', label: 'Jakákoliv instalace' },
{ value: 'easy', label: 'Snadná (plug & play)' },
{ value: 'medium', label: 'Střední (odborník)' },
{ value: 'complex', label: 'Komplexní (projekt)' }];


function getHeightRange(product) {
  const h = (product.coverage_area || '').toLowerCase();
  if (!h) return 'all';
  const match = h.match(/(\d+)/);
  if (!match) return 'all';
  const val = parseInt(match[1]);
  if (val < 100) return 'low';
  if (val < 300) return 'medium';
  return 'tall';
}

function getInstallComplexity(product) {
  const desc = ((product.description || '') + (product.short_description || '')).toLowerCase();
  if (desc.includes('plug') || desc.includes('snadná') || desc.includes('terasa') || desc.includes('zahrada')) return 'easy';
  if (desc.includes('projekt') || desc.includes('zakázk') || desc.includes('instalace')) return 'complex';
  return 'medium';
}

// ─── KATEGORIE ─────────────────────────────────────────────────────────────

const categoryGroups = [
{
  id: 'sochy',
  label: 'Mlžné sochy',
  icon: Trees,
  tagline: 'Přírodní tvary. Živá atmosféra.',
  description: 'Mlžné sochy jsou skulpturální instalace inspirované přírodou — stromy, mraky, listy, větve. Kombinují vizuální zážitek s funkčním ochlazením. Ideální tam, kde chcete víc než technologii: chcete dominantu místa.',
  audience: ['Architekti a krajinní designéři', 'Správci měst a náměstí', 'Eventy a festivaly', 'Resorty a wellness'],
  usecases: ['Městská náměstí a parky', 'Vstupní prostory hotelů', 'Open-air eventy', 'Soukromé zahrady a vily'],
  accent: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  dbCategories: ['NATURE'],
  slugKeywords: ['strom', 'mrak', 'steblo', 'mrkev', 'duna', 'slunecnik']
},
{
  id: 'brany',
  label: 'Mlžné brány a portály',
  icon: Landmark,
  tagline: 'Vstup skrze mlhu. Nezapomenutelný moment.',
  description: 'Brány a portály z mlhy vytváří dramatický vstupní zážitek — zákazník nebo návštěvník doslova prochází zdí mlhy. Architektonicky čisté linie z nerezové oceli, přizpůsobitelné šíři a výšce průchodu.',
  audience: ['Organizátoři eventů a festivalů', 'Hotely a resort vstupní zóny', 'Obchodní centra a showroomy', 'Sportovní areály'],
  usecases: ['Vstup na festival nebo event', 'Hotelový vstupní portál', 'Výstavní stánky a expozice', 'VIP zóny a červené koberce'],
  accent: 'text-sky-700 bg-sky-50 border-sky-200',
  dbCategories: ['URBAN ART'],
  slugKeywords: ['portal', 'vertigo', 'helix', 'aura', 'linear', 'lomene', 'silueta', 'krystal']
},
{
  id: 'mlhoviste',
  label: 'Mlhoviště a chladicí zóny',
  icon: Flame,
  tagline: 'Až −9 °C. Komfort bez kompromisů.',
  description: 'Systémy pro plošné ochlazení otevřených prostorů — terasy, hřiště, sportovní zázemí, průmyslové prostory. Průmyslové čerpadlo s tlakem 70 bar rozptyluje mikro-kapičky 5–10 µm, které se okamžitě odpaří a ochlazují vzduch bez pocitu mokra.',
  audience: ['Provozovatelé restaurací a kaváren', 'Obce a správci veřejných ploch', 'Průmyslové a logistické provozovny', 'Školy a mateřské školy'],
  usecases: ['Letní terasy restaurací', 'Dětská hřiště a školní dvorky', 'Sportovní tribuny a venkovní fitness', 'Sklady a výrobní haly s tepelnou zátěží'],
  accent: 'text-orange-700 bg-orange-50 border-orange-200',
  dbCategories: ['GEOMETRY'],
  slugKeywords: ['lavicka', 'bench', 'filtracni', 'trysky', 'holmapp']
}];


const audienceSegments = [
{ icon: Building2, label: 'Města a obce', desc: 'Ochlazení náměstí, parků a veřejných prostranství. Dotační programy dostupné.' },
{ icon: Users, label: 'Eventy a festivaly', desc: 'Pronájem nebo zakoupení mlžných instalací. Rychlá montáž a přenosnost.' },
{ icon: Home, label: 'Rezidenční', desc: 'Soukromé zahrady, terasy a wellness. Individuální návrh a diskrétní instalace.' },
{ icon: Warehouse, label: 'Průmysl a logistika', desc: 'Ochlazení pracovišť, skladů a výrobních hal. Zvýšení produktivity a BOZP.' },
{ icon: Baby, label: 'Školy a hřiště', desc: 'Bezpečné mlžení pro děti. Certifikované materiály, bez chemie, potravinářská nerez.' }];


// Fallback images by category
const FALLBACK_IMAGES = {
  NATURE: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
  'URBAN ART': 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800&q=80',
  GEOMETRY: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
  DEFAULT: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
};

function ProductCard({ product, i }) {
  const imgSrc = product.image_url || FALLBACK_IMAGES[product._categoryName] || FALLBACK_IMAGES.DEFAULT;
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
          {/* Mist overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-6">
          <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">{product._categoryName || 'Mlžný systém'}</p>
          <h3 className="text-xl font-normal text-slate-900 mb-1">{product.name}</h3>
          <p className="text-sm text-slate-500 mb-3 line-clamp-2">{product.short_description}</p>
          {product.material &&
          <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">{product.material}</p>
          }
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

export default function Kolekce() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heightFilter, setHeightFilter] = useState('all');
  const [installFilter, setInstallFilter] = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setSEO(SEO_PAGES.kolekce);
  }, []);

  useEffect(() => {
    Promise.all([
    base44.entities.Product.list().catch(() => []),
    base44.entities.ProductCategory.list().catch(() => [])]
    ).then(([prods, cats]) => {
      const enriched = (prods || []).map((p) => ({
        ...p,
        _categoryName: (cats || []).find((c) => c.id === p.category_id)?.name || ''
      }));
      setProducts(enriched);
      setCategories(cats || []);
    }).finally(() => setLoading(false));
  }, []);

  const activeGroup = categoryGroups.find((g) => g.id === activeCategory);
  const hasAdvancedFilter = heightFilter !== 'all' || installFilter !== 'all' || search.trim();

  const displayedProducts = products.
  filter((p) => !['HolmApp Control', 'Filtrační Moduly', 'Trysky HT-LT', 'AI Design Studio'].includes(p.name)).
  filter((p) => {
    if (activeGroup) {
      return activeGroup.dbCategories.includes(p._categoryName) ||
      activeGroup.slugKeywords.some((kw) => (p.slug || '').includes(kw));
    }
    return true;
  }).
  filter((p) => heightFilter === 'all' || getHeightRange(p) === heightFilter).
  filter((p) => installFilter === 'all' || getInstallComplexity(p) === installFilter).
  filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (p.name || '').toLowerCase().includes(q) ||
    (p.short_description || '').toLowerCase().includes(q) ||
    (p.description || '').toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-white pt-16">

      {/* ── HERO SLIDER ── */}
      <KolekceHero />

      {/* ── HERO TEXT ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading font-light text-4xl lg:text-5xl text-slate-900 tracking-tight mb-4">
            Mlžné systémy<br /><span className="text-slate-400">pro každý prostor.</span>
          </h1>
          <p className="text-slate-500 max-w-xl text-lg leading-relaxed">
            Od skulpturálních soch přes vstupní portály až po plošné chladicí zóny. Zakázková výroba z nerezové oceli, navržená přesně pro váš projekt.
          </p>
        </motion.div>
      </div>

      {/* ── KATEGORIE ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-8">
        <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase mb-3">Vyberte kategorii</p>
        <div className="flex flex-wrap gap-2.5">
          <button onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${!activeCategory ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-900'}`}>
            Vše
          </button>
          {categoryGroups.map((g) => {
            const Icon = g.icon;
            const active = activeCategory === g.id;
            return (
              <button key={g.id} onClick={() => setActiveCategory(active ? null : g.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all ${active ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-900'}`}>
                <Icon size={14} /> {g.label}
              </button>);

          })}
        </div>
        {activeGroup &&
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-sm text-slate-500 max-w-2xl">
            {activeGroup.description}
          </motion.p>
        }
      </div>

      {/* ── POKROČILÉ FILTRY ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-8">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          {/* Search */}
          <input
            type="text"
            placeholder="Hledat produkt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:border-slate-400 focus:outline-none transition-all" />
          
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono tracking-widest uppercase transition-all ${showAdvanced || hasAdvancedFilter ? 'bg-slate-100 border-slate-300 text-slate-900' : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-700'}`}>
            
            <SlidersHorizontal size={14} /> Filtry {hasAdvancedFilter && '●'}
          </button>
          {hasAdvancedFilter &&
          <button onClick={() => {setHeightFilter('all');setInstallFilter('all');setSearch('');}}
          className="text-xs text-slate-400 hover:text-slate-900 font-mono flex items-center gap-1">
              <X size={12} /> Reset
            </button>
          }
        </div>

        {showAdvanced &&
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase mb-2">Výška systému</p>
              <div className="flex flex-wrap gap-2">
                {HEIGHT_OPTIONS.map((o) =>
              <button key={o.value} onClick={() => setHeightFilter(o.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${heightFilter === o.value ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-500 hover:text-slate-900'}`}>
                    {o.label}
                  </button>
              )}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase mb-2">Náročnost instalace</p>
              <div className="flex flex-wrap gap-2">
                {INSTALL_OPTIONS.map((o) =>
              <button key={o.value} onClick={() => setInstallFilter(o.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${installFilter === o.value ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-500 hover:text-slate-900'}`}>
                    {o.label}
                  </button>
              )}
              </div>
            </div>
          </motion.div>
        }
      </div>

      {/* ── PRODUKTY ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400">
            {activeGroup ? `${activeGroup.label} — produkty` : 'Všechny produkty'}
            {!loading && <span className="ml-2 text-slate-300">({displayedProducts.length})</span>}
          </p>
          {activeCategory &&
          <button onClick={() => setActiveCategory(null)} className="text-xs text-slate-400 hover:text-slate-900 transition-colors font-mono">
              × Zobrazit vše
            </button>
          }
        </div>
        {loading ?
        <div className="flex justify-center py-24">
            <Loader size={24} className="animate-spin text-slate-300" />
          </div> :

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedProducts.map((p, i) => <ProductCard key={p.id} product={p} i={i} />)}
            {displayedProducts.length === 0 &&
          <p className="col-span-3 text-center text-slate-400 py-16 text-sm">Žádné produkty v této kategorii.</p>
          }
          </div>
        }
      </div>

      {/* ── PRO KOHO ── */}
      <div className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Pro koho jsou systémy určeny</p>
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

      {/* ── CTA ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="p-10 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Nový katalog 2026</p>
            <h3 className="font-heading font-light text-2xl text-slate-900">Celá kolekce v jednom PDF.</h3>
            <p className="text-sm text-slate-400 mt-1">Technické listy, výkresy, ceníky a referenční fotografie všech modelů.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="mailto:obchod1@holmtec.cz?subject=Katalog 2026 — zaslat PDF"
            className="px-7 py-3.5 border border-slate-300 text-slate-900 text-sm font-medium rounded-full hover:bg-slate-100 transition-all whitespace-nowrap">
              Zaslat katalog na e-mail
            </a>
            <Link to="/kontakt"
            className="px-7 py-3.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all whitespace-nowrap">
              Nezávazná poptávka
            </Link>
          </div>
        </div>
      </div>
    </div>);

}