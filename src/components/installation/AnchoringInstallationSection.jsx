import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Download, Droplets, Layers3, ShieldCheck } from 'lucide-react';
import AnchorMotionPreview from './AnchorMotionPreview';

const BENEFITS = [
  { icon: ShieldCheck, title: 'Stabilita pod povrchem', text: 'Patka a kotvy spojují mlžítko s navrženým nosným základem. V hotovém prostoru zůstávají skryté.' },
  { icon: Droplets, title: 'Čisté napojení vody', text: 'Přívod vede pod povrchem a vstupuje do konstrukce nad patkou. Detail napojení a servis řeší projekt.' },
  { icon: Layers3, title: 'Povrch podle místa', text: 'Trávník, dlažba nebo mlat navazují na konstrukci. Skladbu podloží přizpůsobíme místu i modelu.' },
];

export default function AnchoringInstallationSection() {
  return (
    <section id="kotveni" className="premium-section premium-pattern-light bg-[#F7FAFC]" aria-labelledby="kotveni-title">
      <div className="premium-shell grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
        <AnchorMotionPreview />
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[.22em] text-[#0B5EA8]">Kotvení a instalace</p>
          <h2 id="kotveni-title" className="mt-4 font-heading text-[clamp(2rem,4vw,3.7rem)] font-bold leading-[1.04] tracking-[-.035em] text-[#0A2342]">
            V prostoru mlžítko.<br />Pod povrchem technika.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#365366]">
            Prohlédněte si princip pevné instalace v přehledném řezu. Od nosného základu a přívodu vody až po dokončený povrch bez viditelné patky.
          </p>
          <div className="mt-8 space-y-5">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E0F2F7] text-[#087DA7]"><Icon size={21} strokeWidth={1.6} aria-hidden="true" /></span>
                <div><h3 className="text-base font-bold text-[#0A2342]">{title}</h3><p className="mt-1 text-sm leading-6 text-[#365366]">{text}</p></div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/jak-to-funguje#instalace" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-[#082C42] px-6 text-sm font-semibold text-white">Jak funguje instalace <ArrowRight size={16} /></Link>
            <Link to="/ke-stazeni" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#25495E]"><Download size={16} /> Technické podklady</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
