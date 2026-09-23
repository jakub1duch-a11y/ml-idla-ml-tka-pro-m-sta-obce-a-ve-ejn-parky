import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock3, Eye, Loader, PlayCircle, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { setSEO } from '@/lib/seo';
import LeadMagnetPopup from '@/components/blog/LeadMagnetPopup';
import BlogVideoShowcase from '@/components/blog/BlogVideoShowcase';
import BlogMagazinePortals from '@/components/blog/BlogMagazinePortals';
import BlogVisualInspiration from '@/components/blog/BlogVisualInspiration';
import BlogSocialSection from '@/components/blog/BlogSocialSection';

const CATEGORY_LABELS = {
  inspirace: 'Inspirace',
  realizace: 'Realizace',
  technika: 'Technologie',
  novinky: 'Novinky',
};

const CATEGORY_FILTERS = [
  ['all', 'Vše'],
  ['novinky', 'Novinky'],
  ['realizace', 'Realizace'],
  ['inspirace', 'Inspirace'],
  ['technika', 'Technologie'],
  ['videa', 'Video'],
];

const TOPIC_FILTERS = [
  ['all', 'Všechna témata'],
  ['mesta', 'Města a obce'],
  ['sport', 'Sportoviště'],
  ['skoly', 'Školy a školky'],
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('cs-CZ', { year: 'numeric', month: 'short', day: 'numeric' });
}

function matchesTopic(post, topic) {
  if (!topic || topic === 'all') return true;
  const haystack = [
    post?.title,
    post?.perex,
    post?.content,
    post?.location_context,
    ...(post?.tags || []),
    ...(post?.related_product_slugs || []),
  ].filter(Boolean).join(' ').toLowerCase();

  if (topic === 'mesta') return /měst|mesto|město|obec|náměst|park|promenád|veřejn/.test(haystack);
  if (topic === 'sport') return /sport|stadion|hřišt|koupališt|areál/.test(haystack);
  if (topic === 'skoly') return /škol|skol|školk|skolk|dětsk|detsk|hřišt|hrist/.test(haystack);
  return true;
}

function ArticleCard({ post, views = 0, large = false }) {
  return (
    <Link to={`/blog/${post.slug || post.id}`} className="group block h-full overflow-hidden rounded-[24px] border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-xl">
      <div className={`overflow-hidden bg-slate-100 ${large ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
        {post.image_url ? (
          <img src={post.image_url} alt={post.image_alt || post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" loading={large ? 'eager' : 'lazy'} />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#EAF3F5] text-[#0B6B7A]"><Sparkles size={28}/></div>
        )}
      </div>
      <div className={large ? 'p-7 sm:p-8' : 'p-5'}>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[.13em] text-slate-400">
          <span className="text-[#0B6B7A]">{CATEGORY_LABELS[post.category] || post.category || 'Magazín'}</span>
          {post.published_date && <><span>·</span><span>{formatDate(post.published_date)}</span></>}
          {views > 0 && <><span>·</span><span className="inline-flex items-center gap-1"><Eye size={10}/>{views.toLocaleString('cs-CZ')}</span></>}
        </div>
        <h3 className={`mt-3 font-heading leading-[1.08] tracking-[-.025em] text-[#0A1628] transition group-hover:text-[#0B6B7A] ${large ? 'text-3xl sm:text-4xl' : 'text-xl'}`}>{post.title}</h3>
        {post.perex && <p className={`mt-3 line-clamp-3 leading-6 text-slate-500 ${large ? 'text-base' : 'text-sm'}`}>{post.perex}</p>}
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-slate-900">Číst článek <ArrowRight size={13}/></span>
      </div>
    </Link>
  );
}

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('sekce') || 'all';
  const topic = searchParams.get('tema') || 'all';
  const [posts, setPosts] = useState([]);
  const [viewCounts, setViewCounts] = useState({});
  const [visuals, setVisuals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSEO({
      title: 'Magazín MLŽIDLA® | Novinky, realizace a inspirace',
      description: 'Magazín o mlžítkách: nové produkty, realizované projekty, inspirace pro města, sportoviště, školy, školky, video a návrhové vizualizace.',
      canonicalPath: '/blog',
      robots: 'index, follow',
    });

    Promise.all([
      base44.entities.BlogPost.list('-published_date'),
      base44.entities.BlogPostView.list('-viewed_date', 5000).catch(() => []),
      base44.entities.MediaFile.list('-created_date', 500).catch(() => []),
    ]).then(([items, views, media]) => {
      setPosts((items || []).filter((p) => p.published));
      setViewCounts((views || []).reduce((map, view) => {
        if (view?.post_id) map[view.post_id] = (map[view.post_id] || 0) + 1;
        return map;
      }, {}));
      setVisuals((media || []).filter((m) => ['render', 'marketing', 'visualization'].includes(m.media_role)).slice(0, 12).map((m) => ({
        id: m.id,
        image_url: m.file_url,
        title: m.file_name,
        product_slug: m.product_slug,
        product_name: m.media_group,
        configuration: 'návrhová inspirace',
        environment: 'MLŽIDLA®',
      })));
    }).finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => posts.filter((post) => {
    const categoryOk = category === 'all' || category === 'videa' || post.category === category;
    return categoryOk && matchesTopic(post, topic);
  }), [posts, category, topic]);

  const latest = posts[0];
  const featured = visible[0];
  const rest = visible.slice(1);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FCFDFD] pt-[68px]">
      <section className="border-b border-slate-200 bg-[#F4F7F8]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-7 lg:grid-cols-[.72fr_1.28fr] lg:px-10 lg:py-14">
          <div className="flex flex-col justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.22em] text-[#0B6B7A]">MLŽIDLA® MAGAZÍN</p>
              <h1 className="mt-4 max-w-2xl font-heading text-5xl leading-[.95] tracking-[-.05em] text-[#081827] sm:text-6xl lg:text-7xl">Místa, kde se lépe dýchá.</h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-550">Novinky ze světa mlžítek, skutečné realizace, návrhová inspirace a praktické články pro města, architekty, sportoviště, školy i veřejný prostor.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <Link to="/blog?sekce=realizace" className="rounded-full bg-[#071A2F] px-5 py-3 text-xs font-semibold text-white">Realizované projekty</Link>
              <Link to="/blog?sekce=videa" className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-xs font-semibold text-slate-700"><PlayCircle size={14}/> Video magazín</Link>
            </div>
          </div>

          {latest && (
            <Link to={`/blog/${latest.slug || latest.id}`} className="group relative min-h-[410px] overflow-hidden rounded-[30px] bg-[#071A2F] text-white lg:min-h-[520px]">
              {latest.image_url && <img src={latest.image_url} alt={latest.image_alt || latest.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"/>}
              <div className="absolute inset-0 bg-gradient-to-t from-[#04131f]/95 via-[#071A2F]/24 to-black/5"/>
              <div className="relative flex min-h-[410px] flex-col justify-between p-6 sm:p-8 lg:min-h-[520px]">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-white/20 bg-black/15 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.16em] backdrop-blur">Nové v magazínu</span>
                  {latest.published_date && <span className="inline-flex items-center gap-1.5 text-xs text-white/65"><Clock3 size={12}/>{formatDate(latest.published_date)}</span>}
                </div>
                <div className="max-w-3xl">
                  <p className="font-mono text-[10px] uppercase tracking-[.16em] text-cyan-200">{CATEGORY_LABELS[latest.category] || latest.category}</p>
                  <h2 className="mt-3 font-heading text-3xl leading-[1.03] tracking-[-.035em] sm:text-4xl lg:text-5xl">{latest.title}</h2>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-white/68 sm:text-base">{latest.perex}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">Číst příběh <ArrowRight size={15}/></span>
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      <BlogMagazinePortals />

      <section className="sticky top-[68px] z-30 border-y border-slate-200 bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-3 sm:px-7 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORY_FILTERS.map(([value, label]) => (
              <button key={value} onClick={() => updateFilter('sekce', value)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${category === value ? 'bg-[#071A2F] text-white' : 'border border-slate-200 bg-white text-slate-500 hover:border-cyan-300 hover:text-[#0B6B7A]'}`}>{label}</button>
            ))}
          </div>
          <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TOPIC_FILTERS.map(([value, label]) => (
              <button key={value} onClick={() => updateFilter('tema', value)} className={`shrink-0 rounded-full px-3.5 py-2 font-mono text-[9px] uppercase tracking-[.1em] transition ${topic === value ? 'bg-cyan-50 text-[#0B6B7A] ring-1 ring-cyan-200' : 'text-slate-400 hover:text-slate-700'}`}>{label}</button>
            ))}
          </div>
        </div>
      </section>

      {category === 'videa' ? (
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-7 lg:px-10"><BlogVideoShowcase /></div>
      ) : loading ? (
        <div className="flex justify-center py-24"><Loader size={26} className="animate-spin text-slate-300"/></div>
      ) : (
        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-7 lg:px-10">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#0B6B7A]">Výběr redakce</p>
              <h2 className="mt-2 font-heading text-3xl tracking-[-.035em] text-[#0A1628] sm:text-4xl">{category === 'all' ? 'Nejnovější z magazínu.' : CATEGORY_LABELS[category] || 'Magazín'}</h2>
            </div>
            <span className="hidden font-mono text-[10px] uppercase tracking-[.13em] text-slate-400 sm:block">{visible.length} článků</span>
          </div>

          {visible.length === 0 ? <p className="rounded-2xl border border-dashed border-slate-200 py-16 text-center text-sm text-slate-400">Pro tuto kombinaci zatím není publikovaný článek.</p> : (
            <>
              <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
                {featured && <motion.div initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}}><ArticleCard post={featured} views={viewCounts[featured.id] || 0} large/></motion.div>}
                <div className="grid gap-5">
                  {rest.slice(0,2).map((post) => <ArticleCard key={post.id} post={post} views={viewCounts[post.id] || 0}/>)}
                </div>
              </div>
              {rest.length > 2 && <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{rest.slice(2).map((post) => <ArticleCard key={post.id} post={post} views={viewCounts[post.id] || 0}/>)}</div>}
            </>
          )}
        </section>
      )}

      <BlogVisualInspiration items={visuals} />

      {category !== 'videa' && (
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-7 lg:px-10">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#0B6B7A]">Video magazín</p><h2 className="mt-2 font-heading text-3xl tracking-[-.035em] text-[#0A1628] sm:text-4xl">Mlžítka v pohybu.</h2></div>
            <Link to="/blog?sekce=videa" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B6B7A]">Všechna videa <ArrowRight size={14}/></Link>
          </div>
          <BlogVideoShowcase limit={6} />
        </section>
      )}

      <BlogSocialSection />
      <LeadMagnetPopup />
    </div>
  );
}
