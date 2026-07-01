import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO, SEO_PAGES } from '@/lib/seo';

const CATEGORY_LABELS = {
  inspirace: 'Inspirace',
  realizace: 'Realizace',
  technika: 'Technologie',
  novinky: 'Novinky',
};

const FALLBACK = [
  {
    id: 'f1', slug: 'evaporace-mikroklima', category: 'technika',
    title: 'Jak evaporace mění mikroklima veřejných prostorů',
    perex: 'Věda za mlhou: kapky 10–50 μm se odpařují ještě ve vzduchu a absorbují teplo z okolí. Vysvětlujeme fyziku, která stojí za ochlazením až 9 °C.',
    image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6b51ec82a_19dca9db2_Social_Media_Video_Ads_A_close-up_captures_numerous_water_droplets_OIctonFe.png',
    published_date: '2026-06-01', published: true,
  },
  {
    id: 'f2', slug: 'detske-hriste-mlhoviste', category: 'inspirace',
    title: 'Dětské hřiště a mlhoviště: vše co potřebujete vědět',
    perex: 'Bezpečnost, certifikace, materiály. Kompletní průvodce pro obce a správce hřišť, kteří zvažují instalaci mlžného systému pro děti.',
    image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/8139fde88_7fc9b4e64_mlzitko_upraveno_Z09_3544_zmenseno.jpg',
    published_date: '2026-05-01', published: true,
  },
  {
    id: 'f3', slug: 'aura-namesti-republiky', category: 'realizace',
    title: 'AURA: nerezový kruh, který ovládl náměstí',
    perex: 'Příběh vzniku modelu AURA — od skici přes technický výkres po instalaci na Náměstí Republiky. Rozhovor s projektovým inženýrem.',
    image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/9c4797da7_01D04E88-89AB-44FB-9989-C97F3B40E100.png',
    published_date: '2026-04-01', published: true,
  },
  {
    id: 'f4', slug: 'mlzeni-vs-klimatizace', category: 'technika',
    title: 'Mlžení vs. klimatizace: srovnání spotřeby a dopadu',
    perex: 'Porovnáváme energetickou náročnost, spotřebu vody a uhlíkovou stopu obou technologií. Výsledky překvapí.',
    image_url: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/39c506f5b_891c5179a_Social_Media_Video_Ads_A_curved_metallic_pipe_speckled_with_glistening_1_-N3ABn.png',
    published_date: '2026-03-01', published: true,
  },
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('cs-CZ', { year: 'numeric', month: 'long', day: 'numeric' });
}

const FILTERS = [{ value: 'all', label: 'Vše' }, ...Object.entries(CATEGORY_LABELS).map(([v, l]) => ({ value: v, label: l }))];

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setSEO(SEO_PAGES.blog);
    base44.entities.BlogPost.list()
      .then(items => {
        const published = (items || []).filter(p => p.published);
        setPosts(published.length > 0 ? published : FALLBACK);
      })
      .catch(() => setPosts(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const visible = filter === 'all' ? posts : posts.filter(p => p.category === filter);
  const [featured, ...rest] = visible;

  return (
    <div className="min-h-screen bg-white pt-28">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-14">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Blog & Novinky</p>
          <h1 className="font-heading font-light text-5xl lg:text-7xl text-slate-900 tracking-tight mb-4">
            O mlžení do hloubky
          </h1>
          <p className="text-slate-500 max-w-xl text-lg font-light">
            Technologie, inspirace, realizace a novinky ze světa mlžných soch a chladicích systémů.
          </p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-widest uppercase transition-all ${filter === f.value ? 'bg-slate-900 text-white' : 'text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-800'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        {loading ? (
          <div className="flex justify-center py-20"><Loader size={24} className="animate-spin text-slate-300" /></div>
        ) : visible.length === 0 ? (
          <p className="text-center text-slate-400 py-20 font-mono text-sm">Žádné články v této kategorii.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Featured */}
            {featured && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-3">
                <Link to={`/blog/${featured.slug || featured.id}`} className="group block rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all bg-white h-full">
                  {featured.image_url && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={featured.image_url} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-8 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">{CATEGORY_LABELS[featured.category] || featured.category || 'Článek'}</span>
                      {featured.published_date && <><span className="w-1 h-1 rounded-full bg-slate-200" /><span className="text-xs font-mono text-slate-300">{formatDate(featured.published_date)}</span></>}
                    </div>
                    <h2 className="font-heading font-light text-2xl text-slate-900 tracking-tight mb-3 leading-snug group-hover:text-slate-600 transition-colors">{featured.title}</h2>
                    <p className="text-sm text-slate-500 font-light leading-relaxed">{featured.perex}</p>
                    <div className="mt-6 flex items-center gap-2 text-xs text-slate-900 font-medium group-hover:gap-3 transition-all">
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
                  <motion.div key={post.id} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                    <Link to={`/blog/${post.slug || post.id}`} className="group flex rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all bg-white h-full">
                      {post.image_url && (
                        <div className="w-28 flex-shrink-0 overflow-hidden">
                          <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="p-5 flex flex-col justify-between flex-1 min-w-0">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">{CATEGORY_LABELS[post.category] || post.category || 'Článek'}</span>
                          </div>
                          <h3 className="font-light text-slate-900 text-sm leading-snug group-hover:text-slate-600 transition-colors line-clamp-2">{post.title}</h3>
                        </div>
                        {post.published_date && <p className="text-xs font-mono text-slate-300 mt-2">{formatDate(post.published_date)}</p>}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* All posts grid if more than 4 */}
        {visible.length > 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
            {visible.slice(4).map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Link to={`/blog/${post.slug || post.id}`} className="group block rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all bg-white h-full">
                  {post.image_url && (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="text-xs font-mono text-slate-400 tracking-widest uppercase block mb-2">{CATEGORY_LABELS[post.category] || post.category}</span>
                    <h3 className="font-light text-slate-900 text-base leading-snug group-hover:text-slate-600 transition-colors line-clamp-2 mb-2">{post.title}</h3>
                    {post.published_date && <p className="text-xs font-mono text-slate-300">{formatDate(post.published_date)}</p>}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}