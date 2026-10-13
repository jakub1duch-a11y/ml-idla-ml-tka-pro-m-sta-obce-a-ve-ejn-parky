import React from 'react';
import { Check, Trash2, X } from 'lucide-react';

// Náhled AI vizualizace vedle originální konstrukce; do nabídky se dostane až po schválení.
export default function ImageOfferSceneCard({ scene, variant, onToggle, onRemove }) {
  return (
    <article className="overflow-hidden rounded-xl border border-border bg-background">
      <div className="relative">
        <img src={scene.url} alt={scene.title} className="aspect-[4/3] w-full object-cover" />
        {variant?.images?.[0] && <img src={variant.images[0]} alt="Originální konstrukce" title="Originální konstrukce" className="absolute bottom-2 right-2 h-28 w-20 rounded-md border-2 border-white bg-white object-contain shadow" />}
        <span className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-[11px] font-bold ${scene.approved ? 'bg-primary text-primary-foreground' : 'bg-background/90 text-foreground'}`}>
          {scene.approved ? 'Schváleno do nabídky' : 'Čeká na kontrolu konstrukce'}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2 p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{scene.envLabel}</p>
          <p className="truncate text-xs text-muted-foreground">{variant?.title}</p>
        </div>
        <div className="flex shrink-0 gap-1.5">
          <button onClick={onToggle} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-bold">
            {scene.approved ? <><X size={13} /> Vyřadit</> : <><Check size={13} /> Schválit</>}
          </button>
          <button onClick={onRemove} aria-label="Smazat vizualizaci" className="rounded-full border border-border p-1.5 text-muted-foreground hover:text-destructive"><Trash2 size={14} /></button>
        </div>
      </div>
    </article>
  );
}