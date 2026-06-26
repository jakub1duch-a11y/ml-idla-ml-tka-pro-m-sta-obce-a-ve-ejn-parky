import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-ink text-white/50 text-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="mb-4">
              <p className="font-heading text-white text-base tracking-widest uppercase font-medium">HolmTec</p>
              <p className="font-mono text-[10px] tracking-widest text-white/30 uppercase">· Mlžné sochy · Nerezová ocel</p>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Zakázkové mlžné sochy z nerezové oceli AISI 304. Od návrhu přes výrobu až po instalaci. Trutnov, Česká republika.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="https://www.instagram.com/mlzne_sochy" target="_blank" rel="noopener noreferrer"
                className="text-xs font-mono tracking-widest uppercase hover:text-white transition-colors">Instagram</a>
              <a href="https://www.facebook.com/Mlznesochy" target="_blank" rel="noopener noreferrer"
                className="text-xs font-mono tracking-widest uppercase hover:text-white transition-colors">Facebook</a>
            </div>
          </div>

          <div>
            <p className="text-white text-xs font-mono tracking-widest uppercase mb-4">Produkty</p>
            <div className="flex flex-col gap-2.5">
              <Link to="/kolekce" className="hover:text-white transition-colors">Mlžné sochy</Link>
              <Link to="/mlhoviste" className="hover:text-white transition-colors">Mlhoviště</Link>
              <Link to="/jak-to-funguje" className="hover:text-white transition-colors">Jak to funguje</Link>
              <a href="mailto:obchod1@holmtec.cz?subject=Katalog 2026 — zaslat PDF" className="hover:text-white transition-colors">Katalog 2026 PDF</a>
            </div>
          </div>

          <div>
            <p className="text-white text-xs font-mono tracking-widest uppercase mb-4">Kontakt</p>
            <div className="flex flex-col gap-2.5">
              <p className="text-white/70">Ing. Radek Meduna</p>
              <a href="tel:+420774700390" className="hover:text-white transition-colors">+420 774 700 390</a>
              <a href="mailto:obchod1@holmtec.cz" className="hover:text-white transition-colors">obchod1@holmtec.cz</a>
              <p>Trutnov, Česká republika</p>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between gap-3">
          <p className="text-xs text-white/30">© {new Date().getFullYear()} HolmTec s.r.o. Všechna práva vyhrazena.</p>
          <p className="text-xs text-white/20 font-mono">HOLMTEC · MLŽNÉ SOCHY · NEREZOVÁ OCEL</p>
        </div>
      </div>
    </footer>
  );
}