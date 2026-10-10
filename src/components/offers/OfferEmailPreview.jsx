import React, { useState } from 'react';
import { Mail, Eye, Send, Loader2, AlertTriangle, CheckCircle2, Shield, FileText } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// Admin náhled klientského e-mailu nabídky + testovací odeslání + odeslání klientovi
export default function OfferEmailPreview({ projectId, quoteNumber, clientEmail, clientName, offerStatus }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [sendingClient, setSendingClient] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const loadPreview = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await base44.functions.invoke('previewClientOfferEmail', { project_id: projectId });
      const data = response.data;
      if (data?.ok) {
        setPreview(data);
        setShowPreview(true);
      } else {
        setError(data?.error || 'Nepodařilo se načíst náhled.');
      }
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Chyba při načítání náhledu.');
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    setSendingTest(true);
    setError('');
    setSuccess('');
    try {
      const response = await base44.functions.invoke('previewClientOfferEmail', {
        project_id: projectId,
        test_email: true,
      });
      const data = response.data;
      if (data?.ok) {
        setSuccess(`Testovací e-mail odeslán na ${data.recipient}`);
      } else {
        setError(data?.error || 'Nepodařilo se odeslat testovací e-mail.');
      }
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Chyba při odesílání testu.');
    } finally {
      setSendingTest(false);
    }
  };

  const sendToClient = async () => {
    if (!window.confirm(`Opravdu odeslat nabídku na ${clientEmail}? Tato akce je nevratná.`)) return;
    setSendingClient(true);
    setError('');
    setSuccess('');
    try {
      const response = await base44.functions.invoke('sendClientOffer', {
        project_id: projectId,
        confirm_send: true,
      });
      const data = response.data;
      if (data?.ok) {
        setSuccess(`Nabídka odeslána na ${data.recipient}. Schválil: ${data.approved_by}.`);
      } else {
        setError(data?.error || 'Odeslání selhalo.');
      }
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Chyba při odesílání.');
    } finally {
      setSendingClient(false);
    }
  };

  const canSend = offerStatus === 'schvaleno' || offerStatus === 'odeslano';

  return (
    <div className="border-t border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-6 py-3">
        <Mail size={16} className="text-primary" />
        <h4 className="text-sm font-bold">Klientský e-mail nabídky</h4>
        <span className="ml-auto text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
          {quoteNumber || '—'}
        </span>
      </div>

      {/* Safety gate notice */}
      <div className="flex items-start gap-2 border-b border-amber-200 bg-amber-50 px-6 py-2.5">
        <Shield size={13} className="mt-0.5 shrink-0 text-amber-600" />
        <p className="text-[11px] leading-relaxed text-amber-800">
          <strong>Bezpečnostní brána:</strong> E-mail se zákazníkovi neodesílá automaticky. Nejprve schvalte koncept, poté odešlete ručně.
        </p>
      </div>

      <div className="px-6 py-4">
        {error && (
          <div className="mb-3 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            <AlertTriangle size={13} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-3 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            <CheckCircle2 size={13} className="mt-0.5 shrink-0" />
            {success}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={loadPreview}
            disabled={loading}
            className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs font-semibold hover:bg-muted disabled:opacity-60"
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Eye size={13} />}
            {loading ? 'Načítám…' : 'Preview e-mailu'}
          </button>

          <button
            onClick={sendTestEmail}
            disabled={sendingTest || !preview}
            className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs font-semibold hover:bg-muted disabled:opacity-60"
            title="Odešle testovací náhled na jakub1duch@gmail.com"
          >
            {sendingTest ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            {sendingTest ? 'Odesílám…' : 'Testovací e-mail na Jakub'}
          </button>

          {canSend && (
            <button
              onClick={sendToClient}
              disabled={sendingClient}
              className="inline-flex items-center gap-2 bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-secondary disabled:opacity-60"
            >
              {sendingClient ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
              {sendingClient ? 'Odesílám…' : 'Odeslat klientovi'}
            </button>
          )}
        </div>

        {/* Preview info */}
        {preview && !showPreview && (
          <div className="mt-3 text-xs text-muted-foreground">
            Připraveno: {preview.visualizations_count} vizualizací, {preview.attachments?.length || 0} příloh,
            SUPLA: {preview.smart_control_included ? 'ano' : 'ne'}
          </div>
        )}

        {/* Email preview */}
        {preview && showPreview && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Náhled e-mailu</span>
              <button
                onClick={() => setShowPreview(false)}
                className="text-[10px] text-muted-foreground underline"
              >
                Skrýt
              </button>
            </div>
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="border-b border-border bg-muted/50 px-3 py-2 text-xs">
                <div><strong>Předmět:</strong> {preview.subject}</div>
                <div className="text-muted-foreground"><strong>Příjemce:</strong> {preview.recipient}</div>
              </div>
              <iframe
                srcDoc={preview.html}
                title="Náhled e-mailu"
                className="h-[500px] w-full border-0"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}