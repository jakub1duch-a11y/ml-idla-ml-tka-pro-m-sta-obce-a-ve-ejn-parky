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
import { ArrowRight, Trees, Landmark, Flame, Building2, Home, Users, Warehouse, Baby, Loader, SlidersHorizontal, X, Zap, Eye } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import { trackQuickInquiryClick } from '@/lib/ga4';

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
  tagline: 'Ochlazení otevřených prostorů až o 9 °C.',
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
{ icon: Home, label: 'Rezidenční', desc: 'Mlžítka zahradní pro soukromé zahrady, terasy, wellness hotely, restaurační zahrádky... Individuální návrh a diskrétní mlžná instalace.' },
{ icon: Warehouse, label: 'Průmysl a logistika', desc: 'Ochlazení pracovišť, skladů a výrobních hal. Zvýšení produktivity a BOZP.' },
{ icon: Baby, label: 'Školy a hřiště', desc: 'Bezpečné mlžítka - mlžná hřiště pro děti. Certifikované materiály, bez chemie, potravinářská nerez.' }];


// Fallback images by category
const FALLBACK_IMAGES = {
  NATURE: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/e6993add8_Reference-mstoPolna.webp',
  'URBAN ART': 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/58e5e3931_MestskabranaGATE.png',
  GEOMETRY: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/03ba352a3_mlzitka-zahradni-hotely-restaurace.png',
  DEFAULT: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9cf838258_MlzicisprchaaSMARTaplikace.png'
};

function ProductCard({ product, i }) {
  const imgSrc = product.image_url || FALLBACK_IMAGES[product._categoryName] || FALLBACK_IMAGES.DEFAULT;
  return <motion.article initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
    <Link to={product.slug ? `/produkt/${product.slug}` : '/kontakt'} className="block flex-1"><div className="relative aspect-[16/10] overflow-hidden bg-muted"><img src={imgSrc} alt={product.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" decoding="async" /><div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-transparent to-transparent" />{product.featured && <span className="absolute left-4 top-4 bg-card px-3 py-1 font-mono text-[10px] tracking-[.14em] text-primary">VÝBĚR</span>}<span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[.14em] text-white">{product._categoryName || 'MLŽNÝ SYSTÉM'}</span></div><div className="p-6"><h3 className="font-heading text-2xl text-foreground">{product.name}</h3><p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.short_description}</p><p className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-secondary pb-2 pt-2 pr-1">Prohlédnout detail</p></div></Link>
    <Link to={`/kontakt?produkt=${encodeURIComponent(product.name)}`} onClick={() => trackQuickInquiryClick(product.name, 'katalog')} className="flex items-center justify-center gap-1.5 border-t border-border py-3 font-bold transition hover:bg-muted text-[hsl(var(--background))] text-sm bg-[hsl(var(--ring))]"><Zap size={13} /> Popsat projekt</Link>
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

      {/* ── MLŽNÉ BRÁNY (GATE, LINEA) ── */}
      <GatesSlider />

      {/* ── HLAVNÍ INFORMACE ── */}
      <CollectionMainInfoSection />

      {/* ── DYNAMICKÝ SLIDER PRODUKTŮ ── */}
      <ProductsShowcaseSlider />

      {/* ── VLASTNOSTI A VÝHODY ── */}
      <FeaturesBenefitsSection />

      {/* ── PRODUKTY ── */}
      <div id="catalog" className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24">
        <div className="flex items-center justify-between mb-10 lg:mb-12">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400">
            {activeGroup ? `${activeGroup.label} — produkty` : 'Všechny mlžné systémy'}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-5">
            {displayedProducts.map((p, i) => <ProductCard key={p.id} product={p} i={i} />)}
            {displayedProducts.length === 0 &&
          <p className="col-span-3 text-center text-slate-400 py-16 text-sm">Žádné produkty v této kategorii.</p>
          }
          </div>
        }
      </div>

      {/* ── ŽIVÁ UKÁZKA ── */}
      <LiveDemoSection />

      {/* ── PRO KOHO ── */}
      <div className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Pro koho jsou mlžítka a mlžné systémy určeny</p>
            <h2 className="font-heading font-semibold text-3xl lg:text-4xl text-slate-900 tracking-tight">Řešení podle prostoru a provozu.</h2>
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
                  <h4 className="text-sm font-normal text-slate-900 mb-2">{seg.label}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{seg.desc}</p>
                </motion.div>);

            })}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20 bg-[hsl(var(--ring))]">
        <div className="p-6 md:p-10 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-2">Nový katalog - kolekce 2026</p>
            <h3 className="font-heading font-light text-2xl text-slate-900">Celá kolekce mlžítek v jednom PDF.</h3>
            <p className="text-sm text-slate-400 mt-1">Technické listy, výkresy, ceníky a referenční fotografie všech modelů mlžítek.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="mailto:obchod1@holmtec.cz?subject=Katalog 2026 — zaslat PDF"
            className="px-7 py-3.5 border border-slate-300 text-slate-900 text-sm font-medium rounded-full hover:bg-slate-100 transition-all whitespace-nowrap">
              Zaslat katalog na e-mail
            </a>
            <Link to="/kontakt"
            className="px-7 py-3.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all whitespace-nowrap">
              Popsat projekt
            </Link>
          </div>
        </div>
      </div>
    </div>);

}