import React, { useRef, useCallback, useMemo, useState } from 'react';
import ReactQuill from 'react-quill';
import { ImageIcon, Loader, Sparkles, Upload, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CATEGORIES = [
  { value: 'inspirace', label: 'Inspirace' },
  { value: 'realizace', label: 'Realizace' },
  { value: 'technika', label: 'Technika' },
  { value: 'novinky', label: 'Novinky' },
];

const AUDIENCES = [
  { value: 'oboji', label: 'Firmy i domácnosti' },
  { value: 'firmy', label: 'Pro firmy a provozy' },
  { value: 'soukrome', label: 'Pro domácnosti a zahrady' },
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
  const [uploadingContent, setUploadingContent] = useState(false);
  const [generatingVisuals, setGeneratingVisuals] = useState(false);
  const [visualError, setVisualError] = useState('');

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

  const handleContentUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingContent(true);
    setVisualError('');
    try {
      const uploaded = [];
      for (const file of files) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        uploaded.push({
          url: file_url,
          alt: `${form.title || 'Článek MLŽIDLA®'} — doprovodná fotografie`,
          caption: '',
          kind: 'photo',
        });
      }
      setForm((f) => ({ ...f, content_images: [...(f.content_images || []), ...uploaded] }));
    } catch (error) {
      setVisualError(error?.message || 'Nahrání obrázků se nepodařilo.');
    } finally {
      setUploadingContent(false);
      e.target.value = '';
    }
  };

  const updateContentImage = (index, patch) => {
    setForm((f) => ({
      ...f,
      content_images: (f.content_images || []).map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item),
    }));
  };

  const removeContentImage = (index) => {
    setForm((f) => ({ ...f, content_images: (f.content_images || []).filter((_, itemIndex) => itemIndex !== index) }));
  };

  const generateContentVisuals = async () => {
    if (!form.title || generatingVisuals) return;
    setGeneratingVisuals(true);
    setVisualError('');
    try {
      const referenceUrls = [form.image_url, ...(form.content_images || []).map((item) => item?.url)].filter(Boolean).slice(0, 3);
      const variants = [
        'široký kontext prostoru a způsob využití',
        'detail jemné vodní mlhy, materiálu a atmosféry bez vymyšlených technických detailů',
        'doplňkový architektonický pohled, který vysvětluje téma článku bez textových nápisů',
      ];
      const created = [];
      for (let index = 0; index < variants.length; index += 1) {
        const params = {
          prompt: `Fotorealistická doprovodná vizualizace pro odborný článek MLŽIDLA.cz „${form.title}“. Kontext článku: ${form.perex || 'mlžítka, veřejný nebo rezidenční prostor a vodní mlha'}. Záběr: ${variants[index]}. Pokud je na referenční fotografii konkrétní produkt HolmTec/MLŽIDLA®, zachovej absolutně přesně jeho geometrii, počet ramen, trubek, trysek, ohybů, patku a proporce; měň pouze prostředí, světlo, mlhu, lidi, kompozici a úhel. Pokud ověřená produktová reference není k dispozici, nevymýšlej nový produkt ani jeho konstrukci — zobraz raději prostředí, mikroklima, detail mlhy nebo neutrální architektonický kontext. Žádná falešná loga, žádné texty v obraze, žádné neověřené technické hodnoty. Přirozené české nebo evropské prostředí, realistická nerez, jemná vodní mlha a lidé pouze tam, kde pomáhají měřítku. Kompozice 16:10 vhodná do odborného webového článku.`,
          ...(referenceUrls.length ? { existing_image_urls: referenceUrls } : {}),
        };
        const result = await base44.integrations.Core.GenerateImage(params);
        if (result?.url) {
          created.push({
            url: result.url,
            alt: `${form.title} — vizualizace ${index + 1}`,
            caption: '',
            kind: 'visualization',
          });
        }
      }
      setForm((f) => ({ ...f, content_images: [...(f.content_images || []), ...created] }));
    } catch (error) {
      setVisualError(error?.response?.data?.error || error?.message || 'Generování vizualizací se nepodařilo.');
    } finally {
      setGeneratingVisuals(false);
    }
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

      <div>
        <p className="text-xs font-mono text-white/40 tracking-widest uppercase mb-2">Cílová skupina</p>
        <select value={form.audience || 'oboji'} onChange={(e) => setForm(f => ({ ...f, audience: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-cyan/40 focus:outline-none">
          {AUDIENCES.map(a => <option key={a.value} value={a.value} className="bg-ink">{a.label}</option>)}
        </select>
      </div>

      <textarea value={form.perex} onChange={(e) => setForm(f => ({ ...f, perex: e.target.value }))} rows={2}
        placeholder="Perex — krátký úvodní text (zobrazí se i ve výsledcích vyhledávání)"
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none resize-none" />

      <div className="rounded-xl border border-cyan/15 bg-cyan/[.03] p-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono text-cyan/80 tracking-widest uppercase">SEO + AEO</p>
          <span className="text-[10px] text-white/30">Jasná entita · lokalita · FAQ · interní odkazy</span>
        </div>
        <div>
          <input value={form.seo_title || ''} onChange={(e) => setForm(f => ({ ...f, seo_title: e.target.value }))}
            placeholder="SEO title — ideálně do 60 znaků"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none" />
          <p className="mt-1 text-right text-[10px] text-white/30">{(form.seo_title || '').length}/60</p>
        </div>
        <div>
          <textarea value={form.seo_description || ''} onChange={(e) => setForm(f => ({ ...f, seo_description: e.target.value }))} rows={2}
            placeholder="Meta description — stručná a konkrétní odpověď, ideálně do 155 znaků"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none resize-none" />
          <p className="mt-1 text-right text-[10px] text-white/30">{(form.seo_description || '').length}/155</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input value={form.location_context || ''} onChange={(e) => setForm(f => ({ ...f, location_context: e.target.value }))}
            placeholder="Lokalita / kontext, např. Jičín, městské náměstí"
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none" />
          <input value={form.related_product_slugs || ''} onChange={(e) => setForm(f => ({ ...f, related_product_slugs: e.target.value }))}
            placeholder="Produkty — slugs oddělené čárkou"
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none" />
        </div>
        <textarea value={form.faq_text || ''} onChange={(e) => setForm(f => ({ ...f, faq_text: e.target.value }))} rows={4}
          placeholder={'FAQ pro AEO — jeden řádek = Otázka | Odpověď\nNapř. Jaká je spotřeba vody? | Podle konfigurace produktu...'}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none resize-y" />
        <textarea value={form.related_links_text || ''} onChange={(e) => setForm(f => ({ ...f, related_links_text: e.target.value }))} rows={3}
          placeholder={'Vlastní interní odkazy — jeden řádek = Název | /cesta | volitelný popis\nNapř. Chytré ovládání | /smart-ovladani | Automatické řízení mlžení'}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none resize-y" />
      </div>

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
        <input value={form.image_alt || ''} onChange={(e) => setForm(f => ({ ...f, image_alt: e.target.value }))}
          placeholder="ALT obrázku — popište věcně, co je na snímku a případně lokalitu / produkt"
          className="mt-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-cyan/40 focus:outline-none" />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[.025] p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-mono text-white/50 tracking-widest uppercase">Fotografie a vizualizace v článku</p>
            <p className="mt-1 text-xs leading-5 text-white/35">Pro kvalitní detail článku používejte ideálně 2–4 doprovodné vizuály. U produktů musí být zachována přesná geometrie podle reference.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-white/70 transition hover:bg-white/5">
              {uploadingContent ? <Loader size={13} className="animate-spin" /> : <Upload size={13} />}
              Nahrát obrázky
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleContentUpload} />
            </label>
            <button type="button" onClick={generateContentVisuals} disabled={generatingVisuals || !form.title}
              className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/[.06] px-3 py-2 text-xs font-semibold text-cyan disabled:opacity-40">
              {generatingVisuals ? <Loader size={13} className="animate-spin" /> : <Sparkles size={13} />}
              Vygenerovat 3 vizualizace
            </button>
          </div>
        </div>
        {visualError && <p className="mt-3 text-xs text-rose-300">{visualError}</p>}
        {(form.content_images || []).length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(form.content_images || []).map((item, index) => (
              <div key={`${item.url}-${index}`} className="overflow-hidden rounded-xl border border-white/10 bg-black/10">
                <div className="relative aspect-[16/10] bg-white/5">
                  {item.url ? <img src={item.url} alt={item.alt || ''} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-white/20"><ImageIcon size={24} /></div>}
                  <button type="button" onClick={() => removeContentImage(index)} className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white/80 hover:text-white" aria-label="Odstranit obrázek"><X size={13} /></button>
                </div>
                <div className="space-y-2 p-3">
                  <select value={item.kind || 'visualization'} onChange={(e) => updateContentImage(index, { kind: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:outline-none">
                    <option value="photo" className="bg-ink">Fotografie</option>
                    <option value="visualization" className="bg-ink">Vizualizace</option>
                    <option value="diagram" className="bg-ink">Schéma / diagram</option>
                  </select>
                  <input value={item.alt || ''} onChange={(e) => updateContentImage(index, { alt: e.target.value })} placeholder="ALT text *"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/25 focus:outline-none" />
                  <input value={item.caption || ''} onChange={(e) => updateContentImage(index, { caption: e.target.value })} placeholder="Popisek obrázku"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/25 focus:outline-none" />
                </div>
              </div>
            ))}
          </div>
        ) : <p className="mt-4 text-xs text-white/25">Zatím nejsou přidané žádné doprovodné vizuály.</p>}
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