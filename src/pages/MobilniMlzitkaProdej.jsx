import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, CalendarDays, Droplets, ShieldCheck, Truck, Wrench, Wind, Waves, SlidersHorizontal } from 'lucide-react';
import { setSEO } from '@/lib/seo';

const scenarios = [
  { name: 'Mobilní mlžný sloup', detail: 'Samostatný nerezový prvek pro terasy, gastro zóny, dětské dny a menší akce.' },
  { name: 'Mobilní mlžná brána', detail: 'Ochlazení vstupu nebo průchozí zóny. Konkrétní rozměr a konstrukci navrhujeme podle místa.' },
  { name: 'Mlžná instalace na míru', detail: 'Více prvků, autorský tvar nebo značková instalace pro pořadatele, obce a eventové půjčovny.' },
];

const parts = [
  { Icon: Waves, name: 'Nerezová konstrukce', text: 'Tvar a počet mlžných trysek odpovídají zvolené variantě a požadované mlžné zóně.' },
  { Icon: ShieldCheck, name: 'Přenosné zátěžové podstavce', text: 'Pro vybrané modely používáme podstavce typu dočasného dopravního značení. Uchycení a stabilita se posuzují pro konkrétní sestavu.' },
  { Icon: Droplets, name: 'Přívod vody a filtrace', text: 'Napojení dle podmínek místa; filtraci, spojky, hadice a provozní tlak stanovíme v nabídce.' },
  { Icon: SlidersHorizontal, name: 'Ovládání na výběr', text: 'Manuální ovládání nebo volitelná automatizace včetně řešení SUPLA podle kompatibility sestavy.' },
  { Icon: Wrench, name: 'Ochrana vedení', text: 'Přívodní hadice se vede mimo pěší trasy nebo se chrání vhodným kabelovým/hadicovým přejezdem.' },
  { Icon: Wind, name: 'Stabilita a bezpečný provoz', text: 'Před nasazením ověřujeme podklad, zatížení větrem, možnost nárazu i přístup kolemjdoucích.' },
];

const image = '/media/optimized/b68df5d31_Gemini_Generated_Image_5gclad5gclad5gcl.webp';

export default function MobilniMlzitkaProdej() {
  useEffect(() => {
    setSEO({
      title: 'Mobilní mlžítka na prodej | Mlžidla.cz',
      description: 'Pořiďte si vlastní mobilní mlžítko pro festival, městskou slavnost, hotelovou terasu nebo eventovou půjčovnu. Nerezová konstrukce, přenosné podstavce a technologie podle projektu.',
      canonicalPath: '/mobilni-mlzitka-prodej',
    });
  }, []);

  return (
    <main className="min-h-screen bg-white pt-[var(--site-header-height)] text-slate-900">
      <section className="relative isolate overflow-hidden bg-[#0D2F4F] text-white">
        <img src={image} alt="Mobilní mlžítko v prostředí letní akce – ilustrační vizualizace" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#092641]/95 via-[#092641]/85 to-[#092641]/20" />
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <p className="font-mono text-xs font-semibold uppercase tracking-[.2em] text-sky-200">Mlžidla.cz EVENT · PRODEJ</p>
          <h1 className="mt-5 max-w-4xl font-heading text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">Vlastní mobilní mlžítko. Připravené na další akci.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100/90">Designové nerezové mlžné prvky pro pořadatele festivalů, obce, eventové agentury, půjčovny a provozovatele teras. Bez trvalého kotvení do povrchu, s mobilními zátěžovými podstavci pro vhodné typy konstrukcí.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/poptavka" className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-400">Poptat koupi mobilního mlžítka <ArrowRight size={17}/></Link>
            <Link to="/pronajem" className="inline-flex items-center gap-2 rounded-full border border-white/60 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">Chci raději pronájem <CalendarDays size={17}/></Link>
          </div>
          <p className="mt-5 text-sm text-slate-200">Cena dle typu konstrukce, technologie a počtu zařízení. Nezávazná nabídka na vyžádání.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <p className="font-mono text-xs font-bold uppercase tracking-[.18em] text-sky-700">Varianty k zakoupení</p>
        <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">Vyberte mobilní provedení pro svůj provoz</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {scenarios.map((item) => <article key={item.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-7">
            <BadgeCheck className="text-sky-700" size={27} />
            <h3 className="mt-5 text-xl font-semibold">{item.name}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.detail}</p>
            <p className="mt-5 text-sm font-semibold text-sky-800">Cena na poptávku</p>
          </article>)}
        </div>
      </section>

      <section className="bg-[#F3F9FC] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <p className="font-mono text-xs font-bold uppercase tracking-[.18em] text-sky-700">Technologie mobilní sestavy</p>
          <h2 className="mt-3 max-w-3xl font-heading text-3xl font-semibold sm:text-4xl">Co tvoří mobilní mlžítko</h2>
          <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {parts.map(({Icon, name, text}) => <article key={name} className="rounded-2xl border border-sky-100 bg-white p-6">
              <Icon className="text-sky-700" size={25} />
              <h3 className="mt-4 text-lg font-semibold">{name}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
            </article>)}
          </div>
          <p className="mt-7 max-w-4xl text-sm leading-7 text-slate-600">Mobilní podstavce jsou odvozené od zátěžových základen dočasného dopravního značení. Jejich použití samo o sobě nezaručuje bezpečné kotvení; každé konkrétní provedení musí mít ověřenou stabilitu. Mlžítko není herní prvek a není deklarováno jako zařízení dle ČSN EN 1176.</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-9 px-6 py-16 lg:grid-cols-2 lg:items-center lg:px-10 lg:py-20">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[.18em] text-sky-700">Dodávka a uvedení do provozu</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">Vyrobíme sestavu pro vaše využití</h2>
          <p className="mt-5 text-base leading-8 text-slate-600">Před výrobou si upřesníme místo instalace, požadovanou mlžnou zónu, způsob přepravy, dostupnost vody a napájení. Podle toho stanovíme vhodnou konstrukci, podstavce a technologickou výbavu.</p>
          <p className="mt-4 text-base leading-8 text-slate-600">V nabídce oddělíme cenu mlžítka, mobilního ukotvení, připojovací a řídicí technologie i případného školení, dopravy a uvedení do provozu.</p>
        </div>
        <div className="rounded-3xl border border-sky-100 bg-sky-50 p-8">
          <h3 className="text-xl font-semibold">Pro koho je vlastní sestava vhodná?</h3>
          <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
            <p><strong>Eventové agentury a půjčovny:</strong> zařízení pro opakované pronájmy zákazníkům.</p>
            <p><strong>Města a obce:</strong> sezónní ochlazení náměstí, slavností a komunitních akcí.</p>
            <p><strong>Hotely a gastro provozy:</strong> přemístitelné mlžení teras a venkovního posezení.</p>
            <p><strong>Pořadatelé festivalů:</strong> vlastní chlazení návštěvnických a relaxačních zón.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#0D2F4F] px-6 py-16 text-white lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.18em] text-sky-200">Nezávazná obchodní nabídka</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold">Pořiďte si vlastní Mlžidla.cz EVENT.</h2>
            <p className="mt-3 text-sm leading-7 text-slate-200">Napište počet zařízení, typ využití a požadovaný termín. Připravíme technickou specifikaci a položkovou cenu.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/poptavka" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#0D2F4F] hover:bg-sky-100">Poptat prodej <ArrowRight size={17}/></Link>
            <Link to="/pronajem" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10">Prohlédnout pronájem <Truck size={17}/></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
