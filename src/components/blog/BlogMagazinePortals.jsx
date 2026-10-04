import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Building2, Dumbbell, GraduationCap } from 'lucide-react';

const PORTALS = [
  {
    key: 'mesta',
    title: 'Města a obce',
    text: 'Náměstí, parky, pěší zóny a veřejný prostor. Inspirace pro městské mikroklima.',
    href: '/blog?tema=mesta',
    icon: Building2,
    image: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/d2ed069f8_mlzne-brany-a-portaly---mlzidla.jpg',
  },
  {
    key: 'sport',
    title: 'Sportoviště',
    text: 'Ochlazení návštěvníků, sportovců a pobytových zón během horkých dnů.',
    href: '/blog?tema=sport',
    icon: Dumbbell,
    image: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/1c63ea4bc_sportoviste-a-mlzne-hriste-mlhoviste.jpg',
  },
  {
    key: 'skoly',
    title: 'Školy, školky a hřiště',
    text: 'Bezpečnější a příjemnější venkovní pobyt dětí s jemnou vodní mlhou.',
    href: '/blog?tema=skoly',
    icon: GraduationCap,
    image: 'https://base44.app/api/apps/6a3ee88c10959cd3588c4d68/files/mp/public/6a3ee88c10959cd3588c4d68/d99ac5771_mlzne-brany-pro-detske-detske-hriste.jpg',
  },
];

export default function BlogMagazinePortals() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-7 lg:px-10 lg:py-16">
      <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#0B6B7A]">Magazín podle prostoru</p>
          <h2 className="mt-2 font-heading text-3xl tracking-[-.035em] text-[#0A1628] sm:text-4xl">Inspirace pro konkrétní místo.</h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-slate-500">Tři rychlé vstupy pro nejčastější veřejné projekty. Každý kombinuje realizace, návrhy, technologie a vhodné produkty.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {PORTALS.map(({ key, title, text, href, icon: Icon, image }) => (
          <Link key={key} to={href} className="group relative min-h-[360px] overflow-hidden rounded-[28px] bg-[#071A2F] text-white">
            <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#051522]/95 via-[#071A2F]/25 to-black/5" />
            <div className="relative flex min-h-[360px] flex-col justify-between p-6 sm:p-7">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/15 backdrop-blur-md"><Icon size={18}/></span>
              <div>
                <h3 className="font-heading text-3xl tracking-[-.03em]">{title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/68">{text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.08em] text-cyan-200">Otevřít téma <ArrowUpRight size={14}/></span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
