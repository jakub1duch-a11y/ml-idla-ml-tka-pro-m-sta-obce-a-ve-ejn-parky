import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, MapPin, Ruler, Droplets, ShieldCheck, Wrench } from 'lucide-react';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import DetailPhotoStory from '@/components/motion/DetailPhotoStory';
import CollectionHero from '@/components/kolekce/CollectionHero';
import CollectionProductGrid from '@/components/kolekce/CollectionProductGrid';
import { COLLECTIONS } from '@/components/kolekce/collectionData';
import ContextLinks from '@/components/common/ContextLinks';
import UseCaseExperience from '@/components/kolekce/UseCaseExperience';
import StebloSpaceFeature from '@/components/products/StebloSpaceFeature';

const CITY_PLANNING = [
  { label: 'Pohyb v prostoru', text: 'Ponechat průchozí trasy a přístupové plochy bez kolize s mlžítkem a jeho kotvením.' },
  { label: 'Vítr a odpařování', text: 'Proudění vzduchu může mlhu zanést i několik metrů. Dosah a případné smáčení ovlivní počasí, trysky i provoz.' },
  { label: 'Technická příprava', text: 'Prověřit vodu, filtraci, stavební připravenost, řízení a přístup k následnému servisu.' },
];

const GARDEN_PLANNING = [
  { label: 'Odstup od posezení', text: 'Nízkotlaká mlžítka nedoporučujeme umisťovat přímo mezi stoly a lavičky. Odstup řešíme podle konkrétního místa.' },
  { label: 'Slunce a vítr', text: 'V horkém suchém vzduchu se mlha rychleji odpařuje, ale vítr ji může přenést na další plochy. Trvale suchý povrch nelze slíbit.' },
  { label: 'Umístění a napojení', text: 'Zohledníme výhled do zahrady, přístup k vodě, způsob kotvení a možnosti sezónního používání.' },
];

const CITY_STEPS = [
  { code: '01', icon: MapPin, title: 'Prostor a provoz', text: 'Vyhodnotíme místo, pohyb lidí, charakter veřejného prostoru a možnosti napojení.' },
  { code: '02', icon: Ruler, title: 'Návrh řešení', text: 'Doporučíme vhodný typ mlžítka, rozměry, rozmístění a způsob instalace.' },
  { code: '03', icon: Droplets, title: 'Realizace a servis', text: 'Dodáme hotové řešení a navazující podporu pro bezproblémový provoz.' },
];

const GARDEN_TRUST = [
  { icon: ShieldCheck, title: 'Nerezové provedení', text: 'Čisté a odolné řešení navržené pro dlouhodobé venkovní použití.' },
  { icon: Droplets, title: 'Jednoduché napojení', text: 'Podle zvoleného modelu doporučíme připojení vody a potřebné příslušenství.' },
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
    if (isCity) setSEO(SEO_PAGES.mestskaKolekce);
    else if (isGarden) setSEO(SEO_PAGES.zahradniKolekce);
    else if (slug === 'art') setSEO(SEO_PAGES.zakazkovaKolekce);
    else setSEO({
      title: collection.name,
      description: collection.text,
      canonicalPath: canonicalPath || `/kolekce/${slug}`,
    });
  }, [collection, slug, canonicalPath, isCity, isGarden]);

  return (
    <main className="bg-background pt-16">
      <CollectionHero collection={collection} />

      {(isCity || isGarden) && <UseCaseExperience variant={isGarden ? 'garden' : 'city'} />}
      {isCity && <DetailPhotoStory variant="spaces" />}
      {isCity && <StebloSpaceFeature context="city" />}

      {(isCity || isGarden) ? (
        <section aria-labelledby="collection-placement-heading" className="border-y border-[#D6E5EA] bg-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[.82fr_1.18fr] lg:gap-16 lg:px-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[.17em] text-[#21768B]">Umístění v prostoru</p>
              <h2 id="collection-placement-heading" className="mt-4 max-w-xl font-heading text-3xl font-semibold leading-[1.1] tracking-[-.04em] text-[#0C2D40] sm:text-4xl">
                {isCity ? 'Městské mlžítko začíná správným místem.' : 'Mlžení pro zahradu navrhujeme s ohledem na posezení.'}
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-[#526D78]">
                {isCity
                  ? 'Při výběru posuzujeme pohyb lidí, okolní plochy a dlouhodobý provoz. Vhodný model určíme až podle místa a jeho technických podmínek.'
                  : 'Vzhled mlžítka a jeho funkce musí odpovídat zahradě. Vedle velikosti prostoru je důležitý vítr, slunce, umístění posezení a přívod vody.'}
              </p>
              <Link to="/poptavka" className="mt-7 inline-flex min-h-11 items-center gap-2 border-b-2 border-[#21768B] pb-1 text-sm font-semibold text-[#0C4157] hover:border-[#0C2D40] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#21768B]">
                {isCity ? 'Posoudit veřejný prostor' : 'Posoudit zahradu podle fotografie'}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="border-t border-[#CADCE2]">
              {(isCity ? CITY_PLANNING : GARDEN_PLANNING).map(({ label, text }, index) => (
                <div key={label} className="grid gap-4 border-b border-[#D8E6E9] py-6 sm:grid-cols-[2.75rem_1fr]">
                  <span className="font-mono text-xs font-semibold text-[#21768B]">0{index + 1}</span>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-[#0C2D40]">{label}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#526D78]">{text}</p>
                  </div>
                </div>
              ))}
              <p className="mt-5 max-w-2xl border-l-2 border-[#8FBCC6] pl-4 text-xs leading-6 text-[#526D78]">
                Konkrétní umístění a provozní podmínky stanovíme individuálně. Univerzální vzdálenost ani suchý povrch ve všech podmínkách nelze garantovat.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[.8fr_1.2fr] lg:px-10 lg:py-24">
          <div>
            <p className="font-mono text-sm tracking-[.18em] uppercase text-secondary">Podoba kolekce</p>
            <h2 className="mt-4 font-heading text-3xl text-foreground lg:text-4xl">{collection.sectionHeading}</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {collection.features.map((feature) => (
              <div key={feature} className="border-t border-[#b9c3c8] pt-5">
                <p className="text-base leading-7 text-foreground">{feature}</p>
              </div>
            ))}
          </div>
        </section>
      )}

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
              <Link to="/jak-to-funguje" className="inline-flex items-center gap-2 border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground">Jak mlžítka fungují <ArrowRight size={16} /></Link>
              <Link to={isGarden ? '/podpora' : '/ke-stazeni'} className="inline-flex items-center gap-2 border border-border bg-white px-5 py-3 text-sm font-semibold text-foreground">{isGarden ? 'Časté dotazy' : 'Technické podklady'} <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>
      )}

      <CollectionProductGrid collection={collection} />

      {isCity && <ContextLinks eyebrow="Pro města a projektanty" title="Technika, hygiena a benefity na jednom místě." items={[
        { path: '/ochrana-zdravi', kicker: 'Hygiena a provoz', title: 'Voda a údržba', text: 'Zdroj vody, proplach, servisní režim a souvislosti městského provozu.' },
        { path: '/smart-ovladani', kicker: 'Správa', title: 'Časové řízení mlžení', text: 'Možnosti intervalového a podmíněného provozu podle vybavení instalace.' },
        { path: '/udrzitelnost', kicker: 'Městské klima', title: 'Provozní souvislosti', text: 'Voda, mikroklima a dlouhodobá správa instalace.' }
      ]} />}

      <section className="bg-[#12415e] text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-16 lg:flex-row lg:items-end lg:px-10 lg:py-20">
          <div>
            <p className="font-mono text-sm tracking-[.18em] uppercase text-accent">ŘEŠENÍ NA MÍRU</p>
            <h2 className="mt-4 max-w-2xl min-w-0 whitespace-normal break-words font-heading text-[clamp(2rem,7.4vw,3rem)] leading-[1.12]">{isCity ? 'Připravíme městské mlžítko pro konkrétní prostor a způsob provozu.' : isGarden ? 'Vybereme zahradní mlžítko, které bude fungovat technicky i vizuálně.' : 'Společně vybereme správný model, rozměr i způsob instalace.'}</h2>
            {(isCity || isGarden) && <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">{isCity ? 'Pošlete nám základní informace o místě. Doporučíme vhodné řešení a další postup.' : 'Stačí fotografie nebo rozměry prostoru a informace o přívodu vody. Navrhneme vhodný model a způsob instalace.'}</p>}
          </div>
          <Link to="/poptavka" className="inline-flex shrink-0 items-center gap-2 bg-accent px-6 py-3 text-base font-semibold text-accent-foreground">Nezávazná poptávka <ArrowRight size={17} /></Link>
        </div>
      </section>
    </main>
  );
}