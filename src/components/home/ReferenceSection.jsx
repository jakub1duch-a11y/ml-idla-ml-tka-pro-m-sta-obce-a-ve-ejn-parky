import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ChevronLeft, ChevronRight, X, ZoomIn, Loader, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

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
    gallery_urls: [],
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
    gallery_urls: [],
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
    gallery_urls: [],
    product_used: 'AURA',
  },
];

const CATEGORY_LABELS = {
  mestsky: 'Městský prostor',
  event: 'Event',
  soukromy: 'Soukromý',
  prumyslovy: 'Průmyslový',
};

function Lightbox({ images, initialIndex, onClose }) {
  const [idx, setIdx] = useState(initialIndex);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-lg flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
        <X size={18} />
      </button>
      <div className="relative max-w-5xl w-full mx-4" onClick={e => e.stopPropagation()}>
        <img src={images[idx]} alt="" className="w-full max-h-[80vh] object-contain rounded-2xl" />
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white hover:bg-black transition-all">
              <ChevronLeft size={18} />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white hover:bg-black transition-all">
              <ChevronRight size={18} />
            </button>
            <p className="text-center text-xs font-mono text-white/40 mt-3">{idx + 1} / {images.length}</p>
          </>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project }) {
  const allImages = [project.image_url, ...(project.gallery_urls || [])].filter(Boolean);
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/reference/${project.id}`} className="group block">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all bg-white shadow-sm hover:shadow-md"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 text-5xl">📷</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full text-[10px] font-mono text-white/80 tracking-widest uppercase">
            {CATEGORY_LABELS[project.category] || project.category}
          </span>
          {project.year && (
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-full text-[10px] font-mono text-slate-900 tracking-widest uppercase">
              {project.year}
            </span>
          )}
        </div>

        {/* Gallery count */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full text-[10px] font-mono text-white/80">
            <ZoomIn size={10} /> {allImages.length} fotek
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono mb-3">
          <MapPin size={11} /> {project.location}
        </div>
        <h3 className="font-heading font-light text-lg text-slate-900 tracking-tight mb-2 group-hover:text-slate-600 transition-colors leading-snug">
          {project.name}
        </h3>
        {project.description && (
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 font-light">{project.description}</p>
        )}
        {project.product_used && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">Produkt: {project.product_used}</span>
          </div>
        )}
      </div>
      </motion.div>
    </Link>
  );
}

export default function ReferenceSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    base44.entities.Realizace.list()
      .then(items => {
        const published = (items || []).filter(i => i.published);
        setProjects(published.length > 0 ? published : FALLBACK);
      })
      .catch(() => setProjects(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 bg-white" id="reference">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Reference</p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <h2 className="font-heading font-light text-4xl lg:text-5xl text-slate-900 tracking-tight">
              Kde naše sochy stojí
            </h2>
            <Link to="/reference" className="inline-flex items-center gap-2 text-sm text-slate-900 font-light hover:gap-3 transition-all">
              Všechny reference <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader size={24} className="animate-spin text-slate-300" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <Lightbox
          images={lightbox.images}
          initialIndex={lightbox.idx}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}