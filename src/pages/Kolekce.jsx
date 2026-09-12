import React, { useState, useEffect, useMemo } from 'react';
import { Loader, Search, X, Building2, Home, Dumbbell, School, UtensilsCrossed, SlidersHorizontal } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import { isArchived } from '@/lib/newMedia';
import { FAMILIES, getLine, getFamily, getFamilyById, sortByStructure } from '@/lib/productFamilies';
import KolekceHero from '@/components/kolekce/KolekceHero';
import CollectionOffers from '@/components/kolekce/CollectionOffers';
import FamilyNav from '@/components/kolekce/FamilyNav';
import LineChips from '@/components/kolekce/LineChips';
import CatalogProductCard from '@/components/kolekce/CatalogProductCard';
import GatesSlider from '@/components/kolekce/GatesSlider';
import FeaturesBenefitsSection from '@/components/kolekce/FeaturesBenefitsSection';
import LiveDemoSection from '@/components/kolekce/LiveDemoSection';
import CatalogAudience from '@/components/kolekce/CatalogAudience';

const HIDDEN_NAMES = ['SMART řízení mlžítek', 'Filtrační a jiné Moduly', 'Trysky M2 ', 'senzory'];
const HIDDEN_SLUGS = ['garden-cooling-set'];

const SPACE_FILTERS = [
  { value: 'all', label: 'Všechny prostory', icon: SlidersHorizontal },
  { value: 'city', label: 'Města', icon: Building2 },
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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [family, setFamily] = useState(null);
  const [line, setLine] = useState(null);
  const [space, setSpace] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { setSEO(SEO_PAGES.kolekce); }, []);

  useEffect(() => {
    base44.entities.Product.list('name', 200)
      .then((list) => setProducts((list || []).filter((p) => !isArchived(p.slug) && !HIDDEN_NAMES.includes(p.name) && !HIDDEN_SLUGS.includes(p.slug))))
      .finally(() => setLoading(false));
  }, []);

  const familyCounts = useMemo(() => products.reduce((acc, p) => { const id = getFamily(p).id; acc[id] = (acc[id] || 0) + 1; return acc; }, {}), [products]);
  const lineCounts = useMemo(() => products.reduce((acc, p) => { const k = getLine(p).key; acc[k] = (acc[k] || 0) + 1; return acc; }, {}), [products]);

  const displayed = useMemo(() => sortByStructure(products
    .filter((p) => !family || getFamily(p).id === family)
    .filter((p) => !line || getLine(p).key === line)
    .filter((p) => matchesSpace(p, space))
    .filter((p) => !search.trim() || `${p.name} ${p.short_description || ''}`.toLowerCase().includes(search.toLowerCase()))
  ), [products, family, line, space, search]);

  const activeFamily = family ? getFamilyById(family) : null;
  const hasFilter = family || line || space !== 'all' || search.trim();
  const clear = () => { setFamily(null); setLine(null); setSpace('all'); setSearch(''); };
  const selectFamily = (id) => { setFamily(id); setLine(null); };

  return (
    <div className="min-h-screen bg-white">
      <KolekceHero />
      <CollectionOffers />
      <FamilyNav activeFamily={family} onSelect={selectFamily} counts={familyCounts} />

      <div id="catalog" className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#153863]">{activeFamily ? `// ${activeFamily.code} ${activeFamily.label}` : '// Kompletní katalog'}</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-[#0A1628] sm:text-4xl">{activeFamily ? activeFamily.title : 'Všechna mlžítka, brány a mlžné sochy'}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[#5A6B78]">{activeFamily ? activeFamily.description : 'Katalog je členěný podle kolekcí a produktových řad. Vyberte kolekci, řadu nebo typ prostoru — ceny sdělujeme na poptávku podle konfigurace a rozsahu instalace.'}</p>
          </div>
          {!loading && <span className="badge-brand-secondary shrink-0">{displayed.length} produktů</span>}
        </div>

        <div className="sticky top-[64px] z-30 mb-8 border border-[#D3E2E8] bg-white/95 p-3 shadow-[var(--brand-shadow-md)] backdrop-blur-xl sm:p-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 xl:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {SPACE_FILTERS.map(({ value, label, icon: Icon }) => {
                const active = space === value;
                return (
                  <button key={value} type="button" onClick={() => setSpace(value)} className={`inline-flex min-h-[42px] shrink-0 items-center gap-2 border px-4 font-heading text-[13px] font-semibold transition ${active ? 'border-[#0A1628] bg-[#0A1628] text-[#F4FAFC]' : 'border-[#D3E2E8] bg-white text-[#0A1628] hover:border-[#153863]'}`}>
                    <Icon size={15} strokeWidth={1.6} />{label}
                  </button>
                );
              })}
            </div>
            <label className="relative xl:w-[280px]">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5A6B78]" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Hledat produkt…" className="h-[42px] w-full border border-[#D3E2E8] bg-[#F4FAFC] pl-11 pr-4 text-sm text-[#0A1628] outline-none transition focus:border-[#153863] focus:bg-white" />
            </label>
          </div>
          {family && (
            <div className="mt-3 border-t border-[#D3E2E8] pt-3">
              <LineChips familyId={family} activeLine={line} onSelect={setLine} counts={lineCounts} />
            </div>
          )}
          {hasFilter && (
            <div className="mt-3 flex items-center justify-end border-t border-[#D3E2E8] pt-3">
              <button type="button" onClick={clear} className="btn-brand-text inline-flex items-center gap-1 !p-0"><X size={13} /> Zrušit filtry</button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><Loader size={24} className="animate-spin text-[#D3E2E8]" /></div>
        ) : (
          <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
            {displayed.map((p) => <CatalogProductCard key={p.id} product={p} />)}
            {displayed.length === 0 && <p className="col-span-3 py-16 text-center text-sm text-[#5A6B78]">Žádné produkty neodpovídají filtru.</p>}
          </div>
        )}
      </div>

      <GatesSlider />
      <FeaturesBenefitsSection />
      <LiveDemoSection />
      <CatalogAudience />
    </div>
  );
}