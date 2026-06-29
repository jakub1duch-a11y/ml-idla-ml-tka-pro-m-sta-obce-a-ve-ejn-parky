import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const CATEGORY_LABELS = {
  mestsky: 'Městský',
  event: 'Event',
  soukromy: 'Soukromý',
  prumyslovy: 'Průmyslový',
};

const FALLBACK = [
  {
    id: 'f1',
    location: 'Praha — ZOO Praha',
    category: 'mestsky',
    year: 2025,
    name: 'ZOO Praha — Mlžné chlazení',
    description: 'Instalace mlžných soch v areálu ZOO Praha. Systém zajišťuje optimální mikroklima pro zvířata i návštěvníky při letních teplotách.',
    image_url: 'https://lh3.googleusercontent.com/d/1JTKWVGMNje7h4Tq0IVdwlaVJOlDuAoOk',
    stats: [{ val: '−9 °C', label: 'pokles teploty' }, { val: '1 den', label: 'montáž' }, { val: '5 let', label: 'záruka' }],
  },
  {
    id: 'f2',
    location: 'Praha 6 — Divoká Šárka',
    category: 'mestsky',
    year: 2025,
    name: 'Přírodní amfiteátr s mlžnou oázou',
    description: 'V nejnavštěvovanějším pražském přírodním parku jsme instalovali 3 mlžné sochy GATE 60 podél hlavní promenády. V horkých dnech teplota v bezprostřední blízkosti klesla o 7 °C.',
    image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/fbcf274b1_FB_IMG_1782148331764.jpg',
    stats: [{ val: '−7 °C', label: 'pokles teploty' }, { val: '34 %', label: 'více návštěvníků' }, { val: '3 ks', label: 'GATE 60' }],
  },
  {
    id: 'f3',
    location: 'Praha 1 — Náměstí Republiky',
    category: 'mestsky',
    year: 2026,
    name: 'Designová mlžná socha AURA',
    description: 'Pro Prahu 1 jsme navrhli custom mlžnou sochu AURA jako dominantu náměstí. Průměr 160 cm, 8 trysek, ovládání přes Smart systém napojený na meteorologická data.',
    image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9c4797da7_01D04E88-89AB-44FB-9989-C97F3B40E100.png',
    stats: [{ val: '−9 °C', label: 'pokles teploty' }, { val: '160 cm', label: 'průměr AURA' }, { val: 'Smart', label: 'automatické řízení' }],
  },
];

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Realizace.list()
      .then(items => {
        const published = (items || []).filter(i => i.published);
        // Map to consistent shape with fallback stats
        const mapped = published.map(r => ({
          ...r,
          stats: [
            { val: `${r.year}`, label: 'Rok realizace' },
            { val: CATEGORY_LABELS[r.category] || r.category || '—', label: 'Typ projektu' },
            { val: r.product_used || 'HolmTec', label: 'Produkt' },
          ],
        }));
        setProjects(mapped.length > 0 ? mapped : FALLBACK);
      })
      .catch(() => setProjects(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const project = projects[active];

  return (
    <section className="py-24 bg-ink">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
          <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">Realizované projekty</p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <h2 className="font-heading font-light text-4xl lg:text-5xl text-white tracking-tight">
              Kde naše sochy stojí
            </h2>
            <Link to="/reference" className="inline-flex items-center gap-2 text-sm text-cyan font-light hover:gap-3 transition-all">
              Všechny reference <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader size={24} className="animate-spin text-cyan/40" /></div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-2 flex-wrap mb-8">
              {projects.map((p, i) => (
                <button key={p.id} onClick={() => setActive(i)}
                  className={`px-4 py-2 rounded-full text-xs font-mono tracking-widest uppercase transition-all ${active === i ? 'bg-cyan text-ink' : 'text-white/40 border border-white/10 hover:border-white/30 hover:text-white/70'}`}>
                  {(p.location || p.name || '').split('—')[0].trim()}
                </button>
              ))}
            </div>

            {/* Main card */}
            <AnimatePresence mode="wait">
              {project && (
                <motion.div key={project.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden border border-white/10">
                    {/* Image */}
                    <div className="lg:col-span-3 aspect-[4/3] lg:aspect-auto relative overflow-hidden">
                      <img src={project.image_url} alt={project.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                      <div className="absolute top-5 left-5 flex items-center gap-2">
                        {project.category && (
                          <span className="px-3 py-1 bg-ink/70 backdrop-blur-sm border border-white/10 rounded-full text-xs font-mono text-white/60 tracking-widest uppercase">
                            {CATEGORY_LABELS[project.category] || project.category}
                          </span>
                        )}
                        {project.year && (
                          <span className="px-3 py-1 bg-cyan/20 backdrop-blur-sm border border-cyan/20 rounded-full text-xs font-mono text-cyan tracking-widest uppercase">{project.year}</span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-2 bg-card_bg p-8 lg:p-10 flex flex-col justify-between">
                      <div>
                        {project.location && (
                          <div className="flex items-center gap-2 text-white/30 text-xs font-mono mb-4">
                            <MapPin size={12} />
                            <span>{project.location}</span>
                          </div>
                        )}
                        <h3 className="font-heading font-light text-2xl text-white tracking-tight mb-4 leading-snug">{project.name}</h3>
                        <p className="text-sm text-white/50 leading-relaxed font-light">{project.description}</p>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
                        {(project.stats || []).map(s => (
                          <div key={s.label}>
                            <p className="font-light text-xl text-cyan leading-none mb-1">{s.val}</p>
                            <p className="text-xs font-mono text-white/30 tracking-widest uppercase leading-tight">{s.label}</p>
                          </div>
                        ))}
                      </div>

                      <Link to={`/reference/${project.id}`}
                        className="mt-6 inline-flex items-center gap-2 text-xs font-mono text-white/40 hover:text-cyan transition-colors tracking-widest uppercase">
                        Zobrazit detail <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  );
}