import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { setSEO } from '@/lib/seo';
import BranyHero from '@/components/brany/BranyHero';
import BranyModels from '@/components/brany/BranyModels';
import BranyUseCases from '@/components/brany/BranyUseCases';

export default function MlzneBrany() {
  useEffect(() => setSEO({
    title: 'Mlžné brány pro města a veřejný prostor | MLŽIDLA®',
    description: 'Nerezové mlžné brány GATE70 a LINEA CE70 pro náměstí, parky, koupaliště a eventy. Ochlazení až o 9 °C, bez čerpadla, chytré řízení, česká výroba.',
    canonicalPath: '/mlzne-brany'
  }), []);

  return (
    <main className="bg-background">
      <BranyHero />
      <BranyModels />
      <BranyUseCases />
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-16 lg:flex-row lg:items-end lg:px-8 lg:py-20">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.2em] text-accent">Další krok</p>
            <h2 className="mt-4 max-w-2xl font-heading text-3xl lg:text-4xl">Pošleme vám návrh brány pro konkrétní místo.</h2>
            <p className="mt-4 max-w-xl text-primary-foreground/70">Popište nám prostor — připravíme vizualizaci, technické podklady i cenovou nabídku. Nezávazně a zdarma.</p>
          </div>
          <Link to="/poptavka" className="inline-flex min-h-12 shrink-0 items-center justify-center bg-accent px-7 py-4 text-sm font-bold uppercase tracking-[.02em] text-accent-foreground transition-colors hover:bg-primary-foreground">
            Nezávazná poptávka
          </Link>
        </div>
      </section>
    </main>
  );
}