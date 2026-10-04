import React from 'react';
import { ArrowUpRight, PlayCircle } from 'lucide-react';

const SCRIMBA_VIDEO_URL = 'https://scrimba.com/explain/guide0q6s9ep8s';

export default function MicroclimateExplainerSection() {
  return (
    <section className="bg-[#F6F8F8] py-16 lg:py-24" aria-labelledby="microclimate-video-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div className="max-w-xl">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-[#0E5C68]">
              Městské mikroklima / video
            </p>
            <h2
              id="microclimate-video-title"
              className="font-heading text-3xl font-extrabold leading-[1.05] text-[#082430] sm:text-4xl lg:text-5xl"
            >
              Jak funguje ochlazování jemnou mlhou.
            </h2>
            <p className="mt-6 text-base leading-7 text-slate-600 sm:text-lg">
              Jemná vodní mlha se rozptyluje do mikrokapiček, které se rychle odpařují a pomáhají vytvářet svěžejší mikroklima bez zbytečného smáčení prostoru.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Krátké video ukazuje princip městského ochlazování, architektonický přístup MLŽIDLA a cestu od přehřátého prostoru k řešení na míru.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={SCRIMBA_VIDEO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#082430] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0E5C68] focus:outline-none focus:ring-2 focus:ring-[#58C7D6] focus:ring-offset-2"
              >
                <PlayCircle size={18} aria-hidden="true" />
                Přehrát samostatně
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <a
                href="/Poptavka"
                className="inline-flex items-center rounded-xl border border-[#0E5C68]/25 bg-white px-5 py-3 text-sm font-semibold text-[#082430] transition hover:border-[#0E5C68]/50 hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#58C7D6] focus:ring-offset-2"
              >
                Navrhnout řešení pro váš prostor
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[18px] border border-[#0E5C68]/10 bg-[#082430] shadow-[0_24px_70px_rgba(8,36,48,0.16)]">
            <div className="relative aspect-video w-full">
              <iframe
                src={SCRIMBA_VIDEO_URL}
                title="MLŽIDLA – městské ochlazování jemnou mlhou"
                loading="lazy"
                className="absolute inset-0 h-full w-full border-0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
