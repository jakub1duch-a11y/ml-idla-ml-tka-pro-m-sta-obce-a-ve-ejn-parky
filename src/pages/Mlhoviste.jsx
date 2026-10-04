import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, Trees, Building2, ShieldCheck, Gauge, Sparkles } from 'lucide-react';
import { setSEO } from '@/lib/seo';

const USE_CASES = [
  { icon: Building2, title: 'Města a veřejný prostor', text: 'Mlhoviště pro náměstí, parky, pěší zóny, školy, hřiště a sportoviště s důrazem na odolnost, servis a bezpečný provoz.' },
  { icon: Trees, title: 'Zahrady a terasy', text: 'Designové mlhoviště pro zahradu, terasu, pergolu nebo hotelový venkovní prostor bez nutnosti vysokotlakého čerpadla.' },
  { icon: Sparkles, title: 'Řešení na míru', text: 'Tvar, počet prvků, rozmístění trysek, kotvení i Smart řízení přizpůsobíme konkrétnímu prostoru a způsobu použití.' },
];

const FACTS = [
  { icon: Gauge, label: 'Typické napojení', value: 'běžný vodovodní řad' },
  { icon: Droplets, label: 'Princip', value: 'jemná vodní mlha' },
  { icon: ShieldCheck, label: 'Konstrukce', value: 'nerezové provedení' },
];

export default function Mlhoviste() {
  useEffect(() => {
    setSEO({
      title: 'Mlhoviště pro města, zahrady a dětská hřiště',
      description: 'Navrhujeme nerezová mlhoviště a mlžné zóny pro města, parky, dětská hřiště, zahrady a terasy. Nízkotlaké řešení na vodovodní řad, Smart řízení a zakázková výroba.',
      keywords: 'mlhoviště, mlhoviste, mlhoviště na zahradu, dětské mlhoviště, mobilní mlhoviště, mlžná zóna, mlžení veřejný prostor',
      canonicalPath: '/mlhoviste',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Service',
            name: 'Nerezová mlhoviště a mlžné zóny',
            provider: { '@type': 'Organization', name: 'HolmTec' },
            areaServed: 'CZ',
            serviceType: 'Návrh, výroba a instalace mlhovišť pro veřejný a soukromý prostor',
            url: 'https://mlzidla.cz/mlhoviste'
          },
          {
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'Co je mlhoviště?', acceptedAnswer: { '@type': 'Answer', text: 'Mlhoviště je venkovní zóna s jedním nebo více mlžicími prvky, které vytvářejí jemnou vodní mlhu pro lokální ochlazení a osvěžení prostoru.' } },
              { '@type': 'Question', name: 'Lze mlhoviště připojit na běžný vodovodní řad?', acceptedAnswer: { '@type': 'Answer', text: 'Ano. U nízkotlakých konfigurací MLŽIDLA.cz lze systém navrhnout pro běžný vodovodní tlak bez vysokotlakého čerpadla; konkrétní parametry se ověřují podle instalace.' } },
              { '@type': 'Question', name: 'Je možné automatické řízení?', acceptedAnswer: { '@type': 'Answer', text: 'Ano. Mlhoviště lze doplnit o Smart řízení podle času, teploty, provozního harmonogramu nebo dalšího zvoleného scénáře.' } }
            ]
          }
        ]
      },
    });
  }, []);

  return (
    <main className="bg-white pt-16">
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-end lg:px-10 lg:py-28">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.2em] text-accent">MLHOVIŠTĚ · MLŽNÉ ZÓNY</p>
            <h1 className="mt-5 max-w-4xl font-heading text-5xl leading-[.98] tracking-[-.03em] sm:text-6xl lg:text-7xl">Mlhoviště pro veřejný prostor, zahrady i dětská hřiště.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">Navrhujeme čisté nerezové mlžné zóny, které ochlazují konkrétní místo bez složité technologie navíc. Od jednoho prvku po větší sestavu pro vysokou návštěvnost.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/poptavka" className="btn-metallic-mist inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold">Navrhnout mlhoviště <ArrowRight size={16} /></Link>
              <Link to="/smart-ovladani" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white">Smart řízení <ArrowRight size={16} /></Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {FACTS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="border border-white/15 bg-white/5 p-5">
                <Icon size={20} className="text-accent" strokeWidth={1.6} />
                <p className="mt-4 text-[11px] font-mono uppercase tracking-[.16em] text-white/45">{label}</p>
                <p className="mt-1 font-heading text-xl text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[.18em] text-secondary">VYUŽITÍ</p>
          <h2 className="mt-4 font-heading text-4xl leading-tight text-foreground lg:text-5xl">Jedno řešení, různé typy prostoru.</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">Mlhoviště není hotový set bez kontextu. Nejprve řešíme pohyb lidí, velikost plochy, přívod vody, proudění vzduchu a způsob provozu. Teprve potom volíme počet a rozmístění mlžicích prvků.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {USE_CASES.map(({ icon: Icon, title, text }) => (
            <article key={title} className="border border-border bg-slate-50 p-7">
              <Icon size={24} className="text-secondary" strokeWidth={1.6} />
              <h3 className="mt-8 font-heading text-2xl text-foreground">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:px-10 lg:py-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.18em] text-secondary">NÍZKOTLAKÉ MLŽENÍ</p>
            <h2 className="mt-4 font-heading text-3xl text-foreground lg:text-4xl">Bez vysokotlakého čerpadla, pokud to podmínky dovolí.</h2>
          </div>
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            <p>Pro řadu realizací používáme nízkotlaké řešení připojené na běžný vodovodní řad. Díky tomu je instalace jednodušší a servis méně náročný. Konkrétní tlak, průtok a typ trysek vždy navrhujeme podle výsledného efektu a dostupného zdroje vody.</p>
            <p>Pro města a veřejné instalace lze systém doplnit o filtraci, proplach, časový plán, teplotní automatiku, vzdálené ovládání a měření spotřeby vody.</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/jak-to-funguje" className="inline-flex items-center gap-2 font-semibold text-primary">Jak funguje vodní mlha <ArrowRight size={15} /></Link>
              <Link to="/kalkulacka" className="inline-flex items-center gap-2 font-semibold text-primary">Kalkulačka spotřeby <ArrowRight size={15} /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#12415e] text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-16 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:py-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.18em] text-accent">PROJEKT NA MÍRU</p>
            <h2 className="mt-4 max-w-3xl font-heading text-4xl">Pošlete fotografii nebo půdorys prostoru. Navrhneme vhodné mlhoviště.</h2>
          </div>
          <Link to="/poptavka" className="btn-metallic-mist inline-flex shrink-0 items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold">Nezávazná poptávka <ArrowRight size={16} /></Link>
        </div>
      </section>
    </main>
  );
}
