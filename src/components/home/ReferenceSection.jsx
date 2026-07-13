import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Loader, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import ClientReviewsStrip from '@/components/home/ClientReviewsStrip';

// Fallback static projects for when DB is empty
const FALLBACK = [
  {
    id: 'f1',
    name: 'Přírodní amfiteátr s mlžnou oázou',
    location: 'Praha 6 — Divoká Šárka',
    year: 2025,
    category: 'mestsky',
    description: 'V nejnavštěvovanějším pražském přírodním parku jsme instalovali 3 mlžné sochy GATE 60 podél hlavní promenády. V horkých dnech teplota v bezprostřední blízkosti klesla o 7 °C.',
    image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/fbcf274b1_FB_IMG_1782148331764.jpg',
    product_used: 'GATE 60',
  },
  {
    id: 'f2',
    name: 'Klimatický komfort ZOO',
    location: 'Dvůr Králové — ZOO',
    year: 2025,
    category: 'mestsky',
    description: 'Instalace 6 mlžných trysek ARENA v exponátu afrických zvířat. Systém zajišťuje optimální mikroklima pro citlivá zvířata při letních teplotách.',
    image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/60a14cfc6_43d83e0c0_unnamed-9.png',
    product_used: 'ARENA',
  },
  {
    id: 'f3',
    name: 'Designová mlžná socha AURA',
    location: 'Praha 1 — Náměstí Republiky',
    year: 2026,
    category: 'mestsky',
    description: 'Pro Prahu 1 jsme navrhli custom mlžnou sochu AURA jako dominantu náměstí. Průměr 160 cm, 8 trysek, ovládání přes Smart systém napojený na meteorologická data.',
    image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9c4797da7_01D04E88-89AB-44FB-9989-C97F3B40E100.png',
    product_used: 'AURA',
  },
];

const CATEGORY_LABELS = {
  mestsky: 'Městský prostor',
  event: 'Event',
  soukromy: 'Soukromý',
  prumyslovy: 'Průmyslový',
};

function SlideCard({ project, index }) {
  return (
    <Link to={`/reference/${project.id}`}
      className="group relative shrink-0 w-[82vw] sm:w-[420px] lg:w-[480px] aspect-[4/5] rounded-3xl overflow-hidden snap-start bg-slate-800">
      {project.image_url ? (
        <img src={project.image_url} alt={project.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white/20 text-6xl">📷</div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      <div className="absolute top-5 left-5 flex gap-2">
        <span className="text-[10px] font-mono text-white/90 tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
          {CATEGORY_LABELS[project.category] || project.category}
        </span>
        {project.year && (
          <span className="text-[10px] font-mono text-slate-900 tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/90">
            {project.year}
          </span>
        )}
      </div>

      <span className="absolute top-5 right-5 font-mono text-white/25 text-4xl font-black">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="absolute bottom-0 left-0 right-0 p-7">
        <div className="flex items-center gap-1.5 text-white/60 text-xs font-mono mb-3">
          <MapPin size={11} /> {project.location}
        </div>
        <h3 className="font-heading font-light text-2xl text-white tracking-tight mb-2 leading-snug">
          {project.name}
        </h3>
        {project.description && (
          <p className="text-sm text-white/50 leading-relaxed line-clamp-2 font-light mb-4">{project.description}</p>
        )}
        <div className="flex items-center justify-between">
          {project.product_used && (
            <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">Produkt: {project.product_used}</span>
          )}
          <span className="flex items-center gap-1.5 text-xs font-medium text-white group-hover:gap-2.5 transition-all">
            Detail <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ReferenceSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    base44.entities.Realizace.list()
      .then(items => {
        const published = (items || []).filter(i => i.published);
        setProjects(published.length > 0 ? published : FALLBACK);
      })
      .catch(() => setProjects(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const scrollBy = (amount) => scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' });

  return (
    <section className="py-24 bg-slate-900 overflow-hidden" id="reference">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <p className="text-xs font-mono tracking-widest uppercase text-white/40 mb-3">Reference</p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="font-heading font-light text-4xl lg:text-5xl text-white tracking-tight">
              Kde naše sochy stojí
            </motion.h2>
            <div className="flex items-center gap-3">
              <Link to="/reference" className="inline-flex items-center gap-2 text-sm text-white/70 font-light hover:text-white hover:gap-3 transition-all">
                Všechny reference <ArrowRight size={14} />
              </Link>
              <div className="hidden sm:flex gap-2 ml-4">
                <button onClick={() => scrollBy(-500)} aria-label="Předchozí"
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => scrollBy(500)} aria-label="Další"
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader size={24} className="animate-spin text-white/30" />
          </div>
        ) : (
          <div ref={scrollRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            {projects.map((project, i) => (
              <motion.div key={project.id} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <SlideCard project={project} index={i} />
              </motion.div>
            ))}
          </div>
        )}
        <ClientReviewsStrip />
      </div>
    </section>
  );
}