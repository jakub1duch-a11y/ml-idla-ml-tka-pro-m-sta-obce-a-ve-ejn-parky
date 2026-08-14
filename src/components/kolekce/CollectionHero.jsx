import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, ShieldCheck } from 'lucide-react';

export default function CollectionHero({ collection }) {
  const isCity = collection.name === 'Městská mlžítka';
  const isGarden = collection.name === 'Zahradní mlžítka';

  return (
    <section className="relative min-h-[620px] overflow-hidden bg-primary text-primary-foreground lg:min-h-[680px]">
      <div className="absolute inset-0">
        {collection.video_url ? (
          <video src={collection.video_url} poster={collection.image} autoPlay muted loop playsInline className="h-full w-full object-cover opacity-55" />
        ) : (
          <img src={collection.image} alt={collection.name} className="h-full w-full object-cover opacity-55" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/88 to-primary/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/35 via-transparent to-primary/10" />
      </div>

      <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-6 py-20 lg:min-h-[680px] lg:px-10">
        <div className="max-w-4xl">
          <p className="font-mono text-[11px] tracking-[.18em] uppercase text-accent">MLŽIDLA® / {collection.label}</p>
          <h1 className="mt-5 max-w-4xl font-heading text-4xl leading-[1.02] text-white sm:text-5xl lg:text-7xl">{collection.headline}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/78 lg:text-xl">{collection.text}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/poptavka" className="inline-flex items-center gap-2 bg-accent px-6 py-3.5 text-sm font-bold text-accent-foreground transition hover:-translate-y-0.5">
              {isCity ? 'Navrhnout řešení pro město' : isGarden ? 'Vybrat mlžítko pro zahradu' : 'Nezávazná poptávka'} <ArrowRight size={16} />
            </Link>
            <Link to={isCity || isGarden ? '/reference' : '/mlzidla-mlzitka#catalog'} className="inline-flex items-center gap-2 border border-white/35 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10">
              {isCity || isGarden ? 'Prohlédnout realizace' : 'Prohlédnout produkty'} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/70">
            {isCity && <span className="inline-flex items-center gap-2"><ShieldCheck size={16} className="text-accent" /> Návrh · výroba · instalace · servis</span>}
            {isGarden && <span className="inline-flex items-center gap-2"><ShieldCheck size={16} className="text-accent" /> Český návrh a výroba · nerez · servis</span>}
            {collection.video_url && <span className="inline-flex items-center gap-2"><Play size={14} className="text-accent" /> Video z realizace</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
