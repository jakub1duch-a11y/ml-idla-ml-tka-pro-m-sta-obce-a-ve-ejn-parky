import React from 'react';
import { Building2, Users, Home, Warehouse, Baby } from 'lucide-react';

const SEGMENTS = [
  { icon: Building2, code: 'B2G', label: 'Města a obce', desc: 'Ochlazení náměstí, parků a promenád. Podklady pro radu města, pilotní nasazení a dotační programy.' },
  { icon: Users, code: 'EVENT', label: 'Eventy a festivaly', desc: 'Pronájem nebo koupě mobilních mlžítek TEEPEE a bran. Rychlá montáž, napojení na hydrant nebo cisternu.' },
  { icon: Home, code: 'HOME', label: 'Zahrady a rezidence', desc: 'BENDY, AURA a STÉBLO pro terasy, pergoly a zahrady. Napojení na zahradní vodu, bez čerpadla.' },
  { icon: Warehouse, code: 'B2B', label: 'Gastro, hotely, areály', desc: 'Letní terasy, wellness a resorty. Diskrétní nerezové prvky s řízením podle teploty.' },
  { icon: Baby, code: 'KIDS', label: 'Školy, školky, hřiště', desc: 'Bezpečná mlha bez chemie, potravinářská nerez, oblé tvary LÍZÁTKO, MRKEV a CREATIVE kolekce.' },
];

export default function CatalogAudience() {
  return (
    <section className="border-t border-[#D3E2E8] bg-[#F4FAFC]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#153863]">// Pro koho</p>
        <h2 className="mt-3 font-heading text-3xl font-semibold text-[#0A1628] sm:text-4xl">Řešení podle prostoru a provozu.</h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {SEGMENTS.map(({ icon: Icon, code, label, desc }) => (
            <div key={label} className="card-brand-benefit">
              <div className="ico"><Icon size={26} strokeWidth={1.5} /></div>
              <div className="code">// {code}</div>
              <h3>{label}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}