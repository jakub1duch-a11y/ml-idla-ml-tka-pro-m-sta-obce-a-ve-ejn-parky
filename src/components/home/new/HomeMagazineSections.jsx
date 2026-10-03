import React, { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock3, Loader, Newspaper, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CATEGORY_LABELS = {
  inspirace: 'Inspirace',
  realizace: 'Realizace',
  technika: 'Technologie',
  novinky: 'Novinky',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('cs-CZ', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function NewsCard({ post, large = false, reduced = false }) {
  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: reduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={large ? 'lg:row-span-2' : ''}
    >
      <Link
        to={`/blog/${post.slug || post.id}`}
        className={`group relative block h-full min-h-[310px] overflow-hidden rounded-[1.75rem] bg-[#07131D] text-white shadow-[0_24px_80px_rgba(7,19,29,.12)] ${large ? 'lg:min-h-[640px]' : 'lg:min-h-[305px]'}`}
      >
        {post.image_url ? (
          <img
            src={post.image_url}
            alt={post.image_alt || post.title}
            loading={large ? 'eager' : 'lazy'}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(34,211,238,.26),transparent_30%),linear-gradient(135deg,#07131D,#0B3F52)]" />
        )}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,19,29,.06)_0%,rgba(7,19,29,.16)_46%,rgba(7,19,29,.92)_100%)]" />
        <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/18 bg-black/24 px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[.16em] text-cyan-100 backdrop-blur-md">
          <Newspaper size={12} />
          Novinka
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 lg:p-7">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[.13em] text-white/52">
            {post.published_date && (
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={11} />
                {formatDate(post.published_date)}
              </span>
            )}
          </div>
          <h3 className={`mt-3 max-w-3xl font-heading font-black leading-[1.02] tracking-[-.04em] ${large ? 'text-3xl sm:text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl'}`}>
            {post.title}
          </h3>
          {post.perex && (
            <p className={`mt-3 max-w-2xl line-clamp-3 leading-6 text-white/68 ${large ? 'text-sm sm:text-base' : 'text-sm'}`}>
              {post.perex}
            </p>
          )}
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white transition-all group-hover:gap-3">
            Zobrazit novinku <ArrowRight size={15} />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

function ArticleCard({ post, reduced = false }) {
  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduced ? 0 : 0.46, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link
        to={`/blog/${post.slug || post.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-[#D9E8EE] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#9ED9F0] hover:shadow-[0_28px_80px_rgba(7,19,29,.11)]"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-[#EAF5F8]">
          {post.image_url ? (
            <img
              src={post.image_url}
              alt={post.image_alt || post.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.045]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_68%_24%,rgba(34,211,238,.24),transparent_34%),linear-gradient(145deg,#EAF7FA,#D7EBF1)]">
              <Sparkles size={30} className="text-[#0B8EC5]" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07131D]/38 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/84 px-3 py-1.5 font-mono text-[8px] font-bold uppercase tracking-[.16em] text-[#0B6B7A] backdrop-blur-md">
            {CATEGORY_LABELS[post.category] || 'Článek'}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.13em] text-[#748693]">
            {post.published_date && <span>{formatDate(post.published_date)}</span>}
          </div>
          <h3 className="mt-3 line-clamp-3 font-heading text-[1.45rem] font-black leading-[1.05] tracking-[-.035em] text-[#07131D] transition group-hover:text-[#0B6B7A]">
            {post.title}
          </h3>
          {post.perex && <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#5A6B78]">{post.perex}</p>}
          <span className="mt-auto inline-flex items-center gap-2 pt-5 text-xs font-extrabold text-[#07131D] transition-all group-hover:gap-3 group-hover:text-[#0B8EC5]">
            Číst článek <ArrowRight size={13} />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

export default function HomeMagazineSections() {
  const reduced = useReducedMotion();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    base44.entities.BlogPost
      .list('-published_date', 40)
      .then((items = []) => {
        if (!active) return;
        setPosts((items || []).filter((post) => post?.published));
      })
      .catch(() => {
        if (active) setPosts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const news = useMemo(
    () => posts.filter((post) => post.category === 'novinky').slice(0, 3),
    [posts],
  );

  const articles = useMemo(
    () => posts.filter((post) => post.category !== 'novinky').slice(0, 6),
    [posts],
  );

  if (loading) {
    return (
      <section className="border-y border-[#DCE9EE] bg-[#F7FBFD] py-16">
        <div className="mx-auto flex max-w-7xl justify-center px-5">
          <Loader size={24} className="animate-spin text-[#0B8EC5]/45" />
        </div>
      </section>
    );
  }

  if (!news.length && !articles.length) return null;

  return (
    <section className="relative overflow-hidden bg-[#F7FBFD]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-cyan-300/16 blur-[110px]" />
        <div className="absolute -right-20 top-[42%] h-96 w-96 rounded-full bg-sky-200/20 blur-[130px]" />
      </div>

      {news.length > 0 && (
        <div className="relative mx-auto max-w-[1500px] px-5 pb-14 pt-16 sm:px-8 lg:px-12 lg:pb-20 lg:pt-24">
          <div className="mb-8 flex flex-col gap-4 sm:mb-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[.22em] text-[#0B8EC5]">Aktuálně z MLŽIDLA.cz</p>
              <h2 className="mt-3 max-w-4xl font-heading text-4xl font-black leading-[.96] tracking-[-.055em] text-[#07131D] sm:text-5xl lg:text-6xl">
                Novinky.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5A6B78] sm:text-base">
                Nové produkty, nástroje, funkce a důležité změny z našeho vývoje a realizací.
              </p>
            </div>
            <Link
              to="/blog?sekce=novinky"
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-[#C8E2EA] bg-white px-5 text-sm font-bold text-[#07131D] transition hover:-translate-y-0.5 hover:border-[#7CCBD8] hover:text-[#0B8EC5]"
            >
              Všechny novinky <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.18fr_.82fr] lg:grid-rows-2">
            {news[0] && <NewsCard post={news[0]} large reduced={reduced} />}
            {news.slice(1).map((post) => <NewsCard key={post.id} post={post} reduced={reduced} />)}
          </div>
        </div>
      )}

      {articles.length > 0 && (
        <div className="relative border-t border-[#DCE9EE] bg-white">
          <div className="mx-auto max-w-[1500px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
            <div className="mb-8 grid gap-5 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[.22em] text-[#0B8EC5]">Magazín / svět mlžení</p>
                <h2 className="mt-3 max-w-4xl font-heading text-4xl font-black leading-[.96] tracking-[-.055em] text-[#07131D] sm:text-5xl lg:text-6xl">
                  Články, nápady a zkušenosti.
                </h2>
              </div>
              <div className="max-w-2xl lg:justify-self-end">
                <p className="text-sm leading-7 text-[#5A6B78] sm:text-base">
                  Technologie, realizace, architektura, provoz a inspirace ze světa vodní mlhy a venkovního ochlazování.
                </p>
                <Link to="/blog" className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-[#07131D] transition hover:gap-3 hover:text-[#0B8EC5]">
                  Otevřít celý magazín <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0">
              {articles.map((post) => (
                <div key={post.id} className="w-[84vw] shrink-0 snap-center sm:w-[58vw] lg:w-auto">
                  <ArticleCard post={post} reduced={reduced} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
