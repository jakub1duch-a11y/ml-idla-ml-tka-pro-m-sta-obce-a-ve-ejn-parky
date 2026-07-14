import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80';
const FEATURES = ['Chlazení a mlžné technologie', 'Nízký tlak 2-7 BAR', 'Přínosy mlžítek', 'Chytré ovládání (WiFi)', 'Nízká spotřeba vody'];

export default function LightSmartBanner() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-6">
      <div className="rounded-2xl overflow-hidden bg-slate-900 grid lg:grid-cols-2">
        <div className="aspect-[4/3] lg:aspect-auto">
          <img src={IMAGE} alt="SMART ovládání" className="w-full h-full object-cover opacity-80" />
        </div>
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <h2 className="font-heading font-bold text-2xl text-white mb-4">SMART ovládání</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            Ochlazení náměstí, hřišť a event prostor až o 10 °C. Nízkotlaká technologie 2-7 BAR, certifikace ČSN EN 1176.
          </p>
          <ul className="space-y-2 mb-7">
            {FEATURES.map((f) => (
              <li key={f} className="text-sm text-white/80 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <Link to="/chytra-mlzidla" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:gap-3 transition-all w-fit">
            Zjistit více <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}