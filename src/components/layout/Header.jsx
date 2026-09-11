import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import MobileMenu from '@/components/layout/MobileMenu';
import MegaCatalogMenu from '@/components/layout/MegaCatalogMenu';
import NavDropdown from '@/components/layout/NavDropdown';
import { PRODUCT_LINKS, CUSTOM_LINK, USAGE_GROUPS, USAGE_LINKS, B2G_LINKS, INFO_LINKS } from '@/components/layout/navData';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const location = useLocation();
  const timeoutRef = useRef(null);
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

  useEffect(() => { setMobileOpen(false); setMegaOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const openMega = () => { clearTimeout(timeoutRef.current); setMegaOpen(true); };
  const closeMega = () => { timeoutRef.current = setTimeout(() => setMegaOpen(false), 150); };

  return (
    <>
      <header className={`fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-gradient-to-r from-primary via-slate-800 to-hydro/90 text-white backdrop-blur-xl transition-all duration-500 ease-out ${headerVisible || mobileOpen ? 'translate-y-0' : '-translate-y-full'} ${scrolled ? 'shadow-2xl shadow-primary/25' : 'shadow-sm'}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6 lg:gap-8 lg:px-8">

          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <Logo size="sm" />
          </Link>

          <nav className="mx-auto hidden flex-1 items-center justify-center gap-0.5 lg:flex">
            <div className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
              <button onClick={() => setMegaOpen((open) => !open)} aria-expanded={megaOpen}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-2.5 text-sm font-medium transition-all xl:px-5 ${megaOpen ? 'bg-white/15 text-white' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
                <span className="whitespace-nowrap">Produkty</span> <ChevronDown size={14} className={`transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            <NavDropdown label="Mlžné zóny" links={USAGE_LINKS} width="w-80" />
            <NavDropdown label="Pro města" links={B2G_LINKS} width="w-80" />
            <Link to="/reference" className="whitespace-nowrap rounded-full px-3.5 py-2.5 text-sm font-medium text-white/85 transition-all hover:bg-white/10 hover:text-white xl:px-5">Reference</Link>
            <NavDropdown label="Informace" links={INFO_LINKS} />
            <Link to="/kontakt" className="whitespace-nowrap rounded-full px-3.5 py-2.5 text-sm font-medium text-white/85 transition-all hover:bg-white/10 hover:text-white xl:px-5">Kontakt</Link>
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:gap-3">
            <div className="hidden items-center gap-2 lg:flex">
              <Link to="/o-nas" className="hidden whitespace-nowrap rounded-full px-3.5 py-2.5 text-sm font-medium text-white/85 transition-all hover:bg-white/10 hover:text-white xl:inline-flex xl:px-5">O společnosti</Link>
              <Link to="/poptavka" className="btn-metallic-mist px-6 py-2.5 text-sm font-bold">POPTAT CENU</Link>
            </div>
            <Link to="/poptavka" className="whitespace-nowrap rounded-full bg-accent px-5 py-2.5 text-[11px] font-bold text-accent-foreground lg:hidden">Popsat projekt</Link>
            <button onClick={() => { setMobileOpen(!mobileOpen); setMegaOpen(false); }} aria-label={mobileOpen ? 'Zavřít menu' : 'Otevřít menu'}
              className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden">
              {mobileOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>

        <MegaCatalogMenu open={megaOpen} onEnter={openMega} onLeave={closeMega} onNavigate={() => setMegaOpen(false)}
          collections={PRODUCT_LINKS} usageGroups={USAGE_GROUPS} b2gLinks={B2G_LINKS} customLink={CUSTOM_LINK} />
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        productLinks={PRODUCT_LINKS}
        usageGroups={USAGE_GROUPS}
        b2gLinks={B2G_LINKS}
        infoLinks={INFO_LINKS}
        customLink={CUSTOM_LINK} />
    </>
  );
}