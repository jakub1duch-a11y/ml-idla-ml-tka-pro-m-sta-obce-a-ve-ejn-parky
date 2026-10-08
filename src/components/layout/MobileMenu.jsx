import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowRight, Building2, Calculator, ChevronDown, Cpu, Grid2X2, Images, LifeBuoy, LogIn, Newspaper, Trees, X } from 'lucide-react';
import Logo from '@/components/layout/Logo';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { ROUTE_MAP } from '@/lib/i18n';
import '@/styles/contact-and-navigation.css';

const INTERNATIONAL_MOBILE_COPY = {
  en: { products: 'Products', city: 'Urban misting', garden: 'Garden misting', custom: 'Custom solutions', technology: 'How it works', smart: 'Smart control', references: 'Projects', about: 'About HolmTec', faq: 'FAQ', contact: 'Contact', quote: 'Request a quote' },
  de: { products: 'Produkte', city: 'Städtische Nebelanlagen', garden: 'Garten-Nebelanlagen', custom: 'Sonderanfertigung', technology: 'Funktionsweise', smart: 'Smart-Steuerung', references: 'Referenzen', about: 'Über HolmTec', faq: 'FAQ', contact: 'Kontakt', quote: 'Angebot anfragen' },
  pl: { products: 'Produkty', city: 'Systemy dla miast', garden: 'Systemy do ogrodu', custom: 'Na zamówienie', technology: 'Jak to działa', smart: 'Smart sterowanie', references: 'Realizacje', about: 'O HolmTec', faq: 'FAQ', contact: 'Kontakt', quote: 'Poproś o wycenę' },
  sk: { products: 'Produkty', city: 'Systémy pre mestá', garden: 'Systémy do záhrady', custom: 'Na mieru', technology: 'Ako to funguje', smart: 'Smart riadenie', references: 'Realizácie', about: 'O HolmTec', faq: 'FAQ', contact: 'Kontakt', quote: 'Požiadať o ponuku' },
  it: { products: 'Prodotti', city: 'Nebulizzazione urbana', garden: 'Nebulizzazione giardino', custom: 'Soluzioni su misura', technology: 'Come funziona', smart: 'Controllo smart', references: 'Progetti', about: 'Chi siamo', faq: 'FAQ', contact: 'Contatti', quote: 'Richiedi preventivo' },
};

const PRIMARY_LINKS = [
  { label: 'Produkty', sub: 'Kompletní katalog MLŽIDLA®', path: '/katalog-mlzitek', icon: Grid2X2 },
  { label: 'Pro města a obce', sub: 'Návrh, výroba a podklady pro veřejný prostor', path: '/mlzitka-pro-mesta-obce', icon: Building2 },
  { label: 'Realizace', sub: 'Hotové projekty a reference', path: '/reference', icon: Images },
  { label: 'Technologie', sub: 'Jak funguje nízkotlaké mlžení', path: '/jak-to-funguje', icon: Cpu },
  { label: 'Blog a novinky', sub: 'Novinky, realizace, inspirace a video', path: '/blog', icon: Newspaper },
  { label: 'Podpora', sub: 'FAQ, servis a technické informace', path: '/podpora', icon: LifeBuoy },
];

export default function MobileMenu({ open, onClose, productLinks = [], locale = 'cs', triggerRef }) {
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  useEffect(() => { if (!open) setCollectionsOpen(false); }, [open]);
  const collections = productLinks.filter((item) => !item.featured && !item.textOnly);
  const copy = INTERNATIONAL_MOBILE_COPY[locale] || INTERNATIONAL_MOBILE_COPY.en;
  const links = locale === 'cs' ? PRIMARY_LINKS : [
    { label: copy.products, path: ROUTE_MAP.catalog[locale], icon: Grid2X2 },
    { label: copy.city, path: ROUTE_MAP.city[locale], icon: Building2 },
    { label: copy.garden, path: ROUTE_MAP.garden[locale], icon: Trees },
    { label: copy.custom, path: ROUTE_MAP.custom[locale], icon: Grid2X2 },
    { label: copy.technology, path: ROUTE_MAP.technology[locale], icon: Cpu },
    { label: copy.smart, path: ROUTE_MAP.smart[locale], icon: Cpu },
    { label: copy.references, path: ROUTE_MAP.references[locale], icon: Images },
    { label: copy.about, path: ROUTE_MAP.about[locale], icon: Building2 },
    { label: copy.faq, path: ROUTE_MAP.faq[locale], icon: LifeBuoy },
    { label: copy.contact, path: ROUTE_MAP.contact[locale], icon: ArrowRight },
  ];
  return (
    <Dialog.Root open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="mobile-nav-overlay fixed inset-0 z-[70] bg-[#041622]/50 lg:hidden" />
        <Dialog.Content id="mobile-site-menu" aria-modal="true" onCloseAutoFocus={(event) => { event.preventDefault(); triggerRef?.current?.focus(); }}
          className="mobile-nav-panel fixed inset-0 z-[80] flex h-[100dvh] flex-col bg-[#F4F8FA] text-[#16374B] focus:outline-none lg:hidden">
          <Dialog.Title className="sr-only">{locale === 'cs' ? 'Hlavní navigace MLŽIDLA' : 'MLŽIDLA navigation'}</Dialog.Title>
          <Dialog.Description className="sr-only">{locale === 'cs' ? 'Katalog, řešení podle prostoru, reference a kontakt.' : 'Products, projects, technology and contact.'}</Dialog.Description>
          <div className="flex h-[68px] shrink-0 items-center justify-between bg-[#082C3F] px-5 text-white">
            <Link to={ROUTE_MAP.home[locale]} onClick={onClose} aria-label="MLŽIDLA — home"><Logo size="sm" /></Link>
            <div className="flex items-center gap-2"><LanguageSwitcher mobile onNavigate={onClose} />
              <Dialog.Close aria-label={locale === 'cs' ? 'Zavřít menu' : 'Close menu'} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-cyan-200"><X size={22} /></Dialog.Close>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
            <div className="mx-auto max-w-xl">
              <p className="mb-4 font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-[#4B6979]">{locale === 'cs' ? 'Najděte své řešení' : copy.products}</p>
              <nav aria-label={locale === 'cs' ? 'Hlavní navigace' : 'Main navigation'} className="grid grid-cols-2 gap-2.5">
                {links.map(({ label, sub, path, icon: Icon }, index) => (
                  <Link key={path} to={path} onClick={onClose} className={`group flex min-h-[96px] flex-col rounded-[1.3rem] p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087C91] ${index === 0 ? 'bg-[#082C3F] text-white shadow-lg shadow-slate-900/10' : 'bg-white text-[#16374B] hover:bg-[#E8F3F5]'}`}>
                    <span className="mb-2 flex items-center justify-between"><Icon size={20} aria-hidden="true" /><ArrowRight size={15} aria-hidden="true" className="opacity-60" /></span>
                    <strong className="text-[14px] leading-5">{label}</strong>
                    {sub && <span className={`mt-1 text-[11px] leading-4 ${index === 0 ? 'text-[#C6E1E9]' : 'text-[#557080]'}`}>{sub}</span>}
                  </Link>
                ))}
              </nav>
              {locale === 'cs' && <>
                <div className="mt-4 rounded-[1.3rem] bg-white p-1">
                  <button type="button" onClick={() => setCollectionsOpen((value) => !value)} aria-expanded={collectionsOpen} aria-controls="mobile-collections"
                    className="flex min-h-12 w-full items-center justify-between rounded-2xl px-4 text-sm font-semibold hover:bg-[#F0F7FA]">
                    Kolekce podle prostoru <ChevronDown size={18} className={`transition-transform motion-reduce:transition-none duration-150 ${collectionsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {collectionsOpen && <div id="mobile-collections" className="space-y-1 px-1 pb-1">{collections.map((item) => <Link key={item.path} to={item.path} onClick={onClose} className="flex min-h-11 items-center justify-between rounded-xl bg-[#F0F7FA] px-3 text-sm text-[#235568]">{item.label}<ArrowRight size={14} /></Link>)}</div>}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Link to="/smart-ovladani" onClick={onClose} className="flex min-h-12 items-center justify-between rounded-2xl bg-[#DDEFF2] px-4 text-xs font-semibold">Smart řízení <Cpu size={15} /></Link>
                  <Link to="/kalkulacka" onClick={onClose} className="flex min-h-12 items-center justify-between rounded-2xl bg-[#DDEFF2] px-4 text-xs font-semibold">Kalkulace provozu <Calculator size={15} /></Link>
                </div>
                <Link to="/klientska-sekce" onClick={onClose} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#235568]"><LogIn size={17} /> Klientská sekce</Link>
              </>}
            </div>
          </div>
          <div className="shrink-0 bg-white px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="mx-auto flex max-w-xl gap-2">
              <Link to={ROUTE_MAP.contact[locale]} onClick={onClose} className="flex min-h-12 items-center justify-center rounded-full bg-[#EDF5F7] px-5 text-sm font-semibold">{locale === 'cs' ? 'Kontakt' : copy.contact}</Link>
              <Link to={ROUTE_MAP.inquiry[locale]} onClick={onClose} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#082C3F] px-5 text-sm font-semibold text-white">{locale === 'cs' ? 'Nezávazná poptávka' : copy.quote}<ArrowRight size={15} /></Link>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
