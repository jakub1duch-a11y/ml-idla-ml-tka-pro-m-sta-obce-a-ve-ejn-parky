import React, { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const field = 'mt-1 block w-full min-w-[200px] rounded-lg border border-border bg-background px-3 py-2.5 text-sm';
const ALL = 'all';

// Zadání vizualizace: produkt + prostředí + úhel (nebo celá sada úhlů) → standardní generátor obrázků podle originální fotografie.
export default function ImageOfferSceneForm({ projectOrderId, variants, environments, angles, onCreated }) {
  const [variantKey, setVariantKey] = useState(variants[0]?.key);
  const [envKey, setEnvKey] = useState(environments[0]?.key);
  const [angleKey, setAngleKey] = useState(ALL);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  const generate = async () => {
    setError('');
    const list = angleKey === ALL ? angles : angles.filter((a) => a.key === angleKey);
    try {
      for (const [i, a] of list.entries()) {
        setProgress(`Generuji ${i + 1}/${list.length}: ${a.label}…`);
        await base44.functions.invoke('generateOfferScene', { project_order_id: projectOrderId, variant_key: variantKey, environment_key: envKey, angle_key: a.key });
        await onCreated();
      }
    } catch (e) { setError(e?.response?.data?.error || e.message); } finally { setProgress(''); }
  };

  return (
    <div className="mt-5 flex flex-wrap items-end gap-3">
      <label className="text-xs font-semibold text-muted-foreground">Produkt
        <select value={variantKey} onChange={(e) => setVariantKey(e.target.value)} className={field}>{variants.map((v) => <option key={v.key} value={v.key}>{v.title}</option>)}</select>
      </label>
      <label className="text-xs font-semibold text-muted-foreground">Prostředí
        <select value={envKey} onChange={(e) => setEnvKey(e.target.value)} className={field}>{environments.map((e) => <option key={e.key} value={e.key}>{e.label}</option>)}</select>
      </label>
      <label className="text-xs font-semibold text-muted-foreground">Úhel pohledu
        <select value={angleKey} onChange={(e) => setAngleKey(e.target.value)} className={field}>
          <option value={ALL}>Všechny úhly ({angles.length} vizualizací)</option>
          {angles.map((a) => <option key={a.key} value={a.key}>{a.label}</option>)}
        </select>
      </label>
      <button onClick={generate} disabled={!!progress} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50">
        {progress ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />} {progress || 'Generovat vizualizace'}
      </button>
      {error && <p role="alert" className="w-full text-sm text-destructive">{error}</p>}
    </div>
  );
}