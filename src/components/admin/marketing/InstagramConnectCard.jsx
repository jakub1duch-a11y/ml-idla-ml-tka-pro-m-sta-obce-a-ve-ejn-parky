import React, { useState, useEffect } from 'react';
import { Instagram, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CONNECTOR_ID = '6a48154c19f44e6e0269b046';

export default function InstagramConnectCard() {
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('');

  const checkConnection = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke('getInstagramFeed', {});
      setUsername(res.data.username || '');
      setConnected(true);
    } catch {
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { checkConnection(); }, []);

  const handleConnect = async () => {
    const res = await base44.connectors.connectAppUser(CONNECTOR_ID);
    const url = typeof res === 'string' ? res : res?.url;
    const popup = window.open(url, '_blank');
    const timer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(timer);
        checkConnection();
      }
    }, 500);
  };

  return (
    <div className="p-5 rounded-xl bg-white/3 border border-white/8 flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan/10 border border-cyan/20 flex items-center justify-center shrink-0">
          <Instagram size={18} className="text-cyan" />
        </div>
        <div>
          <p className="text-white text-sm font-medium">Instagram účet</p>
          {loading ? (
            <p className="text-white/35 text-xs font-mono">Kontroluji připojení...</p>
          ) : connected ? (
            <p className="text-emerald-400 text-xs font-mono flex items-center gap-1"><CheckCircle2 size={12} /> Připojeno{username && ` · @${username}`}</p>
          ) : (
            <p className="text-white/35 text-xs font-mono">Nepřipojeno</p>
          )}
        </div>
      </div>
      {!loading && !connected && (
        <button onClick={handleConnect}
          className="px-4 py-2 rounded-full bg-cyan text-ink text-xs font-medium hover:bg-cyan/90 transition-all">
          Připojit Instagram
        </button>
      )}
    </div>
  );
}