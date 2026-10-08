import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Ruler, Droplets } from 'lucide-react';

const STEPS = [
{ icon: Ruler, title: 'Fotografie nebo půdorys', text: 'Stačí podklad místa a představa o jeho využití.' },
{ icon: MapPin, title: 'Rozmístění a volba prvků', text: 'Navrhneme body osvěžení s ohledem na pohyb lidí, zeleň a charakter prostoru.' },
{ icon: Droplets, title: 'Voda, kotvení a provoz', text: 'Upřesníme napojení, skrytou instalaci a vhodný způsob ovládání.' }];


export default function PlanningZoneSection() {
  return <section className="premium-section premium-pattern-light bg-[#F3F8FA]" aria-labelledby="planning-title">
    <div className="premium-shell grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      <figure className="relative overflow-hidden rounded-[2rem] bg-[#E1EAE5] shadow-[0_24px_70px_rgba(8,44,63,.12)]">
        <picture><source media="(max-width: 767px)" srcSet="/media/planning/misting-zones-plan-mobile.webp" />
          <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ee5759df9_foto-instalace-vyroba.png" alt="Půdorysný návrh s cestami, zelení a zakreslenými body mlžení" width="1400" height="584" className="h-auto w-full object-contain" loading="lazy" decoding="async" />
        </picture>
        <figcaption className="bg-[#082C3F] px-6 py-5 text-white"><span className="block font-mono text-[10px] uppercase tracking-[.18em] text-cyan-200">Ukázka návrhu rozmístění</span><span className="mt-1 block text-sm leading-6 text-slate-100">Půdorys, jednotlivá mlžítka a zóny osvěžení.</span></figcaption>
      </figure>
      <div><p className="font-mono text-xs uppercase tracking-[.18em] text-cyan-800">Plánování a realizace</p>
        <h2 id="planning-title" className="mt-4 font-heading text-3xl font-black leading-tight tracking-tight text-[#07131D] sm:text-4xl">Od prvního plánku k příjemnějšímu prostoru.</h2>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">Každé místo má vlastní rytmus. Z fotografie nebo půdorysu připravíme návrh mlžných zón a doporučíme řešení pro váš projekt.</p>
        <div className="mt-7 space-y-3">{STEPS.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-4 rounded-2xl bg-white p-5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E6F4F7] text-cyan-800"><Icon size={19} aria-hidden="true" /></span><div><h3 className="font-semibold text-[#16374B]">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-600">{text}</p></div></div>)}</div>
        <Link to="/poptavka" className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#082C3F] px-6 text-sm font-semibold text-white transition-colors hover:bg-cyan-800">Poslat podklady k návrhu <ArrowRight size={17} /></Link>
      </div>
    </div>
  </section>;
}