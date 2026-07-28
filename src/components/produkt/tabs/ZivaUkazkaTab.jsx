import React from 'react';
import { motion } from 'framer-motion';
import { Maximize2, VideoOff } from 'lucide-react';

export default function ZivaUkazkaTab({ product, allImages, onOpenLightbox }) {
  return (
    <section className="py-16 lg:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 max-w-2xl">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Živá ukázka</p>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight mb-5">
            {product.name} <span className="text-slate-400">v reálném provozu.</span>
          </h2>
          <p className="text-slate-500 text-base font-light leading-relaxed">
            Podívejte se, jak jemný mlžný oblak vytváří příjemné mikroklima v reálném provozu, a prohlédněte si fotografie z instalací.
          </p>
        </motion.div>

        {product.video_url ? (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl overflow-hidden border border-slate-200 bg-black mb-12">
            <video src={product.video_url} controls playsInline className="w-full aspect-video object-cover" />
          </motion.div>
        ) : (
          <div className="flex items-center gap-2.5 text-slate-400 text-sm mb-12 p-6 rounded-2xl border border-dashed border-slate-300 bg-white max-w-md">
            <VideoOff size={16} /> Video zatím není k dispozici.
          </div>
        )}

        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Fotografie z instalací</p>
        {allImages.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden">
            {allImages.map((src, i) => (
              <button key={i} type="button" onClick={() => onOpenLightbox(i)}
                className="relative shrink-0 w-[240px] sm:w-[280px] aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group">
                <img src={src} alt={`${product.name} instalace ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
                  <Maximize2 size={12} />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 font-light">Galerie zatím není k dispozici.</p>
        )}
      </div>
    </section>
  );
}