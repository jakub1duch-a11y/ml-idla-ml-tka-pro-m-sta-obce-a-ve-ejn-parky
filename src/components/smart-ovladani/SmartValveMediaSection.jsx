import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Wifi, Power, Clock3, CircleCheck } from 'lucide-react';
import PevekoValveFlow from '@/components/smart-ovladani/PevekoValveFlow';

const FEATURES = [
  { icon: Power, title: 'Otevřít a zavřít', text: 'Povel k ovládání vody přímo z aplikace SUPLA.' },
  { icon: CircleCheck, title: 'Vidět stav ventilu', text: 'Přehled, zda je vodní větev otevřená nebo uzavřená.' },
  { icon: Clock3, title: 'Nastavit režim', text: 'Časový plán podle zvolené konfigurace.' },
];

export default function SmartValveMediaSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#071a2f] py-14 text-white sm:py-20 lg:py-24" aria-labelledby="peveko-hero-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_45%,rgba(17,136,169,.20),transparent_65%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 sm:px-8 lg:grid-cols-[.95fr_1.05fr] lg:gap-12 lg:px-10">
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[.18em] text-cyan-300"><Wifi size={15} aria-hidden="true" /> PEVEKO + SUPLA</p>
          <h2 id="peveko-hero-title" className="mt-4 font-heading text-3xl font-semibold leading-tight tracking-[-.035em] sm:text-4xl lg:text-5xl">Přívod vody.<br />Pod kontrolou z mobilu.</h2>
          <p className="mt-5 text-base leading-7 text-slate-300">Chytrý ventil PEVEKO s Wi‑Fi propojuje vodní větev s aplikací SUPLA. Otevření, uzavření a stav máte přehledně v telefonu.</p>
          <div className="mt-7 space-y-5">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200"><Icon size={19} aria-hidden="true" /></span>
                <div><h3 className="text-sm font-bold text-white">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-300">{text}</p></div>
              </div>
            ))}
          </div>
          <Link to="/poptavka?tema=peveko-supla" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-cyan-200 px-6 py-3 text-sm font-bold text-[#073142] transition hover:bg-cyan-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071a2f]">Navrhnout chytré řízení <ArrowRight size={16} aria-hidden="true" /></Link>
          <p className="mt-4 text-xs leading-5 text-slate-400">Model a zapojení volíme podle přívodu vody a požadovaného provozu.</p>
        </div>
        <div className="min-w-0 rounded-[2rem] bg-white/[.035] p-3 sm:p-5"><PevekoValveFlow /></div>
      </div>
    </section>
  );
}
