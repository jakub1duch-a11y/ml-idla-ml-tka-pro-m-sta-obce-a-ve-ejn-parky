import React, { useEffect, useState } from 'react';
import { ArrowRight, Carrot, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const POLNA = { id: '6a450e035aef0b45b2a8728f', name: 'MRKEV — město Polná', location: 'Polná, Česká republika', category: 'mestsky', product_used: 'MRKEV', image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/596fefdec_MlnsochaMRKEV-mstoPoln.jpg', description: 'Mrkev z městského znaku jsme převedli do autorské nerezové skulptury. Město získalo nové místo pro setkávání, ochlazení i posílení lokální identity.' };
const patterns = { 'domovy-senioru': /senior|palata/i, 'skoly-skolky-deti': /škol|děti|mateř/i, eventy: /event|festival|akce/i, 'outdoor-zahrady': /zahrad|reziden/i, hotely: /hotel|restaur|terasa/i, 'wellness-terasy': /wellness|spa|saun/i };
const slugify = (value = '') => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const benefit = (project) => project.id === POLNA.id ? POLNA.description : (project.description || '').split('\n').filter(Boolean)[0]?.slice(0, 190) || 'Realizace přinesla příjemnější mikroklima a nový funkční bod prostoru.';

export default function B2BReferencesSection({ context = 'mesta-obce', title = 'Realizace, které přinášejí městům skutečný užitek.' }) {
  const [projects, setProjects] = useState([POLNA]);
  useEffect(() => { base44.entities.Realizace.list('-year', 30).then((items) => {
    const published = (items || []).filter(item => item.published);
    const pattern = patterns[context];
    const contextual = pattern ? published.filter(item => pattern.test(`${item.name} ${item.client} ${item.description}`)) : published.filter(item => item.category === 'mestsky');
    const polna = published.find(item => item.id === POLNA.id) || POLNA;
    setProjects([polna, ...contextual.filter(item => item.id !== polna.id)].slice(0, 3));
  }).catch(() => setProjects([POLNA])); }, [context]);
  return <section className="bg-slate-950 py-16 text-white lg:py-20"><div className="site-container"><div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="content-eyebrow text-cyan">Reference pro B2B a samosprávy</p><h2 className="mt-3 max-w-3xl text-white">{title}</h2><p className="mt-4 max-w-2xl text-white/65">Každý návrh spojuje ochlazení, kvalitní veřejný prostor a příběh konkrétního místa.</p></div><Link to="/reference" className="inline-flex items-center gap-2 text-sm font-bold text-cyan">Všechny realizace <ArrowRight size={16} /></Link></div><div className="mt-10 grid gap-5 lg:grid-cols-3">{projects.map(project => <article key={project.id} className="overflow-hidden border border-white/15 bg-white/5"><Link to={`/reference/${project.id}-${slugify(project.name)}`} className="group block"><div className="relative aspect-[4/3] overflow-hidden bg-slate-900"><img src={project.image_url} alt={`${project.name} — přínos realizace`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />{project.id === POLNA.id && <span className="absolute left-4 top-4 inline-flex items-center gap-2 bg-white px-3 py-2 text-xs font-bold text-slate-950"><Carrot size={15} /> Motiv městského znaku</span>}</div><div className="p-6"><p className="flex items-center gap-2 text-xs text-white/55"><MapPin size={13} /> {project.location}</p><h3 className="mt-3 text-xl text-white">{project.name}</h3><p className="mt-3 text-sm leading-relaxed text-white/65">{benefit(project)}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan">Příběh realizace <ArrowRight size={15} /></span></div></Link></article>)}</div></div></section>;
}