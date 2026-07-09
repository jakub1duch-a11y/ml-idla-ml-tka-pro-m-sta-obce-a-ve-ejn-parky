import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ExternalLink, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import PageEditor from '@/components/admin/pages/PageEditor';

const BLANK_PAGE = { title: '', slug: '', published: false, blocks: [] };

export default function AdminPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    base44.entities.CustomPage.list('-created_date').then(setPages).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (pageData) => {
    if (pageData.id) {
      await base44.entities.CustomPage.update(pageData.id, pageData);
    } else {
      await base44.entities.CustomPage.create(pageData);
    }
    setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    await base44.entities.CustomPage.delete(id);
    load();
  };

  if (editing) {
    return <PageEditor page={editing} onSave={handleSave} onCancel={() => setEditing(null)} />;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-lg font-medium">Stránky</h2>
        <button onClick={() => setEditing(BLANK_PAGE)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan text-ink text-sm font-bold">
          <Plus size={15} /> Nová stránka
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader size={24} className="animate-spin text-cyan/40" /></div>
      ) : pages.length === 0 ? (
        <p className="text-white/40 text-sm">Zatím žádné stránky. Vytvořte první pomocí tlačítka výše.</p>
      ) : (
        <div className="rounded-xl border border-white/8 overflow-hidden divide-y divide-white/5">
          {pages.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-4 py-3 hover:bg-white/3 transition-all">
              <div>
                <p className="text-sm text-white/80">{p.title}</p>
                <p className="text-xs text-white/30 font-mono">/p/{p.slug} — {p.published ? 'zveřejněno' : 'skryto'}</p>
              </div>
              <div className="flex items-center gap-3">
                {p.published && (
                  <a href={`/p/${p.slug}`} target="_blank" rel="noopener noreferrer" aria-label="Zobrazit stránku" className="text-white/30 hover:text-cyan transition-colors">
                    <ExternalLink size={15} />
                  </a>
                )}
                <button onClick={() => setEditing(p)} aria-label="Upravit stránku" className="text-white/30 hover:text-white transition-colors">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(p.id)} aria-label="Smazat stránku" className="text-white/30 hover:text-red-400 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}