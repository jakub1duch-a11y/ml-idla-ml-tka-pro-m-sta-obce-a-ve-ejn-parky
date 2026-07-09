import React, { useState } from 'react';
import { Copy, Trash2, Check } from 'lucide-react';

export default function MediaGrid({ files, onDelete }) {
  const [copied, setCopied] = useState(null);

  const copyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  if (files.length === 0) {
    return <p className="text-center text-white/25 py-16 text-sm">Žádné soubory. Nahrajte první.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
      {files.map((f) => (
        <div key={f.id} className="group relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/8">
          <img src={f.file_url} alt={f.file_name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 p-2">
            <p className="text-white/70 text-[10px] font-mono truncate w-full text-center">{f.file_name}</p>
            <div className="flex gap-2">
              <button onClick={() => copyUrl(f.file_url, f.id)} aria-label="Zkopírovat URL"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-cyan hover:text-ink transition-all">
                {copied === f.id ? <Check size={13} /> : <Copy size={13} />}
              </button>
              <button onClick={() => onDelete(f.id)} aria-label="Smazat soubor"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-red-500 transition-all">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}