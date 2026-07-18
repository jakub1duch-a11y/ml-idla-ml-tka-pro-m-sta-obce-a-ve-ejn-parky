import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const slugify = (value) => (value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function BendyRelatedLinks() {
  const [links, setLinks] = useState({ articles: [], references: [] });
  useEffect(() => {
    Promise.all([base44.entities.BlogPost.list(), base44.entities.Realizace.list()]).then(([articles, references]) => setLinks({
      articles: (articles || []).filter((item) => item.published && item.product_launch !== 'bendy_60').slice(0, 2),
      references: (references || []).filter((item) => item.published).slice(0, 2)
    }));
  }, []);
  return <div className="mt-8 grid gap-5 border-t border-white/10 pt-7 sm:grid-cols-2"><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-cyan"><BookOpen size={14} /> Další novinky</p><div className="mt-3 space-y-2">{links.articles.length ? links.articles.map((item) => <Link key={item.id} to={`/blog/${item.slug || item.id}`} className="flex items-center justify-between gap-3 text-sm text-white/70 hover:text-white"><span>{item.title}</span><ArrowRight size={14} /></Link>) : <Link to="/blog" className="flex items-center gap-2 text-sm text-white/70 hover:text-white">Všechny novinky <ArrowRight size={14} /></Link>}</div></div><div><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-cyan"><MapPin size={14} /> Z realizací</p><div className="mt-3 space-y-2">{links.references.length ? links.references.map((item) => <Link key={item.id} to={`/reference/${item.id}-${slugify(item.name)}`} className="flex items-center justify-between gap-3 text-sm text-white/70 hover:text-white"><span>{item.name}</span><ArrowRight size={14} /></Link>) : <Link to="/reference" className="flex items-center gap-2 text-sm text-white/70 hover:text-white">Všechny realizace <ArrowRight size={14} /></Link>}</div></div></div>;
}