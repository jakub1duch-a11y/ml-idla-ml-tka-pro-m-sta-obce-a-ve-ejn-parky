import React from 'react';
import { CalendarClock, CheckCircle2, Cloud, Power, Wifi } from 'lucide-react';

const steps = [{ icon: Wifi, title: '1. Spárujte ventil', text: 'Telefon připojte k Wi‑Fi 2,4 GHz a přidejte zařízení v aplikaci.' }, { icon: Cloud, title: '2. Pojmenujte mlžítko', text: 'Například MLŽÍTKO MRAK a ZÓNA 01 pro snadnou orientaci.' }, { icon: CalendarClock, title: '3. Nastavte interval', text: 'Určete čas od–do a délku jednotlivých mlžicích cyklů.' }, { icon: Power, title: '4. Ověřte ruční spuštění', text: 'Krátkým testem zkontrolujte ventil, trysky a směr mlhy.' }];

export default function MistingAppGuide() {
  return <div className="grid gap-4 sm:grid-cols-2">{steps.map(({ icon: Icon, title, text }) => <article key={title} className="border-l-2 border-cyan bg-slate-950 p-5 text-white"><Icon size={20} className="text-cyan" /><h3 className="mt-4 text-base font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-white/55">{text}</p><CheckCircle2 size={14} className="mt-4 text-cyan/60" /></article>)}</div>;
}