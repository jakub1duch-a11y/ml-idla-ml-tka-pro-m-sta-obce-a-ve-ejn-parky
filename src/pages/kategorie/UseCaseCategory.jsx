import EditorialPhotoHero from '@/components/editorial/EditorialPhotoHero';
import React, { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, TrainFront, Dumbbell, Hotel, Landmark } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import AllProductsCatalog from '@/components/kategorie/AllProductsCatalog';
import B2BPortfolioNavigation from '@/components/kategorie/B2BPortfolioNavigation';
import StebloSpaceFeature from '@/components/products/StebloSpaceFeature';

const CATEGORIES = {
  'dopravni-uzly': {
    title: 'Dopravní uzly a nádraží',
    eyebrow: 'Ochlazování dopravní infrastruktury',
    description: 'Mlžicí prvky pro přednádražní prostory, zastávky, přestupní terminály a pěší přístupové trasy. Návrh zohledňuje pohyb cestujících, průchodnost, přívod vody a údržbu.',
    icon: TrainFront,
    uses: ['Nádražní předprostory', 'Přestupní terminály', 'Autobusová nádraží', 'Zastávky a pěší koridory'],
    placementTitle: 'Prostor pro čekání, bez omezení průchodu.',
    placementText: 'Mlžítko má doplnit místo krátkého zastavení. V průchodech zůstává prioritou přístupnost a bezpečný pohyb cestujících.',
    planning: [
      ['Průchodnost', 'Ponechat průchozí trasy a bezbariérové vazby bez kolizí s konstrukcí.'],
      ['Vítr a povrchy', 'Prověřit směr šíření mlhy k nástupištím, fasádám a místům čekání.'],
      ['Technická příprava', 'Dostupnost vody, servisní přístup a provozní režim řešit se správcem prostoru.'],
    ],
    keywords: 'mlžítka dopravní uzly, ochlazování nádraží, mlžení zastávek, mlžítka pro terminály'
  },
  'sportoviste': {
    title: 'Sportoviště a rekreační areály',
    eyebrow: 'Ochlazení při sportu a pohybu',
    description: 'Mlžicí zóny pro sportovní areály, tribuny, venkovní posilovny, běžecké trasy a odpočinková místa. Konfiguraci volíme podle provozu a nároků na odolnost.',
    icon: Dumbbell,
    uses: ['Sportovní areály', 'Tribuny a vstupy', 'Běžecké a cyklistické trasy', 'Venkovní posilovny'],
    placementTitle: 'Osvěžovací bod mimo hlavní pohybové trasy.',
    placementText: 'Umístění mlžítka je potřeba sladit s pohybem sportovců, diváků a údržbou areálu. Vhodný prostor posoudíme podle provozní situace.',
    planning: [
      ['Pohyb osob', 'Prověřit kolize s běžeckými trasami, vstupy a nástupními plochami.'],
      ['Mokré povrchy', 'Vlhkost a proudění vzduchu mohou měnit chování mlhy a stav povrchu.'],
      ['Řízení provozu', 'Nastavitelný časový plán lze řešit podle konkrétního technického vybavení.'],
    ],
    keywords: 'mlžítka sportoviště, mlžicí zóny pro sport, ochlazování sportovních areálů'
  },
  'hotely-resorty': {
    title: 'Hotely, resorty a wellness',
    eyebrow: 'Komfort venkovních pobytových zón',
    description: 'Designová mlžítka pro hotelové vstupy, terasy, zahrady, nádvoří a wellness areály. Návrh propojuje komfort hostů, architekturu a servisní přístup.',
    icon: Hotel,
    image: '/media/optimized/03ba352a3_mlzitka-zahradni-hotely-restaurace.webp',
    imageAlt: 'Ilustrační vizualizace nerezového mlžítka u venkovní terasy',
    uses: ['Hotelové terasy', 'Vstupy a nádvoří', 'Wellness zahrady', 'Resorty a venkovní lounge'],
    placementTitle: 'Mlžítko jako součást zahrady, ne překážka u stolu.',
    placementText: 'Pro hotelové terasy a pobytové zóny doporučujeme nízkotlaké mlžítko umístit mimo bezprostřední posezení. Při návrhu zohledníme charakter zahrady i provoz hostů.',
    planning: [
      ['Odstup od posezení', 'Mlžítko nízkotlakého typu neumisťovat přímo mezi stoly a lavičky.'],
      ['Proudění vzduchu', 'Mlha může být větrem přenesena i několik metrů; suchý povrch nelze vždy zaručit.'],
      ['Vzhled a servis', 'Vybrat provedení odpovídající architektuře a zajistit přístup k filtraci a ovládání.'],
    ],
    keywords: 'mlžítka hotely, mlžení teras, mlžítka wellness, ochlazování resortů'
  },
  'verejne-instituce': {
    title: 'Veřejné instituce a budovy',
    eyebrow: 'Veřejné budovy a pobytové plochy',
    description: 'Řešení pro vstupy do veřejných budov, nádvoří, školní areály, úřady a instituce. Pomůžeme určit vhodné umístění, technickou přípravu i návazný servis.',
    icon: Landmark,
    uses: ['Úřady a veřejné budovy', 'Nádvoří a vstupní zóny', 'Školní a institucionální areály', 'Pěší přístupové trasy'],
    placementTitle: 'Pobytový prostor s jasnou správou a údržbou.',
    placementText: 'U veřejných budov je podstatné návazné fungování zařízení: napojení, dostupnost pro servis a provozní odpovědnost správce objektu.',
    planning: [
      ['Přístupnost', 'Umístit prvek mimo bezbariérové a hlavní přístupové trasy.'],
      ['Provoz a voda', 'Předem vyjasnit zdroj vody, filtraci, ovládání a správu zařízení.'],
      ['Návazné podklady', 'Domluvit rozsah technické dokumentace a stavební připravenosti.'],
    ],
    keywords: 'mlžítka veřejné budovy, mlžení institucí, ochlazování veřejných areálů'
  }
};

export default function UseCaseCategory() {
  const { categorySlug } = useParams();
  const data = CATEGORIES[categorySlug] || null;
  const Icon = data?.icon;

  useEffect(() => {
    if (!data) return;
    setSEO({
      title: `${data.title} | MLŽIDLA.cz`,
      description: data.description,
      keywords: data.keywords,
      canonicalPath: `/kategorie/${categorySlug}`,
      robots: 'index, follow'
    });
  }, [categorySlug, data]);

  if (!data) return <Navigate to="/katalog-mlzitek" replace />;

  return <main className="min-h-screen bg-white">
    <EditorialPhotoHero
      eyebrow={data.eyebrow}
      title={data.title}
      description={data.description}
      image={data.image || '/media/optimized/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.webp'}
      imageAlt={data.imageAlt || 'Ilustrační vizualizace mlžítka v městském parku'}
      credit="Katalogová vizualizace · není fotografií potvrzené realizace"
      cta="Prohlédnout katalog"
      href="#katalog-produktu"
      headingLevel="h1"
    />
    <div className="border-b border-[#D7E4EA] bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <nav aria-label="Drobečková navigace" className="flex flex-wrap items-center gap-2 text-xs text-[#536F7E]">
          <Link to="/" className="hover:text-[#0B597A]">Domů</Link>
          <span aria-hidden="true">/</span>
          <Link to="/katalog-mlzitek" className="hover:text-[#0B597A]">Řešení podle využití</Link>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-[#102E3E]">{data.title}</span>
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          <span className="hidden items-center gap-2 text-xs font-medium text-[#476978] md:inline-flex"><Icon size={16} aria-hidden="true" /> Podle podmínek místa</span>
          <Link
            to="/poptavka"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#103549] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#19506A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B8FB6]"
          >
            Poptat řešení pro prostor <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
    <section aria-labelledby="usecase-planning-heading" className="border-b border-[#D7E5E9] bg-[#F6F9FA] py-14 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[.82fr_1.18fr] lg:gap-16 lg:px-10">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#22758A]">Návrh podle způsobu využití</p>
          <h2 id="usecase-planning-heading" className="mt-4 max-w-xl font-heading text-3xl font-semibold leading-[1.1] tracking-[-.03em] text-[#0C2B3D] sm:text-4xl">
            {data.placementTitle}
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-[#526D79]">{data.placementText}</p>
          <Link to="/poptavka" className="mt-6 inline-flex min-h-11 items-center gap-2 border-b-2 border-[#22758A] pb-1 text-sm font-semibold text-[#0C4054] hover:border-[#0C4054] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22758A]">
            Posoudit konkrétní místo <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="min-w-0">
          <div className="border-t border-[#C9DBE2] py-5">
            <h3 className="font-heading text-base font-semibold text-[#173D50]">Typická místa instalace</h3>
            <div className="mt-4 grid gap-x-8 sm:grid-cols-2">
              {data.uses.map((use, index) => (
                <div key={use} className="flex items-baseline gap-3 border-b border-[#DEE8EB] py-3.5">
                  <span className="font-mono text-[11px] font-semibold text-[#267F93]">0{index + 1}</span>
                  <span className="text-sm font-medium leading-6 text-[#193F50]">{use}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-5 border-t border-[#C9DBE2] py-5">
            <h3 className="font-heading text-base font-semibold text-[#173D50]">Co ověřit před návrhem</h3>
            <div className="mt-4 divide-y divide-[#DEE8EB]">
              {data.planning.map(([title, description], index) => (
                <article key={title} className="grid gap-2 py-5 sm:grid-cols-[2.75rem_1fr]">
                  <span className="font-mono text-xs font-bold text-[#267F93]">0{index + 1}</span>
                  <div>
                    <h4 className="font-heading text-lg font-semibold text-[#0C2B3D]">{title}</h4>
                    <p className="mt-1 text-sm leading-6 text-[#526D79]">{description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <p className="mt-3 border-l-2 border-[#88B9C6] pl-4 text-xs leading-6 text-[#526D79]">
            Rozmístění a výsledný provoz se posuzují podle skutečných podmínek místa. Ilustrační vizualizace v úvodu neurčuje instalační vzdálenost ani konkrétní produkt.
          </p>
        </div>
      </div>
    </section>
    {categorySlug === 'hotely-resorty' && <StebloSpaceFeature context="hotel" />}
    <AllProductsCatalog categoryTitle={data.title.toLocaleLowerCase('cs')} />
    <B2BPortfolioNavigation current={data.title} />
  </main>;
}
