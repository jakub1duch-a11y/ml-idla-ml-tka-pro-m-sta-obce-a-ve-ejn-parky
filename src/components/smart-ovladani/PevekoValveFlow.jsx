import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Droplets, Filter, Gauge, Smartphone, Waves, Wifi, Power, ShieldCheck } from 'lucide-react';

const FLOW = [
  { icon: Droplets, label: 'Přívod vody', note: 'vodovodní řád' },
  { icon: Filter, label: 'Filtrace', note: 'ochrana trysek' },
  { icon: Gauge, label: 'PEVEKO', note: 'ventilová zóna' },
  { icon: Smartphone, label: 'SUPLA', note: 'povel / scénář' },
  { icon: Waves, label: 'MLŽÍTKO', note: 'jemná mlha' },
];

export default function PevekoValveFlow() {
  const [open, setOpen] = useState(true);
  const reduced = useReducedMotion();

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-[#071A2F] text-white shadow-xl">
      <div className="flex flex-col gap-5 border-b border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div>
          <div className="flex items-center gap-2 text-cyan-300">
            <Wifi size={15} />
            <p className="font-mono text-[10px] uppercase tracking-[.18em]">PEVEKO + SUPLA · interaktivní princip</p>
          </div>
          <h3 className="mt-2 font-heading text-xl font-semibold sm:text-2xl">Od povelu v aplikaci k otevření vodní zóny.</h3>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-pressed={open}
          className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${open ? 'border-cyan-300/45 bg-cyan-300/12 text-cyan-100' : 'border-white/15 bg-white/[.06] text-white/75 hover:bg-white/[.1]'}`}
        >
          <Power size={15} /> {open ? 'Ventil otevřen' : 'Ventil zavřen'}
        </button>
      </div>

      <div className="relative px-4 py-7 sm:px-7 sm:py-9">
        <div className="pointer-events-none absolute left-[8%] right-[8%] top-[63px] hidden h-px bg-white/12 lg:block" aria-hidden="true" />
        {open && !reduced && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-[8%] top-[59px] hidden h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,.8)] lg:block"
            animate={{ left: ['8%', '91%'], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
          />
        )}

        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
          {FLOW.map(({ icon: Icon, label, note }, index) => {
            const isValve = label === 'PEVEKO';
            const active = open || index < 2;
            return (
              <motion.div
                key={label}
                animate={reduced ? undefined : { opacity: active ? 1 : .52, y: active ? 0 : 2 }}
                className={`relative min-h-[132px] rounded-2xl border p-4 ${isValve ? (open ? 'border-cyan-300/55 bg-cyan-300/12' : 'border-white/12 bg-white/[.04]') : 'border-white/10 bg-white/[.045]'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? 'bg-cyan-300/12 text-cyan-200' : 'bg-white/[.05] text-white/45'}`}><Icon size={18} /></span>
                  <span className="font-mono text-[9px] text-white/40">0{index + 1}</span>
                </div>
                <p className="mt-5 text-sm font-semibold text-white">{label}</p>
                <p className="mt-1 text-xs leading-5 text-white/62">{note}</p>
                {isValve && <span className={`mt-3 inline-flex rounded-full px-2 py-1 font-mono text-[9px] font-semibold ${open ? 'bg-emerald-300/12 text-emerald-200' : 'bg-white/[.06] text-white/50'}`}>{open ? 'OTEVŘENO' : 'ZAVŘENO'}</span>}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4">
            <div className="flex items-center gap-2 text-white/80"><Smartphone size={15} className="text-cyan-200"/><strong className="text-sm">SUPLA</strong></div>
            <p className="mt-2 text-xs leading-5 text-white/62">U odpovídajícího PEVEKO modelu lze ventil přes Wi‑Fi připojit do systému SUPLA a vzdáleně otevřít nebo zavřít.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[.035] p-4">
            <div className="flex items-center gap-2 text-white/80"><ShieldCheck size={15} className="text-cyan-200"/><strong className="text-sm">Podle konkrétní sestavy</strong></div>
            <p className="mt-2 text-xs leading-5 text-white/62">Záložní baterie, záplavová čidla, GSM nebo další dohledové funkce jsou variantní. Do projektu je uvádíme jen po ověření zvoleného modelu.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
