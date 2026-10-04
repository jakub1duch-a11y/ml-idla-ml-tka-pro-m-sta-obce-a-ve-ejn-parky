import React from 'react';
import { Loader, Trash2, FolderOpen, ExternalLink } from 'lucide-react';

export default function BrandVisualLibrary({ items, loading, onDelete }) {
  return (
    <div className="mt-6 border-t border-white/8 pt-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-white/40 font-mono uppercase tracking-wider flex items-center gap-1.5">
          <FolderOpen size={12} /> Knihovna značkových prvků
        </p>
        <span className="text-xs text-white/30 font-mono">{items.length} ks</span>
      </div>
      {loading ? (
        <div className="flex justify-center py-6"><Loader size={18} className="animate-spin text-cyan/40" /></div>
      ) : items.length === 0 ? (
        <p className="text-center text-white/25 text-xs py-6">Zatím nemáte uložené žádné ikony ani vizuální prvky.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {items.map((item) => (
            <div key={item.id} className="group relative rounded-lg overflow-hidden border border-white/8 bg-white/5">
              <img src={item.file_url} alt={item.file_name} className="w-full aspect-square object-contain bg-[#F4FAFC]" />
              <div className="p-2">
                <p className="text-[10px] text-white/60 truncate" title={item.file_name}>{item.file_name}</p>
                <p className="text-[9px] text-cyan/70 font-mono uppercase mt-0.5">{item.media_role || 'brand'}</p>
              </div>
              <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <a href={item.file_url} target="_blank" rel="noreferrer" title="Otevřít"
                  className="h-7 w-7 rounded-lg bg-black/60 text-white flex items-center justify-center">
                  <ExternalLink size={12} />
                </a>
                <button onClick={() => onDelete(item.id)} title="Smazat"
                  className="h-7 w-7 rounded-lg bg-rose-500/80 text-white flex items-center justify-center">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}