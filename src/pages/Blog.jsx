import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO, SEO_PAGES } from '@/lib/seo';
import LeadMagnetPopup from '@/components/blog/LeadMagnetPopup';
import BlogVideoShowcase from '@/components/blog/BlogVideoShowcase';

const CATEGORY_LABELS = {
  inspirace: 'Inspirace',
  realizace: 'Realizace',
  technika: 'Technologie',
  novinky: 'Novinky',
  videa: 'Videa'
};

const AUDIENCE_TABS = [
{ value: 'all', label: 'Vše' },
{ value: 'firmy', label: 'Pro firmy a provozy' },
{ value: 'soukrome', label: 'Pro domácnosti a zahrady' }];


function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('cs-CZ', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [audience, setAudience] = useState('all');
  const [category, setCategory] = useState(() => new URLSearchParams(window.location.search).get('sekce') === 'videa' ? 'videa' : 'all');

  useEffect(() => {
    setSEO(SEO_PAGES.blog);
    base44.entities.BlogPost.list('-published_date').
    then((items) => setPosts((items || []).filter((p) => p.published))).
    finally(() => setLoading(false));
  }, []);

  const visible = posts.filter((p) => {
    const matchesAudience = audience === 'all' || p.audience === audience || !p.audience || p.audience === 'oboji';
    const matchesCategory = category === 'all' || p.category === category;
    return matchesAudience && matchesCategory;
  });
  const [featured, ...rest] = visible;

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <div className="text-white mb-4 bg-[hsl(var(--ring))]"><div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Blog MLŽIDLA</p>
          <h1 className="font-heading font-light text-4xl lg:text-6xl text-white tracking-tight mb-4">
            O mlžení do hloubky
          </h1>
          <p className="text-white/70 max-w-xl text-lg">
            Technologie, realizace a zkušenosti z městských prostranství, gastro a hotelových teras, wellness i rezidenčních zahrad.
          </p>
        </motion.div>
      </div></div>

      {/* Audience segmentation */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-4">
        <div className="flex flex-wrap gap-31">
          {AUDIENCE_TABS.map((t) =>
          <button key={t.value} onClick={() => setAudience(t.value)}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${audience === t.value ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
              {t.label}
            </button>
          )}
        </div>
      </div>

      {/* Category filters */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10">
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setCategory('all')}
          className={`px-4 py-2 rounded-full text-xs font-mono tracking-widest uppercase transition-all btn-metallic-mist ${category === 'all' ? 'bg-slate-900 text-white' : 'text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-800'}`}>
            Všechna témata
          </button>
          {Object.entries(CATEGORY_LABELS).map(([v, l]) =>
          <button key={v} onClick={() => setCategory(v)}
          className={`px-4 py-2 rounded-full text-xs font-mono tracking-widest uppercase transition-all ${category === v ? 'bg-slate-900 text-white' : 'text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-800'}`}>
              {l}
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        {category === 'videa' ?
        <BlogVideoShowcase /> :
        loading ?
        <div className="flex justify-center py-20"><Loader size={24} className="animate-spin text-slate-300" /></div> :
        visible.length === 0 ?
        <p className="text-center text-slate-400 py-20 font-mono text-sm">Žádné články v této kategorii.</p> :

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Featured */}
            {featured &&
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-3">
                <Link to={`/blog/${featured.slug || featured.id}`} className="group block rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all bg-white h-full">
                  {featured.image_url &&
              <div className="aspect-[16/9] overflow-hidden">
                      <img src={featured.image_url} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
              }
                  <div className="p-8 flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">{CATEGORY_LABELS[featured.category] || featured.category || 'Článek'}</span>
                      {featured.published_date && <><span className="w-1 h-1 rounded-full bg-slate-200" /><span className="text-xs font-mono text-slate-300">{formatDate(featured.published_date)}</span></>}
                    </div>
                    <h2 className="text-slate-900 tracking-tight mb-3 leading-snug group-hover:text-slate-600 transition-colors text-xl [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-semibold">{featured.title}</h2>
                    <p className="text-slate-500 font-light leading-relaxed text-base">{featured.perex}</p>
                    <div className="flex items-center group-hover:gap-3 transition-all mt-6 gap-2 text-s text-slate-900 font-medium">
                      Číst článek <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              </motion.div>
          }

            {/* Side posts */}
            {rest.length > 0 &&
          <div className="lg:col-span-2 flex flex-col gap-5">
                {rest.slice(0, 3).map((post, i) =>
            <motion.div key={post.id} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                    <Link to={`/blog/${post.slug || post.id}`} className="group flex rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all bg-white h-full">
                      {post.image_url &&
                <div className="w-28 flex-shrink-0 overflow-hidden">
                          <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                }
                      <div className="flex flex-col justify-between flex-1 min-w-0 px-5 py-5">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">{CATEGORY_LABELS[post.category] || post.category || 'Článek'}</span>
                          </div>
                          <h3 className="text-slate-900 leading-snug group-hover:text-slate-600 transition-colors line-clamp-2 text-base [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-medium">{post.title}</h3>
                        </div>
                        {post.published_date && <p className="text-xs font-mono mt-2 text-[hsl(var(--ring))]">{formatDate(post.published_date)}</p>}
                      </div>
                    </Link>
                  </motion.div>
            )}
              </div>
          }
          </div>
        }

        {/* All posts grid if more than 4 */}
        {visible.length > 4 &&
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
            {visible.slice(4).map((post, i) =>
          <motion.div key={post.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Link to={`/blog/${post.slug || post.id}`} className="group block rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all bg-white h-full">
                  {post.image_url &&
              <div className="aspect-[4/3] overflow-hidden">
                      <img src={post.image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
              }
                  <div className="p-6">
                    <span className="text-xs font-mono text-slate-400 tracking-widest uppercase block mb-2">{CATEGORY_LABELS[post.category] || post.category}</span>
                    <h3 className="text-slate-900 leading-snug group-hover:text-slate-600 transition-colors line-clamp-2 mb-2 [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-medium text-xl">{post.title}</h3>
                    {post.published_date && <p className="text-xs font-mono text-[hsl(var(--ring))]">{formatDate(post.published_date)}</p>}
                  </div>
                </Link>
              </motion.div>
          )}
          </div>
        }
      </div>

      <LeadMagnetPopup />
    </div>);

}