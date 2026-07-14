import React from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, Layers, BellRing } from 'lucide-react';

const AUTOMATIONS = [
  { icon: CalendarClock, label: 'Denní plánovač', sub: 'Mlžení dle hodin a dní v týdnu' },
  { icon: Layers, label: 'Skupinové scény', sub: 'Ovládání více zón najednou' },
  { icon: BellRing, label: 'Automatické reakce', sub: 'Spuštění dle senzorů v reálném čase' },
];

export default function SmartAutomationList() {
  return (
    <div className="space-y-2.5">
      {AUTOMATIONS.map((a, i) => (
        <motion.div key={a.label} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="w-9 h-9 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center shrink-0">
            <a.icon size={16} className="text-cyan-300" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{a.label}</p>
            <p className="text-[11px] text-white/50 truncate">{a.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}