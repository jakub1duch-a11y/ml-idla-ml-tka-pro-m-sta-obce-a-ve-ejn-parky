import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const NAV = [
  { label: 'Domů', path: '/' },
  { label: 'Produkty', path: '/mlzidla-mlzitka' },
  { label: 'Realizace', path: '/reference' },
  { label: 'Kontakt', path: '/kontakt' },
];

export default function Header6() {
  return (
    <header className="fixed top-4 left-4 right-4 lg:top-6 lg:left-8 lg:right-8 z-50">
      <div className="relative max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-3 rounded-full bg-black/60 backdrop-blur-xl border border-white/10">
        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((n) => (
            <Link key={n.path} to={n.path} className="text-sm text-white/70 hover:text-white transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>

        <Link to="/" className="absolute left-1/2 -translate-x-1/2 font-heading font-bold tracking-wide text-white text-sm uppercase hidden sm:block">
          Mlžidla<span className="text-violet-400">.cz</span>
        </Link>
        <Link to="/" className="font-heading font-bold tracking-wide text-white text-sm uppercase sm:hidden">
          Mlžidla<span className="text-violet-400">.cz</span>
        </Link>

        <Link to="/kontakt" className="ml-auto lg:ml-0 inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold rounded-full transition-colors shrink-0">
          Kontaktujte nás <MessageCircle size={14} />
        </Link>
      </div>
    </header>
  );
}