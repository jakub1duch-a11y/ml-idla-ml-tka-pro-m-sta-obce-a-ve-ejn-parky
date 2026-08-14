import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check, Building2, ShieldCheck, Wrench, FileText, MapPin, Ruler, Droplets } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import CollectionHero from '@/components/kolekce/CollectionHero';
import CollectionProductGrid from '@/components/kolekce/CollectionProductGrid';
import { COLLECTIONS } from '@/components/kolekce/collectionData';

const CITY_TRUST = [
  { icon: Building2, title: 'Český návrh a výroba', text: 'Jeden partner pro návrh, výrobu, instalaci i následný servis.' },
  { icon: ShieldCheck, title: 'Pro veřejný provoz', text: 'Odolné nerezové provedení navržené pro dlouhodobé venkovní použití.' },
  { icon: FileText, title: 'Podklady pro projekt', text: 'Pomůžeme s volbou modelu, umístěním, napojením a technickými podklady.' },
  { icon: Wrench, title: 'Servis a podpora', text: 'Řešení je navržené tak, aby bylo dobře udržovatelné i po letech provozu.' },
];

const CITY_STEPS = [
  { code: '01', icon: MapPin, title: 'Prostor a provoz', text: 'Vyhodnotíme místo, pohyb lidí, charakter veřejného prostoru a možnosti napojení.' },
  { code: '02', icon: Ruler, title: 'Návrh řešení', text: 'Doporučíme vhodný typ mlžítka, rozměry, rozmístění a způsob instalace.' },
  { code: '03', icon: Droplets, title: 'Realizace a servis', text: 'Dodáme hotové řešení a navazující podporu pro bezproblémový provoz.' },
];

export default function CollectionDetail({ forcedCollection, canonicalPath }) {
  const { collection: routeSlug } = useParams();
  const slug = forcedCollection || routeSlug;
  const collection = COLLECTIONS[slug] || COLLECTIONS.city;
  const isCity = slug === 'city';

  useEffect(() => {
    setSEO({
      title: isCity ? 'Městská mlžítka pro města, obce a veřejný prostor | MLŽIDLA®' : `${collection.name} | MLŽIDLA®`,
      description: collection.text,
      canonicalPath: canonicalPath || `/kolekce/${slug}`,
    });
  }, [collection, slug, canonicalPath, isCity]);

  return (
    <main className="bg-background pt-16">
      <CollectionHero collection={collection} />

      {isCity && (
        <section className="border-b border-border bg-white">
          <div className="mx-auto grid max-w-7xl gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {CITY_TRUST.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-white p-6 lg:p-7">
                <Icon size={22} className="text-secondary" strokeWidth={1.6} />
                <h2 className="mt-5 font-heading text-xl text-foreground">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[.8fr_1.2fr] lg:px-10 lg:py-24">
        <div>
          <p className="font-mono text-sm tracking-[.18em] uppercase text-secondary">NAVRŽENO PRO VAŠE MÍSTO</p>
          <h2 className="mt-4 font-heading text-3xl text-foreground lg:text-4xl">{collection.sectionHeading}</h2>
          {isCity && <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">Městské mlžítko není jen produkt. Je součástí provozu náměstí, parku nebo pěší zóny, proto řešíme vzhled, techniku i budoucí údržbu jako jeden celek.</p>}
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {collection.features.map((feature) => (
            <div key={feature} className="border-t border-[#b9c3c8] pt-5">
              <Check size={18} className="text-secondary" />
              <p className="mt-6 text-lg leading-relaxed text-foreground">{feature}</p>
            </div>
          ))}
        </div>
      </section>

      {isCity && (
        <section className="bg-slate-50 border-y border-border">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
            <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
              <div>
                <p className="font-mono text-sm tracking-[.18em] uppercase text-secondary">OD ZÁMĚRU K REALIZACI</p>
                <h2 className="mt-4 font-heading text-4xl text-foreground lg:text-5xl">Jasný proces pro město, projektanta i realizační firmu.</h2>
              </div>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">Cílem je předvídatelné řešení bez zbytečných komplikací při návrhu, instalaci a následném provozu.</p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {CITY_STEPS.map(({ code, icon: Icon, title, text }) => (
                <article key={code} className="border border-border bg-white p-7">
                  <div className="flex items-center justify-between">
                    <Icon size={22} className="text-secondary" strokeWidth={1.6} />
                    <span className="font-mono text-xs text-muted-foreground">{code}</span>
                  </div>
                  <h3 className="mt-10 font-heading text-2xl text-foreground">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/reference" className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">Prohlédnout realizace <ArrowRight size={16} /></Link>
              <Link to="/technologie" className="inline-flex items-center gap-2 border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground">Jak mlžítka fungují <ArrowRight size={16} /></Link>
              <Link to="/ke-stazeni" className="inline-flex items-center gap-2 border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground">Technické podklady <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>
      )}

      <CollectionProductGrid collection={collection} />

      <section className="bg-[#12415e] text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-16 lg:flex-row lg:items-end lg:px-10 lg:py-20">
          <div>
            <p className="font-mono text-sm tracking-[.18em] uppercase text-accent">ŘEŠENÍ NA MÍRU</p>
            <h2 className="mt-4 max-w-2xl font-heading text-4xl">{isCity ? 'Připravíme městské mlžítko pro konkrétní prostor a způsob provozu.' : 'Společně vybereme správný model, rozměr i způsob instalace.'}</h2>
            {isCity && <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">Pošlete nám základní informace o místě. Doporučíme vhodné řešení a další postup.</p>}
          </div>
          <Link to="/poptavka" className="inline-flex shrink-0 items-center gap-2 bg-accent px-6 py-3 text-base font-semibold text-accent-foreground">Nezávazná poptávka <ArrowRight size={17} /></Link>
        </div>
      </section>
    </main>
  );
}
