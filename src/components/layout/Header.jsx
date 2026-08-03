import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight, Layers, Building2, Trees, Waves, Palette, Tent, Factory, Flower2, Sparkles, Baby, HelpCircle, Cpu, ShieldCheck, Wrench, Download, Newspaper, Calculator, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/layout/Logo';
import MobileMenu from '@/components/layout/MobileMenu';
import MegaCatalogMenu from '@/components/layout/MegaCatalogMenu';

const PRODUCT_LINKS = [
{ label: 'Všechny produkty', sub: 'Kompletní katalog MLŽIDLA®', path: '/mlzidla-mlzitka#catalog', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/cfc837b23_image.png', featured: true },
{ label: 'Městská kolekce', sub: 'Města a veřejný prostor', path: '/kolekce/city', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/da0942c09_mlzidla-mlzitka-pro-mesta-obce.png' },
{ label: 'Zahradní kolekce', sub: 'Zahrady a terasy', path: '/kolekce/garden', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/b94c771e1_a982a794f_mlzitkosteblo.jpg', crop: 'garden' },
{ label: 'Autorská kolekce', sub: 'Instalace na míru', path: '/kolekce/art', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/68953132b_IMG_3524.jpg' },
{ label: 'Pronájem GO', sub: 'Eventy a festivaly', path: '/pronajem', textOnly: true }];


const CUSTOM_LINK = { label: 'Zakázková výroba', sub: 'Kombinace mlžítek — mlžiště na míru', path: '/poptavka' };


const USAGE_LINKS = [
{ icon: Building2, label: 'Města a obce', path: '/kategorie/mesta-obce', color: 'text-cyan' },
{ icon: Trees, label: 'Parky a hřiště', path: '/kategorie/parky-hriste', color: 'text-secondary' },
{ icon: Waves, label: 'Koupaliště a aquaparky', path: '/kategorie/koupaliste', color: 'text-secondary' },
{ icon: Flower2, label: 'Rezidenční zahrady a terasy', path: '/kategorie/outdoor-zahrady', color: 'text-accent' },
{ icon: Sparkles, label: 'Autorské instalace', path: '/kategorie/art-instalace', color: 'text-accent' },
{ icon: Baby, label: 'Školy a školky', path: '/kategorie/skoly-skolky-deti', color: 'text-secondary' },
{ icon: Palette, label: 'Pro architekty', path: '/kategorie/architekti', color: 'text-secondary' },
{ icon: Factory, label: 'Gastro, wellness a hotely', path: '/kategorie/komercni', color: 'text-accent' },
{ icon: Tent, label: 'Eventy a festivaly', path: '/kategorie/eventy', color: 'text-secondary' }];


const INFO_LINKS = [
{ icon: Palette, label: 'Brand identity', path: '/brand-identity' },
{ icon: Calculator, label: 'Kalkulačka provozních nákladů', path: '/kalkulacka' },
{ icon: HelpCircle, label: 'Nejčastější dotazy', path: '/podpora' },
{ icon: Cpu, label: 'Technologie', path: '/technologie' },
{ icon: ShieldCheck, label: 'Výhody', path: '/vyhody' },
{ icon: Wrench, label: 'Servis a údržba', path: '/servis-udrzba' },
{ icon: ShieldCheck, label: 'Ochrana zdraví', path: '/ochrana-zdravi' },
{ icon: Download, label: 'Ke stažení a manuály', path: '/ke-stazeni' },
{ icon: PlayCircle, label: 'Videa a živé ukázky', path: '/blog?sekce=videa' }];


export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const location = useLocation();
  const timeoutRef = useRef(null);
  const infoTimeoutRef = useRef(null);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 24);
      setHeaderVisible(currentY < lastScrollYRef.current || currentY < 24);
      lastScrollYRef.current = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
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
      





      

      <header className={`fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-gradient-to-r from-primary via-slate-800 to-hydro/90 text-white backdrop-blur-xl transition-all duration-500 ease-out ${headerVisible || mobileOpen ? 'translate-y-0' : '-translate-y-full'} ${scrolled ? 'shadow-2xl shadow-primary/25' : 'shadow-sm'}`}>
        <div className="flex items-center justify-between max-w-7xl lg:px-8 mx-auto gap-4 lg:gap-8 px-6 h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center opacity-100 gap-2.5 shrink-2">
            <Logo size="sm" />
          </Link>

          {/* Desktop nav — centered elegant style */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center mx-auto">
            {/* Katalog megamenu */}
            <div className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
              <button onClick={() => setMegaOpen((open) => !open)} aria-expanded={megaOpen} className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              megaOpen ? 'bg-white/15 text-white' : "text-white/85 hover:text-white hover:bg-white/10"}`
              }>
                Katalog <ChevronDown size={14} className={`transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <Link to="/reference" className="px-5 py-2.5 rounded-full text-sm font-medium transition-all text-white/85 hover:text-white hover:bg-white/10">Reference</Link>
            <Link to="/blog" className="px-5 py-2.5 rounded-full text-sm font-medium transition-all text-white/85 hover:text-white hover:bg-white/10">Blog & novinky</Link>
            <div className="relative" onMouseEnter={openInfo} onMouseLeave={closeInfo}>
              <button className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              infoOpen ? 'bg-white/15 text-white' : "text-white/85 hover:text-white hover:bg-white/10"}`
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
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-72 bg-primary/95 text-white backdrop-blur-2xl border border-white/15 shadow-xl shadow-primary/30 rounded-2xl p-3">
                  {INFO_LINKS.map((link) =>
                  <Link key={link.label} to={link.path} onClick={() => setInfoOpen(false)}
                  className="group flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/10 transition-colors">
                      <link.icon size={16} className="text-accent group-hover:text-white transition-colors flex-shrink-0" />
                      <p className="text-sm text-white/80 group-hover:text-white transition-colors">{link.label}</p>
                    </Link>
                  )}
                  </motion.div>
                }
              </AnimatePresence>
            </div>
            <Link to="/kontakt" className="px-5 py-2.5 rounded-full text-sm font-medium transition-all text-white/85 hover:text-white hover:bg-white/10">Kontakt</Link>
          </nav>

          {/* CTA right + mobile toggle */}
          <div className="flex items-center gap-2 lg:gap-3 ml-auto">
            <div className="hidden lg:flex items-center gap-2">
              <Link to="/o-nas" className="px-5 py-2.5 text-sm font-medium rounded-full transition-all text-white/85 hover:text-white hover:bg-white/10">O společnosti</Link>
              <Link to="/poptavka"
              className="btn-metallic-mist px-6 py-2.5 text-sm font-bold">
                Popsat projekt
              </Link>
            </div>
            <Link to="/poptavka" className="lg:hidden whitespace-nowrap rounded-full bg-primary text-[11px] font-bold text-primary-foreground mr-5 pt-2 pb-2 pr-8 pl-8">Popsat projekt</Link>
            <button onClick={toggleMobileMenu} aria-label={mobileOpen ? 'Zavřít menu' : 'Otevřít menu'} className="lg:hidden flex items-center justify-center w-10 h-10 -mr-2 rounded-full text-white hover:bg-white/10 transition-colors">
              {mobileOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>

        <MegaCatalogMenu open={megaOpen} onEnter={openMega} onLeave={closeMega} onNavigate={() => setMegaOpen(false)} collections={PRODUCT_LINKS} uses={USAGE_LINKS} customLink={CUSTOM_LINK} />
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