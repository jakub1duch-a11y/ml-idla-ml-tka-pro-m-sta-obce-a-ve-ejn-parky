import React, { useState } from 'react';
import { Trash2, Sparkles, Send, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STATUS_COLOR = { draft: 'text-white/50 border-white/15 bg-white/5', scheduled: 'text-amber-400 border-amber-400/30 bg-amber-400/10', published: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' };
const STATUS_LABEL = { draft: 'Koncept', scheduled: 'Naplánováno', published: 'Publikováno' };

export default function ContentPlanList({ posts, onChange }) {
  const [publishingId, setPublishingId] = useState(null);
  const [error, setError] = useState('');

  const setStatus = async (id, status) => {
    await base44.entities.MarketingPost.update(id, { status });
    onChange();
  };
  const remove = async (id) => {
    await base44.entities.MarketingPost.delete(id);
    onChange();
  };
  const publishNow = async (id) => {
    setError('');
    setPublishingId(id);
    try {
      await base44.functions.invoke('publishInstagramPost', { postId: id });
      onChange();
    } catch (err) {
      setError(err?.response?.data?.error?.error_message || 'Publikace na Instagram se nezdařila.');
    } finally {
      setPublishingId(null);
    }
  };

  if (posts.length === 0) return <p className="text-white/25 text-sm py-8 text-center">Zatím žádné naplánované příspěvky.</p>;

  return (
    <div className="space-y-2">
      {error && <p className="text-red-400 text-xs font-mono px-1">{error}</p>}
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
          {p.platform === 'instagram' && p.status !== 'published' && (
            <button onClick={() => publishNow(p.id)} disabled={publishingId === p.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border border-cyan/30 text-cyan hover:bg-cyan/10 transition-all disabled:opacity-40 shrink-0">
              {publishingId === p.id ? <Loader size={12} className="animate-spin" /> : <Send size={12} />} Publikovat
            </button>
          )}
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