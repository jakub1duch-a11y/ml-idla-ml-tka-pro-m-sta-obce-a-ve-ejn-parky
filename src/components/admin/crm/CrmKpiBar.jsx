import React from 'react';
import { TrendingUp, Target, Users, Award, DollarSign, Calendar, Briefcase, UserCheck } from 'lucide-react';

const money = (v) => new Intl.NumberFormat('cs-CZ').format(Number(v || 0));

export default function CrmKpiBar({ kpis }) {
  const cards = [
    { icon: DollarSign, label: 'Pipeline hodnota', value: `${money(kpis.pipelineValue)} Kč`, sub: `${kpis.activeDeals} aktivních dealů`, color: 'text-cyan', border: 'border-cyan/20 bg-cyan/5' },
    { icon: Award, label: 'Vyhráno (hodnota)', value: `${money(kpis.wonValue)} Kč`, sub: `${kpis.wonCount} úspěšných dealů`, color: 'text-emerald-400', border: 'border-emerald-400/20 bg-emerald-400/5' },
    { icon: Target, label: 'Win rate', value: `${kpis.winRate}%`, sub: `${kpis.wonCount} výhry / ${kpis.lostCount} prohry`, color: 'text-violet-400', border: 'border-violet-400/20 bg-violet-400/5' },
    { icon: TrendingUp, label: 'Průměrný deal', value: `${money(kpis.avgDeal)} Kč`, sub: 'průměrná hodnota výhry', color: 'text-amber-400', border: 'border-amber-400/20 bg-amber-400/5' },
    { icon: Users, label: 'Klienti', value: kpis.totalLeads, sub: 'poptávky a kontakty', color: 'text-sky-400', border: 'border-sky-400/20 bg-sky-400/5' },
    { icon: UserCheck, label: 'Prospecti', value: kpis.totalProspects, sub: 'LinkedIn sledování', color: 'text-rose-400', border: 'border-rose-400/20 bg-rose-400/5' },
    { icon: Calendar, label: 'Otevřené aktivity', value: kpis.openActivities, sub: 'naplánováno / po termínu', color: 'text-orange-400', border: 'border-orange-400/20 bg-orange-400/5' },
    { icon: Briefcase, label: 'Aktivní dealy', value: kpis.activeDeals, sub: 'v pipeline', color: 'text-cyan', border: 'border-cyan/20 bg-cyan/5' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} className={`rounded-xl border ${c.border} p-4`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">{c.label}</span>
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 ${c.color}`}>
                <Icon size={14} />
              </div>
            </div>
            <p className="text-white text-xl font-heading font-medium truncate">{c.value}</p>
            <p className="mt-1 text-[10px] text-white/30">{c.sub}</p>
          </div>
        );
      })}
    </div>
  );
}