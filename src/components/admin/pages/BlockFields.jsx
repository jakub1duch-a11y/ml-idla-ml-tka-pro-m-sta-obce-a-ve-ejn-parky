import React from 'react';

const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-slate-900";

export default function BlockFields({ type, data, onChange }) {
  const set = (field, value) => onChange({ ...data, [field]: value });

  if (type === 'hero') {
    return (
      <div className="space-y-2">
        <input className={inputCls} placeholder="Eyebrow (malý nadpis)" value={data.eyebrow || ''} onChange={(e) => set('eyebrow', e.target.value)} />
        <input className={inputCls} placeholder="Hlavní nadpis" value={data.heading || ''} onChange={(e) => set('heading', e.target.value)} />
        <textarea className={inputCls} placeholder="Podnadpis" rows={2} value={data.subheading || ''} onChange={(e) => set('subheading', e.target.value)} />
        <input className={inputCls} placeholder="URL obrázku na pozadí" value={data.image_url || ''} onChange={(e) => set('image_url', e.target.value)} />
        <div className="grid grid-cols-2 gap-2">
          <input className={inputCls} placeholder="Text tlačítka" value={data.cta_label || ''} onChange={(e) => set('cta_label', e.target.value)} />
          <input className={inputCls} placeholder="Odkaz tlačítka (/kontakt)" value={data.cta_link || ''} onChange={(e) => set('cta_link', e.target.value)} />
        </div>
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="space-y-2">
        <input className={inputCls} placeholder="Nadpis" value={data.heading || ''} onChange={(e) => set('heading', e.target.value)} />
        <textarea className={inputCls} placeholder="Text" rows={4} value={data.body || ''} onChange={(e) => set('body', e.target.value)} />
      </div>
    );
  }

  if (type === 'image_grid') {
    return (
      <div className="space-y-2">
        <input className={inputCls} placeholder="Nadpis galerie" value={data.heading || ''} onChange={(e) => set('heading', e.target.value)} />
        <textarea className={inputCls} placeholder="URL obrázků, jeden na řádek" rows={4}
          value={(data.images || []).join('\n')}
          onChange={(e) => set('images', e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))} />
      </div>
    );
  }

  if (type === 'cta') {
    return (
      <div className="space-y-2">
        <input className={inputCls} placeholder="Nadpis" value={data.heading || ''} onChange={(e) => set('heading', e.target.value)} />
        <input className={inputCls} placeholder="Podtext" value={data.subtext || ''} onChange={(e) => set('subtext', e.target.value)} />
        <div className="grid grid-cols-2 gap-2">
          <input className={inputCls} placeholder="Text tlačítka" value={data.button_label || ''} onChange={(e) => set('button_label', e.target.value)} />
          <input className={inputCls} placeholder="Odkaz tlačítka (/kontakt)" value={data.button_link || ''} onChange={(e) => set('button_link', e.target.value)} />
        </div>
      </div>
    );
  }

  return null;
}