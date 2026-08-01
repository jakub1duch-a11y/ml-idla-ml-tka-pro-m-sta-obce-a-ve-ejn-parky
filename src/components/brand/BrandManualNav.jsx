import React from 'react';

const ITEMS = [['#jadro','Jádro'],['#hlas','Hlas'],['#vizual','Vizuál'],['#reklama','Reklama'],['#ukazky','Ukázky']];

export default function BrandManualNav() {
  return <nav aria-label="Obsah brand manuálu" className="brand-no-print sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur-xl">
    <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-3 lg:px-10">
      {ITEMS.map(([href,label], index) => <a key={href} href={href} className="shrink-0 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"><span className="mr-2 font-mono text-[10px] text-secondary">0{index + 1}</span>{label}</a>)}
    </div>
  </nav>;
}