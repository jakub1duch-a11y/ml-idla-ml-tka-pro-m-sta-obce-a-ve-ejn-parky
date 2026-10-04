import React from 'react';
import { Mail, MessageSquare, Phone } from 'lucide-react';

const formatDate = (value) => value ? new Date(value).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' }) : '';

export default function TerminalInquiries({ items }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-mono uppercase tracking-wider text-white/40">Poptávky</p>
        <span className="text-[10px] font-mono text-cyan">{items.length}</span>
      </div>
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={`${item.entity}-${item.id}`} className="rounded-xl border border-white/8 bg-white/3 p-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-white text-sm font-medium truncate">{item.name}</p>
              <span className="text-[9px] font-mono text-white/30 shrink-0">{formatDate(item.created_date)}</span>
            </div>
            <p className="text-white/30 text-[10px] font-mono truncate">{item.email}{item.company ? ` · ${item.company}` : ''}</p>
            {item.message && <p className="mt-1.5 flex gap-1.5 text-[11px] leading-4 text-white/50"><MessageSquare size={11} className="mt-0.5 shrink-0 text-white/25" />{item.message.slice(0, 120)}</p>}
            <div className="mt-2 flex gap-3">
              {item.email && <a href={`mailto:${item.email}`} className="inline-flex items-center gap-1 text-[10px] text-cyan hover:underline"><Mail size={10} /> Odpovědět</a>}
              {item.phone && <a href={`tel:${item.phone}`} className="inline-flex items-center gap-1 text-[10px] text-white/40 hover:text-white"><Phone size={10} /> {item.phone}</a>}
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="py-8 text-center text-xs text-white/25">Žádné poptávky.</p>}
      </div>
    </div>
  );
}