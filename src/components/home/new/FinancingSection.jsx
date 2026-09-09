import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FUNDS = [
  { code: 'OPŽP', title: 'Operační program Životní prostředí', desc: 'Adaptace sídel na změnu klimatu — opatření pro veřejnou zeleň a prostranství.' },
  { code: 'NPŽP', title: 'Národní program Životního prostředí', desc: 'Podpora projektů zlepšujících mikroklima ve městech a obcích.' },
  { code: 'Krajské programy', title: 'Krajské a regionální programy', desc: 'Dotační tituly krajů pro zlepšení kvality života ve veřejném prostoru.' },
];

export default function FinancingSection() {
  return (
    <section className="bg-[#EAF5FB] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Financování a dotace</p>
        <h2 className="mt-4 max-w-3xl font-heading text-3xl leading-tight text-[#0D2F4F] lg:text-4xl">
          Připravíme podklady pro dotační žádost.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {FUNDS.map((f) => (
            <div key={f.code} className="border border-[#0B5EA8]/15 bg-white p-7">
              <span className="font-mono text-xs uppercase tracking-wide text-[#0B5EA8]">{f.code}</span>
              <h3 className="mt-3 font-heading text-lg font-semibold text-[#0D2F4F]">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#0D2F4F]/60">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-4 border-t border-[#0B5EA8]/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-relaxed text-[#0D2F4F]/70">
            Připravíme technický popis, rozpočet a parametry systému ve formátu vhodném pro dotační žádost.
          </p>
          <Link
            to="/poptavka"
            className="inline-flex items-center gap-2 self-start bg-[#0B5EA8] px-7 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#094d8a]"
          >
            Požádat o podklady
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}