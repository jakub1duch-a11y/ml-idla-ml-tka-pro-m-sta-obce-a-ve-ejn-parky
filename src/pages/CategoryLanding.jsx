import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Droplets, Palette, Ruler, Sparkles, Trees } from 'lucide-react';
import ArchitecturalHero from '@/components/kolekce/ArchitecturalHero';
import CollectionProductGrid from '@/components/kolekce/CollectionProductGrid';
import { setSEO } from '@/lib/seo';

const PAGE_DATA = {
  sloupky: {
    name: 'Sloupková mlžítka',
    productSlugs: ['linea-mlzitko', 'linea-solo', 'mlzitko-steblo', 'mlzitko-bendy', 'y-armist-tr60', 'y-armist-j70', 'ostrev-city'],
    eyebrow: 'SLOUPKOVÁ MLŽÍTKA · VEŘEJNÝ PROSTOR',
    title: 'Sloupková mlžítka, která ochladí místo a neruší jeho architekturu.',
    description: 'Štíhlé nerezové mlžicí prvky pro promenády, parky, předprostory budov i odpočinkové zóny. Řadu, počet prvků a umístění navrhujeme podle konkrétního prostoru.',
    image: '/media/optimized/fc2d57e81_C-MlzitkoLINEA_CE70_single1.webp',
    imageAlt: 'Sloupkové mlžítko LINEA ve veřejném prostoru',
    canonicalPath: '/sloupkova-mlzitka',
    seoTitle: 'Sloupková mlžítka pro města, parky a veřejný prostor',
    seoDescription: 'Nerezová sloupková mlžítka pro města, obce, parky, promenády a veřejné prostory. Návrh rozmístění, napojení i provozu podle konkrétní lokality.',
    serviceName: 'Sloupková mlžítka pro veřejný prostor',
    primaryCta: 'Navrhnout sloupkové mlžítko',
    strengths: [
      { icon: Ruler, title: 'Čistá linie v prostoru', text: 'Vertikální prvek doplní cestu, pobytovou zónu nebo park bez zbytečné vizuální zátěže.' },
      { icon: Building2, title: 'Od jednoho prvku po sestavu', text: 'Volíme počet, rozestupy a umístění podle pěšího pohybu, stínu a charakteru místa.' },
      { icon: Droplets, title: 'Jemná vodní mlha', text: 'Mlžení řešíme jako lokální ochlazovací vrstvu pro místo, kde se lidé zastavují nebo procházejí.' },
    ],
    places: [
      ['Parky a promenády', 'Pro cesty, lavičky a zastávky, kde může mlžítko přirozeně navázat na pohyb návštěvníků.'],
      ['Náměstí a předprostory', 'Pro veřejné plochy, které potřebují ochlazovací bod s klidným, architektonickým výrazem.'],
      ['Školy a sportovní areály', 'Pro venkovní zóny s jasným provozem, vhodným napojením a promyšleným umístěním.'],
    ],
    process: 'Začněte fotkou nebo půdorysem. Projdeme umístění, vodu, způsob využití a vybereme vhodný počet prvků.',
    related: [
      ['Mlžné brány a oblouky', '/mlzne-brany', 'Průchozí ochlazení pro místa s intenzivním pohybem.'],
      ['Ateliérové prvky', '/atelierove-prvky', 'Zakázkové tvary pro prostor s vlastním příběhem.'],
    ],
  },
  atelier: {
    name: 'Ateliérové prvky',
    productSlugs: ['mlzitko-mrak', 'mlzna-spirála', 'mlzitko-lizatko', 'mlzitko-kvet-4', 'teepee', 'mlzitko-slunce', 'mlzitko-kapr', 'mlzitko-mrkev', 'mlzitko-volavka'],
    eyebrow: 'ATELIÉROVÉ PRVKY · ZAKÁZKOVÁ VÝROBA',
    title: 'Ateliérové prvky: mlžení ve tvaru, který patří právě vašemu místu.',
    description: 'Designové tvary mlžítek pro veřejný prostor, zahrady, školy i instalace s vlastním charakterem. Od prvního záměru řešíme tvar, měřítko, umístění a chování mlhy jako jeden celek.',
    image: '/media/optimized/db-4098079e74-84805a215_mlnprvek-mrak-mlzidla02.webp',
    imageAlt: 'Designový ateliérový mlžicí prvek',
    canonicalPath: '/atelierove-prvky',
    seoTitle: 'Ateliérové prvky a zakázková mlžítka',
    seoDescription: 'Designové ateliérové prvky a zakázková mlžítka pro města, parky, školy i soukromé prostory. Tvar, rozměr a umístění navrhujeme podle konkrétního záměru.',
    serviceName: 'Ateliérové prvky a zakázková mlžítka',
    primaryCta: 'Probrat zakázkový návrh',
    strengths: [
      { icon: Palette, title: 'Tvar s vlastním charakterem', text: 'Mlžítko může být subtilní detail i výrazná dominanta prostoru — podle vašeho záměru.' },
      { icon: Sparkles, title: 'Od konceptu k řešení', text: 'Při návrhu propojujeme vizuální výraz, chování mlhy, bezpečný provoz a reálné umístění.' },
      { icon: Ruler, title: 'Měřítko podle místa', text: 'Rozměr, počet prvků i kotvení přizpůsobujeme kontextu konkrétní realizace.' },
    ],
    places: [
      ['Pobytové prostory a parky', 'Pro místa, která mají být zapamatovatelná a přitom přirozeně fungovat během horkých dnů.'],
      ['Školy, školky a hřiště', 'Pro hravé a srozumitelné prvky, které respektují provoz místa i jeho každodenní rytmus.'],
      ['Architektura a instalace', 'Pro site-specific záměry, kde je mlha součástí atmosféry, formy a návštěvnického zážitku.'],
    ],
    process: 'Pošlete skicu, inspiraci, fotografii nebo půdorys. Společně upřesníme formu, rozměr, technické možnosti a další krok projektu.',
    related: [
      ['Sloupková mlžítka', '/sloupkova-mlzitka', 'Čisté vertikální prvky pro infrastrukturu a pěší zóny.'],
      ['Mlžné brány a oblouky', '/mlzne-brany', 'Průchozí mlžné zóny pro ochlazení v pohybu.'],
    ],
  },
};

export default function CategoryLanding({ variant }) {
  const page = PAGE_DATA[variant] || PAGE_DATA.sloupky;

  useEffect(() => {
    setSEO({
      title: page.seoTitle,
      description: page.seoDescription,
      keywords: variant === 'atelier'
        ? 'zakázková mlžítka, ateliérové prvky, designová mlžítka, mlžná instalace, mlžítko na míru'
        : 'sloupková mlžítka, sloupkové mlžítko, mlžítko LINEA, nerezové mlžítko, mlžítka pro města',
      image: page.image,
      canonicalPath: page.canonicalPath,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Service',
            name: page.serviceName,
            provider: { '@type': 'Organization', name: 'HolmTec' },
            areaServed: 'CZ',
            serviceType: page.serviceName,
            url: `https://mlzidla.cz${page.canonicalPath}`,
          },
          {
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: variant === 'atelier' ? 'Lze navrhnout mlžítko na míru?' : 'Kam se hodí sloupkové mlžítko?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: variant === 'atelier'
                    ? 'Ano. Tvar, rozměr, rozmístění, kotvení a provozní řešení se upřesňují podle konkrétního místa a záměru.'
                    : 'Sloupkové mlžítko se hodí do parků, na promenády, náměstí, předprostory budov, školní areály a další pobytové zóny s vhodným přívodem vody.',
                },
              },
              {
                '@type': 'Question',
                name: 'Jak začít s návrhem?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Stačí poslat fotografii nebo jednoduchý půdorys místa a základní informace o plánovaném použití. Návrh pak upřesníme podle prostoru a provozu.',
                },
              },
            ],
          },
        ],
      },
    });
  }, [page, variant]);

  return (
    <main className="bg-white pt-16">
      <ArchitecturalHero eyebrow={page.name} title={variant === 'atelier' ? 'Tvar, který vypráví.' : 'Čistá linie.'} accent={variant === 'atelier' ? 'Mlha, která oživí.' : 'Přirozené osvěžení.'} description={page.description} image={page.image} imageAlt={page.imageAlt} caption={page.name + ' / design v prostoru'} target="collection-products" />
      <CollectionProductGrid collection={page} />

      <section className="border-b border-border bg-white">
        <div className="mx-auto grid max-w-7xl gap-px bg-border md:grid-cols-3">
          {page.strengths.map(({ icon: Icon, title, text }) => (
            <article key={title} className="bg-white p-7 lg:p-9">
              <Icon size={23} className="text-secondary" strokeWidth={1.6} />
              <h2 className="mt-8 font-heading text-2xl text-foreground">{title}</h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.18em] text-secondary">KDE DÁVÁ ŘEŠENÍ SMYSL</p>
            <h2 className="mt-4 font-heading text-4xl leading-tight text-foreground">Navrženo pro konkrétní způsob pobytu a pohybu.</h2>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">Nejprve řešíme charakter prostoru, pohyb lidí, dostupné napojení a běžný provoz. Až pak vzniká řešení, které může fungovat vizuálně i technicky.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {page.places.map(([title, text]) => (
            <article key={title} className="border border-border bg-slate-50 p-7">
              <Trees size={22} className="text-secondary" strokeWidth={1.6} />
              <h3 className="mt-8 font-heading text-2xl text-foreground">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[.9fr_1.1fr] lg:px-10 lg:py-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.18em] text-secondary">OD ZÁMĚRU K NÁVRHU</p>
            <h2 className="mt-4 font-heading text-4xl leading-tight text-foreground">Řešení vzniká z místa, ne z univerzální šablony.</h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>{page.process}</p>
            <div className="pt-2">
              <Link to={`/poptavka?produkt=${encodeURIComponent(page.serviceName)}`} className="inline-flex items-center gap-2 font-semibold text-primary">Poslat podklady k návrhu <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <p className="font-mono text-xs uppercase tracking-[.18em] text-secondary">SOUVISEJÍCÍ ŘEŠENÍ</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {page.related.map(([title, path, text]) => (
            <Link key={path} to={path} className="group flex items-end justify-between border border-border bg-white p-7 transition hover:border-secondary hover:bg-slate-50">
              <div>
                <h2 className="font-heading text-2xl text-foreground">{title}</h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
              <ArrowRight className="ml-5 shrink-0 text-secondary transition group-hover:translate-x-1" size={20} />
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#12415e] text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-16 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:py-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.18em] text-accent">PROJEKTOVÁ PODPORA</p>
            <h2 className="mt-4 max-w-3xl font-heading text-4xl">Pošlete místo, záměr nebo inspiraci. Připravíme další krok pro váš projekt.</h2>
          </div>
          <Link to={`/poptavka?produkt=${encodeURIComponent(page.serviceName)}`} className="btn-metallic-mist inline-flex shrink-0 items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold">Získat návrh a cenu <ArrowRight size={16} /></Link>
        </div>
      </section>
    </main>
  );
}
