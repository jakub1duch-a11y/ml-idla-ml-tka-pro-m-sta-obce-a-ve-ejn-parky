import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Droplets, Gauge, Smartphone, Wrench } from 'lucide-react';

const VIDEO_URL = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/aba1e0ccb_Mln_brna_video.mp4';
const FEATURES = [
  { icon: Smartphone, title: 'Chytré řízení', text: 'Přehled o zónách a provozu na jednom místě.' },
  { icon: Gauge, title: 'Reakce na podmínky', text: 'Spínání podle času, teploty a nastaveného režimu.' },
  { icon: Wrench, title: 'Proplach trysek', text: 'Pravidelné čištění a údržba 2× ročně.' },
];

export default function SmartMicroclimateHero() {
  return <section className="relative overflow-hidden bg-slate-900 py-20 text-white lg:py-28">
    <div className="mist-scene-cloud opacity-50" />
    <div className="relative mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_0.88fr] lg:items-center lg:px-10">
      <div><p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan"><Droplets size={15} /> Smart systém HolmTec</p>
        <h2 className="mt-5 max-w-xl font-heading text-4xl font-medium leading-tight tracking-tight text-white lg:text-6xl">Chytrá správa mikroklimatu.</h2>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">Nastavte komfort každé zóny přesně podle místa, času a provozu. Nízkotlaké mlžení 2–8 bar (200–800 kPa) tak pracuje účelně a s přehledem.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">{FEATURES.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"><Icon size={19} className="text-cyan" /><h3 className="mt-4 text-sm font-bold text-white">{title}</h3><p className="mt-1 text-xs leading-relaxed text-white/60">{text}</p></article>)}</div>
        <Link to="/chytra-mlzidla" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-cyan">Prozkoumat chytré řízení <ArrowRight size={16} /></Link>
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/15 bg-slate-950/50 p-4 shadow-2xl shadow-black/30"><p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-white/60">Mlžná brána</p><video controls preload="metadata" className="aspect-video w-full rounded-xl bg-black" aria-label="Pauznuté video mlžné brány"><source src={VIDEO_URL} type="video/mp4" />Váš prohlížeč nepodporuje přehrávání videa.</video><p className="mt-3 text-sm leading-relaxed text-white/60">Chladivá zóna pro vstupy, promenády i místa s vysokou návštěvností.</p></div>
    </div>
  </section>;
}