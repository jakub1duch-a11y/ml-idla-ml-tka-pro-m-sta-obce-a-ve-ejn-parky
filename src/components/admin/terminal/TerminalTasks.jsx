import React, { useState } from 'react';
import { CheckCircle2, Circle, Mic, Plus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import useVoiceInput from '@/hooks/useVoiceInput';

const PRIORITY = { urgent: 'text-rose-400', high: 'text-amber-400', normal: 'text-white/50', low: 'text-white/30' };

export default function TerminalTasks({ tasks, user, onChange }) {
  const [title, setTitle] = useState('');
  const { listening, supported, toggle } = useVoiceInput((text) => setTitle(text));

  const add = async () => {
    const clean = title.trim();
    if (!clean) return;
    setTitle('');
    await base44.entities.AdminTask.create({
      title: clean,
      status: 'planned',
      priority: 'normal',
      area: 'admin',
      assignee_email: user?.email || '',
      creator_email: user?.email || '',
      source: 'manual',
    });
    onChange?.();
  };

  const complete = async (task) => {
    await base44.entities.AdminTask.update(task.id, { status: 'completed', completed_at: new Date().toISOString() });
    onChange?.();
  };

  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-mono uppercase tracking-wider text-white/40">Úkoly</p>
        <span className="text-[10px] font-mono text-cyan">{tasks.length}</span>
      </div>

      <div className="flex gap-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Nový úkol — napište nebo nadiktujte…"
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder:text-white/25 outline-none focus:border-cyan/40" />
        {supported && (
          <button type="button" onClick={toggle} aria-label="Diktovat úkol"
            className={`rounded-xl border px-2.5 transition-all ${listening ? 'border-rose-400/50 bg-rose-400/15 text-rose-300' : 'border-white/10 text-white/40 hover:text-white'}`}>
            <Mic size={14} />
          </button>
        )}
        <button type="button" onClick={add} disabled={!title.trim()} aria-label="Přidat úkol"
          className="rounded-xl bg-cyan px-2.5 text-ink disabled:opacity-40"><Plus size={14} /></button>
      </div>

      <div className="mt-3 space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-start gap-2 rounded-xl border border-white/8 bg-white/3 px-3 py-2">
            <button type="button" onClick={() => complete(task)} aria-label="Dokončit úkol"
              className="mt-0.5 text-white/30 hover:text-emerald-400">
              {task.status === 'completed' ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Circle size={13} />}
            </button>
            <div className="min-w-0 flex-1">
              <p className={`text-xs ${task.status === 'completed' ? 'text-white/30 line-through' : 'text-white/80'}`}>{task.title}</p>
              <p className={`text-[9px] font-mono ${PRIORITY[task.priority] || 'text-white/30'}`}>{task.area} · {task.priority}</p>
            </div>
          </div>
        ))}
        {tasks.length === 0 && <p className="py-6 text-center text-xs text-white/25">Žádné otevřené úkoly.</p>}
      </div>
    </div>
  );
}