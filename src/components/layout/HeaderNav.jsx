import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ChevronDown } from 'lucide-react';
import ProductMegaMenu from '@/components/layout/ProductMegaMenu';
import B2BMegaMenu from '@/components/layout/B2BMegaMenu';
import SupportMegaMenu from '@/components/layout/SupportMegaMenu';

const LINKS = [
  { label: 'Jak funguje mlžení', to: '/jak-funguje-mlzeni' },
  { label: 'Chytré řízení', to: '/chytra-mlzidla' },
  { label: 'Přínosy mlžítek', to: '/prinosy-mlzitek' },
  { label: 'Realizace', to: '/reference' },
  { label: 'Inspirace', to: '/blog' },
];

export default function HeaderNav() {
  const [productsOpen, setProductsOpen] = useState(false);
  const [b2bOpen, setB2bOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  return <nav className="hidden xl:block min-w-0 flex-1"><ul className="flex list-none items-center gap-1 whitespace-nowrap my-0">
    <li className="relative" onMouseEnter={() => setProductsOpen(true)} onMouseLeave={() => setProductsOpen(false)}>
      <Link to="/katalog" className="inline-flex items-center gap-1 rounded-lg border border-cyan/35 bg-cyan/10 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-cyan hover:text-slate-950"><span>Produkty a řešení</span><ChevronDown size={15} className={productsOpen ? 'rotate-180 transition-transform' : 'transition-transform'} /></Link>
      {productsOpen && <ProductMegaMenu />}
    </li>
    <li><Link to="/pronajem" className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2.5 text-sm font-bold text-cyan transition hover:bg-white hover:text-slate-950"><CalendarDays size={15} /> Pronájem</Link></li>
    {LINKS.map(({ label, to }) => <li key={to}><Link to={to} className="inline-flex rounded-lg px-3 py-2.5 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white">{label}</Link></li>)}
    <li className="relative" onMouseEnter={() => setSupportOpen(true)} onMouseLeave={() => setSupportOpen(false)}><Link to="/podpora" className="inline-flex items-center gap-1 rounded-lg px-3 py-2.5 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white">Podpora a servis <ChevronDown size={14} className={supportOpen ? 'rotate-180 transition-transform' : 'transition-transform'} /></Link>{supportOpen && <SupportMegaMenu />}</li>
    <li className="relative ml-auto" onMouseEnter={() => setB2bOpen(true)} onMouseLeave={() => setB2bOpen(false)}><Link to="/partnerstvi" className="inline-flex items-center gap-1 px-3 py-2.5 text-xs font-medium text-white/60 hover:text-white">B2B partnerství <ChevronDown size={14} className={b2bOpen ? 'rotate-180 transition-transform' : 'transition-transform'} /></Link>{b2bOpen && <B2BMegaMenu />}</li>
    <li><Link to="/poptavka" className="inline-flex rounded-lg bg-cyan px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-950 transition hover:bg-white">Nezávazná poptávka</Link></li>
  </ul></nav>;
}