import React from 'react';
import InlineEditableText from './InlineEditableText';

export default function ImageGridBlock({ data, editMode = false, onChange }) {
  const { heading, images } = data || {};
  const list = Array.isArray(images) ? images.filter(Boolean) : [];
  const change = ({ field, value }) => onChange?.({ ...data, [field]: value });
  if (list.length === 0 && !editMode) return null;
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
      {(heading || editMode) && <InlineEditableText as="h2" field="heading" value={heading || 'Klikněte a napište nadpis galerie'} editMode={editMode} onChange={change} className="font-heading text-3xl font-bold text-slate-900 tracking-tight mb-8" />}
      {list.length > 0 ? <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {list.map((src, i) => (
          <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-slate-100">
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </div> : <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-400">Přidejte obrázky v nastavení vybraného bloku.</div>}
    </section>
  );
}