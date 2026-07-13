import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function MlzidlaFooter() {
  return (
    <footer className="bg-black border-t-4 border-brushed relative">
      <div
        className="h-2 w-full"
        style={{ background: 'linear-gradient(90deg, #8a8a8a 0%, #e8e8e8 25%, #8a8a8a 50%, #e8e8e8 75%, #8a8a8a 100%)' }}
      />
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p className="text-white font-heading font-black uppercase tracking-tight text-xl mb-3">HolmTec</p>
          <p className="text-brushed/50 text-xs leading-relaxed max-w-xs">
            Nerezové mlžné instalace pro města, obce, eventy a soukromé prostory. Výroba, návrh a servis na jednom místě.
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-brushed/40 mb-2">Kontakt</p>
          <a href="tel:+420" className="flex items-center gap-2 text-white/80 text-sm hover:text-techblue transition-colors">
            <Phone size={14} /> +420 000 000 000
          </a>
          <a href="mailto:obchod1@holmtec.cz" className="flex items-center gap-2 text-white/80 text-sm hover:text-techblue transition-colors">
            <Mail size={14} /> obchod1@holmtec.cz
          </a>
          <p className="flex items-center gap-2 text-white/60 text-sm">
            <MapPin size={14} /> Česká republika
          </p>
        </div>
        <div>
          <p className="text-[11px] font-mono tracking-[0.3em] uppercase text-brushed/40 mb-4">Partneři</p>
          <div className="flex gap-6 opacity-40 text-white text-xs font-mono uppercase tracking-widest">
            <span>Nerez CZ</span>
            <span>CNC Group</span>
          </div>
        </div>
      </div>
      <div className="border-t border-brushed/15 py-5 text-center text-brushed/30 text-[11px] font-mono">
        © {new Date().getFullYear()} HolmTec s.r.o. — Všechna práva vyhrazena
      </div>
    </footer>
  );
}