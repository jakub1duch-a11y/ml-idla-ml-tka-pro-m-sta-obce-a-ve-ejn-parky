import React from 'react';

export default function TextBlock({ data }) {
  const { heading, body } = data || {};
  return (
    <section className="max-w-3xl mx-auto px-6 lg:px-10 py-16">
      {heading && <h2 className="font-heading text-3xl font-bold text-slate-900 tracking-tight mb-5">{heading}</h2>}
      {body && <p className="text-slate-600 leading-relaxed whitespace-pre-line">{body}</p>}
    </section>
  );
}