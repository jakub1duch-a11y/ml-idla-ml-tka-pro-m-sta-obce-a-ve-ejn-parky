import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { setSEO } from '@/lib/seo';
import LineaHero from '@/components/linea/LineaHero';
import LineaGallery from '@/components/linea/LineaGallery';
import ProductVariantsSection from '@/components/produkt/ProductVariantsSection';
import { LINEA_VARIANTS } from '@/components/produkt/productVisuals';

export default function Linea() {
  useEffect(() => setSEO({
    title: 'Mlžítko LINEA — kulatá trubka Ø70 mm nebo hranatý jekl | MLŽIDLA®',
    description: 'Minimalistický nerezový mlžný sloup LINEA pro náměstí, promenády a moderní plazy. Dvě varianty profilu, nerez AISI 316L, bez čerpadla, česká výroba.',
    canonicalPath: '/linea'
  }), []);

  return (
    <main className="bg-background">
      <LineaHero />
      <ProductVariantsSection variants={LINEA_VARIANTS} />
      <LineaGallery />
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-16 lg:flex-row lg:items-end lg:px-8 lg:py-20">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.2em] text-accent">Další krok</p>
            <h2 className="mt-4 max-w-2xl font-heading text-3xl lg:text-4xl">Navrhneme LINEA přesně pro vaše místo.</h2>
            <p className="mt-4 max-w-xl text-primary-foreground/70">Vyberete profil, my dodáme vizualizaci, technický list a cenovou nabídku. Nezávazně a zdarma.</p>
          </div>
          <Link to="/poptavka" className="inline-flex min-h-12 shrink-0 items-center justify-center bg-accent px-7 py-4 text-sm font-bold uppercase tracking-[.02em] text-accent-foreground transition-colors hover:bg-primary-foreground">Nezávazná poptávka</Link>
        </div>
      </section>
    </main>
  );
}