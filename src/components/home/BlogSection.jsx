import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';

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
},
{
  id: 'f3', slug: 'detske-hriste-mlhoviste',
  title: 'Dětské hřiště a mlhoviště: vše co potřebujete vědět',
  perex: 'Bezpečnost, certifikace, materiály. Kompletní průvodce pro obce a správce hřišť.',
  image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/8139fde88_7fc9b4e64_mlzitko_upraveno_Z09_3544_zmenseno.jpg',
  category: 'inspirace', published_date: '2026-05-01', published: true
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
        className="group relative block h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all">
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

  const latestThree = posts.slice(0, 3);

  if (loading) {
    return (
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-center py-20">
          <Loader size={24} className="animate-spin text-slate-300" />
        </div>
      </section>);

  }

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-3">Blog & znalosti</p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="font-heading font-light text-4xl lg:text-5xl text-slate-900 tracking-tight">
              O mlžení do hloubky
            </motion.h2>
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-slate-900 font-light hover:gap-3 transition-all">
              Všechny články <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Latest 3 posts — photo background + gradient overlay */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {latestThree.map((post, i) => <PostCard key={post.id} post={post} i={i} />)}
        </div>
      </div>
    </section>);

}