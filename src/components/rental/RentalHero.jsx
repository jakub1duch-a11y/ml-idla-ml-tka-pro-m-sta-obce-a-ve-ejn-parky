import React from 'react';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { Link } from 'react-router-dom';

const VIDEO = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/6297e30bb_Svaovnukzkazive.mov';

export default function RentalHero() {
  return <section className="relative min-h-[78vh] overflow-hidden bg-slate-950 text-white"><video src={VIDEO} autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/25" /><div className="site-container relative flex min-h-[78vh] items-end pb-16 pt-32"><div className="max-w-3xl"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-cyan"><CalendarDays size={16} /> Pronájem na letní akce</p><h1 className="mt-5 text-white">Mlžící zóna pro váš festival, event nebo firemní den.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">Navrhneme počet mlžítek, rozmístění a bezpečný provoz. Přivezeme zařízení, instalujeme je a zajistíme technickou podporu po dobu akce.</p><Link to="/poptavka?produkt=Pronájem%20mlžítek" className="btn-metallic-mist mt-8 px-7 py-4 text-sm font-bold">Poptat termín a spolupráci <ArrowRight size={16} /></Link></div></div></section>;
}