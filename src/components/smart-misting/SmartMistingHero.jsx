import React from 'react';
import { ArrowRight, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

const heroImage = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/f16a9c3ea_generated_image.png';

export default function SmartMistingHero() {
  return <section className="relative min-h-[76svh] overflow-hidden bg-slate-950 text-white">
    <img src={heroImage} alt="Samostatná nerezová mlžítka s kotvením do patky a zemním vrutem" className="absolute inset-0 h-full w-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/15" />
    <div className="relative site-container flex min-h-[76svh] items-end py-16 pt-32 lg:py-24">
      <div className="max-w-3xl">
        <p className="content-eyebrow mb-5 text-cyan">Smart mlžení · AISI 316L</p>
        <h1 className="content-title text-white">Samostatná mlžítka, která spustíte odkudkoli.</h1>
        <p className="content-lead mt-6 max-w-2xl text-white/75">Nerezové sochy z trubek Ø 70 mm, kotvení na patku nebo zemní vrut a chytré ventily s ovládáním v mobilní aplikaci.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/poptavka?produkt=Chytré%20mlžítko" className="btn-metallic-mist px-7 py-4 text-sm font-bold">Vyžádat návrh a cenu <ArrowRight size={16} /></Link>
          <Link to="/katalog" className="inline-flex items-center gap-2 rounded-full border border-white/35 px-7 py-4 text-sm font-bold text-white hover:bg-white/10"><Radio size={16} /> Produktový katalog</Link>
        </div>
      </div>
    </div>
  </section>;
}