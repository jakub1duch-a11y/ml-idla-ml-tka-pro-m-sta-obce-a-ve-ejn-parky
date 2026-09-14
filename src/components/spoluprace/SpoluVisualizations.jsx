import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';

export default function SpoluVisualizations({ items }) {
  const [active, setActive] = useState(0);
  const current = items[active];

  return (
    <section className="bg-slate-950 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mb-10 max-w-2xl" data-reveal>
          <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-cyan-300"><Layers size={13} /> Vizualizace na ukázku</p>
          <h2 className="font-heading text-3xl font-light tracking-tight text-white lg:text-4xl">Uvidíte prostor dřív, než se rozhodnete</h2>
          <p className="mt-4 font-light leading-relaxed text-white/60">
            Ke každému projektu připravíme fotovizualizaci do konkrétního místa i technický podklad pro dokumentaci. Přepněte si ukázky.
          </p>
        </div>

        <div data-reveal className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <img key={current.url} src={current.url} alt={current.alt} className="aspect-video w-full object-cover" />
          <div className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-cyan-300">{current.tag}</p>
              <p className="mt-1.5 max-w-2xl text-sm font-light leading-relaxed text-white/70">{current.desc}</p>
            </div>
            <Link to="/ai-vizualizace" className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/20 px-5 py-2.5 text-sm text-white/80 transition hover:bg-white/10 hover:text-white">
              Vizualizace k projektu <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {items.map((item, i) => (
            <button key={item.url} onClick={() => setActive(i)} data-reveal
              className={`overflow-hidden rounded-xl border text-left transition ${i === active ? 'border-cyan-400/60 bg-cyan-400/10' : 'border-white/10 hover:border-white/25'}`}>
              <img src={item.url} alt={item.alt} className="aspect-video w-full object-cover" />
              <p className={`px-3 py-2.5 font-mono text-[10px] uppercase tracking-wider ${i === active ? 'text-cyan-300' : 'text-white/45'}`}>{item.tag}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}