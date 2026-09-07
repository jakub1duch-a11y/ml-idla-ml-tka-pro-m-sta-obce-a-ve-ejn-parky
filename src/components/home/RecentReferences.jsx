import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader, MapPin } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function RecentReferences() {
  const [refs, setRefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Realizace.list('-created_date', 50)
      .then((items) => {
        const published = (items || []).filter((r) => r.published && r.image_url).slice(0, 3);
        setRefs(published);
      })
      .catch(() => setRefs([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <section className="py-16 bg-white">
      <div className="flex justify-center"><Loader size={24} className="animate-spin text-slate-300" /></div>
    </section>
  );

  if (refs.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono tracking-widest uppercase text-slate-400 mb-2 text-xs">REFERENCE</p>
            <h2 className="font-heading font-medium tracking-tight text-slate-900 text-[clamp(1.75rem,5vw,2.5rem)]">
              Realizované projekty
            </h2>
          </div>
          <Link to="/reference" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-[#0b4860] hover:gap-2.5 transition-all">
            Všechny reference <ArrowRight size={15} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {refs.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Link to={`/reference/${r.id}`} className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img src={r.image_url} alt={r.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {r.location && (
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-xs font-medium text-white">
                      <MapPin size={12} className="text-cyan-300" /> {r.location}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-semibold text-slate-900 mb-1 line-clamp-1">{r.name}</h3>
                  {r.client && <p className="text-sm text-slate-500 line-clamp-1">{r.client}</p>}
                  {r.description && <p className="text-xs text-slate-400 mt-2 line-clamp-2">{r.description}</p>}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link to="/reference" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0b4860]">
            Všechny reference <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}