import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import ProductMegaMenu from '@/components/layout/ProductMegaMenu';
import B2BMegaMenu from '@/components/layout/B2BMegaMenu';

const LINKS = [{ label: 'Technologie', to: '/jak-funguje-mlzeni' }, { label: 'Smart ovládání', to: '/chytra-mlzidla' }, { label: 'Realizace', to: '/reference' }, { label: 'O nás', to: '/o-nas' }];

export default function HeaderNav() {
  const [productsOpen, setProductsOpen] = useState(false); const [b2bOpen, setB2bOpen] = useState(false);
  return <nav className="hidden min-w-0 flex-1 xl:block"><ul className="my-0 flex list-none items-center gap-1 whitespace-nowrap"><li className="relative" onMouseEnter={() => setProductsOpen(true)} onMouseLeave={() => setProductsOpen(false)}><Link to="/city-arc" className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-950 transition hover:bg-slate-100">Produkty <ChevronDown size={14} /></Link>{productsOpen && <ProductMegaMenu />}</li>{LINKS.map(({ label, to }) => <li key={to}><Link to={to} className="inline-flex rounded-lg px-3 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">{label}</Link></li>)}<li className="relative ml-auto" onMouseEnter={() => setB2bOpen(true)} onMouseLeave={() => setB2bOpen(false)}><Link to="/partnerstvi" className="inline-flex items-center gap-1 px-3 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-950">B2B partnerství <ChevronDown size={14} /></Link>{b2bOpen && <B2BMegaMenu />}</li><li><Link to="/poptavka" className="inline-flex rounded-lg bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800">Nezávazná poptávka</Link></li></ul></nav>;
}