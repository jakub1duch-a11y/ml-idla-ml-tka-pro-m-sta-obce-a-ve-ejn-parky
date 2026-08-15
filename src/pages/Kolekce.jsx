import React, { useState, useEffect } from 'react';
import KolekceHero from '@/components/kolekce/KolekceHero';
import CategorySelector from '@/components/kolekce/CategorySelector';
import FeaturesBenefitsSection from '@/components/kolekce/FeaturesBenefitsSection';
import LiveDemoSection from '@/components/kolekce/LiveDemoSection';
import GatesSlider from '@/components/kolekce/GatesSlider';
import CollectionMainInfoSection from '@/components/kolekce/CollectionMainInfoSection';
import ProductsShowcaseSlider from '@/components/kolekce/ProductsShowcaseSlider';
import CollectionOffers from '@/components/kolekce/CollectionOffers';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Trees, Landmark, Flame, Building2, Home, Users, Warehouse, Baby, Loader, SlidersHorizontal, X, Zap, Eye, Ruler, MoveHorizontal, Dumbbell, School, UtensilsCrossed, Waves } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import { trackQuickInquiryClick } from '@/lib/ga4';
import ProductHoverImage from '@/components/ui/ProductHoverImage';

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

const CATEGORY_GROUPS = [
{
  id: 'sochy',
  label: 'Mlžné sochy',
  icon: Trees,
  tagline: 'Přírodní tvary. Živá atmosféra.',
  description: 'Mlžné sochy jsou skulpturální instalace mlžítek inspirované přírodou — stromy, mraky, listy a větve.',
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
  description: 'Mlžné brány a portály vytvářejí výrazný vstupní zážitek v čistých liniích nerezové oceli.',
  audience: ['Organizátoři eventů a festivalů', 'Hotely a resorty', 'Obchodní centra a showroomy', 'Sportovní areály'],
  usecases: ['Vstup na festival nebo event', 'Hotelový vstupní portál', 'Výstavní stánky a expozice', 'VIP zóny'],
  accent: 'text-sky-700 bg-sky-50 border-sky-200',
  dbCategories: ['URBAN ART'],
  slugKeywords: ['aura', 'linear', 'y-armist', 'spirala', 'bendy']
},
{
  id: 'mlhoviste',
  label: 'Mlhoviště a chladicí zóny',
  icon: Flame,
  tagline: 'Ochlazení otevřených prostorů až o 10 °C.',
  description: 'Systémy pro plošné ochlazení teras, hřišť, sportovního zázemí a průmyslových prostorů.',
  audience: ['Provozovatelé restaurací a kaváren', 'Obce a správci veřejných ploch', 'Průmyslové provozy', 'Školy a školky'],
  usecases: ['Letní terasy restaurací', 'Dětská hřiště a školní dvorky', 'Sportovní tribuny', 'Sklady a výrobní haly'],
  accent: 'text-orange-700 bg-orange-50 border-orange-200',
  dbCategories: ['GEOMETRY'],
  slugKeywords: ['mlzitka', 'mlziste', 'mlzne-systemy', 'mlzne-prislusenstvi', 'smart']
}];


const audienceSegments = [
{ icon: Building2, label: 'Města a obce', desc: 'Městské ochlazení náměstí, parků a veřejných prostranství. Dotační programy dostupné.' },
{ icon: Users, label: 'Eventy a festivaly', desc: 'Pronájem nebo zakoupení mlžítek a mlžných instalací. Rychlá montáž a přenosnost.' },
{ icon: Home, label: 'Rezidenční', desc: 'Zahradní mlžítka pro soukromé zahrady, terasy, wellness hotely i restaurační zahrádky. Individuální návrh a diskrétní instalace.' },
{ icon: Warehouse, label: 'Průmysl a logistika', desc: 'Ochlazení pracovišť, skladů a výrobních hal. Zvýšení produktivity a BOZP.' },
{ icon: Baby, label: 'Školy a hřiště', desc: 'Bezpečné mlžítka - mlžná hřiště pro děti. Certifikované materiály, bez chemie, potravinářská nerez.' }];


// Fallback images by category
const FALLBACK_IMAGES = {
  NATURE: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e6993add8_Reference-mstoPolna.webp',
  'URBAN ART': 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/58e5e3931_MestskabranaGATE.png',
  GEOMETRY: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/03ba352a3_mlzitka-zahradni-hotely-restaurace.png',
  DEFAULT: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9cf838258_MlzicisprchaaSMARTaplikace.png'
};

const PRODUCT_CARD_META = {
  'mlzitko-bendy': { dims: [['Výška', '1,7–2 m'], ['Průměr', '60 / 70 mm']], places: [['Zahrada', Home], ['Terasa', UtensilsCrossed], ['Park', Trees]] },
  'bendy-arc': { dims: [['Šířka', 'projektová'], ['Výška', 'projektová']], places: [['Náměstí', Building2], ['Promenáda', Landmark], ['Park', Trees]] },
  'bendy-back-to-back': { dims: [['Záběr', '360°'], ['Výška', 'projektová']], places: [['Náměstí', Building2], ['Park', Trees], ['Resort', Home]] },
  'bendy-alej': { dims: [['Počet', '5+ prvků'], ['Rozteč', 'projektová']], places: [['Promenáda', Landmark], ['Sportoviště', Dumbbell], ['Náměstí', Building2]] },
  'bendy-field': { dims: [['Velikost', 'S / M / L'], ['Počet', '3–9 prvků']], places: [['Sportoviště', Dumbbell], ['Škola', School], ['Náměstí', Building2]] },
  'city-arc-3': { dims: [['Šířka', '~3 000 mm'], ['Výška', '~2 200 mm']], places: [['Město', Building2], ['Promenáda', Landmark], ['Koupaliště', Waves]] },
  'city-arc-4': { dims: [['Šířka', '~4 000 mm'], ['Výška', '~2 200 mm']], places: [['Město', Building2], ['Promenáda', Landmark], ['Koupaliště', Waves]] },
  'city-arc-5': { dims: [['Šířka', '~5 000 mm'], ['Výška', '~2 200 mm']], places: [['Město', Building2], ['Sportoviště', Dumbbell], ['Koupaliště', Waves]] },
  'linea-solo': { dims: [['Profil', '70 × 70 mm'], ['Výška', 'projektová']], places: [['Náměstí', Building2], ['Gastro', UtensilsCrossed], ['Hotel', Home]] },
  'linea-gate': { dims: [['Šířka', 'projektová'], ['Výška', 'projektová']], places: [['Vstupy', Landmark], ['Náměstí', Building2], ['Promenáda', Trees]] },
  'linea-avenue': { dims: [['Počet', 'více prvků'], ['Rozteč', 'projektová']], places: [['Promenáda', Landmark], ['Park', Trees], ['Sportoviště', Dumbbell]] },
  'garden-cooling-set': { dims: [['Sestava', 'na míru'], ['Instalace', 'snadná']], places: [['Zahrada', Home], ['Terasa', UtensilsCrossed], ['Rezidence', Home]] },
  'city-cooling-zone': { dims: [['Rozsah', 'S / M / L'], ['Instalace', 'modulární']], places: [['Náměstí', Building2], ['Park', Trees], ['Škola', School]] },
};

function getCardMeta(product) {
  const direct = PRODUCT_CARD_META[product.slug];
  if (direct) return direct;
  const category = (product._categoryName || '').toLowerCase();
  const description = `${product.short_description || ''} ${product.description || ''}`.toLowerCase();
  const places = [];
  if (category.includes('urban') || description.includes('náměst')) places.push(['Město', Building2]);
  if (description.includes('park')) places.push(['Park', Trees]);
  if (description.includes('sport')) places.push(['Sportoviště', Dumbbell]);
  if (description.includes('škol')) places.push(['Škola', School]);
  if (description.includes('zahrad') || description.includes('terasa')) places.push(['Zahrada', Home]);
  const uniquePlaces = places.filter((item, idx, arr) => arr.findIndex((x) => x[0] === item[0]) === idx).slice(0, 3);
  return {
    dims: [
      ['Výška', product.coverage_area || 'projektová'],
      ['Provedení', product.material?.includes('316') ? 'AISI 316L' : 'na míru'],
    ],
    places: uniquePlaces.length ? uniquePlaces : [['Veřejný prostor', Building2], ['Zahrada', Trees]],
  };
}

function ProductCard({ product, i }) {
  const fallback = FALLBACK_IMAGES[product._categoryName] || FALLBACK_IMAGES.DEFAULT;
  const meta = getCardMeta(product);
  return <motion.article initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="group mx-auto flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-xl">
    <Link to={product.slug ? `/produkt/${product.slug}` : '/kontakt'} className="flex flex-1 flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted"><ProductHoverImage product={product} fallback={fallback} className="h-full w-full" overlay />{product.featured && <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 font-mono text-[10px] tracking-[.14em] text-primary shadow-sm">VÝBĚR</span>}<span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[.14em] text-white">{product._categoryName || 'MLŽNÝ SYSTÉM'}</span></div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="min-h-[3.6rem] line-clamp-2 font-heading text-2xl leading-[1.2] text-foreground">{product.name}</h3>
        <p className="mt-3 min-h-[2.75rem] line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.short_description}</p>

        <div className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-100 py-4">
          {meta.dims.map(([label, value], idx) => {
            const Icon = idx === 0 ? MoveHorizontal : Ruler;
            return <div key={label} className="flex items-start gap-2.5"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-[#0b4860]"><Icon size={14} strokeWidth={1.7}/></span><span className="min-w-0"><span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">{label}</span><span className="mt-0.5 block text-xs font-semibold leading-snug text-slate-800">{value}</span></span></div>;
          })}
        </div>

        <div className="mt-4 flex min-h-[44px] flex-wrap gap-2">
          {meta.places.map(([label, Icon]) => <span key={label} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-medium text-slate-600"><Icon size={12} strokeWidth={1.7} className="text-[#0b4860]"/>{label}</span>)}
        </div>

        <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-foreground">Detail produktu <ArrowRight size={15} /></span>
      </div>
    </Link>
  </motion.article>;
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

  const activeGroup = CATEGORY_GROUPS.find((g) => g.id === activeCategory);
  const hasAdvancedFilter = heightFilter !== 'all' || installFilter !== 'all' || search.trim();

  const displayedProducts = products.
  filter((p) => !['SMART řízení mlžítek', 'Filtrační a jiné Moduly', 'Trysky M2 ', 'senzory'].includes(p.name)).
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
    <div className="min-h-screen bg-white">

      {/* ── HERO SLIDER ── */}
      <KolekceHero />

      <CollectionOffers />

      {/* ── KATEGORIE (hover icon cards) ── */}
      <CategorySelector groups={CATEGORY_GROUPS} activeCategory={activeCategory} onSelect={setActiveCategory} />

      {/* ── PRODUKTY (posunuto výš — hned pod výběrem kategorií) ── */}
      <div id="catalog" className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between lg:mb-12">
          <div><p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">Kompletní katalog</p><h2 className="mt-3 font-heading tracking-[-.02em] text-foreground sm:text-4xl text-4xl lg:text-4xl">
            {activeGroup ? `${activeGroup.label}` : 'Všechna mlžítka a mlžné systémy'}
          </h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">Vyberte produkt podle typu prostoru. Každý model lze upravit podle konkrétní instalace, způsobu napojení a požadovaného provozu.</p></div>
          {!loading && <span className="shrink-0 rounded-full border border-border px-4 py-2 font-mono text-xs text-muted-foreground">{displayedProducts.length} produktů</span>}
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

        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
            {displayedProducts.map((p, i) => <ProductCard key={p.id} product={p} i={i} />)}
            {displayedProducts.length === 0 &&
          <p className="col-span-3 text-center text-slate-400 py-16 text-sm">Žádné produkty v této kategorii.</p>
          }
          </div>
        }
      </div>

      {/* ── MLŽNÉ BRÁNY (GATE, LINEA) ── */}
      <GatesSlider />

      {/* ── HLAVNÍ INFORMACE ── */}
      <CollectionMainInfoSection />

      {/* ── DYNAMICKÝ SLIDER PRODUKTŮ ── */}
      <ProductsShowcaseSlider />

      {/* ── VLASTNOSTI A VÝHODY ── */}
      <FeaturesBenefitsSection />

      {/* ── ŽIVÁ UKÁZKA ── */}
      <LiveDemoSection />

      {/* ── PRO KOHO ── */}
      <div className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Pro koho jsou mlžítka a mlžné systémy určeny</p>
            <h2 className="font-heading text-3xl tracking-[-.02em] text-foreground sm:text-4xl lg:text-5xl">Řešení podle prostoru a provozu.</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {audienceSegments.map((seg, i) => {
              const Icon = seg.icon;
              return (
                <motion.div key={seg.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition-all">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 bg-[hsl(var(--ring))] text-[hsl(var(--background))]">
                    <Icon size={16} className="text-[hsl(var(--card))]" />
                  </div>
                  <h4 className="mb-2 font-heading text-lg text-foreground">{seg.label}</h4>
                  <p className="text-slate-400 leading-relaxed text-sm">{seg.desc}</p>
                </motion.div>);

            })}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      

















      
    </div>);

}