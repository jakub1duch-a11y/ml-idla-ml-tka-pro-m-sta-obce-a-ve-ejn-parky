import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader, ArrowRight, Play } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO } from '@/lib/seo';

const HERO_IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/dda3e5142_mlzna-tryska-mlzidla.png';

export default function VideoUkazky() {
  const [featured, setFeatured] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSEO({
      title: 'Video — Živé ukázky mlžení',
      description: 'Video ukázky mlžných systémů HolmTec v reálném provozu — produkty i realizace.',
      keywords: 'video mlžení, živé ukázky, mlžný systém video, mlžná brána video',
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

      const all = [...productVideos, ...realizaceVideos];
      const gate = all.find((v) => v.title?.toLowerCase().includes('gate70')) || all[0] || null;
      setFeatured(gate);
      setVideos(gate ? all.filter((v) => v !== gate) : all);
    };
    load().finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ═══════ HERO ═══════ */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Detail mlžící trysky v provozu" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/85 via-slate-900/75 to-white" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-xs font-mono tracking-widest uppercase text-white/60 mb-4">Video</p>
          <h1 className="font-heading font-light text-4xl lg:text-6xl text-white tracking-tight mb-5">Živé ukázky mlžení</h1>
          <p className="text-white/70 text-lg font-light max-w-2xl">
            Podívejte se, jak naše mlžné systémy fungují v reálném provozu — od zahradních mlžítek po mlžné brány a instalace ve veřejném prostoru.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-24 -mt-8 lg:-mt-12 relative">
        {loading ? (
          <div className="flex justify-center py-20"><Loader size={24} className="animate-spin text-slate-300" /></div>
        ) : (
          <>
            {/* ═══════ FEATURED VIDEO ═══════ */}
            {featured && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="mb-14 rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900">
                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr]">
                  <div className="aspect-video bg-black relative">
                    <video
                      src={featured.video_url}
                      controls
                      playsInline
                      poster={featured.image_url || undefined}
                      autoPlay
                      muted
                      loop
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 lg:p-10 flex flex-col justify-center">
                    <span className="inline-flex items-center gap-1.5 w-fit px-3 py-1 bg-cyan/15 border border-cyan/30 text-cyan text-[11px] font-bold tracking-widest uppercase rounded-full mb-4">
                      <Play size={11} /> Hlavní ukázka
                    </span>
                    <h2 className="font-heading font-light text-2xl lg:text-3xl text-white tracking-tight mb-3">{featured.title}</h2>
                    <p className="text-white/60 text-sm font-light leading-relaxed mb-6">
                      Sledujte mlžnou bránu v plném provozu — jemná mlha ochlazuje okolní vzduch v reálném čase, bez mokrého povrchu.
                    </p>
                    <Link to={featured.link} className="inline-flex items-center gap-2 w-fit px-6 py-3 bg-white text-slate-900 text-sm font-bold rounded-full hover:bg-white/90 transition-colors">
                      Zobrazit produkt <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════ VIDEO GRID ═══════ */}
            {videos.length === 0 && !featured ? (
              <p className="text-slate-400 font-light">Zatím žádná videa k zobrazení.</p>
            ) : videos.length > 0 && (
              <>
                <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-6">Další videa</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((v, i) => (
                    <motion.div key={v.title + i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                      className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 hover:shadow-lg hover:border-slate-300 transition-all group">
                      <div className="aspect-video bg-black relative">
                        <video
                          src={v.video_url}
                          controls
                          playsInline
                          poster={v.image_url || undefined}
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
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}