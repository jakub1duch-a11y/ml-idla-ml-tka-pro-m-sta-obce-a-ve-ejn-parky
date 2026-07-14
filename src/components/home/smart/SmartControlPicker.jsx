import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wifi, Hand, Clock, Sparkles, ArrowRight } from 'lucide-react';

const OPTIONS = [
  { value: 'wifi_smart_app', label: 'Wi-Fi Smart APP', icon: Wifi },
  { value: 'manualni_ventil', label: 'Manuální ventil', icon: Hand },
  { value: 'casovy_spinac', label: 'Časový spínač', icon: Clock },
  { value: 'doporucit', label: 'Doporučit řešení', icon: Sparkles },
];

export default function SmartControlPicker() {
  const [selected, setSelected] = useState('wifi_smart_app');

  return (
    <div>
      <p className="text-xs font-mono tracking-widest uppercase text-white/40 mb-3">Vyberte typ ovládání pro poptávku</p>
      <div className="flex flex-wrap gap-2 mb-5">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setSelected(o.value)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium border transition-all ${
              selected === o.value
                ? 'bg-cyan-400 text-slate-900 border-cyan-400'
                : 'bg-white/5 text-white/70 border-white/15 hover:border-white/40'
            }`}
          >
            <o.icon size={13} /> {o.label}
          </button>
        ))}
      </div>
      <Link
        to={`/poptavka?ovladani=${selected}`}
        className="btn-metallic-mist px-7 py-3.5 text-sm font-bold w-full sm:w-auto justify-center"
      >
        Nezávazná poptávka <ArrowRight size={15} />
      </Link>
    </div>
  );
}