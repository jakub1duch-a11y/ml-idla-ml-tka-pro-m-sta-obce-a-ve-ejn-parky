import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight, Layers, Building2, Trees, Waves, Palette, Tent, Factory, Flower2, Sparkles, Baby, HelpCircle, Cpu, ShieldCheck, Wrench, Download, Newspaper, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MistNozzleIcon from '@/components/layout/MistNozzleIcon';

const PRODUCT_LINKS = [
{ label: 'AURA', sub: 'Zahradní mlžítko', path: '/produkt/aura', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/91ce94feb_MlzitkoAURA.JPG' },
{ label: 'BENDY 60', sub: 'Zakřivené mlžítko', path: '/produkt/bendy-60', image: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/c6442bcbc_bendy60-mlitkozahradn.png' },
{ label: 'Y-ARMIST TR60', sub: 'Y-tvarový systém', path: '/produkt/y-armist-tr60', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3063e3653_MlzitkoY-ARMISTTR60_3.png' },
{ label: 'GATE70', sub: 'Mlžná brána', path: '/produkt/gate70', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/17e1fc843_MlznabranaGATE70U.png' }];


const USAGE_LINKS = [
{ icon: Building2, label: 'Města a obce', path: '/kategorie/mesta-obce', color: 'text-cyan' },
{ icon: Trees, label: 'Parky a hřiště', path: '/kategorie/parky-hriste', color: 'text-emerald-400' },
{ icon: Waves, label: 'Koupaliště & aquaparky', path: '/kategorie/koupaliste', color: 'text-blue-400' },
{ icon: Flower2, label: 'Outdoor a zahrady', path: '/kategorie/outdoor-zahrady', color: 'text-green-400' },
{ icon: Sparkles, label: 'Art instalace na míru', path: '/kategorie/art-instalace', color: 'text-fuchsia-400' },
{ icon: Baby, label: 'Školy a školky', path: '/kategorie/skoly-skolky-deti', color: 'text-sky-400' },
{ icon: Palette, label: 'Pro architekty', path: '/kategorie/architekti', color: 'text-violet-400' },
{ icon: Factory, label: 'Komerční prostory', path: '/kategorie/komercni', color: 'text-amber-400' },
{ icon: Tent, label: 'Eventy & festivaly', path: '/kategorie/eventy', color: 'text-rose-400' }];


const INFO_LINKS = [
{ icon: Calculator, label: 'Kalkulačka provozních nákladů', path: '/kalkulacka' },
{ icon: Cpu, label: 'Technologie', path: '/technologie' },
{ icon: ShieldCheck, label: 'Výhody', path: '/vyhody' },
{ icon: HelpCircle, label: 'FAQ', path: '/faq' },
{ icon: Newspaper, label: 'Novinky', path: '/novinky' },
{ icon: Wrench, label: 'Servis a údržba', path: '/servis-udrzba' },
{ icon: ShieldCheck, label: 'Ochrana zdraví', path: '/ochrana-zdravi' },
{ icon: Download, label: 'Ke stažení', path: '/ke-stazeni' }];


export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false);
  const [mobileInfoOpen, setMobileInfoOpen] = useState(false);
  const location = useLocation();
  const timeoutRef = useRef(null);
  const infoTimeoutRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {setMobileOpen(false);setMegaOpen(false);setInfoOpen(false);}, [location]);

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
    setMegaOpen(false);
  };

  const openMega = () => {clearTimeout(timeoutRef.current);setMegaOpen(true);};
  const closeMega = () => {timeoutRef.current = setTimeout(() => setMegaOpen(false), 150);};
  const openInfo = () => {clearTimeout(infoTimeoutRef.current);setInfoOpen(true);};
  const closeInfo = () => {infoTimeoutRef.current = setTimeout(() => setInfoOpen(false), 150);};

  return (
    <>
      {/* Announcement bar */}
      





      

      <header className={`fixed top-0 left-0 right-0 transition-all z-40 duration-1200 bg-black/80 bg-white/40 ${
      scrolled ? "backdrop-blur-xl border-slate-200 shadow-sm" : "backdrop-blur-sm"}`
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
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, letterSpacing: '0.05em' }} className={`no-underline not-italic [font-family:'Urbanist',_sans-serif] text-left leading-none text-2xl font-bold transition-colors duration-500 uppercase ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                mlžidla<span className="[font-family:'Urbanist',_sans-serif] text-xl normal-case px-1 font-medium text-[#40a2d4]" style={{ letterSpacing: '0.06em' }}>.cz</span>
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
            <div className="relative" onMouseEnter={openInfo} onMouseLeave={closeInfo}>
              <button className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              infoOpen ? 'bg-slate-100 text-slate-900' : scrolled ? "text-slate-700 hover:text-slate-900 hover:bg-slate-100" : "text-white/90 hover:text-white hover:bg-white/10"}`
              }>
                Informace a podpora <ChevronDown size={14} className={`transition-transform duration-200 ${infoOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {infoOpen &&
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-72 bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-xl shadow-slate-900/10 rounded-2xl p-3">
                  {INFO_LINKS.map((link) =>
                  <Link key={link.label} to={link.path} onClick={() => setInfoOpen(false)}
                  className="group flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                      <link.icon size={16} className="text-slate-400 group-hover:text-slate-900 transition-colors flex-shrink-0" />
                      <p className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors font-light">{link.label}</p>
                    </Link>
                  )}
                  </motion.div>
                }
              </AnimatePresence>
            </div>
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
            className="absolute top-full left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-slate-200 shadow-xl shadow-slate-900/10 max-h-[85vh] overflow-y-auto">
            
              <div className="max-w-5xl mx-auto px-5 lg:px-8 py-7 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8">
                {/* Left: B2B usage segments as compact icon chips */}
                <div>
                  <p className="font-heading text-sm font-medium text-slate-800 mb-4">B2B mlžné systémy pro komerční a veřejné využití</p>
                  <div className="grid grid-cols-3 gap-2">
                    {USAGE_LINKS.map((link) =>
                  <Link key={link.label} to={link.path} onClick={(e) => e.stopPropagation()}
                  className="group flex flex-col items-center text-center gap-2 px-2 py-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                        <link.icon size={18} className={`${link.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                        <p className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors font-light leading-tight">{link.label}</p>
                      </Link>
                  )}
                  </div>
                  <Link to="/mlzidla-mlzitka" onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-900 mt-5">
                    Celá kolekce <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Right: Products — small thumbnail slider */}
                <div className="lg:border-l lg:border-slate-100 lg:pl-8">
                  <p className="text-xs font-bold text-slate-400 tracking-[0.2em] uppercase mb-4">Produkty</p>
                  <div className="flex gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                    {PRODUCT_LINKS.map((p) =>
                  <Link key={p.path} to={p.path} onClick={(e) => e.stopPropagation()}
                  className="group shrink-0 w-28 flex flex-col gap-2">
                        <div className="w-28 h-20 rounded-lg overflow-hidden bg-slate-100">
                          <img src={p.image} alt={p.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        </div>
                        <div>
                          <p className="font-heading text-xs text-slate-800 group-hover:text-slate-950 transition-colors font-medium leading-tight">{p.label}</p>
                          <p className="text-[11px] text-slate-500 leading-tight">{p.sub}</p>
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
              className="pl-0 flex flex-col gap-0 py-4 bg-slate-50 rounded-lg mt-2 px-6">
                 <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mt-2 mb-3">Produkty</p>
                 <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
                   {PRODUCT_LINKS.map((p) =>
              <Link key={p.path} to={p.path} onClick={() => setMobileOpen(false)} className="shrink-0 w-24 flex flex-col gap-1.5">
                     <div className="w-24 h-16 rounded-lg overflow-hidden bg-slate-100">
                       <img src={p.image} alt={p.label} className="w-full h-full object-cover" loading="lazy" />
                     </div>
                     <p className="text-xs font-medium text-slate-700 leading-tight">{p.label}</p>
                   </Link>
              )}
                 </div>
                 <Link to="/mlzidla-mlzitka" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-slate-900 mt-4 mb-2">Celá kolekce →</Link>
                 <p className="text-xs font-bold text-slate-400 tracking-widest uppercase mt-4 mb-3">B2B využití</p>
                 <div className="grid grid-cols-3 gap-2 pb-2">
                   {USAGE_LINKS.map((l) =>
              <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)} className="flex flex-col items-center text-center gap-1.5 py-3 px-1 rounded-lg hover:bg-white transition-colors">
                     <l.icon size={18} className={`${l.color} opacity-80`} />
                     <p className="text-[11px] font-medium text-slate-700 leading-tight">{l.label}</p>
                   </Link>
              )}
                 </div>
               </motion.div>
            }
              <button onClick={() => setMobileInfoOpen(!mobileInfoOpen)}
            className="flex items-center justify-between text-base font-bold text-slate-900 hover:bg-slate-50 transition-colors py-4 px-4 rounded-lg border-b border-slate-100">
                 Informace a podpora <ChevronDown size={18} className={`transition-transform duration-150 ${mobileInfoOpen ? 'rotate-180' : ''}`} />
               </button>
              {mobileInfoOpen &&
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-0 py-2 bg-slate-50 rounded-lg mt-2">
                 {INFO_LINKS.map((l) =>
              <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)} className="text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-white py-3 px-6 transition-colors">{l.label}</Link>
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