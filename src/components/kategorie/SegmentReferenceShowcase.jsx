import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { trackFunnelStep } from '@/lib/ga4';

/**
 * Conversion-oriented reference block for segment landing pages.
 * References are loaded from the Realizace entity so the page always uses the
 * same published case-study data as the main Reference section.
 */
export default function SegmentReferenceShowcase({
  segment,
  title,
  eyebrow = 'Vybrané realizace',
  referenceIds = [],
  ctaLabel = 'Všechny reference',
}) {
  const [references, setReferences] = useState([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all(referenceIds.map((id) => base44.entities.Realizace.get(id).catch(() => null)))
      .then((items) => {
        if (!cancelled) setReferences(items.filter((item) => item?.published !== false));
      });
    return () => { cancelled = true; };
  }, [referenceIds.join('|')]);

  if (!references.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20" data-analytics-section={`${segment}-references`}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between mb-10">
        <div>
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">{eyebrow}</p>
          <h2 className="text-slate-900 text-3xl lg:text-4xl max-w-3xl" style={{ fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.05 }}>
            {title}
          </h2>
        </div>
        <Link
          to="/reference"
          onClick={() => trackFunnelStep(segment, 'references_all_click', 'reference')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors"
        >
          {ctaLabel} <ArrowRight size={15} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {references.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
            className={index === 0 ? 'lg:col-span-2' : ''}
          >
            <Link
              to={`/reference/${item.id}`}
              onClick={() => trackFunnelStep(segment, 'reference_open', item.name)}
              className="group block h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:border-slate-300 transition-all"
            >
              <div className={index === 0 ? 'aspect-[16/9] overflow-hidden bg-slate-100' : 'aspect-[4/3] overflow-hidden bg-slate-100'}>
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={`${item.name}${item.location ? ` — ${item.location}` : ''}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : null}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-3">
                  <MapPin size={12} /> {item.location || item.client || 'Realizace'}
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                    {item.product_used ? <p className="mt-1 text-sm text-slate-500">{item.product_used}</p> : null}
                  </div>
                  <ArrowRight size={17} className="mt-1 shrink-0 text-slate-300 transition-colors group-hover:text-slate-900" />
                </div>
                {index === 0 && item.description ? (
                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-500 font-light">
                    {item.description.replace(/\s+/g, ' ').trim()}
                  </p>
                ) : null}
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
