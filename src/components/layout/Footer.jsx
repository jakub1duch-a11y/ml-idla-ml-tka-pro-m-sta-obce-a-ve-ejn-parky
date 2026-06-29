import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ink border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <svg width="20" height="26" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 2 C11 2 2 12 2 18 C2 23.5 6 26.5 11 26.5 C16 26.5 20 23.5 20 18 C20 12 11 2 11 2Z" fill="#22d3ee" fillOpacity="0.9"/>
                <path d="M7 19 C7 21.5 8.8 23 11 23" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
              </svg>
              <span style={{fontFamily: "'DM Sans', sans-serif", fontWeight: 300, letterSpacing: '-0.03em'}} className="text-white text-lg leading-none">
                mlzidla<span className="text-cyan">.cz</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-6">
              Zakázkové mlžné sochy z nerezové oceli AISI 304. Od návrhu přes výrobu až po instalaci. Trutnov, Česká republika.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/mlzne_sochy" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-cyan/20 hover:text-cyan text-white/50 transition-all">
                <Instagram size={16} />
              </a>
              <a href="https://www.facebook.com/Mlznesochy" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-cyan/20 hover:text-cyan text-white/50 transition-all">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          <div>
            <p className="text-white text-xs font-mono tracking-widest uppercase mb-4">Produkty</p>
            <div className="flex flex-col gap-3">
              <Link to="/kolekce" className="text-sm text-white/50 hover:text-cyan transition-colors">Mlžné sochy</Link>
              <Link to="/mlhoviste" className="text-sm text-white/50 hover:text-cyan transition-colors">Mlhoviště</Link>
              <Link to="/jak-to-funguje" className="text-sm text-white/50 hover:text-cyan transition-colors">Jak to funguje</Link>
              <Link to="/kontakt" className="text-sm text-white/50 hover:text-cyan transition-colors">Pronájem</Link>
              <Link to="/o-nas" className="text-sm text-white/50 hover:text-cyan transition-colors">O nás</Link>
              <a href="mailto:obchod1@holmtec.cz?subject=Katalog 2026" className="text-sm text-white/50 hover:text-cyan transition-colors">Katalog 2026 PDF</a>
            </div>
          </div>

          <div>
            <p className="text-white text-xs font-mono tracking-widest uppercase mb-4">Kontakt</p>
            <div className="flex flex-col gap-3">
              <a href="tel:+420774700390" className="flex items-center gap-2 text-sm text-white/50 hover:text-cyan transition-colors">
                <Phone size={13} /> +420 774 700 390
              </a>
              <a href="mailto:obchod1@holmtec.cz" className="flex items-center gap-2 text-sm text-white/50 hover:text-cyan transition-colors">
                <Mail size={13} /> obchod1@holmtec.cz
              </a>
              <div className="flex items-center gap-2 text-sm text-white/50">
                <MapPin size={13} /> Trutnov, Česká republika
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3">
          <p className="text-xs text-white/30">© {new Date().getFullYear()} HolmTec s.r.o. Všechna práva vyhrazena.</p>
          <p className="text-xs text-white/20 font-mono">HOLMTEC · MLŽNÉ SOCHY · NEREZOVÁ OCEL</p>
        </div>
      </div>
    </footer>
  );
}