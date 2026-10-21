import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Mail, MessageSquare, CheckCircle, XCircle, Clock, RefreshCw, Eye, Play, Loader2, AlertCircle, Filter } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STATUS_ICONS = { sent: CheckCircle, failed: XCircle, pending: Clock, deduplicated: Filter };
const STATUS_COLORS = { sent: 'text-emerald-400', failed: 'text-rose-400', pending: 'text-amber-400', deduplicated: 'text-slate-400' };
const CHANNEL_ICONS = { email: Mail, slack: MessageSquare, google_chat: MessageSquare, internal: Bell };

const EVENT_LABELS = {
  welcome: 'Uvítací e-mail', quote_sent: 'Nabídka odeslána', status_change: 'Změna stavu',
  admin_message: 'Zpráva týmu', admin_chat: 'Admin notifikace', registration: 'Registrace',
  client_message: 'Zpráva klienta', offer_approved: 'Nabídka potvrzena', offer_viewed: 'Nabídka zobrazena',
  extension_requested: 'Prodloužení platnosti', extra_charge_response: 'Reakce na příplatek',
  inquiry_created: 'Nová poptávka', inquiry_status_change: 'Změna stavu poptávky',
};

export default function AdminNotifications() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, sent: 0, failed: 0, pending: 0, deduplicated: 0 });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterEvent, setFilterEvent] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewLoading, setPreviewLoading] = useState('');
  const [dryRunResult, setDryRunResult] = useState(null);
  const [dryRunLoading, setDryRunLoading] = useState('');
  const [error, setError] = useState('');

  const loadLogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set('status', filterStatus);
      if (filterEvent) params.set('event_type', filterEvent);
      params.set('limit', '50');
      const res = await base44.functions.invoke('getNotificationDelivery', { status: filterStatus, event_type: filterEvent, limit: 50 });
      const data = res?.data || res || {};
      if (data.ok) {
        setLogs(data.items || []);
        setStats(data.stats || { total: 0, sent: 0, failed: 0, pending: 0, deduplicated: 0 });
      } else setError(data.error || 'Načtení se nezdařilo');
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }, [filterStatus, filterEvent]);

  useEffect(() => { loadLogs(); }, [loadLogs]);

  async function previewTemplate(type) {
    setPreviewLoading(type);
    setPreviewHtml('');
    try {
      let res;
      if (type === 'welcome') {
        res = await base44.functions.invoke('dispatchWelcomeEmail', { preview: true, email: 'preview@mlzidla.cz', first_name: 'Jan' });
      } else if (type === 'quote_sent') {
        res = await base44.functions.invoke('dispatchProjectOrderNotification', { preview: true, project_id: 'preview', status: 'sent' });
      } else if (type === 'status_change') {
        res = await base44.functions.invoke('dispatchProjectOrderNotification', { preview: true, project_id: 'preview', status: 'in_production' });
      } else if (type === 'admin_message') {
        res = await base44.functions.invoke('dispatchOfferMessageNotification', { preview: true, message_id: 'preview' });
      }
      const html = res?.data?.html || res?.html;
      if (html) setPreviewHtml(html);
    } catch (e) { setError(e.message); } finally { setPreviewLoading(''); }
  }

  async function dryRun(type) {
    setDryRunLoading(type);
    setDryRunResult(null);
    try {
      let res;
      if (type === 'welcome') {
        res = await base44.functions.invoke('dispatchWelcomeEmail', { dry_run: true, email: 'dryrun@mlzidla.cz', first_name: 'Test' });
      } else if (type === 'admin_chat') {
        res = await base44.functions.invoke('notifyAdminChannel', { dry_run: true, event_type: 'registration', client_name: 'Test Klient', client_email: 'dryrun@mlzidla.cz' });
      }
      setDryRunResult({ type, data: res?.data || res });
    } catch (e) { setDryRunResult({ type, error: e.message }); } finally { setDryRunLoading(''); }
  }

  const previewTemplates = [
    { id: 'welcome', label: 'Uvítací e-mail' },
    { id: 'quote_sent', label: 'Nová nabídka' },
    { id: 'status_change', label: 'Změna stavu' },
    { id: 'admin_message', label: 'Zpráva týmu' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifikace & doručování</h1>
          <p className="mt-1 text-sm text-white/50">Přehled transakčních e-mailů a admin notifikací</p>
        </div>
        <button onClick={loadLogs} disabled={loading} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:bg-white/10">
          {loading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Obnovit
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: 'Celkem', value: stats.total, color: 'text-white' },
          { label: 'Odesláno', value: stats.sent, color: 'text-emerald-400' },
          { label: 'Neúspěšné', value: stats.failed, color: 'text-rose-400' },
          { label: 'Čekající', value: stats.pending, color: 'text-amber-400' },
          { label: 'Deduplikováno', value: stats.deduplicated, color: 'text-slate-400' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs text-white/40">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold text-white">Náhled šablon</h2>
          <p className="mt-1 text-xs text-white/40">Zobraz HTML šablu e-mailu bez odeslání</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {previewTemplates.map((t) => (
              <button key={t.id} onClick={() => previewTemplate(t.id)} disabled={Boolean(previewLoading)} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10 disabled:opacity-50">
                {previewLoading === t.id ? <Loader2 size={12} className="animate-spin" /> : <Eye size={12} />} {t.label}
              </button>
            ))}
          </div>
          {previewHtml && (
            <div className="mt-4">
              <iframe srcDoc={previewHtml} title="Náhled e-mailu" className="h-[400px] w-full rounded-lg border border-white/10 bg-white" />
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-sm font-semibold text-white">Dry-run testování</h2>
          <p className="mt-1 text-xs text-white/40">Testování bez skutečného odeslání</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => dryRun('welcome')} disabled={Boolean(dryRunLoading)} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10 disabled:opacity-50">
              {dryRunLoading === 'welcome' ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />} Uvítací e-mail
            </button>
            <button onClick={() => dryRun('admin_chat')} disabled={Boolean(dryRunLoading)} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10 disabled:opacity-50">
              {dryRunLoading === 'admin_chat' ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />} Admin chat
            </button>
          </div>
          {dryRunResult && (
            <div className="mt-4 rounded-lg border border-white/10 bg-black/30 p-3 text-xs">
              {dryRunResult.error ? (
                <span className="text-rose-400"><AlertCircle size={12} className="mr-1 inline" /> {dryRunResult.error}</span>
              ) : (
                <pre className="whitespace-pre-wrap text-emerald-300">{JSON.stringify(dryRunResult.data, null, 2)}</pre>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
          <option value="">Všechny stavy</option>
          <option value="sent">Odesláno</option>
          <option value="failed">Neúspěšné</option>
          <option value="pending">Čekající</option>
          <option value="deduplicated">Deduplikováno</option>
        </select>
        <select value={filterEvent} onChange={(e) => setFilterEvent(e.target.value)} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
          <option value="">Všechny typy</option>
          {Object.entries(EVENT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {error && <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"><AlertCircle size={16} /> {error}</div>}

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Typ</th>
              <th className="px-4 py-3 text-left font-medium">Příjemce</th>
              <th className="px-4 py-3 text-left font-medium">Stav</th>
              <th className="px-4 py-3 text-left font-medium">Předmět</th>
              <th className="px-4 py-3 text-left font-medium">Čas</th>
              <th className="px-4 py-3 text-left font-medium">Chyba</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-white/40"><Loader2 size={20} className="mx-auto animate-spin" /></td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-white/40">Žádné notifikace</td></tr>
            ) : (
              logs.map((log) => {
                const StatusIcon = STATUS_ICONS[log.status] || Clock;
                const ChannelIcon = CHANNEL_ICONS[log.channel_type] || Bell;
                return (
                  <tr key={log.id} className="hover:bg-white/5">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <ChannelIcon size={14} className="text-white/40" />
                        <span className="text-white/70">{EVENT_LABELS[log.event_type] || log.event_type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/50">{log.recipient}</td>
                    <td className="px-4 py-3">
                      <div className={`flex items-center gap-1.5 ${STATUS_COLORS[log.status] || 'text-white/50'}`}>
                        <StatusIcon size={14} /> {log.status}
                      </div>
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-white/50">{log.subject}</td>
                    <td className="px-4 py-3 text-white/40">{log.sent_at ? new Date(log.sent_at).toLocaleString('cs-CZ') : new Date(log.created_date).toLocaleString('cs-CZ')}</td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-rose-300/70">{log.error_message || '—'}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-sm font-semibold text-white">Stav integrací</h2>
        <div className="mt-3 space-y-2 text-xs">
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-white/60">Gmail (zákaznické e-maily)</span>
            <span className="flex items-center gap-1.5 text-emerald-400"><CheckCircle size={12} /> Autorizováno</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
            <span className="text-white/60">Slack (admin notifikace)</span>
            <span className="flex items-center gap-1.5 text-emerald-400"><CheckCircle size={12} /> Autorizováno · kanál #all-mlidlacz</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
            <span className="text-white/60">Google Chat</span>
            <span className="flex items-center gap-1.5 text-amber-400"><AlertCircle size={12} /> Není dostupný — použit Slack</span>
          </div>
        </div>
      </div>
    </div>
  );
}