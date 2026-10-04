import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Trees, Dumbbell, School, Store, House, ArrowRight } from 'lucide-react';

const PRIMARY_SEGMENTS = [
  {
    icon: Building2,
    title: 'Náměstí a veřejná prostranství',
    text: 'Lokální ochlazení pobytových míst, pěších zón a předprostorů veřejných budov. Návrh řeší vzhled, rozmístění, provoz i budoucí údržbu.',
  },
  {
    icon: Trees,
    title: 'Parky a promenády',
    text: 'Mlžítko může být součástí pěší trasy, odpočinkového místa nebo pobytové zóny. Umístění přizpůsobujeme vegetaci, stínu, větru a pohybu lidí.',
  },
  {
    icon: Dumbbell,
    title: 'Sportoviště a rekreační areály',
    text: 'Vhodné pro vstupy, odpočinkové zóny, okolí tribun, koupaliště a místa s vysokou letní návštěvností. Provoz lze rozdělit do zón a řídit podle reálného využití.',
  },
  {
    icon: School,
    title: 'Školy, školky a hřiště',
    text: 'Ochlazovací bod pro venkovní pobyt dětí, školní zahrady a veřejná hřiště. Návrh vždy zohledňuje charakter místa, dohled a způsob provozu.',
  },
];

const SECONDARY_SEGMENTS = [
  {
    icon: Store,
    title: 'Komerční provozy',
    text: 'Terasy, hotely, gastro a návštěvnické areály mohou využít stejné principy návrhu v menším nebo privátnějším měřítku.',
  },
  {
    icon: House,
    title: 'Rezidenční zahrady',
    text: 'Designové ochlazení terasy, pergoly, bazénové zóny nebo zahrady s důrazem na čisté začlenění do architektury.',
  },
];

export default function PdAudienceSolutions({ product }) {
  return (
    <section className="bg-[#F7FBFD] py-18 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="max-w-4xl">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[.2em] text-[#0B97E8] sm:text-[11px]">Doporučené využití</p>
          <h2 className="mt-3 max-w-4xl font-heading text-3xl font-bold leading-[1.04] tracking-[-.035em] text-[#0A2342] sm:text-4xl lg:text-5xl">
            Primárně pro města, obce a veřejný prostor.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[#0D2F4F]/62">
            {product.name} neposuzujeme jako izolovaný výrobek. Pro městský projekt řešíme místo, pohyb lidí, stín, vítr, přívod vody, způsob řízení, servisní přístup a vztah k okolní architektuře.
          </p>
        </div>

        <div className="mt-10 grid gap-px overflow-hidden rounded-[28px] border border-[#D8E8F0] bg-[#D8E8F0] sm:grid-cols-2 lg:grid-cols-4">
          {PRIMARY_SEGMENTS.map(({ icon: Icon, title, text }) => (
            <article key={title} className="bg-white p-6 lg:p-7">
              <Icon size={22} strokeWidth={1.6} className="text-[#0B97E8]" />
              <h3 className="mt-5 font-heading text-xl font-bold tracking-[-.02em] text-[#0A2342]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-[#0D2F4F]/58">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {SECONDARY_SEGMENTS.map(({ icon: Icon, title, text }) => (
            <article key={title} className="flex gap-4 rounded-[22px] border border-[#D8E8F0] bg-white p-5">
              <Icon size={20} strokeWidth={1.6} className="mt-1 shrink-0 text-[#0B97E8]" />
              <div>
                <h3 className="font-heading text-lg font-bold tracking-[-.02em] text-[#0A2342]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#0D2F4F]/58">{text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 rounded-[24px] bg-[#0A2342] p-6 text-white sm:flex-row sm:items-center sm:justify-between lg:p-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#8AEAF5]">Projektová podpora pro města a obce</p>
            <h3 className="mt-2 font-heading text-2xl font-bold tracking-[-.03em]">Pošlete lokalitu, fotografii nebo situaci.</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/62">Doporučíme umístění, počet prvků, provozní logiku a připravíme podklad pro vizualizaci, rozpočet nebo cenovou nabídku.</p>
          </div>
          <Link to={`/poptavka?produkt=${encodeURIComponent(product.slug)}`} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#22D3EE] px-5 py-3.5 text-sm font-extrabold text-[#07131D] transition hover:bg-white">
            Získat návrh a cenu <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
