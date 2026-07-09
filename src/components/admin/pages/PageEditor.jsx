import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Trash2, Plus, ArrowLeft } from 'lucide-react';
import BlockLibrary, { BLOCK_PRESETS } from './BlockLibrary';
import BlockFields from './BlockFields';

export default function PageEditor({ page, onSave, onCancel }) {
  const [title, setTitle] = useState(page.title || '');
  const [slug, setSlug] = useState(page.slug || '');
  const [published, setPublished] = useState(!!page.published);
  const [blocks, setBlocks] = useState(page.blocks || []);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const addBlock = (type) => {
    setBlocks((b) => [...b, { type, data: { ...BLOCK_PRESETS[type].defaultData } }]);
    setLibraryOpen(false);
  };

  const updateBlock = (index, data) => {
    setBlocks((b) => b.map((blk, i) => (i === index ? { ...blk, data } : blk)));
  };

  const removeBlock = (index) => {
    setBlocks((b) => b.filter((_, i) => i !== index));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    setBlocks((b) => {
      const next = Array.from(b);
      const [moved] = next.splice(result.source.index, 1);
      next.splice(result.destination.index, 0, moved);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave({ ...page, title, slug, published, blocks });
    setSaving(false);
  };

  return (
    <div className="p-6 max-w-3xl">
      <button onClick={onCancel} className="flex items-center gap-2 text-white/50 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft size={15} /> Zpět na seznam
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Název stránky"
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-cyan/40" />
        <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="url-slug"
          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-cyan/40" />
      </div>
      <label className="flex items-center gap-2 text-sm text-white/60 mb-6">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Zveřejnit stránku (dostupná na /p/{slug || 'slug'})
      </label>

      <div className="space-y-3 mb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="blocks">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                {blocks.map((block, index) => (
                  <Draggable key={index} draggableId={`block-${index}`} index={index}>
                    {(dragProvided) => (
                      <div ref={dragProvided.innerRef} {...dragProvided.draggableProps}
                        className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span {...dragProvided.dragHandleProps} className="text-white/30 cursor-grab" aria-label="Přesunout blok">
                              <GripVertical size={16} />
                            </span>
                            <span className="text-xs font-mono text-cyan uppercase tracking-widest">{BLOCK_PRESETS[block.type]?.label || block.type}</span>
                          </div>
                          <button onClick={() => removeBlock(index)} aria-label="Smazat blok" className="text-white/30 hover:text-red-400 transition-colors">
                            <Trash2 size={15} />
                          </button>
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
      </div>

      <button onClick={() => setLibraryOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-white/20 text-white/50 hover:text-white hover:border-white/40 transition-all text-sm mb-8">
        <Plus size={15} /> Přidat přednastavený blok
      </button>

      <div>
        <button onClick={handleSave} disabled={saving || !title || !slug}
          className="px-6 py-2.5 rounded-full bg-cyan text-ink text-sm font-bold disabled:opacity-40">
          {saving ? 'Ukládám...' : 'Uložit stránku'}
        </button>
      </div>

      {libraryOpen && <BlockLibrary onSelect={addBlock} onClose={() => setLibraryOpen(false)} />}
    </div>
  );
}