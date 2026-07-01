import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight, Settings2, Layers, Package, Building2, Trees, Waves, Palette, Tent, Factory, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MEGA_COLUMNS = [
{
  heading: 'Mlžítka a typy mlžidel',
  icon: Layers,
  path: '/mlzidla-mlzitka',
  image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/a238e2952_Mln_socha_MRKEV_-_msto_Poln.JPG'
},
{
  heading: 'Mlžiště, kombinovaná mlžidla na míru',
  icon: Settings2,
  path: '/mlhoviste',
  image: 'https://media.base44.com/images/public/69f87b0204346ce73cee73b1/dec576b4e_upscaled_7fc9b4e64_mlzitko_upraveno_Z09_3544_zmenseno.jpg'
},
{
  heading: 'Příslušenství a moduly',
  icon: Package,
  path: '/prislusenstvi',
  image: 'https://lh3.googleusercontent.com/d/1PSs-lVCOPnP-faNmq3C6vz26F2_xZepq'
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

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
    setMegaOpen(false);
  };

  const openMega = () => {clearTimeout(timeoutRef.current);setMegaOpen(true);};
  const closeMega = () => {timeoutRef.current = setTimeout(() => setMegaOpen(false), 150);};

  return (
    <>
      {/* Announcement bar */}
      





      

      <header className={`fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl transition-all duration-300 z-40 ${
      scrolled ? 'border-b border-slate-200 shadow-sm' : 'border-b border-transparent'}`
      }>
        <div className="grid grid-cols-2 lg:grid-cols-3 items-center max-w-7xl pr-5 pl-5 h-16 lg:px-8 mx-auto">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 justify-self-start">
            <svg width="20" height="25" viewBox="0 0 22 28" fill="none">
              <path d="M11 2 C11 2 2 12 2 18 C2 23.5 6 26.5 11 26.5 C16 26.5 20 23.5 20 18 C20 12 11 2 11 2Z" fill="#0f172a" fillOpacity="0.92" />
              <path d="M7 19 C7 21.5 8.8 23 11 23" stroke="white" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
            </svg>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, letterSpacing: '-0.04em' }} className="text-slate-900 text-[17px] leading-none">
              mlzidla<span className="text-slate-400 font-medium">.cz</span>
            </span>
          </Link>

          {/* Desktop nav — centered elegant style */}
          <nav className="hidden lg:flex items-center gap-1 justify-self-center">
            {/* Katalog megamenu */}
            <div className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
              <button className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
              megaOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`
              }>
                Katalog <ChevronDown size={13} className={`transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <Link to="/reference" className="px-4 py-2 rounded-full text-[13px] font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all">Reference</Link>
            <Link to="/blog" className="px-4 py-2 rounded-full text-[13px] font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all">Blog & novinky</Link>
            <Link to="/podpora" className="px-4 py-2 rounded-full text-[13px] font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all">Podpora</Link>
          </nav>

          {/* CTA right + mobile toggle */}
          <div className="flex items-center gap-2 justify-self-end">
            <div className="hidden lg:flex items-center gap-2">
              <Link to="/o-nas" className="px-4 py-2 text-[13px] text-slate-500 hover:text-slate-900 transition-colors">O nás</Link>
              <Link to="/poptavka"
              className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 text-white text-[13px] font-medium rounded-full hover:bg-slate-800 transition-all">
                Poptávka
              </Link>
            </div>
            <button onClick={toggleMobileMenu} className="lg:hidden text-slate-900 p-2">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
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
            className="absolute top-full left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-slate-200 shadow-xl shadow-slate-900/10">
            
              <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
                {/* Top: 3 columns */}
                <div className="grid grid-cols-3 gap-8 pb-8 border-b border-slate-100">
                  {MEGA_COLUMNS.map((col) =>
                <Link key={col.heading} to={col.path} className="group block" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2 mb-4">
                        <col.icon size={13} className="text-slate-500" />
                        <p className="font-heading text-[15px] text-slate-800 group-hover:text-slate-950 transition-colors font-light tracking-tight leading-snug">{col.heading}</p>
                        <ArrowRight size={12} className="text-slate-400 group-hover:text-slate-950 transition-colors opacity-0 group-hover:opacity-100 ml-auto" />
                      </div>
                      <div className="rounded-xl overflow-hidden aspect-[16/10] bg-white shadow-sm">
                        <img src={col.image} alt={col.heading} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    </Link>
                )}
                </div>

                {/* Bottom: Využití */}
                <div className="pt-6">
                  <p className="text-[11px] font-light text-slate-500 tracking-[0.2em] uppercase mb-4">Mlžítka podle využití</p>
                  <div className="grid grid-cols-6 gap-2">
                    {USAGE_LINKS.map((link) =>
                  <Link key={link.label} to={link.path} onClick={(e) => e.stopPropagation()}
                  className="group flex flex-col items-start gap-2 px-3 py-3 rounded-xl hover:bg-white/50 transition-colors border border-transparent hover:border-white/40">
                        <link.icon size={18} className={`${link.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                        <div>
                          <p className="font-heading text-[13px] text-slate-800 group-hover:text-slate-950 transition-colors font-light leading-tight">{link.label}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{link.sub}</p>
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
          className="fixed inset-0 z-50 bg-white pt-20 overflow-y-auto lg:hidden">
          
            <div className="px-6 py-6 flex flex-col gap-1">
              <button onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)}
            className="flex items-center justify-between text-sm text-slate-700 hover:text-slate-900 transition-colors py-3 border-b border-slate-100">
                Katalog <ChevronDown size={14} className={`transition-transform ${mobileCatalogOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileCatalogOpen &&
              <div className="pl-4 flex flex-col gap-1 py-3 border-b border-slate-100">
                 <p className="text-[10px] font-medium text-slate-400 tracking-widest uppercase mt-1 mb-2">Modely</p>
                 <Link to="/mlzidla-mlzitka" onClick={() => setMobileOpen(false)} className="text-sm text-slate-500 hover:text-slate-900 py-1.5">Mlžné sochy & brány</Link>
                 <Link to="/prislusenstvi" onClick={() => setMobileOpen(false)} className="text-sm text-slate-500 hover:text-slate-900 py-1.5">Příslušenství</Link>
                 <Link to="/jak-to-funguje" onClick={() => setMobileOpen(false)} className="text-sm text-slate-500 hover:text-slate-900 py-1.5">Smart moduly</Link>
                 <p className="text-[10px] font-medium text-slate-400 tracking-widest uppercase mt-3 mb-2">Podle využití</p>
                 {USAGE_LINKS.map((l) =>
              <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)} className="text-sm text-slate-500 hover:text-slate-900 py-1.5">{l.label}</Link>
              )}
               </div>
              }
              {[
            { label: 'Reference', path: '/reference' },
            { label: 'Blog & novinky', path: '/blog' },
            { label: 'Podpora', path: '/podpora' },
            { label: 'O nás', path: '/o-nas' },
            { label: 'Kontakt', path: '/kontakt' }].
            map((l) =>
            <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)} className="text-sm text-slate-700 hover:text-slate-900 transition-colors py-3 border-b border-slate-100">{l.label}</Link>
            )}
              <Link to="/poptavka" onClick={() => setMobileOpen(false)} className="mt-4 px-6 py-3.5 bg-slate-900 text-white text-sm font-medium rounded-full text-center">
                Poptávka
              </Link>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}