import React from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Filter, Wrench, Sparkles, Package, ShieldCheck, Calendar, ArrowRight } from 'lucide-react';

const PRODUCTS = [
  {
    icon: Filter,
    name: 'Filtrační vložka 5 μm Big Blue 10"',
    price: 'cca 120–160 Kč',
    interval: 'Výměna 3–6 měsíců',
    desc: 'Jemný filtr zachycuje nečistoty větší než 5 mikronů a chrání trysky před zanášením. Největší vliv na životnost trysek.',
    badge: 'Klíčové',
  },
  {
    icon: Filter,
    name: 'Filtrační vložka 20 μm Big Blue 10"',
    price: 'cca 150–170 Kč',
    interval: 'Výměna 6–12 měsíců',
    desc: 'Hrubší předfiltr pro první stupeň filtrace. Prodlužuje životnost jemné vložky 5 μm v oblastech s kvalitnější vodou.',
    badge: 'Doporučeno',
  },
  {
    icon: Droplets,
    name: 'Náhradní mlžící trysky (sada 10 ks)',
    price: 'cca 400–900 Kč',
    interval: 'Dle opotřebení, obvykle 1–2 roky',
    desc: 'Trysky se časem opotřebovávají nebo zanášejí vodním kamenem. Doporučujeme mít sadu pro rychlou výměnu bez výpadku systému.',
    badge: 'Klíčové',
  },
  {
    icon: Sparkles,
    name: 'Odstraňovač vodního kamene (bez kyselin)',
    price: 'cca 150–300 Kč',
    interval: 'Čištění 1–2× ročně',
    desc: 'Pro čištění čerpadla a potrubí od vodního kamene. Používejte pouze přípravky bez kyselin, které jsou bezpečné pro nerezovou ocel.',
    badge: 'Doporučeno',
  },
  {
    icon: Wrench,
    name: 'O-kroužky a těsnění (sada)',
    price: 'cca 100–300 Kč',
    interval: 'Dle potřeby',
    desc: 'Náhradní těsnění pro spoje a fitinky. Prevence úniků vody a udržení správného tlaku v systému.',
    badge: 'Příslušenství',
  },
  {
    icon: Droplets,
    name: 'Anti-drip ventily',
    price: 'cca 30–80 Kč / ks',
    interval: 'Dle opotřebení',
    desc: 'Zabraňují kápání vody po vypnutí systému. Chrání povrchy pod tryskami před namáčením a prodlužují čistotu prostoru.',
    badge: 'Příslušenství',
  },
];

const SEASONAL_PLAN = [
  { period: 'Jaro (březen–duben)', tasks: ['Výměna filtrační vložky 5 μm', 'Kontrola a výměna opotřebovaných trysek', 'Kontrola těsnění a spojů', 'Otestování čerpadla pod tlakem'] },
  { period: 'Sezóna (květen–srpen)', tasks: ['Pravidelná kontrola tlaku', 'Čištění trysek při poklesu kvality mlhy', 'Sledování spotřeby vody'] },
  { period: 'Podzim (září–říjen)', tasks: ['Odstraňovač vodního kamene – hloubkové čištění', 'Výměna filtrační vložky 20 μm', 'Zimní konzervace (odvodnění systému)'] },
];

const BADGE_STYLES = {
  'Klíčové': 'bg-red-50 text-red-700 border-red-200',
  'Doporučeno': 'bg-amber-50 text-amber-700 border-amber-200',
  'Příslušenství': 'bg-slate-50 text-slate-600 border-slate-200',
};

export default function PortalMaintenance() {
  const totalCost = 'cca 950–1 400 Kč / sezónu';

  return (
    <div className="space-y-8">
      {/* Intro */}
      <section className="rounded-2xl border bg-gradient-to-br from-cyan-50 to-white p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <ShieldCheck className="text-primary" size={26} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Údržba a servis vašeho mlžícího systému</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              Pravidelná údržba prodlužuje životnost mlžítka o desítky procent a zajišťuje stabilní kvalitu mlhy.
              Níže najdete přehled základních produktů, které doporučujeme pro domácí i profesionální údržbu.
              Většinu z nich pořídíte v běžných e-shopech s vodními filtry nebo u nás objednáte jako servisní balíček.
            </p>
          </div>
        </div>
      </section>

      {/* Product cards */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Package size={20} className="text-primary" />
          <h3 className="text-xl font-semibold">Základní údržbové produkty</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => {
            const Icon = p.icon;
            return (
              <article key={p.name} className="flex flex-col rounded-xl border bg-card p-5 transition hover:border-primary/30 hover:shadow-md">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="text-primary" size={20} />
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${BADGE_STYLES[p.badge]}`}>
                    {p.badge}
                  </span>
                </div>
                <h4 className="text-sm font-semibold leading-snug text-foreground">{p.name}</h4>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
                <dl className="mt-4 space-y-1 border-t pt-3 text-xs">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Cena</dt>
                    <dd className="font-semibold text-foreground">{p.price}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Interval</dt>
                    <dd className="font-medium text-foreground">{p.interval}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      </section>

      {/* Seasonal plan */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-primary" />
          <h3 className="text-xl font-semibold">Doporučený sezónní plán údržby</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {SEASONAL_PLAN.map((s) => (
            <div key={s.period} className="rounded-xl border bg-card p-5">
              <h4 className="mb-3 text-sm font-bold text-primary">{s.period}</h4>
              <ul className="space-y-2">
                {s.tasks.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Cost summary + CTA */}
      <section className="rounded-xl border border-primary/20 bg-primary/5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Odhad nákladů na základní údržbu</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {totalCost} · 2× filtrační vložka + 5–10 náhradních trysek + 1× odstraňovač vodního kamene
            </p>
          </div>
          <Link to="/poptavka" className="btn-brand inline-flex items-center gap-2 whitespace-nowrap">
            Objednat servisní balíček
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Professional service note */}
      <section className="rounded-lg border bg-muted/30 p-5">
        <p className="text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Profesionální servis:</strong> Nabízíme také komplexní servisní prohlídku
          na místě — zahrnuje diagnostiku tlaku, čištění trysek, výměnu filtrů a kontrolu čerpadla.
          Pro rezervaci servisu nás kontaktujte přes formulář poptávky s poznámkou „servisní prohlídka".
        </p>
      </section>
    </div>
  );
}