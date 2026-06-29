import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CATEGORY_LABELS = {
  inspirace: 'Inspirace',
  realizace: 'Realizace',
  technika: 'Technologie',
  novinky: 'Novinky',
};

const FALLBACK = [
  {
    id: 'f1', slug: 'vyhody-mlznych-systemu-mestske-prostory',
    title: '7 výhod instalace mlžných systémů v městských prostorech',
    perex: 'Mlžné systémy ochlazují městské prostory až o 9 °C, zvyšují návštěvnost a vytvářejí ikonická místa.',
    image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/48d543124_generated_image.png',
    category: 'technika', published_date: '2026-06-29', published: true,
  },
  {
    id: 'f2', slug: 'evaporace-mikroklima',
    title: 'Jak evaporace mění mikroklima veřejných prostorů',
    perex: 'Věda za mlhou: kapky 10–50 μm se odpařují ještě ve vzduchu a absorbují teplo z okolí.',
    image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6b51ec82a_19dca9db2_Social_Media_Video_Ads_A_close-up_captures_numerous_water_droplets_OIctonFe.png',
    category: 'technika', published_date: '2026-06-01', published: true,
  },
  {
    id: 'f3', slug: 'detske-hriste-mlhoviste',
    title: 'Dětské hřiště a mlhoviště: vše co potřebujete vědět',
    perex: 'Bezpečnost, certifikace, materiály. Kompletní průvodce pro obce a správce hřišť.',
    image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/8139fde88_7fc9b4e64_mlzitko_upraveno_Z09_3544_zmenseno.jpg',
    category: 'inspirace', published_date: '2026-05-01', published: true,
  },
  {
    id: 'f4', slug: 'aura-namesti-republiky',
    title: 'AURA: nerezový kruh, který ovládl náměstí',
    perex: 'Příběh vzniku modelu AURA — od skici přes technický výkres po instalaci.',
    image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9c4797da7_01D04E88-89AB-44FB-9989-C97F3B40E100.png',
    category: 'realizace', published_date: '2026-04-01', published: true,
  },
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('cs-CZ', { year: 'numeric', month: 'long' });
}

export default function BlogSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.BlogPost.list()
      .then(items => {
        const published = (items || []).filter(p => p.published);
        setPosts(published.length > 0 ? published : FALLBACK);
      })
      .catch(() => setPosts(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const [featured, ...rest] = posts.slice(0, 4);

  if (loading) {
    return (
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-center py-20">
          <Loader size={24} className="animate-spin text-cyan/40" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
          <p className="text-xs font-mono tracking-widest uppercase text-cyan mb-3">Blog & znalosti</p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <h2 className="font-heading font-light text-4xl lg:text-5xl text-white tracking-tight">
              O mlžení do hloubky
            </h2>
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-cyan font-light hover:gap-3 transition-all">
              Všechny články <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Featured post */}
          {featured && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="lg:col-span-3">
              <Link to={`/blog/${featured.slug || featured.id}`} className="group block rounded-2xl overflow-hidden border border-white/10 hover:border-cyan/30 transition-all h-full flex flex-col bg-card_bg">
                {featured.image_url && (
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={featured.image_url} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-mono text-cyan tracking-widest uppercase">{CATEGORY_LABELS[featured.category] || featured.category || 'Článek'}</span>
                    {featured.published_date && <><span className="w-1 h-1 rounded-full bg-white/20" /><span className="text-xs font-mono text-white/30">{formatDate(featured.published_date)}</span></>}
                  </div>
                  <h3 className="font-heading font-light text-2xl text-white tracking-tight mb-3 leading-snug group-hover:text-cyan/90 transition-colors">{featured.title}</h3>
                  <p className="text-sm text-white/50 font-light leading-relaxed flex-1">{featured.perex}</p>
                  <div className="mt-6 flex items-center gap-2 text-xs text-cyan font-light group-hover:gap-3 transition-all">
                    Číst článek <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Side posts */}
          {rest.length > 0 && (
            <div className="lg:col-span-2 flex flex-col gap-5">
              {rest.map((post, i) => (
                <motion.div key={post.id} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <Link to={`/blog/${post.slug || post.id}`} className="group block rounded-2xl overflow-hidden border border-white/10 hover:border-cyan/30 transition-all flex gap-0 bg-card_bg h-full">
                    {post.image_url && (
                      <div className="w-28 flex-shrink-0 overflow-hidden">
                        <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-5 flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-mono text-cyan tracking-widest uppercase">{CATEGORY_LABELS[post.category] || post.category || 'Článek'}</span>
                        </div>
                        <h4 className="font-light text-white text-sm leading-snug group-hover:text-cyan/90 transition-colors line-clamp-2">{post.title}</h4>
                      </div>
                      {post.published_date && <p className="text-xs font-mono text-white/30 mt-2">{formatDate(post.published_date)}</p>}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}