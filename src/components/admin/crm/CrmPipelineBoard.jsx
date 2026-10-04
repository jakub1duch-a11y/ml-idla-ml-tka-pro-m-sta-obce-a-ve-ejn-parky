import React, { useState } from 'react';
import { Mail, Phone, Building2, Package, ChevronRight, X, FileText, Calendar, DollarSign, CheckCircle, XCircle, Circle } from 'lucide-react';

const money = (v) => new Intl.NumberFormat('cs-CZ').format(Number(v || 0));
const fmtDate = (d) => d ? new Date(d).toLocaleDateString('cs-CZ', { day: 'numeric', month: 'short' }) : '';

export default function CrmPipelineBoard({ stages, compact }) {
  const [selected, setSelected] = useState(null);
  const stageKeys = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];

  const STAGE_ICONS = { lead: Circle, qualified: Circle, proposal: Circle, negotiation: Circle, won: CheckCircle, lost: XCircle };

  const DealCard = ({ deal }) => (
    <button onClick={() => setSelected(deal)} className="w-full text-left rounded-xl border border-white/8 bg-white/5 p-3 hover:border-cyan/30 hover:bg-white/8 transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-white text-xs font-medium truncate">{deal.name}</p>
          <p className="text-white/30 text-[10px] font-mono truncate">{deal.email}</p>
        </div>
        {deal.total > 0 && <span className="text-cyan text-[11px] font-mono font-bold shrink-0">{money(deal.total)} Kč</span>}
      </div>
      {deal.company && <p className="text-white/35 text-[10px] flex items-center gap-1 mb-1"><Building2 size={9}/> {deal.company}</p>}
      {deal.product && <p className="text-white/35 text-[10px] flex items-center gap-1 mb-1"><Package size={9}/> {deal.product}</p>}
      {deal.quote_number && <p className="text-cyan/50 text-[9px] font-mono">{deal.quote_number}</p>}
      <p className="text-white/20 text-[9px] font-mono mt-1.5">{fmtDate(deal.created_date)}</p>
    </button>
  );

  return (
    <>
      <div className={`grid gap-3 ${compact ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'}`}>
        {stageKeys.map((key) => {
          const stage = stages[key];
          const Icon = STAGE_ICONS[key] || Circle;
          return (
            <div key={key} className="rounded-2xl border border-white/8 bg-white/2 p-3">
              <div className={`inline-flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full border ${stage.color} mb-3`}>
                {stage.label}
                <span className="ml-1 text-white/40">{stage.deals.length}</span>
              </div>
              {stage.value > 0 && <p className="text-[10px] text-white/30 font-mono mb-2">{money(stage.value)} Kč</p>}
              <div className="space-y-2 max-h-96 overflow-y-auto pr-0.5">
                {(compact ? stage.deals.slice(0, 4) : stage.deals).map((deal) => <DealCard key={deal.id} deal={deal} />)}
                {stage.deals.length === 0 && <p className="text-center text-white/20 text-[10px] py-4">Prázdné</p>}
                {!compact && stage.deals.length > 0 && stage.deals.length > 4 && <p className="text-center text-white/20 text-[9px] py-1">{stage.deals.length} celkem</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deal detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative w-full max-w-md bg-[#0d1117] border-l border-white/10 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#0d1117] border-b border-white/8 px-5 py-4 flex items-center justify-between">
              <p className="text-white text-sm font-medium">{selected.name || 'Detail dealu'}</p>
              <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white"><X size={18}/></button>
            </div>
            <div className="p-5 space-y-4">
              {selected.email && <div className="flex items-center gap-2 text-xs text-cyan"><Mail size={13}/> {selected.email}</div>}
              {selected.phone && <div className="flex items-center gap-2 text-xs text-white/50"><Phone size={13}/> {selected.phone}</div>}
              {selected.company && <div className="flex items-center gap-2 text-xs text-white/50"><Building2 size={13}/> {selected.company}</div>}
              {selected.product && <div className="flex items-center gap-2 text-xs text-white/50"><Package size={13}/> {selected.product}</div>}
              {selected.quote_number && <div className="flex items-center gap-2 text-xs text-white/50"><FileText size={13}/> {selected.quote_number}</div>}
              {selected.total > 0 && <div className="flex items-center gap-2 text-sm text-cyan font-bold"><DollarSign size={15}/> {money(selected.total)} Kč</div>}
              {selected.message && <div className="rounded-lg border border-white/8 bg-white/5 p-3"><p className="text-[10px] uppercase text-white/30 mb-1">Zpráva</p><p className="text-xs text-white/60 leading-relaxed whitespace-pre-wrap">{selected.message}</p></div>}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-white/30">
                <div><Calendar size={10} className="inline mr-1"/> Vytvořeno: {fmtDate(selected.created_date)}</div>
                {selected.valid_until && <div>Platnost do: {fmtDate(selected.valid_until)}</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}