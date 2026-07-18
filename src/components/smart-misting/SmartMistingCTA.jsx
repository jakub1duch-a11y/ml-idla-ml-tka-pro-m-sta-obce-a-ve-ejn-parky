import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SmartMistingCTA() {
  return <section className="bg-slate-950 py-20 text-white">
    <div className="site-container text-center">
      <p className="content-eyebrow mb-4 text-cyan">Řešení na míru</p>
      <h2 className="content-title mx-auto max-w-3xl text-white">Vybereme ventil, kotvení i tvar pro vaše místo.</h2>
      <p className="content-lead mx-auto mt-5 max-w-2xl text-white/65">Pošlete fotografii prostoru a základní rozměry. Připravíme technické zapojení a cenu na vyžádání.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3"><Link to="/poptavka?produkt=Samostatné%20chytré%20mlžítko" className="btn-metallic-mist px-7 py-4 text-sm font-bold">Odeslat poptávku <ArrowRight size={16} /></Link><Link to="/katalog" className="inline-flex items-center rounded-full border border-white/30 px-7 py-4 text-sm font-bold text-white hover:bg-white/10">Prohlédnout katalog</Link></div>
    </div>
  </section>;
}