import React, { useState } from 'react';
import { Hash, MessagesSquare } from 'lucide-react';
import TeamThread from '@/components/admin/team/TeamThread';

const CHANNELS = [
  { id: 'general', label: 'Obecné', hint: 'Denní koordinace týmu' },
  { id: 'sales', label: 'Obchod & poptávky', hint: 'Nabídky, klienti, follow-up' },
  { id: 'production', label: 'Výroba & montáže', hint: 'Dílna, instalace, servis' },
  { id: 'marketing', label: 'Marketing', hint: 'Web, sociální sítě, obsah' },
];

export default function AdminTeamChat() {
  const [active, setActive] = useState('general');
  const channel = CHANNELS.find((c) => c.id === active);

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col p-4 md:h-screen md:p-6">
      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan">Interní komunikace</p>
        <h2 className="mt-1 text-xl font-medium text-white">Týmový chat</h2>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 md:hidden">
        {CHANNELS.map((c) => (
          <button key={c.id} onClick={() => setActive(c.id)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-mono ${active === c.id ? 'border-cyan/30 bg-cyan/10 text-cyan' : 'border-white/10 text-white/50'}`}>
            #{c.label}
          </button>
        ))}
      </div>
      <div className="mt-3 grid min-h-0 flex-1 gap-4 md:grid-cols-[220px_1fr]">
        <div className="hidden overflow-hidden rounded-xl border border-white/8 md:block">
          <div className="flex items-center gap-2 bg-white/5 px-4 py-3"><MessagesSquare size={13} className="text-cyan" /><p className="font-mono text-[10px] uppercase tracking-widest text-white/35">Kanály</p></div>
          <div className="p-2 space-y-1">
            {CHANNELS.map((c) => (
              <button key={c.id} onClick={() => setActive(c.id)}
                className={`w-full rounded-lg px-3 py-2.5 text-left transition ${active === c.id ? 'bg-cyan/10 text-cyan' : 'text-white/55 hover:bg-white/5 hover:text-white'}`}>
                <p className="flex items-center gap-1.5 text-sm"><Hash size={13} />{c.label}</p>
                <p className="mt-0.5 text-[10px] text-white/30">{c.hint}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="flex min-h-0 flex-col rounded-xl border border-white/8 bg-white/3 p-4">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-white/30">#{channel.label} · {channel.hint}</p>
          <TeamThread channel={channel.id} />
        </div>
      </div>
    </div>
  );
}