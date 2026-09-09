import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Landmark, Compass } from 'lucide-react';

const AUDIENCES = [
  {
    icon: Building2,
    problem: 'Horké dny omezuje pobyt občanů na náměstích, v parcích a u veřejních budov.',
    benefits: [
      'Lokální ochlazení 2–8 °C bez velkých investic do infrastruktury',
      'Provoz na běžný vodovodní tlak — bez čerpadla i bez elektřiny',
      'Nerezová konstrukce navržená pro dlouhodobý venkovní provoz',
    ],
    cta: 'Připravit podklady pro radu města',
    link: '/poptavka',
  },
  {
    icon: Landmark,
    problem: 'Sportoviště, koupaliště, ZOO a technické služby potřebují spolehlivé ochlazení pro návštěvníky i personál.',
    benefits: [
      'Modulární řešení pro areály s různými zónami využití',
      'Smart řízení podle teploty, času a provozního režimu',
      'Servis, zazimování a dlouhodobá podpora od výrobce',
    ],
    cta: 'Technická konzultace provozu',
    link: '/poptavka',
  },
  {
    icon: Compass,
    problem: 'Architekti a projektanti hledají ověřené technické řešení, které se začlení do návrhu veřejného prostoru.',
    benefits: [
      'Technické listy, kotvení a podklady pro projektovou dokumentaci',
      'Zakázkové tvary a geometrie — od mrkev po organické oblouky',
      'Vizualizace produktu v konkrétním prostoru do 48 hodin',
    ],
    cta: 'Stáhnout podklady pro projekt',
    link: '/ke-stazeni',
  },
];

export default function ProKohoSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Pro koho</p>
        <h2 className="mt-4 max-w-3xl font-heading text-3xl leading-tight text-[#0D2F4F] lg:text-4xl">
          Řešení pro tři typy zadavatelů veřejného prostoru.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {AUDIENCES.map((a) => (
            <div key={a.cta} className="flex flex-col border border-[#EAF5FB] bg-white p-7">
              <a.icon size={26} className="text-[#0B5EA8]" />
              <p className="mt-5 text-sm leading-relaxed text-[#0D2F4F]/60">{a.problem}</p>
              <ul className="mt-6 space-y-3 border-t border-[#EAF5FB] pt-6">
                {a.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm leading-relaxed text-[#0D2F4F]">
                    <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 bg-[#0B5EA8]" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                to={a.link}
                className="mt-7 inline-flex items-center gap-2 self-start font-heading text-sm font-semibold text-[#0B5EA8] transition-colors hover:text-[#0D2F4F]"
              >
                {a.cta}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}