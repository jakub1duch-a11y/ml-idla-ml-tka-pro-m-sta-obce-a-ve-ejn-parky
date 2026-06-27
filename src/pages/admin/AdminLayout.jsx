import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  BarChart2, Package, Image, BookOpen, MessageSquare, Home, Menu, X, ChevronRight, Layers, HardDriveDownload, Briefcase, TrendingUp
} from 'lucide-react';

const navItems = [
  { path: '/admin', label: 'Analytika', icon: BarChart2, exact: true },
  { path: '/admin/city-cooling', label: 'City Cooling SEO', icon: TrendingUp },
  { path: '/admin/produkty', label: 'Produkty', icon: Package },
  { path: '/admin/realizace', label: 'Realizace', icon: Image },
  { path: '/admin/blog', label: 'Blog & Inspirace', icon: BookOpen },
  { path: '/admin/poptavky', label: 'Poptávky', icon: MessageSquare },
  { path: '/admin/projekty', label: 'Projekty & Výroba', icon: Briefcase },
  { path: '/admin/contentful', label: 'Contentful Sync', icon: Layers },
  { path: '/admin/drive-sync', label: 'Drive Sync', icon: HardDriveDownload },
];

export default function AdminLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-surface border-r border-white/10 flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-cyan tracking-widest uppercase">HolmTec</p>
            <p className="text-white font-light text-sm mt-0.5">Administrace</p>
          </div>
          <button onClick={() => setOpen(false)} className="lg:hidden text-white/40"><X size={18} /></button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => {
            const active = item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  active ? 'bg-cyan/10 text-cyan border border-cyan/20' : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}>
                <Icon size={16} />
                <span>{item.label}</span>
                {active && <ChevronRight size={12} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all">
            <Home size={16} /> Web
          </Link>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-surface border-b border-white/10 px-4 py-3 flex items-center gap-3">
        <button onClick={() => setOpen(true)} className="text-white/60"><Menu size={20} /></button>
        <p className="text-white text-sm font-light">Administrace</p>
      </div>

      {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main content */}
      <main className="flex-1 lg:ml-56 pt-14 lg:pt-0 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}