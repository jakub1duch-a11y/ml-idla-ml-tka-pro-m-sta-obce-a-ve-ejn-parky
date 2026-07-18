import React, { useState } from 'react';

const SLIDES = [
  { label: 'Veřejný prostor', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/f21631baf_generated_image.png', alt: 'Mlžná brána na městském náměstí', title: 'Odolné brány a sloupy', detail: 'Nerezové mlžné brány a sloupy pro intenzivní veřejný provoz, s možností skrytého kotvení.' },
  { label: 'Školy a školky', image: 'https://media.base44.com/images/public/69d723859ec0e3321c6b8bb6/d851d598c_mlznehriste-mlzitkohvezda.jpg', alt: 'Dětské mlžítko na hřišti', title: 'Bezpečné hravé ochlazení', detail: 'Zaoblené konstrukce, jemná mlha a spínání tlačítkem nebo podle pohybu.' },
  { label: 'Domovy seniorů', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/97fea19c4_generated_image.png', alt: 'Mlžení v altánu domova seniorů', title: 'Tichý komfort v zahradě', detail: 'Diskrétní trysky integrované do pergoly pro bezpečný pobyt venku během veder.' },
  { label: 'Hotely a wellness', image: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/3a74be287_generated_image.png', alt: 'Mlžení na hotelové terase', title: 'Prémiová atmosféra terasy', detail: 'Minimalistické nerezové prvky a nízkotlaké mlžení 2–8 bar (200–800 kPa) pro komfort hostů.' },
];

export default function UsageSegmentSlider() {
  const [active, setActive] = useState(0);
  const slide = SLIDES[active];
  return <section className="bg-slate-950 py-16 text-white lg:py-20"><div className="site-container"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#0070F3]">Řešení podle využití</p><h2 className="mt-3 max-w-2xl">Konstrukce i řízení podle charakteru místa.</h2><div className="mt-8 flex gap-2 overflow-x-auto pb-2">{SLIDES.map((item, index) => <button key={item.label} onClick={() => setActive(index)} className={active === index ? 'shrink-0 bg-[#0070F3] px-4 py-2 text-sm font-semibold text-white' : 'shrink-0 border border-white/25 px-4 py-2 text-sm text-white/70 transition hover:border-white'}>{item.label}</button>)}</div><div className="mt-6 grid overflow-hidden border border-white/15 md:grid-cols-[1.3fr_.7fr]"><img src={slide.image} alt={slide.alt} className="h-72 w-full object-cover md:h-full" /><div className="flex flex-col justify-end p-7 lg:p-10"><p className="text-xs font-bold uppercase tracking-[.14em] text-[#0070F3]">Doporučené provedení</p><h3 className="mt-3 text-2xl text-white">{slide.title}</h3><p className="mt-4 text-sm leading-relaxed text-white/70">{slide.detail}</p></div></div></div></section>;
}