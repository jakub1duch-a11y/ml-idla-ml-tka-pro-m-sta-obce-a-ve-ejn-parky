import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader, Clock } from 'lucide-react';
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
  novinky: 'Novinky'
};

const CATEGORY_COLORS = {
  inspirace: 'bg-[#0B6B7A]',
  realizace: 'bg-[#153863]',
  technika: 'bg-[#0e5b67]',
  novinky: 'bg-[#22D3EE] text-[#041c28]',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('cs-CZ', { year: 'numeric', month: 'long', day: 'numeric' });
}

function estimateReadingTime(content) {
  if (!content) return 2;
  const text = content.replace(/<[^>]*>/g, ' ').replace(/[#*_>`-]/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 200));
}

function cleanArticleContent(content) {
  if (!content) return '';
  return content.
  replace(/\*{1,3}(?=\S)|(?<=\S)\*{1,3}/g, '').
  replace(/^\s*[✕✖❌×]\s*/gm, '').
  replace(/\s+[✕✖❌×]\s*$/gm, '').
  trim();
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-[3px] bg-transparent">
      <div
        className="h-full bg-[#22D3EE] transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default function BlogDetail() {
  const { slug } = useParams();
  const reduceMotion = useReducedMotion();
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

      if (!found) {setNotFound(true);return;}

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
    </div>);


  if (notFound || !post) return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-28">
      <div className="text-center">
        <p className="text-slate-400 text-lg mb-4">Článek nenalezen.</p>
        <Link to="/blog" className="text-slate-900 hover:underline">← Zpět na blog</Link>
      </div>
    </div>);


  const ctaLabel = post.cta_label || 'Nezávazná poptávka';
  const ctaLink = post.cta_link || '/poptavka';
  const cleanContent = cleanArticleContent(post.content);
  const readingTime = estimateReadingTime(post.content);
  const hasImage = Boolean(post.image_url);

  return (
    <div className="min-h-screen bg-white">
      <ReadingProgress />

      {/* Hero s overlay nadpisem */}
      {hasImage && (
        <div className="relative h-[460px] overflow-hidden sm:h-[540px] lg:h-[640px]">
          <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#041c28]/95 via-[#041c28]/40 to-[#041c28]/20" />
          <div className="absolute inset-0 flex items-end">
            <div className="mx-auto w-full max-w-7xl px-6 pb-10 sm:pb-14 lg:px-10 lg:pb-16">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.5 }}
                className="max-w-4xl"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase text-white ${CATEGORY_COLORS[post.category] || 'bg-slate-900'}`}>
                    {CATEGORY_LABELS[post.category] || post.category || 'Článek'}
                  </span>
                  {post.published_date && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-white/70">
                      <Clock size={12} /> {formatDate(post.published_date)}
                    </span>
                  )}
                  <span className="text-xs font-mono text-white/50">· {readingTime} min čtení</span>
                </div>
                <h1 className="mt-5 font-heading text-3xl leading-[1.06] tracking-[-0.035em] text-white sm:text-4xl lg:text-[3.25rem]">
                  {post.title}
                </h1>
                {post.perex && (
                  <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/80 sm:text-lg">
                    {post.perex}
                  </p>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Meta bez obrázku */}
        {!hasImage && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-24 pb-6 max-w-5xl"
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase text-white ${CATEGORY_COLORS[post.category] || 'bg-slate-900'}`}>
                {CATEGORY_LABELS[post.category] || post.category || 'Článek'}
              </span>
              {post.published_date && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400">
                  <Clock size={12} /> {formatDate(post.published_date)}
                </span>
              )}
              <span className="text-xs font-mono text-slate-400">· {readingTime} min čtení</span>
              {(post.tags || []).map((t) =>
                <span key={t} className="text-xs font-mono text-slate-400 border border-slate-200 rounded-full px-2.5 py-1">#{t}</span>
              )}
            </div>
            <h1 className="text-slate-900 tracking-[-.035em] leading-[1.03] mb-5 text-3xl sm:text-4xl lg:text-5xl font-heading font-medium">
              {post.title}
            </h1>
            {post.perex && (
              <p className="max-w-3xl text-slate-600 text-base sm:text-lg lg:text-xl leading-relaxed border-l-2 border-secondary pl-5">
                {post.perex}
              </p>
            )}
          </motion.div>
        )}

        {/* Tags pod hero */}
        {hasImage && (post.tags || []).length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-6 pb-2">
            {(post.tags || []).map((t) =>
              <span key={t} className="text-xs font-mono text-slate-400 border border-slate-200 rounded-full px-2.5 py-1">#{t}</span>
            )}
          </div>
        )}

        {/* Share */}
        <div className="pt-4">
          <ShareButtons title={post.title} />
        </div>

        {/* Internal links to configurator / inquiry */}
        <ArticleQuickLinks />

        {/* Content */}
        {post.content ?
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-slate max-w-none pb-6 pt-6 text-[15px] leading-[1.8] sm:text-base lg:text-[17px] lg:grid lg:grid-cols-12 lg:gap-x-10 [&>*]:lg:col-span-8 [&>*]:lg:col-start-3 [&>img]:lg:col-span-10 [&>img]:lg:col-start-2 [&>div]:lg:col-span-8 [&>div]:lg:col-start-3
              prose-headings:font-heading prose-headings:font-normal prose-headings:tracking-tight prose-headings:text-slate-900
              prose-p:text-slate-600 prose-p:font-normal prose-p:leading-[1.75]
              prose-li:text-slate-600 prose-li:font-normal
              prose-strong:text-slate-900 prose-strong:font-medium
              prose-blockquote:border-slate-900 prose-blockquote:bg-slate-50 prose-blockquote:rounded-r-xl prose-blockquote:py-3 prose-blockquote:not-italic prose-blockquote:text-slate-700
              prose-code:text-slate-900 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:rounded
              prose-a:text-slate-900 prose-a:underline hover:prose-a:text-slate-600
              [&_img]:rounded-2xl [&_img]:my-8 [&_img]:w-full [&_img]:max-h-[520px] [&_img]:object-cover [&_img]:border [&_img]:border-slate-200
              [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-heading [&_h2]:font-normal [&_h2]:text-xl [&_h2]:leading-tight sm:[&_h2]:text-2xl lg:[&_h2]:text-[1.75rem]
              [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-heading [&_h3]:font-normal [&_h3]:text-lg [&_h3]:leading-snug sm:[&_h3]:text-xl lg:[&_h3]:text-2xl"
        >
          {/<\/?[a-z][\s\S]*>/i.test(cleanContent) ?
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(cleanContent) }} /> :
            <ReactMarkdown>{cleanContent}</ReactMarkdown>
          }
        </motion.div> :
        <div className="pb-4 text-slate-400 font-light italic">Obsah článku brzy.</div>
        }

        <ArticleProductSlider />
        <ArticleLinkMap />

        {/* Safety notice */}
        <ArticleSafetyNotice />

        {/* Newsletter */}
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
      {related.length > 0 &&
      <div className="bg-slate-50 border-t border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs font-mono tracking-widest uppercase text-[#0B6B7A] mb-2">Mohlo by vás zajímat</p>
                <h2 className="font-heading text-2xl sm:text-3xl text-slate-900 tracking-[-0.02em]">Pokračujte v čtení</h2>
              </div>
              <Link to="/blog" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-[#0B6B7A] transition-colors">
                Celý blog <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((r, i) =>
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: reduceMotion ? 0 : 0.4, delay: i * 0.06 }}
              >
                <Link
                  to={`/blog/${r.slug || r.id}`}
                  className="group block h-full rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all bg-white"
                >
                  {r.image_url &&
                  <div className="aspect-[4/3] overflow-hidden">
                      <img src={r.image_url} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  }
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase text-white ${CATEGORY_COLORS[r.category] || 'bg-slate-900'}`}>
                        {CATEGORY_LABELS[r.category] || r.category}
                      </span>
                    </div>
                    <h3 className="text-slate-900 font-medium text-base leading-snug group-hover:text-slate-600 transition-colors line-clamp-2">{r.title}</h3>
                    {r.perex && <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2">{r.perex}</p>}
                    <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B6B7A] transition-transform group-hover:translate-x-1">
                      Číst <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </motion.div>
              )}
            </div>
          </div>
        </div>
      }

      {/* Instagram follow section */}
      <InstagramFeedSection />

      <LeadMagnetPopup />
    </div>
  );
}