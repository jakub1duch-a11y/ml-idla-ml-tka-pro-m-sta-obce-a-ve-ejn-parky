import React from 'react';
import { Thermometer, Droplet, Wifi, Scale } from 'lucide-react';

const BADGES = [
{ icon: Thermometer, label: 'Chlazení až o 10 °C' },
{ icon: Droplet, label: 'Nízký tlak 2-7 BAR' },
{ icon: Wifi, label: 'Chytré ovládání (WiFi)' },
{ icon: Scale, label: 'Nízká spotřeba vody' }];

export default function DarkFeatureBadges() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {BADGES.map((b) => (
        <div key={b.label} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
          <b.icon size={18} className="text-cyan shrink-0" />
          <p className="text-xs sm:text-sm text-white font-medium leading-tight">{b.label}</p>
        </div>
      ))}
    </div>
  );
}