import React from 'react';
import { CircleHelp } from 'lucide-react';

/** Accessible technical data cards: keep supplied values intact and never infer missing specs. */
export default function PdSpecTable({ title, rows, icon: Icon }) {
  if (!rows.length) return null;
  return (
    <section className="min-w-0 overflow-hidden rounded-[1.75rem] border border-[#D8E8ED] bg-white shadow-[0_16px_48px_rgba(7,26,47,.055)]">
      <div className="flex items-center gap-4 border-b border-[#E6F0F3] bg-[linear-gradient(110deg,#F0FBFD,#FFFFFF)] p-5 sm:p-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#DDF5FA] text-[#087E9D]">
          <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
        </span>
        <h3 className="font-heading text-xl font-bold leading-snug text-[#0A2342]">{title}</h3>
      </div>
      <dl className="divide-y divide-[#E6F0F3]">
        {rows.map(({ label, value, icon: ItemIcon }) => (
          <div key={label} className="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_minmax(0,1.1fr)] sm:items-center sm:gap-5 sm:px-6">
            <dt className="flex items-center gap-3 text-sm font-medium text-[#466373]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0F8FA] text-[#0B8BA7]">
                {ItemIcon ? <ItemIcon size={17} strokeWidth={1.65} aria-hidden="true" /> : <CircleHelp size={16} aria-hidden="true" />}
              </span>
              <span>{label}</span>
            </dt>
            <dd className="min-w-0 break-words pl-12 text-sm font-semibold leading-6 text-[#102F41] sm:pl-0 sm:text-right">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}