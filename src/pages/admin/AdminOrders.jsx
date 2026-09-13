import React, { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import {
  Factory, ReceiptText, Search, RefreshCw, CheckCircle2, Clock3, PackageCheck,
  AlertTriangle, CreditCard, CalendarDays, ExternalLink, Loader2, Filter,
} from 'lucide-react';

const STATUS = {
  awaiting_review: { label: 'Čeká kontrolu', cls: 'text-amber-300 bg-amber-400/10 border-amber-300/20' },
  confirmed: { label: 'Potvrzeno', cls: 'text-emerald-300 bg-emerald-400/10 border-emerald-300/20' },
  awaiting_deposit: { label: 'Čeká na 50% zálohu', cls: 'text-amber-300 bg-amber-400/10 border-amber-300/20' },
  deposit_paid: { label: 'Záloha uhrazena', cls: 'text-cyan bg-cyan/10 border-cyan/20' },
  in_production: { label: 'Ve výrobě', cls: 'text-blue-300 bg-blue-400/10 border-blue-300/20' },
  ready: { label: 'Připraveno', cls: 'text-violet-300 bg-violet-400/10 border-violet-300/20' },
  handover_planned: { label: 'Předání naplánováno', cls: 'text-fuchsia-300 bg-fuchsia-400/10 border-fuchsia-300/20' },
  completed: { label: 'Dokončeno', cls: 'text-emerald-300 bg-emerald-400/10 border-emerald-300/20' },
  cancelled: { label: 'Zrušeno', cls: 'text-white/40 bg-white/5 border-white/10' },
};

const money = (value) => new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(Number(value || 0));
const date = (value) => value ? new Date(value).toLocaleDateString('cs-CZ') : '—';

function Badge({ status }) {
  const cfg = STATUS[status] || { label: status || '—', cls: 'text-white/50 bg-white/5 border-white/10' };
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-wide ${cfg.cls}`}>{cfg.label}</span>;
}

function Metric({ icon: Icon, label, value, sub }) {
  return <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-4 min-w-0">
    <div className="flex items-start justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[.12em] text-white/35 font-mono">{label}</p><p className="mt-2 text-2xl font-semibold text-white">{value}</p>{sub && <p className="mt-1 text-[11px] text-white/35">{sub}</p>}</div><div className="h-9 w-9 rounded-xl bg-cyan/10 text-cyan flex items-center justify-center"><Icon size={17}/></div></div>
  </div>;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [projects, setProjects] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('active');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true); setError('');
    try {
      const [production, projectOrders, projectPayments] = await Promise.all([
        base44.entities.ProductionOrder.list('-created_date', 300),
        base44.entities.ProjectOrder.list('-created_date', 300),
        base44.entities.ProjectPayment.list('-created_date', 600),
      ]);
      setOrders(production || []); setProjects(projectOrders || []); setPayments(projectPayments || []);
    } catch (e) { setError('Data výroby se nepodařilo načíst.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const projectsById = useMemo(() => Object.fromEntries(projects.map(p => [p.id, p])), [projects]);
  const paymentsByProject = useMemo(() => {
    const map = {};
    payments.forEach(p => { (map[p.project_order_id] ||= []).push(p); });
    return map;
  }, [payments]);

  const acceptedWithoutProduction = useMemo(() => projects.filter(p => ['approved','in_production','ready','delivered'].includes(p.status) && !orders.some(o => o.project_order_id === p.id)), [projects, orders]);
  const activeOrders = orders.filter(o => !['completed','cancelled'].includes(o.status));
  const pipelineValue = activeOrders.reduce((sum,o) => sum + Number(o.total_price_ex_vat || 0), 0);
  const awaitingDeposit = activeOrders.filter(o => o.status === 'awaiting_deposit').length;
  const inProduction = activeOrders.filter(o => o.status === 'in_production').length;

  const visible = orders.filter(o => {
    if (filter === 'active' && ['completed','cancelled'].includes(o.status)) return false;
    if (filter !== 'all' && filter !== 'active' && o.status !== filter) return false;
    const hay = `${o.client_name} ${o.client_email} ${o.product_name} ${o.quote_number}`.toLowerCase();
    return !query || hay.includes(query.toLowerCase());
  });

  const initialize = async (project) => {
    setBusy(`init:${project.id}`); setError('');
    try { await base44.functions.invoke('prepareProductionWorkflow', { project_order_id: project.id, order_source: project.approved_at ? 'portal' : 'admin' }); await load(); }
    catch (e) { setError(e?.response?.data?.error === 'missing_total_price' ? 'U nabídky chybí celková cena. Nejdříve ji doplňte.' : 'Výrobní workflow se nepodařilo založit.'); }
    finally { setBusy(''); }
  };

  const release = async (order) => {
    setBusy(`release:${order.id}`); setError('');
    try { await base44.functions.invoke('releaseProductionAfterDeposit', { production_order_id: order.id }); await load(); }
    catch (e) { setError('Nepodařilo se potvrdit zálohu a uvolnit výrobu.'); }
    finally { setBusy(''); }
  };

  const updateStatus = async (order, status) => {
    setBusy(`${status}:${order.id}`); setError('');
    try {
      await base44.entities.ProductionOrder.update(order.id, { status });
      const projectStatus = status === 'ready' ? 'ready' : undefined;
      if (projectStatus) await base44.entities.ProjectOrder.update(order.project_order_id, { status: projectStatus, completion_date: new Date().toISOString().slice(0,10) });
      await load();
    } catch (_) { setError('Stav se nepodařilo aktualizovat.'); }
    finally { setBusy(''); }
  };

  return <div className="p-4 sm:p-6 lg:p-8 max-w-[1500px] mx-auto">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
      <div><p className="text-[10px] font-mono uppercase tracking-[.16em] text-cyan mb-2">Výrobní proces</p><h1 className="text-2xl sm:text-3xl text-white font-semibold">Objednávky & výroba</h1><p className="text-white/40 text-sm mt-1 max-w-2xl">Potvrzená nabídka → 50% záloha → výroba → předání → 50% doplatek. Výroba se neuvolní před potvrzením úhrady zálohy.</p></div>
      <button onClick={load} className="h-10 px-4 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 flex items-center justify-center gap-2"><RefreshCw size={15}/> Obnovit</button>
    </div>

    {error && <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200 flex gap-2"><AlertTriangle size={16} className="shrink-0 mt-0.5"/>{error}</div>}

    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
      <Metric icon={Factory} label="Aktivní výroba" value={activeOrders.length} sub={`${inProduction} právě ve výrobě`} />
      <Metric icon={CreditCard} label="Čeká záloha" value={awaitingDeposit} sub="50 % před výrobou" />
      <Metric icon={ReceiptText} label="Hodnota pipeline" value={money(pipelineValue)} sub="bez DPH" />
      <Metric icon={CheckCircle2} label="Nově schválené" value={acceptedWithoutProduction.length} sub="čeká založení workflow" />
    </div>

    {acceptedWithoutProduction.length > 0 && <section className="mb-7 rounded-2xl border border-cyan/20 bg-cyan/[0.055] p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4"><CheckCircle2 size={17} className="text-cyan"/><h2 className="text-white font-medium">Schválené objednávky čekající na výrobní workflow</h2></div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">{acceptedWithoutProduction.map(project => <div key={project.id} className="rounded-xl bg-[#0d1117]/70 border border-white/8 p-4">
        <p className="text-white font-medium truncate">{project.client_name}</p><p className="text-xs text-white/40 mt-1 truncate">{project.product_name || project.project_name}</p><p className="text-[11px] font-mono text-cyan/70 mt-2">{project.quote_number || 'bez čísla nabídky'} · {money(project.total_price)}</p>
        <button onClick={() => initialize(project)} disabled={!!busy} className="mt-4 w-full h-10 rounded-xl bg-cyan text-[#08232b] font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2">{busy === `init:${project.id}` ? <Loader2 size={15} className="animate-spin"/> : <Factory size={15}/>} Založit 50/50 workflow</button>
      </div>)}</div>
    </section>}

    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <label className="relative flex-1"><Search size={15} className="absolute left-3 top-3 text-white/25"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Klient, produkt, nabídka…" className="w-full h-10 rounded-xl border border-white/10 bg-white/[0.035] pl-9 pr-3 text-sm text-white placeholder:text-white/25 outline-none focus:border-cyan/40"/></label>
      <label className="relative sm:w-56"><Filter size={14} className="absolute left-3 top-3 text-white/25"/><select value={filter} onChange={e=>setFilter(e.target.value)} className="w-full h-10 appearance-none rounded-xl border border-white/10 bg-[#111820] pl-9 pr-3 text-sm text-white/70 outline-none"><option value="active">Aktivní objednávky</option><option value="awaiting_deposit">Čeká záloha</option><option value="in_production">Ve výrobě</option><option value="ready">Připraveno</option><option value="completed">Dokončeno</option><option value="all">Vše</option></select></label>
    </div>

    {loading ? <div className="py-16 flex justify-center"><Loader2 className="animate-spin text-cyan"/></div> : <div className="space-y-3">
      {visible.map(order => {
        const project = projectsById[order.project_order_id] || {};
        const pp = paymentsByProject[order.project_order_id] || [];
        const deposit = pp.find(p => p.payment_type === 'deposit'); const final = pp.find(p => p.payment_type === 'final');
        return <article key={order.id} className="rounded-2xl border border-white/8 bg-white/[0.035] p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2 mb-2"><Badge status={order.status}/><span className="text-[10px] font-mono text-white/30">{order.quote_number}</span></div><h3 className="text-white font-semibold truncate">{order.client_name}</h3><p className="text-sm text-white/45 mt-0.5 truncate">{order.product_name || project.project_name}</p><div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]"><div><span className="text-white/25 block">Cena bez DPH</span><span className="text-white/70">{money(order.total_price_ex_vat)}</span></div><div><span className="text-white/25 block">Záloha 50 %</span><span className={deposit?.status === 'paid' ? 'text-emerald-300' : 'text-amber-300'}>{deposit?.status === 'paid' ? 'Uhrazeno' : money(order.deposit_amount_ex_vat)}</span></div><div><span className="text-white/25 block">Start výroby</span><span className="text-white/70">{date(order.production_start_date)}</span></div><div><span className="text-white/25 block">Předání</span><span className="text-white/70">{date(order.planned_handover_date || project.completion_date)}</span></div></div></div>
            <div className="flex flex-wrap lg:justify-end gap-2 lg:max-w-[420px]">
              {deposit?.invoice_url && <a href={deposit.invoice_url} target="_blank" rel="noreferrer" className="h-9 px-3 rounded-lg border border-white/10 text-xs text-white/60 hover:text-white flex items-center gap-1.5"><ReceiptText size={13}/> Záloha <ExternalLink size={11}/></a>}
              {final?.invoice_url && <a href={final.invoice_url} target="_blank" rel="noreferrer" className="h-9 px-3 rounded-lg border border-white/10 text-xs text-white/60 hover:text-white flex items-center gap-1.5"><ReceiptText size={13}/> Doplatek <ExternalLink size={11}/></a>}
              {order.status === 'awaiting_deposit' && <button onClick={() => release(order)} disabled={!!busy} className="h-9 px-3 rounded-lg bg-emerald-400 text-emerald-950 text-xs font-bold disabled:opacity-50 flex items-center gap-1.5">{busy===`release:${order.id}`?<Loader2 size={13} className="animate-spin"/>:<CreditCard size={13}/>} Potvrdit úhradu a spustit výrobu</button>}
              {order.status === 'in_production' && <button onClick={() => updateStatus(order,'ready')} disabled={!!busy} className="h-9 px-3 rounded-lg bg-cyan text-[#08232b] text-xs font-bold flex items-center gap-1.5"><PackageCheck size={13}/> Označit hotovo</button>}
              {order.status === 'ready' && <span className="h-9 px-3 rounded-lg bg-violet-400/10 border border-violet-400/20 text-violet-200 text-xs flex items-center gap-1.5"><CalendarDays size={13}/> Připraveno k předání</span>}
            </div>
          </div>
        </article>;
      })}
      {!visible.length && <div className="rounded-2xl border border-dashed border-white/10 py-14 text-center text-sm text-white/35">Žádné objednávky pro zvolený filtr.</div>}
    </div>}
  </div>;
}