import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

function slugify(str) {
  return (str || '').toLowerCase()
    .replace(/á/g,'a').replace(/č/g,'c').replace(/ď/g,'d').replace(/é|ě/g,'e')
    .replace(/í/g,'i').replace(/ň/g,'n').replace(/ó/g,'o').replace(/ř/g,'r')
    .replace(/š/g,'s').replace(/ť/g,'t').replace(/ú|ů/g,'u').replace(/ý/g,'y').replace(/ž/g,'z')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

export default function LightRealizace() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    base44.entities.Realizace.list('-year', 8)
      .then((items) => setProjects((items || []).filter((p) => p.published)))
      .catch(() => setProjects([]));
  }, []);

  if (projects.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
      <h2 className="font-heading font-bold text-2xl text-slate-900 mb-6">Realizace</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
        {projects.map((p) => (
          <Link key={p.id} to={`/reference/${p.id}-${slugify(p.name)}`}
            className="group shrink-0 w-64 rounded-xl overflow-hidden bg-white border border-slate-200 hover:border-slate-300 transition-colors">
            <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
              {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />}
            </div>
            <div className="p-4">
              <h3 className="font-heading font-semibold text-sm text-slate-900 mb-1 line-clamp-1">{p.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{p.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}