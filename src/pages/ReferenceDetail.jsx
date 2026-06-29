import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowLeft, X, ChevronLeft, ChevronRight, ArrowRight, Loader, ZoomIn } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CATEGORY_LABELS = {
  mestsky: 'Městský prostor',
  event: 'Event',
  soukromy: 'Soukromý',
  prumyslovy: 'Průmyslový',
};

function Lightbox({ images, initialIndex, onClose }) {
  const [idx, setIdx] = useState(initialIndex);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIdx(i => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setIdx(i => (i + 1) % images.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, images.length]);

  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  return (
    <div className="fixed inset-0 z-[100] bg-ink/97 backdrop-blur-xl flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10">
        <X size={18} />
      </button>
      <div className="relative max-w-6xl w-full mx-6" onClick={e => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.img
            key={idx}
            src={images[idx]}
            alt=""
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="w-full max-h-[82vh] object-contain rounded-2xl"
          />
        </AnimatePresence>
        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-ink/80 border border-white/20 flex items-center justify-center text-white hover:bg-ink transition-all">
              <ChevronLeft size={20} />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-ink/80 border border-white/20 flex items-center justify-center text-white hover:bg-ink transition-all">
              <ChevronRight size={20} />
            </button>
            <p className="text-center text-xs font-mono text-white/40 mt-4 tracking-widest">{idx + 1} / {images.length}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function ReferenceDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    base44.entities.Realizace.get(id)
      .then(p => { if (p) setProject(p); else setNotFound(true); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <Loader size={28} className="animate-spin text-cyan/50" />
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center pt-28">
        <div className="text-center">
          <p className="text-white/40 mb-4">Projekt nenalezen.</p>
          <Link to="/reference" className="text-cyan hover:underline">← Zpět na reference</Link>
        </div>
      </div>
    );
  }

  const allImages = [project.image_url, ...(project.gallery_urls || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-ink">

      {/* Hero */}
      {project.image_url && (
        <div className="relative h-[65vh] min-h-[480px] overflow-hidden">
          <img src={project.image_url} alt={project.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-8 pb-12">
            <Link to="/reference" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors">
              <ArrowLeft size={14} /> Zpět na reference
            </Link>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.category && (
                <span className="px-3 py-1 bg-ink/70 backdrop-blur-sm border border-white/15 rounded-full text-[10px] font-mono text-white/60 tracking-widest uppercase">
                  {CATEGORY_LABELS[project.category] || project.category}
                </span>
              )}
              {project.year && (
                <span className="px-3 py-1 bg-cyan/20 border border-cyan/30 rounded-full text-[10px] font-mono text-cyan tracking-widest uppercase">
                  {project.year}
                </span>
              )}
            </div>
            <h1 className="font-heading font-extralight text-5xl lg:text-7xl text-white tracking-tight leading-none mb-3">
              {project.name}
            </h1>
            {project.location && (
              <div className="flex items-center gap-1.5 text-white/50 text-sm font-mono mt-3">
                <MapPin size={13} /> {project.location}
              </div>
            )}
          </div>
        </div>
      )}

      {/* No hero fallback */}
      {!project.image_url && (
        <div className="pt-28 pb-8 max-w-7xl mx-auto px-6 lg:px-8">
          <Link to="/reference" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={14} /> Zpět na reference
          </Link>
          <h1 className="font-heading font-extralight text-5xl text-white tracking-tight">{project.name}</h1>
        </div>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Description */}
          <div className="lg:col-span-2">
            {project.description && (
              <>
                <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-4">O projektu</p>
                <p className="text-white/70 text-lg leading-relaxed font-light">{project.description}</p>
              </>
            )}

            {/* Gallery grid */}
            {allImages.length > 1 && (
              <div className="mt-12">
                <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-6">
                  Fotogalerie <span className="text-white/20">({allImages.length})</span>
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {allImages.map((img, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setLightbox(i)}
                      initial={{ opacity: 0, scale: 0.97 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.03 }}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 hover:border-cyan/40 transition-all"
                    >
                      <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/30 transition-all flex items-center justify-center">
                        <ZoomIn size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-card_bg border border-white/10">
              <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-5">Detaily projektu</p>
              <div className="space-y-4">
                {project.client && (
                  <div>
                    <p className="text-[10px] font-mono text-white/25 tracking-widest uppercase mb-1">Klient</p>
                    <p className="text-sm text-white font-medium">{project.client}</p>
                  </div>
                )}
                {project.location && (
                  <div>
                    <p className="text-[10px] font-mono text-white/25 tracking-widest uppercase mb-1">Lokalita</p>
                    <p className="text-sm text-white">{project.location}</p>
                  </div>
                )}
                {project.year && (
                  <div>
                    <p className="text-[10px] font-mono text-white/25 tracking-widest uppercase mb-1">Rok realizace</p>
                    <p className="text-sm text-white">{project.year}</p>
                  </div>
                )}
                {project.category && (
                  <div>
                    <p className="text-[10px] font-mono text-white/25 tracking-widest uppercase mb-1">Kategorie</p>
                    <p className="text-sm text-white">{CATEGORY_LABELS[project.category] || project.category}</p>
                  </div>
                )}
                {project.product_used && (
                  <div className="pt-4 border-t border-white/8">
                    <p className="text-[10px] font-mono text-cyan/50 tracking-widest uppercase mb-1">Použitý produkt</p>
                    <p className="text-sm text-cyan font-medium">{project.product_used}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-cyan/5 border border-cyan/20">
              <p className="text-sm text-white font-light mb-1">Máte zájem o podobný projekt?</p>
              <p className="text-xs text-white/40 mb-4">Konzultace zdarma, vizualizace do 48 h.</p>
              <Link to="/kontakt"
                className="flex items-center justify-center gap-2 w-full py-3 bg-cyan text-ink text-xs font-bold rounded-full hover:bg-cyan/90 transition-all">
                ✦ Nezávazná poptávka <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 bg-surface">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-heading font-light text-3xl text-white mb-4">Chcete váš projekt zde?</h2>
          <p className="text-white/50 mb-8">Konzultace zdarma, 3D vizualizace do 48 h, montáž za jeden den.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/kontakt"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-xl shadow-cyan/30">
              ✦ Nezávazná poptávka
            </Link>
            <Link to="/reference"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 text-white text-sm font-medium rounded-full border border-white/20 hover:bg-white/10 transition-all">
              <ArrowLeft size={16} /> Všechny reference
            </Link>
          </div>
        </div>
      </div>

      {lightbox !== null && (
        <Lightbox images={allImages} initialIndex={lightbox} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}