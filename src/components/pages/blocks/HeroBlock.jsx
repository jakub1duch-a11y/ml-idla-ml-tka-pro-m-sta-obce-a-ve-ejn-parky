import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function HeroBlock({ data }) {
  const { eyebrow, heading, subheading, image_url, cta_label, cta_link } = data || {};
  return (
    <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden bg-slate-900">
      {image_url && <img src={image_url} alt={heading || ''} className="absolute inset-0 w-full h-full object-cover" />}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-slate-900/20" />
      <div className="relative h-full flex items-end">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 pb-16 w-full">
          {eyebrow && <p className="text-xs font-mono tracking-widest uppercase text-white/70 mb-4">{eyebrow}</p>}
          {heading && <h1 className="font-heading text-4xl lg:text-6xl font-bold text-white tracking-tight mb-4">{heading}</h1>}
          {subheading && <p className="text-white/70 text-lg max-w-2xl leading-relaxed font-light mb-6">{subheading}</p>}
          {cta_label && (
            <Link to={cta_link || '#'} className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-slate-900 text-sm font-bold rounded-full hover:bg-slate-100 transition-all">
              {cta_label} <ArrowRight size={15} />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}