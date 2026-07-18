import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import HeaderNav from '@/components/layout/HeaderNav';
import MobileMenu from '@/components/layout/MobileMenu';
import SoundToggle from '@/components/layout/SoundToggle';
import { playSoundEffect } from '@/lib/soundEffects';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => { setMobileOpen(false); }, [location]);
  useEffect(() => { const update = () => setScrolled(window.scrollY > 16); update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update); }, []);
  useEffect(() => { document.body.style.overflow = mobileOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [mobileOpen]);
  useEffect(() => { const onClick = (event) => { if (event.target.closest('.btn-metallic-mist')) playSoundEffect(); }; document.addEventListener('click', onClick); return () => document.removeEventListener('click', onClick); }, []);
  return <><header className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[hsl(var(--foreground))] backdrop-blur-xl ${scrolled ? 'shadow-xl shadow-slate-950/25' : ''}`}><div className="mx-auto flex h-[72px] max-w-[1600px] items-center gap-4 px-5 xl:px-8"><div className="flex shrink-0 self-stretch items-center"><Logo size="sm" /></div><HeaderNav /><div className="ml-auto flex items-center"><SoundToggle /><button onClick={() => setMobileOpen((value) => !value)} aria-label={mobileOpen ? 'Zavřít menu' : 'Otevřít menu'} className="flex h-11 w-11 items-center justify-center text-white xl:hidden">{mobileOpen ? <X size={23} /> : <Menu size={23} />}</button></div></div></header><MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} /></>;
}