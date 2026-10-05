import React from 'react';
import TechnologyGraphic from './TechnologyGraphic';
import { Link } from 'react-router-dom';
import { Smartphone, Clock, Droplets, Hand, ArrowRight } from 'lucide-react';

const FEATURES = [
  { icon: Smartphone, title: 'Ovládání z aplikace', text: 'Vzdálené zapnutí a vypnutí u sestavy připojené k SUPLA a internetu.' },
  { icon: Clock, title: 'Časové plány', text: 'Provozní okna a pulzní režim podle zvoleného řadiče a konfigurace.' },
  { icon: Droplets, title: 'Provoz podle potřeby', text: 'Nastavení intervalů mlžení; měření spotřeby vyžaduje odpovídající výbavu.' },
  { icon: Hand, title: 'Lokální ovládání', text: 'Možnost spuštění přímo na zařízení podle navrženého provedení.' },
];

export default function PdSmartControl({ product = null }) {
  return (
    <section className="bg-[#F4FAFC] py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#0E5B67]">SUPLA · volitelné smart řízení</p>
            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-[#0D2D38] sm:text-4xl">Mlžení pod kontrolou. Z místa i na dálku.</h2>
            <p className="mt-5 max-w-xl leading-7 text-slate-700">Sladíme ovládání s provozem vašeho areálu. Řadič, ventil, napájení a případné senzory vybíráme podle počtu zón, připojení a požadovaných funkcí.</p>
            <Link to={`/poptavka?produkt=${encodeURIComponent(product?.slug || '')}`} className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-xl bg-[#0D2D38] px-6 py-3 font-semibold text-white">Navrhnout chytré řízení <ArrowRight size={18}/></Link>
          </div>
          <TechnologyGraphic kind="smart" />
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div><h3 className="mb-4 text-xl font-bold text-[#0D2D38]">Skryté kotvení</h3><TechnologyGraphic kind="anchoring" /></div>
          <div><h3 className="mb-4 text-xl font-bold text-[#0D2D38]">Umístění rozvodového boxu</h3><TechnologyGraphic kind="box" /></div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-slate-200 bg-white p-5"><Icon size={24} className="text-[#0E5B67]"/><h3 className="mt-4 font-bold text-[#0D2D38]">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-700">{text}</p></article>)}
        </div>
      </div>
    </section>
  );
}
