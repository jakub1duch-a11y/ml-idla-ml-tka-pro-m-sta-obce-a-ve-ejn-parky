import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import CollectionHero from '@/components/kolekce/CollectionHero';
import CollectionProductGrid from '@/components/kolekce/CollectionProductGrid';
import { COLLECTIONS } from '@/components/kolekce/collectionData';

export default function CollectionDetail() {
  const { collection: slug } = useParams();
  const collection = COLLECTIONS[slug] || COLLECTIONS.city;
  useEffect(() => setSEO({ title: `${collection.name} | MLŽIDLA®`, description: collection.text, canonicalPath: `/kolekce/${slug}` }), [collection, slug]);
  return <main className="bg-background pt-16"><CollectionHero collection={collection} /><section className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-24 grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="font-mono text-[11px] tracking-[.18em] uppercase text-secondary">Navrženo pro vaše místo</p><h2 className="mt-4 font-heading text-4xl lg:text-5xl text-foreground">{collection.sectionHeading}</h2></div><div className="grid gap-5 sm:grid-cols-3">{collection.features.map((feature) => <div key={feature} className="border-t border-[#b9c3c8] pt-5"><Check size={18} className="text-secondary" /><p className="mt-6 leading-relaxed text-foreground text-lg">{feature}</p></div>)}</div></section><CollectionProductGrid collection={collection} /><section className="bg-primary text-primary-foreground"><div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20 flex flex-col lg:flex-row gap-8 items-end justify-between"><div><p className="font-mono text-[11px] tracking-[.18em] uppercase text-accent">Řešení na míru</p><h2 className="mt-4 max-w-2xl font-heading text-4xl lg:text-5xl">Společně vybereme správný model, rozměr i způsob instalace.</h2></div><Link to="/poptavka" className="shrink-0 inline-flex items-center gap-2 bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground">Nezávazná poptávka <ArrowRight size={16} /></Link></div></section></main>;
}