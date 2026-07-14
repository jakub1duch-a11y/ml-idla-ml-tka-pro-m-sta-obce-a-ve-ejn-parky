import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, Wifi, Calculator, Images, Phone } from 'lucide-react';

const LINKS = [
{ icon: LayoutGrid, label: 'Katalog', to: '/katalog' },
{ icon: Wifi, label: 'Smart', to: '/smart-ovladani' },
{ icon: Calculator, label: 'Kalkulačka', to: '/kalkulacka' },
{ icon: Images, label: 'Reference', to: '/reference' },
{ icon: Phone, label: 'Poptávka', to: '/poptavka' }];

export default function BoldQuickNav() {
  return (
    <div className="sm:hidden bg-black border-b-2 border-red-600 py-3">
      <div className="flex gap-2 overflow-x-auto px-4 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
        {LINKS.map((l) =>
        <Link key={l.to} to={l.to}
          className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 border border-white/30 text-white text-xs font-bold uppercase tracking-wide whitespace-nowrap active:bg-white active:text-black transition-colors">
          <l.icon size={13} /> {l.label}
        </Link>
        )}
      </div>
    </div>);
}