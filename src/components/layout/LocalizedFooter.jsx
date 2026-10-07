import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { ROUTE_MAP } from '@/lib/i18n';

const COPY = {
  en: {
    text: 'Stainless steel outdoor misting systems for cities, architecture and gardens. Designed and manufactured by HolmTec in the Czech Republic.',
    products: 'Products',
    urban: 'Urban',
    technology: 'Technology',
    projects: 'Projects',
    about: 'About',
    contact: 'Contact',
    quote: 'Request a quote',
    contactKicker: 'Technical contact',
    contactRole: 'Production and technical solutions',
    base: 'Production base',
    footerNav: 'Footer navigation',
    technicalBase: 'Technical base',
  },
  de: {
    text: 'Edelstahl-Nebelanlagen für Städte, Architektur und Gärten. Entwickelt und hergestellt von HolmTec in Tschechien.',
    products: 'Produkte',
    urban: 'Stadt',
    technology: 'Technologie',
    projects: 'Referenzen',
    about: 'Über uns',
    contact: 'Kontakt',
    quote: 'Angebot anfragen',
    contactKicker: 'Technischer Kontakt',
    contactRole: 'Produktion und technische Lösungen',
    base: 'Produktionsstandort',
    footerNav: 'Footer-Navigation',
    technicalBase: 'Technischer Standort',
  },
  pl: {
    text: 'Systemy mgłowe ze stali nierdzewnej do miast, architektury i ogrodów. Projektowane i produkowane przez HolmTec w Czechach.',
    products: 'Produkty',
    urban: 'Dla miast',
    technology: 'Technologia',
    projects: 'Realizacje',
    about: 'O nas',
    contact: 'Kontakt',
    quote: 'Poproś o wycenę',
    contactKicker: 'Kontakt techniczny',
    contactRole: 'Produkcja i rozwiązania techniczne',
    base: 'Zaplecze produkcyjne',
    footerNav: 'Nawigacja stopki',
    technicalBase: 'Zaplecze techniczne',
  },
  sk: {
    text: 'Nerezové hmlové systémy pre mestá, architektúru a záhrady. Navrhované a vyrábané spoločnosťou HolmTec v Česku.',
    products: 'Produkty',
    urban: 'Pre mestá',
    technology: 'Technológia',
    projects: 'Realizácie',
    about: 'O nás',
    contact: 'Kontakt',
    quote: 'Požiadať o ponuku',
    contactKicker: 'Technický kontakt',
    contactRole: 'Výroba a technické riešenia',
    base: 'Výrobné zázemie',
    footerNav: 'Navigácia päty',
    technicalBase: 'Technické zázemie',
  },
  it: {
    text: 'Sistemi di nebulizzazione in acciaio inox per città, architettura e giardini. Progettati e prodotti da HolmTec nella Repubblica Ceca.',
    products: 'Prodotti',
    urban: 'Urbano',
    technology: 'Tecnologia',
    projects: 'Progetti',
    about: 'Chi siamo',
    contact: 'Contatti',
    quote: 'Richiedi preventivo',
    contactKicker: 'Contatto tecnico',
    contactRole: 'Produzione e soluzioni tecniche',
    base: 'Sede produttiva',
    footerNav: 'Navigazione footer',
    technicalBase: 'Sede tecnica',
  },
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
    <footer className="bg-[#07131D] text-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-12 border-b border-white/10 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(360px,.78fr)] lg:gap-20 lg:py-16">
          <div className="flex flex-col items-start">
            <Link to={ROUTE_MAP.home[locale]} className="inline-flex"><Logo size="sm" /></Link>
            <p className="mt-6 max-w-xl text-[15px] leading-7 text-white/58">{copy.text}</p>
            <Link to={ROUTE_MAP.inquiry[locale]} className="mt-8 inline-flex min-h-11 items-center gap-2 border-b border-cyan-200/70 pb-2 text-sm font-semibold text-cyan-100 transition hover:border-white hover:text-white">
              {copy.quote}<ArrowRight size={15} />
            </Link>
          </div>

          <section className="border-t border-white/20 pt-4" aria-label={copy.contact}>
            <div className="flex items-center gap-4">
              <img
                src="/media/avatars/radek-meduna-support.svg"
                alt="Ing. Radek Meduna"
                className="h-14 w-14 shrink-0 rounded-full border border-cyan-200/50 bg-white object-cover"
                width="56"
                height="56"
                loading="lazy"
              />
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan-200">{copy.contactKicker}</p>
                <p className="mt-1 font-heading text-xl font-semibold text-white">Ing. Radek Meduna</p>
                <p className="mt-1 text-sm text-white/55">{copy.contactRole}</p>
              </div>
            </div>

            <div className="mt-7 grid gap-4 border-t border-white/10 pt-5 text-sm sm:grid-cols-2 sm:gap-x-8">
              <a href="tel:+420774700390" className="group">
                <span className="flex items-center gap-2 text-[10px] uppercase tracking-[.16em] text-white/38"><Phone size={13} className="text-cyan-200" /> Telefon</span>
                <span className="mt-2 block font-semibold text-white transition group-hover:text-cyan-100">+420 774 700 390</span>
              </a>
              <a href="mailto:meduna@holmtec.cz" className="group">
                <span className="flex items-center gap-2 text-[10px] uppercase tracking-[.16em] text-white/38"><Mail size={13} className="text-cyan-200" /> E-mail</span>
                <span className="mt-2 block break-all font-semibold text-white transition group-hover:text-cyan-100">meduna@holmtec.cz</span>
              </a>
            </div>

            <div className="mt-6 flex items-start gap-3 border-t border-white/10 pt-5 text-sm">
              <MapPin size={16} className="mt-0.5 shrink-0 text-cyan-200" />
              <div>
                <p className="text-[10px] uppercase tracking-[.16em] text-white/38">{copy.base}</p>
                <address className="mt-2 not-italic leading-6 text-white/75">
                  HolmTec s.r.o.<br />
                  Horní Staré Město 698<br />
                  541 02 Trutnov · Česká republika
                </address>
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-7 border-b border-white/10 py-7 md:grid-cols-[1fr_auto] md:items-center">
          <nav className="flex flex-wrap gap-x-6 gap-y-3" aria-label={copy.footerNav}>
            {links.map(([label, path]) => (
              <Link key={path} to={path} className="text-sm text-white/55 transition hover:text-white">
                {label}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher mobile />
        </div>

        <div className="flex flex-col gap-5 py-6 text-xs text-white/38 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} MLŽIDLA® / HolmTec s.r.o.</p>
          <div className="flex items-center gap-3">
            <span className="uppercase tracking-[.14em]">{copy.technicalBase}</span>
            <span className="inline-flex items-center bg-white px-2.5 py-1.5">
              <img src="/media/brand/holmtec-official.svg" alt="HolmTec" className="h-6 w-auto" width="103" height="24" loading="lazy" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
