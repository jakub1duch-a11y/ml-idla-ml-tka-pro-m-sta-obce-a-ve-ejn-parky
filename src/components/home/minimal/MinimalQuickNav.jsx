import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, Wifi, Calculator, Images, Phone } from 'lucide-react';

const LINKS = [
{ icon: LayoutGrid, label: 'Katalog', to: '/katalog' },
{ icon: Wifi, label: 'Smart', to: '/smart-ovladani' },
{ icon: Calculator, label: 'Kalkulačka', to: '/kalkulacka' },
{ icon: Images, label: 'Reference', to: '/reference' },
{ icon: Phone, label: 'Poptávka', to: '/poptavka' }];

export default function MinimalQuickNav() {
  return (
    <div className="sm:hidden bg-white border-b border-slate-100 py-3">
      <div className="flex gap-2 overflow-x-auto px-4 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
        {LINKS.map((l) =>
        <Link key={l.to} to={l.to}
          className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-xs font-medium whitespace-nowrap active:bg-teal-100 transition-colors">
          <l.icon size={13} /> {l.label}
        </Link>
        )}
      </div>
    </div>);
}