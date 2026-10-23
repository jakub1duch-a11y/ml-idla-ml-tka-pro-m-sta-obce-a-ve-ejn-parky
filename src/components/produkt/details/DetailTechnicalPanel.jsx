import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function DetailTechnicalPanel({ technical }) {
  if (!technical) return null;
  return <figure className="mx-auto max-w-7xl px-5 pb-10 sm:px-10 lg:pb-14">
    <div className="rounded-[22px] border border-border bg-muted p-3 sm:p-5">
      <figcaption className="px-1 pb-3 font-mono text-xs font-semibold uppercase tracking-[.14em] text-primary">{technical.label}</figcaption>
      <Dialog><DialogTrigger asChild><button type="button" className="block w-full cursor-zoom-in overflow-hidden rounded-2xl bg-card" aria-label={`Zvětšit: ${technical.label}`}>
        <img src={technical.image} alt={technical.alt} width="1536" height="1024" loading="lazy" decoding="async" className="max-h-[75svh] w-full object-contain" />
      </button></DialogTrigger><DialogContent className="max-w-6xl"><DialogTitle>{technical.label}</DialogTitle><img src={technical.image} alt={technical.alt} className="max-h-[75svh] w-full object-contain" /><p className="text-xs text-muted-foreground">AI vizualizace · {technical.caption}</p></DialogContent></Dialog>
      <p className="px-1 pt-3 text-xs text-muted-foreground">{technical.caption}</p>
    </div>
  </figure>;
}