import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowLeft, X, ChevronLeft, ChevronRight, ArrowRight, Loader, ZoomIn, Calendar, Tag, ExternalLink, PlayCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { trackReferenceView } from '@/lib/ga4';
import { setSEO, getReferenceSEO } from '@/lib/seo';

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
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center" onClick={onClose}>
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
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white hover:bg-black transition-all">
              <ChevronLeft size={20} />
            </button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white hover:bg-black transition-all">
              <ChevronRight size={20} />
            </button>
            <p className="text-center text-xs font-mono text-white/50 mt-4 tracking-widest">{idx + 1} / {images.length}</p>
          </>
        )}
      </div>
    </div>
  );
}

function isVideoFile(url) {
  return /\.(mp4|webm|mov|ogg)(\?|$)/i.test(url || '');
}

export default function ReferenceDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    base44.entities.Realizace.get(id)
      .then(p => {
        if (p) {
          setProject(p);
          trackReferenceView(p.name, p.location, p.category);
          setSEO(getReferenceSEO(p));
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader size={28} className="animate-spin text-slate-300" />
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-28">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Projekt nenalezen.</p>
          <Link to="/reference" className="text-slate-900 hover:underline">← Zpět na reference</Link>
        </div>
      </div>
    );
  }

  const allImages = [project.image_url, ...(project.gallery_urls || [])].filter(Boolean).filter(u => !isVideoFile(u));
  const galleryVideos = (project.gallery_urls || []).filter(isVideoFile);
  const heroVideo = project.video_url || galleryVideos[0];

  const STATS = [
    { icon: Calendar, label: 'Rok realizace', value: project.year },
    { icon: MapPin, label: 'Lokalita', value: project.location },
    { icon: Tag, label: 'Kategorie', value: CATEGORY_LABELS[project.category] || project.category },
    { icon: null, label: 'Produkt', value: project.product_used },
  ].filter(s => s.value);

  return (
    <div className="min-h-screen bg-white">

      {/* ═══════ HERO ═══════ */}
      <div className="relative h-[70vh] min-h-[520px] overflow-hidden bg-slate-900">
        {project.image_url && (
          <img src={project.image_url} alt={project.name} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
        <div className="absolute top-8 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-10">
          <Link to="/reference" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
            <ArrowLeft size={14} /> Zpět na reference
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 lg:px-10 pb-14">
          <div className="flex flex-wrap gap-2 mb-5">
            {project.category && (
              <span className="px-3 py-1 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full text-[10px] font-mono text-white tracking-widest uppercase">
                {CATEGORY_LABELS[project.category] || project.category}
              </span>
            )}
            {project.year && (
              <span className="px-3 py-1 bg-emerald-500 rounded-full text-[10px] font-mono text-white tracking-widest uppercase">
                {project.year}
              </span>
            )}
          </div>
          <h1 className="font-heading font-semibold text-4xl lg:text-6xl text-white tracking-tight leading-[1.05] mb-3 max-w-3xl">
            {project.name}
          </h1>
          {project.location && (
            <div className="flex items-center gap-1.5 text-white/70 text-sm font-mono mt-3">
              <MapPin size={13} /> {project.location}
            </div>
          )}
        </div>
      </div>

      {/* ═══════ STATS ROW ═══════ */}
      {STATS.length > 0 && (
        <div className="border-b border-slate-200 bg-slate-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase mb-1.5">{s.label}</p>
                <p className="text-lg font-heading font-medium text-slate-900">{s.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════ ABOUT + SIDEBAR ═══════ */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {project.description && (
              <>
                <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">O projektu</p>
                <p className="text-slate-600 text-lg leading-relaxed font-light whitespace-pre-line">{project.description}</p>
              </>
            )}

            {project.source_url && (
              <a href={project.source_url} target="_blank" rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-900 hover:text-slate-600 transition-colors border-b border-slate-300 hover:border-slate-500 pb-0.5">
                Podívejte se, jak realizaci sdílí klient <ExternalLink size={13} />
              </a>
            )}
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-5">Detaily projektu</p>
              <div className="space-y-4">
                {project.client && (
                  <div>
                    <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase mb-1">Klient</p>
                    <p className="text-sm text-slate-900 font-medium">{project.client}</p>
                  </div>
                )}
                {project.location && (
                  <div>
                    <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase mb-1">Lokalita</p>
                    <p className="text-sm text-slate-700">{project.location}</p>
                  </div>
                )}
                {project.year && (
                  <div>
                    <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase mb-1">Rok realizace</p>
                    <p className="text-sm text-slate-700">{project.year}</p>
                  </div>
                )}
                {project.product_used && (
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase mb-1">Použitý produkt</p>
                    <p className="text-sm text-slate-900 font-medium">{project.product_used}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900">
              <p className="text-sm text-white font-light mb-1">Máte zájem o podobný projekt?</p>
              <p className="text-xs text-white/50 mb-4">Konzultace zdarma, vizualizace do 48 h.</p>
              <Link to="/kontakt" className="btn-metallic-mist w-full justify-center py-3 text-xs font-bold">
                Nezávazná poptávka <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════ VIDEO ═══════ */}
      {heroVideo && (
        <div className="bg-slate-50 border-y border-slate-200 py-16 lg:py-20">
          <div className="max-w-5xl mx-auto px-6 lg:px-10">
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4 flex items-center gap-2">
              <PlayCircle size={14} /> Video z realizace
            </p>
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-black">
              <video src={heroVideo} controls className="w-full max-h-[70vh]" />
            </div>
          </div>
        </div>
      )}

      {/* ═══════ PHOTO GALLERY (Apex Arc style mixed grid) ═══════ */}
      {allImages.length > 1 && (
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Fotogalerie</p>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight mb-10">
            Fotografie z realizace
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[160px] md:auto-rows-[200px]">
            {allImages.map((img, i) => (
              <motion.button
                key={i}
                onClick={() => setLightbox(i)}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className={`group relative overflow-hidden rounded-2xl border border-slate-200 hover:border-slate-300 transition-all ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                  <ZoomIn size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* ═══════ CTA ═══════ */}
      <div className="py-20 bg-slate-900">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-heading font-light text-3xl text-white mb-4">Chcete váš projekt zde?</h2>
          <p className="text-white/50 mb-8">Konzultace zdarma, 3D vizualizace do 48 h, montáž za jeden den.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/kontakt" className="btn-metallic-mist px-8 py-4 text-sm font-bold justify-center">
              Nezávazná poptávka
            </Link>
            <Link to="/reference"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 text-white text-sm font-medium rounded-full border border-white/20 hover:bg-white/10 transition-all justify-center">
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