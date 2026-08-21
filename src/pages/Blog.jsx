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
      <section className="relative mb-8 min-h-[430px] overflow-hidden bg-primary text-white lg:min-h-[500px]">
        <img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/ccf06b29a_mlzidla-mlzitka-pro-mesta-obce.webp" alt="Mlžítka MLŽIDLA® ve veřejném prostoru" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#041c28]/95 via-[#041c28]/76 to-[#041c28]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#041c28]/55 via-transparent to-[#041c28]/15" />
        <div className="relative mx-auto flex min-h-[430px] max-w-7xl items-center px-6 py-20 lg:min-h-[500px] lg:px-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <p className="font-mono text-[11px] uppercase tracking-[.2em] text-cyan-300">Blog & novinky · MLŽIDLA®</p>
            <h1 className="mt-4 font-heading text-4xl leading-[1.03] tracking-[-.03em] text-white sm:text-5xl lg:text-7xl">Inspirace, realizace a technologie mlžení.</h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-white/75 sm:text-lg">Praktické zkušenosti z reálných instalací, nové produkty, technické principy a inspirace pro města, architekty, veřejný prostor i soukromé zahrady. Vše na jednom místě — od návrhu až po provoz.</p>
          </motion.div>
        </div>
      </section>

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
                      {featured.published_date && <><span className="w-1 h-1 rounded-full bg-slate-200" /><span className="font-mono text-[hsl(var(--ring))] text-sm">{formatDate(featured.published_date)}</span></>}
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