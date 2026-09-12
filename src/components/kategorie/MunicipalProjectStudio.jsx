import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Building2,
  Check,
  DraftingCompass,
  Factory,
  FileCheck2,
  Gauge,
  Map,
  Route,
  School,
  Settings2,
  ShieldCheck,
  Sparkles,
  Trees,
  Wrench,
} from 'lucide-react';
import { trackFunnelStep } from '@/lib/ga4';

const PAGE_LINKS = [
  ['Přínos pro město', '#prinos'],
  ['Řešení na míru', '#zakazkova-vyroba'],
  ['Návrhové studio', '#navrhove-studio'],
  ['Realizace', '#realizace'],
  ['Bezpečný provoz', '#bezpecny-provoz'],
  ['Podklady', '#podklady'],
  ['Poptávka', '#poptavka'],
];

const SCENARIOS = [
  {
    id: 'square',
    label: 'Náměstí',
    icon: Building2,
    eyebrow: 'Centrum města',
    title: 'Pobytový ostrov bez zásahu do charakteru náměstí.',
    description: 'Samostatné prvky nebo mlžná brána mohou vytvořit čitelnou ochlazovací zónu v místě přirozeného pohybu lidí.',
    products: ['BENDY', 'GATE', 'LINEA'],
    mode: 'Lokální nebo průchozí zóna',
    control: 'Smart provoz podle teploty a času',
    output: 'Situace, umístění prvků a technická příprava',
    accent: '#66d8e5',
    surface: 'linear-gradient(135deg,#d8d2c6 0 48%,#c7c0b2 48% 52%,#ddd8ce 52%)',
    markers: [
      { x: 27, y: 34, label: 'BENDY' },
      { x: 56, y: 55, label: 'GATE' },
      { x: 77, y: 28, label: 'LINEA' },
    ],
  },
  {
    id: 'park',
    label: 'Park',
    icon: Trees,
    eyebrow: 'Zeleň a promenáda',
    title: 'Mlžná trasa navázaná na stín, lavičky a pěší pohyb.',
    description: 'Rozmístění reaguje na pobytová místa, průchodnost, stávající vegetaci a dostupnost technického napojení.',
    products: ['LINEA', 'AURA', 'BENDY ALEJ'],
    mode: 'Liniové a bodové ochlazení',
    control: 'Zónování podle využití parku',
    output: 'Variantní studie a doporučení etapizace',
    accent: '#7ed6a8',
    surface: 'linear-gradient(145deg,#dcebdc 0 38%,#c8dcbf 38% 58%,#eef2df 58%)',
    markers: [
      { x: 20, y: 62, label: 'LINEA' },
      { x: 52, y: 38, label: 'AURA' },
      { x: 79, y: 59, label: 'ALEJ' },
    ],
  },
  {
    id: 'school',
    label: 'Škola a hřiště',
    icon: School,
    eyebrow: 'Děti a aktivní zóna',
    title: 'Srozumitelný prvek pro hru, odpočinek a letní provoz.',
    description: 'Návrh odděluje aktivní mlžnou plochu od klidových tras a zohledňuje dohled, údržbu a provozní režim.',
    products: ['MRAK', 'GATE', 'AURA'],
    mode: 'Herní nebo klidová mlžná zóna',
    control: 'Časové režimy a správa provozu',
    output: 'Schéma bezpečných zón a provozní koncept',
    accent: '#77b9ff',
    surface: 'linear-gradient(135deg,#e2edf4 0 42%,#d6e1e8 42% 62%,#eef4f6 62%)',
    markers: [
      { x: 24, y: 29, label: 'MRAK' },
      { x: 61, y: 63, label: 'GATE' },
      { x: 81, y: 34, label: 'AURA' },
    ],
  },
  {
    id: 'transit',
    label: 'Promenáda',
    icon: Route,
    eyebrow: 'Trasa a dopravní uzel',
    title: 'Ochlazení tam, kde se lidé čekají, potkávají a přesouvají.',
    description: 'Liniové řešení lze navázat na přednádražní prostor, nábřeží, tržiště nebo dlouhou pěší trasu.',
    products: ['BENDY ALEJ', 'LINEA', 'GATE'],
    mode: 'Sekvence podél hlavní trasy',
    control: 'Samostatné provozní zóny',
    output: 'Etapizace a návaznost na infrastrukturu',
    accent: '#8bdce7',
    surface: 'linear-gradient(110deg,#dfe4e6 0 34%,#c4cdd1 34% 44%,#e7ecee 44% 71%,#ccd4d7 71%)',
    markers: [
      { x: 18, y: 50, label: 'ALEJ' },
      { x: 49, y: 50, label: 'LINEA' },
      { x: 80, y: 50, label: 'GATE' },
    ],
  },
];

const CUSTOM_STEPS = [
  {
    icon: DraftingCompass,
    number: '01',
    title: 'Návrh a architektonické začlenění',
    text: 'Záměr převádíme do variant rozmístění, měřítka a vztahu k pohybu lidí, zeleni, mobiliáři i charakteru místa.',
  },
  {
    icon: Settings2,
    number: '02',
    title: 'Zakázkové zpracování',
    text: 'Řešíme rozměry, kotvení, napojení, počet a orientaci trysek, povrchové provedení i servisní přístup.',
  },
  {
    icon: Factory,
    number: '03',
    title: 'Česká zakázková výroba',
    text: 'Výrobní dokumentace a nerezové provedení vznikají jako jeden kontrolovaný celek pro konkrétní projekt.',
  },
  {
    icon: Wrench,
    number: '04',
    title: 'Instalace, řízení a servis',
    text: 'Dodávku propojujeme se stavební připraveností, Smart provozem, předáním a následnou technickou péčí.',
  },
];

const DELIVERABLES = [
  ['Situační návrh', 'Doporučené umístění a rozsah řešení v konkrétním veřejném prostoru.'],
  ['Variantní vizualizace', 'Srozumitelné porovnání konceptů pro vedení města, radu i projektový tým.'],
  ['Technické podklady', 'Napojení, kotvení, provozní logika a koordinace se souvisejícími profesemi.'],
  ['Rozpočtová varianta', 'Rozdělení řešení na základní, doporučenou nebo etapově rozšiřitelnou variantu.'],
];

const FAQ = [
  ['Co potřebujete pro první návrh?', 'Stačí fotografie nebo situační výkres místa, přibližné rozměry, očekávaný způsob využití a informace o dostupnosti vody a elektřiny.'],
  ['Lze řešení přizpůsobit architektuře města?', 'Ano. Zakázkové zpracování může řešit rozměry, konfiguraci, kotvení, návaznost na mobiliář i barevné a povrchové pojetí. Každé technické rozhodnutí následně potvrzuje projektová dokumentace.'],
  ['Co obdrží obec před rozhodnutím?', 'Podle fáze projektu připravíme situační doporučení, variantu řešení, vizualizaci, technické požadavky a podklady pro cenovou nabídku.'],
  ['Jak se řeší provoz a údržba?', 'Součástí návrhu může být Smart řízení, provozní režimy, vzdálená správa a plán servisu včetně přípravy na zimní období.'],
];

function PlanVisual({ scenario }) {
  return (
    <div className="relative min-h-[390px] overflow-hidden rounded-[28px] border border-white/12 bg-[#102f39] shadow-2xl shadow-slate-950/25 sm:min-h-[460px]">
      <div className="absolute inset-5 overflow-hidden rounded-[22px] border border-white/10" style={{ background: scenario.surface }}>
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'linear-gradient(rgba(15,45,55,.18) 1px, transparent 1px), linear-gradient(90deg,rgba(15,45,55,.18) 1px, transparent 1px)', backgroundSize: '34px 34px' }} />
        {scenario.id === 'park' && (
          <>
            <span className="absolute left-[8%] top-[12%] h-20 w-20 rounded-full border-[12px] border-emerald-800/20 bg-emerald-300/50" />
            <span className="absolute bottom-[8%] right-[9%] h-24 w-24 rounded-full border-[14px] border-emerald-800/20 bg-emerald-300/50" />
          </>
        )}
        {scenario.id === 'school' && <span className="absolute right-[8%] top-[10%] h-[28%] w-[28%] rounded-xl border-4 border-white/50 bg-sky-200/35" />}
        {scenario.id === 'transit' && <span className="absolute left-[8%] right-[8%] top-1/2 h-14 -translate-y-1/2 rounded-full border border-white/50 bg-white/35" />}

        {scenario.markers.map((marker, index) => (
          <div key={marker.label} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: marker.x + '%', top: marker.y + '%' }}>
            <motion.span
              initial={{ scale: .8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: .12 + index * .08 }}
              className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45 blur-md"
              style={{ background: 'radial-gradient(circle,' + scenario.accent + ' 0%,transparent 68%)' }}
            />
            <span className="relative flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-[#0b4655] text-white shadow-xl">
              <Sparkles size={16} />
            </span>
            <span className="absolute left-1/2 top-[50px] -translate-x-1/2 whitespace-nowrap rounded-full border border-slate-200 bg-white/95 px-2.5 py-1 font-mono text-[9px] font-bold tracking-[.08em] text-slate-800 shadow-sm">
              {marker.label}
            </span>
          </div>
        ))}
      </div>
      <div className="absolute left-9 top-9 rounded-full border border-white/15 bg-[#09262f]/85 px-3 py-2 font-mono text-[9px] uppercase tracking-[.16em] text-cyan-100 backdrop-blur">
        Koncepční schéma · ne realizační výkres
      </div>
      <div className="absolute bottom-9 right-9 flex items-center gap-2 rounded-full border border-white/15 bg-[#09262f]/85 px-3 py-2 text-[10px] text-white/75 backdrop-blur">
        <Map size={13} className="text-cyan-200" /> Interaktivní příklad rozmístění
      </div>
    </div>
  );
}

export function MunicipalPageNav() {
  return (
    <nav aria-label="Obsah stránky pro města" className="sticky top-16 z-30 border-b border-slate-200/80 bg-white/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-3 lg:px-10 [scrollbar-width:none]">
        {PAGE_LINKS.map(([label, href], index) => (
          <a
            key={href}
            href={href}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors ${index === 0 ? 'bg-[#0b2d38] text-white' : 'border border-slate-200 text-slate-600 hover:border-[#0b7c89]/35 hover:text-[#0b5664]'}`}
          >
            {label}
          </a>
        ))}
      </div>
    </nav>
  );
}

export function MunicipalCustomProduction() {
  return (
    <section id="zakazkova-vyroba" className="scroll-mt-32 overflow-hidden bg-[#082a34] py-20 text-white lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.22em] text-cyan-300">Od myšlenky po provoz</p>
            <h2 className="mt-4 max-w-[12ch] font-heading text-4xl font-medium leading-[.98] tracking-[-.05em] sm:text-5xl">
              Zakázková výroba pro identitu konkrétního místa.
            </h2>
          </div>
          <div className="max-w-2xl lg:justify-self-end">
            <p className="text-base leading-7 text-white/68">
              Neprodáváme obci jen samostatný výrobek. Umíme připravit autorské nebo kombinované řešení od prvního návrhu přes technické zpracování a výrobu až po instalaci, řízení a servis.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Atypické rozměry', 'Povrch a kotvení', 'Kombinace prvků', 'Smart řízení'].map((item) => (
                <span key={item} className="rounded-full border border-white/14 bg-white/[.055] px-3 py-2 text-xs text-white/72">{item}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-px overflow-hidden rounded-[28px] border border-white/10 bg-white/10 md:grid-cols-2 xl:grid-cols-4">
          {CUSTOM_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.article
                key={step.number}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: .3 }}
                transition={{ delay: index * .06 }}
                className="relative bg-[#0b323d] p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-200/15 bg-cyan-200/10 text-cyan-200"><Icon size={19} /></span>
                  <span className="font-mono text-[10px] tracking-[.18em] text-white/25">{step.number}</span>
                </div>
                <h3 className="mt-8 font-heading text-xl font-medium">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/55">{step.text}</p>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/zakazkova-mlzitka" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-cyan px-6 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5">
            Zakázková mlžítka <ArrowRight size={15} />
          </Link>
          <Link to="/kategorie/architekti" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/8">
            Podklady pro architekty
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function MunicipalProjectStudio() {
  const [activeId, setActiveId] = useState(SCENARIOS[0].id);
  const reduceMotion = useReducedMotion();
  const scenario = useMemo(() => SCENARIOS.find((item) => item.id === activeId) || SCENARIOS[0], [activeId]);

  const selectScenario = (id) => {
    setActiveId(id);
    trackFunnelStep('cities', 'scenario_select', id);
  };

  return (
    <>
      <section id="navrhove-studio" className="scroll-mt-28 bg-[#f2f7f8] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <p className="font-mono text-[10px] uppercase tracking-[.22em] text-[#0b7c89]">Interaktivní návrhové studio</p>
            <h2 className="mt-4 font-heading text-4xl font-medium leading-[1.02] tracking-[-.045em] text-[#0b2d38] sm:text-5xl">
              Prozkoumejte princip řešení podle typu veřejného prostoru.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#536b73]">
              Zvolte prostředí. Ukážeme typické rozmístění, vhodné produktové rodiny a podklady, které má smysl připravit před rozhodnutím města.
            </p>
          </div>

          <div className="mt-10 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]" role="tablist" aria-label="Typ veřejného prostoru">
            {SCENARIOS.map((item) => {
              const Icon = item.icon;
              const active = item.id === activeId;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => selectScenario(item.id)}
                  className={`inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all ${active ? 'bg-[#0b2d38] text-white shadow-lg shadow-slate-900/15' : 'border border-slate-200 bg-white text-slate-600 hover:border-[#0b7c89]/35 hover:text-[#0b5664]'}`}
                >
                  <Icon size={16} /> {item.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.08fr_.92fr]">
            <PlanVisual scenario={scenario} />
            <AnimatePresence mode="wait">
              <motion.div
                key={scenario.id}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: .28 }}
                className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm sm:p-9"
              >
                <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#0b7c89]">{scenario.eyebrow}</p>
                <h3 className="mt-3 font-heading text-3xl font-medium leading-tight tracking-[-.035em] text-[#0b2d38]">{scenario.title}</h3>
                <p className="mt-4 text-sm leading-6 text-slate-600">{scenario.description}</p>

                <div className="mt-7">
                  <p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">Vhodné produktové rodiny</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {scenario.products.map((product) => <span key={product} className="rounded-full bg-[#e8f6f8] px-3 py-2 text-xs font-bold text-[#0b5664]">{product}</span>)}
                  </div>
                </div>

                <dl className="mt-7 space-y-3 border-t border-slate-100 pt-6">
                  {[
                    [Gauge, 'Charakter řešení', scenario.mode],
                    [Settings2, 'Provoz', scenario.control],
                    [FileCheck2, 'Výstup návrhu', scenario.output],
                  ].map(([Icon, label, value]) => (
                    <div key={label} className="grid grid-cols-[34px_1fr] gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><Icon size={15} /></span>
                      <div><dt className="text-[10px] uppercase tracking-[.12em] text-slate-400">{label}</dt><dd className="mt-1 text-sm font-medium text-slate-800">{value}</dd></div>
                    </div>
                  ))}
                </dl>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/ai-vizualizace" onClick={() => trackFunnelStep('cities', 'visualizer_click', scenario.id)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0b2d38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#124350]">
                    Vytvořit vizualizaci místa <ArrowRight size={14} />
                  </Link>
                  <a href="#poptavka" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                    Konzultovat variantu
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section id="bezpecny-provoz" className="scroll-mt-28 border-y border-slate-200 bg-[#f7fbfc] py-12 lg:py-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid items-center gap-6 rounded-[28px] border border-[#d9ecef] bg-white p-6 shadow-[0_18px_60px_rgba(11,45,56,.06)] md:grid-cols-[auto_1fr] md:p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f6f8] text-[#0b7c89]"><ShieldCheck size={22} /></span>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#0b7c89]">Bezpečný provoz</p>
              <h2 className="mt-2 font-heading text-2xl font-medium tracking-[-.025em] text-[#0b2d38] md:text-3xl">Ochlazení s jasným provozním režimem.</h2>
              <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">U městských instalací počítáme s kontrolou technického stavu, pravidelnou údržbou a sezónním uvedením do provozu. Vodní část navrhujeme podle konkrétního napojení a provozních podmínek tak, aby se minimalizovala provozní a hygienická rizika. Konkrétní požadavky se vždy ověřují pro danou instalaci.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="podklady" className="scroll-mt-28 bg-white py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[.78fr_1.22fr] lg:px-10">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.22em] text-[#0b7c89]">Podklady pro rozhodnutí</p>
            <h2 className="mt-4 font-heading text-4xl font-medium leading-[1.02] tracking-[-.045em] text-[#0b2d38]">
              Vizuálně srozumitelné. Technicky použitelné.
            </h2>
            <p className="mt-5 text-sm leading-6 text-slate-600">
              Obsah balíčku přizpůsobíme fázi projektu — od prvního interního záměru města po koordinaci s architektem a profesemi.
            </p>
            <Link to="/ke-stazeni" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#0b5664]">
              Dokumenty a technické listy <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {DELIVERABLES.map(([title, text], index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: .35 }}
                transition={{ delay: index * .05 }}
                className="rounded-3xl border border-slate-200 bg-[#f8fafb] p-6"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#0b7c89] shadow-sm"><Check size={16} /></span>
                <h3 className="mt-5 font-heading text-xl font-medium text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#f7fafb] py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <div className="text-center">
            <p className="font-mono text-[10px] uppercase tracking-[.22em] text-[#0b7c89]">Otázky měst a projektantů</p>
            <h2 className="mt-3 font-heading text-3xl font-medium tracking-[-.035em] text-[#0b2d38]">Co je dobré vědět před prvním návrhem.</h2>
          </div>
          <div className="mt-9 divide-y divide-slate-200 overflow-hidden rounded-[26px] border border-slate-200 bg-white">
            {FAQ.map(([question, answer], index) => (
              <details key={question} className="group px-6 py-5 open:bg-[#f7fbfc]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-sm font-semibold text-slate-900">
                  <span>{question}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-3xl pt-4 text-sm leading-6 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/podpora" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">Další časté dotazy</Link>
            <Link to="/poptavka" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0b2d38] px-5 py-3 text-sm font-semibold text-white">Popsat městský projekt <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}