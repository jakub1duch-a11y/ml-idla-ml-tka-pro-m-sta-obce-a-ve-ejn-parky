import React from 'react';
import { Building2, MapPin, CalendarClock, Thermometer, ShieldCheck, Gauge } from 'lucide-react';

const metrics = [
{ icon: Building2, number: '47+', label: 'Instalací ve veřejném prostoru' },
{ icon: MapPin, number: '17+', label: 'Měst a obcí' },
{ icon: CalendarClock, number: '20+', label: 'Let zkušeností' },
{ icon: Thermometer, number: '−10 °C', label: 'Maximální chladicí efekt' },
{ icon: ShieldCheck, number: 'AISI 316L', label: 'Nerezová ocel' },
{ icon: Gauge, number: '2–7 bar', label: 'Provozní tlak, bez čerpadla' }];


export default function ReferenceMetrics() {
  return (
    <section className="bg-[#062d3b] py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
          {metrics.map(({ icon: Icon, number, label }) => (
            <div key={label} className="flex flex-col items-center gap-3 bg-[#062d3b] px-4 py-8 text-center sm:py-10">
              <Icon size={20} className="text-cyan" strokeWidth={1.6} />
              <p className="font-heading text-3xl text-white lg:text-4xl">{number}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/60">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>);

}
