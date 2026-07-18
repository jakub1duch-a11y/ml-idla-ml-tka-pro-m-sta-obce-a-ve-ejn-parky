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
import ShareButtons from '@/components/blog/ShareButtons';
import BlogCommentsSection from '@/components/blog/BlogCommentsSection';
import BlogNewsletterInline from '@/components/blog/BlogNewsletterInline';
import InstagramFeedSection from '@/components/home/InstagramFeedSection';
import LeadMagnetPopup from '@/components/blog/LeadMagnetPopup';
import RelatedProductsSection from '@/components/common/RelatedProductsSection';

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
    <div className="min-h-screen bg-white flex items-center justify-center pt-28">
      <Loader size={28} className="animate-spin text-slate-300" />
    </div>
  );

  if (notFound || !post) return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-28">
      <div className="text-center">
        <p className="text-slate-400 text-lg mb-4">Článek nenalezen.</p>
        <Link to="/blog" className="text-slate-900 hover:underline">← Zpět na blog</Link>
      </div>
    </div>
  );

  const ctaLabel = post.cta_label || 'Nezávazná poptávka';
  const ctaLink = post.cta_link || '/poptavka';

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero image */}
      {post.image_url && (
        <div className="relative h-72 lg:h-[460px] overflow-hidden">
          <img src={post.image_url} alt={post.image_alt || post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-black/10" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        {/* Meta */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className={post.image_url ? '-mt-20 relative z-10 pb-4' : 'pt-8 pb-4'}>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1.5 bg-slate-900 text-white rounded-full text-xs font-mono tracking-widest uppercase">
              {CATEGORY_LABELS[post.category] || post.category || 'Článek'}
            </span>
            {post.published_date && (
              <span className="text-xs font-mono text-slate-400">{formatDate(post.published_date)}</span>
            )}
            {(post.tags || []).map((t) => (
              <span key={t} className="text-xs font-mono text-slate-400 border border-slate-200 rounded-full px-2.5 py-1">#{t}</span>
            ))}
          </div>

          <h1 className="font-heading font-light text-3xl lg:text-5xl text-slate-900 tracking-tight leading-tight mb-4">
            {post.title}
          </h1>
          {post.perex && (
            <p className="text-slate-500 text-lg leading-relaxed font-light mb-2 border-l-2 border-slate-300 pl-5">
              {post.perex}
            </p>
          )}
        </motion.div>

        {/* Share */}
        <ShareButtons title={post.title} />

        {/* Internal links to configurator / inquiry — placed right after the intro */}
        <ArticleQuickLinks />

        {/* Content — supports technical images, expert quotes (blockquote), paragraphs */}
        {post.content ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="prose prose-lg max-w-none pb-4
              prose-headings:font-heading prose-headings:font-light prose-headings:tracking-tight prose-headings:text-slate-900 prose-headings:mt-12 prose-headings:mb-5
              prose-p:text-slate-600 prose-p:font-light prose-p:leading-[1.9] prose-p:mb-6 prose-p:text-[1.05rem]
              prose-li:text-slate-600 prose-li:font-light prose-li:leading-[1.8] prose-li:mb-2
              prose-ul:my-6 prose-ol:my-6
              prose-strong:text-slate-900 prose-strong:font-medium
              prose-blockquote:border-slate-900 prose-blockquote:bg-slate-50 prose-blockquote:rounded-r-xl prose-blockquote:py-3 prose-blockquote:not-italic prose-blockquote:text-slate-700
              prose-code:text-slate-900 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:rounded
              prose-a:text-slate-900 prose-a:underline hover:prose-a:text-slate-600
              [&_img]:rounded-2xl [&_img]:my-8 [&_img]:w-full [&_img]:object-cover [&_img]:border [&_img]:border-slate-200 [&_h2]:mt-10 [&_h3]:mt-8">
            {/<\/?[a-z][\s\S]*>/i.test(post.content) ? (
              <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }} />
            ) : (
              <ReactMarkdown>{post.content}</ReactMarkdown>
            )}
          </motion.div>
        ) : (
          <div className="pb-4 text-slate-400 font-light italic">Obsah článku brzy.</div>
        )}

        {(post.gallery_urls || []).length > 0 && <section className="mt-12 border-y border-slate-200 py-10"><p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">Fotogalerie</p><div className="mt-5 grid grid-cols-2 gap-3"><img src={post.gallery_urls[0]} alt={`${post.title} – fotografie realizace 1`} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />{post.gallery_urls[1] && <img src={post.gallery_urls[1]} alt={`${post.title} – fotografie realizace 2`} loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />}</div></section>}

        {/* Fixed safety/standard notice — appears in every article */}
        <ArticleSafetyNotice />

        <RelatedProductsSection />

        {/* Newsletter + follow us */}
        <BlogNewsletterInline />

        {/* Back + sales CTA */}
        <div className="py-10 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-900 transition-colors font-mono">
            <ArrowLeft size={14} /> Zpět na blog
          </Link>
          <Link to={ctaLink} className="btn-metallic-mist px-6 py-3 text-sm font-bold">
            {ctaLabel} <ArrowRight size={14} />
          </Link>
        </div>

        {/* Comments */}
        <BlogCommentsSection postId={post.id} />
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-6">Mohlo by vás zajímat</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link key={r.id} to={`/blog/${r.slug || r.id}`}
                  className="group block rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all bg-white">
                  {r.image_url && (
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={r.image_url} alt={r.image_alt || r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-5">
                    <span className="text-xs font-mono text-slate-400 tracking-widest uppercase block mb-2">{CATEGORY_LABELS[r.category] || r.category}</span>
                    <h3 className="text-slate-900 font-light text-sm leading-snug group-hover:text-slate-600 transition-colors line-clamp-2">{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instagram follow section */}
      <InstagramFeedSection />

      <LeadMagnetPopup />
    </div>
  );
}