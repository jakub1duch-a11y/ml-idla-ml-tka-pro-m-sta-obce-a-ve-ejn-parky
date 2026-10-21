import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, TrainFront, Dumbbell, Hotel, Landmark } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import AllProductsCatalog from '@/components/kategorie/AllProductsCatalog';
import B2BPortfolioNavigation from '@/components/kategorie/B2BPortfolioNavigation';

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
    <section className="relative overflow-hidden bg-[#082C3F] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(38,198,233,.28),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-24 lg:px-10 lg:pb-24 lg:pt-32">
        <nav aria-label="Drobečková navigace" className="mb-8 text-sm text-white/60"><Link to="/" className="hover:text-white">Domů</Link><span className="mx-2">/</span><Link to="/katalog-mlzitek" className="hover:text-white">Řešení podle využití</Link><span className="mx-2">/</span><span className="text-white">{data.title}</span></nav>
        <div className="mb-5 flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10"><Icon size={23} /></span><p className="font-mono text-xs uppercase tracking-[.18em] text-cyan-200">{data.eyebrow}</p></div>
        <h1 className="max-w-4xl font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{data.title}</h1>
        <p className="mt-6 max-w-3xl text-base leading-7 text-white/75 sm:text-lg">{data.description}</p>
        <div className="mt-8 flex flex-wrap gap-3"><a href="#katalog-produktu" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#082C3F] hover:bg-cyan-50">Prohlédnout všechny produkty <ArrowRight size={17} /></a><Link to="/poptavka" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">Poptat návrh řešení</Link></div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
      <h2 className="font-heading text-2xl font-semibold text-slate-950">Typická místa instalace</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{data.uses.map((use) => <div key={use} className="rounded-2xl border border-slate-200 bg-white p-5 text-sm font-medium text-slate-700"><span className="mb-3 block h-1 w-8 rounded-full bg-cyan-500" />{use}</div>)}</div>
    </section>
    <AllProductsCatalog categoryTitle={data.title.toLocaleLowerCase('cs')} />
    <B2BPortfolioNavigation current={data.title} />
  </main>;
}
