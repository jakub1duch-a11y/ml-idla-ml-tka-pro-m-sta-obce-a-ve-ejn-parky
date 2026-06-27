import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { RefreshCw, CheckCircle, AlertCircle, Package, Image, BookOpen, Loader, Key, ExternalLink } from 'lucide-react';

const MODEL_INFO = [
  { key: 'product', label: 'Produkty', desc: 'Mlžné sochy & instalace', icon: Package },
  { key: 'realizace', label: 'Realizace', desc: 'Projektové realizace', icon: Image },
  { key: 'blogPost', label: 'Blog & Inspirace', desc: 'Blog příspěvky', icon: BookOpen },
];

export default function AdminContentful() {
  const [spaceId, setSpaceId] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSync = async () => {
    if (!spaceId.trim()) { setError('Zadejte Space ID'); return; }
    setSyncing(true);
    setResults(null);
    setError(null);
    try {
      const res = await base44.functions.invoke('contentfulSync', { action: 'syncModels', spaceId: spaceId.trim() });
      setResults(res.data.results);
    } catch (e) {
      setError(e.message || 'Chyba při synchronizaci');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-1">INTEGRACE</p>
        <h1 className="text-2xl font-light text-white">Contentful — Synchronizace</h1>
        <p className="text-sm text-white/40 mt-2">Synchronizuje content modely (produkty, realizace, blog) do vašeho Contentful space.</p>
      </div>

      {/* Models overview */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {MODEL_INFO.map(m => {
          const Icon = m.icon;
          return (
            <div key={m.key} className="bg-card_bg border border-white/10 rounded-2xl p-4">
              <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center mb-3">
                <Icon size={16} className="text-cyan" />
              </div>
              <p className="text-white text-sm font-medium">{m.label}</p>
              <p className="text-xs text-white/30 mt-0.5">{m.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Space ID input */}
      <div className="bg-card_bg border border-white/10 rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Key size={16} className="text-cyan" />
          <p className="text-sm text-white font-medium">Contentful Space ID</p>
          <a href="https://app.contentful.com" target="_blank" rel="noopener noreferrer"
            className="ml-auto text-xs text-cyan/60 hover:text-cyan flex items-center gap-1">
            Najít v Contentful <ExternalLink size={11} />
          </a>
        </div>
        <p className="text-xs text-white/30 mb-3">
          Najdete ho v Contentful → Settings → General Settings → Space ID
        </p>
        <input
          value={spaceId}
          onChange={e => setSpaceId(e.target.value)}
          placeholder="např. abc123xyz789"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-cyan/40 focus:outline-none placeholder-white/20"
        />
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4 flex items-start gap-2">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" /> {error}
        </div>
      )}

      {results && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
          <p className="text-xs font-mono text-emerald-400 tracking-widest uppercase mb-3">Synchronizace dokončena</p>
          <div className="space-y-2">
            {results.map(r => (
              <div key={r.id} className="flex items-center gap-2 text-sm text-white/70">
                <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                <span>{r.name}</span>
                <span className="text-xs text-white/30 ml-auto">{r.action === 'created' ? 'Vytvořeno' : 'Aktualizováno'}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/30 mt-3">
            Content modely jsou nyní dostupné ve vašem Contentful space. Obsah přidávejte přímo v Contentful.
          </p>
        </div>
      )}

      <button onClick={handleSync} disabled={syncing || !spaceId.trim()}
        className="flex items-center gap-2 px-6 py-3 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 disabled:opacity-40 transition-all">
        {syncing ? <><Loader size={16} className="animate-spin" /> Synchronizuji...</> : <><RefreshCw size={16} /> Synchronizovat content modely</>}
      </button>
    </div>
  );
}