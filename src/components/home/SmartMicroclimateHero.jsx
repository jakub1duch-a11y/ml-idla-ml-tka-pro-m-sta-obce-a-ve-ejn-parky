import React from 'react';
import { Droplet, Gauge, ShieldCheck, SlidersHorizontal, Sparkles, Wrench } from 'lucide-react';

const VIDEO_URL = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/4b30b0391_Brna_Video.mp4';
const POSTER_URL = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/4737b1d8d_5b1b2bcc1b140ee76c8402a1e6313b8f.jpg';

const leftCards = [
  { icon: Sparkles, label: 'Materiál', title: 'Nerezová ocel AISI 316L', text: 'Odolná konstrukce pro dlouhodobý venkovní provoz.' },
  { icon: Droplet, label: 'Technologie', title: 'Trysky HolmTec®', text: 'Jemná mikromlha pro přirozené ochlazení bez mokrého efektu.' },
  { icon: Wrench, label: 'Hygiena', title: 'Proplach trysek', text: 'Pravidelné čištění a údržba 2× ročně.' },
];

const rightCards = [
  { icon: Gauge, label: 'Optimalizace', title: 'Úsporný nízkotlak', text: 'Provoz v rozsahu 2–8 bar (200–800 kPa).' },
  { icon: SlidersHorizontal, label: 'Smart', title: 'Chytrá integrace', text: 'Řízení zón podle času, teploty a provozních potřeb.' },
];

function DetailCard({ item }) {
  const Icon = item.icon;
  return <article className="relative rounded-xl border border-white/10 bg-white/[0.035] p-4 shadow-lg shadow-black/20 backdrop-blur-sm">
    <Icon size={15} className="absolute right-4 top-4 text-white/35" />
    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-cyan">{item.label}</p>
    <h3 className="mt-2 text-sm font-bold text-white">{item.title}</h3>
    <p className="mt-1 text-[11px] leading-relaxed text-white/45">{item.text}</p>
  </article>;
}

export default function SmartMicroclimateHero() {
  return <section className="relative overflow-hidden bg-slate-950 py-20 text-white lg:py-28">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(14,165,233,.13),transparent_28%),linear-gradient(90deg,rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:auto,42px_42px,42px_42px]" />
    <div className="relative mx-auto max-w-5xl px-6 lg:px-10">
      <div className="mb-10 text-center"><p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan">Smart systém HolmTec</p><h2 className="mt-3 font-heading text-4xl font-medium tracking-tight text-white lg:text-5xl">Chytrá správa mikroklimatu.</h2></div>
      <div className="grid gap-5 lg:grid-cols-[0.82fr_1fr_0.82fr] lg:items-center">
        <div className="space-y-4">{leftCards.map((item) => <DetailCard key={item.title} item={item} />)}</div>
        <div className="relative overflow-hidden rounded-xl border border-cyan/20 bg-black shadow-2xl shadow-black/40">
          <video controls preload="metadata" poster={POSTER_URL} className="aspect-[4/5] w-full object-cover" aria-label="Pauznuté video mlžné brány"><source src={VIDEO_URL} type="video/mp4" />Váš prohlížeč nepodporuje přehrávání videa.</video>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/20" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 text-center"><span className="mx-auto mb-4 block h-2 w-2 rounded-full bg-cyan shadow-[0_0_14px_#22d3ee]" /><h3 className="font-heading text-2xl font-medium text-cyan">Mlžná brána</h3><p className="mt-2 text-xs text-white/55">Chladivý vstup do veřejného prostoru</p></div>
        </div>
        <div className="space-y-4"><DetailCard item={rightCards[0]} /><DetailCard item={rightCards[1]} /><div className="rounded-xl border border-white/10 bg-white/[0.035] p-4"><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">Mist control panel</p><div className="mt-4 flex items-center justify-between gap-3"><span className="rounded-lg bg-cyan px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-slate-950">Aktivovat mlžení</span><span className="rounded-full border border-white/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white/40">● Offline</span></div><p className="mt-3 text-[10px] leading-relaxed text-white/40">Nastavení zón a provozních režimů na jednom místě.</p></div></div>
      </div>
    </div>
  </section>;
}