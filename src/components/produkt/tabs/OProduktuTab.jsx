import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function OProduktuTab({ product, onOpenLightbox }) {
  const [realizace, setRealizace] = useState([]);

  useEffect(() => {
    if (!product?.name) return;
    base44.entities.Realizace.filter({ product_used: product.name })
      .then((res) => setRealizace((res || []).filter((r) => r.published !== false && r.image_url).slice(0, 6)))
      .catch(() => setRealizace([]));
  }, [product?.name]);

  const realizaceImages = realizace.map((r) => r.image_url);

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">O produktu</p>

        {realizaceImages.length > 0 && (
          <div className="mb-14">
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-5">Fotogalerie — {product.name}</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {realizaceImages.map((url, i) => (
                <motion.button key={url + i} type="button" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                  onClick={() => onOpenLightbox?.(0, realizaceImages)}
                  className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group">
                  <img src={url} alt={`${product.name} fotografie ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Maximize2 size={14} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mb-14">
          <h2 className="font-heading text-4xl lg:text-5xl text-slate-900 tracking-tight mb-5">Design, který ochlazuje prostor.</h2>
          <p className="text-slate-500 text-base font-light leading-relaxed">
            {product.description || product.short_description || 'Nerezová konstrukce navržená pro celoroční venkovní provoz s důrazem na minimalistický design a spolehlivost.'}
          </p>
        </motion.div>

        {product.video_url && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl">
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-5">Krátké video</p>
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-black">
              <video src={product.video_url} controls playsInline className="w-full aspect-video object-cover" />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}