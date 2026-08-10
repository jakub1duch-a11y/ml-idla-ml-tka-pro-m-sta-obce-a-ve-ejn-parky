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

function ProductCard({ product, i }) {
  const imgSrc = product.image_url || FALLBACK_IMAGES[product._categoryName] || FALLBACK_IMAGES.DEFAULT;
  const meta = [product.material, product.coverage_area, product.pressure].filter(Boolean).slice(0, 2);
  return <motion.article initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: Math.min(i * 0.045, .25), duration: .5 }} className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,.04)] transition-all duration-500 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-[0_20px_55px_rgba(15,23,42,.10)]">
    <Link to={product.slug ? `/produkt/${product.slug}` : '/kontakt'} className="block flex-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img src={imgSrc} alt={product.name} className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.045]" loading="lazy" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent opacity-80" />
        {product.featured && <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 font-mono text-[9px] tracking-[.16em] text-slate-900 shadow-sm">DOPORUČUJEME</span>}
        <span className="absolute bottom-4 left-4 font-mono text-[9px] tracking-[.16em] text-white/75 uppercase">{product._categoryName || 'MLŽNÝ SYSTÉM'}</span>
        <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all group-hover:bg-cyan-300 group-hover:text-slate-950"><ArrowRight size={15}/></span>
      </div>
      <div className="p-6 lg:p-7">
        <h3 className="font-heading text-[22px] text-slate-950 tracking-tight">{product.name}</h3>
        <p className="mt-2.5 line-clamp-2 min-h-[42px] text-[13px] leading-6 text-slate-500">{product.short_description || 'Architektonické mlžicí řešení navržené pro dlouhodobý venkovní provoz.'}</p>
        {meta.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{meta.map((m) => <span key={m} className="rounded-full bg-slate-50 px-2.5 py-1 text-[10px] text-slate-500 border border-slate-100">{m}</span>)}</div>}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4"><span className="text-xs font-semibold text-slate-900">Detail produktu</span><span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">Technické údaje →</span></div>
      </div>
    </Link>
    <Link to={`/kontakt?produkt=${encodeURIComponent(product.name)}`} onClick={() => trackQuickInquiryClick(product.name, 'katalog')} className="mx-4 mb-4 flex items-center justify-center gap-2 rounded-full bg-slate-950 py-3.5 text-xs font-bold text-white transition hover:bg-cyan-500 hover:text-slate-950"><Zap size={13} /> Vyžádat cenovou nabídku</Link>
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

      {/* ── PRODUKTOVÝ KATALOG ── */}
      <section id="catalog" className="border-t border-slate-200 bg-[#f7f8f8]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl mb-10 lg:mb-12">
            <p className="text-[10px] font-mono tracking-[.24em] uppercase text-teal-700 mb-4">01 / PRODUKTOVÁ KOLEKCE</p>
            <h2 className="font-heading font-light text-4xl lg:text-6xl text-slate-950 tracking-tight">Mlžítko jako <span className="text-teal-700">součást prostoru.</span></h2>
            <p className="mt-5 max-w-2xl text-sm lg:text-base leading-7 text-slate-500">Prohlédněte si jednotlivé modely a vyberte řešení podle charakteru prostoru, rozměru a způsobu instalace. Každý produkt navrhujeme pro konkrétní architekturu a provoz.</p>
          </div>

          <div className="sticky top-16 z-20 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-[0_10px_40px_rgba(15,23,42,.08)] backdrop-blur-xl mb-10">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1"><Eye size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Hledat model, použití nebo řešení…" className="w-full rounded-xl bg-slate-50 border border-slate-100 py-3.5 pl-11 pr-4 text-sm outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100"/></div>
              <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
                <button onClick={() => setActiveCategory(null)} className={`shrink-0 rounded-xl px-4 py-3 text-xs font-semibold transition ${!activeCategory ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>Všechny produkty</button>
                {CATEGORY_GROUPS.map((g) => <button key={g.id} onClick={() => setActiveCategory(activeCategory === g.id ? null : g.id)} className={`shrink-0 rounded-xl px-4 py-3 text-xs font-semibold transition ${activeCategory === g.id ? 'bg-teal-700 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>{g.label}</button>)}
                <button onClick={() => setShowAdvanced(!showAdvanced)} className={`shrink-0 inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold ${showAdvanced || hasAdvancedFilter ? 'border-teal-200 bg-teal-50 text-teal-800' : 'border-slate-100 text-slate-500'}`}><SlidersHorizontal size={14}/> Filtry</button>
              </div>
            </div>
            {showAdvanced && <div className="mt-3 grid sm:grid-cols-2 gap-3 border-t border-slate-100 pt-3">
              <select value={heightFilter} onChange={(e) => setHeightFilter(e.target.value)} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-600 outline-none"><option value="all">Výška — všechny</option>{HEIGHT_OPTIONS.slice(1).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
              <select value={installFilter} onChange={(e) => setInstallFilter(e.target.value)} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-600 outline-none"><option value="all">Instalace — všechny</option>{INSTALL_OPTIONS.slice(1).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
            </div>}
          </div>

          <div className="flex items-center justify-between mb-6"><p className="text-xs font-mono tracking-widest uppercase text-slate-400">{activeGroup ? activeGroup.label : 'Celý katalog'} <span className="text-slate-300">/ {!loading ? displayedProducts.length : '…'} modelů</span></p>{(activeCategory || hasAdvancedFilter) && <button onClick={() => { setActiveCategory(null); setHeightFilter('all'); setInstallFilter('all'); setSearch(''); }} className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-900"><X size={13}/> Vymazat filtry</button>}</div>

          {loading ? <div className="flex justify-center py-24"><Loader size={24} className="animate-spin text-slate-300" /></div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">{displayedProducts.map((p, i) => <ProductCard key={p.id} product={p} i={i} />)}{displayedProducts.length === 0 && <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center"><p className="text-slate-900 font-medium">Pro toto zadání jsme nenašli vhodný model.</p><p className="mt-2 text-sm text-slate-400">Navrhneme řešení na míru vašemu prostoru.</p><Link to="/poptavka" className="mt-5 inline-flex rounded-full bg-slate-950 px-6 py-3 text-xs font-bold text-white">Vyžádat cenovou nabídku</Link></div>}</div>}
        </div>
      </section>

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
                  <h4 className="text-slate-900 mb-2 text-base [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-semibold">{seg.label}</h4>
                  <p className="text-slate-400 leading-relaxed text-sm">{seg.desc}</p>
                </motion.div>);

            })}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="p-6 md:p-10 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[hsl(var(--secondary))]">
          <div>
            <p className="font-mono tracking-widest uppercase mb-2 text-lg text-[hsl(var(--background))]">NOVÝ KATALOG - KOLEKCE 2026</p>
            <h3 className="text-slate-900 [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] text-3xl font-semibold">Celá kolekce mlžítek v jednom PDF.</h3>
            <p className="text-sm mt-1 text-[hsl(var(--background))]">Technické listy, výkresy, ceníky a referenční fotografie všech modelů mlžítek.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="mailto:obchod1@holmtec.cz?subject=Katalog 2026 — zaslat PDF"
            className="py-3.5 border border-slate-300 text-slate-900 text-sm font-medium rounded-full hover:bg-slate-100 transition-all whitespace-nowrap btn-metallic-mist px-7">Zaslat katalog na e-mail

            </a>
            <Link to="/kontakt"
            className="px-7 py-3.5 text-sm font-bold rounded-full hover:bg-slate-800 transition-all whitespace-nowrap bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">Popsat projekt

            </Link>
          </div>
        </div>
      </div>
    </div>);

}