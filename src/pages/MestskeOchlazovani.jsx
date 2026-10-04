import React from 'react';
import { ArrowRight, CheckCircle, Droplets, MapPin, Settings2, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { setSEO } from '@/lib/seo';
import { useEffect } from 'react';

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_3G2ZRSWvwxGD0OuqrTwOUdZhUBQ/hf_20260916_123317_5fa61fff-2065-4f84-874b-c94e4f37be15.mp4';

const FAQ = [
  ['Co je městské ochlazování?', 'Městské ochlazování zahrnuje opatření a technologie, které pomáhají zlepšovat tepelný komfort ve veřejném prostoru. Mlžicí systémy představují jednu z možností lokálního ochlazování například na náměstích, v parcích, pěších zónách nebo sportovních areálech.'],
  ['Jak funguje městské mlžítko?', 'Mlžítko rozptyluje vodu prostřednictvím mlžných trysek do velmi jemných kapek. Za vhodných podmínek dochází k jejich odpařování, při kterém se odebírá teplo z okolního vzduchu.'],
  ['Dopadá mlha na zem?', 'Správně navržený systém má vytvářet jemnou mlhu, která se za vhodných podmínek významně odpařuje ještě před dopadem na okolní povrchy. Výsledek závisí na počasí, vlhkosti, proudění vzduchu a konkrétním návrhu systému.'],
  ['Potřebuje mlžítko vysokotlaké čerpadlo?', 'Ne vždy. U vybraných MLŽIDLA® systémů lze využít nízkotlaký princip přímo z vodovodního řadu. Konkrétní řešení závisí na dostupném tlaku, průtoku a konfiguraci systému.'],
  ['Lze mlžení automaticky řídit?', 'Ano. Systém lze podle konkrétní konfigurace řídit například podle teploty, času nebo provozního režimu. U větších projektů lze pracovat také se samostatnými zónami.'],
  ['Kolik stojí ochlazovací systém pro město?', 'Cena závisí na typu konstrukce, počtu trysek, velikosti zóny, kotvení, přívodu vody, řízení a instalaci. Nejvhodnější je připravit orientační návrh podle konkrétního místa.'],
];

export default function MestskeOchlazovani() {
  useEffect(() => {
    setSEO({
      title: 'Městské ochlazování veřejného prostoru | MLŽIDLA®',
      description: 'Městská mlžítka a mlžné zóny pro náměstí, parky, promenády a sportoviště. Návrh, výroba, instalace, Smart řízení a servis MLŽIDLA®.',
      canonicalPath: '/mestske-ochlazovani-verejneho-prostoru',
    });
  }, []);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(34,211,238,.22),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(14,116,144,.18),transparent_35%)]" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <p className="text-xs font-mono uppercase tracking-[.22em] text-cyan-300 mb-5">MLŽIDLA® · MĚSTA A OBCE</p>
          <h1 className="max-w-5xl font-heading text-4xl lg:text-7xl font-bold tracking-tight leading-[.98]">Městské ochlazování,<br /><span className="italic text-cyan-200">které patří do prostoru.</span></h1>
          <p className="max-w-2xl mt-7 text-lg lg:text-xl leading-relaxed text-white/70">Jak navrhnout příjemnější veřejný prostor pomocí mlžných zón, bran, alejí a architektonických mlžítek.</p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <Link to="/poptavka" className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-slate-950 px-7 py-3.5 font-semibold">Navrhnout ochlazovací řešení <ArrowRight size={16} /></Link>
            <Link to="/mlzitka-pro-mesta-obce" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-semibold text-white hover:bg-white/10">Města a obce</Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="aspect-[9/16] max-h-[760px] mx-auto rounded-3xl overflow-hidden bg-slate-950 shadow-2xl">
          <video src={VIDEO_URL} className="w-full h-full object-cover" controls playsInline preload="metadata" />
        </div>
        <p className="text-center text-xs text-slate-400 mt-4">10s video MLŽIDLA.CZ · městské ochlazování veřejného prostoru</p>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
        <div className="max-w-3xl">
          <p className="text-xs font-mono uppercase tracking-[.2em] text-slate-400 mb-4">PROČ SE TÍM ZABÝVAT</p>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">Horké město potřebuje řešit konkrétní místa.</h2>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">Náměstí, parky, promenády, pěší zóny nebo sportoviště se během horkých dnů mohou měnit v místa s vysokou tepelnou zátěží. Městské ochlazování proto není pouze otázkou komfortu. Je také součástí způsobu, jak veřejný prostor funguje a jak jej lidé využívají.</p>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">Cílem MLŽIDLA® není pouze instalovat jedno mlžítko. Cílem je vytvořit dobře navržené ochlazovací místo.</p>
        </div>
      </section>

      <section className="bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
          <div className="grid md:grid-cols-3 gap-5">
            {[
              [MapPin, 'Konkrétní místo', 'Náměstí, park, promenáda, hřiště, sportoviště nebo veřejný areál.'],
              [Droplets, 'Jemná mlha', 'Lokální rozptýlení vody pro příjemnější mikroklima za vhodných podmínek.'],
              [Settings2, 'Smart provoz', 'Řízení podle teploty, času, provozního režimu nebo samostatných zón.'],
            ].map(([Icon, title, text]) => <div key={title} className="rounded-2xl bg-white border border-slate-200 p-7"><Icon size={22} className="text-cyan-600 mb-5" /><h3 className="text-xl font-semibold mb-2">{title}</h3><p className="text-slate-600 leading-relaxed">{text}</p></div>)}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          <div>
            <p className="text-xs font-mono uppercase tracking-[.2em] text-slate-400 mb-4">OD JEDNOHO PRVKU K CELÉ ZÓNĚ</p>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">Městské mlžení může být součástí architektury.</h2>
            <p className="mt-6 text-slate-600 text-lg leading-relaxed">Podle měřítka a charakteru prostoru může vzniknout samostatné mlžítko, průchozí mlžná brána, městská mlžná alej, mlžiště nebo soustava prvků kolem pobytového prostoru.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {['Náměstí a pěší zóny','Parky a promenády','Nádraží a dopravní uzly','Sportoviště','Dětská hřiště','Veřejné instituce a školy','Hotely a resorty','Veřejné areály'].map((item) => <div key={item} className="p-5 rounded-2xl border border-slate-200 bg-white"><CheckCircle size={17} className="text-cyan-600 mb-3" /><span className="font-medium">{item}</span></div>)}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
          <div className="grid lg:grid-cols-2 gap-14">
            <div><p className="text-xs font-mono uppercase tracking-[.2em] text-cyan-300 mb-4">OD NÁVRHU PO SERVIS</p><h2 className="text-3xl lg:text-5xl font-bold tracking-tight">Projekt, výroba, instalace i následná péče.</h2></div>
            <div className="space-y-5 text-white/70 leading-relaxed"><p>Nemusíte začínat technickou dokumentací. Stačí fotografie, situační plán nebo základní popis místa.</p><p>Na základě podkladů lze navrhnout vhodný princip, konfiguraci, rozmístění, způsob kotvení, Smart řízení a další technické podklady.</p><div className="flex items-center gap-3 text-white"><Wrench size={18} className="text-cyan-300" /> Návrh → výroba → instalace → řízení → servis</div></div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 lg:px-10 py-20">
        <p className="text-xs font-mono uppercase tracking-[.2em] text-slate-400 mb-4">FAQ</p>
        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-10">Často kladené otázky</h2>
        <div className="divide-y divide-slate-200 border-y border-slate-200">{FAQ.map(([q,a]) => <details key={q} className="py-6 group"><summary className="cursor-pointer list-none pr-8 text-lg font-semibold">{q}</summary><p className="mt-3 text-slate-600 leading-relaxed max-w-3xl">{a}</p></details>)}</div>
      </section>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-cyan-50 to-slate-50 border border-cyan-100 p-9 lg:p-14 text-center">
          <p className="text-xs font-mono uppercase tracking-[.2em] text-cyan-700 mb-4">VÁŠ PROSTOR · NÁŠ NÁVRH</p>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">Máte ve městě místo, které se v létě přehřívá?</h2>
          <p className="max-w-2xl mx-auto mt-5 text-lg text-slate-600">Pošlete nám fotografii, situační plán nebo krátký popis. Navrhneme první variantu ochlazení.</p>
          <Link to="/poptavka" className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-950 text-white px-8 py-4 font-semibold">Navrhnout ochlazovací řešení <ArrowRight size={16} /></Link>
          <p className="mt-5 text-sm text-slate-500">MLŽIDLA® — výroba · prodej · pronájem · instalace · servis</p>
        </div>
      </section>
    </main>
  );
}
