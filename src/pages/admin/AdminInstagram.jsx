import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Instagram, Loader, RefreshCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AdminInstagram() {
  const [state, setState] = useState({ loading: true, syncing: false, error: '', username: '', posts: [] });
  const fetchFeed = async () => {
    setState((current) => ({ ...current, syncing: true, error: '' }));
    try {
      const res = await base44.functions.invoke('getInstagramFeed', {});
      setState({ loading: false, syncing: false, error: '', username: res.data.username || 'mlzidla', posts: res.data.posts || [] });
    } catch (error) {
      setState((current) => ({ ...current, loading: false, syncing: false, error: error?.response?.data?.error || 'Sdílené připojení Instagramu není dostupné.' }));
    }
  };
  useEffect(() => { fetchFeed(); }, []);
  return <div className="p-6">
    <div className="mb-6 flex items-center justify-between gap-4"><div><h2 className="flex items-center gap-2 text-lg font-medium text-white"><Instagram size={18} /> Instagram @mlzidla</h2><p className="mt-1 flex items-center gap-1.5 text-xs font-mono text-emerald-400"><CheckCircle2 size={12} /> Sdílený firemní účet</p></div><button onClick={fetchFeed} disabled={state.syncing} className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-mono text-white/60 transition-all hover:text-white disabled:opacity-50"><RefreshCw size={12} className={state.syncing ? 'animate-spin' : ''} /> Synchronizovat</button></div>
    {state.loading ? <div className="flex justify-center py-20"><Loader size={24} className="animate-spin text-cyan/40" /></div> : state.error ? <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300"><p className="flex items-center gap-2 font-medium"><AlertCircle size={16} /> Instagram se nepodařilo načíst</p><p className="mt-2 text-red-300/70">{state.error}</p></div> : <><p className="mb-4 text-xs font-mono text-white/35">Připojeno jako @{state.username}</p><div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{state.posts.map((post) => <a key={post.instagram_id} href={post.permalink} target="_blank" rel="noopener noreferrer" className="relative aspect-square overflow-hidden rounded-xl border border-white/8 bg-white/5"><img src={post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url} alt="" className="h-full w-full object-cover" /></a>)}{state.posts.length === 0 && <p className="col-span-full text-sm text-white/40">Žádné příspěvky nenalezeny.</p>}</div></>}
  </div>;
}