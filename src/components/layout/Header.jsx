import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight, Layers, Building2, Trees, Waves, Palette, Tent, Factory, Flower2, Sparkles, Baby, HelpCircle, Cpu, ShieldCheck, Wrench, Download, Newspaper, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/layout/Logo';
import MobileMenu from '@/components/layout/MobileMenu';

const PRODUCT_LINKS = [
{ label: 'AURA', sub: 'Zahradní mlžítko', path: '/produkt/aura', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/91ce94feb_MlzitkoAURA.JPG' },
{ label: 'BENDY 60', sub: 'Zakřivené mlžítko', path: '/produkt/bendy-60', image: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/c6442bcbc_bendy60-mlitkozahradn.png' },
{ label: 'Y-ARMIST TR60', sub: 'Y-tvarový systém', path: '/produkt/y-armist-tr60', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3063e3653_MlzitkoY-ARMISTTR60_3.png' },
{ label: 'GATE70', sub: 'Mlžná brána', path: '/produkt/gate70', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/17e1fc843_MlznabranaGATE70U.png' },
{ label: 'LINEA CE70', sub: 'Linkové mlžítko', path: '/produkt/linea-el70', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/82914bed5_C-MlzitkoLINEA_CE70_couple1.png' },
{ label: 'Mlžný mrak', sub: 'Mlžná socha', path: '/produkt/mrak', image: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/84805a215_mlnprvek-mrak-mlzidla02.png' },
{ label: 'Lízátko', sub: 'Mlžná socha', path: '/produkt/Lizatko', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9c4797da7_01D04E88-89AB-44FB-9989-C97F3B40E100.png' },
{ label: 'Mlžný strom — OSTREV', sub: 'Mlžná socha', path: '/produkt/ostrev-mlzitko', image: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/fb4164f66_ostev4.png' },
{ label: 'Mlžná spirála', sub: 'Mlžná socha', path: '/produkt/spirala', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/df5b375c0_Mlzitko-spirala2.png' }];

const CUSTOM_LINK = { label: 'Zakázková výroba', sub: 'Kombinace mlžítek — mlžiště na míru', path: '/poptavka' };


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
{ icon: HelpCircle, label: 'Nejčastější dotazy', path: '/podpora' },
{ icon: Cpu, label: 'Technologie', path: '/technologie' },
{ icon: ShieldCheck, label: 'Výhody', path: '/vyhody' },
{ icon: Wrench, label: 'Servis a údržba', path: '/servis-udrzba' },
{ icon: ShieldCheck, label: 'Ochrana zdraví', path: '/ochrana-zdravi' },
{ icon: Download, label: 'Ke stažení a manuály', path: '/ke-stazeni' }];


export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const location = useLocation();
  const timeoutRef = useRef(null);
  const infoTimeoutRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {setMobileOpen(false);setMegaOpen(false);setInfoOpen(false);}, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {document.body.style.overflow = '';};
  }, [mobileOpen]);

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
      





      

      <header className="fixed top-0 left-0 right-0 transition-all z-50 bg-slate-900/70 backdrop-blur-xl border-b border-white/10 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl lg:px-8 mx-auto gap-4 lg:gap-8 px-6 h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center opacity-100 gap-2.5 shrink-2">
            <Logo size="sm" />
          </Link>

          {/* Desktop nav — centered elegant style */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center mx-auto">
            {/* Katalog megamenu */}
            <div className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
              <button className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              megaOpen ? 'bg-white/15 text-white' : "text-white/90 hover:text-white hover:bg-white/10"}`
              }>
                Katalog <ChevronDown size={14} className={`transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <Link to="/reference" className="px-5 py-2.5 rounded-full text-sm font-medium transition-all text-white/90 hover:text-white hover:bg-white/10">Reference</Link>
            <Link to="/blog" className="px-5 py-2.5 rounded-full text-sm font-medium transition-all text-white/90 hover:text-white hover:bg-white/10">Blog & novinky</Link>
            <div className="relative" onMouseEnter={openInfo} onMouseLeave={closeInfo}>
              <button className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              infoOpen ? 'bg-white/15 text-white' : "text-white/90 hover:text-white hover:bg-white/10"}`
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
            <Link to="/kontakt" className="px-5 py-2.5 rounded-full text-sm font-medium transition-all text-white/90 hover:text-white hover:bg-white/10">Kontakt</Link>
          </nav>

          {/* CTA right + mobile toggle */}
          <div className="flex items-center gap-2 lg:gap-3 ml-auto">
            <div className="hidden lg:flex items-center gap-2">
              <Link to="/o-nas" className="px-5 py-2.5 text-sm font-medium rounded-full transition-all text-white/80 hover:text-white hover:bg-white/10">O společnosti</Link>
              <Link to="/poptavka"
              className="btn-metallic-mist px-6 py-2.5 text-sm font-bold">
                Poptávka
              </Link>
            </div>
            <button onClick={toggleMobileMenu} aria-label={mobileOpen ? 'Zavřít menu' : 'Otevřít menu'} className="lg:hidden flex items-center justify-center w-11 h-11 -mr-2 rounded-full text-white hover:bg-white/10 transition-colors">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
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
            
              <div className="max-w-6xl mx-auto px-5 lg:px-8 py-7 grid grid-cols-1 lg:grid-cols-[0.7fr_1.3fr] gap-8">
                {/* Left: B2B usage segments — compact list */}
                <div>
                  <p className="text-xs font-bold text-slate-400 tracking-[0.2em] uppercase mb-3">B2B využití</p>
                  <div className="flex flex-col gap-0.5">
                    {USAGE_LINKS.map((link) =>
                  <Link key={link.label} to={link.path} onClick={(e) => e.stopPropagation()}
                  className="group flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <link.icon size={15} className={`${link.color} opacity-80 group-hover:opacity-100 transition-opacity shrink-0`} />
                        <p className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors font-light leading-tight">{link.label}</p>
                      </Link>
                  )}
                  </div>
                  <div className="flex flex-col gap-1.5 mt-4 pt-4 border-t border-slate-100">
                    <Link to="/katalog" onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900">
                      Všechny produkty a mlžítka <ArrowRight size={14} />
                    </Link>
                    <Link to="/mlzidla-mlzitka" onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-900">
                      Celá kolekce <ArrowRight size={14} />
                    </Link>
                    <Link to="/produkt/gate70" onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                      Mlžné brány a portály <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Right: Products — expanded grid */}
                <div className="lg:border-l lg:border-slate-100 lg:pl-8">
                  <p className="text-xs font-bold text-slate-400 tracking-[0.2em] uppercase mb-4">Produkty</p>
                  <div className="grid grid-cols-4 gap-3 max-h-[320px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {PRODUCT_LINKS.map((p) =>
                  <Link key={p.path} to={p.path} onClick={(e) => e.stopPropagation()}
                  className="group flex flex-col gap-2">
                        <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
                          <img src={p.image} alt={p.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        </div>
                        <div>
                          <p className="font-heading text-xs text-slate-800 group-hover:text-slate-950 transition-colors font-medium leading-tight">{p.label}</p>
                          <p className="text-[11px] text-slate-500 leading-tight">{p.sub}</p>
                        </div>
                      </Link>
                  )}
                  </div>
                  <Link to={CUSTOM_LINK.path} onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-3 mt-4 px-3 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                    <Sparkles size={16} className="text-slate-500 flex-shrink-0" />
                    <div>
                      <p className="font-heading text-xs text-slate-800 font-medium leading-tight">{CUSTOM_LINK.label}</p>
                      <p className="text-[11px] text-slate-500 leading-tight">{CUSTOM_LINK.sub}</p>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </header>

      {/* Mobile menu — compact floating panel, not full screen */}
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        productLinks={PRODUCT_LINKS}
        usageLinks={USAGE_LINKS}
        infoLinks={INFO_LINKS}
        customLink={CUSTOM_LINK} />

    </>);

}