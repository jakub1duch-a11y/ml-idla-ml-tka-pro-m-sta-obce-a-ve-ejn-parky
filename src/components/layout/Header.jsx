import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Kolekce', path: '/kolekce' },
  { label: 'Mlhoviště', path: '/mlhoviste' },
  { label: 'Jak to funguje', path: '/jak-to-funguje' },
  { label: 'Realizace', path: '/#realizace' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const handleAnchor = (path) => {
    if (!path.startsWith('/#')) return;
    const id = path.slice(2);
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = path;
    }
  };

  const isLight = !scrolled && location.pathname === '/';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${scrolled ? 'bg-white/90 backdrop-blur-lg border-b border-steel/30 shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-18 py-5">
        {/* Logo */}
        <Link to="/" className="flex flex-col leading-none">
          <span className={`font-heading text-base font-medium tracking-widest uppercase transition-colors ${isLight ? 'text-white' : 'text-ink'}`}>HolmTec</span>
          <span className={`font-mono text-[10px] tracking-widest uppercase transition-colors ${isLight ? 'text-white/50' : 'text-ink/40'}`}>· Mlžné sochy ·</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link =>
            link.path.startsWith('/#') ? (
              <button key={link.path} onClick={() => handleAnchor(link.path)}
                className={`text-xs font-mono tracking-widest uppercase transition-colors hover:text-hydro ${isLight ? 'text-white/70' : 'text-ink/60'}`}>
                {link.label}
              </button>
            ) : (
              <Link key={link.path} to={link.path}
                className={`text-xs font-mono tracking-widest uppercase transition-colors hover:text-hydro ${isLight ? 'text-white/70' : 'text-ink/60'}`}>
                {link.label}
              </Link>
            )
          )}
          <Link to="/kontakt"
            className={`ml-4 px-6 py-2.5 text-xs font-mono tracking-widest uppercase border transition-all ${isLight ? 'border-white/40 text-white hover:bg-white hover:text-ink' : 'border-ink text-ink hover:bg-ink hover:text-white'}`}>
            Poptávka
          </Link>
        </nav>

        <button onClick={() => setMobileOpen(!mobileOpen)} className={`md:hidden ${isLight ? 'text-white' : 'text-ink'}`}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-steel/30 overflow-hidden">
            <div className="px-6 py-6 flex flex-col gap-5">
              {navLinks.map(link =>
                link.path.startsWith('/#') ? (
                  <button key={link.path} onClick={() => handleAnchor(link.path)}
                    className="text-left text-xs font-mono tracking-widest uppercase text-ink/70 hover:text-hydro transition-colors">
                    {link.label}
                  </button>
                ) : (
                  <Link key={link.path} to={link.path}
                    className="text-xs font-mono tracking-widest uppercase text-ink/70 hover:text-hydro transition-colors">
                    {link.label}
                  </Link>
                )
              )}
              <Link to="/kontakt" className="mt-2 px-6 py-3 bg-ink text-white text-xs font-mono tracking-widest uppercase text-center">
                Poptávka
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}