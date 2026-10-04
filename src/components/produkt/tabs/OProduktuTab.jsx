import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Droplets, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function OProduktuTab({ product, onOpenLightbox }) {
  const [realizace, setRealizace] = useState([]);

  useEffect(() => {
    if (!product?.name) return;
    base44.entities.Realizace.filter({ product_used: product.name }).
    then((res) => setRealizace((res || []).filter((r) => r.published !== false && r.image_url).slice(0, 6))).
    catch(() => setRealizace([]));
  }, [product?.name]);

  const realizaceImages = realizace.map((r) => r.image_url);

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">O produktu</p>

        {realizaceImages.length > 0 &&
        <div className="mb-14">
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-5">Fotogalerie — {product.name}</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {realizaceImages.map((url, i) =>
            <motion.button key={url + i} type="button" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
            onClick={() => onOpenLightbox?.(i, realizaceImages)}
            className="group relative aspect-[4/3] overflow-hidden rounded-[22px] border border-slate-200 bg-slate-100 shadow-[0_12px_34px_rgba(15,23,42,.06)]">
                  <img src={url} alt={`${product.name} – realizace ${i + 1}`} loading={i > 2 ? 'lazy' : 'eager'} decoding="async" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#031d26]/45 via-transparent to-transparent opacity-75 transition-opacity group-hover:opacity-95" />
                  <span className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/25 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.14em] text-white backdrop-blur-md">Realizace {String(i + 1).padStart(2, '0')}</span>
                  <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-md transition-transform group-hover:scale-105">
                    <Maximize2 size={14} />
                  </span>
                </motion.button>
            )}
            </div>
          </div>
        }

        <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-start mb-14">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-slate-900 tracking-tight mb-5 [font-family:'Architects_Daughter',_system-ui] text-3xl lg:text-3xl">Design, který ochlazuje prostor.</h2>
            <p className="text-slate-700 text-lg font-normal leading-[1.8] text-left hyphens-auto">
              {product.description || product.short_description || 'Nerezová konstrukce navržená pro celoroční venkovní provoz s důrazem na minimalistický design a spolehlivost.'}
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .08 }} className="grid grid-cols-2 gap-3">
            {[
              { icon: Droplets, title: 'Jemná mlha', text: 'Ochlazení bez mokrého pocitu při správném návrhu.' },
              { icon: ShieldCheck, title: 'Bez čerpadla', text: 'Nízkotlaký princip přímo z vodovodního řádu.' },
              { icon: MapPin, title: 'Pro veřejný prostor', text: 'Města, parky, hřiště, sportoviště i areály.' },
              { icon: Sparkles, title: 'Nerezový design', text: 'Čistý architektonický výraz a odolné provedení.' }
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <Icon size={18} className="text-[#0b4860]" strokeWidth={1.8} />
                <h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{text}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {product.video_url &&
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl">
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-5">Krátké video</p>
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-black">
              <video src={product.video_url} controls playsInline preload="none" poster={product.image_url} className="w-full aspect-video object-cover" />
            </div>
          </motion.div>
        }
      </div>
    </section>);

}