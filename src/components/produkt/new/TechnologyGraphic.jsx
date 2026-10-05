import React from 'react';

const PANELS = {
  smart: { offset: 0, alt: 'Ilustrační sestava chytrého řízení mlžení s mobilním ovládáním', caption: 'Smart řízení — koncepční sestava. Funkce podle zvolené výbavy a připojení.' },
  anchoring: { offset: 1, alt: 'Ilustrační řez skrytým kotvením nerezového sloupu pod dlažbou', caption: 'Skryté kotvení — ilustrační princip. Rozměry základu a přípojky určuje projekt.' },
  box: { offset: 2, alt: 'Koncepční umístění rozvodového boxu pod zemí a nad zemí na sloupku', caption: 'Rozvodový box — možnosti umístění. Přístupnost, odvodnění a krytí řešíme podle lokality.' },
};

export default function TechnologyGraphic({ kind = 'smart' }) {
  const panel = PANELS[kind] || PANELS.smart;
  return <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
    <div className="relative aspect-[8/9] overflow-hidden">
      <img src="/media/smart-installation-2026.webp" alt={panel.alt} loading="lazy" decoding="async" className="absolute left-0 top-0 h-full max-w-none" style={{ width: '300%', transform: `translateX(-${panel.offset * 100 / 3}%)` }} />
    </div>
    <figcaption className="p-4 text-sm leading-6 text-slate-700">{panel.caption}</figcaption>
  </figure>;
}
