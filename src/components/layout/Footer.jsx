import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import { GOOGLE_MAPS_URL } from '@/lib/seo';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 md:gap-8">
          <div className="sm:col-span-2 md:col-span-2">
            <div className="mb-5 inline-block rounded-full px-4 py-2 text-[hsl(var(--popover))]">
              <Logo size="sm" />
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-7 font-light">
              Zakázkové mlžné sochy z nerezové oceli AISI 304. Od návrhu přes výrobu až po instalaci. Trutnov, Česká republika.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/mlzne_sochy" target="_blank" rel="noopener noreferrer" aria-label="Instagram HolmTec"
              className="p-2 rounded-full border border-slate-200 hover:border-slate-900 hover:text-slate-900 text-slate-400 transition-all">
                <Instagram size={16} />
              </a>
              <a href="https://www.facebook.com/Mlznesochy" target="_blank" rel="noopener noreferrer" aria-label="Facebook HolmTec"
              className="p-2 rounded-full border border-slate-200 hover:border-slate-900 hover:text-slate-900 text-slate-400 transition-all">
                <Facebook size={16} />
              </a>
            </div>
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
              <MapPin size={14} /> Najdete nás na Google
            </a>
          </div>

          <div>
            <p className="text-slate-900 text-xs tracking-widest uppercase mb-5 font-medium">Katalog</p>
            <div className="flex flex-col gap-3">
              <Link to="/mlzidla-mlzitka" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Mlžítka a mlžné brány</Link>
              <Link to="/technologie" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Jak to funguje</Link>
              <Link to="/o-nas" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">O společnosti</Link>
            </div>
          </div>

          <div>
            <p className="text-slate-900 text-xs tracking-widest uppercase mb-5 font-medium">Informace</p>
            <div className="flex flex-col gap-3">
              <Link to="/technologie" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Technologie</Link>
              <Link to="/vyhody" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Výhody</Link>
              <Link to="/podpora" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Nejčastější dotazy</Link>
              <Link to="/servis-udrzba" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Servis a údržba</Link>
              <Link to="/ochrana-zdravi" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Ochrana zdraví</Link>
              <Link to="/ke-stazeni" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Ke stažení a manuály</Link>
              <Link to="/obchodni-podminky" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Obchodní podmínky</Link>
              <Link to="/partnerstvi" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Partnerství</Link>
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