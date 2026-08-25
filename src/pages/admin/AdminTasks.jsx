import React, { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, CircleDashed, Clock3, MessageSquare, Plus, Search, UserRound, CalendarDays, AlertTriangle, ArrowRightLeft, Send, X, Save, Loader, Filter, ListTodo } from 'lucide-react';

const PEOPLE = {
  'jakub1duch@gmail.com': { name: 'Jakub Duch', role: 'Admin · Creator' },
  'meduna@holmtec.cz': { name: 'Radek Meduna', role: 'Admin · CO' },
};

const STATUS = {
  backlog: { label: 'Backlog', tone: 'text-white/40 border-white/10 bg-white/5' },
  planned: { label: 'Naplánováno', tone: 'text-sky-300 border-sky-400/20 bg-sky-400/10' },
  in_progress: { label: 'Rozpracováno', tone: 'text-amber-300 border-amber-400/20 bg-amber-400/10' },
  waiting: { label: 'Čeká', tone: 'text-orange-300 border-orange-400/20 bg-orange-400/10' },
  review: { label: 'Ke kontrole', tone: 'text-violet-300 border-violet-400/20 bg-violet-400/10' },
  completed: { label: 'Dokončeno', tone: 'text-emerald-300 border-emerald-400/20 bg-emerald-400/10' },
  cancelled: { label: 'Zrušeno', tone: 'text-red-300 border-red-400/20 bg-red-400/10' },
};

const PRIORITY = {
  low: 'Nízká', normal: 'Normální', high: 'Vysoká', urgent: 'Urgentní'
};

const AREAS = ['web','products','media','marketing','seo','analytics','sales','offers','integration','qa','admin','other'];
const EMPTY = {
  title: '', description: '', status: 'backlog', priority: 'normal', area: 'web',
  assignee_email: 'jakub1duch@gmail.com', reviewer_email: 'meduna@holmtec.cz',
  due_date: '', planned_date: '', estimated_hours: '', actual_hours: '',
  related_type: '', related_label: '', related_url: '', handoff_note: '', result_summary: '', evidence: '', tags: []
};

function Pill({ children, className = '' }) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider ${className}`}>{children}</span>;
}

export default function AdminTasks({ embedded = false }) {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('active');

  const load = async () => {
    setLoading(true);
    try {
      const [me, t, c] = await Promise.all([
        base44.auth.me(),
        base44.entities.AdminTask.list('-updated_date', 250),
        base44.entities.AdminTaskComment.list('-created_date', 500),
      ]);
      setUser(me);
      setTasks(t || []);
      setComments(c || []);
      if (selected) setSelected((t || []).find(x => x.id === selected.id) || null);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => tasks.filter(task => {
    const haystack = `${task.title || ''} ${task.description || ''} ${task.area || ''} ${task.assignee_name || ''}`.toLowerCase();
    if (search && !haystack.includes(search.toLowerCase())) return false;
    if (assigneeFilter !== 'all' && task.assignee_email !== assigneeFilter) return false;
    if (statusFilter === 'active' && ['completed','cancelled'].includes(task.status)) return false;
    if (statusFilter !== 'all' && statusFilter !== 'active' && task.status !== statusFilter) return false;
    return true;
  }), [tasks, search, assigneeFilter, statusFilter]);

  const metrics = useMemo(() => ({
    open: tasks.filter(t => !['completed','cancelled'].includes(t.status)).length,
    review: tasks.filter(t => t.status === 'review').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.due_date && t.status !== 'completed' && new Date(`${t.due_date}T23:59:59`) < new Date()).length,
  }), [tasks]);

  const openNew = () => {
    const creator = user?.email?.toLowerCase() || 'jakub1duch@gmail.com';
    setEditing('new');
    setForm({ ...EMPTY, assignee_email: creator in PEOPLE ? creator : 'jakub1duch@gmail.com', reviewer_email: creator === 'meduna@holmtec.cz' ? 'jakub1duch@gmail.com' : 'meduna@holmtec.cz' });
  };

  const openEdit = (task) => {
    setEditing(task);
    setForm({ ...EMPTY, ...task, tags: Array.isArray(task.tags) ? task.tags : [] });
  };

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const actorEmail = user?.email?.toLowerCase() || 'jakub1duch@gmail.com';
    const actor = PEOPLE[actorEmail] || { name: user?.full_name || actorEmail };
    const assignee = PEOPLE[form.assignee_email] || { name: form.assignee_email };
    const reviewer = PEOPLE[form.reviewer_email] || { name: form.reviewer_email };
    const payload = {
      ...form,
      assignee_name: assignee.name,
      reviewer_name: reviewer.name,
      creator_email: editing === 'new' ? actorEmail : (editing.creator_email || actorEmail),
      creator_name: editing === 'new' ? actor.name : (editing.creator_name || actor.name),
      estimated_hours: form.estimated_hours === '' ? null : Number(form.estimated_hours),
      actual_hours: form.actual_hours === '' ? null : Number(form.actual_hours),
      completed_at: form.status === 'completed' ? (editing?.completed_at || new Date().toISOString()) : null,
      source: editing === 'new' ? 'manual' : (editing.source || 'manual'),
    };
    let saved;
    if (editing === 'new') saved = await base44.entities.AdminTask.create(payload);
    else saved = await base44.entities.AdminTask.update(editing.id, payload);

    if (editing !== 'new' && editing.status !== payload.status) {
      await base44.entities.AdminTaskComment.create({ task_id: editing.id, author_email: actorEmail, author_name: actor.name, kind: 'status_change', message: `Stav změněn: ${STATUS[editing.status]?.label || editing.status} → ${STATUS[payload.status]?.label || payload.status}` });
    }
    if (editing !== 'new' && editing.assignee_email !== payload.assignee_email) {
      await base44.entities.AdminTaskComment.create({ task_id: editing.id, author_email: actorEmail, author_name: actor.name, kind: 'assignment', message: `Úkol předán: ${editing.assignee_name || editing.assignee_email} → ${assignee.name}` });
    }
    setEditing(null); setForm(EMPTY); await load();
    if (saved?.id) setSelected(saved);
    setSaving(false);
  };

  const quickStatus = async (task, status) => {
    const actorEmail = user?.email?.toLowerCase() || 'jakub1duch@gmail.com';
    const actor = PEOPLE[actorEmail] || { name: user?.full_name || actorEmail };
    await base44.entities.AdminTask.update(task.id, { status, completed_at: status === 'completed' ? new Date().toISOString() : null });
    await base44.entities.AdminTaskComment.create({ task_id: task.id, author_email: actorEmail, author_name: actor.name, kind: 'status_change', message: `Stav změněn: ${STATUS[task.status]?.label || task.status} → ${STATUS[status]?.label || status}` });
    await load();
  };

  const handoff = async (task) => {
    const next = task.assignee_email === 'jakub1duch@gmail.com' ? 'meduna@holmtec.cz' : 'jakub1duch@gmail.com';
    const nextPerson = PEOPLE[next];
    const actorEmail = user?.email?.toLowerCase() || 'jakub1duch@gmail.com';
    const actor = PEOPLE[actorEmail] || { name: user?.full_name || actorEmail };
    await base44.entities.AdminTask.update(task.id, { assignee_email: next, assignee_name: nextPerson.name, reviewer_email: actorEmail, reviewer_name: actor.name, status: task.status === 'completed' ? 'completed' : 'planned' });
    await base44.entities.AdminTaskComment.create({ task_id: task.id, author_email: actorEmail, author_name: actor.name, kind: 'assignment', message: `Úkol předán uživateli ${nextPerson.name}.` });
    await load();
  };

  const addComment = async () => {
    if (!selected || !comment.trim()) return;
    const actorEmail = user?.email?.toLowerCase() || 'jakub1duch@gmail.com';
    const actor = PEOPLE[actorEmail] || { name: user?.full_name || actorEmail };
    await base44.entities.AdminTaskComment.create({ task_id: selected.id, author_email: actorEmail, author_name: actor.name, kind: 'comment', message: comment.trim() });
    setComment(''); await load();
  };

  const taskComments = selected ? comments.filter(c => c.task_id === selected.id).sort((a,b) => String(a.created_date).localeCompare(String(b.created_date))) : [];

  if (loading && !tasks.length) return <div className="flex justify-center py-20"><Loader size={22} className="animate-spin text-cyan/50"/></div>;

  return <div className={embedded ? 'space-y-5' : 'p-6 space-y-6'}>
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan">Interní workflow</p>
        <h2 className="mt-1 text-xl font-medium text-white">Úkoly · plánování · předávání · komunikace</h2>
        <p className="mt-1 max-w-3xl text-xs leading-relaxed text-white/35">Společný pracovní systém pro Jakuba Ducha a Radka Medunu. Každý úkol má vlastníka, kontrolora, stav, prioritu, termín, předávací poznámku, potvrzený čas, výsledek a diskusi.</p>
      </div>
      <button onClick={openNew} className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan px-4 py-2.5 text-xs font-bold text-slate-950"><Plus size={14}/> Nový úkol</button>
    </div>

    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div className="rounded-xl border border-white/8 bg-white/3 p-4"><CircleDashed size={14} className="text-amber-300"/><p className="mt-3 text-2xl text-white">{metrics.open}</p><p className="text-xs text-white/30">otevřených úkolů</p></div>
      <div className="rounded-xl border border-white/8 bg-white/3 p-4"><Search size={14} className="text-violet-300"/><p className="mt-3 text-2xl text-white">{metrics.review}</p><p className="text-xs text-white/30">čeká na kontrolu</p></div>
      <div className="rounded-xl border border-white/8 bg-white/3 p-4"><CheckCircle2 size={14} className="text-emerald-300"/><p className="mt-3 text-2xl text-white">{metrics.completed}</p><p className="text-xs text-white/30">dokončeno</p></div>
      <div className="rounded-xl border border-white/8 bg-white/3 p-4"><AlertTriangle size={14} className="text-red-300"/><p className="mt-3 text-2xl text-white">{metrics.overdue}</p><p className="text-xs text-white/30">po termínu</p></div>
    </div>

    <div className="rounded-xl border border-white/8 bg-white/3 p-3">
      <div className="grid gap-2 md:grid-cols-[1fr_190px_180px]">
        <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/10 px-3"><Search size={13} className="text-white/25"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Hledat úkol, oblast, osobu…" className="w-full bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-white/20"/></label>
        <select value={assigneeFilter} onChange={e=>setAssigneeFilter(e.target.value)} className="rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2.5 text-sm text-white/70"><option value="all">Všichni</option><option value="jakub1duch@gmail.com">Jakub Duch</option><option value="meduna@holmtec.cz">Radek Meduna</option></select>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2.5 text-sm text-white/70"><option value="active">Aktivní</option><option value="all">Vše</option>{Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select>
      </div>
    </div>

    <div className="grid gap-4 xl:grid-cols-[1.15fr_.85fr]">
      <div className="overflow-hidden rounded-xl border border-white/8">
        <div className="flex items-center gap-2 bg-white/5 px-4 py-3"><ListTodo size={13} className="text-cyan"/><p className="font-mono text-[10px] uppercase tracking-widest text-white/35">Pracovní fronta</p></div>
        <div className="divide-y divide-white/5">{filtered.length ? filtered.map(task => {
          const person = PEOPLE[task.assignee_email] || { name: task.assignee_name || task.assignee_email };
          return <button key={task.id} onClick={()=>setSelected(task)} className={`block w-full px-4 py-4 text-left transition hover:bg-white/[.025] ${selected?.id === task.id ? 'bg-cyan/[.05]' : ''}`}>
            <div className="flex items-start justify-between gap-4"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-medium text-white/80">{task.title}</p><Pill className={STATUS[task.status]?.tone}>{STATUS[task.status]?.label}</Pill>{task.priority === 'urgent' || task.priority === 'high' ? <Pill className="border-red-400/20 bg-red-400/10 text-red-300">{PRIORITY[task.priority]}</Pill> : null}</div><p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/35">{task.description}</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-white/25"><span>{task.area}</span><span className="inline-flex items-center gap-1"><UserRound size={10}/>{person.name}</span>{task.due_date ? <span className="inline-flex items-center gap-1"><CalendarDays size={10}/>{task.due_date}</span> : null}{Number(task.actual_hours)>0 ? <span className="inline-flex items-center gap-1"><Clock3 size={10}/>{task.actual_hours} h</span>:null}</div></div><span className="shrink-0 text-white/20">›</span></div>
          </button>;
        }) : <p className="px-4 py-8 text-center text-sm text-white/25">Žádné úkoly pro zvolený filtr.</p>}</div>
      </div>

      <div className="rounded-xl border border-white/8 bg-white/3 p-4">
        {!selected ? <div className="flex min-h-[300px] items-center justify-center text-center"><div><MessageSquare size={26} className="mx-auto text-white/15"/><p className="mt-3 text-sm text-white/30">Vyber úkol pro detail, předání a komunikaci.</p></div></div> : <div>
          <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[10px] uppercase tracking-widest text-cyan">Detail úkolu</p><h3 className="mt-1 text-lg font-medium text-white">{selected.title}</h3></div><button onClick={()=>setSelected(null)} className="text-white/30 hover:text-white"><X size={16}/></button></div>
          <p className="mt-3 text-sm leading-relaxed text-white/50">{selected.description}</p>
          {selected.handoff_note ? <div className="mt-4 rounded-lg border border-cyan/10 bg-cyan/5 p-3"><p className="font-mono text-[10px] uppercase tracking-wider text-cyan/60">Předávací poznámka</p><p className="mt-1.5 text-sm text-white/60">{selected.handoff_note}</p></div> : null}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs"><div className="rounded-lg border border-white/8 p-3"><p className="text-white/25">Odpovědný</p><p className="mt-1 text-white/70">{PEOPLE[selected.assignee_email]?.name || selected.assignee_name}</p></div><div className="rounded-lg border border-white/8 p-3"><p className="text-white/25">Kontrola</p><p className="mt-1 text-white/70">{PEOPLE[selected.reviewer_email]?.name || selected.reviewer_name}</p></div></div>
          <div className="mt-4 flex flex-wrap gap-2"><button onClick={()=>openEdit(selected)} className="rounded-full border border-white/10 px-3 py-2 text-xs text-white/60 hover:text-white">Upravit</button><button onClick={()=>handoff(selected)} className="inline-flex items-center gap-1.5 rounded-full border border-cyan/20 bg-cyan/10 px-3 py-2 text-xs text-cyan"><ArrowRightLeft size={12}/> Předat druhému</button>{selected.status !== 'review' && selected.status !== 'completed' ? <button onClick={()=>quickStatus(selected,'review')} className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-2 text-xs text-violet-300">Ke kontrole</button>:null}{selected.status !== 'completed' ? <button onClick={()=>quickStatus(selected,'completed')} className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-300">Dokončit</button>:null}</div>

          <div className="mt-6 border-t border-white/8 pt-4"><p className="font-mono text-[10px] uppercase tracking-widest text-white/30">Komunikace k úkolu</p><div className="mt-3 max-h-64 space-y-3 overflow-auto pr-1">{taskComments.length ? taskComments.map(c=><div key={c.id} className="rounded-lg border border-white/7 bg-black/10 p-3"><div className="flex items-center justify-between gap-2"><p className="text-xs font-medium text-white/65">{c.author_name || c.author_email}</p><span className="font-mono text-[9px] text-white/20">{new Date(c.created_date).toLocaleString('cs-CZ')}</span></div><p className="mt-1.5 text-xs leading-relaxed text-white/45">{c.message}</p></div>) : <p className="text-xs text-white/25">Zatím bez komentářů.</p>}</div><div className="mt-3 flex gap-2"><textarea value={comment} onChange={e=>setComment(e.target.value)} rows={2} placeholder="Napiš komentář, rozhodnutí nebo co má druhý udělat…" className="min-h-[68px] flex-1 resize-none rounded-lg border border-white/10 bg-black/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/20"/><button onClick={addComment} className="self-end rounded-lg bg-cyan p-2.5 text-slate-950"><Send size={14}/></button></div></div>
        </div>}
      </div>
    </div>

    {editing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"><div className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-2xl border border-white/10 bg-[#0d1117] p-5 shadow-2xl"><div className="flex items-center justify-between"><div><p className="font-mono text-[10px] uppercase tracking-widest text-cyan">{editing === 'new' ? 'Nový úkol' : 'Editace úkolu'}</p><h3 className="mt-1 text-lg text-white">{editing === 'new' ? 'Zadat práci' : form.title}</h3></div><button onClick={()=>setEditing(null)} className="text-white/30 hover:text-white"><X size={18}/></button></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="sm:col-span-2 text-xs text-white/35">Název<input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className="mt-1 block w-full rounded-lg border border-white/10 bg-black/15 px-3 py-2.5 text-sm text-white outline-none"/></label><label className="sm:col-span-2 text-xs text-white/35">Zadání / popis<textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={4} className="mt-1 block w-full rounded-lg border border-white/10 bg-black/15 px-3 py-2.5 text-sm text-white outline-none"/></label>
      <label className="text-xs text-white/35">Odpovědný<select value={form.assignee_email} onChange={e=>setForm(f=>({...f,assignee_email:e.target.value}))} className="mt-1 block w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white"><option value="jakub1duch@gmail.com">Jakub Duch · Creator</option><option value="meduna@holmtec.cz">Radek Meduna · CO</option></select></label><label className="text-xs text-white/35">Kontrolor<select value={form.reviewer_email} onChange={e=>setForm(f=>({...f,reviewer_email:e.target.value}))} className="mt-1 block w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white"><option value="meduna@holmtec.cz">Radek Meduna</option><option value="jakub1duch@gmail.com">Jakub Duch</option></select></label>
      <label className="text-xs text-white/35">Stav<select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} className="mt-1 block w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white">{Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></label><label className="text-xs text-white/35">Priorita<select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))} className="mt-1 block w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white">{Object.entries(PRIORITY).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label>
      <label className="text-xs text-white/35">Oblast<select value={form.area} onChange={e=>setForm(f=>({...f,area:e.target.value}))} className="mt-1 block w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white">{AREAS.map(a=><option key={a} value={a}>{a}</option>)}</select></label><label className="text-xs text-white/35">Termín<input type="date" value={form.due_date || ''} onChange={e=>setForm(f=>({...f,due_date:e.target.value}))} className="mt-1 block w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white"/></label>
      <label className="text-xs text-white/35">Plánovaný čas (h)<input type="number" min="0" step="0.5" value={form.estimated_hours ?? ''} onChange={e=>setForm(f=>({...f,estimated_hours:e.target.value}))} className="mt-1 block w-full rounded-lg border border-white/10 bg-black/15 px-3 py-2.5 text-sm text-white"/></label><label className="text-xs text-white/35">Skutečný potvrzený čas (h)<input type="number" min="0" step="0.25" value={form.actual_hours ?? ''} onChange={e=>setForm(f=>({...f,actual_hours:e.target.value}))} className="mt-1 block w-full rounded-lg border border-white/10 bg-black/15 px-3 py-2.5 text-sm text-white"/></label>
      <label className="sm:col-span-2 text-xs text-white/35">Předávací poznámka<textarea rows={2} value={form.handoff_note || ''} onChange={e=>setForm(f=>({...f,handoff_note:e.target.value}))} className="mt-1 block w-full rounded-lg border border-white/10 bg-black/15 px-3 py-2.5 text-sm text-white"/></label><label className="sm:col-span-2 text-xs text-white/35">Výsledek / co je hotovo<textarea rows={2} value={form.result_summary || ''} onChange={e=>setForm(f=>({...f,result_summary:e.target.value}))} className="mt-1 block w-full rounded-lg border border-white/10 bg-black/15 px-3 py-2.5 text-sm text-white"/></label><label className="sm:col-span-2 text-xs text-white/35">Důkaz / URL / checkpoint<input value={form.evidence || ''} onChange={e=>setForm(f=>({...f,evidence:e.target.value}))} className="mt-1 block w-full rounded-lg border border-white/10 bg-black/15 px-3 py-2.5 text-sm text-white"/></label></div>
      <div className="mt-5 flex justify-end gap-2"><button onClick={()=>setEditing(null)} className="rounded-full border border-white/10 px-4 py-2.5 text-xs text-white/50">Zrušit</button><button onClick={save} disabled={saving || !form.title.trim()} className="inline-flex items-center gap-2 rounded-full bg-cyan px-4 py-2.5 text-xs font-bold text-slate-950 disabled:opacity-50">{saving?<Loader size={13} className="animate-spin"/>:<Save size={13}/>} Uložit</button></div></div></div>}
  </div>;
}
