import React from 'react';
import { CalendarDays, Clock3, Sun } from 'lucide-react';
import { calculateOperatingCosts, HOURS_PER_DAY } from '@/lib/operatingCosts';

const number = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 1 });
const cards = (result, seasonDays) => [
  { icon: Clock3, label: '8 hodin mlžení', detail: '1 nadměrně dlouhý den', value: result.day },
  { icon: CalendarDays, label: 'Týden mlžení', detail: `7 dní × ${HOURS_PER_DAY} hodin`, value: result.week },
  { icon: Sun, label: 'Letní sezóna', detail: `${seasonDays} dní × ${HOURS_PER_DAY} hodin`, value: result.season },
];

export default function OperatingCostResults({ nozzles, seasonDays }) {
  const result = calculateOperatingCosts(nozzles, seasonDays);
  return <><div className="grid gap-3 md:grid-cols-3">{cards(result, seasonDays).map(({ icon: Icon, label, detail, value }) => <article key={label} className="rounded-xl border border-slate-200 bg-white p-4"><Icon size={18} className="text-techblue" /><p className="mt-3 text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-1 text-xs text-slate-400">{detail} · {value.hours} h</p><strong className="mt-3 block text-xl text-slate-950">{number.format(value.liters)} l</strong><span className="text-sm font-semibold text-techblue">{number.format(value.cost)} Kč včetně stočného</span></article>)}</div><p className="mt-4 text-xs leading-relaxed text-slate-500">Orientační model při 4 barech počítá se spotřebou {number.format(result.hourlyLiters)} l/h pro {nozzles} {nozzles === 1 ? 'trysku' : 'trysek'}. Osm hodin nepřetržitého mlžení denně je nadměrný provoz; běžné řízení senzorem spotřebu snižuje.</p></>;
}