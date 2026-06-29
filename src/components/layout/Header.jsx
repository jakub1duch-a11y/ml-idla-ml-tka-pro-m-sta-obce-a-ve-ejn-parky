import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, ChevronDown, MapPin } from 'lucide-react';
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
      {/* Ticker bar */}
      <div className="bg-cyan/10 border-b border-cyan/20 py-1.5 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex items-center gap-8 px-4 text-[11px] font-mono text-cyan/80 tracking-widest uppercase">
              <span>☀️ LÉTO 2026</span>
              <span>·</span>
              <span>LÉTO2026 — 10 %</span>
              <span>·</span>
              <span>MRAK2026 — 15 %</span>
              <span>·</span>
              <span>ZAHRADA26 — doprava zdarma</span>
              <span>·</span>
              <Link to="/kontakt" className="text-white hover:text-cyan transition-colors">Soutěž o sochu →</Link>
              <span>·</span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/1684cef95_generated_image.png" alt="mlzidla.cz" className="h-8 w-auto" />
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

          <Link to="/jak-to-funguje" className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all">Instalace</Link>
          <Link to="/poradce" className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all">AI Poradce</Link>
          <Link to="/kontakt" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all">
            <MapPin size={13} /> Instalace
          </Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <ShoppingCart size={18} />
          </button>
          <Link to="/muj-projekt"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all">
            Můj projekt
          </Link>
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
              <Link to="/jak-to-funguje" className="text-sm text-white/70 hover:text-white transition-colors py-1">Instalace</Link>
              <Link to="/muj-projekt" className="text-sm text-cyan hover:text-cyan/80 transition-colors py-1 font-medium">Můj projekt</Link>
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