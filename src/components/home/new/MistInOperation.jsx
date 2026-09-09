import React, { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { VIDEO_ASSETS } from '@/lib/newMedia';

const STATS = [
  { value: '2–8 °C', label: 'lokální ochlazení vzduchu' },
  { value: '50–100 µm', label: 'kapky — bez zamokření dlažby' },
  { value: '5–10 l/h', label: 'spotřeba vody na prvek' },
];

export default function MistInOperation() {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <section className="bg-[#EAF5FB] py-20 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
        <div className="relative overflow-hidden">
          <video
            ref={videoRef}
            src={VIDEO_ASSETS.montage2026.src}
            poster={VIDEO_ASSETS.montage2026.poster}
            className="aspect-video w-full object-cover"
            autoPlay muted loop playsInline preload="metadata"
          />
          <button
            onClick={toggleMute}
            aria-label={muted ? 'Zapnout zvuk' : 'Vypnout zvuk'}
            className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        <div className="flex flex-col justify-center">
          <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Vidět mlhu v provozu</p>
          <h2 className="mt-4 font-heading text-3xl leading-tight text-[#0D2F4F] lg:text-4xl">
            Jemná mlha, která ochladí prostor bez zamokření.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label} className="border border-[#0B5EA8]/15 bg-white p-5">
                <p className="font-heading text-2xl font-bold text-[#0B5EA8] lg:text-3xl">{s.value}</p>
                <p className="mt-2 text-xs leading-relaxed text-[#0D2F4F]/60">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-[#0D2F4F]/50">
            Účinek závisí na teplotě, vlhkosti a stínění konkrétního místa.
          </p>
        </div>
      </div>
    </section>
  );
}