import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Handshake } from 'lucide-react';

export default function SpoluHero({ image }) {
  return (
    <section className="relative flex min-h-[88vh] items-end overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        <img src={image} alt="Mlžná brána MLŽIDLA® ochlazuje městské náměstí" data-parallax="-8"
          className="h-[115%] w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/10" />
      </div>
      <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-36 lg:px-10">
        <span data-reveal className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-white">
          <Handshake size={13} /> Spolupráce 2026
        </span>
        <h1 data-reveal className="mb-6 max-w-3xl font-heading text-4xl font-light leading-[0.98] tracking-tight text-white sm:text-5xl lg:text-7xl">
          Navrhujete ochlazení<br />veřejného prostoru?<br />
          <span className="font-extralight italic text-cyan-300">Postavíme ho s vámi.</span>
        </h1>
        <p data-reveal className="mb-8 max-w-xl text-lg font-light leading-relaxed text-white/70">
          Partnerský program MLŽIDLA® pro architekty, města, realizační firmy a zahradní studia — technické podklady, vizualizace do vašeho prostoru a partnerské ceny.
        </p>
        <div data-reveal className="flex flex-wrap gap-3">
          <a href="#partnerska-poptavka" className="btn-metallic-mist px-7 py-3.5 text-sm font-bold">
            Získat partnerské podmínky <ArrowRight size={16} />
          </a>
          <a href="#partnerske-ceny" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-medium text-white transition hover:bg-white/20">
            Partnerské ceny
          </a>
        </div>
        <div data-reveal className="mt-12 grid max-w-2xl grid-cols-2 gap-6 border-t border-white/15 pt-7 sm:grid-cols-4">
          {[
            { v: '120+', l: 'realizací' },
            { v: '48 h', l: 'návrh nabídky' },
            { v: '8 týdnů', l: 'výroba na míru' },
            { v: 'až −9 °C', l: 'ochlazení vzduchu' },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-heading text-2xl font-light text-white">{s.v}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/45">{s.l}</p>
            </div>
          ))}
        </div>
        <Link to="/reference" className="mt-8 inline-flex items-center gap-1.5 text-sm font-light text-white/50 transition hover:text-white">
          Prohlédnout realizace <ArrowRight size={13} />
        </Link>
      </div>
    </section>
  );
}