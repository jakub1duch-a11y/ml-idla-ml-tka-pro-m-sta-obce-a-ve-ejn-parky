import React, { useState } from 'react';
import { CloudUpload, Download, ExternalLink, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { downloadCanvas } from '@/lib/offerSheet';

const num = (i) => String(i + 1).padStart(2, '0');

// Hromadné stažení stran (PNG) a uložení do složky případu na Mlžném disku. Klientovi se nic neodesílá.
export default function ImageOfferToolbar({ projectOrderId, quote, pages, canvases }) {
  const [progress, setProgress] = useState('');
  const [saved, setSaved] = useState(null);
  const [error, setError] = useState('');
  const ready = () => pages.map((p, i) => ({ p, i, canvas: canvases.current[p.key] })).filter((x) => x.canvas);
  const fileName = (p, i) => `${quote}-${num(i)}-${p.key}.png`;

  const downloadAll = async () => {
    for (const { p, i, canvas } of ready()) {
      downloadCanvas(canvas, fileName(p, i));
      await new Promise((r) => setTimeout(r, 350));
    }
  };

  const saveAll = async () => {
    setError(''); setSaved(null);
    const list = ready();
    let folder = '';
    try {
      for (const [n, { p, i, canvas }] of list.entries()) {
        setProgress(`Ukládám ${n + 1}/${list.length}`);
        const blob = await new Promise((r) => canvas.toBlob(r, 'image/png'));
        const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file: new File([blob], fileName(p, i), { type: 'image/png' }) });
        const r = await base44.functions.invoke('saveImageOfferToDrive', { project_order_id: projectOrderId, images: [{ key: `${num(i)}-${p.key}`, title: p.title, file_uri, ai: !!p.ai }] });
        folder = r.data.folder_url;
      }
      setSaved({ count: list.length, folder });
    } catch (e) { setError(e?.response?.data?.error || e.message); } finally { setProgress(''); }
  };

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <button onClick={saveAll} disabled={!!progress} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground disabled:opacity-50">
        {progress ? <Loader2 size={15} className="animate-spin" /> : <CloudUpload size={15} />} {progress || 'Uložit všechny strany na Mlžný disk'}
      </button>
      <button onClick={downloadAll} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-bold"><Download size={15} /> Stáhnout vše (PNG)</button>
      {saved && <a href={saved.folder} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline"><ExternalLink size={14} /> Uloženo {saved.count} stran – otevřít složku</a>}
      <span className="text-xs text-muted-foreground">Nic se klientovi neodesílá.</span>
      {error && <p role="alert" className="w-full text-sm text-destructive">{error}</p>}
    </div>
  );
}