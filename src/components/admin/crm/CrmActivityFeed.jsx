import React, { useState } from 'react';
import { Phone, Mail, Calendar, FileText, CheckCircle, Clock, AlertCircle, Plus, X, Trash2, User } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
const fmtDateTime = (d) => d ? new Date(d).toLocaleString('cs-CZ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';

const TYPE_ICONS = {
  call: Phone, email: Mail, meeting: Calendar, note: FileText, task: CheckCircle,
  visit: User, offer_sent: FileText, follow_up: Clock,
};

const TYPE_LABELS = {
  call: 'Telefonát', email: 'E-mail', meeting: 'Schůzka', note: 'Poznámka', task: 'Úkol',
  visit: 'Návštěva', offer_sent: 'Nabídka odeslána', follow_up: 'Follow-up',
};

const STATUS_COLORS = {
  planned: 'text-sky-400 border-sky-400/30 bg-sky-400/10',
  done: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  cancelled: 'text-white/30 border-white/10 bg-white/5',
  overdue: 'text-red-400 border-red-400/30 bg-red-400/10',
};

export default function CrmActivityFeed({ activities, clients, compact }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ contact_email: '', type: 'note', subject: '', description: '', due_date: '', priority: 'medium' });
  const [busy, setBusy] = useState(false);
  const [localActivities, setLocalActivities] = useState(activities);

  // Merge incoming activities with local ones (for live updates)
  const allActivities = [...localActivities, ...activities.filter((a) => !localActivities.some((la) => la.id === a.id))]
    .sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));

  const createActivity = async () => {
    if (!form.contact_email || !form.subject) return;
    setBusy(true);
    try {
      const client = clients.find((c) => c.email === form.contact_email.toLowerCase().trim());
      const payload = {
        contact_email: form.contact_email.toLowerCase().trim(),
        contact_name: client?.name || '',
        contact_company: client?.company || '',
        type: form.type,
        subject: form.subject,
        description: form.description,
        status: form.due_date ? 'planned' : 'done',
        due_date: form.due_date ? new Date(form.due_date).toISOString() : '',
        completed_at: form.due_date ? '' : new Date().toISOString(),
        priority: form.priority,
      };
      const created = await base44.entities.CrmActivity.create(payload);
      setLocalActivities([created, ...localActivities]);
      setForm({ contact_email: '', type: 'note', subject: '', description: '', due_date: '', priority: 'medium' });
      setShowForm(false);
    } catch (e) {
      console.warn('Activity create failed', e);
    } finally { setBusy(false); }
  };

  const toggleStatus = async (activity) => {
    const newStatus = activity.status === 'done' ? 'planned' : 'done';
    try {
      const updated = await base44.entities.CrmActivity.update(activity.id, {
        status: newStatus,
        completed_at: newStatus === 'done' ? new Date().toISOString() : '',
      });
      setLocalActivities(localActivities.map((a) => a.id === activity.id ? updated : a));
    } catch (e) { console.warn('Activity update failed', e); }
  };

  const deleteActivity = async (activity) => {
    try {
      await base44.entities.CrmActivity.delete(activity.id);
      setLocalActivities(localActivities.filter((a) => a.id !== activity.id));
    } catch (e) { console.warn('Activity delete failed', e); }
  };

  const sorted = allActivities;
  const display = compact ? sorted.slice(0, 8) : sorted;

  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/8">
        <p className="text-white text-sm font-medium flex items-center gap-2"><Calendar size={14} className="text-cyan"/> Aktivity ({allActivities.length})</p>
        {!compact && (
          <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-1.5 rounded-full bg-cyan px-3 py-1.5 text-xs font-bold text-ink hover:bg-cyan/90">
            <Plus size={13}/> Nová aktivita
          </button>
        )}
      </div>

      {showForm && !compact && (
        <div className="p-4 border-b border-white/8 bg-black/10 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <select value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white">
              <option value="">Vybrat klienta…</option>
              {clients.map((c) => <option key={c.email} value={c.email}>{c.name || c.email} {c.company ? `· ${c.company}` : ''}</option>)}
            </select>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white">
              {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Předmět aktivity…" className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white placeholder-white/25" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Detail / poznámka…" rows={2} className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white placeholder-white/25" />
          <div className="grid grid-cols-2 gap-2">
            <input type="datetime-local" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white" />
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white">
              <option value="low">Nízká priorita</option>
              <option value="medium">Střední priorita</option>
              <option value="high">Vysoká priorita</option>
              <option value="urgent">Urgentní</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={createActivity} disabled={busy || !form.contact_email || !form.subject} className="rounded-full bg-cyan px-4 py-2 text-xs font-bold text-ink disabled:opacity-40">{busy ? 'Ukládám…' : 'Uložit aktivitu'}</button>
            <button onClick={() => setShowForm(false)} className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/50 hover:text-white">Zrušit</button>
          </div>
        </div>
      )}

      <div className="max-h-[500px] overflow-y-auto divide-y divide-white/5">
        {display.length === 0 && <p className="text-center text-white/25 py-10 text-sm">Žádné aktivity. {compact ? '' : 'Vytvořte první aktivitu.'}</p>}
        {display.map((a) => {
          const Icon = TYPE_ICONS[a.type] || FileText;
          return (
            <div key={a.id} className="flex items-start gap-3 p-3.5 hover:bg-white/5 transition group">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${a.status === 'done' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-white/5 text-white/40'}`}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-xs font-medium truncate ${a.status === 'done' ? 'text-white/50 line-through' : 'text-white/80'}`}>{a.subject}</p>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border shrink-0 ${STATUS_COLORS[a.status] || STATUS_COLORS.planned}`}>{a.status}</span>
                </div>
                {a.contact_name && <p className="text-[10px] text-white/35 mt-0.5">{a.contact_name}{a.contact_company ? ` · ${a.contact_company}` : ''}</p>}
                {a.description && <p className="text-[10px] text-white/40 mt-1 line-clamp-2 leading-relaxed">{a.description}</p>}
                <div className="flex items-center gap-2 mt-1.5 text-[9px] font-mono text-white/20">
                  <span>{TYPE_LABELS[a.type] || a.type}</span>
                  <span>·</span>
                  <span>{fmtDate(a.created_date)}</span>
                  {a.due_date && <><span>·</span><span className={a.status === 'overdue' ? 'text-red-400' : ''}>termín: {fmtDateTime(a.due_date)}</span></>}
                </div>
              </div>
              {!compact && (
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => toggleStatus(a)} className="text-white/30 hover:text-emerald-400" title={a.status === 'done' ? 'Znovu otevřít' : 'Dokončit'}><CheckCircle size={12}/></button>
                  <button onClick={() => deleteActivity(a)} className="text-white/30 hover:text-red-400" title="Smazat"><Trash2 size={12}/></button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}