import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, MapPin, Settings2, Wrench } from 'lucide-react';
import { setSEO } from '@/lib/seo';

const CONTENT = {
  sport: {
    path: '/mlzitka-pro-sportoviste',
    eyebrow: 'SPORTOVIŠTĚ · VENKOVNÍ AREÁLY',
    title: 'Mlžítka pro sportoviště a venkovní sportovní areály',
    description: 'Nerezová mlžítka pro sportoviště, běžecké areály, hřiště a odpočinkové zóny. Návrh umístění, napojení vody, ovládání a sezónního provozu.',
    intro: 'Vodní mlha může zpříjemnit pobyt ve venkovních sportovních areálech během horkých dnů. Umístění mlžítek navrhujeme podle pohybu sportovců, diváků, dostupnosti vody a provozních pravidel.',
    cards: [
      ['Odpočinkové zóny', 'Mlžítko u laviček, přístupových tras nebo míst, kde se návštěvníci zastavují.'],
      ['Běžecké a cyklistické areály', 'Osvěžovací bod mimo kolizní trasy, s ohledem na povrch a průchodnost.'],
      ['Tribuny a sportovní centra', 'Samostatné mlžné zóny pro diváky nebo doprovod s časovým řízením provozu.'],
    ],
    faq: [
      ['Kam umístit mlžítko na sportovišti?', 'Přednostně do pobytové zóny mimo samotnou sportovní plochu. Posuzujeme pohyb lidí, vítr, povrchy a napojení vody.'],
      ['Lze mlžení zapínat automaticky?', 'Podle konfigurace lze využít časové řízení, teplotní podmínky nebo ruční ovládání.'],
      ['Je mlžítko vhodné přímo na hrací plochu?', 'Umístění na hrací ploše vyžaduje individuální posouzení provozních a bezpečnostních rizik; standardně doporučujeme oddělenou zónu.'],
    ],
    links: [['Městská mlžítka', '/mlzitka-pro-mesta-obce'], ['Mlžné brány', '/mlzne-brany'], ['Chytré ovládání', '/smart-ovladani']],
  },
  furniture: {
    path: '/mlzitka-mestsky-mobiliar',
    eyebrow: 'MĚSTSKÝ MOBILIÁŘ · VEŘEJNÝ PROSTOR',
    title: 'Mlžítka jako součást městského mobiliáře',
    description: 'Designová nerezová mlžítka a mlžné prvky pro městský mobiliář, náměstí, parky a promenády. Návrh tvaru, kotvení, přívodu vody a údržby.',
    intro: 'Mlžný prvek může doplnit lavičky, zeleň, pěší trasy i pobytové plochy. Vybíráme tvar a umístění tak, aby nerezové mlžítko zapadlo do architektury místa a neomezovalo běžný pohyb.',
    cards: [
      ['Náměstí a pěší zóny', 'Samostatné mlžítko nebo mlžná brána v místě, kde se lidé přirozeně pohybují či zastavují.'],
      ['Parky a promenády', 'Sloupkové a liniové mlžné prvky navázané na lavičky, zeleň a odpočinkové plochy.'],
      ['Veřejné budovy', 'Ochlazovací bod před vstupem, ve dvoře nebo na terase podle možností instalace.'],
    ],
    faq: [
      ['Co patří mezi mlžné prvky městského mobiliáře?', 'Například samostatná nerezová mlžítka, sloupkové sestavy, mlžné brány a zakázkové mlžné sochy.'],
      ['Jak se mlžítko kotví?', 'Způsob kotvení vychází z konstrukce výrobku, podkladu a požadavků konkrétního veřejného prostoru.'],
      ['Co je nutné připravit před instalací?', 'Především místo instalace, přívod vody, odvodnění podle potřeby, přístup k údržbě a vhodný provozní režim.'],
    ],
    links: [['Sloupková mlžítka', '/sloupkova-mlzitka'], ['Ochlazování měst', '/mestske-ochlazovani-verejneho-prostoru'], ['Katalog mlžítek', '/katalog-mlzitek']],
  },
};

export default function SeoPublicSpace({ variant = 'sport' }) {
  const page = CONTENT[variant] || CONTENT.sport;
  useEffect(() => {
    setSEO({
      title: page.title,
      description: page.description,
      canonicalPath: page.path,
      locale: 'cs',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: page.title,
        description: page.description,
        provider: { '@type': 'Organization', name: 'HolmTec', url: 'https://holmtec.cz' },
        areaServed: { '@type': 'Country', name: 'Česká republika' },
        url: 'https://mlzidla.cz' + page.path,
      },
    });
  }, [page]);

  return <main className="min-h-screen bg-white text-slate-900">
    <section className="bg-slate-950 px-6 py-20 text-white lg:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="mb-5 text-xs font-semibold uppercase tracking-[.2em] text-cyan-300">{page.eyebrow}</p>
        <h1 className="max-w-4xl font-heading text-4xl font-bold leading-tight md:text-6xl">{page.title}</h1>
        <p className="mt-7 max-w-3xl text-lg leading-relaxed text-slate-300">{page.intro}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link to="/poptavka" className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-6 py-3 font-semibold text-slate-950">Poptat návrh mlžítka <ArrowRight size={16}/></Link>
          <Link to="/katalog-mlzitek" className="rounded-full border border-white/30 px-6 py-3 font-medium text-white">Prohlédnout katalog</Link>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-3xl font-semibold">Kde mlžné prvky využít</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">{page.cards.map(([title, description]) => <article key={title} className="rounded-2xl border border-slate-200 p-6"><MapPin size={20} className="text-cyan-700"/><h3 className="mt-4 text-xl font-semibold">{title}</h3><p className="mt-3 leading-relaxed text-slate-600">{description}</p></article>)}</div>
    </section>
    <section className="bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-semibold">Od návrhu k provozu</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6"><Droplets className="text-cyan-700"/><h3 className="mt-3 font-semibold">Voda a umístění</h3><p className="mt-2 text-slate-600">Prověříme přívod vody, okolní povrchy, vítr a charakter využití prostoru.</p></div>
          <div className="rounded-2xl bg-white p-6"><Settings2 className="text-cyan-700"/><h3 className="mt-3 font-semibold">Ovládání</h3><p className="mt-2 text-slate-600">Navrhneme ruční nebo automatický režim podle požadavků provozovatele.</p></div>
          <div className="rounded-2xl bg-white p-6"><Wrench className="text-cyan-700"/><h3 className="mt-3 font-semibold">Údržba</h3><p className="mt-2 text-slate-600">Upřesníme filtraci, pravidelné kontroly, odstávky a zazimování.</p></div>
        </div>
        <p className="mt-6 text-sm text-slate-600">Mlžítko není herní prvek a nesplňuje ČSN EN 1176. Bezpečnost a hygienické požadavky se posuzují podle konkrétní instalace.</p>
      </div>
    </section>
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="text-3xl font-semibold">Časté otázky</h2>
      <div className="mt-6 divide-y divide-slate-200">{page.faq.map(([q, a]) => <article key={q} className="py-5"><h3 className="font-semibold">{q}</h3><p className="mt-2 text-slate-600">{a}</p></article>)}</div>
      <nav aria-label="Související stránky" className="mt-8 flex flex-wrap gap-3">{page.links.map(([label, url]) => <Link key={url} to={url} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-cyan-800 hover:border-cyan-500">{label}</Link>)}</nav>
    </section>
  </main>;
}
