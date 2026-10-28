import React from 'react';
import { Link } from 'react-router-dom';

export default function UsageMenu({ links, onNavigate }) {
  return (
    <div id="desktop-usage-menu" className="absolute left-1/2 top-full mt-1 w-[min(40rem,90vw)] -translate-x-1/2 rounded-lg border border-border bg-card p-5 text-card-foreground shadow-xl">
      <p className="mb-3 font-heading text-lg font-semibold text-primary">Řešení podle místa použití</p>
      <div className="grid grid-cols-2 gap-1">
        {links.map(({ label, path, icon: Icon }) => (
          <Link key={path} to={path} onClick={onNavigate} className="flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-primary">
            <Icon size={17} aria-hidden="true" className="shrink-0 text-primary" /><span>{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}