import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clipboard,
  Eye,
  ImageIcon,
  Layers3,
  Loader,
  MonitorPlay,
  RefreshCw,
  Save,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { buildMarketingVisualizationPrompt, getMarketingReferences, MARKETING_GENERATION_SKILL } from '@/lib/mlzidlaMarketingGenerationSkill';

const INPUT = 'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-cyan/40';
const FORMATS = {
  youtube: { label: 'YouTube', ratio: '16:9', dimensions: '1280 × 720', aspect: 'aspect-video' },
  shorts_reels: { label: 'Shorts / Reels', ratio: '9:16', dimensions: '1080 × 1920', aspect: 'aspect-[9/16]' },
  instagram: { label: 'Instagram feed', ratio: '4:5', dimensions: '1080 × 1350', aspect: 'aspect-[4/5]' },
  web: { label: 'Web / blog', ratio: '16:9', dimensions: '1600 × 900', aspect: 'aspect-video' },
  ads: { label: 'Reklama landscape', ratio: '1.91:1', dimensions: '1200 × 628', aspect: 'aspect-[1.91/1]' },
  square: { label: 'Čtverec', ratio: '1:1', dimensions: '1080 × 1080', aspect: 'aspect-square' },
};
const SCORE_LABELS = [
  ['promise_fit', 'Soulad se slibem'],
  ['curiosity', 'Zvědavost'],
  ['emotion', 'Emoce'],
  ['subject_dominance', 'Dominantní objekt'],
  ['clarity', 'Čistota'],
  ['small_size', 'Malý náhled'],
  ['product_fidelity', 'Věrnost produktu'],
];
const TEXT_POSITIONS = {
  'top-left': 'items-start justify-start text-left',
  'top-right': 'items-start justify-end text-right',
  'center-left': 'items-center justify-start text-left',
  'center-right': 'items-center justify-end text-right',
  center: 'items-center justify-center text-center',
};

const clampScore = (value) => Math.max(0, Math.min(10, Number(value) || 0));
const totalScore = (concept) => {
  const values = SCORE_LABELS.map(([key]) => clampScore(concept?.scores?.[key]));
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10);
};
const splitUrls = (value) => String(value || '').split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
const productReferences = (product) => getMarketingReferences(product);

export default function ThumbnailDirectorTab() {
  const [form, setForm] = useState({
    project_name: '',
    content_title: '',
    brief: '',
    channel: 'youtube',
    product_id: '',
    audience: 'Architekti, města, obce a správci veřejných prostor',
    viewer_question: '',
    reference_urls: '',
  });
  const [products, setProducts] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [sourceUrls, setSourceUrls] = useState([]);
  const [concepts, setConcepts] = useState([]);
  const [images, setImages] = useState({});
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState('');
  const [showHalfTest, setShowHalfTest] = useState(false);
  const [showSmallPreview, setShowSmallPreview] = useState(true);

  const format = FORMATS[form.channel] || FORMATS.youtube;
  const selectedProduct = useMemo(
    () => products.find((product) => product.id === form.product_id),
    [form.product_id, products],
  );

  const loadDrafts = () => base44.entities.ThumbnailProject.list('-created_date', 8).then(setDrafts).catch(() => setDrafts([]));

  useEffect(() => {
    Promise.all([
      base44.entities.Product.list('name', 250),
      base44.entities.ThumbnailProject.list('-created_date', 8),
    ]).then(([productList, draftList]) => {
      setProducts(productList || []);
      setDrafts(draftList || []);
    }).catch(() => setMessage('Nepodařilo se načíst produkty nebo uložené koncepty.'));
  }, []);

  const uploadReference = async (file) => {
    if (!file) return;
    setBusy('upload');
    setMessage('');
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      if (result?.file_url) {
        setSourceUrls((items) => [...items, result.file_url]);
        setMessage('Referenční obrázek je připravený pro generování.');
      }
    } catch (error) {
      setMessage('Nahrání reference se nezdařilo: ' + (error?.message || 'neznámá chyba'));
    } finally {
      setBusy('');
    }
  };

  const generateConcepts = async () => {
    if (!form.content_title.trim()) {
      setMessage('Nejdřív doplňte titulek nebo téma obsahu.');
      return;
    }
    setBusy('concepts');
    setMessage('');
    setImages({});
    try {
      const urls = [...sourceUrls, ...productReferences(selectedProduct)].slice(0, 6);
      const productContext = selectedProduct
        ? [
            'Produkt: ' + selectedProduct.name,
            'Popis: ' + (selectedProduct.short_description || selectedProduct.description || 'bez popisu'),
            'Materiál: ' + (selectedProduct.material || 'ověřit podle reference'),
            'Mikrony: ' + (selectedProduct.micron_size || 'neuvádět bez ověření'),
            'Použití: ' + (selectedProduct.location_context || (selectedProduct.use_cases || []).join(', ')),
          ].join('\n')
        : 'Konkrétní produkt není vybraný. Nevymýšlej konstrukci; navrhuj hlavně prostředí, člověka nebo grafickou metaforu.';

      const prompt = [
        'Jsi seniorní YouTube thumbnail stratég a art director značky MLŽIDLA.cz.',
        'Vytvoř přesně tři odlišné koncepty A/B/C pro ' + format.label + ' (' + format.ratio + ').',
        'Titulek nebo téma: ' + form.content_title,
        'Brief: ' + (form.brief || 'bez dalšího briefu'),
        'Publikum: ' + form.audience,
        'Požadovaná otázka diváka: ' + (form.viewer_question || 'odvoď z tématu'),
        'Referenční odkazy: ' + (splitUrls(form.reference_urls).join(', ') || 'nejsou'),
        productContext,
        '',
        'A musí stát na emoci nebo člověku, B na detailu produktu nebo silném kontrastu, C na výsledku, problému či překvapení.',
        'Text v obraze musí mít 0 až 4 česká slova. Neopakuj celý titulek.',
        'Každý obrazový prompt musí popisovat čistou vrstvu bez textu a bez loga, s místem pro pozdější typografii.',
        'Zachovej přesný vzhled výrobku podle referencí: proporce, geometrii, trubky, ramena, trysky, patku a ukotvení.',
        'Nevymýšlej technické údaje, nové konstrukční prvky ani falešné realizace.',
        'Ohodnoť každé kritérium číslem 0 až 10. Uveď konkrétní rizika a co ručně ověřit.',
        'Doporuč jednu variantu pro první test. Publikace vždy vyžaduje lidské schválení.',
      ].join('\n');

      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        model: 'gemini_3_flash',
        file_urls: urls,
        response_json_schema: {
          type: 'object',
          properties: {
            concepts: {
              type: 'array',
              minItems: 3,
              maxItems: 3,
              items: {
                type: 'object',
                properties: {
                  variant: { type: 'string', enum: ['A', 'B', 'C'] },
                  name: { type: 'string' },
                  mechanism: { type: 'string' },
                  viewer_question: { type: 'string' },
                  emotion: { type: 'string' },
                  on_image_text: { type: 'string' },
                  companion_title: { type: 'string' },
                  composition: { type: 'string' },
                  text_position: { type: 'string', enum: ['top-left', 'top-right', 'center-left', 'center-right', 'center'] },
                  visual_prompt: { type: 'string' },
                  risks: { type: 'array', items: { type: 'string' } },
                  scores: {
                    type: 'object',
                    properties: {
                      promise_fit: { type: 'number' },
                      curiosity: { type: 'number' },
                      emotion: { type: 'number' },
                      subject_dominance: { type: 'number' },
                      clarity: { type: 'number' },
                      small_size: { type: 'number' },
                      product_fidelity: { type: 'number' },
                    },
                    required: ['promise_fit', 'curiosity', 'emotion', 'subject_dominance', 'clarity', 'small_size', 'product_fidelity'],
                  },
                },
                required: ['variant', 'name', 'mechanism', 'viewer_question', 'emotion', 'on_image_text', 'companion_title', 'composition', 'text_position', 'visual_prompt', 'risks', 'scores'],
              },
            },
            recommended_variant: { type: 'string', enum: ['A', 'B', 'C'] },
            recommendation_reason: { type: 'string' },
          },
          required: ['concepts', 'recommended_variant', 'recommendation_reason'],
        },
      });
      const nextConcepts = Array.isArray(response?.concepts) ? response.concepts.slice(0, 3) : [];
      setConcepts(nextConcepts.map((concept) => ({
        ...concept,
        recommended: concept.variant === response?.recommended_variant,
        recommendation_reason: response?.recommendation_reason || '',
      })));
      setMessage(nextConcepts.length ? 'Tři koncepty jsou připravené. Teď lze vygenerovat jednotlivé čisté obrazové vrstvy.' : 'AI nevrátila použitelné koncepty. Zkuste zadání upřesnit.');
    } catch (error) {
      setMessage('Generování konceptů se nezdařilo: ' + (error?.message || 'neznámá chyba'));
    } finally {
      setBusy('');
    }
  };

  const generateImage = async (concept, index) => {
    setBusy('image-' + index);
    setMessage('');
    try {
      const refs = [...sourceUrls, ...productReferences(selectedProduct)].slice(0, 6);
      const ratioInstruction = 'Výstupní kompozice ' + format.ratio + ', cílový export ' + format.dimensions + '.';
      const prompt = [
        'Vytvoř čistou obrazovou vrstvu pro profesionální miniaturu MLŽIDLA.cz.',
        ratioInstruction,
        'Koncept ' + concept.variant + ': ' + concept.name + '.',
        'Kompozice: ' + concept.composition,
        'Vizuální zadání: ' + concept.visual_prompt,
        selectedProduct ? 'Zobrazený produkt je ' + selectedProduct.name + ' a musí přesně odpovídat přiloženým referencím.' : '',
        'Zachovej reálnou geometrii, proporce, počet a polohu trubek, ramen, trysek, patku, ukotvení a nerezový materiál.',
        'Nevymýšlej nové konstrukční prvky. Jemná průsvitná mlha pouze tam, kde dává smysl.',
        'Prémiový architektonický styl, přirozené světlo, jasný dominantní objekt, silné oddělení subjektu od pozadí.',
        'Paleta Deep Steel #0D2D38, Ocean Teal #0E5B67, Mist Aqua #61D5E5, Living Green #6F8F72 a bílá.',
        'Nevytvářej žádná slova, písmena, čísla, logo, vodoznak ani text. Nech čistý bezpečný prostor pro text v pozici ' + concept.text_position + '.',
      ].filter(Boolean).join('\n');
      const params = { prompt };
      if (refs.length) params.existing_image_urls = refs;
      const result = await base44.integrations.Core.GenerateImage(params);
      if (!result?.url) throw new Error('Generátor nevrátil adresu obrázku.');
      setImages((current) => ({ ...current, [index]: result.url }));
      setMessage('Obrazová vrstva varianty ' + concept.variant + ' je připravená. Text zůstává editovatelný v náhledu.');
      try {
        await base44.functions.invoke('archiveGeneratedMediaToDrive', {
          fileUrl: result.url,
          fileName: 'thumbnail-' + concept.variant.toLowerCase() + '-' + Date.now() + '.png',
          mediaRole: 'thumbnail',
        });
      } catch (archiveError) {
        console.warn('Archivace thumbnailu na Google Drive se nezdařila', archiveError);
      }
    } catch (error) {
      setMessage('Generování obrázku se nezdařilo: ' + (error?.message || 'neznámá chyba'));
    } finally {
      setBusy('');
    }
  };

  const saveDraft = async () => {
    if (!form.content_title.trim() || !concepts.length) {
      setMessage('Před uložením vytvořte alespoň sadu konceptů.');
      return;
    }
    setBusy('save');
    setMessage('');
    try {
      await base44.entities.ThumbnailProject.create({
        title: form.project_name || form.content_title,
        content_title: form.content_title,
        brief: form.brief,
        channel: form.channel,
        aspect_ratio: format.ratio,
        product_id: selectedProduct?.id || '',
        product_name: selectedProduct?.name || '',
        audience: form.audience,
        viewer_question: form.viewer_question,
        reference_urls: splitUrls(form.reference_urls),
        source_image_urls: sourceUrls,
        concepts,
        generated_variants: concepts.map((concept, index) => ({
          variant: concept.variant,
          image_url: images[index] || '',
          on_image_text: concept.on_image_text || '',
          text_position: concept.text_position || 'top-left',
          score: totalScore(concept),
        })),
        recommended_variant: concepts.find((concept) => concept.recommended)?.variant || '',
        provider_route: [
          'Base44 InvokeLLM · návrh A/B/C',
          'Base44 GenerateImage · čistá obrazová vrstva',
          'Google Drive · archivace',
          'Canva / Adobe Express · volitelný editovatelný handoff',
          'Magnific / OpenArt · volitelné podle potřeby',
        ],
        status: 'draft',
        approval_required: true,
        notes: 'Automatické publikování je vypnuté. Před použitím ověřit produktovou věrnost, text a 50% test.',
      });
      await loadDrafts();
      setMessage('Projekt byl uložen jako koncept. Nic nebylo publikováno.');
    } catch (error) {
      setMessage('Uložení konceptu se nezdařilo: ' + (error?.message || 'neznámá chyba'));
    } finally {
      setBusy('');
    }
  };

  const copyPrompt = async (concept) => {
    try {
      await navigator.clipboard.writeText(concept.visual_prompt || '');
      setMessage('Prompt byl zkopírován pro Canva, Adobe, Magnific nebo OpenArt handoff.');
    } catch {
      setMessage('Kopírování není v tomto prohlížeči dostupné.');
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-cyan/15 bg-[radial-gradient(circle_at_top_right,rgba(97,213,229,.12),transparent_38%),rgba(255,255,255,.025)] p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan"><MonitorPlay size={15}/><p className="font-mono text-[10px] uppercase tracking-[.18em]">Thumbnail Director · v1.0</p></div>
            <h3 className="mt-2 text-xl font-semibold text-white">Miniatury postavené na otázce, ne na dekoraci</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">Tři odlišné hypotézy, čistá obrazová vrstva, editovatelný text, 50% test, mobilní náhled a povinná kontrola skutečného produktu.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4">
            {['01 · Slib', '02 · A/B/C', '03 · Obraz', '04 · Kontrola'].map((step) => <span key={step} className="rounded-xl border border-white/10 bg-black/10 px-3 py-2 text-white/60">{step}</span>)}
          </div>
        </div>
      </section>

      <section className="grid gap-5 rounded-2xl border border-white/8 bg-white/[.025] p-5 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input className={INPUT} value={form.project_name} onChange={(event) => setForm({ ...form, project_name: event.target.value })} placeholder="Interní název projektu" />
            <select className={INPUT} value={form.channel} onChange={(event) => setForm({ ...form, channel: event.target.value })}>
              {Object.entries(FORMATS).map(([key, item]) => <option key={key} value={key}>{item.label} · {item.ratio}</option>)}
            </select>
          </div>
          <input className={INPUT} value={form.content_title} onChange={(event) => setForm({ ...form, content_title: event.target.value })} placeholder="Titulek videa nebo hlavní téma *" />
          <textarea className={INPUT + ' resize-none'} rows={3} value={form.brief} onChange={(event) => setForm({ ...form, brief: event.target.value })} placeholder="Co obsah skutečně slibuje a ukazuje?" />
          <div className="grid gap-4 md:grid-cols-2">
            <select className={INPUT} value={form.product_id} onChange={(event) => setForm({ ...form, product_id: event.target.value })}>
              <option value="">Bez konkrétního produktu</option>
              {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
            </select>
            <input className={INPUT} value={form.audience} onChange={(event) => setForm({ ...form, audience: event.target.value })} placeholder="Cílové publikum" />
          </div>
          <input className={INPUT} value={form.viewer_question} onChange={(event) => setForm({ ...form, viewer_question: event.target.value })} placeholder="Co si má divák po zhlédnutí miniatury položit?" />
          <textarea className={INPUT + ' resize-none'} rows={2} value={form.reference_urls} onChange={(event) => setForm({ ...form, reference_urls: event.target.value })} placeholder="Referenční odkazy, jeden na řádek" />
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 hover:border-cyan/30 hover:text-cyan">
              {busy === 'upload' ? <Loader size={13} className="animate-spin"/> : <Upload size={13}/>} Přidat referenční obrázek
              <input type="file" accept="image/*" className="hidden" onChange={(event) => uploadReference(event.target.files?.[0])} />
            </label>
            <span className="text-xs text-white/30">{sourceUrls.length} nahraných · export {format.dimensions}</span>
          </div>
          {sourceUrls.length > 0 && <div className="flex flex-wrap gap-2">{sourceUrls.map((url, index) => <img key={url + index} src={url} alt="" className="h-16 w-16 rounded-lg border border-white/10 object-cover" />)}</div>}
          <button onClick={generateConcepts} disabled={!!busy} className="inline-flex items-center gap-2 rounded-full bg-cyan px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50">
            {busy === 'concepts' ? <Loader size={15} className="animate-spin"/> : <Sparkles size={15}/>} Vytvořit tři koncepty
          </button>
        </div>

        <aside className="space-y-3 rounded-xl border border-white/8 bg-black/10 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan">Nastavení providerů</p>
          {[
            ['Base44 AI', 'Koncepty + čistý obraz', 'výchozí'],
            ['Google Drive', 'Automatický pracovní archiv', 'aktivní cesta'],
            ['Canva / Adobe', 'Typografie, ořez, finální layout', 'handoff'],
            ['Magnific / OpenArt', 'Upscale nebo alternativní směr', 'volitelné'],
          ].map(([name, purpose, status]) => <div key={name} className="rounded-xl border border-white/8 bg-white/[.025] p-3"><div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-white/75">{name}</span><span className="rounded-full bg-cyan/10 px-2 py-1 font-mono text-[9px] text-cyan">{status}</span></div><p className="mt-1 text-[11px] leading-5 text-white/35">{purpose}</p></div>)}
          <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/5 p-3 text-[11px] leading-5 text-emerald-200/70"><ShieldCheck size={14} className="mb-2"/>Publikování je vypnuté. Ukládají se pouze koncepty.</div>
        </aside>
      </section>

      {message && <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs leading-5 text-white/60">{message}</div>}

      {concepts.length > 0 && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan">A/B/C test</p><h3 className="mt-1 text-lg font-medium text-white">Tři odlišné mechanismy</h3></div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setShowHalfTest((value) => !value)} className={'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs ' + (showHalfTest ? 'border-amber-300/30 bg-amber-300/10 text-amber-200' : 'border-white/15 text-white/55')}><Eye size={13}/> 50% test</button>
              <button onClick={() => setShowSmallPreview((value) => !value)} className={'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs ' + (showSmallPreview ? 'border-cyan/30 bg-cyan/10 text-cyan' : 'border-white/15 text-white/55')}><MonitorPlay size={13}/> Malý náhled</button>
              <button onClick={saveDraft} disabled={!!busy} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-950 disabled:opacity-50">{busy === 'save' ? <Loader size={13} className="animate-spin"/> : <Save size={13}/>} Uložit koncept</button>
            </div>
          </div>

          <div className="grid gap-5 2xl:grid-cols-3">
            {concepts.map((concept, index) => {
              const image = images[index] || productReferences(selectedProduct)[0] || sourceUrls[0] || '';
              const score = totalScore(concept);
              const wordCount = String(concept.on_image_text || '').trim().split(/\s+/).filter(Boolean).length;
              const textClass = TEXT_POSITIONS[concept.text_position] || TEXT_POSITIONS['top-left'];
              return <article key={concept.variant + index} className={'overflow-hidden rounded-2xl border bg-white/[.025] ' + (concept.recommended ? 'border-cyan/35 shadow-[0_14px_45px_rgba(34,211,238,.08)]' : 'border-white/8')}>
                <div className="flex items-start justify-between gap-3 p-4">
                  <div><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan text-sm font-bold text-slate-950">{concept.variant}</span><div><p className="text-sm font-semibold text-white">{concept.name}</p><p className="text-[11px] text-white/35">{concept.mechanism}</p></div></div></div>
                  <div className="text-right"><p className={'text-xl font-light ' + (score >= 85 ? 'text-emerald-300' : score >= 75 ? 'text-cyan' : 'text-amber-300')}>{score}</p><p className="font-mono text-[9px] uppercase tracking-wider text-white/25">ze 100</p></div>
                </div>

                <div className={'relative overflow-hidden bg-gradient-to-br from-[#0D2D38] via-[#0E5B67] to-[#6F8F72] ' + format.aspect}>
                  {image ? <img src={image} alt="" className="h-full w-full object-cover"/> : <div className="flex h-full items-center justify-center"><ImageIcon size={32} className="text-white/20"/></div>}
                  <div className={'absolute inset-0 flex p-[7%] ' + textClass}><span className="max-w-[72%] text-balance text-[clamp(18px,3vw,42px)] font-black uppercase leading-[.9] tracking-[-.04em] text-white [text-shadow:0_3px_18px_rgba(0,0,0,.85)]">{concept.on_image_text}</span></div>
                  {showHalfTest && <div className="absolute inset-x-0 bottom-0 flex h-1/2 items-start justify-center border-t border-amber-200/70 bg-black/80 pt-2"><span className="rounded-full bg-amber-200 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-slate-900">zakrytá spodní 1/2</span></div>}
                </div>

                {showSmallPreview && <div className="border-b border-white/8 bg-black/15 px-4 py-3"><p className="mb-2 font-mono text-[9px] uppercase tracking-wider text-white/25">Rychlý malý náhled</p><div className={'relative w-[168px] overflow-hidden rounded-md bg-[#0D2D38] ' + format.aspect}>{image && <img src={image} alt="" className="h-full w-full object-cover"/>}<div className={'absolute inset-0 flex p-[7%] ' + textClass}><span className="max-w-[72%] text-[9px] font-black uppercase leading-[.9] text-white [text-shadow:0_1px_5px_rgba(0,0,0,.9)]">{concept.on_image_text}</span></div></div></div>}

                <div className="space-y-4 p-4">
                  <div className="grid gap-2 text-xs">
                    <Info label="Otázka diváka" value={concept.viewer_question}/>
                    <Info label="Emoce" value={concept.emotion}/>
                    <Info label="Doprovodný titulek" value={concept.companion_title}/>
                    <Info label="Kompozice" value={concept.composition}/>
                  </div>
                  <div className="space-y-2">{SCORE_LABELS.map(([key, label]) => { const value = clampScore(concept?.scores?.[key]); return <div key={key}><div className="mb-1 flex justify-between text-[10px] text-white/35"><span>{label}</span><span>{value}/10</span></div><div className="h-1 overflow-hidden rounded-full bg-white/8"><div className="h-full rounded-full bg-cyan" style={{ width: (value * 10) + '%' }}/></div></div>; })}</div>
                  <div className="space-y-2">
                    <div className={'flex items-center gap-2 text-[11px] ' + (wordCount <= 4 ? 'text-emerald-300/80' : 'text-amber-300')} >{wordCount <= 4 ? <CheckCircle2 size={13}/> : <AlertTriangle size={13}/>} Text: {wordCount} slov</div>
                    {(concept.risks || []).map((risk) => <div key={risk} className="flex items-start gap-2 text-[11px] leading-5 text-amber-200/60"><AlertTriangle size={12} className="mt-1 shrink-0"/>{risk}</div>)}
                  </div>
                  {concept.recommended && <div className="rounded-xl border border-cyan/15 bg-cyan/5 p-3 text-[11px] leading-5 text-cyan/75"><Sparkles size={13} className="mb-1"/>Doporučená první varianta. {concept.recommendation_reason}</div>}
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => generateImage(concept, index)} disabled={!!busy} className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan/20 bg-cyan/10 px-3 py-2.5 text-[11px] font-semibold text-cyan disabled:opacity-40">{busy === 'image-' + index ? <Loader size={12} className="animate-spin"/> : images[index] ? <RefreshCw size={12}/> : <ImageIcon size={12}/>} {images[index] ? 'Nový obraz' : 'Vytvořit obraz'}</button>
                    <button onClick={() => copyPrompt(concept)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/5 px-3 py-2.5 text-[11px] font-semibold text-white/60"><Clipboard size={12}/> Kopírovat prompt</button>
                  </div>
                </div>
              </article>;
            })}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-white/8 bg-white/[.02] p-5">
        <div className="flex items-center gap-2"><Layers3 size={14} className="text-cyan"/><p className="font-mono text-[10px] uppercase tracking-[.18em] text-cyan">Uložené koncepty</p></div>
        {!drafts.length ? <p className="mt-4 text-sm text-white/25">Zatím tu není uložený thumbnail projekt.</p> : <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{drafts.map((draft) => <div key={draft.id} className="rounded-xl border border-white/8 bg-black/10 p-3"><div className="flex items-center justify-between gap-2"><p className="truncate text-xs font-semibold text-white/75">{draft.title}</p><span className="rounded-full bg-white/5 px-2 py-1 font-mono text-[9px] text-white/35">{draft.status}</span></div><p className="mt-2 text-[11px] text-white/35">{FORMATS[draft.channel]?.label || draft.channel} · {draft.aspect_ratio}</p><p className="mt-1 text-[11px] text-cyan/60">Varianta {draft.recommended_variant || 'k výběru'} · schválení povinné</p></div>)}</div>}
      </section>
    </div>
  );
}

function Info({ label, value }) {
  return <div className="rounded-xl border border-white/8 bg-black/10 p-3"><p className="font-mono text-[9px] uppercase tracking-wider text-white/25">{label}</p><p className="mt-1 leading-5 text-white/60">{value || '—'}</p></div>;
}
