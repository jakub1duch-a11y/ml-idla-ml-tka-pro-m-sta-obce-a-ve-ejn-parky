import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader, ArrowRight, Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO } from '@/lib/seo';

const HERO_VIDEO = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/8cd98c7aa_ukazkamlhy-zivaukazka001.mov';
const DEMO_VIDEO_2 = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/b173cbdc6_ukazkamlhy-zivaukazka002.mov';
const GATE_IMAGE_1 = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/b4aadf75c_mlznebrany-lineace700-2.png';
const GATE_IMAGE_2 = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/25af17aa7_mlznebrany-lineace70.png';
const OPERATION_VIDEOS = [
{ title: 'Mlžítka v provozu — celkový pohled', video_url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/7eadeca01_Ukazka_mltek_v_provozu_-_mlzidla_cz1.mp4', image_url: null },
{ title: 'Mlžítka v provozu — detail mlhy', video_url: 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/4b5e93510_mlzitka_v_provozu_-_mlzidla_cz.mp4', image_url: null }];


function VideoLightbox({ videos, index, onClose }) {
  const [idx, setIdx] = useState(index);
  const current = videos[idx];

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + videos.length) % videos.length);
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % videos.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, videos.length]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={onClose}>
      <button onClick={onClose} aria-label="Zavřít" className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10">
        <X size={18} />
      </button>
      <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          className="rounded-2xl overflow-hidden bg-black">
            <video src={current.video_url} controls autoPlay playsInline poster={current.image_url || undefined} className="w-full max-h-[80vh]" />
          </motion.div>
        </AnimatePresence>
        <p className="text-center text-white/70 text-sm mt-4">{current.title}</p>
        {videos.length > 1 &&
        <>
            <button onClick={() => setIdx((i) => (i - 1 + videos.length) % videos.length)} aria-label="Předchozí video"
          className="absolute left-2 top-1/2 -translate-y-1/2 -translate-x-full sm:translate-x-0 sm:-left-14 w-11 h-11 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white hover:bg-black transition-all">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => setIdx((i) => (i + 1) % videos.length)} aria-label="Další video"
          className="absolute right-2 top-1/2 -translate-y-1/2 translate-x-full sm:translate-x-0 sm:-right-14 w-11 h-11 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-white hover:bg-black transition-all">
              <ChevronRight size={20} />
            </button>
          </>
        }
      </div>
    </div>);

}

export default function VideoUkazky() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [operationLightboxIdx, setOperationLightboxIdx] = useState(null);

  useEffect(() => {
    setSEO({
      title: 'Video — Živé ukázky mlžení',
      description: 'Video ukázky mlžných systémů HolmTec v reálném provozu — produkty i realizace.',
      keywords: 'video mlžení, živé ukázky, mlžný systém video, mlžná brána video',
      canonicalPath: '/video-ukazky'
    });

    const load = async () => {
      const [products, realizace] = await Promise.all([
      base44.entities.Product.list().catch(() => []),
      base44.entities.Realizace.list().catch(() => [])]
      );
      const demoVideos = [
      { title: 'Živá ukázka mlhy — detail', video_url: DEMO_VIDEO_2, image_url: null, link: '/kontakt', type: 'Živá ukázka mlhy' }];

      const productVideos = (products || []).
      filter((p) => p.video_url).
      map((p) => ({ title: p.name, video_url: p.video_url, image_url: p.image_url, link: `/produkt/${p.slug}`, type: 'Produkt' }));
      const realizaceVideos = (realizace || []).
      filter((r) => r.published !== false && r.video_url).
      map((r) => ({ title: r.name, video_url: r.video_url, image_url: r.image_url, link: `/reference/${r.id}`, type: 'Realizace' }));

      setVideos([...demoVideos, ...productVideos, ...realizaceVideos]);
    };
    load().finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ═══════ HERO — VIDEO BACKGROUND ═══════ */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-28 overflow-hidden min-h-[70svh] flex items-end">
        <div className="absolute inset-0">
          <video src={HERO_VIDEO} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 w-full">
          <p className="text-xs font-mono tracking-widest uppercase text-white/60 mb-4">Video</p>
          <h1 className="font-heading font-light text-4xl lg:text-6xl text-white tracking-tight mb-5 max-w-3xl">Živé ukázky mlžení</h1>
          <p className="text-white/70 text-lg font-light max-w-2xl">
            Podívejte se, jak naše mlžné systémy fungují v reálném provozu — jemná mlha ochlazuje okolní vzduch v reálném čase, bez mokrého povrchu.
          </p>
        </div>
      </section>

      {/* ═══════ MLŽÍTKA V PROVOZU — FEATURED VIDEA ═══════ */}
      <section className="py-16 lg:py-20 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-8 lg:mb-10">
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Reálný provoz</p>
            <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight mb-4">Mlžítka v provozu.</h2>
            <p className="text-slate-500 text-base font-light leading-relaxed">
              Krátké ukázky mlžení přímo z instalací — jemný chladivý oblak v pohybu, bez mokrého povrchu.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            {OPERATION_VIDEOS.map((v, i) =>
            <motion.button key={v.title} type="button" onClick={() => setOperationLightboxIdx(i)}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="group relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-video bg-black text-left">
                <video src={v.video_url} autoPlay muted loop playsInline className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/30 transition-colors flex items-center justify-center">
                  <span className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play size={20} className="text-slate-900 ml-0.5" fill="currentColor" />
                  </span>
                </div>
                <p className="absolute bottom-0 left-0 right-0 p-4 text-white text-sm font-medium bg-gradient-to-t from-black/60 to-transparent">{v.title}</p>
              </motion.button>
            )}
          </div>
        </div>
      </section>

      {/* ═══════ GATE SHOWCASE — TEXT + IMAGES ═══════ */}
      

















      

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        {loading ?
        <div className="flex justify-center py-20"><Loader size={24} className="animate-spin text-slate-300" /></div> :
        videos.length === 0 ?
        <p className="text-slate-400 font-light">Zatím žádná videa k zobrazení.</p> :

        <>
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Videotéka</p>
            <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight mb-10">Všechna videa na jednom místě.</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {videos.map((v, i) =>
            <motion.button key={v.title + i} onClick={() => setLightboxIdx(i)}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
            className="group text-left rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 hover:border-slate-300 hover:shadow-lg transition-all">
                  <div className="aspect-video bg-black relative overflow-hidden">
                    {v.image_url ?
                <img src={v.image_url} alt={v.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" loading="lazy" /> :

                <video src={v.video_url} muted playsInline className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                }
                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center">
                      <span className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play size={20} className="text-slate-900 ml-0.5" fill="currentColor" />
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">{v.type}</span>
                      <p className="text-slate-900 font-medium text-sm truncate">{v.title}</p>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-900 transition-colors shrink-0" />
                  </div>
                </motion.button>
            )}
            </div>
          </>
        }
      </div>

      {/* ═══════ CTA ═══════ */}
      <div className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-heading font-light text-2xl lg:text-3xl text-slate-900 mb-3">Chcete vidět mlžítko naživo?</h2>
          <p className="text-slate-500 mb-6 font-light">Domluvte si nezávaznou konzultaci a ukázku přímo na místě.</p>
          <Link to="/poptavka" className="btn-metallic-mist px-7 py-3.5 text-sm font-bold justify-center">
            Nezávazná poptávka <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {lightboxIdx !== null &&
      <VideoLightbox videos={videos} index={lightboxIdx} onClose={() => setLightboxIdx(null)} />
      }
      {operationLightboxIdx !== null &&
      <VideoLightbox videos={OPERATION_VIDEOS} index={operationLightboxIdx} onClose={() => setOperationLightboxIdx(null)} />
      }
    </div>);

}