import React, { useEffect, useMemo, useState } from 'react';
import { BookImage, Check, Loader2, Plus } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const parseKeys = (name) => {
  const m = String(name).match(/-ai-scene-(.+?)--(.+?)--(?:(.+?)--)?\d+/) || [];
  return { variantKey: m[1], envKey: m[2], angleKey: m[3] };
};

// Knihovna schválených vizualizací z dřívějších nabídek a AI vizualizací: znovupoužití zdarma, bez generování a bez kreditů.
export default function ImageOfferLibrary({ projectOrderId, data, scenes, onUsed }) {
  const [items, setItems] = useState(null);
  const [busy, setBusy] = useState('');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    base44.entities.OfferAsset.filter(
      { asset_type: 'generated_visualization', selected_for_offer: true },
      { sort: '-created_date', limit: 100 },
    ).then(({ items: rows }) => setItems(rows.filter((r) => r.project_order_id !== projectOrderId)));
  }, [projectOrderId, scenes.length]);

  const usedUrls = new Set(scenes.map((s) => s.url));
  const shown = useMemo(() => (items || []).filter((a) => !filter || String(a.title).toLowerCase().includes(filter.toLowerCase())), [items, filter]);
  const filters = useMemo(() => data.variants.map((v) => v.title.replace(/^ML[ŽZ]\w*\s+/i, '').trim()), [data.variants]);

  const use = async (a) => {
    setBusy(a.id);
    const keys = parseKeys(a.file_name);
    const key = keys.variantKey ? `${keys.variantKey}--${keys.envKey}--${keys.angleKey ? `${keys.angleKey}--` : ''}` : 'library--library--';
    await base44.entities.OfferAsset.create({
      inquiry_id: a.inquiry_id, inquiry_type: a.inquiry_type, project_order_id: projectOrderId,
      file_url: a.file_url, file_type: a.file_type, asset_type: 'generated_visualization', title: a.title,
      file_name: `${data.client.quote}-ai-scene-${key}${Date.now()}.png`,
      description: 'Znovu použitá schválená vizualizace z knihovny (bez generování).',
      selected_for_offer: true, generated_by_ai: true,
    });
    await onUsed();
    setBusy('');
  };

  if (!items?.length) return null;
  return (
    <div className="mt-8 border-t border-border pt-6">
      <h3 className="flex items-center gap-2 font-heading text-xl"><BookImage size={18} /> Knihovna hotových vizualizací <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">zdarma</span></h3>
      <p className="mt-1 max-w-3xl text-sm text-muted-foreground">Dříve schválené vizualizace z jiných nabídek a z AI vizualizací ({items.length}). Použití v této nabídce nestojí žádné kredity a vizualizace je rovnou schválená.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {['', ...filters].map((f) => (
          <button key={f || 'all'} onClick={() => setFilter(f)} className={`rounded-full border px-3 py-1 text-xs font-bold ${filter === f ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>{f || 'Vše'}</button>
        ))}
      </div>
      {!shown.length && <p className="mt-4 text-sm text-muted-foreground">Pro tento filtr zatím nic není.</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {shown.map((a) => {
          const used = usedUrls.has(a.file_url);
          return (
            <article key={a.id} className="overflow-hidden rounded-xl border border-border bg-background">
              <img src={a.file_url} alt={a.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <div className="flex items-center justify-between gap-2 p-3">
                <p className="min-w-0 truncate text-sm font-semibold" title={a.title}>{a.title}</p>
                <button disabled={used || busy === a.id} onClick={() => use(a)} className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-bold disabled:opacity-60">
                  {busy === a.id ? <Loader2 size={13} className="animate-spin" /> : used ? <Check size={13} /> : <Plus size={13} />} {used ? 'Použito' : 'Použít'}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}