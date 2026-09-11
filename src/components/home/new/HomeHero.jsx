import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { VIDEO_ASSETS } from '@/lib/newMedia';

const JICIN_ID = '6a71d1ff57598752eed27bfb';
const ZOO_ID = '6a42491409abbf575447aaeb';
const MRKEV_ID = '6a450e035aef0b45b2a8728f';

const FALLBACK_SLIDE = {
  id: 'jicin',
  eyebrow: 'REÁLNÁ INSTALACE · JIČÍN',
  title: <>Chytré chlazení<br />pro <span className="text-cyan">města, parky a zahrady.</span></>,
  description: 'Nerezové mlžítko BENDY na Valdštejnově náměstí. Přirozené osvěžení pro horké dny v centru města.',
  image: VIDEO_ASSETS.heroJicin.poster,
  to: '/reference/bendy-jicinske-namesti',
  place: 'BENDY · Valdštejnovo náměstí',
  label: 'Fotografie z realizace',
};

const slideFromReference = (reference, config) => reference?.image_url ? ({
  ...config,
  image: reference.image_url,
}) : null;

export default function HomeHero() {
  const [slides, setSlides] = useState([FALLBACK_SLIDE]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      base44.entities.Realizace.get(JICIN_ID),
      base44.entities.Realizace.get(ZOO_ID),
      base44.entities.Realizace.get(MRKEV_ID),
    ]).then(([jicin, zoo, mrkev]) => {
      if (!mounted) return;
      const resolved = [
        slideFromReference(jicin, FALLBACK_SLIDE),
        slideFromReference(zoo, {
          id: 'zoo',
          eyebrow: 'REÁLNÁ REALIZACE · ZOO PRAHA',
          title: <>Ochlazení, které<br /><span className="text-cyan">funguje v pohybu.</span></>,
          description: 'Nerezové mlžné sochy pro návštěvnický provoz v areálu ZOO Praha.',
          to: '/reference/mlzitka-pro-zoo-praha',
          place: 'ZOO Praha · Troja',
          label: 'Fotografie z realizace',
        }),
        slideFromReference(mrkev, {
          id: 'mrkev',
          eyebrow: 'REÁLNÁ INSTALACE · POLNÁ',
          title: <>MRKEV: hra, mlha<br />a <span className="text-cyan">radost v Polné.</span></>,
          description: 'Hravá nerezová mlžná socha vytvořená pro veřejný prostor města Polná.',
          to: '/reference/mesto-polna-mlzitko-mrkev',
          place: 'MRKEV · město Polná',
          label: 'Fotografie z realizace',
        }),
      ].filter(Boolean);
      setSlides(resolved.length ? resolved : [FALLBACK_SLIDE]);
      setActive(0);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const slide = slides[active] || FALLBACK_SLIDE;
  const move = (direction) => setActive((index) => (index + direction + slides.length) % slides.length);

  return (
    <section className="relative min-h-[650px] w-full overflow-hidden bg-[#0D2F4F] lg:min-h-[760px]">
      <img key={slide.id} src={slide.image} alt={slide.place} className="absolute inset-0 h-full w-full object-cover motion-safe:animate-[fadeIn_.55s_ease-out]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#061f35]/95 via-[#0D2F4F]/68 to-[#0D2F4F]/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#041a30]/80 via-transparent to-[#041a30]/15" />

      <div className="relative mx-auto flex min-h-[650px] max-w-7xl flex-col justify-end px-6 pb-28 pt-24 lg:min-h-[760px] lg:px-10 lg:pb-32">
        <p className="font-mono text-[11px] tracking-[.18em] uppercase text-cyan">{slide.eyebrow}</p>
        <h1 className="mt-5 max-w-4xl font-heading text-4xl leading-[1.06] text-white sm:text-5xl lg:text-6xl xl:text-7xl">{slide.title}</h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">{slide.description}</p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link to="/poptavka" className="btn-metallic-mist inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-bold">Konzultace pro město / projekt <ArrowRight size={16} /></Link>
          <Link to={slide.to} className="btn-secondary-outline inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-semibold text-white">Zobrazit realizaci <ArrowRight size={16} /></Link>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6 z-10 mx-auto flex max-w-7xl items-end justify-between gap-4 lg:left-10 lg:right-10">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => move(-1)} aria-label="Předchozí vizuál" className="grid h-11 w-11 place-items-center rounded-full border border-white/35 bg-[#062d3b]/70 text-white transition hover:border-cyan hover:bg-cyan hover:text-slate-950"><ArrowLeft size={17} /></button>
          <div className="flex gap-2" aria-label="Výběr vizuálu">
            {slides.map((item, index) => <button key={item.id} type="button" onClick={() => setActive(index)} aria-label={`Zobrazit: ${item.place}`} aria-current={active === index ? 'true' : undefined} className={`h-2.5 rounded-full transition-all ${active === index ? 'w-8 bg-cyan' : 'w-2.5 bg-white/55 hover:bg-white'}`} />)}
          </div>
          <button type="button" onClick={() => move(1)} aria-label="Další vizuál" className="grid h-11 w-11 place-items-center rounded-full border border-white/35 bg-[#062d3b]/70 text-white transition hover:border-cyan hover:bg-cyan hover:text-slate-950"><ArrowRight size={17} /></button>
        </div>
        <span className="hidden rounded-full bg-black/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.14em] text-white/90 backdrop-blur-sm sm:block">{slide.label} · {slide.place}</span>
      </div>
    </section>
  );
}