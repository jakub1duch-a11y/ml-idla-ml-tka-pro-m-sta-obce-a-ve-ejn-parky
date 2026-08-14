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
import ArticleProductSlider from '@/components/blog/ArticleProductSlider';
import ArticleLinkMap from '@/components/blog/ArticleLinkMap';

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

function cleanArticleContent(content) {
  if (!content) return '';
  return content
    .replace(/\*{1,3}(?=\S)|(?<=\S)\*{1,3}/g, '')
    .replace(/^\s*[✕✖❌×]\s*/gm, '')
    .replace(/\s+[✕✖❌×]\s*$/gm, '')
    .trim();
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
  const cleanContent = cleanArticleContent(post.content);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero image */}
      {post.image_url && (
        <div className="relative h-[420px] overflow-hidden sm:h-[500px] lg:h-[620px]">
          <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#041c28]/88 via-[#041c28]/50 to-[#041c28]/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-[#041c28]/20" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Meta */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className={post.image_url ? '-mt-28 relative z-10 pb-6 max-w-5xl' : 'pt-24 pb-6 max-w-5xl'}>
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

          <h1 className="font-heading font-normal text-[clamp(2.25rem,5vw,4.5rem)] text-slate-900 tracking-[-.035em] leading-[1.03] mb-5">
            {post.title}
          </h1>
          {post.perex && (
            <p className="max-w-3xl text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed font-normal mb-2 border-l-2 border-secondary pl-5">
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
            className="prose prose-slate max-w-none pb-6 text-[15px] leading-[1.8] sm:text-base lg:text-[17px] lg:grid lg:grid-cols-12 lg:gap-x-10 [&>*]:lg:col-span-8 [&>*]:lg:col-start-3 [&>img]:lg:col-span-10 [&>img]:lg:col-start-2 [&>div]:lg:col-span-8 [&>div]:lg:col-start-3
              prose-headings:font-heading prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-slate-900
              prose-p:text-slate-600 prose-p:font-normal prose-p:leading-[1.75]
              prose-li:text-slate-600 prose-li:font-normal
              prose-strong:text-slate-900 prose-strong:font-medium
              prose-blockquote:border-slate-900 prose-blockquote:bg-slate-50 prose-blockquote:rounded-r-xl prose-blockquote:py-3 prose-blockquote:not-italic prose-blockquote:text-slate-700
              prose-code:text-slate-900 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:rounded
              prose-a:text-slate-900 prose-a:underline hover:prose-a:text-slate-600
              [&_img]:rounded-2xl [&_img]:my-8 [&_img]:w-full [&_img]:max-h-[520px] [&_img]:object-cover [&_img]:border [&_img]:border-slate-200
              [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-heading [&_h2]:font-normal [&_h2]:text-xl [&_h2]:leading-tight sm:[&_h2]:text-2xl lg:[&_h2]:text-[1.75rem]
              [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-heading [&_h3]:font-normal [&_h3]:text-lg [&_h3]:leading-snug sm:[&_h3]:text-xl lg:[&_h3]:text-2xl">
            {/<\/?[a-z][\s\S]*>/i.test(cleanContent) ? (
              <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(cleanContent) }} />
            ) : (
              <ReactMarkdown>{cleanContent}</ReactMarkdown>
            )}
          </motion.div>
        ) : (
          <div className="pb-4 text-slate-400 font-light italic">Obsah článku brzy.</div>
        )}

        <ArticleProductSlider />
        <ArticleLinkMap />

        {/* Fixed safety/standard notice — appears in every article */}
        <ArticleSafetyNotice />

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
                      <img src={r.image_url} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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