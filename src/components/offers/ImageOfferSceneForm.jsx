import React, { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const field = 'mt-1 block w-full min-w-[220px] rounded-lg border border-border bg-background px-3 py-2.5 text-sm';

// Zadání nové fotorealistické vizualizace: produkt + prostředí → ChatGPT obrazový model podle originální fotografie.
export default function ImageOfferSceneForm({ projectOrderId, variants, environments, onCreated }) {
  const [variantKey, setVariantKey] = useState(variants[0]?.key);
  const [envKey, setEnvKey] = useState(environments[0]?.key);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const generate = async () => {
    setBusy(true); setError('');
    try {
      await base44.functions.invoke('generateOfferScene', { project_order_id: projectOrderId, variant_key: variantKey, environment_key: envKey });
      await onCreated();
    } catch (e) { setError(e?.response?.data?.error || e.message); } finally { setBusy(false); }
  };

  return (
    <div className="mt-5 flex flex-wrap items-end gap-3">
      <label className="text-xs font-semibold text-muted-foreground">Produkt
        <select value={variantKey} onChange={(e) => setVariantKey(e.target.value)} className={field}>{variants.map((v) => <option key={v.key} value={v.key}>{v.title}</option>)}</select>
      </label>
      <label className="text-xs font-semibold text-muted-foreground">Prostředí
        <select value={envKey} onChange={(e) => setEnvKey(e.target.value)} className={field}>{environments.map((e) => <option key={e.key} value={e.key}>{e.label}</option>)}</select>
      </label>
      <button onClick={generate} disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50">
        {busy ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />} {busy ? 'Generuji, obvykle do 1 minuty…' : 'Generovat vizualizaci'}
      </button>
      {error && <p role="alert" className="w-full text-sm text-destructive">{error}</p>}
    </div>
  );
}