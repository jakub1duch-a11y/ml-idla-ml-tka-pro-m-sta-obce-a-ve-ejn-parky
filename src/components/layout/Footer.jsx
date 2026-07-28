import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import { GOOGLE_MAPS_URL } from '@/lib/seo';

export default function Footer() {
  return (
    <footer className="border-t bg-slate-950 border-white/20">
      <div className="mx-auto lg:px-8 py-20 px-6 max-w-7x2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 md:gap-8">
          <div className="sm:col-span-2 md:col-span-2">
            <div className="mb-5 inline-block bg-black px-3 py-0">
              <Logo size="sm" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-7 font-light">
              Zakázkové mlžné sochy z nerezové oceli AISI 304. Od návrhu přes výrobu až po instalaci. Trutnov, Česká republika.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/mlzne_sochy" target="_blank" rel="noopener noreferrer" aria-label="Instagram HolmTec"
              className="p-2 rounded-full border border-white/10 hover:border-white hover:text-white text-white/40 transition-all">
                <Instagram size={16} />
              </a>
              <a href="https://www.facebook.com/Mlznesochy" target="_blank" rel="noopener noreferrer" aria-label="Facebook HolmTec"
              className="p-2 rounded-full border border-white/10 hover:border-white hover:text-white text-white/40 transition-all">
                <Facebook size={16} />
              </a>
            </div>
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-5 text-sm text-white/60 hover:text-white transition-colors">
              <MapPin size={14} /> Najdete nás na Google
            </a>
          </div>

          <div>
            <p className="text-white text-xs tracking-widest uppercase mb-5 font-medium">Katalog</p>
            <div className="flex flex-col gap-3">
              <Link to="/mlzidla-mlzitka" className="text-sm text-white/60 hover:text-white transition-colors">Mlžítka a mlžné brány</Link>
              <Link to="/katalog" className="text-sm text-white/60 hover:text-white transition-colors">Katalog řešení</Link>
              <Link to="/zahradni-mlzitka" className="text-sm text-white/60 hover:text-white transition-colors">Mlžítko na zahradu</Link>
              <Link to="/jak-funguje-mlzeni" className="text-sm text-white/60 hover:text-white transition-colors">Jak funguje mlžení</Link>
              <Link to="/o-nas" className="text-sm text-white/60 hover:text-white transition-colors">O společnosti</Link>
            </div>
          </div>

          <div>
            <p className="text-white text-xs tracking-widest uppercase mb-5 font-medium">Informace</p>
            <div className="flex flex-col gap-3">
              <Link to="/jak-funguje-mlzeni" className="text-sm text-white/60 hover:text-white transition-colors">Technologie</Link>
              <Link to="/chytra-mlzidla" className="text-sm text-white/60 hover:text-white transition-colors">Chytré ovládání</Link>
              <Link to="/reference" className="text-sm text-white/60 hover:text-white transition-colors">Reference</Link>
              <Link to="/blog" className="text-sm text-white/60 hover:text-white transition-colors">Novinky a blog</Link>
              <Link to="/prinosy-mlzitek" className="text-sm text-white/60 hover:text-white transition-colors">Přínosy mlžítek</Link>
              <Link to="/podpora" className="text-sm text-white/60 hover:text-white transition-colors">Nejčastější dotazy</Link>
              <Link to="/servis-udrzba" className="text-sm text-white/60 hover:text-white transition-colors">Servis a údržba</Link>
              <Link to="/ke-stazeni" className="text-sm text-white/60 hover:text-white transition-colors">Ke stažení a manuály</Link>
              <Link to="/obchodni-podminky" className="text-sm text-white/60 hover:text-white transition-colors">Obchodní podmínky</Link>
              <Link to="/partnerstvi" className="text-sm text-white/60 hover:text-white transition-colors">Partnerství</Link>
            </div>
          </div>

          <div>
            <p className="text-white text-xs tracking-widest uppercase mb-5 font-medium">Kontakt</p>
            <div className="flex flex-col gap-3">
              <a href="tel:+420774700390" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Phone size={13} /> +420 774 700 390
              </a>
              <a href="mailto:obchod1@holmtec.cz" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Mail size={13} /> obchod1@holmtec.cz
              </a>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <MapPin size={13} /> Trutnov, 54102, Horní staré město 698, Česká republika
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3 items-center">
          <p className="text-xs text-white/40">© {new Date().getFullYear()} HolmTec s.r.o. Všechna práva vyhrazena.</p>
          <div className="flex items-center gap-4">
            <Link to="/gdpr" className="text-xs text-white/40 hover:text-white transition-colors">Ochrana osobních údajů (GDPR)</Link>
            <span className="text-white/20">·</span>
            <Link to="/gdpr" className="text-xs text-white/40 hover:text-white transition-colors">Cookies</Link>
            <span className="text-white/20">·</span>
            <Link to="/podpora" className="text-xs text-white/40 hover:text-white transition-colors">Podpora</Link>
          </div>
        </div>
      </div>
    </footer>);

}