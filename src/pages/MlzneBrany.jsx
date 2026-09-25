import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Droplets, Ruler, ShieldCheck, Wifi, Trees, Dumbbell, School } from 'lucide-react';
import { setSEO } from '@/lib/seo';
import { base44 } from '@/api/base44Client';

const USE_CASES = [
  { icon: Building2, title: 'Náměstí a pěší zóny', text: 'Průchozí ochlazovací bod pro pobytové plochy, městská centra, předprostory veřejných budov a frekventované pěší trasy.' },
  { icon: Trees, title: 'Parky a promenády', text: 'Architektonický průchod mlhou pro cesty, odpočinkové zóny a místa, kde se lidé v horkých dnech přirozeně pohybují.' },
  { icon: Dumbbell, title: 'Sportoviště a areály', text: 'Osvěžení u vstupů, mezi zónami areálu, u tribun, koupališť a dalších míst s vysokou letní návštěvností.' },
  { icon: School, title: 'Školy a veřejná hřiště', text: 'Průchozí mlžná zóna pro školní areály, venkovní hřiště a veřejné prostory, kde je důležitý přehledný provoz a vhodné umístění.' },
];

const FEATURES = [
  { icon: Ruler, title: 'Rozměr podle místa', text: 'Průchozí šířku, výšku, počet trysek i způsob kotvení navrhujeme podle konkrétního provozu a architektury.' },
  { icon: ShieldCheck, title: 'Nerezová konstrukce', text: 'Odolné venkovní provedení s důrazem na čistý detail, servisní přístup a začlenění do veřejného prostoru.' },
  { icon: Wifi, title: 'Smart řízení', text: 'Časové plány, teplotní automatika, vzdálené ovládání a další provozní scénáře podle požadavků projektu.' },
  { icon: Droplets, title: 'Projektová příprava', text: 'Přívod vody, filtraci, servisní přístup, proplach a zazimování řešíme podle konkrétní konfigurace a místa instalace.' },
];

export default function MlzneBrany() {
  const [kruh, setKruh] = useState(null);

  useEffect(() => {
    base44.entities.Product.filter({ slug: 'mlzitko-kruh' }).then((items) => setKruh(items?.[0] || null)).catch(() => setKruh(null));
  }, []);

  useEffect(() => {
    setSEO({
      title: 'Mlžné brány pro města a obce',
      description: 'Nerezové mlžné brány pro města, obce, náměstí, parky a sportoviště. Návrh umístění, projektová podpora, Smart řízení a servis.',
      keywords: 'mlžná brána pro města, mlžné brány pro obce, mlžná brána náměstí, mlžící brána, ochlazovací brána, veřejný prostor',
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
              { '@type': 'Question', name: 'Kde se mlžná brána používá?', acceptedAnswer: { '@type': 'Answer', text: 'Mlžné brány se používají na náměstích, v parcích, pěších zónách, u škol, na sportovištích a v dalších veřejných prostorech, kde lidé přirozeně procházejí ochlazovací zónou.' } },
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
          <p className="font-mono text-xs uppercase tracking-[.2em] text-accent">MLŽNÉ BRÁNY · MĚSTA A OBCE · VEŘEJNÝ PROSTOR</p>
          <h1 className="mt-5 max-w-5xl font-heading text-5xl leading-[.98] tracking-[-.03em] sm:text-6xl lg:text-7xl">Mlžné brány pro města, obce a veřejný prostor.</h1>
          <p className="mt-7 max-w-3xl text-lg leading-relaxed text-white/72">Navrhujeme nerezové průchozí mlžné zóny pro náměstí, parky, promenády, školy a sportovní areály. Tvar, rozměr, umístění a provoz řešíme podle konkrétního místa a pohybu lidí.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/poptavka?produkt=Mlžná%20brána" className="btn-metallic-mist inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold">Získat návrh a cenu <ArrowRight size={16} /></Link>
            <Link to="/mestske-mlzitka" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white">Mlžítka pro města a obce <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="mb-10 max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-[.18em] text-secondary">DOPORUČENÉ MĚSTSKÉ VYUŽITÍ</p>
          <h2 className="mt-4 font-heading text-4xl leading-tight text-foreground">Kde mlžná brána dává největší smysl.</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">Bránu umisťujeme tam, kde přirozeně navazuje na pěší pohyb a pobyt lidí. Každý návrh posuzujeme podle prostoru, stínu, větru, návštěvnosti a provozních možností města nebo obce.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {USE_CASES.map(({ icon: Icon, title, text }) => (
            <article key={title} className="border border-border bg-white p-7 shadow-sm">
              <Icon size={23} className="text-secondary" strokeWidth={1.6} />
              <h3 className="mt-8 font-heading text-2xl text-foreground">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-12">
          <p className="font-mono text-xs uppercase tracking-[.18em] text-secondary">PROJEKT A PROVOZ</p>
          <h2 className="mt-4 max-w-3xl font-heading text-4xl leading-tight text-foreground">Technické řešení podle konkrétní lokality.</h2>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <article key={title} className="border border-border bg-slate-50 p-7">
              <Icon size={23} className="text-secondary" strokeWidth={1.6} />
              <h3 className="mt-8 font-heading text-2xl text-foreground">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {kruh && (
        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-10 lg:pb-24">
          <div className="grid overflow-hidden border border-border bg-white lg:grid-cols-[1.1fr_.9fr]">
            <div className="relative min-h-[360px] bg-slate-100">
              <img src={kruh.image_url} alt="MLŽÍTKO KRUH — kruhový mlžný portál" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 rounded-full border border-white/30 bg-black/25 px-4 py-2 text-xs font-semibold uppercase tracking-[.16em] text-white backdrop-blur-sm">KRUH · mlžný portál</div>
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
              <p className="font-mono text-xs uppercase tracking-[.18em] text-secondary">MLŽNÉ BRÁNY A PORTÁLY</p>
              <h2 className="mt-4 font-heading text-4xl leading-tight text-foreground">KRUH — průchozí mlžný portál pro městský prostor.</h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">Kruhová nerezová geometrie vytváří výrazný průchozí bod pro náměstí, promenády, parky a další pobytové zóny. Produkt zobrazujeme pouze podle ověřené referenční geometrie; prostředí a vizualizace se mohou měnit, konstrukce produktu nikoli.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to="/produkt/mlzitko-kruh" className="btn-brand-primary inline-flex items-center gap-2">Detail KRUH <ArrowRight size={16} /></Link>
                <Link to="/ai-vizualizace?produkt=MLŽÍTKO%20KRUH&slug=mlzitko-kruh" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground">Vizualizovat v prostoru <ArrowRight size={15} /></Link>
              </div>
            </div>
          </div>
        </section>
      )}

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
            <p className="font-mono text-xs uppercase tracking-[.18em] text-accent">PROJEKTOVÁ PODPORA PRO MĚSTA A OBCE</p>
            <h2 className="mt-4 max-w-3xl font-heading text-4xl">Pošlete lokalitu, fotografii nebo půdorys. Připravíme návrh umístění, konfigurace a podklad pro cenu.</h2>
          </div>
          <Link to="/poptavka?produkt=Mlžná%20brána" className="btn-metallic-mist inline-flex shrink-0 items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold">Získat návrh a cenu <ArrowRight size={16} /></Link>
        </div>
      </section>
    </main>
  );
}
