import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { RefreshCw, CheckCircle, AlertCircle, Package, Image, BookOpen, Loader, ChevronRight } from 'lucide-react';

const MODEL_INFO = [
  { key: 'product', label: 'Product', desc: 'Mlžné produkty / sochy', icon: Package },
  { key: 'realizace', label: 'Realizace', desc: 'Projektové realizace', icon: Image },
  { key: 'blogPost', label: 'Blog Post', desc: 'Blog & inspirace příspěvky', icon: BookOpen },
];

export default function AdminContentful() {
  const [spaces, setSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState('');
  const [loadingSpaces, setLoadingSpaces] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    base44.functions.invoke('contentfulSync', { action: 'listSpaces' })
      .then(res => {
        setSpaces(res.data.spaces || []);
        if (res.data.spaces?.length === 1) setSelectedSpace(res.data.spaces[0].id);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoadingSpaces(false));
  }, []);

  const handleSync = async () => {
    if (!selectedSpace) return;
    setSyncing(true);
    setResults(null);
    setError(null);
    try {
      const res = await base44.functions.invoke('contentfulSync', { action: 'syncModels', spaceId: selectedSpace });
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
        <h1 className="text-2xl font-light text-white">Contentful — Sync Content Model</h1>
        <p className="text-sm text-white/40 mt-2">Synchronizuje schéma obsahu (produkty, realizace, blog) do vašeho Contentful space.</p>
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

      {/* Space selector */}
      <div className="bg-card_bg border border-white/10 rounded-2xl p-6 mb-4">
        <p className="text-xs font-mono text-white/40 tracking-widest uppercase mb-3">Vyberte Contentful Space</p>

        {loadingSpaces && (
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <Loader size={14} className="animate-spin" /> Načítám spaces...
          </div>
        )}

        {!loadingSpaces && spaces.length === 0 && !error && (
          <p className="text-sm text-white/40">Žádné spaces nenalezeny. Ověřte Contentful připojení.</p>
        )}

        {spaces.length > 0 && (
          <div className="space-y-2">
            {spaces.map(s => (
              <button key={s.id} onClick={() => setSelectedSpace(s.id)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between ${
                  selectedSpace === s.id
                    ? 'border-cyan/40 bg-cyan/10 text-white'
                    : 'border-white/10 bg-white/5 text-white/60 hover:border-white/25'
                }`}>
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-white/30 font-mono">{s.id}</p>
                </div>
                {selectedSpace === s.id && <ChevronRight size={14} className="text-cyan" />}
              </button>
            ))}
          </div>
        )}
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
        </div>
      )}

      <button onClick={handleSync} disabled={syncing || !selectedSpace || loadingSpaces}
        className="flex items-center gap-2 px-6 py-3 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 disabled:opacity-40 transition-all">
        {syncing ? <><Loader size={16} className="animate-spin" /> Synchronizuji...</> : <><RefreshCw size={16} /> Synchronizovat content modely</>}
      </button>
    </div>
  );
}