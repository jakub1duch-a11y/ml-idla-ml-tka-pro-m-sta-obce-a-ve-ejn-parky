import React from 'react';
import { BarChart3, Droplets, Gauge, Smartphone, Timer, Wifi } from 'lucide-react';

const bars = [14, 20, 28, 42, 58, 74, 66, 48, 34, 24];

export default function SmartAppConsumptionSection() {
  return (
    <section className="relative overflow-hidden bg-[#061c2d] py-16 text-white sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(83,210,239,.10)_1px,transparent_1px),linear-gradient(90deg,rgba(83,210,239,.10)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 sm:px-6 lg:grid-cols-[.82fr_1.18fr] lg:items-center lg:px-10">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-cyan-300">SUPLA · vzdálené řízení</p>
          <h2 className="mt-4 max-w-xl font-heading text-4xl leading-[1.02] tracking-[-.035em] sm:text-5xl">Ovládání i přehled provozu v telefonu.</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/68 sm:text-lg">Zapnutí a vypnutí na dálku, provozní scénáře a přehled spotřeby vody v jednom rozhraní. Zobrazené hodnoty jsou ilustrační; dostupná data se řídí konkrétní konfigurací systému.</p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[[Wifi,'Vzdálené ovládání'],[Timer,'Časové scénáře'],[BarChart3,'Přehled provozu']].map(([Icon,label]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[.055] p-4 backdrop-blur">
                <Icon className="mb-3 text-cyan-300" size={20}/><p className="text-sm font-semibold text-white/90">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-[#082840] p-4 shadow-2xl shadow-black/25 sm:p-5">
            <div className="mx-auto max-w-[300px] rounded-[2rem] border border-white/10 bg-[#041827] p-5">
              <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/15 text-cyan-300"><Smartphone size={20}/></span><div><p className="text-xs text-white/45">MLŽIDLA.cz</p><p className="font-semibold">Chytré mlžení</p></div></div>
              <div className="my-8 grid place-items-center"><div className="grid h-36 w-36 place-items-center rounded-full border-[7px] border-cyan-300/85 shadow-[0_0_45px_rgba(34,211,238,.22)]"><span className="text-center"><Wifi className="mx-auto mb-2 text-cyan-300"/><b className="block">Zapnuto</b></span></div></div>
              <div className="space-y-2"><div className="rounded-xl bg-white/[.06] p-3 text-sm">Automatické řízení</div><div className="rounded-xl bg-white/[.06] p-3 text-sm">Časové scénáře</div></div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-300/15 bg-[#082840] p-4 shadow-2xl shadow-black/25 sm:p-5">
            <div className="mx-auto max-w-[300px] rounded-[2rem] border border-white/10 bg-[#041827] p-5">
              <div className="flex items-center justify-between"><div><p className="text-xs text-white/45">Přehled</p><h3 className="mt-1 text-xl font-bold">Spotřeba vody</h3></div><Droplets className="text-cyan-300"/></div>
              <div className="mt-6 rounded-2xl bg-cyan-300/[.07] p-4"><p className="text-xs uppercase tracking-wider text-white/45">Dnes · ukázka</p><p className="mt-1 text-3xl font-bold">48,2 l</p></div>
              <div className="mt-6 flex h-32 items-end gap-1.5 rounded-2xl border border-white/[.06] bg-white/[.025] p-4" aria-label="Ilustrační graf spotřeby vody">
                {bars.map((h,i)=><span key={i} className="flex-1 rounded-t bg-cyan-300/85" style={{height:h+'%'}} />)}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-xl bg-white/[.06] p-3"><Gauge size={16} className="text-cyan-300"/><p className="mt-2 text-[11px] text-white/45">Průtok</p><p className="text-sm font-semibold">dle senzoru</p></div><div className="rounded-xl bg-white/[.06] p-3"><BarChart3 size={16} className="text-cyan-300"/><p className="mt-2 text-[11px] text-white/45">Historie</p><p className="text-sm font-semibold">dle konfigurace</p></div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
