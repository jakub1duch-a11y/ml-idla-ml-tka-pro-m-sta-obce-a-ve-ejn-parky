import { useEffect, useState } from 'react';
import { ArrowRight, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const CATEGORY = { mestsky: 'Veřejný prostor', event: 'Event', soukromy: 'Soukromá zahrada', prumyslovy: 'Areál' };
const FALLBACK = '/media/optimized/518c8c2a3_mlzitka-pro-mesta.webp';

export default function ReferencesStrip() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    base44.entities.Realizace.filter({ published: true }, { sort: '-featured', limit: 6 })
      .then((page) => setItems(page.items || []))
      .catch(() => setItems([]));
  }, []);

  if (items && !items.length) return null;
  const [main, ...rest] = items || [];

  return (
    <section className="border-y border-[#D9E6ED] bg-white py-14 sm:py-20" aria-labelledby="refs-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[.2em] text-[#0B83BC]">Realizace</p>
            <h2 id="refs-title" className="mt-2 max-w-2xl font-heading text-2xl font-semibold tracking-[-.03em] text-[#0A2342] sm:text-3xl">Řešení, která už ochlazují konkrétní místa.</h2>
          </div>
          <Link to="/reference" className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-[#0B5EA8] transition hover:gap-3">Všechny realizace <ArrowRight size={17} /></Link>
        </div>

        {!items ? (
          <div className="mt-8 grid gap-4 lg:grid-cols-2"><div className="aspect-[4/3] animate-pulse rounded-3xl bg-[#EEF5F8]" /><div className="grid grid-cols-2 gap-4">{[0, 1, 2, 3].map((i) => <div key={i} className="aspect-square animate-pulse rounded-2xl bg-[#EEF5F8]" />)}</div></div>
        ) : (
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <RefCard item={main} large />
            <div className="grid grid-cols-2 gap-4">{rest.slice(0, 4).map((r) => <RefCard key={r.id} item={r} />)}</div>
          </div>
        )}
      </div>
    </section>
  );
}

function RefCard({ item, large }) {
  return (
    <Link to={`/reference/${item.id}`} className={`group relative block overflow-hidden rounded-3xl bg-[#0A2342] ${large ? 'aspect-[4/3]' : 'aspect-square'}`}>
      <img src={item.image_url || FALLBACK} alt={item.name} loading="lazy" decoding="async" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = FALLBACK; }} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07131D]/90 via-[#07131D]/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-white">
        {item.category && <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.12em] backdrop-blur">{CATEGORY[item.category]}</span>}
        <h3 className={`mt-2 font-heading font-bold leading-tight ${large ? 'text-2xl sm:text-3xl' : 'text-sm sm:text-base line-clamp-2'}`}>{item.name}</h3>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/75">
          {item.location && <span className="inline-flex items-center gap-1"><MapPin size={12} />{item.location}</span>}
          {large && item.year && <span className="inline-flex items-center gap-1"><Calendar size={12} />{item.year}</span>}
          {large && item.product_used && <span>{item.product_used}</span>}
        </div>
        {large && <span className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.14em] text-[#26C6E9] transition group-hover:translate-x-1">Detail realizace <ArrowRight size={14} /></span>}
      </div>
    </Link>
  );
}