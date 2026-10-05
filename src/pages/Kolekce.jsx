import ProductExperience from '@/components/ui/ProductExperience';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Loader, Search, X, Building2, Home, Dumbbell, School, UtensilsCrossed, SlidersHorizontal } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import { isArchived } from '@/lib/newMedia';
import { FAMILIES, getLine, getFamily, getFamilyById, sortByStructure } from '@/lib/productFamilies';
import { mergePortalGateProducts } from '@/lib/portalGateProducts';
import KolekceHero from '@/components/kolekce/KolekceHero';
import ProductCategoryExplorer from '@/components/kolekce/ProductCategoryExplorer';
import { useSearchParams } from 'react-router-dom';
import LineChips from '@/components/kolekce/LineChips';
import CatalogProductCard from '@/components/kolekce/CatalogProductCard';
import FeaturesBenefitsSection from '@/components/kolekce/FeaturesBenefitsSection';
import LiveDemoSection from '@/components/kolekce/LiveDemoSection';
import CatalogAudience from '@/components/kolekce/CatalogAudience';

const HIDDEN_NAMES = ['SMART řízení mlžítek', 'Filtrační a jiné Moduly', 'Trysky M2 ', 'senzory'];
const HIDDEN_SLUGS = ['garden-cooling-set'];

const SPACE_FILTERS = [
  { value: 'all', label: 'Všechny prostory', icon: SlidersHorizontal },
  { value: 'city', label: 'Města a obce', icon: Building2 },
  { value: 'garden', label: 'Zahrady', icon: Home },
  { value: 'sport', label: 'Sportoviště', icon: Dumbbell },
  { value: 'school', label: 'Školy & hřiště', icon: School },
  { value: 'gastro', label: 'Gastro & hotel', icon: UtensilsCrossed },
];
const SPACE_TERMS = {
  city: ['měst', 'náměst', 'park', 'promenád', 'veřejn', 'urban', 'brána', 'gate', 'linea', 'stébl'],
  garden: ['zahrad', 'terasa', 'reziden', 'soukrom'],
  sport: ['sport', 'stadion', 'hřiště', 'koupaliště'],
  school: ['škol', 'dětsk', 'hřiště', 'školk'],
  gastro: ['gastro', 'restaur', 'hotel', 'resort', 'terasa'],
};

function matchesSpace(p, filter) {
  if (filter === 'all') return true;
  const hay = `${p.name} ${p.slug} ${p.short_description || ''} ${p.description || ''}`.toLowerCase();
  return SPACE_TERMS[filter].some((t) => hay.includes(t));
}

export default function Kolekce() {
  const reduced = useReducedMotion();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get('kategorie');
  const selectedCategory = categories.find(c => c.slug === categorySlug);
  useEffect(() => { base44.entities.ProductCategory.list('order', 100).then(setCategories).catch(() => {}); }, []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [family, setFamily] = useState(null);
  const [line, setLine] = useState(null);
  const [space, setSpace] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { setSEO(SEO_PAGES.kolekce); }, []);
  useEffect(() => { setFamily(null); setLine(null); setSpace('all'); setSearch(''); }, [categorySlug]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    base44.entities.Product.list('name', 200)
      .then((list) => {
        if (!active) return;
        const visibleProducts = (list || []).filter((p) => !isArchived(p.slug) && !HIDDEN_NAMES.includes(p.name) && !HIDDEN_SLUGS.includes(p.slug));
        setProducts(mergePortalGateProducts(visibleProducts));
      })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [attempt]);

  const lineCounts = useMemo(() => products.reduce((acc, p) => { const k = getLine(p).key; acc[k] = (acc[k] || 0) + 1; return acc; }, {}), [products]);

  const displayed = useMemo(() => sortByStructure(products
    .filter((p) => !selectedCategory || p.category_id === selectedCategory.id)
    .filter((p) => !family || getFamily(p).id === family)
    .filter((p) => !line || getLine(p).key === line)
    .filter((p) => matchesSpace(p, space))
    .filter((p) => !search.trim() || `${p.name} ${p.short_description || ''}`.toLowerCase().includes(search.toLowerCase()))
  ), [products, family, line, space, search, selectedCategory]);

  const activeFamily = family ? getFamilyById(family) : null;
  const hasFilter = selectedCategory || family || line || space !== 'all' || search.trim();
  const clear = () => { setFamily(null); setLine(null); setSpace('all'); setSearch(''); setSearchParams({}); };
  const selectFamily = (id) => { setFamily(id); setLine(null); };

  return (
    <div className="catalog-premium min-h-screen overflow-x-clip bg-white">
      <KolekceHero category={selectedCategory} />

      <div id="catalog" className="catalog-pattern relative scroll-mt-24 mx-auto max-w-[1500px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mb-10 flex flex-col gap-6 border-b border-[#DCE9ED] pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#153863]">{activeFamily ? `// ${activeFamily.code} ${activeFamily.label}` : '// Kompletní katalog'}</p>
            <h2 className="mt-3 max-w-4xl font-heading text-4xl font-black leading-[.98] tracking-[-.055em] text-[#07131D] sm:text-5xl">{selectedCategory ? selectedCategory.name : activeFamily ? activeFamily.title : 'Katalog mlžítek, mlžných bran a mlžných prvků'}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#5A6B78]">{activeFamily ? activeFamily.description : 'Katalog je členěný podle produktových řad a využití. Pro města a obce doporučujeme filtrovat podle typu veřejného prostoru; cenu připravujeme podle konfigurace, počtu prvků a rozsahu instalace.'}</p>
          </div>
          {!loading && <span className="badge-brand-secondary shrink-0">{displayed.length} produktů</span>}
        </div>

        <motion.div initial={reduced ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-30 mb-8 lg:sticky lg:top-[72px] rounded-[1.5rem] border border-white/70 bg-white/[.78] p-3 shadow-[0_18px_60px_rgba(7,19,29,.10)] backdrop-blur-2xl sm:p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 xl:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {SPACE_FILTERS.map(({ value, label, icon: Icon }) => {
                const active = space === value;
                return (
                  <motion.button key={value} type="button" onClick={() => setSpace(value)} whileHover={reduced ? undefined : { y: -2 }} whileTap={reduced ? undefined : { scale: 0.97 }} className={`inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border px-4 font-heading text-[13px] font-semibold transition ${active ? 'border-[#07131D] bg-[#07131D] text-white shadow-sm' : 'border-[#D3E2E8] bg-white/80 text-[#0A1628] hover:border-[#7CCBD8] hover:bg-[#EFFAFC]'}`}>
                    <Icon size={15} strokeWidth={1.6} />{label}
                  </motion.button>
                );
              })}
            </div>
            <label className="sr-only" htmlFor="catalog-search">Hledat produkt</label>
            <div className="relative xl:w-[280px]">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5A6B78]" />
              <input id="catalog-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Hledat produkt…" className="h-[44px] w-full rounded-full border border-[#D3E2E8] bg-[#F4FAFC]/80 pl-11 pr-4 text-sm text-[#0A1628] outline-none transition focus:border-[#7CCBD8] focus:bg-white focus:ring-4 focus:ring-[#DDF7FA]/60" />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-[#D3E2E8] pt-3">
            <label htmlFor="catalog-family" className="text-xs font-semibold text-slate-600">Kolekce</label>
            <select id="catalog-family" value={family || ''} onChange={(event) => selectFamily(event.target.value || null)} className="min-h-11 max-w-full rounded-lg border border-[#D3E2E8] bg-white px-3 text-sm text-[#0d2d38]">
              <option value="">Všechny kolekce</option>
              {FAMILIES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </div>
          {family && (
            <div className="mt-3 border-t border-[#D3E2E8] pt-3">
              <LineChips familyId={family} activeLine={line} onSelect={setLine} counts={lineCounts} />
            </div>
          )}
          {hasFilter && (
            <div className="mt-3 flex items-center justify-end border-t border-[#D3E2E8] pt-3">
              <button type="button" onClick={clear} className="btn-brand-text inline-flex min-h-11 items-center gap-1 !p-0"><X size={13} /> Zrušit filtry</button>
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-24"><Loader size={24} className="animate-spin text-[#D3E2E8]" /></div>
        ) : error ? (
          <div role="alert" className="rounded-xl border border-slate-200 p-6"><p>Produkty se nepodařilo načíst.</p><button type="button" onClick={() => setAttempt((value) => value + 1)} className="mt-3 min-h-11 rounded border border-[#0e5b67] px-5 text-sm font-semibold">Zkusit znovu</button></div>
        ) : (
          <ProductExperience products={displayed}>
<AnimatePresence mode="popLayout"><motion.div layout className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
            {displayed.map((p) => <CatalogProductCard key={p.id} product={p} />)}
            {displayed.length === 0 && <p className="col-span-full py-16 text-center text-sm text-[#5A6B78]">Žádné produkty neodpovídají filtru.</p>}
          </motion.div></AnimatePresence>
</ProductExperience>
        )}
      </div>

      {!selectedCategory && <ProductCategoryExplorer />}
      <FeaturesBenefitsSection />
      <LiveDemoSection />
      <CatalogAudience />
    </div>
  );
}