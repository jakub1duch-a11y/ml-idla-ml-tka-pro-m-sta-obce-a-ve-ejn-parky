import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader, Send, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const buildCaption = (item) => [
  item.name,
  item.location ? `📍 ${item.location}${item.year ? `, ${item.year}` : ''}` : '',
  item.description || '',
  '#mlzidla #mlzitka #chlazeni #verejnyprostor',
].filter(Boolean).join('\n\n');

export default function RealizaceInstagramShare({ onPublished }) {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [caption, setCaption] = useState('');
  const [state, setState] = useState({ loading: true, publishing: false, error: '', success: '' });

  useEffect(() => {
    base44.entities.Realizace.filter({ published: true }, '-year', 40).then((list) => {
      const withPhoto = (list || []).filter((item) => item.image_url || (item.gallery_urls || []).length);
      setItems(withPhoto);
      if (withPhoto[0]) { setSelectedId(withPhoto[0].id); setCaption(buildCaption(withPhoto[0])); }
      setState((s) => ({ ...s, loading: false }));
    });
  }, []);

  const selected = items.find((item) => item.id === selectedId);
  const photo = selected ? (selected.image_url || (selected.gallery_urls || [])[0]) : '';

  const select = (id) => {
    const item = items.find((i) => i.id === id);
    setSelectedId(id);
    setCaption(item ? buildCaption(item) : '');
    setState((s) => ({ ...s, error: '', success: '' }));
  };

  const publish = async () => {
    if (!selectedId) return;
    const approved = window.confirm(`Opravdu publikovat realizaci „${selected?.name || ''}“ na Instagram @mlzidla? Tuto akci nelze vzít zpět.`);
    if (!approved) return;
    setState((s) => ({ ...s, publishing: true, error: '', success: '' }));
    try {
      await base44.functions.invoke('publishRealizaceToInstagram', { realizaceId: selectedId, caption, imageUrl: photo, confirmed: true });
      setState((s) => ({ ...s, publishing: false, success: 'Příspěvek byl publikován na Instagram.' }));
      onPublished?.();
    } catch (error) {
      setState((s) => ({ ...s, publishing: false, error: error?.response?.data?.error || 'Publikace se nezdařila.' }));
    }
  };

  if (state.loading) return <div className="flex justify-center py-10"><Loader size={20} className="animate-spin text-cyan/40" /></div>;

  return (
    <div className="mb-8 rounded-2xl border border-white/8 bg-white/3 p-5">
      <h3 className="flex items-center gap-2 text-sm font-medium text-white"><Sparkles size={14} className="text-cyan" /> Sdílet realizaci na profil</h3>
      <p className="mt-1 text-xs text-white/40">Vyberte realizaci, upravte text a před publikací potvrďte finální podobu. Bez potvrzení se nic neodešle.</p>

      <div className="mt-4 grid gap-4 md:grid-cols-[200px_1fr]">
        <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
          {items.map((item) => (
            <button key={item.id} type="button" onClick={() => select(item.id)}
              className={`flex w-full items-center gap-2 rounded-xl border p-2 text-left transition-all ${item.id === selectedId ? 'border-cyan/50 bg-cyan/10' : 'border-white/8 bg-white/3 hover:border-white/20'}`}>
              <img src={item.image_url || (item.gallery_urls || [])[0]} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
              <span className="min-w-0">
                <span className="block truncate text-xs text-white">{item.name}</span>
                <span className="block truncate text-[10px] font-mono text-white/35">{item.location || '—'}</span>
              </span>
            </button>
          ))}
          {items.length === 0 && <p className="text-xs text-white/40">Žádné publikované realizace s fotografií.</p>}
        </div>

        <div>
          {photo && <img src={photo} alt="" className="mb-3 aspect-square w-full max-w-[220px] rounded-xl border border-white/10 object-cover" />}
          <textarea value={caption} onChange={(e) => setCaption(e.target.value)} rows={6}
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-5 text-white outline-none focus:border-cyan/40"
            placeholder="Text příspěvku…" />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button type="button" onClick={publish} disabled={!selectedId || state.publishing || !caption.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-cyan px-4 py-2 text-xs font-bold text-ink transition-all hover:brightness-110 disabled:opacity-40">
              {state.publishing ? <Loader size={13} className="animate-spin" /> : <Send size={13} />} Publikovat na Instagram
            </button>
            {state.success && <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400"><CheckCircle2 size={13} /> {state.success}</span>}
            {state.error && <span className="text-xs text-red-300">{state.error}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}