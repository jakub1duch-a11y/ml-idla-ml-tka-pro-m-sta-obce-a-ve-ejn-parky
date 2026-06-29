import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const catalogLinks = [
  { label: 'Mlžné sochy', path: '/kolekce' },
  { label: 'Mlhoviště', path: '/mlhoviste' },
  { label: 'Jak to funguje', path: '/jak-to-funguje' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setCatalogOpen(false); }, [location]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-ink/95 backdrop-blur-lg border-b border-white/10 shadow-lg shadow-black/30' : 'bg-transparent'}`}>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <svg width="22" height="28" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 2 C11 2 2 12 2 18 C2 23.5 6 26.5 11 26.5 C16 26.5 20 23.5 20 18 C20 12 11 2 11 2Z" fill="#22d3ee" fillOpacity="0.9"/>
            <path d="M7 19 C7 21.5 8.8 23 11 23" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
          </svg>
          <span style={{fontFamily: "'DM Sans', sans-serif", fontWeight: 300, letterSpacing: '-0.03em'}} className="text-white text-lg leading-none">
            mlzidla<span className="text-cyan">.cz</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {/* Katalog dropdown */}
          <div className="relative" onMouseEnter={() => setCatalogOpen(true)} onMouseLeave={() => setCatalogOpen(false)}>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all">
              Katalog <ChevronDown size={14} className={`transition-transform ${catalogOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {catalogOpen && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full left-0 mt-1 w-52 bg-card_bg border border-white/10 rounded-xl shadow-xl shadow-black/40 overflow-hidden">
                  {catalogLinks.map(l => (
                    <Link key={l.path} to={l.path} className="block px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all">
                      {l.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/kolekce" className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all">Reference</Link>
          <Link to="/o-nas" className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all">O nás</Link>
          <Link to="/kontakt" className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all">Kontakt</Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/kontakt"
            className="flex items-center gap-2 px-5 py-2 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/25">
            ✦ Poptávka
          </Link>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-2">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-ink/98 border-t border-white/10 overflow-hidden">
            <div className="px-6 py-6 flex flex-col gap-4">
              {catalogLinks.map(link => (
                <Link key={link.path} to={link.path} className="text-sm text-white/70 hover:text-white transition-colors py-1">
                  {link.label}
                </Link>
              ))}
              <Link to="/kolekce" className="text-sm text-white/70 hover:text-white transition-colors py-1">Reference</Link>
              <Link to="/o-nas" className="text-sm text-white/70 hover:text-white transition-colors py-1">O nás</Link>
              <Link to="/kontakt" className="text-sm text-white/70 hover:text-white transition-colors py-1">Kontakt</Link>
              <Link to="/kontakt" className="mt-2 px-6 py-3 bg-cyan text-ink text-sm font-bold rounded-full text-center">
                ✦ Poptávka
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}