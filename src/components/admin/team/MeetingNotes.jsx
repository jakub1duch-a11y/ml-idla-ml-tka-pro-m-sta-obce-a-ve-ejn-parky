import React, { useEffect, useState } from 'react';
import { Download, FileText, Loader, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { noteToMarkdown, downloadText, summarizeMeeting } from '@/lib/teamAi';

export default function MeetingNotes({ channel, channelLabel, userName }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [open, setOpen] = useState(null);

  const load = () => base44.entities.MeetingNote.filter({ channel }, '-created_date', 100).then((r) => { setNotes(r || []); setLoading(false); });
  useEffect(() => { setLoading(true); load(); }, [channel]);

  const generate = async () => {
    setGenerating(true);
    const messages = await base44.entities.TeamMessage.filter({ channel }, 'created_date', 300);
    const human = (messages || []).filter((m) => m.kind !== 'summary');
    if (human.length) {
      const note = await summarizeMeeting({ channel, channelLabel, messages: human, userName });
      setOpen(note.id);
    }
    await load();
    setGenerating(false);
  };

  const download = (n) => downloadText(`zapis-${n.channel}-${String(n.created_date).slice(0, 10)}.md`, noteToMarkdown(n));

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">Zápisy · #{channelLabel}</p>
        <button onClick={generate} disabled={generating} className="inline-flex items-center gap-1.5 rounded-full bg-cyan px-3 py-1.5 text-xs font-bold text-slate-950 disabled:opacity-50">
          {generating ? <Loader size={12} className="animate-spin" /> : <Sparkles size={12} />} {generating ? 'AI píše zápis…' : 'Vytvořit zápis z chatu'}
        </button>
      </div>
      <div className="flex-1 space-y-2 overflow-auto pr-1">
        {loading ? <div className="flex justify-center py-6"><Loader size={16} className="animate-spin text-cyan/50" /></div>
          : notes.length === 0 ? <p className="py-6 text-center text-xs text-white/25">Zatím žádný zápis. AI ho vytvoří z komunikace v kanálu.</p>
          : notes.map((n) => (
            <div key={n.id} className="rounded-xl border border-white/8 bg-white/5 p-3">
              <button onClick={() => setOpen(open === n.id ? null : n.id)} className="flex w-full items-start justify-between gap-3 text-left">
                <div className="min-w-0"><p className="flex items-center gap-1.5 text-sm font-medium text-white/85"><FileText size={13} className="text-cyan" />{n.title}</p><p className="mt-0.5 font-mono text-[10px] text-white/30">{new Date(n.created_date).toLocaleString('cs-CZ')} · {n.message_count || 0} zpráv</p></div>
                <span className="text-white/25">{open === n.id ? '−' : '+'}</span>
              </button>
              {open === n.id && (
                <div className="mt-3 space-y-3 text-xs text-white/70">
                  <p className="whitespace-pre-wrap leading-relaxed">{n.summary}</p>
                  {[['Rozhodnutí', n.decisions], ['Úkoly', n.action_items], ['Doporučení', n.recommendations]].map(([label, items]) => items?.length ? (
                    <div key={label}><p className="font-mono text-[10px] uppercase tracking-wider text-cyan/70">{label}</p><ul className="mt-1 list-disc space-y-0.5 pl-4">{items.map((i, k) => <li key={k}>{i}</li>)}</ul></div>
                  ) : null)}
                  <button onClick={() => download(n)} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:text-white"><Download size={12} /> Stáhnout zápis (.md)</button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}