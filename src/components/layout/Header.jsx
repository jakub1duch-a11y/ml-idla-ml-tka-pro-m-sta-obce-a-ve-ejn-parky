import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight, Settings2, Layers, Package, Building2, Trees, Waves, Palette, Tent, Factory, Zap, Flower2, Sparkles, Baby } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MistNozzleIcon from '@/components/layout/MistNozzleIcon';

const MEGA_COLUMNS = [
{
  heading: 'Mlžítka a mlžné brány',
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
{ icon: Flower2, label: 'Outdoor a zahrady', sub: 'Soukromé zahrady, terasy', path: '/kategorie/outdoor-zahrady', color: 'text-green-400' },
{ icon: Sparkles, label: 'Art instalace na míru', sub: 'Umělecké mlžné projekty', path: '/kategorie/art-instalace', color: 'text-fuchsia-400' },
{ icon: Baby, label: 'Školy, školky a děti', sub: 'Bezpečné mlžení pro děti', path: '/kategorie/skoly-skolky-deti', color: 'text-sky-400' },
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
      





      

      <header className={`fixed top-0 left-0 right-0 transition-all z-40 duration-1200 bg-white/10 ${
      scrolled ? "backdrop-blur-xl border-slate-200 shadow-sm" : "bg-black/30 backdrop-blur-sm"}`
      }>
        <div className="flex items-center justify-between max-w-7xl lg:px-8 mx-auto gap-4 lg:gap-8 px-6 h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center opacity-100 gap-2.5 shrink-2">
            <motion.div
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.8, ease: 'easeOut' }}
              className="flex items-center gap-2.5">
              <MistNozzleIcon color={scrolled ? '#0f172a' : '#ffffff'} accent="#40a2d4" />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, letterSpacing: '0.06em' }} className={`no-underline not-italic [font-family:'Urbanist',_sans-serif] text-left leading-none text-2xl font-bold transition-colors duration-500 normal-case ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                mlzidla<span className="[font-family:'Urbanist',_sans-serif] text-xl normal-case px-1 font-medium text-[#40a2d4]" style={{ letterSpacing: '0.06em' }}>.cz</span>
              </span>
            </motion.div>
          </Link>

          {/* Desktop nav — centered elegant style */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center mx-auto">
            {/* Katalog megamenu */}
            <div className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
              <button className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              megaOpen ? 'bg-slate-100 text-slate-900' : scrolled ? "text-slate-700 hover:text-slate-900 hover:bg-slate-100" : "text-white/90 hover:text-white hover:bg-white/10"}`
              }>
                Katalog <ChevronDown size={14} className={`transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <Link to="/reference" className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${scrolled ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>Reference</Link>
            <Link to="/blog" className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${scrolled ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>Blog & novinky</Link>
            <Link to="/podpora" className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${scrolled ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' : 'text-white/90 hover:text-white hover:bg-white/10'}`}>Podpora</Link>
          </nav>

          {/* CTA right + mobile toggle */}
          <div className="flex items-center gap-2 lg:gap-3 ml-auto">
            <div className="hidden lg:flex items-center gap-2">
              <Link to="/o-nas" className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all ${scrolled ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>O nás</Link>
              <Link to="/poptavka"
              className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all">
                Poptávka
              </Link>
            </div>
            <button onClick={toggleMobileMenu} className={`lg:hidden p-2 -mr-2 transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
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
                <div className="grid grid-cols-3 gap-6 pb-8 border-b border-slate-100">
                  {MEGA_COLUMNS.map((col) =>
                <Link key={col.heading} to={col.path} className="group block p-2 rounded-lg hover:bg-slate-50 transition-colors" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2.5 mb-4">
                        <col.icon size={14} className="text-slate-600 group-hover:text-slate-900 transition-colors" />
                        <p className="font-heading text-base text-slate-800 group-hover:text-slate-950 transition-colors font-light tracking-tight leading-snug">{col.heading}</p>
                        <ArrowRight size={14} className="text-slate-400 group-hover:text-slate-950 transition-colors opacity-0 group-hover:opacity-100 ml-auto" />
                      </div>
                      <div className="rounded-xl overflow-hidden aspect-[16/10] bg-white shadow-sm group-hover:shadow-md transition-shadow">
                        <img src={col.image} alt={col.heading} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    </Link>
                )}
                </div>

                {/* Bottom: Využití */}
                <div className="pt-8">
                  <p className="text-xs font-bold text-slate-400 tracking-[0.2em] uppercase mb-5">Podle využití</p>
                  <div className="grid grid-cols-3 gap-3">
                    {USAGE_LINKS.map((link) =>
                  <Link key={link.label} to={link.path} onClick={(e) => e.stopPropagation()}
                  className="group flex flex-col items-start gap-3 px-4 py-4 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                        <link.icon size={20} className={`${link.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                        <div>
                          <p className="font-heading text-sm text-slate-800 group-hover:text-slate-950 transition-colors font-light leading-tight">{link.label}</p>
                          <p className="text-xs text-slate-500 mt-1 leading-tight">{link.sub}</p>
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
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-40 bg-white pt-20 overflow-y-auto lg:hidden">
          
            <div className="px-5 py-6 flex flex-col gap-0 max-w-2xl">
              <button onClick={() => setMobileCatalogOpen(!mobileCatalogOpen)}
            className="flex items-center justify-between text-base font-bold text-slate-900 hover:bg-slate-50 transition-colors py-4 px-4 rounded-lg border-b border-slate-100">
                 Katalog <ChevronDown size={18} className={`transition-transform duration-150 ${mobileCatalogOpen ? 'rotate-180' : ''}`} />
               </button>
              {mobileCatalogOpen &&
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="pl-0 flex flex-col gap-0 py-4 bg-slate-50 rounded-lg mt-2">
                 <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mt-2 mb-3 px-6">Modely</p>
                 <Link to="/mlzidla-mlzitka" onClick={() => setMobileOpen(false)} className="text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-white py-4 px-6 transition-colors">Mlžítka a mlžné brány</Link>
                 <Link to="/prislusenstvi" onClick={() => setMobileOpen(false)} className="text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-white py-4 px-6 transition-colors">Příslušenství</Link>
                 <Link to="/jak-to-funguje" onClick={() => setMobileOpen(false)} className="text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-white py-4 px-6 transition-colors">Smart moduly</Link>
                 <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mt-5 mb-3 px-6">Podle využití</p>
                 {USAGE_LINKS.map((l) =>
              <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)} className="text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-white py-4 px-6 transition-colors">{l.label}</Link>
              )}
               </motion.div>
            }
              {[
            { label: 'Reference', path: '/reference' },
            { label: 'Blog & novinky', path: '/blog' },
            { label: 'Podpora', path: '/podpora' },
            { label: 'O nás', path: '/o-nas' },
            { label: 'Kontakt', path: '/kontakt' }].
            map((l) =>
            <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)} className="text-base font-medium text-slate-900 hover:bg-slate-50 transition-colors py-4 px-6 border-b border-slate-100">{l.label}</Link>
            )}
              <Link to="/poptavka" onClick={() => setMobileOpen(false)} className="mt-8 mb-6 px-6 py-4 bg-slate-900 text-white text-base font-bold rounded-full text-center hover:bg-slate-800 transition-colors">
                Poptávka
              </Link>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}