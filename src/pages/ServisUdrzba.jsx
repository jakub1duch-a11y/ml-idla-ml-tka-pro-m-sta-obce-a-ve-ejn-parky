import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ClipboardCheck, Droplets, Gauge, Headphones, ShieldCheck, Snowflake, Wrench } from 'lucide-react';
import { setSEO } from '@/lib/seo';

const SERVICE_SCOPE = [
  { title: 'Předsezónní uvedení do provozu', text: 'Kontrola rozvodů, trysek, filtrů a ovládání před prvními horkými dny. Systém prověříme v provozních podmínkách a připravíme na sezónu.' },
  { title: 'Kontrola trysek a filtrace', text: 'Prověříme kvalitu rozprašování, průtok a stav filtrace. Opotřebené nebo zanesené prvky navrhneme k výměně podle skutečného stavu.' },
  { title: 'Kontrola tlaku a armatur', text: 'Ověříme tlakové poměry, těsnost spojů, ventily a přívod vody. U nízkotlakých instalací kontrolujeme správnou funkci bez zbytečné vysokotlaké technologie.' },
  { title: 'Chytré řízení a nastavení', text: 'Zkontrolujeme časové a teplotní scénáře, smart ventily a automatiku. Nastavení upravíme podle způsobu využití konkrétního prostoru.' },
  { title: 'Zazimování systému', text: 'Před mrazy bezpečně odstavíme vodní část instalace a připravíme ji na zimní období tak, aby se minimalizovalo riziko poškození.' },
];

const REPORT_ITEMS = [
  'provedené práce a datum servisního zásahu',
  'stav trysek, filtrů, ventilů a rozvodů',
  'ověření provozního tlaku a funkce systému',
  'provedené výměny nebo seřízení',
  'doporučené další kroky a termín další kontroly',
];

const CONTRACT_ITEMS = [
  'předsezónní kontrola a spuštění',
  'pravidelná kontrola trysek a filtrace',
  'ověření armatur, rozvodů a provozních parametrů',
  'kontrola chytrého řízení a provozních scénářů',
  'písemný servisní záznam',
  'doporučení náhradních dílů podle skutečného stavu',
  'zazimování, pokud jej konkrétní instalace vyžaduje',
];

export default function ServisUdrzba() {
  useEffect(() => {
    setSEO({
      title: 'Servis a údržba mlžných systémů | MLŽIDLA.cz',
      description: 'Předsezónní servis, kontrola trysek a filtrace, smart řízení, servisní dokumentace a zazimování mlžných systémů HolmTec.',
      keywords: 'servis mlžení, údržba mlžný systém, zazimování mlhoviště, servis trysek, technická podpora',
      canonicalPath: '/servis-udrzba',
    });
  }, []);

  return (
    <main className="min-h-screen bg-white pt-20 text-slate-900">
      <section className="border-b border-slate-200 bg-[#f7f8f6] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
          <div className="max-w-4xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#0b4860]">Servis · údržba · dokumentace</p>
            <h1 className="mt-5 font-heading text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">Aby mlžení fungovalo ve chvíli, kdy ho opravdu potřebujete.</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-600">Servis nekončí instalací. Udržujeme mlžné systémy v provozní kondici od jarního spuštění přes kontrolu během sezóny až po bezpečné zazimování. Zásahy evidujeme, takže máte přehled o stavu technologie i doporučených krocích.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/kontakt" className="btn-metallic-mist inline-flex min-h-12 items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold">Objednat servis <ArrowRight size={16} /></Link>
              <Link to="/smart-ovladani" className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 bg-transparent px-7 py-3.5 text-sm font-semibold text-slate-800 transition hover:border-slate-500">Chytré ovládání</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[.85fr_1.15fr] lg:px-10">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#0b4860]">Proč na tom záleží</p>
            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Technik má znát váš systém dřív, než přijede na místo.</h2>
            <p className="mt-6 text-base leading-8 text-slate-600">U veřejných prostor, areálů i soukromých instalací je nejcennější kontinuita. Servisní tým HolmTec pracuje s informacemi o instalaci, konfiguraci a předchozích zásazích. Nezačínáme pokaždé od nuly.</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {['historie systému', 'rychlejší diagnostika', 'jasná doporučení', 'příprava před sezónou'].map((tag) => <span key={tag} className="rounded-full border border-[#0b4860]/15 bg-[#eef8fb] px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-[#0b4860]">{tag}</span>)}
            </div>
          </div>
          <div>
            <div className="mb-10 text-center lg:text-left">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#0b4860]">Rozsah služby</p>
              <h2 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl">Vše, co systém potřebuje pro spolehlivý provoz.</h2>
            </div>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {SERVICE_SCOPE.map((item, i) => (
                <article key={item.title} className="grid gap-4 py-8 sm:grid-cols-[64px_1fr] sm:gap-7">
                  <span className="font-mono text-sm tracking-widest text-[#0b6f95]">{String(i + 1).padStart(2, '0')}</span>
                  <div><h3 className="font-heading text-xl font-semibold text-slate-900">{item.title}</h3><p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{item.text}</p></div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0d171c] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#63b9d9]">Roční servisní péče</p>
              <h2 className="mt-5 max-w-xl font-heading text-4xl font-semibold leading-tight lg:text-5xl">Jeden plán. Přehledný servis. Méně provozních překvapení.</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/65">Pro instalace, kde je důležitá pravidelná připravenost, umíme nastavit servisní režim podle typu systému, sezónnosti a způsobu používání.</p>
              <Link to="/kontakt" className="btn-metallic-mist mt-8 inline-flex min-h-12 items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold">Poptat servisní plán <ArrowRight size={16} /></Link>
            </div>
            <div className="rounded-[28px] bg-white p-6 text-slate-900 shadow-2xl sm:p-9">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#0b6f95]">Servisní plán může zahrnovat</p>
              <div className="mt-7 space-y-4">{CONTRACT_ITEMS.map((item) => <div key={item} className="flex gap-3 text-base leading-7"><Check size={20} className="mt-1 shrink-0 text-[#0b6f95]" /><span>{item}</span></div>)}</div>
              <p className="mt-8 border-t border-slate-200 pt-6 font-mono text-[11px] leading-5 tracking-wider text-slate-500">Konkrétní rozsah a četnost servisu stanovíme podle velikosti, typu a umístění instalace.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f8f6] py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:px-10 lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#0b4860]">Servisní dokumentace</p>
            <h2 className="mt-4 font-heading text-3xl font-semibold leading-tight sm:text-4xl">Každý zásah zaznamenaný. Stav systému dohledatelný.</h2>
            <p className="mt-6 text-base leading-8 text-slate-600">Po servisní návštěvě může být součástí předání stručný servisní záznam. Pro města, správce areálů i provozovatele tak vzniká praktická historie údržby, která usnadňuje plánování dalších zásahů.</p>
            <div className="mt-8 space-y-4">{REPORT_ITEMS.map((item) => <div key={item} className="flex gap-3"><ClipboardCheck size={19} className="mt-1 shrink-0 text-[#0b6f95]" /><span className="leading-7 text-slate-700">{item}</span></div>)}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[{icon: Wrench,title:'Servis',text:'kontrola a seřízení'},{icon: Droplets,title:'Vodní část',text:'trysky, filtrace, armatury'},{icon: Gauge,title:'Provoz',text:'tlak a funkční zkouška'},{icon: Snowflake,title:'Zima',text:'bezpečné odstavení'},{icon: ShieldCheck,title:'Evidence',text:'historie zásahů'},{icon: Headphones,title:'Podpora',text:'navazující technická pomoc'}].map(({icon:Icon,title,text}) => <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5"><Icon size={22} className="text-[#0b4860]"/><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-1 text-sm text-slate-500">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-6 lg:px-10">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#0b4860]">Před sezónou, ne po problému</p>
          <h2 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl">Naplánujte kontrolu dřív, než přijde první horký den.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600">Pošlete nám informace o instalaci. Navrhneme vhodný rozsah kontroly nebo servisního plánu.</p>
          <Link to="/kontakt" className="btn-metallic-mist mt-8 inline-flex min-h-12 items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold">Domluvit servis <ArrowRight size={16}/></Link>
        </div>
      </section>
    </main>
  );
}
