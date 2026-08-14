import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, MapPin, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const filters = [{ key: 'all', label: 'Všechny projekty' }, { key: 'mestsky', label: 'Města a parky' }, { key: 'soukromy', label: 'Soukromé zahrady' }, { key: 'event', label: 'Eventy' }];
const categoryLabel = { mestsky: 'Městský prostor', soukromy: 'Soukromý projekt', event: 'Event', prumyslovy: 'Průmysl' };
const referenceSlugs = {
  '6a42491409abbf575447aaeb': 'mlzitka-pro-zoo-praha',
  '6a480e05664f948152611f5f': 'mlzitko-mrak-materska-skola-siskova',
  '6a480c0da87022c6c9559115': 'mlzitko-aura-domov-palata-praha-5',
  '6a72947ef1579cba611a2f6b': 'mlzitko-mrak-soukroma-zahrada',
  '6a71d1ff57598752eed27bfb': 'bendy-jicinske-namesti',
  '6a6b8d1d553d8991f46cd6a3': 'mestska-mlzna-brana-gate',
  '6a450e035aef0b45b2a8728f': 'mesto-polna-mlzitko-mrkev'
};
const referencePath = (project) => `/reference/${referenceSlugs[project.id] || project.id}`;

export default function ReferenceShowcase() {
  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState('all');
  useEffect(() => {base44.entities.Realizace.list().then((items) => setProjects(items.filter((item) => item.published !== false)));}, []);
  const visible = useMemo(() => active === 'all' ? projects : projects.filter((item) => item.category === active), [active, projects]);
  return <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8"><div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><div><p className="font-mono text-[11px] tracking-[.18em] uppercase text-secondary">Galerie realizací</p><h2 className="mt-3 font-heading text-foreground text-3xl lg:text-3xl">Mlžítka a mlžné brány v reálných prostorech.</h2><p className="mt-4 max-w-2xl text-muted-foreground">Prohlédněte si nerezová řešení pro veřejné prostory, zahrady i místa pro setkávání.</p></div><Link to="/poptavka" className="inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-bold text-primary-foreground hover:bg-secondary">Navrhnout vlastní projekt <ArrowUpRight size={17} /></Link></div><div className="mt-10 flex gap-2 overflow-x-auto pb-2">{filters.map((filter) => <button key={filter.key} onClick={() => setActive(filter.key)} className={`whitespace-nowrap border px-4 py-2 text-xs font-bold transition ${active === filter.key ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-secondary hover:text-secondary'}`}>{filter.label}</button>)}</div><div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{visible.map((project) => <Link key={project.id} to={referencePath(project)} className="group overflow-hidden border border-border bg-card transition hover:-translate-y-1 hover:shadow-xl"><div className="relative aspect-[4/3] overflow-hidden bg-muted">{project.image_url && <img src={project.image_url} alt={project.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />}{project.video_url && <span className="absolute right-3 top-3 inline-flex items-center gap-1 bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground"><Play size={11} /> VIDEO</span>}</div><div className="p-5"><div className="flex items-center justify-between font-mono text-[10px] tracking-widest uppercase text-secondary"><span>{categoryLabel[project.category] || 'Realizace'}</span><span>{project.year}</span></div><h3 className="mt-4 font-heading text-2xl text-foreground">{project.name}</h3><p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin size={14} />{project.location}</p><p className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-secondary">Zobrazit projekt <ArrowUpRight size={15} /></p></div></Link>)}</div>{!visible.length && <p className="py-12 text-center text-muted-foreground">V této kategorii zatím není zveřejněná realizace.</p>}</section>;
}