import React, { useRef, useState } from 'react';
import { Volume2, VolumeX, Droplets, Layers3, SlidersHorizontal } from 'lucide-react';
import { VIDEO_ASSETS } from '@/lib/newMedia';

const BENEFITS = [
  { icon: Droplets, title: 'Jemná vodní mlha', text: 'Osvěžení vzniká přímo v prostoru, kde se lidé pohybují.' },
  { icon: Layers3, title: 'Součást architektury', text: 'Nerezový prvek navrhujeme jako přirozenou součást náměstí, parku nebo zahrady.' },
  { icon: SlidersHorizontal, title: 'Řízení podle provozu', text: 'Systém lze doplnit o chytré ovládání a scénáře podle konkrétního projektu.' },
];

export default function MistInOperation() {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <section className="bg-[#eaf5f7] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#0b2d38] shadow-[0_24px_70px_rgba(11,45,56,.16)]">
            <video
              ref={videoRef}
              src={VIDEO_ASSETS.montage2026.src}
              poster={VIDEO_ASSETS.montage2026.poster}
              className="aspect-video w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Sestřih realizací MLŽIDLA"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071f28]/55 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/35 px-3 py-2 font-mono text-[10px] uppercase tracking-[.16em] text-white/85 backdrop-blur-md">
              Realizace MLŽIDLA · video
            </div>
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? 'Zapnout zvuk videa' : 'Vypnout zvuk videa'}
              className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>

          <div>
            <p className="font-mono text-[11px] uppercase tracking-[.2em] text-[#0b7c89]">Mlžení v reálném provozu</p>
            <h2 className="mt-4 max-w-xl font-heading text-3xl leading-tight tracking-[-.035em] text-[#0b2d38] sm:text-4xl lg:text-5xl">
              Ochlazení prostoru, které nemusí rušit architekturu.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#516b74] sm:text-base">
              Způsob mlžení, umístění prvků i řízení řešíme podle konkrétního prostoru. Nejdřív návrh a vizualizace, potom technické upřesnění a realizace.
            </p>

            <div className="mt-8 space-y-4">
              {BENEFITS.map(({ icon: Icon, title, text }) => (
                <div key={title} className="grid grid-cols-[44px_1fr] gap-4 border-t border-[#bcd5da] pt-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0b7c89]">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-semibold text-[#0b2d38]">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#5b727a]">{text}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs leading-5 text-[#617980]">
              Konkrétní technické parametry uvádíme vždy podle vybraného produktu a projektu; neověřené hodnoty nedopočítáváme odhadem.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
