import React from 'react';
import { ArrowRight, Clock3, Smartphone, ThermometerSun, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';

const SCENARIOS = [
  { Icon: ThermometerSun, title: 'Podle teploty', text: 'Mlžení se spustí až při nastavené venkovní teplotě.' },
  { Icon: Clock3, title: 'Podle času', text: 'Nastavíte provozní okna pro ráno, odpoledne, akci nebo víkend.' },
  { Icon: Smartphone, title: 'Kdykoli z aplikace', text: 'Obsluha může mlžítko ručně zapnout či vypnout na dálku.' },
];

export default function SmartControlTeaser() {
  return (
    <section className="overflow-hidden bg-[#071f37] py-20 text-white lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[.9fr_1.1fr] lg:gap-20 lg:px-10">
        <div>
          <div className="inline-flex items-center gap-2 border border-cyan/30 bg-cyan/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.16em] text-cyan">
            <Wifi size={14} /> Volitelné chytré řízení
          </div>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[.18em] text-cyan/80">Smart ventil + aplikace SUPLA</p>
          <h2 className="mt-4 max-w-xl font-heading text-3xl leading-tight sm:text-4xl lg:text-5xl">
            Osvěžení přesně tehdy,<br />kdy je potřeba.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">
            Chytrý ventil ovládá přívod vody k mlžítku. V aplikaci SUPLA lze vytvořit provozní scénáře a upravit je podle konkrétního místa, teploty nebo denního režimu.
          </p>
          <p className="mt-5 max-w-xl border-l-2 border-cyan pl-4 text-sm leading-relaxed text-white/58">
            Konkrétní zapojení, počet zón a vhodný ventil vždy navrhujeme podle přívodu vody a režimu instalace.
          </p>
          <Link to="/smart-ovladani" className="btn-metallic-mist mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold">
            Jak funguje chytré řízení <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {SCENARIOS.map(({ Icon, title, text }, index) => (
            <article key={title} className="relative min-h-[210px] border border-white/12 bg-white/[.045] p-6 transition-transform duration-300 hover:-translate-y-1 hover:border-cyan/45">
              <span className="font-mono text-[10px] tracking-widest text-cyan">0{index + 1}</span>
              <Icon size={25} className="mt-7 text-cyan" />
              <h3 className="mt-5 font-heading text-lg font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}