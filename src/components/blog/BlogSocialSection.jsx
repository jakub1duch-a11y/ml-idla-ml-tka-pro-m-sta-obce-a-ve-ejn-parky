import React from 'react';
import { Instagram, Linkedin, Youtube, Facebook, ArrowUpRight } from 'lucide-react';

const SOCIALS = [
  { label: 'Instagram', handle: '@mlzidla', href: 'https://www.instagram.com/mlzidla/', icon: Instagram, text: 'Nové vizualizace, krátká videa a detail mlhy v provozu.' },
  { label: 'Facebook', handle: 'HolmTec', href: 'https://www.facebook.com/holmtec/', icon: Facebook, text: 'Realizace, městské projekty, události a aktuality.' },
  { label: 'LinkedIn', handle: 'HolmTec', href: 'https://www.linkedin.com/company/holmtec/', icon: Linkedin, text: 'Pro architekty, města, partnery a profesionální projektovou praxi.' },
  { label: 'YouTube', handle: 'MLŽIDLA®', href: 'https://www.youtube.com/channel/UCeoTnyULIx5fW-71fhkG1uA', icon: Youtube, text: 'Delší videa, ukázky instalací a produktové sekvence.' },
];

export default function BlogSocialSection() {
  return (
    <section className="border-y border-slate-200 bg-[#F5F8F9] py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className="grid gap-7 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#0B6B7A]">Sledujte MLŽIDLA®</p>
            <h2 className="mt-3 font-heading text-3xl tracking-[-.035em] text-[#0A1628] sm:text-4xl">Magazín pokračuje na sociálních sítích.</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-500">Krátké formáty, nové realizace, výrobní detaily a inspiraci publikujeme podle formátu dané sítě. Vizuály pro Reels a covery používají stejné MASTER produktové reference jako web.</p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {SOCIALS.map(({ label, handle, href, icon: Icon, text }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" className="group rounded-[22px] border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-lg">
              <div className="flex items-center justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#071A2F] text-white"><Icon size={17}/></span><ArrowUpRight size={16} className="text-slate-300 transition group-hover:text-[#0B6B7A]"/></div>
              <h3 className="mt-5 text-base font-semibold text-slate-950">{label}</h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[.12em] text-[#0B6B7A]">{handle}</p>
              <p className="mt-3 text-sm leading-6 text-slate-500">{text}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
