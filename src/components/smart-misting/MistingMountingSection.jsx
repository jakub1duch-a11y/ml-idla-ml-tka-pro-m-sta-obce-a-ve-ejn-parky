import React from 'react';
import { Anchor, CircleDot, Wrench } from 'lucide-react';

const basePlate = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/150f3566d_IMG_20260623_124103.jpg';
const threadedBase = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/a5ed50e7e_IMG_20260623_124037.jpg';
const groundScrew = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/844f5a39f_IMG_20260623_124213.jpg';
const options = [
  { icon: Anchor, title: 'Kotevní patka', text: 'Pevná příruba pro beton, dlažbu nebo připravený základ.' },
  { icon: CircleDot, title: 'Závit u patky', text: 'Přívod vody zůstává přístupný pro servis a sezónní odpojení.' },
  { icon: Wrench, title: 'Zemní vrut', text: 'Rychlá instalace do zeleně bez rozsáhlé betonáže.' },
];

export default function MistingMountingSection() {
  return <section className="border-y border-slate-200 bg-slate-50 py-20 lg:py-28">
    <div className="site-container">
      <div className="max-w-3xl"><p className="content-eyebrow mb-4">Připraveno pro instalaci</p><h2 className="content-title">Reálné napojení, čistý detail, snadný servis.</h2><p className="content-lead mt-5">Každá socha vzniká z nerezové trubky Ø 70 mm. Typ patky a přívodu volíme podle povrchu, tlakové větve a požadované demontovatelnosti.</p></div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">{options.map(({ icon: Icon, title, text }, index) => <article key={title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><img src={[basePlate, threadedBase, groundScrew][index]} alt={title} className="aspect-[4/3] w-full object-cover" /><div className="p-6"><Icon size={20} className="text-techblue" /><h3 className="mt-4 font-heading text-xl font-medium text-slate-900">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p></div></article>)}</div>
    </div>
  </section>;
}