import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO } from '@/lib/seo';

export default function VideoUkazky() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSEO({
      title: 'Video — Živé ukázky mlžení',
      description: 'Video ukázky mlžných systémů HolmTec v reálném provozu — produkty i realizace.',
      keywords: 'video mlžení, živé ukázky, mlžný systém video',
      canonicalPath: '/video-ukazky',
    });

    const load = async () => {
      const [products, realizace] = await Promise.all([
        base44.entities.Product.list().catch(() => []),
        base44.entities.Realizace.list().catch(() => []),
      ]);
      const productVideos = (products || [])
        .filter((p) => p.video_url)
        .map((p) => ({ title: p.name, video_url: p.video_url, image_url: p.image_url, link: `/produkt/${p.slug}`, type: 'Produkt' }));
      const realizaceVideos = (realizace || [])
        .filter((r) => r.published !== false && r.video_url)
        .map((r) => ({ title: r.name, video_url: r.video_url, image_url: r.image_url, link: `/reference/${r.id}`, type: 'Realizace' }));
      setVideos([...productVideos, ...realizaceVideos]);
    };
    load().finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Video</p>
        <h1 className="font-heading font-light text-4xl lg:text-6xl text-slate-900 tracking-tight mb-5">Živé ukázky mlžení</h1>
        <p className="text-slate-500 text-lg font-light max-w-2xl mb-14">
          Podívejte se, jak naše mlžné systémy fungují v reálném provozu — od zahradních mlžítek po mlžné brány a instalace ve veřejném prostoru.
        </p>

        {loading ? (
          <div className="flex justify-center py-20"><Loader size={24} className="animate-spin text-slate-300" /></div>
        ) : videos.length === 0 ? (
          <p className="text-slate-400 font-light">Zatím žádná videa k zobrazení.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v, i) => (
              <motion.div key={v.title + i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                <div className="aspect-video bg-black">
                  <video
                    src={v.video_url}
                    controls
                    playsInline
                    poster={v.image_url || undefined}
                    autoPlay={i === 0}
                    muted={i === 0}
                    loop={i === 0}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">{v.type}</span>
                    <p className="text-slate-900 font-medium text-sm truncate">{v.title}</p>
                  </div>
                  <Link to={v.link} className="inline-flex items-center gap-1 text-xs font-medium text-slate-900 hover:text-slate-600 transition-colors shrink-0">
                    Detail <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}