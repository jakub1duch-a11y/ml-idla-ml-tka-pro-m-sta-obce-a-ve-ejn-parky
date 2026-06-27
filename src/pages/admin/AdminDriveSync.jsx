import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { HardDriveDownload, FolderOpen, CheckCircle, AlertCircle, Loader, ExternalLink, Info, Image, Layout } from 'lucide-react';

export default function AdminDriveSync() {
  const [folderId, setFolderId] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const extractFolderId = (input) => {
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
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-8">
        <p className="text-xs font-mono text-cyan tracking-widest uppercase mb-1">INTEGRACE</p>
        <h1 className="text-2xl font-light text-white">Google Drive — Sync fotek a dat</h1>
        <p className="text-sm text-white/40 mt-2">Synchronizuje fotky, galerie a technická data produktů a realizací ze Google Disku do administrace.</p>
      </div>

      {/* How it works */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Info size={16} className="text-cyan" />
          <p className="text-sm text-white/60 font-medium">Struktura složky v Google Drive</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {/* Produkty */}
          <div>
            <p className="text-xs font-mono text-white/30 tracking-widest mb-3">PRODUKTY</p>
            <div className="font-mono text-xs text-white/40 space-y-1 leading-relaxed bg-black/20 p-4 rounded-lg">
              <div>📁 <span className="text-white/60">Produkty</span></div>
              <div className="pl-4">📁 <span className="text-white/60">OSTEV</span></div>
              <div className="pl-8">🖼️ 01-foto.jpg  ← hlavní obrázek</div>
              <div className="pl-8">🖼️ 02-detail.jpg ← galerie</div>
              <div className="pl-8">📄 <span className="text-cyan/70">info.txt</span></div>
              <div className="pl-4">📁 <span className="text-white/60">MRAK</span></div>
              <div className="pl-4">📁 <span className="text-white/60">VOLAVKA</span></div>
            </div>
          </div>

          {/* Realizace */}
          <div>
            <p className="text-xs font-mono text-white/30 tracking-widest mb-3">REALIZACE / PROJEKTY</p>
            <div className="font-mono text-xs text-white/40 space-y-1 leading-relaxed bg-black/20 p-4 rounded-lg">
              <div>📁 <span className="text-white/60">Realizace</span></div>
              <div className="pl-4">📁 <span className="text-white/60">Párk Ostrav (2023)</span></div>
              <div className="pl-8">🖼️ 01-celkový-pohled.jpg</div>
              <div className="pl-8">🖼️ 02-detail-sochy.jpg ← galerie</div>
              <div className="pl-8">📄 <span className="text-cyan/70">realizace.txt</span></div>
              <div className="pl-4">📁 <span className="text-white/60">Hotel Resort</span></div>
            </div>
          </div>
        </div>

        {/* File format info */}
        <div className="mt-5 pt-5 border-t border-white/10 grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-white/30 mb-2">Formát <span className="text-cyan/60 font-mono">info.txt</span> (produkty):</p>
            <p className="font-mono text-[11px] text-white/30 leading-relaxed bg-black/20 p-3 rounded">
              slug: ostev-strom<br />
              short_description: Nerezový strom<br />
              material: AISI 304<br />
              pressure: 70 bar<br />
              micron_size: 5–10<br />
              water_consumption: 1,2 l/h<br />
              featured: true
            </p>
          </div>
          <div>
            <p className="text-xs text-white/30 mb-2">Formát <span className="text-cyan/60 font-mono">realizace.txt</span> (projekty):</p>
            <p className="font-mono text-[11px] text-white/30 leading-relaxed bg-black/20 p-3 rounded">
              client: Město Ostrava<br />
              location: Náměstí Svobody<br />
              year: 2023<br />
              category: mestsky<br />
              product_used: OSTEV<br />
              description: Nádherná instalace...<br />
              featured: true
            </p>
          </div>
        </div>
      </div>

      {/* Folder ID input */}
      <div className="bg-card_bg border border-white/10 rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <FolderOpen size={16} className="text-cyan" />
          <p className="text-sm text-white font-medium">ID kořenové složky v Google Drive</p>
          <a href="https://drive.google.com" target="_blank" rel="noopener noreferrer"
            className="ml-auto text-xs text-cyan/60 hover:text-cyan flex items-center gap-1">
            Otevřít Drive <ExternalLink size={11} />
          </a>
        </div>
        <p className="text-xs text-white/30 mb-4">
          Zadejte URL složky "mlžný disk" nebo jen ID. Funkuje i pro <span className="text-white/50">Sdílené disky</span>.
        </p>
        <input
          value={folderId}
          onChange={e => setFolderId(e.target.value)}
          placeholder="https://drive.google.com/drive/folders/abc123… nebo jen abc123…"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none placeholder-white/20 mb-3"
        />
        <p className="text-[11px] text-white/20 leading-relaxed">
          💡 Složka musí obsahovat podsložky <span className="font-mono text-white/30">Produkty</span> a <span className="font-mono text-white/30">Realizace</span>. Fotky budou automaticky načteny z podřazených složek.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4 flex items-start gap-2">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" /> {error}
        </div>
      )}

      {results && (
        <div className="space-y-4 mb-4">
          {/* Produkty */}
          {results.results?.products && results.results.products.length > 0 && (
            <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-xs font-mono text-emerald-400 tracking-widest uppercase mb-3 flex items-center gap-2">
                <Image size={14} /> Produkty synchronizovány — {results.results.products.length}
              </p>
              <div className="space-y-1.5">
                {results.results.products.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={13} className="text-emerald-400 flex-shrink-0" />
                    <span className="text-white/80">{r.name}</span>
                    <span className="text-xs text-white/30 ml-auto flex items-center gap-2">
                      <span className="text-white/40">{r.images} foto</span>
                      <span className={r.action === 'created' ? 'text-cyan font-mono text-[10px]' : 'text-yellow-400 font-mono text-[10px]'}>
                        {r.action === 'created' ? 'NOVÝ' : 'AKTUALIZOVÁN'}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Realizace */}
          {results.results?.realizace && results.results.realizace.length > 0 && (
            <div className="p-5 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-xs font-mono text-blue-400 tracking-widest uppercase mb-3 flex items-center gap-2">
                <Layout size={14} /> Realizace synchronizovány — {results.results.realizace.length}
              </p>
              <div className="space-y-1.5">
                {results.results.realizace.map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={13} className="text-blue-400 flex-shrink-0" />
                    <span className="text-white/80">{r.name}</span>
                    <span className="text-xs text-white/30 ml-auto flex items-center gap-2">
                      <span className="text-white/40">{r.images} foto</span>
                      <span className={r.action === 'created' ? 'text-cyan font-mono text-[10px]' : 'text-yellow-400 font-mono text-[10px]'}>
                        {r.action === 'created' ? 'NOVÝ' : 'AKTUALIZOVÁN'}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.results?.products?.length === 0 && results.results?.realizace?.length === 0 && (
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm">
              ℹ️ Žádné produkty ani realizace nenalezeny. Zkontrolujte strukturu složky.
            </div>
          )}
        </div>
      )}

      <button onClick={handleSync} disabled={syncing || !folderId.trim()}
        className="flex items-center gap-2 px-6 py-3 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 disabled:opacity-40 transition-all">
        {syncing
          ? <><Loader size={16} className="animate-spin" /> Synchronizuji z Drive...</>
          : <><HardDriveDownload size={16} /> Synchronizovat nyní</>}
      </button>
    </div>
  );
}