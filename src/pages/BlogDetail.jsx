import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { base44 } from '@/api/base44Client';
import { setSEO, getBlogPostSEO } from '@/lib/seo';
import { trackBlogPostView } from '@/lib/ga4';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import ArticleQuickLinks from '@/components/blog/ArticleQuickLinks';
import ArticleSafetyNotice from '@/components/blog/ArticleSafetyNotice';
import LeadMagnetPopup from '@/components/blog/LeadMagnetPopup';

const CATEGORY_LABELS = {
  inspirace: 'Inspirace',
  realizace: 'Realizace',
  technika: 'Technologie',
  novinky: 'Novinky',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('cs-CZ', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    const tryLoad = async () => {
      const all = await base44.entities.BlogPost.list().catch(() => []);
      const found = (all || []).find((p) => p.slug === slug || p.id === slug);

      if (!found) { setNotFound(true); return; }

      setPost(found);
      trackBlogPostView(found.title, found.slug || found.id, found.category);
      setSEO(getBlogPostSEO(found));

      const rel = (all || []).filter((p) => p.published && p.category === found.category && p.id !== found.id).slice(0, 3);
      setRelated(rel);
    };

    tryLoad().catch(() => setNotFound(true)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-ink flex items-center justify-center pt-28">
      <Loader size={28} className="animate-spin text-cyan/40" />
    </div>
  );

  if (notFound || !post) return (
    <div className="min-h-screen bg-ink flex items-center justify-center pt-28">
      <div className="text-center">
        <p className="text-white/40 text-lg mb-4">Článek nenalezen.</p>
        <Link to="/blog" className="text-cyan hover:underline">← Zpět na blog</Link>
      </div>
    </div>
  );

  const ctaLabel = post.cta_label || 'Nezávazná poptávka';
  const ctaLink = post.cta_link || '/poptavka';

  return (
    <div className="min-h-screen bg-ink pt-24">
      {/* Hero image */}
      {post.image_url && (
        <div className="relative h-72 lg:h-[460px] overflow-hidden">
          <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Meta */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="-mt-20 relative z-10 pb-4">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1.5 bg-cyan/20 border border-cyan/30 rounded-full text-xs font-mono text-cyan tracking-widest uppercase">
              {CATEGORY_LABELS[post.category] || post.category || 'Článek'}
            </span>
            {post.published_date && (
              <span className="text-xs font-mono text-white/40">{formatDate(post.published_date)}</span>
            )}
            {(post.tags || []).map((t) => (
              <span key={t} className="text-xs font-mono text-white/25 border border-white/10 rounded-full px-2.5 py-1">#{t}</span>
            ))}
          </div>

          <h1 className="font-heading font-light text-3xl lg:text-5xl text-white tracking-tight leading-tight mb-4">
            {post.title}
          </h1>
          {post.perex && (
            <p className="text-white/55 text-lg leading-relaxed font-light mb-2 border-l-2 border-cyan/40 pl-5">
              {post.perex}
            </p>
          )}
        </motion.div>

        {/* Internal links to configurator / inquiry — placed right after the intro */}
        <ArticleQuickLinks />

        {/* Content */}
        {post.content ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="prose prose-invert prose-lg max-w-none pb-4
              prose-headings:font-light prose-headings:tracking-tight prose-headings:text-white
              prose-p:text-white/60 prose-p:font-light prose-p:leading-relaxed
              prose-li:text-white/60 prose-li:font-light
              prose-strong:text-white prose-strong:font-medium
              prose-blockquote:border-cyan/40 prose-blockquote:text-white/40 prose-blockquote:italic
              prose-code:text-cyan prose-code:bg-white/5 prose-code:px-1.5 prose-code:rounded
              prose-a:text-cyan prose-a:no-underline hover:prose-a:underline
              [&_img]:rounded-2xl [&_img]:my-8 [&_img]:w-full [&_img]:object-cover [&_h2]:mt-10 [&_h3]:mt-8">
            {/<\/?[a-z][\s\S]*>/i.test(post.content) ? (
              <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />
            ) : (
              <ReactMarkdown>{post.content}</ReactMarkdown>
            )}
          </motion.div>
        ) : (
          <div className="pb-4 text-white/40 font-light italic">Obsah článku brzy.</div>
        )}

        {/* Fixed safety/standard notice — appears in every article */}
        <ArticleSafetyNotice />

        {/* Back + sales CTA */}
        <div className="py-10 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors font-mono">
            <ArrowLeft size={14} /> Zpět na blog
          </Link>
          <Link to={ctaLink}
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/20">
            {ctaLabel} <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="bg-surface border-t border-white/8 py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <p className="text-xs font-mono tracking-widest uppercase text-white/30 mb-6">Mohlo by vás zajímat</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link key={r.id} to={`/blog/${r.slug || r.id}`}
                  className="group block rounded-2xl overflow-hidden border border-white/10 hover:border-cyan/30 transition-all bg-card_bg">
                  {r.image_url && (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={r.image_url} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-5">
                    <span className="text-xs font-mono text-cyan tracking-widest uppercase block mb-2">{CATEGORY_LABELS[r.category] || r.category}</span>
                    <h3 className="text-white font-light text-sm leading-snug group-hover:text-cyan/90 transition-colors line-clamp-2">{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <LeadMagnetPopup />
    </div>
  );
}