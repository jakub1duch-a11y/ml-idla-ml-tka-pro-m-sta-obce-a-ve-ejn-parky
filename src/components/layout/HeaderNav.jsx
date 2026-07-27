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
{ label: 'Inspirace', to: '/blog' }];


export default function HeaderNav() {
  const [productsOpen, setProductsOpen] = useState(false);
  const [b2bOpen, setB2bOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  return <nav className="hidden min-w-0 flex-1 xl:block"><ul className="my-0 flex list-none items-center gap-1 whitespace-nowrap">
    <li className="relative" onMouseEnter={() => setProductsOpen(true)} onMouseLeave={() => setProductsOpen(false)}>
      <Link to="/katalog" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-slate-700"><span>Produkty a řešení</span><ChevronDown size={15} className={productsOpen ? 'rotate-180 transition-transform' : 'transition-transform'} /></Link>
      {productsOpen && <ProductMegaMenu />}
    </li>
    <li><Link to="/pronajem" className="inline-flex items-center rounded-full px-3 py-2.5 text-xs font-semibold text-cyan transition-colors hover:bg-cyan/10">Pronájem</Link></li>
    {LINKS.map(({ label, to }) => <li key={to}><Link to={to} className="inline-flex rounded-full px-3 py-2.5 text-xs font-medium transition-colors hover:bg-slate-100 hover:text-slate-950 text-[hsl(var(--popover))]">{label}</Link></li>)}
    <li className="relative" onMouseEnter={() => setSupportOpen(true)} onMouseLeave={() => setSupportOpen(false)}><Link to="/podpora" className="inline-flex items-center gap-1 rounded-full px-3 py-2.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950">Podpora <ChevronDown size={14} className={supportOpen ? 'rotate-180 transition-transform' : 'transition-transform'} /></Link>{supportOpen && <SupportMegaMenu />}</li>
    <li className="relative ml-auto" onMouseEnter={() => setB2bOpen(true)} onMouseLeave={() => setB2bOpen(false)}><Link to="/partnerstvi" className="inline-flex items-center gap-1 px-3 py-2.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-950">B2B <ChevronDown size={14} className={b2bOpen ? 'rotate-180 transition-transform' : 'transition-transform'} /></Link>{b2bOpen && <B2BMegaMenu />}</li>
    <li><Link to="/poptavka" className="inline-flex rounded-full bg-cyan px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-cyan/80">Nezávazná poptávka</Link></li>
  </ul></nav>;
}