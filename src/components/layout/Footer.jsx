import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="mb-5 flex items-center gap-2">
              <svg width="20" height="26" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 2 C11 2 2 12 2 18 C2 23.5 6 26.5 11 26.5 C16 26.5 20 23.5 20 18 C20 12 11 2 11 2Z" fill="#0f172a" fillOpacity="0.9" />
                <path d="M7 19 C7 21.5 8.8 23 11 23" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
              </svg>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, letterSpacing: '-0.03em' }} className="text-slate-900 text-lg leading-none">
                mlzidla<span className="text-slate-400">.cz</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-7 font-light">
              Zakázkové mlžné sochy z nerezové oceli AISI 304. Od návrhu přes výrobu až po instalaci. Trutnov, Česká republika.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/mlzne_sochy" target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-full border border-slate-200 hover:border-slate-900 hover:text-slate-900 text-slate-400 transition-all">
                <Instagram size={16} />
              </a>
              <a href="https://www.facebook.com/Mlznesochy" target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-full border border-slate-200 hover:border-slate-900 hover:text-slate-900 text-slate-400 transition-all">
                <Facebook size={16} />
              </a>
            </div>
          </div>

          <div>
            <p className="text-slate-900 text-xs tracking-widest uppercase mb-5 font-medium">Katalog</p>
            <div className="flex flex-col gap-3">
              <Link to="/mlzidla-mlzitka" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Mlžítka a mlžné brány</Link>
              <Link to="/mlhoviste" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Mlhoviště</Link>
              <Link to="/jak-to-funguje" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Jak to funguje</Link>
              <Link to="/o-nas" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">O nás</Link>
              
            </div>
          </div>

          <div>
            <p className="text-slate-900 text-xs tracking-widest uppercase mb-5 font-medium">Kontakt</p>
            <div className="flex flex-col gap-3">
              <a href="tel:+420774700390" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
                <Phone size={13} /> +420 774 700 390
              </a>
              <a href="mailto:obchod1@holmtec.cz" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
                <Mail size={13} /> obchod1@holmtec.cz
              </a>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <MapPin size={13} /> Trutnov, 54102, Horní staré město 698, Česká republika
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between gap-3 items-center">
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} HolmTec s.r.o. Všechna práva vyhrazena.</p>
          <div className="flex items-center gap-4">
            <Link to="/gdpr" className="text-xs text-slate-400 hover:text-slate-900 transition-colors">Ochrana osobních údajů (GDPR)</Link>
            <span className="text-slate-200">·</span>
            <Link to="/gdpr" className="text-xs text-slate-400 hover:text-slate-900 transition-colors">Cookies</Link>
            <span className="text-slate-200">·</span>
            <Link to="/podpora" className="text-xs text-slate-400 hover:text-slate-900 transition-colors">Podpora</Link>
          </div>
        </div>
      </div>
    </footer>);

}