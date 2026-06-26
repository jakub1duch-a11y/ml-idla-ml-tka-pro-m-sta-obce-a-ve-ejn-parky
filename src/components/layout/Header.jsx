import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOGO_URL = "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6c8de7824_generated_8389a653.png";

const navLinks = [
  { label: 'Katalog', path: '/katalog' },
  { label: 'Služby', path: '/#sluzby' },
  { label: 'O nás', path: '/#o-nas' },
  { label: 'Kontakt', path: '/#kontakt' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleNavClick = (path) => {
    if (path.startsWith('/#')) {
      const id = path.slice(2);
      if (location.pathname === '/') {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = path;
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-steel/30'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-16 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-3">
          <img src={LOGO_URL} alt="mlziste.cz logo" className="h-10 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) =>
            link.path.startsWith('/#') ? (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className="text-sm font-medium tracking-wide text-tectonic/70 hover:text-hydro transition-colors uppercase"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium tracking-wide text-tectonic/70 hover:text-hydro transition-colors uppercase"
              >
                {link.label}
              </Link>
            )
          )}
          <Link
            to="/#kontakt"
            onClick={() => handleNavClick('/#kontakt')}
            className="ml-4 px-6 py-2.5 bg-hydro text-white text-sm font-medium tracking-wide rounded-sm hover:bg-hydro/90 transition-colors"
          >
            Poptat Projekt
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-tectonic"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-steel/30 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) =>
                link.path.startsWith('/#') ? (
                  <button
                    key={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className="text-left text-base font-medium text-tectonic/80 hover:text-hydro transition-colors uppercase tracking-wide"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-base font-medium text-tectonic/80 hover:text-hydro transition-colors uppercase tracking-wide"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <button
                onClick={() => handleNavClick('/#kontakt')}
                className="mt-2 px-6 py-3 bg-hydro text-white text-sm font-medium tracking-wide rounded-sm text-center"
              >
                Poptat Projekt
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}