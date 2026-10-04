import React, { useState } from 'react';
import { Sparkles, Shield, CheckCircle2, Send, AlertTriangle, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import OfferConceptPresentation from './OfferConceptPresentation';

const STATUS_FLOW = [
  { key: 'nova_poptavka', label: 'NOVÁ POPTÁVKA', step: 0 },
  { key: 'koncept', label: 'KONCEPT', step: 1 },
  { key: 'k_overeni', label: 'K OVĚŘENÍ', step: 2 },
  { key: 'schvaleno', label: 'SCHVÁLENO', step: 3 },
  { key: 'odeslano', label: 'ODESLÁNO', step: 4 },
];

const STATUS_COLORS = {
  nova_poptavka: 'bg-slate-100 text-slate-600 border-slate-300',
  koncept: 'bg-blue-50 text-blue-700 border-blue-200',
  k_overeni: 'bg-amber-50 text-amber-700 border-amber-200',
  schvaleno: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  odeslano: 'bg-primary/10 text-primary border-primary/30',
};

export default function OfferConceptPanel({ inquiry, onRefresh, onOrder }) {
  const [concept, setConcept] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPresentation, setShowPresentation] = useState(false);
  const [transitioning, setTransitioning] = useState('');

  const offerStatus = inquiry.offer_status || 'nova_poptavka';
  const currentStep = STATUS_FLOW.find((s) => s.key === offerStatus)?.step || 0;

  const handleCreateConcept = async () => {
    setLoading(true);
    setError('');
    setConcept(null);
    try {
      const response = await base44.functions.invoke('prepareOfferConcept', {
        inquiry_id: inquiry.id,
        inquiry_type: inquiry.type || 'poptavka',
      });
      const data = response.data;
      if (data?.ok) {
        setConcept(data);
        setShowPresentation(true);
        if (onRefresh) await onRefresh();
      } else {
        setError(data?.error || 'Nepodařilo se vytvořit koncept.');
      }
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Chyba při volání AI.');
    } finally {
      setLoading(false);
    }
  };

  const handleTransition = async (targetStatus, confirmSend = false) => {
    setTransitioning(targetStatus);
    setError('');
    try {
      const response = await base44.functions.invoke('approveOfferConcept', {
        inquiry_id: inquiry.id,
        inquiry_type: inquiry.type || 'poptavka',
        target_status: targetStatus,
        confirm_send: confirmSend,
      });
      if (response.data?.ok) {
        if (onRefresh) await onRefresh();
      } else {
        setError(response.data?.error || ' Přechod stavu selhal.');
      }
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Chyba při přechodu stavu.');
    } finally {
      setTransitioning('');
    }
  };

  return (
    <div className="border-t border-border bg-card">
      {/* Status flow indicator */}
      <div className="px-6 py-4">
        <div className="flex items-center gap-1 overflow-x-auto">
          {STATUS_FLOW.map((status, i) => (
            <React.Fragment key={status.key}>
              <div className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold tracking-wide ${STATUS_COLORS[status.key]} ${i <= currentStep ? '' : 'opacity-40'}`}>
                {i < currentStep && <CheckCircle2 size={12} />}
                {status.label}
              </div>
              {i < STATUS_FLOW.length - 1 && (
                <div className={`h-px w-4 shrink-0 ${i < currentStep ? 'bg-emerald-400' : 'bg-border'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Safety gate notice */}
      <div className="flex items-start gap-3 border-y border-amber-200 bg-amber-50 px-6 py-3">
        <Shield size={16} className="mt-0.5 shrink-0 text-amber-600" />
        <p className="text-xs leading-relaxed text-amber-800">
          <strong>Bezpečnostní brána:</strong> AI připravuje obchodně-technický podklad. Automatický proces nikdy neodesílá nabídku zákazníkovi. Člověk má poslední slovo — schválí a ručně odešle.
        </p>
      </div>

      {/* Action area */}
      <div className="px-6 py-4">
        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Create concept button */}
        {offerStatus === 'nova_poptavka' && (
          <button
            onClick={handleCreateConcept}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-secondary disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {loading ? 'AI připravuje koncept…' : 'Vytvořit nabídku (AI koncept)'}
          </button>
        )}

        {/* Concept created — show actions */}
        {offerStatus === 'koncept' && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowPresentation(!showPresentation)}
              className="inline-flex items-center gap-2 border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
            >
              {showPresentation ? 'Skrýt prezentaci' : 'Zobrazit koncept'}
            </button>
            <button
              onClick={() => handleTransition('k_overeni')}
              disabled={transitioning === 'k_overeni'}
              className="inline-flex items-center gap-2 bg-amber-600 px-4 py-2 text-sm font-bold text-white hover:bg-amber-700 disabled:opacity-60"
            >
              {transitioning === 'k_overeni' ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
              Převést k ověření
            </button>
          </div>
        )}

        {/* K ověření — review and approve */}
        {offerStatus === 'k_overeni' && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowPresentation(!showPresentation)}
              className="inline-flex items-center gap-2 border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
            >
              {showPresentation ? 'Skrýt prezentaci' : 'Zobrazit koncept'}
            </button>
            <button
              onClick={() => handleTransition('schvaleno')}
              disabled={transitioning === 'schvaleno'}
              className="inline-flex items-center gap-2 bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {transitioning === 'schvaleno' ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
              Schválit koncept
            </button>
          </div>
        )}

        {/* Schváleno — ready to send */}
        {offerStatus === 'schvaleno' && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowPresentation(!showPresentation)}
              className="inline-flex items-center gap-2 border border-border px-4 py-2 text-sm font-semibold hover:bg-muted"
            >
              {showPresentation ? 'Skrýt prezentaci' : 'Zobrazit koncept'}
            </button>
            <button
              onClick={() => {
                if (window.confirm('Opravdu odeslat nabídku zákazníkovi? Tato akce je nevratná.')) {
                  handleTransition('odeslano', true);
                }
              }}
              disabled={transitioning === 'odeslano'}
              className="inline-flex items-center gap-2 bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-secondary disabled:opacity-60"
            >
              {transitioning === 'odeslano' ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              Odeslat zákazníkovi
            </button>
            <p className="text-xs text-muted-foreground">Po odeslání použijte existující e-mailový nástroj pro odeslání zprávy.</p>
          </div>
        )}

        {/* Odesláno */}
        {offerStatus === 'odeslano' && (
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <CheckCircle2 size={16} />
            <strong>Nabídka odeslána zákazníkovi.</strong>
            <button onClick={() => setShowPresentation(!showPresentation)} className="ml-3 text-xs text-muted-foreground underline">
              {showPresentation ? 'Skrýt' : 'Zobrazit'} prezentaci
            </button>
          </div>
        )}
      </div>

      {/* Concept presentation */}
      {showPresentation && (concept || offerStatus !== 'nova_poptavka') && (
        <div className="border-t border-border bg-muted/30 p-6">
          {concept ? (
            <OfferConceptPresentation
              concept={concept.concept}
              product={concept.product}
              pricing={concept.pricing}
              visualizationUrl={concept.visualization_url}
              offerStatus={offerStatus}
              clientInfo={inquiry}
              onOrder={onOrder}
            />
          ) : (
            <p className="text-sm text-muted-foreground">Načtěte koncept pomocí tlačítka „Vytvořit nabídku".</p>
          )}
        </div>
      )}
    </div>
  );
}