import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CtaBlock({ data }) {
  const { heading, subtext, button_label, button_link } = data || {};
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
      <div className="p-10 rounded-2xl bg-slate-50 border border-slate-200 text-center">
        {heading && <h3 className="font-heading text-2xl font-bold text-slate-900 tracking-tight mb-2">{heading}</h3>}
        {subtext && <p className="text-slate-500 text-sm mb-6">{subtext}</p>}
        {button_label && (
          <Link to={button_link || '/kontakt'} className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all">
            {button_label} <ArrowRight size={15} />
          </Link>
        )}
      </div>
    </section>
  );
}