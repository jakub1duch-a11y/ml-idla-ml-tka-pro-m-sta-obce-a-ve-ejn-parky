import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Trees, Dumbbell, Store, House, ArrowRight } from 'lucide-react';

const SEGMENTS = [
  {
    icon: Building2,
    title: 'Města a náměstí',
    text: 'Lokální ochlazení pobytových míst, pěších zón a předprostorů veřejných budov. Řešíme vzhled, umístění, provoz i budoucí údržbu jako jeden celek.',
  },
  {
    icon: Trees,
    title: 'Parky a promenády',
    text: 'Mlžítko může fungovat jako odpočinkový bod, orientační prvek i součást pěší trasy. Návrh přizpůsobujeme vegetaci, stínu, větru a pohybu lidí.',
  },
  {
    icon: Dumbbell,
    title: 'Sportoviště a areály',
    text: 'Osvěžení pro vstupy, odpočinkové zóny, tribuny, dětské plochy a rekreační areály. Provoz lze rozdělit do zón a řídit podle reálného využití.',
  },
  {
    icon: Store,
    title: 'Komerční provozy',
    text: 'Terasy, hotely, gastro a eventové plochy získají příjemnější mikroklima bez toho, aby technické řešení rušilo architekturu prostoru.',
  },
  {
    icon: House,
    title: 'Soukromé zahrady',
    text: 'Designové ochlazení terasy, bazénové zóny, pergoly nebo zahrady. Důraz klademe na čistý detail, vhodné umístění a klidný provoz.',
  },
];

export default function PdAudienceSolutions({ product }) {
  return (
    <section className="bg-[#F7FBFD] py-18 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="max-w-4xl">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[.2em] text-[#0B97E8] sm:text-[11px]">Využití v prostoru</p>
          <h2 className="mt-3 max-w-3xl font-heading text-3xl font-bold leading-[1.04] tracking-[-.035em] text-[#0A2342] sm:text-4xl lg:text-5xl">
            Jedno mlžítko. Jiný kontext, jiný návrh.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#0D2F4F]/62">
            {product.name} nenavrhujeme jako izolovaný výrobek. Vždy posuzujeme místo, pohyb lidí, stín, vítr, přívod vody, způsob řízení a charakter architektury.
          </p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-[28px] border border-[#D8E8F0] bg-[#D8E8F0] sm:grid-cols-2 lg:grid-cols-5">
          {SEGMENTS.map(({ icon: Icon, title, text }) => (
            <article key={title} className="bg-white p-6 lg:p-7">
              <Icon size={22} strokeWidth={1.6} className="text-[#0B97E8]" />
              <h3 className="mt-5 font-heading text-xl font-bold tracking-[-.02em] text-[#0A2342]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#0D2F4F]/58">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 rounded-[24px] bg-[#0A2342] p-6 text-white sm:flex-row sm:items-center sm:justify-between lg:p-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#8AEAF5]">Návrh pro konkrétní místo</p>
            <h3 className="mt-2 font-heading text-2xl font-bold tracking-[-.03em]">Pošlete nám lokalitu, fotografii nebo situaci.</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/62">Doporučíme vhodné umístění, počet prvků, provozní logiku a připravíme podklad pro cenu nebo nabídku.</p>
          </div>
          <Link to={`/poptavka?produkt=${encodeURIComponent(product.slug)}`} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#22D3EE] px-5 py-3.5 text-sm font-extrabold text-[#07131D] transition hover:bg-white">
            Získat návrh a cenu <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
