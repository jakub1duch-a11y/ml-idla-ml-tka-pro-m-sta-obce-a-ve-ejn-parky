import React from 'react';
import { X, Image as ImageIcon, Type, LayoutGrid, MousePointerClick } from 'lucide-react';

export const BLOCK_PRESETS = {
  hero: { icon: ImageIcon, label: 'Hero sekce', defaultData: { eyebrow: '', heading: 'Nová stránka', subheading: '', image_url: '', cta_label: '', cta_link: '' } },
  text: { icon: Type, label: 'Textový blok', defaultData: { heading: '', body: '' } },
  image_grid: { icon: LayoutGrid, label: 'Galerie obrázků', defaultData: { heading: '', images: [] } },
  cta: { icon: MousePointerClick, label: 'Výzva k akci (CTA)', defaultData: { heading: '', subtext: '', button_label: '', button_link: '' } },
};

export default function BlockLibrary({ onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-slate-900">Vybrat přednastavený blok</h3>
          <button onClick={onClose} aria-label="Zavřít" className="text-slate-400 hover:text-slate-900">
            <X size={18} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(BLOCK_PRESETS).map(([type, preset]) => (
            <button key={type} onClick={() => onSelect(type)}
              className="flex flex-col items-center gap-2 p-5 rounded-xl border border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all text-center">
              <preset.icon size={22} className="text-slate-700" />
              <span className="text-sm text-slate-700">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}