import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Droplets, MapPin, SlidersHorizontal } from "lucide-react";
import { setSEO, SEO_PAGES } from "@/lib/seo";
import { CATALOG_CATEGORIES } from "@/lib/catalogCategories";

const FAQ = [
[
"Co je mlžiště neboli mlhoviště?",
"Oba názvy zde označují venkovní zónu osvěžení s jedním nebo více mlžicími prvky. Návrh propojuje jejich rozmístění, přívod vody a způsob ovládání s pohybem lidí a charakterem místa."],

[
"Potřebuje mlžiště čerpadlo?",
"Nízkotlaká MLŽIDLA navrhujeme pro přímé napojení na běžný vodovodní řad bez čerpadla. Před výběrem sestavy ověřujeme dostupný tlak a průtok v místě připojení i délku rozvodů."],

[
"Jak se určuje počet prvků a jejich rozestupy?",
"Podle velikosti pobytové plochy, pohybu lidí, směru větru, okolní zeleně a dostupného přívodu vody. Alej podél cesty a volná sestava na náměstí mohou vyžadovat odlišné rozmístění."],

[
"Lze mlhoviště řídit z telefonu?",
"Ano, vhodnou sestavu lze doplnit o chytré řízení SUPLA. Časové plány, řízení podle teploty či počasí a přehled spotřeby závisí na zvoleném ventilu, připojení, senzorech a měření."],

[
"Jaká je spotřeba vody a cena?",
"Spotřeba závisí na typu a počtu trysek, provozním tlaku a délce jednotlivých cyklů. Nabídku sestavujeme z konkrétních prvků, řízení, kotvení, rozvodů a rozsahu montáže. Pro první návrh pošlete fotografii místa a základní rozměry."],

[
"Co je potřeba připravit pro instalaci?",
"Vhodný přívod vody, prostor pro rozvody a kotvení a přístup pro servis. Součástí návrhu je posouzení povrchu a odvodu vody, provozních pravidel, údržby a zimního odstavení podle konkrétního řešení."]];


const LAYOUTS = [
[
"01",
"Pobytová zóna",
"Mlžicí prvky kolem místa pro odpočinek. Vhodné pro náměstí, parky a předprostory budov, kde se návštěvníci zastavují.",
"Rozmístění kolem plochy"],

[
"02",
"Mlžná alej",
"Opakování prvků podél pěší trasy. Doplňuje promenády a propojení uvnitř areálu s ohledem na volný průchod a okolní mobiliář.",
"Osvěžení podél cesty"],

[
"03",
"Volná sestava",
"Několik prvků rozmístěných podle provozu místa. Pro školy, rekreační areály a další plochy s více směry pohybu.",
"Návrh podle půdorysu"]];



export default function Mlhoviste() {
  useEffect(() => {
    setSEO({
      ...SEO_PAGES.mlhoviste,
      image: CATALOG_CATEGORIES[3].image,
      jsonLd: {
        "@context": "https://schema.org",
        "@graph": [
        {
          "@type": "Service",
          name: "Návrh mlžišť a mlhovišť",
          provider: { "@type": "Organization", name: "HolmTec" },
          areaServed: "CZ",
          url: "https://mlzidla.cz/mlhoviste"
        },
        {
          "@type": "FAQPage",
          mainEntity: FAQ.map(([name, text]) => ({
            "@type": "Question",
            name,
            acceptedAnswer: { "@type": "Answer", text }
          }))
        }]

      }
    });
  }, []);
  return (
    <div className="mist-field-page bg-white pt-24">
      <section className="relative isolate overflow-hidden bg-slate-950 text-white"><div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(34,211,238,0.15),transparent_45%),linear-gradient(120deg,#020617,#0f2531_60%,#0c3340)]" /><div aria-hidden="true" className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:52px_52px]" /><div className="relative mx-auto max-w-7xl px-5 pb-16 pt-8 sm:px-8 lg:pb-24 lg:pt-16">
        <nav
          aria-label="Drobečková navigace"
          className="mb-8 flex flex-wrap gap-2 text-sm text-slate-300">
          
          <Link to="/">Úvod</Link>
          <span aria-hidden="true">/</span>
          <Link to="/katalog-mlzitek">Katalog</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Mlžiště a mlhoviště</span>
        </nav>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.18em] text-cyan-200">
              MLŽIDLA · architektura osvěžení
            </p>
            <h1 className="mt-5">
              Mlhoviště a mlžiště
              <br />
              pro města, parky a zahrady.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-200">
              Promyšlené mlžné zóny pro náměstí, parky a areály. Nerezová
              mlžítka, přímé napojení na vodovod a volitelné chytré řízení SUPLA
              propojujeme v řešení pro konkrétní místo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/poptavka?produkt=Ml%C5%BEi%C5%A1t%C4%9B"
                className="inline-flex min-h-12 items-center gap-3 rounded-full bg-cyan-200 px-6 py-3 text-sm font-semibold text-slate-950 transition-transform duration-300 hover:-translate-y-1">
                
                Navrhnout moje mlžiště <ArrowRight size={17} />
              </Link>
              <a
                href="#rozmisteni"
                className="inline-flex min-h-12 items-center gap-2 px-4 py-3 text-sm font-semibold text-white hover:text-cyan-200">
                
                Možnosti rozmístění <ArrowRight size={17} />
              </a>
            </div>
          </div>
          <figure className="group overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-[0_30px_100px_rgba(0,0,0,.35)]">
            <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/b41c4231d_BENDY-FIELD-park-realizace.webp"

            alt={CATALOG_CATEGORIES[3].imageAlt}
            width="900"
            height="1000"
            fetchPriority="high"
            className="aspect-[4/3] w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.035] lg:aspect-[4/5]" />
            
            <figcaption className="px-5 py-3 text-xs leading-5 text-slate-200">
              Inspirace pro parkový prostor. Počet a rozmístění prvků navrhujeme
              individuálně.
            </figcaption>
          </figure>
        </div>
        </div>
      </section>
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-3">
          {[
          [
          MapPin,
          "Návrh podle místa",
          "Pohyb lidí, pobytové plochy, vítr a okolní zeleň určují rozmístění prvků."],

          [
          Droplets,
          "Přímo z vodovodu",
          "Nízkotlaké mlžení bez čerpadla. Dostupný tlak a průtok ověříme pro konkrétní sestavu."],

          [
          SlidersHorizontal,
          "Řízení podle provozu",
          "Volitelné cykly, časové plány a SUPLA podle vybavení a požadavků správce."]].

          map(([Icon, title, text]) =>
          <article key={title}>
              <Icon
              size={23}
              strokeWidth={1.5}
              className="text-cyan-800"
              aria-hidden="true" />
            
              <h2 className="mt-4 text-xl">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
            </article>
          )}
        </div>
      </section>
      <section
        id="rozmisteni"
        className="mx-auto max-w-7xl scroll-mt-28 px-5 py-16 sm:px-8 lg:py-24">
        
        <p className="font-mono text-xs uppercase tracking-[.18em] text-cyan-800">
          Možnosti rozmístění
        </p>
        <h2 className="mt-4">Mlhoviště pro města, parky a zahrady: tři možnosti řešení.</h2>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          Způsob využití je výchozím bodem návrhu. Konkrétní model, počet prvků
          a rozestupy upřesníme podle podkladů k místu.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {LAYOUTS.map(([number, title, text, label]) =>
          <article
            key={number}
            className="rounded-2xl border border-slate-200 p-6 lg:p-8">
            
              <p className="font-mono text-sm text-cyan-800">
                {number} / {label}
              </p>
              <h3 className="mt-8">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{text}</p>
            </article>
          )}
        </div>
      </section>
      <section className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.18em] text-cyan-200">
              Chytré řízení SUPLA
            </p>
            <h2 className="mt-4">Chytré řízení mlhoviště podle provozu a potřeb místa.</h2>
          </div>
          <div>
            <p className="leading-8 text-slate-200">
              Mlžení lze plánovat podle otevírací doby a střídat s přestávkami.
              S vhodnými senzory a konfigurací může reagovat na teplotu či
              počasí. Správce může získat vzdálené ovládání a po doplnění měření
              i přehled o průtoku a spotřebě.
            </p>
            <Link
              to="/smart-ovladani"
              className="mt-6 inline-flex min-h-11 items-center gap-3 font-semibold text-cyan-200">
              
              Prohlédnout možnosti SUPLA <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <p className="font-mono text-xs uppercase tracking-[.18em] text-cyan-800">
          Prvky pro váš návrh
        </p>
        <h2 className="mt-4">Vyberte mlhoviště podle charakteru prostoru.</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {CATALOG_CATEGORIES.slice(0, 3).map((c) =>
          <Link
            key={c.href}
            to={c.href}
            className="overflow-hidden rounded-2xl border border-slate-200 transition-colors hover:border-cyan-700">
            
              <img
              src={c.image}
              alt={c.imageAlt}
              loading="lazy"
              width="640"
              height="480"
              className="aspect-[4/3] w-full object-cover" />
            
              <div className="p-6">
                <h3>{c.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {c.description}
                </p>
                <span className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold">
                  Prohlédnout řešení <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          )}
        </div>
      </section>
      <section aria-labelledby="mlhoviste-priprava" className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[.18em] text-cyan-800">Technické podklady</p>
          <h2 id="mlhoviste-priprava" className="mt-4">Co potřebujeme pro návrh mlhoviště?</h2>
          <p className="mt-4 max-w-2xl leading-7 text-slate-600">Pro první konzultaci stačí základní údaje. Technické parametry a rozsah instalace ověříme podle konkrétního místa.</p>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full min-w-[560px] text-left text-sm">
              <caption className="sr-only">Podklady pro návrh městského mlhoviště</caption>
              <thead className="bg-slate-950 text-white"><tr><th scope="col" className="px-5 py-4">Oblast</th><th scope="col" className="px-5 py-4">Co nám pomůže upřesnit řešení</th></tr></thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {[["Prostor", "Fotografie nebo půdorys, přibližné rozměry a způsob využití"], ["Přívod vody", "Umístění přípojky; dostupný tlak, průtok a kvalita vody se ověří"], ["Podklad a kotvení", "Typ povrchu, přístup k rozvodům a případná stavební omezení"], ["Provoz a řízení", "Očekávané časy provozu a zájem o automatické ovládání"], ["Údržba", "Přístup k filtraci, odvod vody a možnost zimního odstavení"]].map(([label, description]) => <tr key={label}><th scope="row" className="px-5 py-4 font-semibold text-slate-900">{label}</th><td className="px-5 py-4 leading-6">{description}</td></tr>)}
              </tbody>
            </table>
          </div>
          <Link to="/poptavka?produkt=Ml%C5%BEi%C5%A1t%C4%9B" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white">Poslat podklady k návrhu <ArrowRight size={17} /></Link>
        </div>
      </section>
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <h2>Návrh mlhoviště: od fotografie k instalaci.</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {[
            [
            "Pošlete prostor",
            "Fotografii nebo půdorys, základní rozměry, způsob využití a informace o přívodu vody."],

            [
            "Upřesníme sestavu",
            "Doporučíme rozmístění, modely, kotvení a způsob ovládání s ohledem na provoz místa."],

            [
            "Připravíme nabídku",
            "Oddělíme cenu prvků, volitelného řízení a rozsah instalačních prací podle zadání."]].

            map(([title, text], i) =>
            <li key={title}>
                <p className="text-lg font-semibold">
                  0{i + 1} — {title}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
              </li>
            )}
          </ol>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
        <h2>Co připravit před návrhem mlhoviště.</h2>
        <div className="mt-8 divide-y divide-slate-200">
          {FAQ.map(([q, a]) =>
          <details key={q} className="group py-4">
              <summary className="cursor-pointer list-item text-base font-semibold text-slate-900 marker:text-cyan-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-700">{q}</summary>
              <p className="pt-4 pb-2 text-base leading-7 text-slate-600">{a}</p>
            </details>
          )}
        </div>
      </section>
      <section className="bg-[#EAF2F2]">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-7 px-5 py-14 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2>Začněme vaším prostorem.</h2>
            <p className="mt-4 max-w-xl leading-7 text-slate-600">
              Pošlete fotografii, půdorys nebo krátké zadání. Společně vybereme
              vhodné mlžiště a další krok projektu.
            </p>
          </div>
          <Link
            to="/poptavka?produkt=Ml%C5%BEi%C5%A1t%C4%9B"
            className="inline-flex min-h-12 shrink-0 items-center gap-3 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white">
            
            Získat návrh a cenu <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>);

}