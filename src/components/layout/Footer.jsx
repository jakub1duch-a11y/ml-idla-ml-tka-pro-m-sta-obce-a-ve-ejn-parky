import React from 'react';
import { Link } from 'react-router-dom';

const LOGO_URL = "https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6c8de7824_generated_8389a653.png";

export default function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-tectonic text-white/70">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <img src={LOGO_URL} alt="mlziste.cz" className="h-8 w-auto brightness-200 mb-4" />
            <p className="text-sm leading-relaxed max-w-md">
              Profesionální mlžné systémy a mlžítka pro ochlazování městských prostorů. 
              Návrh, realizace a servis high-pressure mist technologií.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white text-sm font-medium uppercase tracking-wider mb-4">Navigace</h4>
            <div className="flex flex-col gap-2.5">
              <Link to="/katalog" className="text-sm hover:text-hydro transition-colors">Katalog produktů</Link>
              <button onClick={() => scrollTo('sluzby')} className="text-left text-sm hover:text-hydro transition-colors">Služby</button>
              <button onClick={() => scrollTo('o-nas')} className="text-left text-sm hover:text-hydro transition-colors">O nás</button>
              <button onClick={() => scrollTo('kontakt')} className="text-left text-sm hover:text-hydro transition-colors">Kontakt</button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-medium uppercase tracking-wider mb-4">Kontakt</h4>
            <div className="flex flex-col gap-2.5 text-sm">
              <a href="mailto:info@mlziste.cz" className="hover:text-hydro transition-colors">info@mlziste.cz</a>
              <a href="tel:+420123456789" className="hover:text-hydro transition-colors">+420 123 456 789</a>
              <p>Praha, Česká republika</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} mlziste.cz. Všechna práva vyhrazena.
          </p>
          <div className="flex gap-6 text-xs text-white/40">
            <Link to="/ochrana-udaju" className="hover:text-white/70 transition-colors">Ochrana osobních údajů</Link>
            <Link to="/obchodni-podminky" className="hover:text-white/70 transition-colors">Obchodní podmínky</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}