import React, { useState, useEffect, useRef } from 'react';
import { Instagram, Loader, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CONNECTOR_ID = '6a48154c19f44e6e0269b046';

export default function AdminInstagram() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const popupTimer = useRef(null);

  const fetchFeed = async () => {
    setSyncing(true);
    setError(null);
    try {
      const res = await base44.functions.invoke('getInstagramFeed', {});
      setPosts(res.data.posts || []);
      setConnected(true);
    } catch (e) {
      setConnected(false);
    } finally {
      setSyncing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
    return () => clearInterval(popupTimer.current);
  }, []);

  const handleConnect = async () => {
    const url = await base44.connectors.connectAppUser(CONNECTOR_ID);
    const popup = window.open(url, '_blank');
    popupTimer.current = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(popupTimer.current);
        fetchFeed();
      }
    }, 500);
  };

  const handleDisconnect = async () => {
    await base44.connectors.disconnectAppUser(CONNECTOR_ID);
    setConnected(false);
    setPosts([]);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg font-medium flex items-center gap-2">
          <Instagram size={18} /> Instagram feed
          <a href="https://www.instagram.com/mlzidla" target="_blank" rel="noopener noreferrer"
            className="text-xs font-mono text-white/30 hover:text-cyan transition-colors ml-2">@mlzidla ↗</a>
        </h2>
        {connected && (
          <div className="flex gap-2">
            <button onClick={fetchFeed} disabled={syncing}
              className="px-3 py-1.5 rounded-full text-xs font-mono border border-white/10 text-white/60 hover:text-white transition-all flex items-center gap-1.5 disabled:opacity-50">
              <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} /> Synchronizovat
            </button>
            <button onClick={handleDisconnect}
              className="px-3 py-1.5 rounded-full text-xs font-mono border border-red-500/20 text-red-400 hover:text-red-300 transition-all">
              Odpojit
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader size={24} className="animate-spin text-cyan/40" /></div>
      ) : !connected ? (
        <div className="p-10 rounded-xl bg-white/3 border border-white/8 text-center">
          <Instagram size={28} className="text-white/30 mx-auto mb-4" />
          <p className="text-white/60 mb-5 text-sm">Připojte účet @mlzidla pro zobrazení feedu na webu.</p>
          <button onClick={handleConnect}
            className="px-6 py-2.5 rounded-full bg-cyan text-ink text-sm font-medium hover:bg-cyan/90 transition-all">
            Připojit Instagram
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {posts.map((post) => (
            <a key={post.instagram_id} href={post.permalink} target="_blank" rel="noopener noreferrer"
              className="relative aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/8">
              <img src={post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url} alt="" className="w-full h-full object-cover" />
            </a>
          ))}
          {posts.length === 0 && <p className="text-white/40 text-sm col-span-full">Žádné příspěvky nenalezeny.</p>}
        </div>
      )}
      {error && <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
    </div>
  );
}