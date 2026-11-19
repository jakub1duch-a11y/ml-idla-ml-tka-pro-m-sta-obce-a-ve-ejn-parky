import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';

const spiralVideo = '/media/optimized/ae9faa0a3_video-mlitkospiralavakci.webm';
const anchorImage = '/media/optimized/20aa9f5f9_09_Vizualizace_Mlzna_spirala_skryta_patka.webp';

export default function SpiralEditorialSections({ product }) {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section || reducedMotion || videoFailed) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      } else {
        video.pause();
        setPlaying(false);
      }
    }, { threshold: 0.25 });
    observer.observe(section);
    return () => { observer.disconnect(); video.pause(); };
  }, [reducedMotion, videoFailed]);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else { video.pause(); setPlaying(false); }
  };

  return (
    <div className="spiral-editorial">
      <section ref={sectionRef} aria-labelledby="spirala-pribeh" className="relative isolate overflow-hidden bg-[#071D2B] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_15%,rgba(27,174,190,.18),transparent_60%)]" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:py-28">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.2em] text-cyan-200">Autorská kolekce · MLŽIDLA</p>
            <h2 id="spirala-pribeh" className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Tvar, který ožívá mlhou.</h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-200">SPIRÁLA spojuje plynulou křivku nerezového prvku s jemným vodním mlžením. Podívejte se na skutečný produkt při provozu.</p>
            <Link to={`/poptavka?produkt=${encodeURIComponent(product.slug)}`} className="mt-8 inline-flex min-h-12 items-center rounded-full bg-cyan-200 px-6 py-3 font-semibold text-[#071D2B] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Poptat mlžnou spirálu</Link>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/15 bg-slate-900 shadow-[0_30px_100px_rgba(0,0,0,.3)]">
            {videoFailed ? <img src={product.image_url} alt="Mlžná spirála" loading="lazy" className="aspect-video w-full object-contain" /> : (
              <video ref={videoRef} muted playsInline loop preload="none" poster={product.image_url} onError={() => setVideoFailed(true)} className="aspect-video w-full object-contain" aria-label="Mlžná spirála při mlžení">
                <source src={spiralVideo} type="video/webm" />
              </video>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm text-slate-200">
              <span>SPIRÁLA · video produktu v provozu</span>
              {!videoFailed && <button type="button" onClick={toggleVideo} aria-pressed={playing} className="rounded-full border border-white/40 px-4 py-2 text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">{playing ? 'Pozastavit video' : 'Přehrát video'}</button>}
            </div>
          </div>
        </div>
      </section>
      <section aria-labelledby="spirala-prostor" className="bg-[#F3F7F7] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="font-mono text-xs uppercase tracking-[.2em] text-[#0B6F7D]">Spirála v architektuře</p>
          <h2 id="spirala-prostor" className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-[#071D2B] sm:text-4xl">Prostor rozhoduje o výsledku.</h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700">Umístění spirály navrhujeme s ohledem na okolní pohyb, přívod vody, typ povrchu a možnosti údržby. Každý návrh vychází ze skutečných rozměrů a konstrukce výrobku.</p>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ['01', 'Parky a zahrady', 'Výrazný solitér v zeleni nebo v pobytové zóně.'],
              ['02', 'Veřejný prostor', 'Umístění podle pohybu návštěvníků a provozních podmínek.'],
              ['03', 'Zakázkový projekt', 'Návrh umístění a návaznosti na okolní architekturu.'],
            ].map(([number, title, description]) => (
              <article key={number} className="rounded-2xl border border-[#CFE2E5] bg-white p-7 shadow-sm">
                <span className="font-mono text-xs tracking-widest text-[#0B6F7D]">{number}</span>
                <h3 className="mt-5 text-xl font-semibold text-[#071D2B]">{title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section aria-labelledby="spirala-kotveni" className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-3xl bg-[#E9F2F3]">
            <img src={anchorImage} loading="lazy" alt="Vizualizace mlžné spirály a návrhu skrytého kotvení" className="aspect-[4/3] w-full object-contain" />
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[.2em] text-[#0B6F7D]">Technické řešení</p>
            <h2 id="spirala-kotveni" className="mt-4 text-3xl font-semibold tracking-tight text-[#071D2B] sm:text-4xl">Čistý tvar. Promyšlené kotvení.</h2>
            <p className="mt-5 leading-8 text-slate-700">Podle podkladu a zatížení připravíme návrh kotvení a přívodu vody. Pro veřejně přístupná místa lze řešit odolné antivandal provedení. Filtraci a hygienický provoz vody navrhujeme podle konkrétní instalace.</p>
            <p className="mt-4 text-sm leading-6 text-slate-500">Zobrazený detail je vizualizace. Konečné provedení se řídí schválenou technickou dokumentací.</p>
            <Link to={`/poptavka?produkt=${encodeURIComponent(product.slug)}`} className="mt-7 inline-flex min-h-12 items-center rounded-full bg-[#071D2B] px-6 py-3 font-semibold text-white hover:bg-[#16465A]">Probrat technické řešení</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
