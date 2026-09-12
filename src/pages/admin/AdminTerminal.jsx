import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader, TerminalSquare } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import TerminalInquiries from '@/components/admin/terminal/TerminalInquiries';
import TerminalTasks from '@/components/admin/terminal/TerminalTasks';
import TerminalAdvisorChat from '@/components/admin/terminal/TerminalAdvisorChat';
import TerminalCalculator from '@/components/admin/terminal/TerminalCalculator';
import TerminalCommandCenter from '@/components/admin/terminal/TerminalCommandCenter';

export default function AdminTerminal() {
  const [inquiries, setInquiries] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agentData, setAgentData] = useState({ runs: [], sessions: [], activities: [], profiles: [], integrations: [] });

  const load = useCallback(async () => {
    const [poptavky, contacts, adminTasks, me, runs, sessions, activities, profiles, integrations] = await Promise.all([
      base44.entities.Poptavka.list('-created_date', 25),
      base44.entities.ContactInquiry.list('-created_date', 25),
      base44.entities.AdminTask.list('-created_date', 60),
      base44.auth.me().catch(() => null),
      base44.entities.OfferAgentRun.list('-created_date', 30).catch(() => []),
      base44.entities.SuperAgentSession.list('-last_active_at', 20).catch(() => []),
      base44.entities.CrmActivity.list('-created_date', 30).catch(() => []),
      base44.entities.SuperAgentProfile.list('-created_date', 20).catch(() => []),
      base44.entities.SuperAgentIntegration.list('-sort_order', 20).catch(() => []),
    ]);
    const merged = [
      ...(poptavky || []).map((p) => ({ id: p.id, entity: 'Poptavka', name: p.jmeno, email: p.email, phone: p.telefon, company: p.firma, message: p.zprava, status: p.status, created_date: p.created_date })),
      ...(contacts || []).map((c) => ({ id: c.id, entity: 'ContactInquiry', name: c.name, email: c.email, phone: '', company: '', message: c.message, status: c.status, created_date: c.created_date })),
    ].sort((a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0));
    setInquiries(merged);
    setTasks((adminTasks || []).filter((t) => !['completed', 'cancelled'].includes(t.status)));
    setUser(me);
    setAgentData({ runs: runs || [], sessions: sessions || [], activities: activities || [], profiles: (profiles || []).filter((profile) => profile.active !== false), integrations: (integrations || []).filter((integration) => integration.active !== false) });
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const context = useMemo(() => {
    const open = inquiries.filter((i) => ['nova', 'new'].includes(i.status)).length;
    const inquiryLines = inquiries.slice(0, 8).map((i) => `- ${i.name || '?'} (${i.email || 'bez e-mailu'}${i.company ? `, ${i.company}` : ''}): ${String(i.message || '').slice(0, 160)}`).join('\n');
    const taskLines = tasks.slice(0, 10).map((t) => `- [${t.priority}/${t.area}] ${t.title} · stav ${t.status}`).join('\n');
    return `Poptávek celkem: ${inquiries.length}, nových: ${open}. Otevřených úkolů: ${tasks.length}.

POSLEDNÍ POPTÁVKY:
${inquiryLines || '- žádné'}

OTEVŘENÉ ÚKOLY:
${taskLines || '- žádné'}`;
  }, [inquiries, tasks]);

  if (loading) return <div className="flex justify-center py-20"><Loader size={24} className="animate-spin text-cyan/40" /></div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="flex items-center gap-2 text-white text-xl font-heading font-medium"><TerminalSquare size={20} className="text-cyan" /> Terminál</h2>
        <p className="text-white/40 text-xs mt-1">Poptávky, úkoly, AI poradce a AI kalkulátor na jedné obrazovce — s hlasovým ovládáním.</p>
      </div>

      <TerminalCommandCenter inquiries={inquiries} tasks={tasks} {...agentData} />

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <TerminalInquiries items={inquiries} />
        <TerminalTasks tasks={tasks} user={user} onChange={load} />
        <TerminalAdvisorChat context={context} />
        <TerminalCalculator />
      </div>
    </div>
  );
}