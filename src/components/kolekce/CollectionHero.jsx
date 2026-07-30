import React from 'react';

export default function CollectionHero({ collection }) {
  return <section className="relative overflow-hidden bg-primary text-primary-foreground"><div className="absolute inset-0"><img src={collection.image} alt={collection.name} className="w-full h-full object-cover opacity-45"/><div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/20"/></div><div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24 lg:py-36"><p className="font-mono text-[11px] tracking-[.18em] uppercase text-accent">MLŽIDLA® / {collection.label}</p><h1 className="mt-5 max-w-4xl font-heading text-5xl lg:text-7xl">{collection.headline}</h1><p className="mt-7 max-w-xl text-lg leading-relaxed text-white/75">{collection.text}</p></div></section>;
}