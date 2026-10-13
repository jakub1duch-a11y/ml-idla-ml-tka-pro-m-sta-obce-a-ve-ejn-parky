import React, { useCallback, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import ImageOfferSceneForm from './ImageOfferSceneForm';
import ImageOfferSceneCard from './ImageOfferSceneCard';
import ImageOfferLibrary from './ImageOfferLibrary';

const parse = (a, envs, angles) => {
  const m = String(a.file_name).match(/-ai-scene-(.+?)--(.+?)--(?:(.+?)--)?\d+/) || [];
  const env = envs.find((e) => e.key === m[2]) || {};
  const angle = angles.find((x) => x.key === m[3]);
  return { id: a.id, url: a.file_url, title: a.title, approved: !!a.selected_for_offer, variantKey: m[1], envLabel: env.label || a.title, angleLabel: angle?.label || '', note: env.note || '' };
};

// Správa fotorealistických vizualizací v prostoru: generování, kontrola proti originálu a schválení do nabídky.
export default function ImageOfferScenes({ projectOrderId, data, scenes, onScenes }) {
  const load = useCallback(async () => {
    const { items } = await base44.entities.OfferAsset.filter(
      { project_order_id: projectOrderId, asset_type: 'generated_visualization', file_name: { $regex: '-ai-scene-' } },
      { sort: '-created_date', limit: 40 },
    );
    onScenes(items.map((a) => parse(a, data.environments, data.angles || [])));
  }, [projectOrderId, data.environments, data.angles, onScenes]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (s) => { await base44.entities.OfferAsset.update(s.id, { selected_for_offer: !s.approved }); await load(); };
  const remove = async (s) => {
    if (!window.confirm('Smazat tuto vizualizaci?')) return;
    await base44.entities.OfferAsset.delete(s.id);
    await load();
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-5 lg:p-6">
      <h2 className="font-heading text-2xl">Fotorealistické vizualizace v prostoru</h2>
      <p className="mt-1 max-w-3xl text-sm text-muted-foreground">Standardní generátor obrázků (cca 1 kredit za vizualizaci) podle originální fotografie produktu. Do nabídky se dostane jen vizualizace, kterou schválíte po kontrole konstrukce proti originálu (vpravo dole v náhledu).</p>
      <ImageOfferSceneForm projectOrderId={projectOrderId} variants={data.variants} environments={data.environments} angles={data.angles || []} onCreated={load} />
      {scenes.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {scenes.map((s) => <ImageOfferSceneCard key={s.id} scene={s} variant={data.variants.find((v) => v.key === s.variantKey)} onToggle={() => toggle(s)} onRemove={() => remove(s)} />)}
        </div>
      ) : <p className="mt-6 text-sm text-muted-foreground">Zatím žádné vizualizace. Použijte hotovou z knihovny níže, nebo vyberte produkt a prostředí a spusťte generování.</p>}
      <ImageOfferLibrary projectOrderId={projectOrderId} data={data} scenes={scenes} onUsed={load} />
    </section>
  );
}