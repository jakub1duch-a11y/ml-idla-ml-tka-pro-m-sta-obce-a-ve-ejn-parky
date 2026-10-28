import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PRODUCT_MENU_GROUPS } from '@/components/layout/productMenuLinks';

export default function ProductMenuGroups({ onNavigate }) {
  const { pathname } = useLocation();
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {PRODUCT_MENU_GROUPS.map(({ title, links }) => (
        <section key={title} className="min-w-0">
          <h3 className="border-b border-border pb-3 font-heading text-base font-semibold text-primary">{title}</h3>
          <ul className="mt-2">
            {links.map(({ label, path }) => (
              <li key={path}>
                <Link to={path} onClick={onNavigate} aria-current={pathname === path ? 'page' : undefined} className={`group flex min-h-11 items-center justify-between gap-2 rounded-lg px-2 text-sm transition-colors hover:bg-muted hover:text-primary ${pathname === path ? 'bg-muted font-semibold text-primary' : 'text-muted-foreground'}`}>
                  <span>{label}</span><ArrowUpRight size={14} aria-hidden="true" className="shrink-0 opacity-50" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}