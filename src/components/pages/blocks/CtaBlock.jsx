import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import InlineEditableText from './InlineEditableText';

export default function CtaBlock({ data, editMode = false, onChange }) {
  const { heading, subtext, button_label, button_link } = data || {};
  const change = ({ field, value }) => onChange?.({ ...data, [field]: value });
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-20">
      <div className="p-10 rounded-2xl bg-slate-50 border border-slate-200 text-center">
        {(heading || editMode) && <InlineEditableText as="h3" field="heading" value={heading || 'Klikněte a napište nadpis'} editMode={editMode} onChange={change} className="font-heading text-2xl font-bold text-slate-900 tracking-tight mb-2" />}
        {(subtext || editMode) && <InlineEditableText as="p" field="subtext" value={subtext || 'Klikněte a napište doprovodný text'} editMode={editMode} onChange={change} className="text-slate-500 text-sm mb-6" />}
        {(button_label || editMode) && (
          <Link onClick={(event) => editMode && event.preventDefault()} to={button_link || '/kontakt'} className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all">
            <InlineEditableText field="button_label" value={button_label || 'Text tlačítka'} editMode={editMode} onChange={change} /> <ArrowRight size={15} />
          </Link>
        )}
      </div>
    </section>
  );
}