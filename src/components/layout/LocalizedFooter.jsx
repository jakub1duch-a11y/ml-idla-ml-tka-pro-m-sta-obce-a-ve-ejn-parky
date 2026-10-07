import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Mail, MapPin, Phone } from 'lucide-react';
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
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 border-b border-white/10 pb-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
          <div className="flex flex-col items-start">
            <Link to={ROUTE_MAP.home[locale]} className="inline-flex"><Logo size="sm" /></Link>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/60">{copy.text}</p>
            <Link to={ROUTE_MAP.inquiry[locale]} className="btn-metallic-mist mt-6 inline-flex min-h-12 items-center gap-2 rounded-full px-5 py-3 text-sm font-bold">
              {copy.quote}<ArrowRight size={15} />
            </Link>
          </div>

          <section className="rounded-[1.75rem] border border-cyan-100/15 bg-white/[.06] p-5 shadow-[0_20px_70px_rgba(0,0,0,.16)] sm:p-6" aria-label={copy.contact}>
            <div className="flex items-center gap-4">
              <img
                src="/media/avatars/radek-meduna-support.svg"
                alt="Ing. Radek Meduna"
                className="h-16 w-16 shrink-0 rounded-full border-2 border-cyan-200/50 bg-white object-cover"
                width="64"
                height="64"
                loading="lazy"
              />
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan-200">{copy.contactKicker}</p>
                <p className="mt-1 font-heading text-xl font-semibold text-white">Ing. Radek Meduna</p>
                <p className="mt-1 text-sm text-white/60">{copy.contactRole}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 text-sm sm:grid-cols-2">
              <a href="tel:+420774700390" className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-black/10 p-3 transition hover:border-cyan-200/50 hover:bg-white/[.08]">
                <Phone size={17} className="mt-0.5 shrink-0 text-cyan-200" />
                <span><span className="block text-[11px] uppercase tracking-[.12em] text-white/40">Telefon</span><span className="mt-1 block font-semibold text-white group-hover:text-cyan-100">+420 774 700 390</span></span>
              </a>
              <a href="mailto:meduna@holmtec.cz" className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-black/10 p-3 transition hover:border-cyan-200/50 hover:bg-white/[.08]">
                <Mail size={17} className="mt-0.5 shrink-0 text-cyan-200" />
                <span><span className="block text-[11px] uppercase tracking-[.12em] text-white/40">E-mail</span><span className="mt-1 block break-all font-semibold text-white group-hover:text-cyan-100">meduna@holmtec.cz</span></span>
              </a>
            </div>

            <div className="mt-3 flex items-start gap-3 rounded-2xl border border-white/10 bg-black/10 p-3 text-sm">
              <Building2 size={17} className="mt-0.5 shrink-0 text-cyan-200" />
              <span><span className="block text-[11px] uppercase tracking-[.12em] text-white/40">{copy.base}</span><span className="mt-1 block font-semibold text-white">HolmTec s.r.o. · Horní staré město 698</span><span className="mt-1 block text-white/55">541 02 Trutnov · Česká republika</span></span>
            </div>
          </section>
        </div>

        <div className="grid gap-8 border-b border-white/10 py-8 md:grid-cols-[1fr_auto] md:items-start">
          <nav className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6" aria-label="Footer navigation">
            {links.map(([label, path]) => (
              <Link key={path} to={path} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-white/68 transition hover:border-white/25 hover:bg-white/[.05] hover:text-white">
                {label}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher mobile />
        </div>

        <div className="flex flex-col gap-2 pt-7 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} MLŽIDLA® / HolmTec s.r.o.</p>
          <p className="inline-flex items-center gap-1.5"><MapPin size={13} /> Trutnov · Czech Republic · mlzidla.cz</p>
        </div>
      </div>
    </footer>
  );
}
