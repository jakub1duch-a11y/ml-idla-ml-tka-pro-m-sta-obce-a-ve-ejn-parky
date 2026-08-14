import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Check, Building2, ShieldCheck, Wrench, FileText, MapPin, Ruler, Droplets } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import CollectionHero from '@/components/kolekce/CollectionHero';
import CollectionProductGrid from '@/components/kolekce/CollectionProductGrid';
import { COLLECTIONS } from '@/components/kolekce/collectionData';
import ContextLinks from '@/components/common/ContextLinks';

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

const GARDEN_TRUST = [
  { icon: ShieldCheck, title: 'Nerezové provedení', text: 'Čisté a odolné řešení navržené pro dlouhodobé venkovní použití.' },
  { icon: Droplets, title: 'Jednoduché napojení', text: 'Podle zvoleného modelu navrhneme vhodné připojení a příslušenství pro váš prostor.' },
  { icon: Ruler, title: 'Pevně i dočasně', text: 'Řešení může být trvalé, nebo u vybraných modelů sezónní a snadno přemístitelné.' },
  { icon: Wrench, title: 'Servis a podpora', text: 'Pomůžeme s výběrem, instalací, zazimováním i následnou údržbou.' },
];

const GARDEN_STEPS = [
  { code: '01', icon: MapPin, title: 'Vybereme místo', text: 'Zohledníme velikost terasy či zahrady, proudění vzduchu, pohyb lidí a zdroj vody.' },
  { code: '02', icon: Ruler, title: 'Doporučíme model', text: 'Vybereme tvar, počet prvků a typ instalace tak, aby mlžítko fungovalo i vizuálně zapadlo.' },
  { code: '03', icon: Droplets, title: 'Připravíme instalaci', text: 'Navrhneme napojení a potřebné příslušenství pro co nejjednodušší používání během sezóny.' },
];

export default function CollectionDetail({ forcedCollection, canonicalPath }) {
  const { collection: routeSlug } = useParams();
  const slug = forcedCollection || routeSlug;
  const collection = COLLECTIONS[slug] || COLLECTIONS.city;
  const isCity = slug === 'city';
  const isGarden = slug === 'garden';

  useEffect(() => {
    setSEO({
      title: isCity ? 'Městská mlžítka pro města, obce a veřejný prostor | MLŽIDLA®' : isGarden ? 'Zahradní mlžítka pro terasy, pergoly a zahrady | MLŽIDLA®' : `${collection.name} | MLŽIDLA®`,
      description: collection.text,
      canonicalPath: canonicalPath || `/kolekce/${slug}`,
    });
  }, [collection, slug, canonicalPath, isCity, isGarden]);

  return (
    <main className="bg-background pt-16">
      <CollectionHero collection={collection} />

      {(isCity || isGarden) && (
        <section className="border-b border-border bg-white">
          <div className="mx-auto grid max-w-7xl gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {(isCity ? CITY_TRUST : GARDEN_TRUST).map(({ icon: Icon, title, text }) => (
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
          {isGarden && <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">Zahradní mlžítko má ochladit prostor a zároveň v něm působit přirozeně. Proto řešíme nejen výkon, ale i umístění, napojení, vzhled a způsob sezónního používání.</p>}
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

      {(isCity || isGarden) && (
        <section className="bg-slate-50 border-y border-border">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
            <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
              <div>
                <p className="font-mono text-sm tracking-[.18em] uppercase text-secondary">OD ZÁMĚRU K REALIZACI</p>
                <h2 className="mt-4 font-heading text-4xl text-foreground lg:text-5xl">{isCity ? 'Jasný proces pro město, projektanta i realizační firmu.' : 'Jednoduchý proces od výběru místa po první spuštění.'}</h2>
              </div>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">{isCity ? 'Cílem je předvídatelné řešení bez zbytečných komplikací při návrhu, instalaci a následném provozu.' : 'Pomůžeme vybrat řešení, které se hodí do prostoru, jednoduše se používá a dává smysl i po technické stránce.'}</p>
            </div>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {(isCity ? CITY_STEPS : GARDEN_STEPS).map(({ code, icon: Icon, title, text }) => (
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
              <Link to={isGarden ? '/podpora' : '/ke-stazeni'} className="inline-flex items-center gap-2 border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground">{isGarden ? 'Časté dotazy' : 'Technické podklady'} <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>
      )}

      <CollectionProductGrid collection={collection} />

      {isCity && <ContextLinks eyebrow="Pro města a projektanty" title="Technika, hygiena a benefity na jednom místě." items={[
        { path: '/jak-to-funguje', kicker: 'Technologie', title: 'Jak mlžítka fungují', text: 'Princip mlžení, napojení, provozní tlak a technické řešení pro veřejný prostor.' },
        { path: '/ochrana-zdravi', kicker: 'Hygiena a provoz', title: 'Ochrana zdraví', text: 'Zdroj vody, proplach, údržba, servisní režim a informace důležité pro městské instalace.' },
        { path: '/vyhody', kicker: 'Přínos projektu', title: 'Výhody a benefity', text: 'Tepelný komfort, chytré řízení, životnost, servis a architektonická hodnota řešení.' },
        { path: '/smart-ovladani', kicker: 'Správa', title: 'Chytré ovládání', text: 'Automatizace provozu podle času, teploty a podmínek v místě instalace.' },
        { path: '/udrzitelnost', kicker: 'Městské klima', title: 'Udržitelnost', text: 'Jak navrhovat provoz s ohledem na vodu, mikroklima a dlouhodobou životnost.' },
        { path: '/reference', kicker: 'Důvěra', title: 'Reálné realizace', text: 'Podívejte se na instalace ve městech, parcích, ZOO a dalších veřejných prostorech.' }
      ]} />}

      <section className="bg-[#12415e] text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-16 lg:flex-row lg:items-end lg:px-10 lg:py-20">
          <div>
            <p className="font-mono text-sm tracking-[.18em] uppercase text-accent">ŘEŠENÍ NA MÍRU</p>
            <h2 className="mt-4 max-w-2xl font-heading text-4xl">{isCity ? 'Připravíme městské mlžítko pro konkrétní prostor a způsob provozu.' : isGarden ? 'Vybereme zahradní mlžítko, které bude fungovat technicky i vizuálně.' : 'Společně vybereme správný model, rozměr i způsob instalace.'}</h2>
            {(isCity || isGarden) && <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">{isCity ? 'Pošlete nám základní informace o místě. Doporučíme vhodné řešení a další postup.' : 'Stačí fotografie nebo rozměry prostoru a informace o přívodu vody. Navrhneme vhodný model a způsob instalace.'}</p>}
          </div>
          <Link to="/poptavka" className="inline-flex shrink-0 items-center gap-2 bg-accent px-6 py-3 text-base font-semibold text-accent-foreground">Nezávazná poptávka <ArrowRight size={17} /></Link>
        </div>
      </section>
    </main>
  );
}
