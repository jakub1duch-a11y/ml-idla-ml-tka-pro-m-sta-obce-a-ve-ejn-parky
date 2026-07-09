import React from 'react';
import { Trash2, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STATUS_COLOR = { draft: 'text-white/50 border-white/15 bg-white/5', scheduled: 'text-amber-400 border-amber-400/30 bg-amber-400/10', published: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' };
const STATUS_LABEL = { draft: 'Koncept', scheduled: 'Naplánováno', published: 'Publikováno' };

export default function ContentPlanList({ posts, onChange }) {
  const setStatus = async (id, status) => {
    await base44.entities.MarketingPost.update(id, { status });
    onChange();
  };
  const remove = async (id) => {
    await base44.entities.MarketingPost.delete(id);
    onChange();
  };

  if (posts.length === 0) return <p className="text-white/25 text-sm py-8 text-center">Zatím žádné naplánované příspěvky.</p>;

  return (
    <div className="space-y-2">
      {posts.map((p) => (
        <div key={p.id} className="flex items-center gap-4 p-3 rounded-xl border border-white/8 bg-white/3">
          {p.image_url && <img src={p.image_url} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="text-white text-sm font-medium truncate">{p.title}</p>
              {p.ai_generated && <Sparkles size={11} className="text-cyan shrink-0" />}
            </div>
            <p className="text-white/35 text-xs font-mono truncate">{p.platform} {p.scheduled_date ? `· ${new Date(p.scheduled_date).toLocaleString('cs-CZ')}` : ''}</p>
          </div>
          <select value={p.status} onChange={(e) => setStatus(p.id, e.target.value)}
            className={`text-[10px] font-mono px-2 py-1 rounded-full border bg-transparent shrink-0 ${STATUS_COLOR[p.status]}`}>
            {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k} className="bg-ink text-white">{v}</option>)}
          </select>
          <button onClick={() => remove(p.id)} aria-label="Smazat příspěvek" className="text-white/30 hover:text-red-400 transition-colors shrink-0">
            <Trash2 size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}