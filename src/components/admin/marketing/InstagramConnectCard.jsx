import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Instagram, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function InstagramConnectCard() {
  const [status, setStatus] = useState({ loading: true, connected: false, username: '' });
  const checkConnection = async () => {
    setStatus((current) => ({ ...current, loading: true }));
    try {
      const res = await base44.functions.invoke('getInstagramFeed', {});
      setStatus({ loading: false, connected: true, username: res.data.username || 'mlzidla' });
    } catch {
      setStatus({ loading: false, connected: false, username: '' });
    }
  };
  useEffect(() => { checkConnection(); }, []);
  return <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/3 p-5">
    <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan/20 bg-cyan/10"><Instagram size={18} className="text-cyan" /></div><div><p className="text-sm font-medium text-white">Sdílený Instagram @mlzidla</p>{status.loading ? <p className="text-xs font-mono text-white/35">Kontroluji připojení...</p> : status.connected ? <p className="flex items-center gap-1 text-xs font-mono text-emerald-400"><CheckCircle2 size={12} /> Připojeno · @{status.username}</p> : <p className="flex items-center gap-1 text-xs font-mono text-red-400"><AlertCircle size={12} /> Připojení není dostupné</p>}</div></div>
    {!status.loading && !status.connected && <button onClick={checkConnection} className="flex items-center gap-1.5 rounded-full border border-cyan/30 px-4 py-2 text-xs font-medium text-cyan transition-all hover:bg-cyan/10"><RefreshCw size={12} /> Zkusit znovu</button>}
  </div>;
}