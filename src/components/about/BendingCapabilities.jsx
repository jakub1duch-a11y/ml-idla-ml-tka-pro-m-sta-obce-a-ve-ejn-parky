import React from 'react';
import { ArrowRight, DraftingCompass, PenTool, Radius } from 'lucide-react';
import { Link } from 'react-router-dom';

const forms = [
  [Radius, 'Plynulé oblouky', 'Arch, Semi Arch, Ring, Wave i volné organické křivky navržené podle prostoru.'],
  [DraftingCompass, 'Symboly a motivy', 'Znak města, písmeno, rostlina, zvíře nebo jiný motiv převedený do stabilní nerezové konstrukce.'],
  [PenTool, 'Návrh na zakázku', 'Pracujeme z náčrtu, fotografie, výrobního výkresu i stručného popisu vaší představy.'],
];

export default function BendingCapabilities() {
  return <section id="vyroba-ohybani" className="scroll-mt-24 border-y border-slate-200 bg-slate-950 py-20 text-white lg:py-28"><div className="site-container"><div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr]"><div><p className="content-eyebrow mb-4">Výroba a ohýbání</p><h2 className="m-0 font-heading text-4xl font-medium tracking-tight text-white lg:text-5xl">Tvar mlžítka nemusí začínat v katalogu.</h2><p className="mt-5 max-w-xl text-base leading-relaxed text-white/65">Nerezové trubky ohýbáme do plynulých linií podle rozměrů, poloměru ohybu a statických nároků. Umístění trysek, kotvení i vedení vody řešíme současně s tvarem, aby výsledná skulptura fungovala technicky i vizuálně.</p></div><div className="grid gap-4 sm:grid-cols-3">{forms.map(([Icon, title, text]) => <article key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5"><Icon size={24} className="text-cyan" /><h3 className="mt-5 text-lg font-semibold text-white">{title}</h3><p className="mt-3 text-sm leading-relaxed text-white/60">{text}</p></article>)}</div></div><div className="mt-10 flex flex-wrap gap-3"><Link to="/poptavka?produkt=Mlžítko%20na%20míru" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950">Poslat vlastní představu <ArrowRight size={15} /></Link><Link to="/katalog?sekce=sochy" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white">Prohlédnout tvary mlžítek</Link></div></div></section>;
}