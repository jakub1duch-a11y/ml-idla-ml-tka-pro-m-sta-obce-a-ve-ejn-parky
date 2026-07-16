import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import HeaderNav from '@/components/layout/HeaderNav';
import MobileMenu from '@/components/layout/MobileMenu';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  useEffect(() => { setMobileOpen(false); }, [location]);
  useEffect(() => { document.body.style.overflow = mobileOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [mobileOpen]);
  return <><header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10"><div className="h-16 max-w-[1600px] mx-auto px-5 xl:px-8 flex items-center gap-4"><Link to="/" className="shrink-0 flex items-center bg-black px-3 py-0"><Logo size="sm" /></Link><HeaderNav /><button onClick={() => setMobileOpen((value) => !value)} aria-label={mobileOpen ? 'Zavřít menu' : 'Otevřít menu'} className="ml-auto lg:hidden w-11 h-11 flex items-center justify-center text-white">{mobileOpen ? <X size={23} /> : <Menu size={23} />}</button></div></header><MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} /></>;
}