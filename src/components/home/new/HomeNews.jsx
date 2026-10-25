import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// Novinky a poslední články z blogu na konci homepage.
export default function HomeNews() {
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    base44.entities.BlogPost.filter({ published: true }, { sort: '-published_date', limit: 3 })
      .then((page) => setPosts(page.items || page))
      .catch(() => setPosts([]));
  }, []);
  if (posts && !posts.length) return null;

  return (
    <section className="bg-[#F5FAFD] px-5 py-16 sm:px-8 lg:px-20" aria-labelledby="home-news">
      <div className="mx-auto max-w-[1540px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[.2em] text-[#0B97E8]">Novinky</p>
            <h2 id="home-news" className="mt-2 font-heading text-3xl font-bold text-[#0A2342] sm:text-4xl">Poslední články</h2>
          </div>
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-[#0A2342] hover:text-[#0B97E8]">Všechny články <ArrowRight size={16} /></Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {(posts || [0, 1, 2]).map((p, i) => p?.id ? (
            <Link key={p.id} to={`/blog/${p.slug}`} className="group overflow-hidden rounded-3xl border border-[#D8E8F0] bg-white transition hover:-translate-y-1 hover:shadow-xl">
              <div className="aspect-[16/10] overflow-hidden bg-[#EAF6FC]">
                {p.image_url && <img src={p.image_url} alt={p.image_alt || p.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
              </div>
              <div className="p-5">
                {p.published_date && <p className="text-xs font-semibold text-[#0D2F4F]/50">{new Date(p.published_date).toLocaleDateString('cs-CZ')}</p>}
                <h3 className="mt-1 font-heading text-lg font-bold text-[#0A2342] line-clamp-2">{p.title}</h3>
                {p.perex && <p className="mt-2 text-sm text-[#0D2F4F]/70 line-clamp-3">{p.perex}</p>}
              </div>
            </Link>
          ) : <div key={i} className="h-80 animate-pulse rounded-3xl bg-white" />)}
        </div>
      </div>
    </section>
  );
}