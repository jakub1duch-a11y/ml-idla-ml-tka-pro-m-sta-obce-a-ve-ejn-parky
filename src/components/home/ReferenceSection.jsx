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
  return <section className="bg-[#244865] py-16 text-white sm:py-20 lg:py-28"><div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="font-mono text-[11px] tracking-[.18em] uppercase text-accent">Vybrané realizace</p><h2 className="mt-4 max-w-2xl font-heading text-[clamp(2rem,8vw,2.7rem)] leading-[1.08] tracking-[-0.035em] lg:text-5xl">Realizace, na které jsme hrdí.</h2></div><Link to="/reference" className="btn-secondary-outline inline-flex min-h-12 w-full rounded-full px-6 py-3 text-sm font-bold text-white sm:w-auto">Zobrazit další <ArrowRight size={16} /></Link></div><div className="mt-12 grid gap-5 md:grid-cols-3">{projects.map((project) => <Link key={project.id} to={`/reference/${referenceSlugs[project.id] || project.id}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/5"><div className="aspect-[4/3] overflow-hidden"><img src={project.image_url} alt={project.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div><div className="flex flex-1 flex-col bg-[hsl(var(--popover))] p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[.12em] text-accent sm:tracking-[.15em]"><span className="inline-flex min-w-0 max-w-[78%] items-center gap-1.5"><MapPin size={12} className="shrink-0" /><span className="truncate">{project.location}</span></span><span>{project.year}</span></div><h3 className="mt-4 font-heading text-xl leading-[1.25] line-clamp-2 sm:text-2xl md:min-h-[3.75rem]">{project.name}</h3><p className="mt-3 line-clamp-2 min-h-[2.75rem] text-sm leading-relaxed text-white/65">{project.product_used} · Realizace navržená pro konkrétní prostor a jeho návštěvníky.</p></div></Link>)}</div></div></section>;
}