import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Samostatny uvodni produktovy slider. Stavajici HomeHero zustava beze zmen.
const TOP_SLIDES = [
  {
    id: 'steblo-gate',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/82880da57_file_000000006f7c81f4ab9a3c310afbbc4a.png',
    mobileImage: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/a73d25761_steblo-gate-mobile-hero.webp',
    alt: 'STÉBLO GATE® – dvě zakřivená nerezová mlžítka vytvářejí průchozí mlžnou bránu na náměstí',
    title: 'STÉBLO GATE®',
    link: '/produkt/brana-bendy',
    // Prvni obrazek uz obsahuje typografii, neduplikovat text.
    embeddedCopy: true,
  },
  {
    id: 'steblo-detail',
    image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/a602e9675_file_00000000963881f4b5d4f892073ceae0.png',
    alt: 'Detail nerezového sloupku s mlžnými tryskami v parkové zeleni',
    title: 'Detail nerezového provedení',
    link: '/produkt/brana-bendy',
    embeddedCopy: false,
  },
];

export default function TopGateHeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = TOP_SLIDES[index];
  useEffect(() => {
    if (paused || (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return undefined;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % TOP_SLIDES.length), 9000);
    return () => window.clearInterval(timer);
  }, [paused]);
  return (
    <section className="relative isolate w-full bg-[#07131d] pt-[var(--site-header-height,80px)]"
      aria-label="STÉBLO GATE – produktový hero slider"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <div className="relative mx-auto w-full max-w-[1920px]">
        <Link to={slide.link} className="block aspect-[900/1550] w-full bg-[#07131d] focus-visible:outline focus-visible:outline-4 focus-visible:outline-sky-400 sm:aspect-video"
          aria-label={`Prohlédnout produkt ${slide.title}`}>
          <picture key={slide.id} className="block h-full w-full">
            {slide.mobileImage && <source media="(max-width: 639px)" srcSet={slide.mobileImage} type="image/webp" />}
            <img src={slide.image} alt={slide.alt} fetchPriority={index === 0 ? 'high' : 'auto'}
              loading={index === 0 ? 'eager' : 'lazy'} decoding="async"
              className="block h-full w-full object-contain bg-[#07131d]" />
          </picture>
        </Link>
        {!slide.embeddedCopy && (
          <div className="pointer-events-none absolute bottom-14 left-5 right-5 rounded-2xl bg-[#07131d]/80 p-4 text-white backdrop-blur-sm sm:bottom-20 sm:left-10 sm:right-auto sm:max-w-md sm:p-6">
            <span className="text-xs font-bold uppercase tracking-[.18em] text-sky-300">MLŽIDLA.CZ · STÉBLO GATE®</span>
            <h2 className="mt-2 text-xl font-bold sm:text-3xl">{slide.title}</h2>
            <p className="mt-2 text-sm text-white/85">Nerezová konstrukce a mlžné trysky pro veřejný prostor.</p>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between bg-[#07131d]/85 px-4 py-2 text-white sm:px-8 sm:py-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-sky-200">{String(index + 1).padStart(2, '0')} / {String(TOP_SLIDES.length).padStart(2, '0')}</span>
            <span className="hidden text-xs font-semibold sm:inline">{slide.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Předchozí snímek" onClick={() => setIndex((value) => (value + TOP_SLIDES.length - 1) % TOP_SLIDES.length)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300"><ArrowLeft size={19} /></button>
            <button type="button" aria-label="Další snímek" onClick={() => setIndex((value) => (value + 1) % TOP_SLIDES.length)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-300"><ArrowRight size={19} /></button>
            <Link to={slide.link} className="ml-2 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#18B7E6] px-3 text-xs font-bold text-[#06283A] hover:bg-[#69DDF4] sm:px-5 sm:text-sm">
              Detail produktu <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
