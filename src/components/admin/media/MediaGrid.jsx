import React, { useMemo, useState } from 'react';
import { Copy, Trash2, Check } from 'lucide-react';

export default function MediaGrid({ files, onDelete }) {
  const [copied, setCopied] = useState(null);

  const copyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const groups = useMemo(() => {
    const map = new Map();
    for (const file of files) {
      const group = file.media_group || 'NEZAŘAZENÉ';
      if (!map.has(group)) map.set(group, []);
      map.get(group).push(file);
    }

    const preferredOrder = ['BENDY', 'MRKEV', 'MRAK', 'GATE', 'CITY', 'GARDEN', 'SMART', 'TECHNOLOGIE', 'DĚTSKÉ', 'NEZAŘAZENÉ'];
    return [...map.entries()]
      .sort(([a], [b]) => {
        const ai = preferredOrder.indexOf(a);
        const bi = preferredOrder.indexOf(b);
        if (ai === -1 && bi === -1) return a.localeCompare(b, 'cs');
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      })
      .map(([name, items]) => ({
        name,
        items: items.sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999) || a.file_name.localeCompare(b.file_name, 'cs')),
      }));
  }, [files]);

  if (files.length === 0) {
    return <p className="text-center text-white/25 py-16 text-sm">Žádné soubory. Nahrajte první.</p>;
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.name}>
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-white text-sm font-medium tracking-wide">{group.name}</h3>
            <span className="text-[10px] font-mono text-white/35 bg-white/5 border border-white/10 rounded-full px-2 py-0.5">{group.items.length}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {group.items.map((f) => (
              <div key={f.id} className="group relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/8">
                {f.file_type?.startsWith('video/') ? (
                  <video src={f.file_url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                ) : (
                  <img src={f.file_url} alt={f.file_name} className="w-full h-full object-cover" loading="lazy" />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/65 to-transparent px-2 pt-8 pb-2">
                  <p className="text-white/90 text-[10px] font-mono truncate" title={f.file_name}>{f.file_name}</p>
                  <p className="text-white/40 text-[9px] mt-0.5 truncate">{f.product_slug || 'bez produktu'} · {f.media_role || 'media'}</p>
                </div>
                <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
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
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
