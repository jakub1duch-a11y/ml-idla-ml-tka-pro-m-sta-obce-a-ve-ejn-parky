import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader, Radio, Sparkles, Play, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const GATE_VIDEO_URL = 'https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/42cf4b972_Efektmlhy-mlznabrana-zivynahled.mov';

const CATEGORY_LABELS = {
  inspirace: 'Inspirace',
  realizace: 'Realizace',
  technika: 'Technologie',
  novinky: 'Novinky'
};

const FALLBACK_BG = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80';

const FALLBACK = [
{
  id: 'f1', slug: 'vyhody-mlznych-systemu-mestske-prostory',
  title: '7 výhod instalace mlžných systémů v městských prostorech',
  perex: 'Mlžné systémy ochlazují městské prostory až o 9 °C, zvyšují návštěvnost a vytvářejí ikonická místa.',
  image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/48d543124_generated_image.png',
  category: 'technika', published_date: '2026-06-29', published: true
},
{
  id: 'f2', slug: 'evaporace-mikroklima',
  title: 'Jak evaporace mění mikroklima veřejných prostorů',
  perex: 'Věda za mlhou: kapky 10–50 μm se odpařují ještě ve vzduchu a absorbují teplo z okolí.',
  image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6b51ec82a_19dca9db2_Social_Media_Video_Ads_A_close-up_captures_numerous_water_droplets_OIctonFe.png',
  category: 'technika', published_date: '2026-06-01', published: true
}];


function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('cs-CZ', { year: 'numeric', month: 'long' });
}

function PostCard({ post, i }) {
  const bg = post.image_url || FALLBACK_BG;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
      <Link to={`/blog/${post.slug || post.id}`}
        className="group relative block h-72 rounded-2xl overflow-hidden border border-white/10 shadow-sm hover:shadow-lg transition-all">
        <img src={bg} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5" />
        <div className="relative h-full flex flex-col justify-end p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-mono text-white/80 tracking-widest uppercase px-2.5 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
              {CATEGORY_LABELS[post.category] || post.category || 'Článek'}
            </span>
            {post.published_date && <span className="text-[10px] font-mono text-white/50">{formatDate(post.published_date)}</span>}
          </div>
          <h3 className="font-heading font-light text-lg text-white tracking-tight leading-snug mb-2 group-hover:text-white/80 transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-white/60 font-light leading-relaxed line-clamp-2 mb-3">{post.perex}</p>
          <div className="flex items-center gap-2 text-xs text-white font-medium group-hover:gap-3 transition-all">
            Číst článek <ArrowRight size={12} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function LiveDemoCard() {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e) => e.key === 'Escape' && setLightboxOpen(false);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="lg:col-span-2">
      <button type="button" onClick={() => setLightboxOpen(true)}
        className="group relative block w-full text-left h-full min-h-[340px] rounded-3xl overflow-hidden border border-white/10 bg-slate-900">
        <video
          src={GATE_VIDEO_URL}
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

        <div className="relative h-full flex flex-col justify-between p-7 lg:p-9">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-white tracking-widest uppercase px-3 py-1.5 bg-red-500/90 rounded-full">
              <Radio size={11} className="animate-pulse" /> Živě
            </span>
            <span className="text-[10px] font-mono text-white/70 tracking-widest uppercase px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
              Novinka
            </span>
          </div>

          <div>
            <h3 className="font-heading font-light text-2xl lg:text-3xl text-white tracking-tight leading-snug mb-3">
              Živá ukázka: mlžení naší brány GATE
            </h3>
            <p className="text-sm text-white/60 font-light leading-relaxed max-w-md mb-5">
              Podívejte se, jak jemná mlhová clona GATE ochlazuje vzduch v reálném čase — bez mokrého povrchu, bez hluku, s okamžitým osvěžujícím efektem už na první nádech.
            </p>
            <div className="flex items-center gap-2 text-sm text-white font-medium group-hover:gap-3 transition-all">
              <Play size={14} fill="currentColor" /> Přehrát video <ArrowRight size={15} />
            </div>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
            <button onClick={() => setLightboxOpen(false)} aria-label="Zavřít"
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-10">
              <X size={18} />
            </button>
            <div className="relative max-w-4xl w-full rounded-2xl overflow-hidden bg-black" onClick={(e) => e.stopPropagation()}>
              <video src={GATE_VIDEO_URL} controls autoPlay playsInline className="w-full max-h-[80vh]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function GateOfferCard() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
      <Link to="/gate70" className="group relative block h-full min-h-[340px] rounded-3xl overflow-hidden border border-white/10 bg-slate-900">
        <img
          src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/17e1fc843_MlznabranaGATE70U.png"
          alt="Mlžná brána GATE70"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/0" />

        <div className="relative h-full flex flex-col justify-between p-6">
          <span className="inline-flex items-center gap-1.5 self-start text-[10px] font-mono text-white tracking-widest uppercase px-3 py-1.5 bg-white/15 backdrop-blur-sm border border-white/25 rounded-full">
            <Sparkles size={11} /> Nabídka produktu
          </span>
          <div>
            <p className="text-xs font-mono text-white/50 tracking-widest uppercase mb-2">Mlžná brána</p>
            <h3 className="font-heading font-light text-2xl text-white tracking-tight mb-3">GATE70</h3>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-5">Ochlazení až o 9 °C, Wi-Fi Smart řízení, dvě tvarové varianty na míru vašemu prostoru.</p>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 text-xs font-bold rounded-full group-hover:bg-white/90 transition-all">
              Poptat GATE70 <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function BlogSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.BlogPost.list('-published_date').
    then((items) => {
      const published = (items || []).filter((p) => p.published);
      setPosts(published.length > 0 ? published : FALLBACK);
    }).
    catch(() => setPosts(FALLBACK)).
    finally(() => setLoading(false));
  }, []);

  const latestTwo = posts.slice(0, 2);

  return (
    <section className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <p className="text-xs font-mono tracking-widest uppercase text-white/40 mb-3">Novinky & znalosti</p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="font-heading font-light text-4xl lg:text-5xl text-white tracking-tight">
              Co je nového u nás
            </motion.h2>
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-white/70 font-light hover:text-white hover:gap-3 transition-all">
              Všechny články <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Bento: live demo + product offer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          <LiveDemoCard />
          <GateOfferCard />
        </div>

        {/* Blog posts */}
        {loading ? (
          <div className="flex justify-center py-14">
            <Loader size={22} className="animate-spin text-white/30" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {latestTwo.map((post, i) => <PostCard key={post.id} post={post} i={i} />)}
          </div>
        )}
      </div>
    </section>);

}