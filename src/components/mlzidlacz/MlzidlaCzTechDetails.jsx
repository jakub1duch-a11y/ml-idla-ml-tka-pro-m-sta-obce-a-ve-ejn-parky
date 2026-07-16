import React from 'react';
import { Layers, Clock, Droplet, Sparkles, Lightbulb, Ruler, Plug } from 'lucide-react';

const TECH = [
  { icon: Layers, label: 'Materiál', value: 'Nerezová ocel' },
  { icon: Clock, label: 'Automatické ovládání', value: 'Časové / pohybové čidlo' },
  { icon: Droplet, label: 'Nízkotlaké trysky', value: 'Nerezové, anti-drip' },
  { icon: Sparkles, label: 'Povrchová úprava', value: 'Broušený / leštěný' },
  { icon: Lightbulb, label: 'Možnost RGB osvětlení', value: 'LED technologie' },
  { icon: Ruler, label: 'Zakázkové rozměry', value: 'Dle projektové dokumentace' },
  { icon: Plug, label: 'Přípojení vody', value: 'Rychlospojka 1/2"' },
  { icon: Droplet, label: 'Nízká spotřeba vody', value: 'Od 1,2 l/min' },
];

const GALLERY = [
  { img: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/f436db8ab_generated_image.png', caption: 'Zábava a ochlazení v horkých dnech' },
  { img: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/6b51ec82a_19dca9db2_Social_Media_Video_Ads_A_close-up_captures_numerous_water_droplets_OIctonFe.png', caption: 'Nerezové nízkotlaké trysky' },
  { img: 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/0549d625f_generated_image.png', caption: 'Realizace v městském parku' },
];

export default function MlzidlaCzTechDetails() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <p className="text-xs font-bold text-slate-900 tracking-widest uppercase mb-5">Technické údaje</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
          {TECH.map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.label} className="flex items-start gap-3">
                <span className="w-8 h-8 shrink-0 rounded-lg bg-blue-50 flex items-center justify-center mt-0.5">
                  <Icon size={14} className="text-blue-600" strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block text-[11px] font-bold text-slate-800 uppercase tracking-wide">{t.label}</span>
                  <span className="block text-xs text-slate-400">{t.value}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <p className="text-xs font-bold text-slate-900 tracking-widest uppercase mb-5">Realizace a detaily</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {GALLERY.map((g) => (
            <div key={g.caption} className="rounded-xl overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                <img src={g.img} alt={g.caption} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 leading-snug">{g.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}