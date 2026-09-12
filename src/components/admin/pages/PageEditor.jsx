import React, { useMemo, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  ArrowLeft, Eye, GripVertical, Laptop, LayoutList, Monitor, Plus,
  RotateCcw, Save, Settings2, Smartphone, Tablet, Trash2, X
} from 'lucide-react';
import BlockLibrary, { BLOCK_PRESETS } from './BlockLibrary';
import BlockFields from './BlockFields';
import BlockRenderer from '@/components/pages/blocks/BlockRenderer';

const DEVICE_WIDTH = {
  desktop: '100%',
  tablet: '820px',
  mobile: '390px',
};

export default function PageEditor({ page, onSave, onCancel }) {
  const initial = useMemo(() => ({
    title: page.title || '',
    slug: page.slug || '',
    published: !!page.published,
    blocks: page.blocks || [],
  }), [page]);

  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [published, setPublished] = useState(initial.published);
  const [blocks, setBlocks] = useState(initial.blocks);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState('preview');
  const [device, setDevice] = useState('desktop');
  const [selectedIndex, setSelectedIndex] = useState(blocks.length ? 0 : null);

  const dirty = title !== initial.title || slug !== initial.slug || published !== initial.published || JSON.stringify(blocks) !== JSON.stringify(initial.blocks);
  const selectedBlock = selectedIndex === null ? null : blocks[selectedIndex];

  const addBlock = (type) => {
    const next = { type, data: { ...BLOCK_PRESETS[type].defaultData } };
    setBlocks((current) => {
      const updated = [...current, next];
      setSelectedIndex(updated.length - 1);
      return updated;
    });
    setLibraryOpen(false);
    setMode('preview');
  };

  const updateBlock = (index, data) => {
    setBlocks((current) => current.map((block, i) => (i === index ? { ...block, data } : block)));
  };

  const removeBlock = (index) => {
    setBlocks((current) => current.filter((_, i) => i !== index));
    setSelectedIndex((current) => {
      if (current === null) return null;
      if (current === index) return null;
      return current > index ? current - 1 : current;
    });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    setBlocks((current) => {
      const next = Array.from(current);
      const [moved] = next.splice(result.source.index, 1);
      next.splice(result.destination.index, 0, moved);
      return next;
    });
    setSelectedIndex(null);
  };

  const resetDraft = () => {
    setTitle(initial.title);
    setSlug(initial.slug);
    setPublished(initial.published);
    setBlocks(initial.blocks);
    setSelectedIndex(initial.blocks.length ? 0 : null);
  };

  const handleSave = async () => {
    if (!title || !slug) return;
    setSaving(true);
    try {
      await onSave({ ...page, title, slug, published, blocks });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-40px)] bg-[#07151b] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07151b]/95 px-4 py-3 backdrop-blur-xl lg:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={onCancel} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-white/50 transition hover:bg-white/5 hover:text-white" aria-label="Zpět na seznam">
              <ArrowLeft size={17} />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-white">{title || 'Nová stránka'}</p>
                {dirty && <span className="rounded-full bg-amber-400/10 px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-amber-300">Neuloženo</span>}
              </div>
              <p className="mt-0.5 truncate font-mono text-[10px] text-white/30">/p/{slug || 'url-slug'}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl border border-white/10 bg-white/[.03] p-1">
              <button onClick={() => setMode('preview')} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition ${mode === 'preview' ? 'bg-cyan text-[#07151b] font-bold' : 'text-white/45 hover:text-white'}`}><Eye size={14}/> Živý náhled</button>
              <button onClick={() => setMode('blocks')} className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition ${mode === 'blocks' ? 'bg-white/10 text-white' : 'text-white/45 hover:text-white'}`}><LayoutList size={14}/> Bloky</button>
            </div>
            <button onClick={resetDraft} disabled={!dirty} className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 px-3 text-xs text-white/45 transition hover:text-white disabled:opacity-25"><RotateCcw size={14}/> Vrátit</button>
            <button onClick={handleSave} disabled={saving || !title || !slug || !dirty} className="inline-flex h-10 items-center gap-2 rounded-xl bg-cyan px-4 text-xs font-bold text-[#07151b] transition hover:bg-cyan/90 disabled:opacity-35"><Save size={14}/>{saving ? 'Ukládám…' : 'Uložit'}</button>
          </div>
        </div>
      </header>

      <div className="grid min-h-[calc(100vh-105px)] xl:grid-cols-[260px_minmax(0,1fr)_300px]">
        <aside className="border-b border-white/10 bg-black/10 p-4 xl:border-b-0 xl:border-r">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[.18em] text-cyan/60">Nastavení stránky</p>
          <div className="space-y-3">
            <label className="block text-[10px] uppercase tracking-wider text-white/35">Název
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Název stránky" className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-cyan/40" />
            </label>
            <label className="block text-[10px] uppercase tracking-wider text-white/35">URL slug
              <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="url-slug" className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 font-mono text-xs text-white outline-none placeholder:text-white/20 focus:border-cyan/40" />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[.03] px-3 py-3 text-xs text-white/60">
              <span>Zveřejnit stránku</span>
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="accent-cyan-400" />
            </label>
          </div>

          <div className="mt-7 flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-white/35">Bloky · {blocks.length}</p>
            <button onClick={() => setLibraryOpen(true)} className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan"><Plus size={13}/> Přidat</button>
          </div>
          <div className="mt-3 space-y-1.5">
            {blocks.map((block, index) => (
              <button key={`${block.type}-${index}`} onClick={() => { setSelectedIndex(index); setMode('preview'); }} className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs transition ${selectedIndex === index ? 'border-cyan/35 bg-cyan/10 text-cyan' : 'border-transparent text-white/45 hover:border-white/10 hover:bg-white/[.03] hover:text-white'}`}>
                <span className="font-mono text-[9px] text-white/25">{String(index + 1).padStart(2, '0')}</span>
                <span className="truncate">{BLOCK_PRESETS[block.type]?.label || block.type}</span>
              </button>
            ))}
            {!blocks.length && <p className="rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-white/25">Přidejte první blok.</p>}
          </div>
        </aside>

        <main className="min-w-0 overflow-hidden bg-[#10232b] p-3 sm:p-5">
          {mode === 'preview' ? (
            <>
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-white/40"><Monitor size={14}/><span>Upravujte text kliknutím přímo v náhledu.</span></div>
                <div className="flex rounded-xl border border-white/10 bg-black/15 p-1">
                  {[['desktop', Laptop], ['tablet', Tablet], ['mobile', Smartphone]].map(([key, Icon]) => <button key={key} onClick={() => setDevice(key)} aria-label={key} className={`flex h-8 w-9 items-center justify-center rounded-lg transition ${device === key ? 'bg-white/10 text-cyan' : 'text-white/30 hover:text-white'}`}><Icon size={14}/></button>)}
                </div>
              </div>
              <div className="mx-auto overflow-auto rounded-2xl bg-[#07151b] p-2 shadow-2xl" style={{ maxWidth: DEVICE_WIDTH[device], transition: 'max-width .25s ease' }}>
                <div className="min-h-[680px] overflow-hidden rounded-xl bg-white">
                  {blocks.map((block, index) => (
                    <div key={`${block.type}-${index}`} onClick={() => setSelectedIndex(index)} className={`group relative transition ${selectedIndex === index ? 'ring-2 ring-inset ring-cyan-400' : 'hover:ring-2 hover:ring-inset hover:ring-cyan-400/35'}`}>
                      <div className={`pointer-events-none absolute left-2 top-2 z-30 rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest shadow ${selectedIndex === index ? 'bg-cyan text-[#07151b]' : 'bg-slate-950/70 text-white opacity-0 group-hover:opacity-100'}`}>{BLOCK_PRESETS[block.type]?.label || block.type}</div>
                      <BlockRenderer block={block} editMode onChange={(data) => updateBlock(index, data)} />
                    </div>
                  ))}
                  {!blocks.length && <div className="flex min-h-[600px] items-center justify-center p-8 text-center text-sm text-slate-400">Přidejte blok a začněte tvořit stránku.</div>}
                </div>
              </div>
            </>
          ) : (
            <div className="mx-auto max-w-3xl py-4">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="blocks">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                      {blocks.map((block, index) => (
                        <Draggable key={`${block.type}-${index}`} draggableId={`block-${index}`} index={index}>
                          {(dragProvided) => (
                            <div ref={dragProvided.innerRef} {...dragProvided.draggableProps} className="rounded-2xl border border-white/10 bg-white/[.04] p-4">
                              <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2"><span {...dragProvided.dragHandleProps} className="cursor-grab text-white/30"><GripVertical size={16}/></span><span className="font-mono text-xs uppercase tracking-widest text-cyan">{BLOCK_PRESETS[block.type]?.label || block.type}</span></div>
                                <button onClick={() => removeBlock(index)} className="text-white/30 transition hover:text-red-400" aria-label="Smazat blok"><Trash2 size={15}/></button>
                              </div>
                              <BlockFields type={block.type} data={block.data} onChange={(data) => updateBlock(index, data)} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <button onClick={() => setLibraryOpen(true)} className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-white/20 px-4 py-3 text-sm text-white/45 transition hover:border-white/40 hover:text-white"><Plus size={15}/> Přidat přednastavený blok</button>
            </div>
          )}
        </main>

        <aside className="border-t border-white/10 bg-black/10 p-4 xl:border-l xl:border-t-0">
          <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2"><Settings2 size={14} className="text-cyan"/><p className="font-mono text-[10px] uppercase tracking-[.18em] text-white/45">Inspektor</p></div>{selectedBlock && <button onClick={() => setSelectedIndex(null)} className="text-white/25 hover:text-white" aria-label="Zavřít inspektor"><X size={14}/></button>}</div>
          {selectedBlock ? (
            <div>
              <div className="mb-4 rounded-xl border border-cyan/15 bg-cyan/[.05] p-3"><p className="text-xs font-semibold text-cyan">{BLOCK_PRESETS[selectedBlock.type]?.label || selectedBlock.type}</p><p className="mt-1 text-[11px] leading-5 text-white/35">Text upravíte přímo v náhledu. Zde měňte odkazy, obrázky a přesné hodnoty.</p></div>
              <BlockFields type={selectedBlock.type} data={selectedBlock.data} onChange={(data) => updateBlock(selectedIndex, data)} />
              <button onClick={() => removeBlock(selectedIndex)} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-red-400/15 px-3 py-2 text-xs text-red-300/70 hover:bg-red-400/5"><Trash2 size={13}/> Odstranit blok</button>
            </div>
          ) : <div className="rounded-xl border border-dashed border-white/10 p-5 text-center"><p className="text-xs text-white/30">Klikněte na blok v náhledu a zobrazí se jeho nastavení.</p></div>}
        </aside>
      </div>

      {libraryOpen && <BlockLibrary onSelect={addBlock} onClose={() => setLibraryOpen(false)} />}
    </div>
  );
}
