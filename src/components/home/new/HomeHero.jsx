import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlayCircle, Sparkles, Wifi, Building2, Trees } from 'lucide-react';
import { VIDEO_ASSETS } from '@/lib/newMedia';

const TRUST = [
  { icon: Building2, label: 'Města a veřejný prostor' },
  { icon: Trees, label: 'Parky a promenády' },
  { icon: Wifi, label: 'Smart řízení' },
];

export default function HomeHero() {
  const [videoReady, setVideoReady] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const saveData = connection?.saveData;
    const slowNetwork = ['slow-2g', '2g'].includes(connection?.effectiveType);

    if (reducedMotion || saveData || slowNetwork) return undefined;

    let timeoutId;
    let idleId;
    const startVideo = () => setShouldLoadVideo(true);

    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(startVideo, { timeout: 650 });
    } else {
      timeoutId = window.setTimeout(startVideo, 180);
    }

    return () => {
      if (idleId) window.cancelIdleCallback?.(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#f6fafb] text-[#0b2d38]">
      <div className="mx-auto grid min-h-[760px] max-w-[1500px] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative z-20 flex items-center px-6 pb-14 pt-28 sm:px-10 lg:px-14 lg:py-28 xl:px-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0b7c89]/15 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[.18em] text-[#0b7c89] shadow-sm">
              <Sparkles size={14} /> Architektonické mlžení pro města i zahrady
            </div>

            <h1 className="mt-7 max-w-[11ch] font-heading text-[clamp(3.4rem,7vw,7.8rem)] font-medium leading-[.88] tracking-[-.065em] text-[#0b2d38]">
              MLŽIDLA — chytré chlazení prostoru.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-[#48636d] sm:text-lg">
              Nerezová mlžítka a mlžné prvky pro náměstí, parky, promenády, sportoviště, gastro i soukromé zahrady. Od návrhu a vizualizace po řízení, realizaci a servis.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/poptavka" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0b2d38] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#123f4d]">
                Navrhnout řešení <ArrowRight size={16} />
              </Link>
              <Link to="/mlzidla-mlzitka" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#bfd0d5] bg-white px-6 py-3.5 text-sm font-semibold text-[#0b2d38] transition hover:border-[#8fb7c1] hover:bg-[#edf6f8]">
                Prohlédnout produkty
              </Link>
            </div>

            <div className="mt-10 grid gap-2 sm:grid-cols-3">
              {TRUST.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 border-t border-[#d9e7ea] pt-4 text-xs font-medium text-[#4f6871]">
                  <Icon size={15} className="shrink-0 text-[#0b7c89]" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative min-h-[520px] overflow-hidden bg-[#0b2d38] lg:min-h-full">
          <img
            src={VIDEO_ASSETS.heroCityPromo.poster}
            alt="Mlžítka pro ochlazování městského prostoru"
            fetchPriority="high"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ${videoReady ? 'opacity-0' : 'opacity-100'}`}
          />
          {shouldLoadVideo && !videoFailed && (
            <video
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={VIDEO_ASSETS.heroCityPromo.poster}
              onPlaying={() => setVideoReady(true)}
              onError={() => {
                setVideoFailed(true);
                setVideoReady(false);
              }}
              aria-label="Promo video MLŽIDLA pro městské ochlazování"
            >
              <source src={VIDEO_ASSETS.heroCityPromo.src} type="video/mp4" />
            </video>
          )}

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,27,35,.04)_0%,rgba(5,27,35,.12)_48%,rgba(5,27,35,.78)_100%)]" />
          <div className="absolute inset-y-0 left-0 hidden w-28 bg-gradient-to-r from-[#f6fafb] via-[#f6fafb]/30 to-transparent lg:block" />

          <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-4 rounded-3xl border border-white/15 bg-[#071f28]/62 p-5 text-white backdrop-blur-md sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#9ce5ec]">Městské ochlazování</p>
                <h2 className="mt-2 font-heading text-2xl font-medium">MLŽIDLA · prostor, voda, klima</h2>
                <p className="mt-1 max-w-lg text-sm leading-6 text-white/70">Promo sekvence architektonických mlžných prvků pro města, parky a veřejný prostor.</p>
              </div>
              <Link to="/reference" className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-white transition hover:text-[#9ce5ec]">
                <PlayCircle size={18} /> Prohlédnout realizace
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
