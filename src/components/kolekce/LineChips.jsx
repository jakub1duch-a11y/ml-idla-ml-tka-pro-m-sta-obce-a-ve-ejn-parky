import React from 'react';
import { linesOfFamily } from '@/lib/productFamilies';

export default function LineChips({ familyId, activeLine, onSelect, counts = {} }) {
  const lines = linesOfFamily(familyId).filter((l) => (counts[l.key] ?? 0) > 0);
  if (lines.length <= 1) return null;
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={() => onSelect(null)} className={activeLine ? 'badge-brand-secondary cursor-pointer' : 'badge-brand-primary cursor-pointer'}>
        Všechny řady
      </button>
      {lines.map((l) => (
        <button key={l.key} type="button" onClick={() => onSelect(activeLine === l.key ? null : l.key)} className={`${activeLine === l.key ? 'badge-brand-primary' : 'badge-brand-secondary'} cursor-pointer`}>
          {l.label} <span className="ml-1.5 font-mono opacity-60">{counts[l.key]}</span>
        </button>
      ))}
    </div>
  );
}