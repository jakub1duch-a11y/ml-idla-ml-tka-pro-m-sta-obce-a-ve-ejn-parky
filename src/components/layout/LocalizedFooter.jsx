import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { ROUTE_MAP } from '@/lib/i18n';

const COPY = {
  en: { text: 'Stainless steel outdoor misting systems for cities, architecture and gardens. Designed and manufactured by HolmTec in the Czech Republic.', products: 'Products', urban: 'Urban', technology: 'Technology', projects: 'Projects', about: 'About', contact: 'Contact', quote: 'Request a quote' },
  de: { text: 'Edelstahl-Nebelanlagen für Städte, Architektur und Gärten. Entwickelt und hergestellt von HolmTec in Tschechien.', products: 'Produkte', urban: 'Stadt', technology: 'Technologie', projects: 'Referenzen', about: 'Über uns', contact: 'Kontakt', quote: 'Angebot anfragen' },
  pl: { text: 'Systemy mgłowe ze stali nierdzewnej do miast, architektury i ogrodów. Projektowane i produkowane przez HolmTec w Czechach.', products: 'Produkty', urban: 'Dla miast', technology: 'Technologia', projects: 'Realizacje', about: 'O nas', contact: 'Kontakt', quote: 'Poproś o wycenę' },
  sk: { text: 'Nerezové hmlové systémy pre mestá, architektúru a záhrady. Navrhované a vyrábané spoločnosťou HolmTec v Česku.', products: 'Produkty', urban: 'Pre mestá', technology: 'Technológia', projects: 'Realizácie', about: 'O nás', contact: 'Kontakt', quote: 'Požiadať o ponuku' },
  it: { text: 'Sistemi di nebulizzazione in acciaio inox per città, architettura e giardini. Progettati e prodotti da HolmTec nella Repubblica Ceca.', products: 'Prodotti', urban: 'Urbano', technology: 'Tecnologia', projects: 'Progetti', about: 'Chi siamo', contact: 'Contatti', quote: 'Richiedi preventivo' },
};

export default function LocalizedFooter({ locale }) {
  const copy = COPY[locale] || COPY.en;
  const links = [
    [copy.products, ROUTE_MAP.catalog[locale]],
    [copy.urban, ROUTE_MAP.city[locale]],
    [copy.technology, ROUTE_MAP.technology[locale]],
    [copy.projects, ROUTE_MAP.references[locale]],
    [copy.about, ROUTE_MAP.about[locale]],
    [copy.contact, ROUTE_MAP.contact[locale]],
  ];

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <Link to={ROUTE_MAP.home[locale]} className="inline-flex"><Logo size="sm" /></Link>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/60">{copy.text}</p>
            <Link to={ROUTE_MAP.inquiry[locale]} className="btn-metallic-mist mt-6 inline-flex min-h-12 items-center gap-2 rounded-full px-5 py-3 text-sm font-bold">{copy.quote}<ArrowRight size={15}/></Link>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {links.map(([label, path]) => <Link key={path} to={path} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-white/68 transition hover:border-white/25 hover:bg-white/[.05] hover:text-white">{label}</Link>)}
            </div>
            <div className="mt-5"><LanguageSwitcher mobile /></div>
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-7 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} MLŽIDLA® / HolmTec s.r.o.</p>
          <p>Trutnov · Czech Republic · mlzidla.cz</p>
        </div>
      </div>
    </footer>
  );
}
