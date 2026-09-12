import React from 'react';
import InlineEditableText from './InlineEditableText';

export default function TextBlock({ data, editMode = false, onChange }) {
  const { heading, body } = data || {};
  const change = ({ field, value }) => onChange?.({ ...data, [field]: value });
  return (
    <section className="max-w-3xl mx-auto px-6 lg:px-10 py-16">
      {(heading || editMode) && <InlineEditableText as="h2" field="heading" value={heading || 'Klikněte a napište nadpis'} editMode={editMode} onChange={change} className="font-heading text-3xl font-bold text-slate-900 tracking-tight mb-5" />}
      {(body || editMode) && <InlineEditableText as="p" field="body" value={body || 'Klikněte a napište text'} editMode={editMode} onChange={change} className="text-slate-600 leading-relaxed whitespace-pre-line" />}
    </section>
  );
}