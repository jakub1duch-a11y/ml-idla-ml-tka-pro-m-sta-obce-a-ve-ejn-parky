import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { HardDriveDownload, FolderOpen, CheckCircle, AlertCircle, Loader, RefreshCw, ExternalLink, Info } from 'lucide-react';

export default function AdminDriveSync() {
  const [folderId, setFolderId] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const extractFolderId = (input) => {
    // Accept raw ID or full Drive URL
    const match = input.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : input.trim();
  };

  const handleSync = async () => {
    const id = extractFolderId(folderId);
    if (!id) { setError('Zadejte ID složky nebo URL z Google Drive'); return; }
    setSyncing(true);
    setResults(null);
    setError(null);
    try {
      const res = await base44.functions.invoke('syncFromDrive', { folderId: id });
      if (res.data.error) throw new Error(res.data.error);
      setResults(res.data);
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
        <h1 className="text-2xl font-light text-white">Google Drive — Sync produktů</h1>
        <p className="text-sm text-white/40 mt-2">Synchronizuje fotky a data produktů ze složky v Google Drive přímo do katalogu.</p>
      </div>

      {/* How it works */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Info size={15} className="text-cyan" />
          <p className="text-sm text-white/60 font-medium">Struktura složky v Google Drive</p>
        </div>
        <div className="font-mono text-xs text-white/40 space-y-1 leading-relaxed">
          <div>📁 <span className="text-white/60">Vaše složka (Root)</span></div>
          <div className="pl-4">📁 <span className="text-white/60">OSTEV</span>  ← název = název produktu</div>
          <div className="pl-8">🖼️ 01-foto.jpg  ← hlavní obrázek</div>
          <div className="pl-8">🖼️ 02-detail.jpg ← galerie</div>
          <div className="pl-8">📄 <span className="text-cyan/70">info.txt</span>  ← volitelně technická data</div>
          <div className="pl-4">📁 <span className="text-white/60">MRAK</span></div>
          <div className="pl-4">📁 <span className="text-white/60">VOLAVKA</span></div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-xs text-white/30 mb-1">Formát <span className="text-cyan/60 font-mono">info.txt</span> (volitelné klíče):</p>
          <p className="font-mono text-[11px] text-white/30 leading-relaxed">
            slug: ostev-strom<br />
            short_description: Nerezový strom s mlhou<br />
            material: AISI 304<br />
            pressure: 70 bar<br />
            micron_size: 5–10<br />
            water_consumption: 1,2 l/h<br />
            featured: true
          </p>
        </div>
      </div>

      {/* Folder ID input */}
      <div className="bg-card_bg border border-white/10 rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <FolderOpen size={16} className="text-cyan" />
          <p className="text-sm text-white font-medium">ID složky v Google Drive</p>
          <a href="https://drive.google.com" target="_blank" rel="noopener noreferrer"
            className="ml-auto text-xs text-cyan/60 hover:text-cyan flex items-center gap-1">
            Otevřít Drive <ExternalLink size={11} />
          </a>
        </div>
        <p className="text-xs text-white/30 mb-3">
          Zkopírujte URL složky z Drive nebo jen ID (část za <span className="font-mono text-white/50">/folders/</span>).
          Funguje i pro <span className="text-white/50">Sdílené disky</span> (Shared Drives).
        </p>
        <input
          value={folderId}
          onChange={e => setFolderId(e.target.value)}
          placeholder="https://drive.google.com/drive/folders/abc123… nebo jen abc123…"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none placeholder-white/20"
        />
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4 flex items-start gap-2">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" /> {error}
        </div>
      )}

      {results && (
        <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
          <p className="text-xs font-mono text-emerald-400 tracking-widest uppercase mb-3">
            Synchronizace dokončena — {results.synced} produktů
          </p>
          <div className="space-y-2">
            {(results.results || []).map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                <span className="text-white/80 font-medium">{r.name}</span>
                <span className="text-xs text-white/30 ml-auto flex items-center gap-2">
                  <span className="text-white/40">{r.images} foto</span>
                  <span className={r.action === 'created' ? 'text-cyan' : 'text-yellow-400'}>
                    {r.action === 'created' ? 'Vytvořeno' : 'Aktualizováno'}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={handleSync} disabled={syncing || !folderId.trim()}
        className="flex items-center gap-2 px-6 py-3 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 disabled:opacity-40 transition-all">
        {syncing
          ? <><Loader size={16} className="animate-spin" /> Synchronizuji z Drive...</>
          : <><HardDriveDownload size={16} /> Synchronizovat z Google Drive</>}
      </button>
    </div>
  );
}