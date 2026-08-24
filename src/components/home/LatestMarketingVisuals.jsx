import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function LatestMarketingVisuals() {
  const [visuals, setVisuals] = useState([]);

  useEffect(() => {
    let active = true;

    base44.entities.MediaFile.list('-created_date')
      .then((files = []) => {
        if (!active) return;
        const selected = files
          .filter((file) =>
            file?.media_group === 'GENERAL' &&
            file?.media_role === 'marketing' &&
            /^marketing-Video-/i.test(file?.file_name || '') &&
            String(file?.file_type || '').startsWith('image/') &&
            file?.file_url
          )
          .slice(0, 2);
        setVisuals(selected);
      })
      .catch(() => {
        if (active) setVisuals([]);
      });

    return () => { active = false; };
  }, []);

  if (!visuals.length) return null;

  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mb-7 flex flex-col gap-4 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[.2em] text-teal-700">MLŽIDLA® · aktuálně</p>
            <h2 className="mt-3 max-w-3xl font-heading text-3xl font-medium leading-tight tracking-[-.035em] text-slate-950 sm:text-4xl lg:text-5xl">
              Mlha jako součást městského prostoru.
            </h2>
          </div>
          <Link to="/mlzidla-mlzitka" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-teal-700">
            Prohlédnout produkty <ArrowRight size={16} />
          </Link>
        </div>

        <div className={`grid gap-4 ${visuals.length > 1 ? 'md:grid-cols-2' : ''}`}>
          {visuals.map((visual, index) => (
            <article key={visual.id || visual.file_url} className="group overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
                <img
                  src={visual.file_url}
                  alt={`MLŽIDLA® – městské chlazení ${index + 1}`}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="h-full w-full object-contain transition duration-700 group-hover:scale-[1.015]"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
