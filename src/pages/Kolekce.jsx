import React, { useState, useEffect } from 'react';
import KolekceHero from '@/components/kolekce/KolekceHero';
import CategorySelector from '@/components/kolekce/CategorySelector';
import FeaturesBenefitsSection from '@/components/kolekce/FeaturesBenefitsSection';
import LiveDemoSection from '@/components/kolekce/LiveDemoSection';
import GatesSlider from '@/components/kolekce/GatesSlider';
import AccessoriesRow from '@/components/kolekce/AccessoriesRow';
import CollectionMainInfoSection from '@/components/kolekce/CollectionMainInfoSection';
import ProductsShowcaseSlider from '@/components/kolekce/ProductsShowcaseSlider';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trees, Landmark, Building2, Home, Users, Warehouse, Baby, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO, SEO_PAGES } from '@/lib/seo';

// ─── KATEGORIE ─────────────────────────────────────────────────────────────

const categoryGroups = [
{
  id: 'sochy',
  label: 'Mlžné sochy',
  icon: Trees,
  tagline: 'Přírodní tvary. Živá atmosféra.',
  description: 'Mlžné sochy jsou skulpturální instalace mlžítek inspirované přírodou — stromy, mraky, listy, větve. Kombinují vizuální zážitek s funkčním ochlazením. Ideální tam, kde chcete víc než technologii: chcete dominantu místa.',
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
  description: 'Mlžné brány a portály vytváří dramatický vstupní zážitek — zákazník nebo návštěvník doslova prochází zdí mlhy. Architektonicky čisté linie mlžítka z nerezové oceli, přizpůsobitelné šíři a výšce průchodu.',
  audience: ['Organizátoři eventů a festivalů', 'Hotely a resort vstupní zóny', 'Obchodní centra a showroomy', 'Sportovní areály'],
  usecases: ['Vstup na festival nebo event', 'Hotelový vstupní portál', 'Výstavní stánky a expozice', 'VIP zóny a červené koberce'],
  accent: 'text-sky-700 bg-sky-50 border-sky-200',
  dbCategories: ['URBAN ART'],
  slugKeywords: ['aura', 'linear', 'Y-ARMIST', 'Spirála', 'BENDY']
}];


const audienceSegments = [
{ icon: Building2, label: 'Města a obce', desc: 'Městské ochlazení náměstí, parků a veřejných prostranství. Dotační programy dostupné.' },
{ icon: Users, label: 'Eventy a festivaly', desc: 'Pronájem nebo zakoupení mlžítek a mlžných instalací. Rychlá montáž a přenosnost.' },
{ icon: Home, label: 'Rezidenční', desc: 'Mlžítka zahradní pro soukromé zahrady, terasy, wellness hotely, restaurační zahrádky... Individuální návrh a diskrétní mlžná instalace.' },
{ icon: Warehouse, label: 'Průmysl a logistika', desc: 'Ochlazení pracovišť, skladů a výrobních hal. Zvýšení produktivity a BOZP.' },
{ icon: Baby, label: 'Školy a hřiště', desc: 'Bezpečné mlžítka - mlžná hřiště pro děti. Certifikované materiály, bez chemie, potravinářská nerez.' }];


export default function Kolekce() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const ACCESSORY_CATEGORY_ID = '6a5119a4abdfd991c476d9fc';
  const accessoryProducts = products.filter((p) => p.category_id === ACCESSORY_CATEGORY_ID);

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO SLIDER ── */}
      <KolekceHero />

      {/* ── KATEGORIE (hover icon cards) ── */}
      <CategorySelector groups={categoryGroups} activeCategory={activeCategory} onSelect={setActiveCategory} />

      {/* ── HLAVNÍ INFORMACE ── */}
      <CollectionMainInfoSection />

      {/* ── DYNAMICKÝ SLIDER PRODUKTŮ ── */}
      <ProductsShowcaseSlider />

      {/* ── VLASTNOSTI A VÝHODY ── */}
      <FeaturesBenefitsSection />

      {/* ── ODKAZ NA CELÝ KATALOG ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20 text-center border-t border-slate-100">
        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Chcete vidět úplně vše?</p>
        <h3 className="font-heading font-light text-2xl lg:text-3xl text-slate-900 mb-6">Kompletní katalog mlžítek a mlžných bran na jednom místě.</h3>
        <Link to="/katalog"
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all">
          Zobrazit celý katalog <ArrowRight size={15} />
        </Link>
      </div>

      {/* ── PŘÍSLUŠENSTVÍ ── */}
      <AccessoriesRow products={accessoryProducts} />

      {/* ── MLŽNÉ BRÁNY (GATE, LINEA) ── */}
      <GatesSlider />

      {/* ── ŽIVÁ UKÁZKA ── */}
      <LiveDemoSection />

      {/* ── PRO KOHO ── */}
      <div className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Pro koho jsou mlžítka a mlžné systémy určeny</p>
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
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
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
              Nezávazná rychlá poptávka
            </Link>
          </div>
        </div>
      </div>
    </div>);

}