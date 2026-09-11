import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader, PlayCircle } from 'lucide-react';
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
            <p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#0B5EA8]">Reference a realizace</p>
            <h2 className="mt-4 max-w-3xl font-heading text-3xl leading-tight tracking-[-.035em] text-[#0D2F4F] lg:text-4xl">
              Skutečné projekty místo katalogových slibů.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#0D2F4F]/60">
              Fotografie a video z hotových realizací pomáhají rychle posoudit měřítko, charakter produktu i jeho zapojení do veřejného prostoru.
            </p>
          </div>
          <Link to="/reference" className="inline-flex items-center gap-2 font-heading text-sm font-semibold text-[#0B5EA8] transition-colors hover:text-[#0D2F4F]">
            Všechny realizace <ArrowRight size={15} />
          </Link>
        </div>

        <div className="mt-12 overflow-hidden rounded-[2rem] bg-[#0b2d38]">
          <div className="grid lg:grid-cols-[1.35fr_.65fr]">
            <div className="relative min-h-[300px] overflow-hidden sm:min-h-[420px]">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={VIDEO_ASSETS.realizaceKlip.src}
                poster={VIDEO_ASSETS.realizaceKlip.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Video sestřih realizací MLŽIDLA"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071f28]/60 via-transparent to-transparent" />
              <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3 py-2 text-xs font-medium text-white backdrop-blur-md">
                <PlayCircle size={16} /> Sestřih realizací
              </span>
            </div>
            <div className="flex flex-col justify-center p-7 text-white sm:p-10">
              <p className="font-mono text-[10px] uppercase tracking-[.2em] text-[#9ce5ec]">Video reference</p>
              <h3 className="mt-3 font-heading text-3xl font-medium leading-tight">Jak MLŽIDLA vypadají v prostoru.</h3>
              <p className="mt-4 text-sm leading-7 text-white/65">
                U návrhu řešíme produkt, jeho měřítko, polohu, přívod vody i způsob řízení jako jeden celek.
              </p>
              <Link to="/reference" className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0b2d38] transition hover:bg-[#dff4f7]">
                Prohlédnout reference <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader className="animate-spin text-[#0B5EA8]/40" size={28} /></div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {refs.map((r) => {
              const isJicin = r.id === '6a71d1ff57598752eed27bfb';
              const img = isJicin ? VIDEO_ASSETS.heroJicin.poster : r.image_url;
              return (
                <Link key={r.id} to={`/reference/${r.id}`} className="group block overflow-hidden rounded-2xl border border-[#EAF5FB] bg-white transition-all hover:-translate-y-1 hover:border-[#0B5EA8]/25 hover:shadow-[0_18px_45px_rgba(11,45,56,.08)]">
                  <div className="aspect-[4/3] overflow-hidden bg-[#EAF5FB]">
                    {img ? (
                      <img src={img} alt={r.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#0D2F4F]/20"><span className="font-mono text-xs uppercase">MLŽIDLA</span></div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading text-lg font-semibold text-[#0D2F4F]">{r.name}</h3>
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#0D2F4F]/55">
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
