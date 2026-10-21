import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { buildPages, downloadCanvas } from '@/lib/offerSheet';
import ImageOfferPage from './ImageOfferPage';
import ImageOfferToolbar from './ImageOfferToolbar';
import ImageOfferScenes from './ImageOfferScenes';

// Vícestránková obrazová nabídka (A4 PNG) podle šablony MLŽIDLA.cz + správa vizualizací v prostoru.
export default function ImageOfferGallery({ projectOrderId }) {
  const [data, setData] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [error, setError] = useState('');
  const canvases = useRef({});

  useEffect(() => {
    base44.functions.invoke('getImageOfferData', { project_order_id: projectOrderId })
      .then((r) => setData(r.data)).catch((e) => setError(e?.response?.data?.error || e.message));
  }, [projectOrderId]);

  const approvedKey = scenes.filter((s) => s.approved).map((s) => s.id).join(',');
  const pages = useMemo(() => (data ? buildPages({ ...data, scenes: scenes.filter((s) => s.approved) }) : []), [data, approvedKey]);

  if (error && !data) return <p role="alert" className="text-destructive">{error}</p>;
  if (!data) return <p className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin" size={16} /> Načítám originální podklady…</p>;

  return (
    <div className="space-y-10">
      <p className="text-sm text-muted-foreground">Klient: <b className="text-foreground">{[data.client.name, data.client.company].filter(Boolean).join(' / ')}</b> · Nabídka {data.client.quote} · {pages.length} stran A4</p>
      <ImageOfferScenes projectOrderId={projectOrderId} data={data} scenes={scenes} onScenes={setScenes} />
      <section>
        <ImageOfferToolbar projectOrderId={projectOrderId} quote={data.client.quote} pages={pages} canvases={canvases} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map((p, i) => (
            <figure key={p.key} className="overflow-hidden border border-border bg-card shadow-sm">
              <ImageOfferPage page={p} onReady={(key, canvas) => { canvases.current[key] = canvas; }} />
              <figcaption className="flex items-center justify-between gap-2 p-3">
                <span className="truncate text-sm font-semibold">{i + 1}. {p.title}</span>
                <button onClick={() => canvases.current[p.key] && downloadCanvas(canvases.current[p.key], `${data.client.quote}-${String(i + 1).padStart(2, '0')}-${p.key}.png`)} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-bold"><Download size={13} /> PNG</button>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}