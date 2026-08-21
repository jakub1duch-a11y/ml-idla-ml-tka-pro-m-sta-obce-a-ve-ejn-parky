import React, { useEffect, useMemo, useState } from 'react';
import { Camera, Cuboid, ImageIcon, Loader, MessageSquare, Ruler, ScanLine } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const STATUS = {
  draft: { label: 'Rozpracováno', cls: 'border-white/15 text-white/45 bg-white/5' },
  captured: { label: 'Fotografie', cls: 'border-cyan/30 text-cyan bg-cyan/10' },
  inquiry_sent: { label: 'Poptávka odeslána', cls: 'border-emerald-400/30 text-emerald-400 bg-emerald-400/10' },
};

const fmt = (value) => String(value ?? '').replace('.', ',');

export default function AdminAR() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    base44.entities.ARSession.list('-created_date')
      .then((items) => setSessions(items || []))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => filter === 'all' ? sessions : sessions.filter((s) => s.status === filter), [sessions, filter]);
  const sentCount = sessions.filter((s) => s.status === 'inquiry_sent').length;
  const capturedCount = sessions.filter((s) => !!s.capture_url).length;
  const conversion = sessions.length ? Math.round((sentCount / sessions.length) * 100) : 0;

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan/60">3D / AR lead pipeline</p>
          <h2 className="mt-1 text-lg font-medium text-white">AR návrhy ({sessions.length})</h2>
        </div>
        <div className="flex gap-2">
          {['all', 'draft', 'captured', 'inquiry_sent'].map((key) => (
            <button key={key} onClick={() => setFilter(key)} className={`rounded-full px-3 py-1.5 text-xs font-mono transition-all ${filter === key ? 'bg-cyan text-ink' : 'border border-white/10 text-white/40 hover:text-white/70'}`}>
              {key === 'all' ? 'Vše' : STATUS[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/8 bg-white/3 p-4"><ScanLine size={16} className="text-cyan"/><p className="mt-3 text-2xl font-light text-white">{sessions.length}</p><p className="mt-1 text-xs text-white/35">uložených AR konfigurací</p></div>
        <div className="rounded-xl border border-white/8 bg-white/3 p-4"><ImageIcon size={16} className="text-cyan"/><p className="mt-3 text-2xl font-light text-white">{capturedCount}</p><p className="mt-1 text-xs text-white/35">s fotografií prostoru</p></div>
        <div className="rounded-xl border border-white/8 bg-white/3 p-4"><MessageSquare size={16} className="text-emerald-400"/><p className="mt-3 text-2xl font-light text-white">{conversion} %</p><p className="mt-1 text-xs text-white/35">AR session → poptávka</p></div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader size={24} className="animate-spin text-cyan/40"/></div>
      ) : visible.length === 0 ? (
        <p className="py-16 text-center text-sm text-white/25">Zatím žádné AR návrhy.</p>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {visible.map((session) => {
            const status = STATUS[session.status] || STATUS.draft;
            return (
              <article key={session.id} className="overflow-hidden rounded-xl border border-white/8 bg-white/3">
                <div className="grid sm:grid-cols-[160px_1fr]">
                  <div className="min-h-40 bg-black/20">
                    {session.capture_url ? <img src={session.capture_url} alt="AR návrh prostoru" className="h-full w-full object-cover"/> : <div className="flex h-full min-h-40 items-center justify-center text-white/15"><Camera size={30}/></div>}
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div><p className="text-sm font-semibold text-white">{session.product_name}</p><p className="mt-1 font-mono text-[10px] text-white/30">{session.session_key}</p></div>
                      <span className={`rounded-full border px-2 py-1 text-[10px] font-mono ${status.cls}`}>{status.label}</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-white/5 p-2.5 text-white/55"><Ruler size={12} className="mb-1 text-cyan"/>Ø{fmt(session.profile_diameter_mm)} mm</div>
                      <div className="rounded-lg bg-white/5 p-2.5 text-white/55"><Cuboid size={12} className="mb-1 text-cyan"/>{fmt(session.wall_thickness_mm)} mm stěna</div>
                    </div>
                    {session.note && <p className="mt-3 rounded-lg bg-white/5 p-3 text-xs leading-relaxed text-white/45">{session.note}</p>}
                    <div className="mt-3 flex items-center justify-between gap-3 font-mono text-[10px] text-white/25">
                      <span>{session.ar_reference_version || 'AR model'}</span>
                      <span>{session.created_date ? new Date(session.created_date).toLocaleString('cs-CZ') : ''}</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
