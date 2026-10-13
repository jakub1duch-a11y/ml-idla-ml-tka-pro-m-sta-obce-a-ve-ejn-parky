import React, { useEffect, useRef, useState } from 'react';
import { Download, Loader2, CloudUpload, ExternalLink } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { renderOfferCard, canvasToBase64 } from '@/lib/imageOfferCard';

const LOGO = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/314f4a3ac_mlzidla_logo_bez_pozadi.png';

function Card({ variant, client, onReady }) {
  const ref = useRef(null);
  useEffect(() => {
    let alive = true;
    renderOfferCard({ variant, client, logo: LOGO }).then((canvas) => {
      if (!alive || !ref.current) return;
      ref.current.replaceChildren(canvas); canvas.style.width = '100%'; canvas.style.height = 'auto';
      onReady(variant, canvas);
    });
    return () => { alive = false; };
  }, [variant, client]);
  return <div ref={ref} className="aspect-[4/5] w-full bg-muted" />;
}

export default function ImageOfferGallery({ projectOrderId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(null);
  const canvases = useRef({});

  useEffect(() => {
    base44.functions.invoke('getImageOfferData', { project_order_id: projectOrderId })
      .then((r) => setData(r.data)).catch((e) => setError(e?.response?.data?.error || e.message));
  }, [projectOrderId]);

  const download = (variant) => {
    const a = document.createElement('a'); a.href = canvasToBase64(canvases.current[variant.key]);
    a.download = `${data.client.quote}-${variant.key}-obrazova-nabidka.png`; a.click();
  };
  const saveAll = async () => {
    setSaving(true); setError('');
    try {
      const images = data.variants.filter((v) => canvases.current[v.key]).map((v) => ({ key: v.key, title: v.title, base64: canvasToBase64(canvases.current[v.key]) }));
      const r = await base44.functions.invoke('saveImageOfferToDrive', { project_order_id: projectOrderId, images });
      setSaved(r.data);
    } catch (e) { setError(e?.response?.data?.error || e.message); } finally { setSaving(false); }
  };

  if (error && !data) return <p role="alert" className="text-destructive">{error}</p>;
  if (!data) return <p className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin" size={16} /> Načítám originální podklady…</p>;
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button onClick={saveAll} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:opacity-50">{saving ? <Loader2 size={15} className="animate-spin" /> : <CloudUpload size={15} />} Uložit všechny na Mlžný disk</button>
        {saved && <a href={saved.folder_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline"><ExternalLink size={14} /> Uloženo ({saved.saved.length}) – otevřít složku</a>}
        <span className="text-xs text-muted-foreground">Nic se klientovi neodesílá.</span>
      </div>
      {error && <p role="alert" className="mb-4 text-sm text-destructive">{error}</p>}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.variants.map((v) => (
          <div key={v.key} className="overflow-hidden border border-border bg-card shadow-sm">
            <Card variant={v} client={data.client} onReady={(variant, canvas) => { canvases.current[variant.key] = canvas; }} />
            <div className="flex items-center justify-between p-3"><span className="text-sm font-semibold">{v.title}</span><button onClick={() => download(v)} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-bold"><Download size={13} /> PNG</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}