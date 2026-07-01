import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight, Settings2, Layers, Package, Building2, Trees, Waves, Palette, Tent, Factory, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MEGA_COLUMNS = [
{
  heading: 'Typy a modely',
  icon: Layers,
  items: [
  { label: 'Mlžící brány & portály', sub: 'Vstupní mlžné prvky', path: '/kolekce' },
  { label: 'Sloupy a stojany', sub: 'Samostatné mlžné prvky', path: '/kolekce' },
  { label: 'Mlžné sochy', sub: 'Skulpturální instalace', path: '/kolekce' }]

},
{
  heading: 'Zakázková výroba',
  icon: Settings2,
  items: [
  { label: 'Mlžiště a mlžné zóny', sub: 'Plošné ochlazení prostoru', path: '/mlhoviste' },
  { label: 'Interaktivní prvky', sub: 'Kombinované mlžné instalace', path: '/mlhoviste' }]

},
{
  heading: 'Příslušenství & Moduly',
  icon: Package,
  items: [
  { label: 'Trysky HolmTec', sub: 'AISI 316L, 10–50 μm', path: '/kolekce' },
  { label: 'Smart moduly', sub: 'Řízení a automatizace', path: '/jak-to-funguje' },
  { label: 'Komponenty', sub: 'Čerpadla, filtry, hadice', path: '/kolekce' }]

}];


const USAGE_LINKS = [
{ icon: Building2, label: 'Města a obce', sub: 'Náměstí, pěší zóny, MHD', path: '/kategorie/mesta-obce', color: 'text-cyan' },
{ icon: Trees, label: 'Parky a hřiště', sub: 'Parky, dětská hřiště', path: '/kategorie/parky-hriste', color: 'text-emerald-400' },
{ icon: Waves, label: 'Koupaliště & aquaparky', sub: 'Rekreační oblasti, pláže', path: '/kategorie/koupaliste', color: 'text-blue-400' },
{ icon: Palette, label: 'Pro architekty', sub: 'CAD/BIM, zakázkový design', path: '/kategorie/architekti', color: 'text-violet-400' },
{ icon: Factory, label: 'Komerční prostory', sub: 'Restaurace, OC, výrobní haly', path: '/kategorie/komercni', color: 'text-amber-400' },
{ icon: Tent, label: 'Eventy & festivaly', sub: 'Mobilní mlžítka, pronájem', path: '/kategorie/eventy', color: 'text-rose-400' }];


export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);
  const location = useLocation();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {setMobileOpen(false);setMegaOpen(false);}, [location]);

  const openMega = () => {clearTimeout(timeoutRef.current);setMegaOpen(true);};
  const closeMega = () => {timeoutRef.current = setTimeout(() => setMegaOpen(false), 150);};

  return (
    <>
      {/* Announcement bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-cyan text-ink text-[11px] font-mono font-medium tracking-widest flex items-center justify-center gap-6 px-4 h-8 hidden">
        <span className="flex items-center gap-1.5">☀️ LÉTO 2026</span>
        <span className="hidden sm:inline text-ink/60">·</span>
        <Link to="/poptavka" className="hidden sm:inline text-ink hover:text-ink/70 transition-colors">
          Nezávazná konzultace zdarma →
        </Link>
      </div>

      <header className={`fixed top-8 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled ?
      'bg-[#0a0c0f]/95 backdrop-blur-xl border-b border-white/8 shadow-2xl shadow-black/50' :
      'bg-transparent'}`
      }>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <svg width="20" height="25" viewBox="0 0 22 28" fill="none">
              <path d="M11 2 C11 2 2 12 2 18 C2 23.5 6 26.5 11 26.5 C16 26.5 20 23.5 20 18 C20 12 11 2 11 2Z" fill="#22d3ee" fillOpacity="0.95" />
              <path d="M7 19 C7 21.5 8.8 23 11 23" stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
            </svg>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, letterSpacing: '-0.04em' }} className="text-white text-[17px] leading-none">
              mlzidla<span className="text-cyan font-medium">.cz</span>
            </span>
          </Link>

          {/* Desktop nav — centered pill style */}
          <nav className="hidden lg:flex items-center gap-0.5 bg-white/6 backdrop-blur-sm border border-white/10 rounded-full px-2 py-1.5">
            {/* Katalog megamenu */}
            <div className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
              <button className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${
              megaOpen ? 'bg-white/15 text-white' : 'text-white/75 hover:text-white hover:bg-white/10'}`
              }>
                Katalog <ChevronDown size={13} className={`transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <Link to="/mlhoviste" className="px-4 py-1.5 rounded-full text-[13px] font-medium text-white/75 hover:text-white hover:bg-white/10 transition-all">Mlžiště</Link>
            <Link to="/kategorie/eventy" className="px-4 py-1.5 rounded-full text-[13px] font-medium text-white/75 hover:text-white hover:bg-white/10 transition-all">Pronájem</Link>
            <Link to="/reference" className="px-4 py-1.5 rounded-full text-[13px] font-medium text-white/75 hover:text-white hover:bg-white/10 transition-all">Reference</Link>
            <Link to="/blog" className="px-4 py-1.5 rounded-full text-[13px] font-medium text-white/75 hover:text-white hover:bg-white/10 transition-all">Blog & novinky</Link>
            <Link to="/podpora" className="px-4 py-1.5 rounded-full text-[13px] font-medium text-white/75 hover:text-white hover:bg-white/10 transition-all">Podpora</Link>
          </nav>

          {/* CTA right */}
          <div className="hidden lg:flex items-center gap-2">
            <Link to="/o-nas" className="px-4 py-2 text-[13px] text-white/60 hover:text-white transition-colors">O nás</Link>
            <Link to="/poptavka"
            className="flex items-center gap-1.5 px-5 py-2 bg-cyan text-ink text-[13px] font-bold rounded-full hover:bg-cyan/85 transition-all shadow-lg shadow-cyan/30">
              ✦ Poptávka
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-white p-2">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mega menu panel */}
        <AnimatePresence>
          {megaOpen &&
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
            className="absolute top-full left-0 right-0 bg-[#0d1117]/98 backdrop-blur-2xl border-b border-white/10 shadow-2xl shadow-black/70">
            
              <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
                {/* Top: 3 columns */}
                <div className="grid grid-cols-3 gap-8 pb-8 border-b border-white/8">
                  {MEGA_COLUMNS.map((col) =>
                <div key={col.heading}>
                      <div className="flex items-center gap-2 mb-5">
                        <col.icon size={13} className="text-cyan/70" />
                        <p className="text-[10px] font-mono text-white/35 tracking-[0.2em] uppercase">{col.heading}</p>
                      </div>
                      <div className="space-y-0.5">
                        {col.items.map((item) =>
                    <Link key={item.label} to={item.path}
                    className="group flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/6 transition-colors">
                            <div>
                              <span className="text-[13px] text-white/80 group-hover:text-white transition-colors font-medium leading-snug block">{item.label}</span>
                              <span className="text-[11px] text-white/30 mt-0.5 block">{item.sub}</span>
                            </div>
                            <ArrowRight size={12} className="text-white/20 group-hover:text-cyan transition-colors opacity-0 group-hover:opacity-100" />
                          </Link>
                    )}
                      </div>
                    </div>
                )}
                </div>

                {/* Bottom: Využití */}
                <div className="pt-6">
                  <p className="text-[10px] font-mono text-white/25 tracking-[0.2em] uppercase mb-4">Mlžítka podle využití</p>
                  <div className="grid grid-cols-6 gap-2">
                    {USAGE_LINKS.map((link) =>
                  <Link key={link.label} to={link.path}
                  className="group flex flex-col items-start gap-2 px-3 py-3 rounded-xl hover:bg-white/6 transition-colors border border-transparent hover:border-white/8">
                        <link.icon size={18} className={`${link.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                        <div>
                          <p className="text-[12px] text-white/70 group-hover:text-white transition-colors font-medium leading-tight">{link.label}</p>
                          <p className="text-[10px] text-white/30 mt-0.5 leading-tight">{link.sub}</p>
                        </div>
                      </Link>
                  )}
                  </div>
                </div>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen &&
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed inset-0 z-30 bg-[#0a0c0f] pt-20 overflow-y-auto lg:hidden">
          
            <div className="px-6 py-6 flex flex-col gap-1">
              <button onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)}
            className="flex items-center justify-between text-sm text-white/70 hover:text-white transition-colors py-3 border-b border-white/8">
                Katalog <ChevronDown size={14} className={`transition-transform ${mobileCatalogOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileCatalogOpen &&
            <div className="pl-4 flex flex-col gap-1 py-3 border-b border-white/8">
                  <p className="text-[10px] font-mono text-white/30 tracking-widest uppercase mt-1 mb-2">Modely</p>
                  <Link to="/kolekce" className="text-sm text-white/60 hover:text-white py-1.5">Mlžné sochy & brány</Link>
                  <Link to="/mlhoviste" className="text-sm text-white/60 hover:text-white py-1.5">Mlžiště</Link>
                  <Link to="/jak-to-funguje" className="text-sm text-white/60 hover:text-white py-1.5">Smart moduly</Link>
                  <p className="text-[10px] font-mono text-white/30 tracking-widest uppercase mt-3 mb-2">Podle využití</p>
                  {USAGE_LINKS.map((l) =>
              <Link key={l.path} to={l.path} className="text-sm text-white/60 hover:text-white py-1.5">{l.label}</Link>
              )}
                </div>
            }
              {[
            { label: 'Mlžiště', path: '/mlhoviste' },
            { label: 'Reference', path: '/reference' },
            { label: 'Blog & novinky', path: '/blog' },
            { label: 'Podpora', path: '/podpora' },
            { label: 'O nás', path: '/o-nas' },
            { label: 'Kontakt', path: '/kontakt' }].
            map((l) =>
            <Link key={l.path} to={l.path} className="text-sm text-white/70 hover:text-white transition-colors py-3 border-b border-white/8">{l.label}</Link>
            )}
              <Link to="/poptavka" className="mt-4 px-6 py-3.5 bg-cyan text-ink text-sm font-bold rounded-full text-center">
                ✦ Poptávka
              </Link>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}