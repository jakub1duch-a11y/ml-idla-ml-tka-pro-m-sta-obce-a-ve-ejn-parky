import React, { useEffect, useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const selectedProjects = [
{ match: (item) => item.name?.includes('MRKEV'), fallback: 'Město Polná — mlžítko MRKEV' },
{ match: (item) => item.name?.includes('Městská brána GATE'), fallback: 'Městská brána GATE' },
{ match: (item) => item.name?.includes('ZOO Praha') || item.client?.includes('ZOO Praha'), fallback: 'Mlžítka pro ZOO Praha' }];

const referenceSlugs = {
  '6a42491409abbf575447aaeb': 'mlzitka-pro-zoo-praha',
  '6a480e05664f948152611f5f': 'mlzitko-mrak-materska-skola-siskova',
  '6a480c0da87022c6c9559115': 'mlzitko-aura-domov-palata-praha-5',
  '6a72947ef1579cba611a2f6b': 'mlzitko-mrak-soukroma-zahrada',
  '6a71d1ff57598752eed27bfb': 'bendy-jicinske-namesti',
  '6a6b8d1d553d8991f46cd6a3': 'mestska-mlzna-brana-gate',
  '6a450e035aef0b45b2a8728f': 'mesto-polna-mlzitko-mrkev'
};


export default function ReferenceSection() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {base44.entities.Realizace.list().then((items) => setProjects(selectedProjects.map((selection) => items.find(selection.match)).filter(Boolean)));}, []);
  if (!projects.length) return null;
  return <section className="py-20 text-white lg:py-28 bg-[#244865]"><div className="mx-auto max-w-7xl px-6 lg:px-10"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="font-mono text-[11px] tracking-[.18em] uppercase text-accent">Vybrané realizace</p><h2 className="mt-4 max-w-2xl font-heading text-4xl lg:text-5xl">Realizace, na které jsme hrdí.</h2></div><Link to="/reference" className="btn-secondary-outline rounded-full px-6 py-3 text-sm font-bold text-white">Zobrazit další <ArrowRight size={16} /></Link></div><div className="mt-12 grid gap-5 md:grid-cols-3">{projects.map((project) => <Link key={project.id} to={`/reference/${referenceSlugs[project.id] || project.id}`} className="group overflow-hidden border border-white/15 bg-white/5"><div className="aspect-[4/3] overflow-hidden"><img src={project.image_url} alt={project.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div><div className="p-6 bg-[hsl(var(--popover))] rounded-xl"><div className="flex items-center justify-between font-mono text-[10px] tracking-[.15em] uppercase text-accent"><span className="inline-flex items-center gap-1.5"><MapPin size={12} />{project.location}</span><span>{project.year}</span></div><h3 className="mt-4 font-heading text-2xl leading-tight">{project.name}</h3><p className="mt-3 text-sm leading-relaxed text-white/65">{project.product_used} · Realizace navržená pro konkrétní prostor a jeho návštěvníky.</p></div></Link>)}</div></div></section>;
}