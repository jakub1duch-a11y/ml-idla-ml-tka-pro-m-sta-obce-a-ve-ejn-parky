import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const stages = [
  ['01', 'Snímání prostředí', 'Teplota, vlhkost a případně detekce přítomnosti podle konfigurace.'],
  ['02', 'Vyhodnocení pravidel', 'Řídicí jednotka vyhodnotí časové okno a nastavené provozní podmínky.'],
  ['03', 'Řízený průtok', 'Ventil umožní průtok vody do mlžítka; vodoměr může zaznamenávat spotřebu.'],
  ['04', 'Přehled provozu', 'U vhodné konfigurace lze využít vzdálenou správu a dostupná data.'],
];

export default function SmartMotionStory() {
  const root = useRef(null);
  const [temperature, setTemperature] = useState(28);
  const [presence, setPresence] = useState(true);
  const [windowOpen, setWindowOpen] = useState(true);
  const active = temperature >= 26 && presence && windowOpen;

  useEffect(() => {
    const mm = gsap.matchMedia(root.current);
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray('[data-smart-stage]', root.current).forEach(element => {
        gsap.from(element, { y: 24, opacity: 0.55, duration: 0.6, scrollTrigger: { trigger: element, start: 'top 85%', once: true } });
      });
      gsap.to('[data-smart-image]', { scale: 1.06, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    return () => mm.revert();
  }, []);

  return <section ref={root} aria-labelledby="smart-story-title" className="bg-[#07131D] text-white py-16 lg:py-28">
    <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
      <p className="font-mono uppercase tracking-[.2em] text-[#7AE1EF] text-xs">MLŽIDLA / princip řízení</p>
      <h2 id="smart-story-title" className="mt-5 max-w-3xl font-heading text-4xl tracking-tight sm:text-5xl lg:text-6xl">Od podmínek k jemné mlze.</h2>
      <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="lg:sticky lg:top-28 overflow-hidden rounded-3xl border border-white/15 bg-white/5">
          <img data-smart-image src="/media/smart/smart-control-system.webp" alt="Schéma chytrého řízení mlžítek" loading="lazy" className="w-full aspect-square object-contain p-5" />
        </div>
        <div className="divide-y divide-white/15">{stages.map(([number,title,description]) => <article data-smart-stage key={number} className="py-8 lg:py-14"><span className="font-mono text-[#7AE1EF] text-sm">{number}</span><h3 className="mt-3 font-heading text-3xl">{title}</h3><p className="mt-3 text-white/75 leading-relaxed">{description}</p></article>)}</div>
      </div>
      <div className="mt-16 rounded-3xl border border-white/15 bg-white/5 p-6 sm:p-10">
        <p className="text-xs font-mono uppercase tracking-widest text-[#7AE1EF]">Interaktivní demonstrace · modelová pravidla</p>
        <h3 className="mt-3 font-heading text-3xl">Vyzkoušejte provozní scénář.</h3>
        <p className="mt-3 text-white/75">Ukázka neovládá skutečné zařízení. Limit 26 °C je pouze ilustrační.</p>
        <div className="mt-8 grid gap-7 md:grid-cols-2">
          <div className="space-y-6">
            <label className="block">Teplota: {temperature} °C<input type="range" min="15" max="40" value={temperature} onChange={e => setTemperature(Number(e.target.value))} className="mt-3 block w-full accent-cyan-300" /></label>
            <label className="flex items-center gap-3"><input type="checkbox" checked={presence} onChange={e => setPresence(e.target.checked)} className="h-5 w-5 accent-cyan-300"/> Přítomnost návštěvníků</label>
            <label className="flex items-center gap-3"><input type="checkbox" checked={windowOpen} onChange={e => setWindowOpen(e.target.checked)} className="h-5 w-5 accent-cyan-300"/> V provozním časovém okně</label>
          </div>
          <div role="status" className="rounded-2xl border border-white/15 p-6"><span className="text-sm text-white/70">Modelový stav</span><p className={active ? 'mt-3 text-3xl font-heading text-[#7AE1EF]' : 'mt-3 text-3xl font-heading'}>{active ? 'Mlžení aktivní' : 'Mlžení vypnuto'}</p><p className="mt-3 text-white/75">{active ? 'Všechny modelové podmínky splněny.' : 'Nejméně jedna modelová podmínka není splněna.'}</p></div>
        </div>
      </div>
    </div>
  </section>;
}
