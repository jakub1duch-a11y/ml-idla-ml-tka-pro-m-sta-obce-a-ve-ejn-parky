import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function DetailPhotoSection({ item, children }) {
  return <section id={`bendy-${item.id}`} className="scroll-mt-24 border-t border-border bg-card">
    <header className="mx-auto grid max-w-7xl gap-5 px-5 py-10 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:py-16">
      <div><p className="font-mono text-xs text-muted-foreground">{item.eyebrow}</p><h2 className="mt-4 font-heading text-3xl sm:text-4xl lg:text-5xl">{item.title}</h2></div>
      <p className="max-w-xl self-end text-base text-muted-foreground sm:text-lg">{item.text}</p>
    </header>
    <figure>
      <Dialog><DialogTrigger asChild><button type="button" className="block w-full cursor-zoom-in bg-muted" aria-label={`Zvětšit: ${item.title}`}>
        <img src={item.image} alt={item.alt} width="1536" height="1024" loading="lazy" decoding="async" className="max-h-[85svh] w-full object-contain" />
      </button></DialogTrigger><DialogContent className="max-w-6xl"><DialogTitle>{item.title}</DialogTitle><img src={item.image} alt={item.alt} className="max-h-[75svh] w-full object-contain" /><p className="text-xs text-muted-foreground">AI vizualizace · {item.note}</p></DialogContent></Dialog>
      <figcaption className="mx-auto grid max-w-7xl gap-2 px-5 py-5 sm:px-10 lg:grid-cols-[auto_1fr] lg:gap-8">
        <span className="font-mono text-xs font-semibold text-primary">AI VIZUALIZACE</span><p className="text-xs text-muted-foreground">{item.note}</p>
      </figcaption>
    </figure>
    {children}
  </section>;
}