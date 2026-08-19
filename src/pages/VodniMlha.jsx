import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, Gauge, Wind, ThermometerSun, Wrench, Wifi } from 'lucide-react';
import { setSEO } from '@/lib/seo';

const BENEFITS = [
  { icon: ThermometerSun, title: 'Lokální ochlazení', text: 'Jemné kapky se ve vzduchu částečně odpařují a odebírají okolnímu prostředí teplo. Výsledný efekt závisí na teplotě, vlhkosti a proudění vzduchu.' },
  { icon: Gauge, title: 'Nízkotlaké řešení', text: 'Vybraná mlžítka MLŽIDLA.cz pracují s běžným vodovodním tlakem. Není nutné automaticky navrhovat vysokotlaké čerpadlo pro každou instalaci.' },
  { icon: Wifi, title: 'Smart provoz', text: 'Časové plány, teplotní podmínky, vzdálené sepnutí a další scénáře pomáhají spouštět mlžení pouze ve chvíli, kdy dává smysl.' },
  { icon: Wrench, title: 'Servisovatelnost', text: 'Filtrace, přístup k armaturám, proplach a zazimování řešíme už při návrhu, aby byl dlouhodobý provoz předvídatelný.' },
];

export default function VodniMlha() {
  useEffect(() => {
    setSEO({
      title: 'Vodní mlha pro zahrady, terasy a veřejný prostor',
      description: 'Vodní mlha pro ochlazení zahrad, teras, pergol, parků a veřejného prostoru. Vysvětlení principu, nízkotlakého mlžení, trysek, spotřeby a Smart řízení MLŽIDLA.cz.',
      keywords: 'vodní mlha, vodní mlha na zahradu, vodní mlha na terasu, mlha na zahradu, zahradní mlha, vodní mlha na pergolu, trysky na vodní mlhu, nízkotlaké mlžení',
      canonicalPath: '/vodni-mlha',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'TechArticle',
            headline: 'Vodní mlha pro ochlazení venkovního prostoru',
            description: 'Praktické vysvětlení vodní mlhy, nízkotlakého mlžení, trysek a použití na zahradách, terasách a ve veřejném prostoru.',
            author: { '@type': 'Organization', name: 'HolmTec' },
            publisher: { '@type': 'Organization', name: 'HolmTec' },
            mainEntityOfPage: 'https://mlzidla.cz/vodni-mlha'
          },
          {
            '@type': 'FAQPage',
            mainEntity: [
              { '@type': 'Question', name: 'Co je vodní mlha?', acceptedAnswer: { '@type': 'Answer', text: 'Vodní mlha vzniká rozprášením vody přes jemné trysky na malé kapky. Část kapek se ve vzduchu odpaří a pomáhá snižovat tepelnou zátěž v okolí mlžicí zóny.' } },
              { '@type': 'Question', name: 'Je pro vodní mlhu vždy nutné vysokotlaké čerpadlo?', acceptedAnswer: { '@type': 'Answer', text: 'Ne. Pro řadu zahradních a veřejných aplikací lze navrhnout nízkotlaké mlžení napojené na běžný vodovodní řad. Konkrétní řešení závisí na požadované jemnosti mlhy, tlaku a průtoku.' } },
              { '@type': 'Question', name: 'Kam se vodní mlha hodí?', acceptedAnswer: { '@type': 'Answer', text: 'Vodní mlha se používá na zahradách, terasách, pergolách, v parcích, na náměstích, sportovištích, dětských hřištích a dalších venkovních místech s tepelnou zátěží.' } }
            ]
          }
        ]
      },
    });
  }, []);

  return (
    <main className="bg-white pt-16">
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_75%_20%,#46d6e8_0,transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <p className="font-mono text-xs uppercase tracking-[.2em] text-accent">VODNÍ MLHA · PRINCIP A POUŽITÍ</p>
          <h1 className="mt-5 max-w-5xl font-heading text-5xl leading-[.98] tracking-[-.03em] sm:text-6xl lg:text-7xl">Vodní mlha jako jednoduchý způsob ochlazení venkovního prostoru.</h1>
          <p className="mt-7 max-w-3xl text-lg leading-relaxed text-white/72">Od zahradní terasy po městské náměstí. Správně navržené trysky vytvářejí jemnou mlhu, která pomáhá ochladit okolí a přitom může fungovat i bez vysokotlakého čerpadla.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/mlzidla-mlzitka" className="btn-metallic-mist inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold">Vybrat mlžítko <ArrowRight size={16} /></Link>
            <Link to="/mlhoviste" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white">Mlhoviště <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[.85fr_1.15fr] lg:px-10 lg:py-24">
        <div>
          <p className="font-mono text-xs uppercase tracking-[.18em] text-secondary">JAK TO FUNGUJE</p>
          <h2 className="mt-4 font-heading text-4xl leading-tight text-foreground lg:text-5xl">Voda se mění na jemné kapky. Část energie okolí spotřebuje jejich odpaření.</h2>
        </div>
        <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>Tryska rozdělí proud vody na malé kapky. Čím vhodnější je kombinace tlaku, otvoru trysky a proudění vzduchu, tím jemnější a účinnější může být výsledná mlha. V horkém a sušším počasí se část kapek rychle odpařuje a odebírá teplo z okolního vzduchu.</p>
          <p>Pro praktický návrh proto nestačí jen počet trysek. Sledujeme tlak vody, průtok, vzdálenost lidí od mlžení, vítr, vlhkost, požadovanou intenzitu a způsob spouštění.</p>
          <Link to="/jak-to-funguje" className="inline-flex items-center gap-2 font-semibold text-primary">Detail technologie a evaporace <ArrowRight size={16} /></Link>
        </div>
      </section>

      <section className="border-y border-border bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <article key={title} className="border border-border bg-white p-7">
                <Icon size={23} className="text-secondary" strokeWidth={1.6} />
                <h3 className="mt-8 font-heading text-2xl text-foreground">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="border-t border-border pt-7">
            <div className="flex items-center gap-3"><Droplets className="text-secondary" size={22} /><p className="font-mono text-xs uppercase tracking-[.18em] text-secondary">ZAHRADA · TERASA · PERGOLA</p></div>
            <h2 className="mt-5 font-heading text-3xl text-foreground lg:text-4xl">Vodní mlha na zahradu bez vizuálního kompromisu.</h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">Místo hadic zavěšených pod pergolou lze použít samostatný nerezový designový prvek. Mlžítko se stává součástí prostoru a lze ho doplnit o sezonní připojení, chytrý ventil nebo zemní kotvení podle modelu.</p>
            <Link to="/zahradni-mlzitka" className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">Zahradní mlžítka <ArrowRight size={16} /></Link>
          </div>
          <div className="border-t border-border pt-7">
            <div className="flex items-center gap-3"><Wind className="text-secondary" size={22} /><p className="font-mono text-xs uppercase tracking-[.18em] text-secondary">MĚSTA · PARKY · SPORTOVIŠTĚ</p></div>
            <h2 className="mt-5 font-heading text-3xl text-foreground lg:text-4xl">Řízené ochlazovací body pro veřejný prostor.</h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">Ve veřejném prostoru řešíme odolnost, vandalismus, přístup k servisu, provozní režim a spotřebu vody. Více prvků lze rozdělit do samostatných zón a řídit podle času, teploty nebo provozního harmonogramu.</p>
            <Link to="/mestske-mlzitka" className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">Městská mlžítka <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      <section className="bg-[#12415e] text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-16 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:py-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.18em] text-accent">NÁVRH SYSTÉMU</p>
            <h2 className="mt-4 max-w-3xl font-heading text-4xl">Chcete vodní mlhu pro konkrétní prostor? Navrhneme počet prvků, napojení i řízení.</h2>
          </div>
          <Link to="/poptavka" className="btn-metallic-mist inline-flex shrink-0 items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold">Nezávazná konzultace <ArrowRight size={16} /></Link>
        </div>
      </section>
    </main>
  );
}
