import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, MapPin } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CITY_REFERENCES = [
  {
    city: 'Praha',
    code: 'PHA',
    label: 'městské parky, školy, pobytové zóny a veřejný prostor',
    href: '/reference',
  },
  {
    city: 'Polná',
    code: 'POL',
    label: 'slavnosti, eventy, Mrkvobraní a sezónní osvěžení',
    href: '/reference/mesto-polna-mlzitko-mrkev',
  },
  {
    city: 'Jičín',
    code: 'JIC',
    label: 'náměstí, promenády, parky a turistické trasy',
    href: '/reference/bendy-jicinske-namesti',
  },
  {
    city: 'Brno',
    code: 'BRN',
    label: 'sportoviště, parky, areály a pobytové zóny',
    href: '/reference',
  },
];

export default function ReferencesStrip() {
  const [cities, setCities] = useState(CITY_REFERENCES);

  useEffect(() => {
    base44.entities.Realizace.filter({ published: true, category: 'mestsky' }, '-year', 20)
      .then((items) => {
        if (!items?.length) return;
        const merged = [...CITY_REFERENCES];
        items.forEach((item) => {
          const name = item.client || item.location || item.name || '';
          const normalized = name.toLowerCase();
          const existing = merged.find((city) => normalized.includes(city.city.toLowerCase()) || city.city.toLowerCase().includes(normalized));
          if (!existing && name) {
            merged.push({
              city: name.replace(/^Město\s+/i, '').trim(),
              code: name.slice(0, 3).toUpperCase(),
              label: item.short_description || item.description || 'veřejný prostor a realizace mlžení',
              href: item.slug ? `/reference/${item.slug}` : '/reference',
            });
          }
        });
        setCities(merged.slice(0, 8));
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-[#EAF5FB] bg-[#fbfdfe] py-14 sm:py-16" aria-labelledby="city-references-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 -top-20 h-56 w-56 rounded-full bg-cyan-200/20 blur-[72px]" />
        <div className="absolute -right-20 top-2 h-52 w-52 rounded-full bg-sky-100/35 blur-[80px]" />
        <div className="absolute left-[18%] top-[-20%] h-44 w-[70%] rounded-[50%] bg-white/65 blur-[56px]" />
        <div className="animate-mist-drift absolute left-[8%] top-[44%] h-20 w-[84%] rounded-[50%] bg-cyan-100/10 blur-[34px] [animation-duration:18s]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-col gap-5 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.24em] text-[#0D2F4F]/50">
              Vybrané realizace a města
            </p>
            <h2 id="city-references-title" className="mt-3 font-heading text-3xl font-black tracking-[-.05em] text-[#07131D] sm:text-4xl">
              Města, kde dává mlžení smysl.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Přehled městských prostorů pro nové návrhy a realizace. Oficiální znaky měst lze doplnit po dodání schválených podkladů.
            </p>
          </div>
          <Link to="/poptavka" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#07131D] px-5 py-3 text-sm font-bold text-white shadow-[0_18px_50px_rgba(7,19,29,.16)] transition hover:-translate-y-0.5 hover:bg-[#0B8EC5]">
            Poptat novou realizaci <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cities.map((item) => (
            <Link
              key={`${item.city}-${item.code}`}
              to={item.href || '/reference'}
              className="group rounded-3xl border border-[#D8EAF2] bg-white p-5 shadow-[0_16px_50px_rgba(13,45,56,.06)] transition hover:-translate-y-1 hover:border-[#26C6E9]/50 hover:shadow-[0_22px_70px_rgba(11,142,197,.14)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E7F8FE] text-[#0B8EC5]">
                  <Building2 size={24} />
                </div>
                <span className="rounded-full border border-[#D8EAF2] px-3 py-1 font-mono text-[10px] font-bold tracking-[.16em] text-[#0D2F4F]/50">
                  {item.code}
                </span>
              </div>
              <h3 className="mt-5 font-heading text-2xl font-black tracking-[-.05em] text-[#07131D]">{item.city}</h3>
              <p className="mt-2 min-h-[58px] text-sm leading-6 text-slate-500">{item.label}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-[#0B8EC5] transition group-hover:translate-x-1">
                Zobrazit / poptat <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}