import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, LoaderCircle } from 'lucide-react';
import { loadHomepageMedia, useHomepageMedia } from '@/lib/publicHomepageMedia';

const CARDS = [
  { key: 'festival', title: 'Eventy a veřejné akce', text: 'Ochlazení frekventovaných prostor v letním provozu.', className: 'md:col-span-2' },
  { key: 'playground', title: 'Parky a dětská hřiště', text: 'Hravý nerezový prvek, který funguje i jako součást prostoru.' },
  { key: 'architecture', title: 'Architektura na míru', text: 'Volný tvar jako funkční objekt pro veřejnou architekturu.' },
];

function MediaCard({ item }) {
  const src = useHomepageMedia(item.key);
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      className={`group relative min-h-[320px] overflow-hidden rounded-2xl bg-slate-900 ${item.className || ''}`}
    >
      {src ? <img src={src} alt={item.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" /> : <div className="absolute inset-0 animate-pulse bg-slate-200" />}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
        <h3 className="font-heading text-xl font-semibold text-white sm:text-2xl">{item.title}</h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">{item.text}</p>
      </div>
    </motion.article>
  );
}

export default function FieldMediaSection() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoLoading, setVideoLoading] = useState(false);

  const loadVideo = async () => {
    if (videoUrl || videoLoading) return;
    setVideoLoading(true);
    const value = await loadHomepageMedia('video');
    setVideoUrl(value);
    setVideoLoading(false);
  };

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[.2em] text-[#0B6B7A]">Skutečné použití</p>
          <h2 className="mt-4 font-heading text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.03] tracking-[-0.035em] text-[#0A1628]">Mlžidla v prostoru, ne jen v katalogu.</h2>
          <p className="mt-5 text-base leading-7 text-[#5A6B78] sm:text-lg">Od festivalu přes dětské hřiště až po architektonický solitér. Ukazujeme reálný kontext, měřítko i práci vodní mlhy.</p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((item) => <MediaCard key={item.key} item={item} />)}
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
          {videoUrl ? (
            <video src={videoUrl} controls playsInline preload="metadata" className="aspect-video w-full object-cover" />
          ) : (
            <button type="button" onClick={loadVideo} className="flex aspect-[16/7] w-full items-center justify-center gap-3 bg-slate-950 text-white transition hover:bg-slate-900">
              {videoLoading ? <LoaderCircle className="animate-spin" size={22} /> : <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-950"><Play size={20} fill="currentColor" /></span>}
              <span className="text-sm font-semibold">{videoLoading ? 'Načítám video…' : 'Přehrát video z realizace'}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
