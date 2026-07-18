import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader, MapPin } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO } from '@/lib/seo';

function projectPhotos(project) {
  return [project.image_url, ...(project.gallery_urls || [])].filter(Boolean).map((image_url, index) => ({ ...project, image_url, key: `${project.id}-${index}` }));
}

function projectBenefit(project) {
  const text = (project.description || '').split('\n').find(line => line.trim());
  return text ? text.replace(/^#+\s*/, '').slice(0, 150) : `Chladivý a příjemnější prostor s řešením ${project.product_used || 'mlžného systému'}.`;
}

export default function Galerie() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setSEO({ title: 'Galerie realizací mlžítek', description: 'Fotogalerie mlžítek a mlžných systémů v městských parcích a průmyslových areálech. Inspirace z realizací HolmTec.', keywords: 'galerie mlžítek, realizace mlžení park, mlžítka průmyslový areál, fotografie mlžné systémy', canonicalPath: '/galerie' });
    base44.entities.Realizace.list('-year', 100).then(items => {
      const selected = (items || []).filter(project => project.published && ['mestsky', 'prumyslovy'].includes(project.category));
      setPhotos(selected.flatMap(projectPhotos));
    }).finally(() => setLoading(false));
  }, []);
  return <main className="min-h-screen bg-white pt-28"><section className="mx-auto max-w-7xl px-6 pb-14 lg:px-8"><p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan">Fotogalerie</p><h1 className="mt-4 max-w-3xl font-heading text-5xl font-medium tracking-tight text-slate-900 lg:text-6xl">Realizace, které mění vnímání prostoru.</h1><p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">Prohlédněte si mlžítka v městských parcích, veřejných místech a průmyslových areálech. U každé realizace najdete lokalitu i konkrétní přínos pro dané prostředí.</p></section><section className="border-y border-slate-200 bg-slate-50 py-12"><div className="mx-auto max-w-7xl px-6 lg:px-8">{loading ? <div className="flex justify-center py-20"><Loader className="animate-spin text-slate-400" size={26} /></div> : photos.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{photos.map((photo, index) => <article key={photo.key} className="overflow-hidden rounded-3xl border border-slate-200 bg-white"><div className="aspect-[4/3] overflow-hidden bg-slate-200"><img src={photo.image_url} alt={`${photo.name} – mlžítko v lokalitě ${photo.location || 'Česká republika'}`} loading={index < 2 ? 'eager' : 'lazy'} fetchPriority={index < 2 ? 'high' : 'auto'} decoding="async" className="h-full w-full object-cover transition duration-500 hover:scale-105" /></div><div className="p-5"><p className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500"><MapPin size={14} className="text-cyan" /> {photo.location || 'Česká republika'}</p><h2 className="mt-3 font-heading text-xl font-semibold text-slate-900">{photo.name}</h2><p className="mt-2 text-sm leading-relaxed text-slate-600">{projectBenefit(photo)}</p></div></article>)}</div> : <div className="py-20 text-center"><p className="text-slate-500">Fotografie realizací se právě připravují.</p></div>}</div></section><section className="mx-auto max-w-7xl px-6 py-16 lg:px-8"><Link to="/reference" className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-cyan hover:text-slate-950">Všechny realizace <ArrowRight size={16} /></Link></section></main>;
}