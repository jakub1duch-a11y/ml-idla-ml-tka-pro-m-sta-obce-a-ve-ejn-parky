import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Menu, Phone, X } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import HeaderNav from '@/components/layout/HeaderNav';
import MobileMenu from '@/components/layout/MobileMenu';
import { playSoundEffect } from '@/lib/soundEffects';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => {setMobileOpen(false);}, [location]);
  useEffect(() => {const update = () => setScrolled(window.scrollY > 16);update();window.addEventListener('scroll', update, { passive: true });return () => window.removeEventListener('scroll', update);}, []);
  useEffect(() => {document.body.style.overflow = mobileOpen ? 'hidden' : '';return () => {document.body.style.overflow = '';};}, [mobileOpen]);
  useEffect(() => {const onClick = (event) => {if (event.target.closest('.btn-metallic-mist')) playSoundEffect();};document.addEventListener('click', onClick);return () => document.removeEventListener('click', onClick);}, []);
  return <><header className={`fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 backdrop-blur-xl transition-shadow duration-200 bg-[#112946] ${scrolled ? 'shadow-[0_8px_30px_rgba(15,23,42,.06)]' : ''}`}><div className="mx-auto flex h-[72px] max-w-[1600px] items-center gap-4 px-5 xl:px-8"><div className="flex shrink-0 self-stretch items-center"><Logo size="sm" /></div><HeaderNav /><div className="ml-auto flex items-center gap-2"><a href="tel:+420774700390" className="hidden 2xl:inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50">Zavolejte nám</a><a href="tel:+420774700390" aria-label="Zavolejte nám" className="flex h-11 w-11 items-center justify-center text-slate-700 xl:hidden"><Phone size={20} /></a><a href="/poptavka" aria-label="Vyžádat cenovou nabídku" className="flex h-11 w-11 items-center justify-center text-cyan xl:hidden"><Mail size={20} /></a><button onClick={() => setMobileOpen((value) => !value)} aria-label={mobileOpen ? 'Zavřít menu' : 'Otevřít menu'} className="flex h-11 w-11 items-center justify-center text-slate-800 xl:hidden">{mobileOpen ? <X size={23} /> : <Menu size={23} />}</button></div></div></header><MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} /></>;
}