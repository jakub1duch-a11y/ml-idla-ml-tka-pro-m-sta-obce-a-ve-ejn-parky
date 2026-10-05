import React from 'react';
import ArchitecturalHero from './ArchitecturalHero';

export default function KolekceHero({ category }) {
  return <ArchitecturalHero catalog eyebrow={category ? 'Kategorie / ' + category.name : 'Katalog mlžítek'}
    title={category?.name || 'Mlha jako součást'} accent={category ? undefined : 'architektury.'}
    description={category?.description || 'Nerezová mlžítka pro náměstí, zahrady i místa setkávání. Vyberte tvar, který doplní váš prostor. S návrhem a instalací vám pomůžeme.'}
    image={category?.image_url || '/media/catalog-architecture-2026.webp'}
    imageAlt={category?.image_url ? category.name : 'Ilustrační architektonická vizualizace promenády s lavičkami, zelení a jemnou mlhou'}
    caption={category?.image_url ? category.name : 'Ilustrační vizualizace / architektura veřejného prostoru'} />;
}
