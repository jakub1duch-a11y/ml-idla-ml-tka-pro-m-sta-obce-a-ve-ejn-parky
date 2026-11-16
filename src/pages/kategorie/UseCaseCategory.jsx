import EditorialPhotoHero from '@/components/editorial/EditorialPhotoHero';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
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
    keywords: 'mlžítka dopravní uzly, ochlazování nádraží, mlžení zastávek, mlžítka pro terminály'
  },
  'sportoviste': {
    title: 'Sportoviště a rekreační areály',
    eyebrow: 'Ochlazení při sportu a pohybu',
    description: 'Mlžicí zóny pro sportovní areály, tribuny, venkovní posilovny, běžecké trasy a odpočinková místa. Konfiguraci volíme podle provozu a nároků na odolnost.',
    icon: Dumbbell,
    uses: ['Sportovní areály', 'Tribuny a vstupy', 'Běžecké a cyklistické trasy', 'Venkovní posilovny'],
    keywords: 'mlžítka sportoviště, mlžicí zóny pro sport, ochlazování sportovních areálů'
  },
  'hotely-resorty': {
    title: 'Hotely, resorty a wellness',
    eyebrow: 'Komfort venkovních pobytových zón',
    description: 'Designová mlžítka pro hotelové vstupy, terasy, zahrady, nádvoří a wellness areály. Návrh propojuje komfort hostů, architekturu a servisní přístup.',
    icon: Hotel,
    uses: ['Hotelové terasy', 'Vstupy a nádvoří', 'Wellness zahrady', 'Resorty a venkovní lounge'],
    keywords: 'mlžítka hotely, mlžení teras, mlžítka wellness, ochlazování resortů'
  },
  'verejne-instituce': {
    title: 'Veřejné instituce a budovy',
    eyebrow: 'Veřejné budovy a pobytové plochy',
    description: 'Řešení pro vstupy do veřejných budov, nádvoří, školní areály, úřady a instituce. Pomůžeme určit vhodné umístění, technickou přípravu i návazný servis.',
    icon: Landmark,
    uses: ['Úřady a veřejné budovy', 'Nádvoří a vstupní zóny', 'Školní a institucionální areály', 'Pěší přístupové trasy'],
    keywords: 'mlžítka veřejné budovy, mlžení institucí, ochlazování veřejných areálů'
  }
};

export default function UseCaseCategory() {
  const { categorySlug } = useParams();
  const data = CATEGORIES[categorySlug] || CATEGORIES['dopravni-uzly'];
  const Icon = data.icon;

  useEffect(() => {
    setSEO({
      title: `${data.title} | MLŽIDLA.cz`,
      description: data.description,
      keywords: data.keywords,
      canonicalPath: `/kategorie/${categorySlug}`,
      robots: 'index, follow'
    });
  }, [categorySlug, data]);

  return <main className="min-h-screen bg-white">
    <EditorialPhotoHero
      eyebrow={data.eyebrow}
      title={data.title}
      description={data.description}
      image="/media/optimized/1e0142d25_Mlzitko-v-mestskem-parku-VDMA.webp"
      imageAlt="Ilustrační vizualizace mlžítka v městském parku"
      credit="Ilustrační vizualizace · vhodnost konkrétního výrobku se ověřuje"
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
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
      <h2 className="font-heading text-2xl font-semibold text-slate-950">Typická místa instalace</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{data.uses.map((use) => <div key={use} className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-medium text-slate-700"><span className="mb-3 block h-1 w-8 rounded-full bg-cyan-500" />{use}</div>)}</div>
    </section>
    {categorySlug === 'hotely-resorty' && <StebloSpaceFeature context="hotel" />}
    <AllProductsCatalog categoryTitle={data.title.toLocaleLowerCase('cs')} />
    <B2BPortfolioNavigation current={data.title} />
  </main>;
}
