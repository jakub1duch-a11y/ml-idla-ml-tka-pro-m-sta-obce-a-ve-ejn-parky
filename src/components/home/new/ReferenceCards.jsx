import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { VIDEO_ASSETS } from '@/lib/newMedia';

export default function ReferenceCards() {
  const [refs, setRefs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Realizace.filter({ published: true, featured: true, category: 'mestsky' }, '-year', 6)
      .then((items) => setRefs(items || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-[.18em] uppercase text-[#0B5EA8]">Reference</p>
            <h2 className="mt-4 font-heading text-3xl leading-tight text-[#0D2F4F] lg:text-4xl">
              Realizace, které prověřuje každodenní provoz.
            </h2>
          </div>
          <Link
            to="/reference"
            className="inline-flex items-center gap-2 font-heading text-sm font-semibold text-[#0B5EA8] transition-colors hover:text-[#0D2F4F]"
          >
            Všechny realizace <span aria-hidden="true">→</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader className="animate-spin text-[#0B5EA8]/40" size={28} /></div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {refs.map((r) => {
              const isJicin = r.id === '6a71d1ff57598752eed27bfb';
              const img = isJicin ? VIDEO_ASSETS.heroJicin.poster : r.image_url;
              return (
                <Link
                  key={r.id}
                  to={`/reference/${r.id}`}
                  className="group block overflow-hidden border border-[#EAF5FB] bg-white transition-all hover:border-[#0B5EA8]/30"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-[#EAF5FB]">
                    {img ? (
                      <img
                        src={img}
                        alt={r.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#0D2F4F]/20">
                        <span className="font-mono text-xs uppercase">MLŽIDLA</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-lg font-semibold text-[#0D2F4F]">{r.name}</h3>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#0D2F4F]/55">
                      {r.client && <span>{r.client}</span>}
                      {r.location && <span>· {r.location}</span>}
                      {r.product_used && <span>· {r.product_used}</span>}
                      {r.year && <span>· {r.year}</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}