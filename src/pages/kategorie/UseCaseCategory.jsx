import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, TrainFront, Dumbbell, Hotel, Landmark } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import PremiumSegmentHero from '@/components/kategorie/PremiumSegmentHero';
import AllProductsCatalog from '@/components/kategorie/AllProductsCatalog';
import B2BPortfolioNavigation from '@/components/kategorie/B2BPortfolioNavigation';

const MEDIA = {
  bendy: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9220ff350_generated_image.png',
  linea: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/6af16b6a9_linea---rezidencni-mlzeni.jpg',
  aura: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/c177ac820_generated_image.png',
  gate: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/c0c1438ab_generated_image.png'
};

const COLLECTIONS = [
  { name: 'BENDY', slug: 'mlzitko-bendy', description: 'Ohýbaný prvek do pobytových a pěších zón.', image: MEDIA.bendy },
  { name: 'LINEA', slug: 'linea-mlzitko', description: 'Minimalistický vertikální systém vhodný do liniových sestav.', image: MEDIA.linea },
  { name: 'BRÁNA GATE', slug: 'mlzna-brana-gate', description: 'Průchozí mlžná brána pro rozsáhlejší veřejný prostor.', image: MEDIA.gate }
];

const CATEGORIES = {
  'dopravni-uzly': {
    title: 'Ochlazování nádraží a dopravních uzlů',
    eyebrow: 'Veřejná infrastruktura / čekací a pěší zóny',
    description: 'Jemná vodní mlha jako součást pobytových míst u nádraží, terminálů a zastávek. Návrh přizpůsobíme skutečnému pohybu cestujících, bezbariérovým trasám, údržbě a možnostem napojení.',
    icon: TrainFront,
    image: MEDIA.bendy,
    uses: ['Přednádražní prostranství', 'Přestupní terminály', 'Autobusová nádraží', 'Čekací a pěší zóny'],
    considerations: [
      ['Pohyb cestujících', 'Zachování průchodnosti, rozhledů a přístupnosti včetně vozíčkářů.'],
      ['Bezpečné umístění', 'Vhodná vzdálenost od elektrického zařízení, nástupišť a zón s požadavky na suchý povrch.'],
      ['Provoz a servis', 'Dostupný přívod vody, možnost uzavření, odvodnění, čištění a sezónní údržby.']
    ],
    keywords: 'mlžítka dopravní uzly, ochlazování nádraží, mlžení zastávek, mlžítka pro terminály'
  },
  sportoviste: {
    title: 'Mlžítka pro sportoviště a rekreační areály',
    eyebrow: 'Sport / pohyb / venkovní odpočinek',
    description: 'Navrhujeme mlžicí body pro odpočinkové a nástupní zóny sportovních areálů. Provozní režim a umístění určujeme podle návštěvnosti, přívodu vody a podmínek areálu.',
    icon: Dumbbell,
    image: MEDIA.linea,
    uses: ['Odpočinkové zóny sportovců', 'Vstupy a areálové promenády', 'Běžecké a cyklistické trasy', 'Pobytové plochy mimo hrací povrchy'],
    considerations: [
      ['Povrchy a odvodnění', 'Umístění mimo místa, kde by vlhkost mohla zhoršit přilnavost povrchu.'],
      ['Rozvržení mlžení', 'Směr trysek a časové režimy volíme s ohledem na pohyb návštěvníků.'],
      ['Jednoduchý servis', 'Kontrola filtrace, trysek a přístupu k uzavíracím prvkům.']
    ],
    keywords: 'mlžítka sportoviště, mlžicí zóny pro sport, ochlazování sportovních areálů'
  },
  'hotely-resorty': {
    title: 'Mlžítka pro hotely a resorty',
    eyebrow: 'Hospitality / terasy / zahrady',
    description: 'Designové nerezové prvky pro letní pobytové zóny hotelů, terasy a zahrady. Výběr tvaru a řízení navazujeme na architekturu, komfort hostů a servisní možnosti místa.',
    icon: Hotel,
    image: MEDIA.aura,
    uses: ['Hotelové terasy', 'Zahradní odpočinkové zóny', 'Vstupy a nádvoří', 'Resortové promenády'],
    considerations: [
      ['Architektonická návaznost', 'Volba tvaru a povrchového provedení do konkrétního prostředí.'],
      ['Komfort hostů', 'Směr mlžení s ohledem na nábytek, vstupy a obvyklý pohyb lidí.'],
      ['Režimy provozu', 'Časové spínání a volitelné chytré ovládání podle projektu.']
    ],
    keywords: 'mlžítka hotely, mlžení teras, mlžítka wellness, ochlazování resortů'
  },
  'verejne-instituce': {
    title: 'Mlžítka pro veřejné instituce',
    eyebrow: 'Veřejné budovy / návštěvníci / pobytové zóny',
    description: 'Lokální mlžicí řešení pro nádvoří, přístupové prostory a zahrady veřejných budov. Navrhneme umístění s ohledem na pohyb návštěvníků, přístupnost a pravidelnou údržbu.',
    icon: Landmark,
    image: MEDIA.gate,
    uses: ['Vstupy do veřejných budov', 'Nádvoří a pěší zóny', 'Pobytové zahrady', 'Areály městských organizací'],
    considerations: [
      ['Přístupnost', 'Volné přístupové trasy a vhodný prostor kolem mlžítka.'],
      ['Stavební připravenost', 'Koordinace kotvení, přívodu vody a případného napájení.'],
      ['Předání provozovateli', 'Srozumitelný postup obsluhy, údržby a zazimování.']
    ],
    keywords: 'mlžítka veřejné budovy, mlžení institucí, ochlazování veřejných areálů'
  }
};

export default function UseCaseCategory() {
  const { categorySlug } = useParams();
  const data = CATEGORIES[categorySlug];

  useEffect(() => {
    if (!data) {
      setSEO({ title: 'Kategorie nenalezena | MLŽIDLA.cz', robots: 'noindex, follow' });
      return;
    }
    setSEO({
      title: `${data.title} | MLŽIDLA.cz`,
      description: data.description,
      keywords: data.keywords,
      canonicalPath: `/kategorie/${categorySlug}`,
      robots: 'index, follow'
    });
  }, [categorySlug, data]);

  if (!data) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-32 text-[#2B3A42]">
        <h1 className="font-heading text-3xl font-bold">Tuto kategorii jsme nenašli.</h1>
        <p className="mt-4 text-slate-600">Vyberte jiné řešení nebo si prohlédněte katalog produktů.</p>
        <Link to="/katalog-mlzitek" className="mt-8 inline-flex items-center gap-2 font-semibold text-[#0B829D]">
          Přejít do katalogu <ArrowRight size={17} />
        </Link>
      </main>
    );
  }

  const Icon = data.icon;
  return (
    <main className="min-h-screen bg-[#F8F9FA]">
      <PremiumSegmentHero
        eyebrow={data.eyebrow}
        title={data.title}
        description={data.description}
        image={data.image}
        imageAlt={`Produktová vizualizace MLŽIDLA.cz pro kategorii ${data.title}`}
        highlights={['Architektonický návrh', 'Stavební připravenost', 'Volitelné chytré řízení']}
        primary={{ label: 'Poptat řešení pro lokalitu', to: '/poptavka' }}
        secondary={{ label: 'Technické podklady', to: '/ke-stazeni' }}
      />
      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24" aria-labelledby="use-cases-heading">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#0B829D]">Kde řešení dává smysl</p>
            <h2 id="use-cases-heading" className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#2B3A42] sm:text-4xl">Prostor rozhoduje o návrhu.</h2>
          </div>
          <Icon className="h-10 w-10 text-[#00B4D8]" aria-hidden="true" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.uses.map((use, i) => (
            <article key={use} className="rounded-[1.3rem] border border-[#E6EBEF] bg-white p-6 shadow-[0_14px_40px_rgba(18,44,58,.04)]">
              <span className="font-mono text-sm font-semibold text-[#00B4D8]">0{i+1}</span>
              <h3 className="mt-5 font-heading text-lg font-semibold text-[#2B3A42]">{use}</h3>
            </article>
          ))}
        </div>
      </section>
      <section className="border-y border-[#E6EBEF] bg-white" aria-labelledby="planning-heading">
        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[#0B829D]">Projektová spolupráce</p>
              <h2 id="planning-heading" className="mt-3 font-heading text-3xl font-bold tracking-tight text-[#2B3A42] sm:text-4xl">Co ověřujeme před instalací.</h2>
              <p className="mt-5 text-base leading-7 text-slate-600">Nejdřív zhodnotíme lokalitu a technické podmínky. Konkrétní umístění, počet prvků a režim mlžení stanovíme až podle projektu.</p>
              <Link to="/ke-stazeni" className="mt-7 inline-flex items-center gap-2 font-semibold text-[#0B829D] hover:underline">
                Prohlédnout technické podklady <ArrowRight size={17} />
              </Link>
            </div>
            <div className="grid gap-3">
              {data.considerations.map(([title, description]) => (
                <article key={title} className="flex gap-4 rounded-2xl border border-[#E6EBEF] bg-[#F8F9FA] p-5 sm:p-6">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#00B4D8]" aria-hidden="true" />
                  <div><h3 className="font-heading font-semibold text-[#2B3A42]">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{description}</p></div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24" aria-labelledby="collections-heading">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#0B829D]">Vybrané produktové řady</p>
        <h2 id="collections-heading" className="mt-3 font-heading text-3xl font-bold text-[#2B3A42] sm:text-4xl">Designové prvky do veřejného prostoru.</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {COLLECTIONS.map((p) => (
            <Link key={p.slug} to={`/produkt/${p.slug}`} className="group overflow-hidden rounded-[1.4rem] border border-[#E6EBEF] bg-white transition hover:-translate-y-1 hover:shadow-xl">
              <div className="aspect-[4/3] bg-[#E6EBEF]"><img src={p.image} alt={`Produktová řada ${p.name}`} loading="lazy" decoding="async" className="h-full w-full object-contain" /></div>
              <div className="p-6"><h3 className="font-heading text-xl font-bold text-[#2B3A42]">{p.name}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{p.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0B829D]">Detail produktu <ArrowRight size={16} aria-hidden="true" /></span></div>
            </Link>
          ))}
        </div>
        <p className="mt-5 text-xs text-slate-500">Fotografie a produktové vizualizace jsou ilustrační. Přesnou konfiguraci a umístění potvrdíme podle konkrétního projektu.</p>
      </section>
      <AllProductsCatalog categoryTitle={data.title.toLocaleLowerCase('cs')} />
      <B2BPortfolioNavigation current={data.title} />
    </main>
  );
}
