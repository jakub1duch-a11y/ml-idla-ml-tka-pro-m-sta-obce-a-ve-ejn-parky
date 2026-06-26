import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Trees, Landmark, Flame, Building2, Home, Users, Warehouse, Baby } from 'lucide-react';

// ─── KATEGORIE ─────────────────────────────────────────────────────────────

const categoryGroups = [
  {
    id: 'sochy',
    label: 'Mlžné sochy',
    icon: Trees,
    tagline: 'Přírodní tvary. Živá atmosféra.',
    description:
      'Mlžné sochy jsou skulpturální instalace inspirované přírodou — stromy, mraky, listy, větve. Kombinují vizuální zážitek s funkčním ochlazením. Ideální tam, kde chcete víc než technologii: chcete dominantu místa.',
    audience: ['Architekti a krajinní designéři', 'Správci měst a náměstí', 'Eventy a festivaly', 'Resorty a wellness'],
    usecases: ['Městská náměstí a parky', 'Vstupní prostory hotelů', 'Open-air eventy', 'Soukromé zahrady a vily'],
    accentColor: 'from-emerald-500/20 to-cyan/10',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    products: ['ostev', 'mrak', 'volavka', 'kids'],
  },
  {
    id: 'brany',
    label: 'Mlžné brány a portály',
    icon: Landmark,
    tagline: 'Vstup skrze mlhu. Nezapomenutelný moment.',
    description:
      'Brány a portály z mlhy vytváří dramatický vstupní zážitek — zákazník nebo návštěvník doslova prochází zdí mlhy. Architektonicky čisté linie z nerezové oceli, přizpůsobitelné šíři a výšce průchodu.',
    audience: ['Organizátoři eventů a festivalů', 'Hotely a resort vstupní zóny', 'Obchodní centra a showroomy', 'Sportovní areály'],
    usecases: ['Vstup na festival nebo event', 'Hotelový vstupní portál', 'Výstavní stánky a expozice', 'VIP zóny a červené koberce'],
    accentColor: 'from-cyan/20 to-blue-500/10',
    borderColor: 'border-cyan/30',
    textColor: 'text-cyan',
    products: ['gate60', 'aura'],
  },
  {
    id: 'mlhoviste',
    label: 'Mlhoviště a chladicí zóny',
    icon: Flame,
    tagline: 'Až −9 °C. Komfort bez kompromisů.',
    description:
      'Systémy pro plošné ochlazení otevřených prostorů — terasy, hřiště, sportovní zázemí, průmyslové prostory. Průmyslové čerpadlo s tlakem 70 bar rozptyluje mikro-kapičky 5–10 µm, které se okamžitě odpaří a ochlazují vzduch bez pocitu mokra.',
    audience: ['Provozovatelé restaurací a kaváren', 'Obce a správci veřejných ploch', 'Průmyslové a logistické provozovny', 'Školy a mateřské školy'],
    usecases: ['Letní terasy restaurací', 'Dětská hřiště a školní dvorky', 'Sportovní tribuny a venkovní fitness', 'Sklady a výrobní haly s tepelnou zátěží'],
    accentColor: 'from-orange-500/20 to-yellow-500/10',
    borderColor: 'border-orange-500/30',
    textColor: 'text-orange-400',
    products: ['aura', 'linea'],
  },
];

// ─── PRODUKTY ───────────────────────────────────────────────────────────────

const products = [
  {
    slug: 'ostev',
    id: 'ostev',
    name: 'OSTEV',
    type: 'Mlžná socha',
    tagline: 'Strom z mlhy. Dominanta náměstí.',
    desc: 'Skulptura ve tvaru stromu s integrovaným mlžením. Výška 2,5–4 m. Zakázková výroba dle projektu.',
    spec: 'AISI 316L',
    new: true,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
  },
  {
    slug: 'mrak',
    id: 'mrak',
    name: 'MRAK',
    type: 'Mlžná socha',
    tagline: 'Organické křivky. Nebeský dotek.',
    desc: 'Stilizovaný mrak z nerezové trubky TR40×3 mm s 5 tryskami. Zavěšení nebo stojanová varianta.',
    spec: 'AISI 304',
    new: false,
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/60a14cfc6_43d83e0c0_unnamed-9.png',
  },
  {
    slug: 'volavka',
    id: 'volavka',
    name: 'VOLAVKA',
    type: 'Mlžná socha',
    tagline: 'Elegance pro soukromé zahrady.',
    desc: 'Subtilní mlžítko s elegantně zahnutým ramenem TR60. Oblouk 120°. Mobilní varianta se zemním vrutem.',
    spec: 'AISI 304',
    new: false,
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/1035553df_FB_IMG_1782148329157.jpg',
  },
  {
    slug: 'kids',
    id: 'kids',
    name: 'KIDS',
    type: 'Mlžná socha',
    tagline: 'Hravý tvar. Bezpečná mlha.',
    desc: 'Mlžné sochy pro dětská hřiště. Bez ostrých hran, hladké svary, potravinářská nerez AISI 316L.',
    spec: 'AISI 316L',
    new: false,
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/8139fde88_7fc9b4e64_mlzitko_upraveno_Z09_3544_zmenseno.jpg',
  },
  {
    slug: 'gate60',
    id: 'gate60',
    name: 'GATE 60',
    type: 'Mlžná brána',
    tagline: 'Vstupní portál z mlhy.',
    desc: 'Třímetrová mlžná brána z trubek TR60×3. Šíře 3 m, výška 2,1 m. 5 trysky, tlak 70 bar.',
    spec: 'AISI 304',
    new: false,
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/fbcf274b1_FB_IMG_1782148331764.jpg',
  },
  {
    slug: 'aura',
    id: 'aura',
    name: 'AURA',
    type: 'Mlžný kruh / portál',
    tagline: 'Kruh z mlhy. Centrum každého prostoru.',
    desc: 'Nerezový prsten ∅80–160 cm s 8 tryskami po obvodu. Symetrický halo efekt pro parky a náměstí.',
    spec: 'AISI 304',
    new: false,
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9c4797da7_01D04E88-89AB-44FB-9989-C97F3B40E100.png',
  },
  {
    slug: null,
    id: 'linea',
    name: 'LINEA EL70',
    type: 'Chladicí systém',
    tagline: 'Minimalistická čistota. Maximální efekt.',
    desc: 'Systém mlžení z čtvercového profilu 70×70×3 mm. Pro terasy, haly a průmyslové ochlazení.',
    spec: 'AISI 304',
    new: false,
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/c90bbf42d_C-MltkoLINEA_CE70_single-1.png',
  },
];

// ─── AUDIENCE CARDS ─────────────────────────────────────────────────────────

const audienceSegments = [
  { icon: Building2, label: 'Města a obce', desc: 'Ochlazení náměstí, parků a veřejných prostranství. Dotační programy dostupné.' },
  { icon: Users, label: 'Eventy a festivaly', desc: 'Pronájem nebo zakoupení mlžných instalací. Rychlá montáž a přenosnost.' },
  { icon: Home, label: 'Rezidenční', desc: 'Soukromé zahrady, terasy a wellness. Individuální návrh a diskrétní instalace.' },
  { icon: Warehouse, label: 'Průmysl a logistika', desc: 'Ochlazení pracovišť, skladů a výrobních hal. Zvýšení produktivity a BOZP.' },
  { icon: Baby, label: 'Školy a hřiště', desc: 'Bezpečné mlžení pro děti. Certifikované materiály, bez chemie, potravinářská nerez.' },
];

// ─── PRODUCT CARD ────────────────────────────────────────────────────────────

function ProductCard({ p, i }) {
  return (
    <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
      <Link to={p.slug ? `/produkt/${p.slug}` : '/kontakt'}
        className="group block bg-card_bg rounded-2xl overflow-hidden border border-white/10 hover:border-cyan/40 transition-all duration-300 h-full">
        <div className="aspect-[4/3] overflow-hidden relative">
          <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {p.new && (
            <span className="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-mono tracking-widest uppercase px-2 py-1 rounded-full">
              Novinka
            </span>
          )}
        </div>
        <div className="p-6">
          <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-2">{p.type}</p>
          <h3 className="text-xl font-normal text-white mb-1">{p.name}</h3>
          <p className="text-sm text-white/50 mb-3">{p.tagline}</p>
          <p className="text-xs text-white/30 leading-relaxed mb-4">{p.desc}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-white/30 bg-white/5 px-2 py-1 rounded-lg">{p.spec}</span>
            <div className="flex items-center gap-1 text-xs text-cyan font-medium">
              Detail <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────

export default function Kolekce() {
  const [activeCategory, setActiveCategory] = useState(null);

  const activeGroup = categoryGroups.find(g => g.id === activeCategory);
  const displayedProducts = activeGroup
    ? products.filter(p => activeGroup.products.includes(p.id))
    : products;

  return (
    <div className="min-h-screen bg-ink pt-28">

      {/* ── HERO ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">KATALOG SYSTÉMŮ</p>
          <h1 className="font-heading font-light text-4xl lg:text-6xl text-white tracking-tight mb-4">
            Mlžné systémy<br /><span className="text-white/40">pro každý prostor.</span>
          </h1>
          <p className="text-white/50 max-w-xl text-lg leading-relaxed">
            Od skulpturálních soch přes vstupní portály až po plošné chladicí zóny. Zakázková výroba z nerezové oceli, navržená přesně pro váš projekt.
          </p>
        </motion.div>
      </div>

      {/* ── KATEGORIE — tři velké bloky ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-6">Vyberte kategorii</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categoryGroups.map((g) => {
            const Icon = g.icon;
            const isActive = activeCategory === g.id;
            return (
              <motion.button
                key={g.id}
                onClick={() => setActiveCategory(isActive ? null : g.id)}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-left p-6 rounded-2xl border transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-br ${g.accentColor} ${g.borderColor}`
                    : 'bg-card_bg border-white/10 hover:border-white/25'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${isActive ? 'bg-white/10' : 'bg-white/5'}`}>
                  <Icon size={20} className={isActive ? g.textColor : 'text-white/40'} />
                </div>
                <p className={`text-xs font-mono tracking-widest uppercase mb-2 ${isActive ? g.textColor : 'text-white/30'}`}>
                  {g.label}
                </p>
                <h3 className="text-lg font-light text-white mb-2">{g.tagline}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{g.description}</p>

                {isActive && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-5 pt-5 border-t border-white/10">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className={`text-[10px] font-mono tracking-widest uppercase mb-2 ${g.textColor}`}>Pro koho</p>
                        <ul className="space-y-1">
                          {g.audience.map(a => (
                            <li key={a} className="text-xs text-white/60 flex items-center gap-2">
                              <span className={`w-1 h-1 rounded-full ${g.textColor} bg-current`} />{a}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className={`text-[10px] font-mono tracking-widest uppercase mb-2 ${g.textColor}`}>Použití</p>
                        <ul className="space-y-1">
                          {g.usecases.map(u => (
                            <li key={u} className="text-xs text-white/60 flex items-center gap-2">
                              <span className={`w-1 h-1 rounded-full ${g.textColor} bg-current`} />{u}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── PRODUKTY ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs font-mono tracking-widest uppercase text-white/30">
            {activeGroup ? `${activeGroup.label} — produkty` : 'Všechny produkty'}
          </p>
          {activeCategory && (
            <button onClick={() => setActiveCategory(null)} className="text-xs text-white/40 hover:text-white transition-colors font-mono">
              × Zobrazit vše
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedProducts.map((p, i) => <ProductCard key={p.id} p={p} i={i} />)}
        </div>
      </div>

      {/* ── PRO KOHO — segmenty publika ── */}
      <div className="border-t border-white/10 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">Pro koho jsou systémy určeny</p>
            <h2 className="font-heading font-light text-3xl lg:text-4xl text-white tracking-tight">
              Řešení pro každé publikum.
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {audienceSegments.map((seg, i) => {
              const Icon = seg.icon;
              return (
                <motion.div key={seg.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  className="p-5 rounded-2xl bg-card_bg border border-white/10 hover:border-cyan/25 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center mb-3">
                    <Icon size={16} className="text-cyan" />
                  </div>
                  <h4 className="text-sm font-normal text-white mb-2">{seg.label}</h4>
                  <p className="text-xs text-white/40 leading-relaxed">{seg.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="p-10 rounded-2xl bg-gradient-to-r from-cyan/10 to-cyan/5 border border-cyan/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-2">Nový katalog 2026</p>
            <h3 className="font-heading font-light text-2xl text-white">Celá kolekce v jednom PDF.</h3>
            <p className="text-sm text-white/40 mt-1">Technické listy, výkresy, ceníky a referenční fotografie všech modelů.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="mailto:obchod1@holmtec.cz?subject=Katalog 2026 — zaslat PDF"
              className="px-7 py-3.5 border border-white/20 text-white text-sm font-medium rounded-full hover:bg-white/10 transition-all whitespace-nowrap">
              Zaslat katalog na e-mail
            </a>
            <Link to="/kontakt"
              className="px-7 py-3.5 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/25 whitespace-nowrap">
              Nezávazná poptávka
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}