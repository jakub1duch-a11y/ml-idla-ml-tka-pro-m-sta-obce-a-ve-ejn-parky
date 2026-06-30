import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight, Settings2, Layers, Package, Building2, Trees, Waves, Palette, Tent, Factory } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MEGA_COLUMNS = [
  {
    heading: 'Typy a modely',
    icon: Layers,
    items: [
      { label: 'Mlžící brány', sub: 'Portály a vstupní prvky', path: '/kolekce' },
      { label: 'Sloupy a stojany', sub: 'Samostatné mlžné prvky', path: '/kolekce' },
      { label: 'Mlžné sochy', sub: 'Skulpturální instalace', path: '/kolekce' },
    ],
  },
  {
    heading: 'Zakázková výroba',
    icon: Settings2,
    items: [
      { label: 'Mlžiště a mlžné zóny', sub: 'Plošné ochlazení prostoru', path: '/mlhoviste' },
      { label: 'Interaktivní prvky', sub: 'Kombinované mlžné instalace', path: '/mlhoviste' },
    ],
  },
  {
    heading: 'Příslušenství & Moduly',
    icon: Package,
    items: [
      { label: 'Trysky HolmTec', sub: 'AISI 316L, 10–50 μm', path: '/kolekce' },
      { label: 'Smart moduly', sub: 'Řízení a automatizace', path: '/jak-to-funguje' },
      { label: 'Komponenty', sub: 'Čerpadla, filtry, hadice', path: '/kolekce' },
    ],
  },
];

const USAGE_LINKS = [
  { icon: Building2, label: 'Města a obce', sub: 'Náměstí, pěší zóny, MHD', path: '/kategorie/mesta-obce', color: 'text-cyan' },
  { icon: Trees, label: 'Parky a hřiště', sub: 'Parky, dětská hřiště', path: '/kategorie/parky-hriste', color: 'text-emerald-400' },
  { icon: Waves, label: 'Koupaliště & aquaparky', sub: 'Rekreační oblasti, pláže', path: '/kategorie/koupaliste', color: 'text-blue-400' },
  { icon: Palette, label: 'Pro architekty', sub: 'CAD/BIM, zakázkový design', path: '/kategorie/architekti', color: 'text-violet-400' },
  { icon: Factory, label: 'Komerční prostory', sub: 'Restaurace, OC, výrobní haly', path: '/kategorie/komercni', color: 'text-amber-400' },
  { icon: Tent, label: 'Eventy & festivaly', sub: 'Mobilní mlžítka, pronájem', path: '/kategorie/eventy', color: 'text-rose-400' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);
  const location = useLocation();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setMegaOpen(false); }, [location]);

  const openMega = () => { clearTimeout(timeoutRef.current); setMegaOpen(true); };
  const closeMega = () => { timeoutRef.current = setTimeout(() => setMegaOpen(false), 120); };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-ink/95 backdrop-blur-lg border-b border-white/10 shadow-lg shadow-black/30' : 'bg-transparent'}`}>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <svg width="22" height="28" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 2 C11 2 2 12 2 18 C2 23.5 6 26.5 11 26.5 C16 26.5 20 23.5 20 18 C20 12 11 2 11 2Z" fill="#22d3ee" fillOpacity="0.9"/>
            <path d="M7 19 C7 21.5 8.8 23 11 23" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
          </svg>
          <span style={{fontFamily: "'DM Sans', sans-serif", fontWeight: 300, letterSpacing: '-0.03em'}} className="text-white text-lg leading-none">
            mlzidla<span className="text-cyan">.cz</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {/* Katalog megamenu trigger */}
          <div className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
            <button className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${megaOpen ? 'text-white bg-white/10' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>
              Katalog <ChevronDown size={14} className={`transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {megaOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.18 }}
                  onMouseEnter={openMega}
                  onMouseLeave={closeMega}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[780px] bg-card_bg border border-white/12 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
                >
                  {/* Top: 3 columns */}
                  <div className="grid grid-cols-3 gap-0 divide-x divide-white/8 p-6">
                    {MEGA_COLUMNS.map((col) => (
                      <div key={col.heading} className="px-4 first:pl-0 last:pr-0">
                        <div className="flex items-center gap-2 mb-4">
                          <col.icon size={14} className="text-cyan" />
                          <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">{col.heading}</p>
                        </div>
                        <div className="space-y-1">
                          {col.items.map((item) => (
                            <Link key={item.label} to={item.path}
                              className="group flex flex-col px-3 py-2.5 rounded-lg hover:bg-white/8 transition-colors">
                              <span className="text-sm text-white/80 group-hover:text-white transition-colors font-medium leading-snug">{item.label}</span>
                              <span className="text-xs text-white/35 mt-0.5">{item.sub}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom: Využití */}
                  <div className="border-t border-white/8 bg-black/20 px-6 py-5">
                    <p className="text-[10px] font-mono text-white/30 tracking-widest uppercase mb-3">Mlžítka podle využití</p>
                    <div className="grid grid-cols-3 gap-2">
                      {USAGE_LINKS.map((link) => (
                        <Link key={link.label} to={link.path}
                          className="group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/8 transition-colors">
                          <link.icon size={16} className={`shrink-0 ${link.color}`} />
                          <div>
                            <p className="text-xs text-white/75 group-hover:text-white transition-colors font-medium leading-tight">{link.label}</p>
                            <p className="text-[10px] text-white/35 mt-0.5">{link.sub}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/reference" className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all">Reference</Link>
          <Link to="/blog" className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all">Blog</Link>
          <Link to="/o-nas" className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all">O nás</Link>
          <Link to="/kontakt" className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all">Kontakt</Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/poptavka"
            className="flex items-center gap-2 px-5 py-2 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/25">
            ✦ Poptávka
          </Link>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-2">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-ink/98 border-t border-white/10 overflow-hidden">
            <div className="px-6 py-6 flex flex-col gap-2">
              <button onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)}
                className="flex items-center justify-between text-sm text-white/70 hover:text-white transition-colors py-2">
                Katalog <ChevronDown size={14} className={`transition-transform ${mobileCatalogOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileCatalogOpen && (
                <div className="pl-4 flex flex-col gap-1 mb-2">
                  <p className="text-[10px] font-mono text-white/30 tracking-widest uppercase mt-2 mb-1">Modely</p>
                  <Link to="/kolekce" className="text-sm text-white/60 hover:text-white py-1">Mlžné sochy & brány</Link>
                  <Link to="/mlhoviste" className="text-sm text-white/60 hover:text-white py-1">Mlžiště</Link>
                  <Link to="/jak-to-funguje" className="text-sm text-white/60 hover:text-white py-1">Smart moduly</Link>
                  <p className="text-[10px] font-mono text-white/30 tracking-widest uppercase mt-3 mb-1">Podle využití</p>
                  {USAGE_LINKS.map(l => (
                    <Link key={l.path} to={l.path} className="text-sm text-white/60 hover:text-white py-1">{l.label}</Link>
                  ))}
                </div>
              )}
              <Link to="/reference" className="text-sm text-white/70 hover:text-white transition-colors py-2">Reference</Link>
              <Link to="/blog" className="text-sm text-white/70 hover:text-white transition-colors py-2">Blog & Novinky</Link>
              <Link to="/o-nas" className="text-sm text-white/70 hover:text-white transition-colors py-2">O nás</Link>
              <Link to="/kontakt" className="text-sm text-white/70 hover:text-white transition-colors py-2">Kontakt</Link>
              <Link to="/poptavka" className="mt-2 px-6 py-3 bg-cyan text-ink text-sm font-bold rounded-full text-center">
                ✦ Poptávka
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}