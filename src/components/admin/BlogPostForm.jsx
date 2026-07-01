import React, { useRef, useCallback, useMemo } from 'react';
import ReactQuill from 'react-quill';
import { Loader, Upload, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CATEGORIES = [
  { value: 'inspirace', label: 'Inspirace' },
  { value: 'realizace', label: 'Realizace' },
  { value: 'technika', label: 'Technika' },
  { value: 'novinky', label: 'Novinky' },
];

function slugify(str) {
  return (str || '').toLowerCase().trim()
    .replace(/[áàâä]/g, 'a').replace(/[éèêë]/g, 'e').replace(/[íìîï]/g, 'i')
    .replace(/[óòôö]/g, 'o').replace(/[úùûü]/g, 'u').replace(/ý/g, 'y').replace(/č/g, 'c')
    .replace(/ď/g, 'd').replace(/ě/g, 'e').replace(/ň/g, 'n').replace(/ř/g, 'r').replace(/š/g, 's')
    .replace(/ť/g, 't').replace(/ž/g, 'z').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function BlogPostForm({ form, setForm, onSave, onCancel, saving, uploadingCover, setUploadingCover }) {
  const quillRef = useRef(null);

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const editor = quillRef.current.getEditor();
      const range = editor.getSelection(true) || { index: editor.getLength() };
      editor.insertEmbed(range.index, 'image', file_url);
      editor.setSelection(range.index + 1);
    };
  }, []);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [2, 3, false] }],
        ['bold', 'italic', 'underline'],
        ['blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: { image: imageHandler },
    },
  }), [imageHandler]);

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingCover(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, image_url: file_url }));
    setUploadingCover(false);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value, slug: f.slug || slugify(e.target.value) }))}
          placeholder="Název článku *" className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none" />
        <input value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: slugify(e.target.value) }))}
          placeholder="url-slug" className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
          className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none">
          <option value="" className="bg-ink">Kategorie</option>
          {CATEGORIES.map(c => <option key={c.value} value={c.value} className="bg-ink">{c.label}</option>)}
        </select>
        <input value={form.tags} onChange={(e) => setForm(f => ({ ...f, tags: e.target.value }))}
          placeholder="Štítky (oddělené čárkou)" className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none" />
      </div>

      <textarea value={form.perex} onChange={(e) => setForm(f => ({ ...f, perex: e.target.value }))} rows={2}
        placeholder="Perex — krátký úvodní text (zobrazí se i ve výsledcích vyhledávání)"
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none resize-none" />

      <div>
        <p className="text-xs font-mono text-white/40 tracking-widest uppercase mb-2">Titulní obrázek (náhled ve vyhledávání)</p>
        <div className="flex items-center gap-3">
          {form.image_url && (
            <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-white/10 shrink-0">
              <img src={form.image_url} alt="cover" className="w-full h-full object-cover" />
              <button onClick={() => setForm(f => ({ ...f, image_url: '' }))} className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/70 flex items-center justify-center">
                <X size={10} className="text-white" />
              </button>
            </div>
          )}
          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 text-xs cursor-pointer hover:bg-white/10 transition-all">
            {uploadingCover ? <Loader size={13} className="animate-spin" /> : <Upload size={13} />}
            {form.image_url ? 'Změnit obrázek' : 'Nahrát obrázek'}
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
          </label>
        </div>
      </div>

      <div>
        <p className="text-xs font-mono text-white/40 tracking-widest uppercase mb-2">Obsah článku — vkládejte nadpisy a obrázky přímo do textu</p>
        <div className="bg-white rounded-xl overflow-hidden">
          <ReactQuill ref={quillRef} theme="snow" value={form.content}
            onChange={(html) => setForm(f => ({ ...f, content: html }))}
            modules={modules} className="text-slate-900" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-white/60">
        <input type="checkbox" checked={form.published} onChange={(e) => setForm(f => ({ ...f, published: e.target.checked }))} />
        Publikovat na webu
      </label>

      <div className="flex gap-3 pt-2">
        <button onClick={onSave} disabled={saving || !form.title || !form.slug}
          className="px-6 py-3 bg-cyan text-ink text-sm font-bold rounded-full hover:bg-cyan/90 transition-all disabled:opacity-50 flex items-center gap-2">
          {saving && <Loader size={14} className="animate-spin" />} Uložit článek
        </button>
        <button onClick={onCancel} className="px-6 py-3 border border-white/15 text-white/60 text-sm rounded-full hover:bg-white/5 transition-all">
          Zrušit
        </button>
      </div>
    </div>
  );
}