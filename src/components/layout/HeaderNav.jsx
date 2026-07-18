import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import ProductMegaMenu from '@/components/layout/ProductMegaMenu';

const LINKS = [
  { label: 'Jak funguje mlžení', to: '/jak-funguje-mlzeni' },
  { label: 'Chytré řízení', to: '/chytra-mlzidla' },
  { label: 'Realizace', to: '/reference' },
  { label: 'Inspirace', to: '/blog' },
  { label: 'Podpora a servis', to: '/podpora' },
];

export default function HeaderNav() {
  const [productsOpen, setProductsOpen] = useState(false);
  return <nav className="hidden xl:block min-w-0 flex-1"><ul className="flex list-none items-center gap-1 whitespace-nowrap my-0">
    <li className="relative" onMouseEnter={() => setProductsOpen(true)} onMouseLeave={() => setProductsOpen(false)}>
      <Link to="/katalog" className="inline-flex items-center gap-1 rounded-lg px-3 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"><span>Produkty a řešení</span><ChevronDown size={15} className={productsOpen ? 'rotate-180 transition-transform' : 'transition-transform'} /></Link>
      {productsOpen && <ProductMegaMenu />}
    </li>
    {LINKS.map(({ label, to }) => <li key={to}><Link to={to} className="inline-flex rounded-lg px-3 py-2.5 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white">{label}</Link></li>)}
    <li className="ml-auto"><Link to="/partnerstvi" className="inline-flex px-3 py-2.5 text-xs font-medium text-white/60 hover:text-white">B2B partnerství</Link></li>
    <li><Link to="/poptavka" className="inline-flex rounded-lg bg-cyan px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-950 transition hover:bg-white">Nezávazná poptávka</Link></li>
  </ul></nav>;
}