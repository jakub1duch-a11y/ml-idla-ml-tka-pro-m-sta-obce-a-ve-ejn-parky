import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Droplets, Ruler, ShieldCheck, Wifi } from 'lucide-react';
import { setSEO } from '@/lib/seo';

const FEATURES = [
  { icon: Building2, title: 'Veřejný prostor', text: 'Mlžné brány pro náměstí, parky, pěší zóny, sportovní areály, eventy a návštěvnicky vytížená místa.' },
  { icon: Ruler, title: 'Rozměr podle místa', text: 'Průchozí šířku, výšku, počet trysek i způsob kotvení upravujeme podle konkrétního provozu a architektury.' },
  { icon: ShieldCheck, title: 'Nerezová konstrukce', text: 'Odolné provedení pro dlouhodobé venkovní použití, navržené s ohledem na servis a údržbu.' },
  { icon: Wifi, title: 'Smart řízení', text: 'Časové plány, teplotní automatika, vzdálené ovládání a další provozní scénáře podle požadavků projektu.' },
];

export default function MlzneBrany() {
  useEffect(() => {
    setSEO({
      title: 'Mlžné brány pro města, parky a eventy',
      description: 'Designové nerezové mlžné brány pro města, parky, sportoviště a eventy. Nízkotlaké mlžení, zakázkové rozměry, projektová podpora a Smart řízení.',
      keywords: 'mlžná brána, mlžné brány, mlzna brana, mlžící brána, mlžící brány, mlžná brána pro města, ochlazovací brána',
      canonicalPath: '/mlzne-brany',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Service',
            name: 'Designové mlžné brány',
            provider: { '@type': 'Organization', name: 'HolmTec' },
            areaServed: 'CZ',
            serviceType: 'Návrh, výroba a instalace nerezových mlžných bran',
            url: 'https://mlzidla.cz/mlzne-brany'
          },
          {
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'Kde se mlžná brána používá?', acceptedAnswer: { '@type': 'Answer', text: 'Mlžné brány se hodí do parků, na náměstí, pěší zóny, sportoviště, festivaly a další venkovní prostory, kde lidé přirozeně procházejí ochlazovací zónou.' } },
              { '@type': 'Question', name: 'Lze vyrobit mlžnou bránu na míru?', acceptedAnswer: { '@type': 'Answer', text: 'Ano. Rozměr, tvar, počet trysek, kotvení, připojení vody a způsob řízení lze upravit podle konkrétního projektu.' } },
              { '@type': 'Question', name: 'Lze mlžnou bránu řídit automaticky?', acceptedAnswer: { '@type': 'Answer', text: 'Ano. Bránu lze doplnit o Smart řízení podle času, teploty, provozního harmonogramu nebo dalšího zvoleného scénáře.' } }
            ]
          }
        ]
      },
    });
  }, []);

  return (
    <main className="bg-white pt-16">
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <p className="font-mono text-xs uppercase tracking-[.2em] text-accent">MLŽNÉ BRÁNY · PRŮCHOZÍ OCHLAZENÍ</p>
          <h1 className="mt-5 max-w-5xl font-heading text-5xl leading-[.98] tracking-[-.03em] sm:text-6xl lg:text-7xl">Mlžná brána, která ochladí průchod a současně definuje místo.</h1>
          <p className="mt-7 max-w-3xl text-lg leading-relaxed text-white/72">Navrhujeme nerezové mlžné brány jako architektonický prvek pro veřejný prostor i eventy. Od jednoduché průchozí brány po sestavy a zakázkové tvary.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/poptavka?produkt=Mlžná%20brána" className="btn-metallic-mist inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold">Poptat mlžnou bránu <ArrowRight size={16} /></Link>
            <Link to="/mestske-mlzitka" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white">Městská kolekce <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <article key={title} className="border border-border bg-slate-50 p-7">
              <Icon size={23} className="text-secondary" strokeWidth={1.6} />
              <h2 className="mt-8 font-heading text-2xl text-foreground">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:px-10 lg:py-24">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.18em] text-secondary">NÍZKOTLAKÉ MLŽENÍ</p>
            <h2 className="mt-4 font-heading text-4xl leading-tight text-foreground">Jednoduché napojení a provoz bez zbytečně složité technologie.</h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>Podle zvolené konfigurace lze bránu navrhnout pro běžný vodovodní řad. Počet trysek, jejich průtok a rozmístění volíme podle požadované intenzity mlhy, šířky průchodu a dostupného tlaku.</p>
            <p>Pro veřejné instalace doporučujeme řešit filtraci, servisní přístup, proplach, zazimování a provozní automatiku už v projektu.</p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/vodni-mlha" className="inline-flex items-center gap-2 font-semibold text-primary"><Droplets size={16}/> Vodní mlha <ArrowRight size={15}/></Link>
              <Link to="/smart-ovladani" className="inline-flex items-center gap-2 font-semibold text-primary"><Wifi size={16}/> Smart řízení <ArrowRight size={15}/></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#12415e] text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-16 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:py-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.18em] text-accent">PROJEKTOVÁ PODPORA</p>
            <h2 className="mt-4 max-w-3xl font-heading text-4xl">Pošlete rozměry nebo půdorys. Navrhneme vhodnou šířku, tvar, kotvení a počet trysek.</h2>
          </div>
          <Link to="/poptavka?produkt=Mlžná%20brána" className="btn-metallic-mist inline-flex shrink-0 items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold">Nezávazná nabídka <ArrowRight size={16} /></Link>
        </div>
      </section>
    </main>
  );
}
