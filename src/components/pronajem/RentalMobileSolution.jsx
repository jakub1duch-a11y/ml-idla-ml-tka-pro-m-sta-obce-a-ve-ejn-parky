import React from 'react';
import { Timer, Plug, Droplets, Users } from 'lucide-react';

const IMG = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/050241c29_857978927_1792548451137310.jpg';
const POINTS = [
  { Icon: Timer, title: 'Rychlé postavení', text: 'Zátěžová patka bez kotvení do terénu, zprovoznění během krátké přípravy.' },
  { Icon: Plug, title: 'Napojení na vodu', text: 'Připojení hadicí k běžnému vodovodnímu bodu nebo hydrantu s pojistným ventilem.' },
  { Icon: Droplets, title: 'Úsporné mlžení', text: 'Mikrotrysky vytvoří jemnou mlhu při nízké spotřebě vody.' },
  { Icon: Users, title: 'Bezpečný průchod', text: 'Volný prostor pro chodce, lavičky i dětské hry kolem zařízení.' },
];

export default function RentalMobileSolution() {
  return <section className="bg-card py-16 lg:py-24">
    <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:items-center lg:px-10">
      <img src={IMG} alt="Mobilní mlžná spirála na zátěžové patce pro akce a náměstí" loading="lazy" className="w-full rounded-lg border border-border object-contain" />
      <div>
        <p className="font-mono text-[11px] tracking-[.18em] text-secondary">MOBILNÍ ŘEŠENÍ</p>
        <h2 className="mt-3 font-heading text-3xl text-foreground lg:text-4xl">Mlžítko bez výkopu a bez kotvení.</h2>
        <p className="mt-4 text-muted-foreground">Pro akce, sezónní provoz i zkušební umístění ve městě. Zařízení postavíme, připojíme a po akci odvezeme.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {POINTS.map(({ Icon, title, text }) => <div key={title} className="border-t border-border pt-4">
            <Icon size={20} className="text-accent" /><h3 className="mt-2 font-heading text-base text-foreground">{title}</h3><p className="mt-1 text-sm text-muted-foreground">{text}</p>
          </div>)}
        </div>
      </div>
    </div>
  </section>;
}