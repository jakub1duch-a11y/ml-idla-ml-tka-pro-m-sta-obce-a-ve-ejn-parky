import React, { useMemo, useState } from 'react';
import {
  Activity, ArrowUpRight, Bot, CheckCircle2, Circle, Clock3, Cpu,
  FileText, Mail, MessageCircle, Paperclip, Radio, ShieldCheck,
  Sparkles, UserRound, Workflow, XCircle
} from 'lucide-react';

const FALLBACK_AGENTS = [
  { key: 'mlzidla_superagent', name: 'MLŽIDLA Superagent', description: 'Řídí poptávky, nabídky a další kroky.', capabilities: ['poptávky', 'nabídky', 'prioritizace'] },
  { key: 'offer_agent', name: 'Nabídkový agent', description: 'Připravuje nabídky do Gmail konceptů.', capabilities: ['kalkulace', 'Gmail koncepty', 'QA'] },
  { key: 'visualization_agent', name: 'Vizualizační agent', description: 'Pracuje se schválenými vizualizacemi.', capabilities: ['vizualizace', 'schválení', 'prezentace'] },
  { key: 'communication_agent', name: 'Komunikační agent', description: 'Hlídá návaznou komunikaci a follow-up.', capabilities: ['CRM', 'follow-up', 'e-mail'] },
];

const STATUS_LABELS = {
  awaiting_approval: 'čeká na schválení',
  running: 'probíhá',
  completed: 'dokončeno',
  failed: 'chyba',
  proposed: 'navrženo',
  pending_approval: 'čeká na schválení',
  approved: 'schváleno',
  sent: 'odesláno',
};

const dateTime = (value) => value
  ? new Date(value).toLocaleString('cs-CZ', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  : '—';

const statusTone = (status) => {
  if (['completed', 'approved', 'sent', 'done'].includes(status)) return 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20';
  if (['failed', 'cancelled', 'overdue'].includes(status)) return 'text-rose-300 bg-rose-400/10 border-rose-400/20';
  if (['running', 'awaiting_approval', 'pending_approval', 'planned'].includes(status)) return 'text-amber-300 bg-amber-400/10 border-amber-400/20';
  return 'text-white/50 bg-white/5 border-white/10';
};

const humanStatus = (status) => STATUS_LABELS[status] || status || 'bez stavu';

function Kpi({ label, value, detail, icon: Icon, tone = 'text-cyan' }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.035] px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">{label}</span>
        <Icon size={15} className={tone} />
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <span className="text-2xl font-heading text-white">{value}</span>
        {detail && <span className="text-[10px] text-white/35">{detail}</span>}
      </div>
    </div>
  );
}

export default function TerminalCommandCenter({
  inquiries = [], tasks = [], runs = [], sessions = [], activities = [], profiles = [], integrations = []
}) {
  const [selectedAgent, setSelectedAgent] = useState('');
  const agents = profiles.length ? profiles : FALLBACK_AGENTS;
  const activeAgentKey = selectedAgent || agents[0]?.key;
  const activeAgent = agents.find((agent) => agent.key === activeAgentKey) || agents[0];

  const pendingApprovals = runs.filter((run) => run.run_status === 'pending_approval' || run.approval_required && !run.send_allowed).length;
  const activeRuns = runs.filter((run) => ['intake', 'solution', 'pricing', 'visualization', 'document', 'qa'].includes(run.run_status)).length;
  const openInquiries = inquiries.filter((item) => ['nova', 'new'].includes(item.status)).length;
  const openTasks = tasks.length;
  const communication = activities.slice(0, 8);
  const actionStream = useMemo(() => [
    ...runs.map((run) => ({
      id: `run-${run.id}`,
      icon: FileText,
      label: 'Nabídkový běh',
      detail: run.notes || `Stav: ${humanStatus(run.run_status)}`,
      status: run.run_status,
      date: run.updated_date || run.created_date,
    })),
    ...sessions.map((session) => ({
      id: `session-${session.id}`,
      icon: MessageCircle,
      label: session.title || 'Pracovní relace',
      detail: session.last_message || session.conversation_summary || 'Relace agenta',
      status: session.status,
      date: session.last_active_at || session.updated_date,
    })),
  ].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).slice(0, 7), [runs, sessions]);

  return (
    <section className="space-y-4">
      <div className="rounded-3xl border border-cyan/20 bg-gradient-to-br from-[#123b45] via-[#0d2d38] to-[#091e26] p-5 shadow-2xl shadow-cyan/5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-cyan">
              <Radio size={13} className="animate-pulse" /> interní pracovní terminál
            </div>
            <h1 className="text-2xl font-heading font-medium text-white">AI command center</h1>
            <p className="mt-1 max-w-2xl text-sm text-white/55">Konverzace, agentní workflow, nabídky a komunikace v jednom živém přehledu.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[11px] text-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Systém online
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi label="Nové poptávky" value={openInquiries} detail={`z ${inquiries.length}`} icon={ArrowUpRight} />
          <Kpi label="Aktivní běhy" value={activeRuns} detail="agent workflow" icon={Workflow} tone="text-amber-300" />
          <Kpi label="Ke schválení" value={pendingApprovals} detail="bez auto-odeslání" icon={ShieldCheck} tone="text-amber-300" />
          <Kpi label="Komunikace" value={communication.length} detail="poslední aktivita" icon={Mail} tone="text-mist" />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.8fr)]">
        <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-5">
          <div className="flex flex-col gap-3 border-b border-white/8 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/45"><MessageCircle size={14} className="text-cyan" /> vizualizace konverzace</p>
              <p className="mt-1 text-sm text-white/70">{activeAgent?.name || 'AI agent'} <span className="text-white/30">· pracovní kanál</span></p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-white/35"><Cpu size={13} /> {sessions.length} relací</div>
          </div>
          <div className="mt-5 space-y-4">
            <div className="flex gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan/15 text-cyan"><Bot size={14} /></div>
              <div className="max-w-2xl rounded-2xl rounded-tl-md border border-cyan/15 bg-cyan/[0.07] px-4 py-3">
                <p className="mb-1 text-[10px] font-mono uppercase tracking-wider text-cyan/70">agent · připraven</p>
                <p className="text-sm leading-6 text-white/75">{activeAgent?.description || 'Jsem připraven pracovat s kontextem poptávek a komunikace.'}</p>
              </div>
            </div>
            <div className="ml-10 flex items-center gap-2 text-[11px] text-white/35"><Sparkles size={13} className="text-cyan/70" /> Kontext načten: {inquiries.length} poptávek, {openTasks} otevřených úkolů</div>
            {actionStream.length > 0 ? actionStream.slice(0, 4).map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/45"><Icon size={13} /></div>
                  <div className="min-w-0 flex-1 rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-medium text-white/75">{item.label}</p>
                      <span className="text-[10px] font-mono text-white/25">{dateTime(item.date)}</span>
                    </div>
                    <p className="mt-1 truncate text-xs text-white/45">{item.detail}</p>
                    <span className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-[9px] font-mono ${statusTone(item.status)}`}>{humanStatus(item.status)}</span>
                  </div>
                </div>
              );
            }) : (
              <div className="ml-10 rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-xs text-white/30">Konverzační aktivita se zobrazí po prvním běhu agenta.</div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/45"><Bot size={14} className="text-cyan" /> AI agenti</p>
              <span className="text-[10px] text-white/30">{agents.length} aktivních</span>
            </div>
            <div className="space-y-2">
              {agents.slice(0, 6).map((agent) => (
                <button key={agent.key} type="button" onClick={() => setSelectedAgent(agent.key)} className={`w-full rounded-2xl border p-3 text-left transition-colors ${activeAgentKey === agent.key ? 'border-cyan/35 bg-cyan/10' : 'border-white/8 bg-white/[0.02] hover:border-white/15'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm text-white/80">{agent.name}</span>
                    <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-300" />
                  </div>
                  <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-white/35">{agent.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">{(agent.capabilities || []).slice(0, 3).map((capability) => <span key={capability} className="rounded-full bg-white/5 px-2 py-0.5 text-[9px] text-white/40">{capability}</span>)}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-5">
            <div className="mb-3 flex items-center justify-between"><p className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/45"><Activity size={14} className="text-cyan" /> analytika workflow</p><span className="text-[10px] text-white/30">{runs.length} běhů</span></div>
            <div className="space-y-2">
              {['pending_approval', 'qa', 'visualization', 'completed'].map((status) => {
                const count = runs.filter((run) => run.run_status === status).length;
                return <div key={status} className="flex items-center justify-between rounded-xl bg-white/[0.025] px-3 py-2"><span className="text-xs text-white/55">{humanStatus(status)}</span><span className="font-mono text-xs text-cyan">{count}</span></div>;
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-5">
          <div className="mb-4 flex items-center justify-between"><p className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/45"><Mail size={14} className="text-cyan" /> přehled komunikace</p><span className="text-[10px] text-white/30">{activities.length} záznamů</span></div>
          <div className="space-y-2">
            {communication.length ? communication.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.02] px-3 py-3">
                <div className="mt-0.5 rounded-xl bg-cyan/10 p-2 text-cyan"><Mail size={13} /></div>
                <div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="truncate text-xs text-white/75">{activity.subject || 'Aktivita'}</p><span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] ${statusTone(activity.status)}`}>{humanStatus(activity.status)}</span></div><p className="mt-1 truncate text-[11px] text-white/40">{activity.contact_name || activity.contact_email || 'Kontakt'} · {activity.description || 'Bez popisu'}</p></div>
              </div>
            )) : <p className="py-6 text-center text-xs text-white/30">CRM komunikace se zobrazí po přidání prvního záznamu.</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-5">
          <div className="mb-4 flex items-center justify-between"><p className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/45"><ShieldCheck size={14} className="text-cyan" /> bezpečné akce</p><span className="text-[10px] text-amber-300/70">schválení nutné</span></div>
          <div className="space-y-3 text-xs text-white/55">
            <div className="flex items-start gap-3"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-300" /><span>Koncepty Gmailu vznikají až po schválení nabídky.</span></div>
            <div className="flex items-start gap-3"><Paperclip size={15} className="mt-0.5 shrink-0 text-cyan" /><span>Do nabídky se připojují pouze schválené vizualizace.</span></div>
            <div className="flex items-start gap-3"><UserRound size={15} className="mt-0.5 shrink-0 text-white/45" /><span>Administrace je dostupná pouze ověřenému admin účtu.</span></div>
            <div className="flex items-start gap-3"><Clock3 size={15} className="mt-0.5 shrink-0 text-amber-300" /><span>{pendingApprovals ? `${pendingApprovals} nabídky čekají na ruční schválení.` : 'Aktuálně není žádná nabídka v čekání.'}</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
