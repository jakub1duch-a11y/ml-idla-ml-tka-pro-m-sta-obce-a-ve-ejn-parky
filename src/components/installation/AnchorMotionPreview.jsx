import React, { useEffect, useId, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

const VIEWS = [
  {
    id: 'installation', label: 'Skryté kotvení',
    alt: 'Řez pevnou instalací: kotevní patka na nosném základu, přívod vody pod povrchem napojený nad patkou a dokončená dlažba zakrývající techniku.',
    caption: 'Pevný základ → skryté napojení vody → dokončený povrch.',
  },
  {
    id: 'surfaces', label: 'Možné povrchy',
    alt: 'Stejný princip skryté patky a nosného základu pod trávníkem, dlažbou a mlatovým povrchem. Mění se povrch, nikoli umístění přípojky.',
    caption: 'Trávník, dlažba nebo mlat. Nosný základ se navrhuje samostatně podle místa.',
  },
];

export default function AnchorMotionPreview({ className = '' }) {
  const [view, setView] = useState('installation');
  const [mode, setMode] = useState('auto');
  const [reducedMotion, setReducedMotion] = useState(true);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const panelId = useId();

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '160px' });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const selected = VIEWS.find((item) => item.id === view);
  const playing = visible && (mode === 'play' || (mode === 'auto' && !reducedMotion));
  const asset = `/media/installation/mlzidla-hidden-anchor-${view}-v1`;
  const extension = playing ? '.gif' : '-poster.webp';

  return (
    <div ref={ref} className={className}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="Ukázky kotvení a povrchů" className="inline-flex rounded-full bg-[#E4EEF2] p-1">
          {VIEWS.map((item) => (
            <button key={item.id} type="button" aria-pressed={view === item.id} aria-controls={panelId} onClick={() => setView(item.id)}
              className={`min-h-11 rounded-full px-4 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5EA8] sm:text-sm ${view === item.id ? 'bg-[#082C42] text-white shadow-sm' : 'text-[#25495E] hover:bg-white/70'}`}>
              {item.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setMode(playing ? 'pause' : 'play')} aria-label={playing ? 'Zastavit animaci a zobrazit statický přehled' : 'Přehrát animaci'}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-xs font-semibold text-[#25495E] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B5EA8]">
          {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
          {playing ? 'Zastavit' : 'Přehrát'}
        </button>
      </div>
      <figure id={panelId} className="mt-4 overflow-hidden rounded-[2rem] bg-gradient-to-br from-white via-[#F4FAFC] to-[#E6F2F5]">
        <picture key={`${view}-${playing}`}>
          <source media="(max-width: 639px)" srcSet={`${asset}-mobile${extension}`} />
          <img src={`${asset}-desktop${extension}`} alt={selected.alt} width="720" height="720" loading="lazy" decoding="async"
            className="aspect-[4/5] w-full object-contain sm:aspect-square" />
        </picture>
        <figcaption className="px-5 pb-6 text-center text-sm leading-6 text-[#25495E] sm:px-8">{selected.caption}</figcaption>
      </figure>
      <p className="mt-3 px-1 text-xs leading-5 text-[#4B6979]">
        Ilustrační řez pevné instalace. Rozměry, skladbu podloží, kotvy a servisní přístup potvrzuje projekt konkrétního produktu.
      </p>
    </div>
  );
}
