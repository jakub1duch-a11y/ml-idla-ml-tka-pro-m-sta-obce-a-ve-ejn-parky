import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Loader, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const HIGHLIGHT_NAME = 'ZOO Praha';

function slugify(str) {
  return (str || '').toLowerCase()
    .replace(/á/g,'a').replace(/č/g,'c').replace(/ď/g,'d').replace(/é|ě/g,'e')
    .replace(/í/g,'i').replace(/ň/g,'n').replace(/ó/g,'o').replace(/ř/g,'r')
    .replace(/š/g,'s').replace(/ť/g,'t').replace(/ú|ů/g,'u').replace(/ý/g,'y').replace(/ž/g,'z')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
}

export default function RealizaceGallerySection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Realizace.list('-year', 9)
      .then((items) => {
        const published = (items || []).filter((p) => p.published);
        const sorted = [...published].sort((a, b) => {
          const aHi = (a.name || '').includes(HIGHLIGHT_NAME) ? -1 : 0;
          const bHi = (b.name || '').includes(HIGHLIGHT_NAME) ? -1 : 0;
          return aHi - bHi;
        });
        setProjects(sorted);
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && projects.length === 0) return null;

  return (
    <section className="py-20 lg:py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[11px] font-mono tracking-widest uppercase text-slate-400 mb-2">Realizace</p>
            <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight">
              Naše instalace v městech a parcích.
            </h2>
          </div>
          <Link to="/reference" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors">
            Všechny realizace <ArrowRight size={14} />
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader size={22} className="animate-spin text-slate-300" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[180px] lg:auto-rows-[220px]">
            {projects.map((p, i) => {
              const isHighlighted = (p.name || '').includes(HIGHLIGHT_NAME);
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={isHighlighted ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}
                >
                  <Link to={`/reference/${p.id}-${slugify(p.name)}`} className="group relative block w-full h-full rounded-2xl overflow-hidden bg-slate-100">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 text-3xl">📷</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

                    {isHighlighted && (
                      <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-white text-slate-900 text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full">
                        <Sparkles size={11} /> Vybraná realizace
                      </span>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
                      {p.location && (
                        <div className="flex items-center gap-1.5 text-white/60 text-[11px] font-mono mb-1">
                          <MapPin size={10} /> {p.location}
                        </div>
                      )}
                      <h3 className={`font-heading font-light text-white tracking-tight leading-snug ${isHighlighted ? 'text-xl lg:text-2xl' : 'text-sm'} line-clamp-2`}>
                        {p.name}
                      </h3>
                      <span className="hidden group-hover:inline-flex items-center gap-1 text-[11px] font-medium text-white mt-2">
                        Detail <ArrowRight size={11} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}