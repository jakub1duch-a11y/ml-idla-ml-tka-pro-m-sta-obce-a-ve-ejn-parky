import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Sparkles, ShieldCheck } from 'lucide-react';

const PROOF = [
  { icon: Sparkles, title: 'Návrh mlžné zóny', text: 'Produkt, rozmístění a provozní scénář navrhujeme podle konkrétního prostoru.' },
  { icon: ShieldCheck, title: 'Nerez pro veřejný prostor', text: 'Čistá konstrukce, skryté kotvení a odolné provedení pro města, parky i sportoviště.' },
  { icon: MapPin, title: 'Od vizualizace k poptávce', text: 'Pomůžeme připravit vizualizaci, technické zadání a jasné podklady pro další krok.' },
];

export default function V3EditorialBridge() {
  return (
    <section className="relative overflow-hidden bg-[#071A2F] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-cyan-400/10 blur-[110px]" />
        <div className="absolute right-[-8rem] top-[-4rem] h-96 w-96 rounded-full bg-blue-500/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-[1500px] px-6 py-20 lg:px-12 lg:py-28 xl:px-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.22em] text-[#22D3EE]">MLŽIDLA® · architektura mikroklimatu</p>
            <h2 className="mt-5 max-w-[13ch] font-heading text-4xl font-bold leading-[1.02] tracking-[-.045em] sm:text-5xl lg:text-6xl">
              Navrhujeme mlžné zóny, ve kterých se lidé cítí lépe i v horkých dnech.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 lg:text-lg">
              MLŽIDLA.cz propojují nerezovou architekturu, vodní mlhu na veřejná prostranství a chytré řízení SUPLA. Pro města, sportoviště, gastro i rezidenční zahrady připravíme řešení napojené na běžný vodovodní řád a konkrétní provoz místa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/poptavka" className="btn-brand-primary-dark">
                Navrhnout řešení <ArrowRight size={16} />
              </Link>
              <Link to="/reference" className="btn-brand-outline-dark">
                Prohlédnout realizace
              </Link>
            </div>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[1.75rem] bg-white/10 sm:grid-cols-3 lg:grid-cols-1">
            {PROOF.map(({ icon: Icon, title, text }) => (
              <div key={title} className="bg-white/[0.06] p-6 backdrop-blur-sm">
                <Icon size={20} className="text-[#22D3EE]" />
                <h3 className="mt-4 font-heading text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
