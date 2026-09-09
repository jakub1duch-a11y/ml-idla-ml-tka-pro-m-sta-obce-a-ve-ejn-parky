import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { VIDEO_ASSETS } from '@/lib/newMedia';

export default function HomeHero() {
  return (
    <section className="relative h-[88vh] min-h-[600px] w-full overflow-hidden bg-[#0D2F4F]">
      <video
        src={VIDEO_ASSETS.heroJicin.src}
        poster={VIDEO_ASSETS.heroJicin.poster}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay muted loop playsInline preload="metadata"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D2F4F]/85 via-[#0D2F4F]/45 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D2F4F]/60 via-transparent to-[#0D2F4F]/20" />

      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-16 pt-24 lg:px-10 lg:pb-20">
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#7FC4E8]">
          Nerezová mlžítka pro města, obce a veřejný prostor
        </p>
        <h1 className="mt-5 max-w-4xl font-heading text-4xl leading-[1.06] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
          Ochlazování veřejného prostoru jako součást architektury
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/72 sm:text-lg">
          Návrh, výroba v Trutnově a instalace. Lokální ochlazení 2–8&nbsp;°C, provoz bez elektřiny nebo se smart řízením.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/poptavka"
            className="inline-flex items-center gap-2 bg-[#0B5EA8] px-7 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#094d8a]"
          >
            Konzultace pro město / projekt
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/ke-stazeni"
            className="inline-flex items-center gap-2 border border-white/30 px-7 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-white/10"
          >
            Podklady pro projektanty
          </Link>
        </div>
      </div>

      <div className="absolute bottom-5 right-6 z-10 lg:right-10">
        <span className="bg-black/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.14em] text-white/80 backdrop-blur-sm">
          Realizace: náměstí Jičín, 2026
        </span>
      </div>
    </section>
  );
}