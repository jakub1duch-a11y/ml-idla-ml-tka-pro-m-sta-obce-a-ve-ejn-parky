import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Camera, ImagePlus, Loader, RefreshCw, Sparkles, Upload, WandSparkles } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { setSEO } from '@/lib/seo';

const isImageUrl = (url = '') => /\.(png|jpe?g|webp)(\?|$)/i.test(url) || url.includes('/images/');
const MAX_UPLOAD_MB = 20;
const OPTIMIZE_FROM_MB = 12;

const optimizeLargePhoto = async (file) => {
  if (file.size <= OPTIMIZE_FROM_MB * 1024 * 1024) return file;
  const bitmap = await createImageBitmap(file);
  const maxDimension = 3200;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const toBlob = (quality) => new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
  let blob = await toBlob(0.88);
  if (blob && blob.size > OPTIMIZE_FROM_MB * 1024 * 1024) blob = await toBlob(0.76);
  if (!blob) return file;
  const baseName = file.name.replace(/\.[^.]+$/, '');
  return new File([blob], `${baseName}-optimized.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
};

export default function AIVizualizace() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const requestedSlug = searchParams.get('slug') || '';
  const fastMode = Boolean(requestedSlug);
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [sourceUrl, setSourceUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [description, setDescription] = useState(() => searchParams.get('zadani') || sessionStorage.getItem('mlzidla-ai-zadani') || '');

  const updateDescription = (nextValue) => {
    setDescription(nextValue);
    sessionStorage.setItem('mlzidla-ai-zadani', nextValue);
  };
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [productsLoading, setProductsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [autoGeneratePending, setAutoGeneratePending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setSEO({
      title: 'AI vizualizace mlžítka v prostoru | MLŽIDLA®',
      description: 'Nahrajte fotografii místa a vytvořte orientační AI vizualizaci reálného výrobku MLŽIDLA® přímo ve vašem prostoru.',
      canonicalPath: '/ai-vizualizace',
    });
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const list = await base44.entities.Product.list();
        if (!active) return;
        const visualProducts = (list || []).filter((item) => item?.image_url && item?.slug !== 'mlzici-tryska');
        setProducts(visualProducts);
        const preferred = visualProducts.find((item) => item.slug === requestedSlug) || visualProducts.find((item) => item.slug === 'mlzitko-bendy') || visualProducts[0];
        if (preferred) setSelectedProductId(preferred.id);
      } catch (e) {
        if (active) setError('Nepodařilo se načíst produktový katalog. Obnovte prosím stránku.');
      } finally {
        if (active) setProductsLoading(false);
      }
    })();
    return () => { active = false; };
  }, [requestedSlug]);

  useEffect(() => () => {
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const selectedProduct = useMemo(() => products.find((item) => item.id === selectedProductId) || null, [products, selectedProductId]);
  const canGenerate = useMemo(() => Boolean((file || sourceUrl) && selectedProduct?.image_url), [file, sourceUrl, selectedProduct]);

  const pickFile = async (selected) => {
    if (!selected) return;
    if (!selected.type?.startsWith('image/')) {
      setError('Nahrajte prosím fotografii ve formátu JPG, PNG nebo WebP.');
      return;
    }
    if (selected.size > MAX_UPLOAD_MB * 1024 * 1024) {
      setError(`Fotografie je příliš velká. Maximální velikost je ${MAX_UPLOAD_MB} MB.`);
      return;
    }
    setError('');
    setOptimizing(true);
    try {
      const prepared = await optimizeLargePhoto(selected);
      setFile(prepared);
      setSourceUrl('');
      setResultUrl('');
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(prepared));
      setAutoGeneratePending(true);
    } catch (e) {
      setError('Fotografii se nepodařilo připravit. Zkuste menší JPG nebo WebP soubor.');
    } finally {
      setOptimizing(false);
    }
  };

  const generate = async () => {
    if (!canGenerate || loading) return;
    setLoading(true);
    setError('');
    try {
      let uploadedUrl = sourceUrl;
      if (!uploadedUrl && file) {
        const upload = await base44.integrations.Core.UploadFile({ file });
        uploadedUrl = upload.file_url;
        setSourceUrl(uploadedUrl);
      }

      const context = description.trim() || 'venkovní prostor určený k ochlazení lidí během horkých dnů';
      const productRefs = [selectedProduct.image_url, ...(selectedProduct.gallery_urls || []).filter(isImageUrl)]
        .filter(Boolean)
        .filter((url, index, all) => all.indexOf(url) === index)
        .slice(0, 4);
      const response = await base44.integrations.Core.GenerateImage({
        prompt: `Vytvoř fotorealistickou architektonickou vizualizaci skutečného výrobku MLŽIDLA® HolmTec v nahraném prostoru. PRVNÍ referenční obrázek je fotografie prostoru. DALŠÍ referenční obrázky zobrazují skutečný výrobek ${selectedProduct.name}. PRIORITA Č. 1 JE VĚRNOST VÝROBKU. Nekresli nový design a výrobek kreativně nepřepracovávej. Zachovej jeho rozpoznatelnou siluetu, počet a průběh konstrukčních prvků, proporce, rádiusy a charakter ohybů, profil/trubku, povrch nerezu, polohu hlavních částí a viditelné konstrukční detaily podle produktových referencí. Nepřidávej ramena, oblouky, sloupky, dekorace ani trysky, které na referencích nejsou zřejmé. Pokud některý detail z referencí nelze spolehlivě určit, raději jej zjednoduš než vymýšlej. Produkt: ${selectedProduct.name}. Materiál dle katalogu: ${selectedProduct.material || 'nerezová ocel'}. Katalogový popis: ${selectedProduct.short_description || ''}. ZÁKLAD SCÉNY: zachovej geometrii, perspektivu, budovy, povrchy, zeleň, mobiliář, osoby, světlo a identitu původní fotografie co nejvěrněji. Smíš upravit pouze to, co je nutné pro fyzické vložení výrobku: jeho měřítko, perspektivu, natočení, kontakt se zemí, realistické stíny a odrazy. Zadání zákazníka: ${context}. Přidej pouze jemnou realistickou vodní mlhu v místech, kde odpovídá konstrukci výrobku; bez mokrých louží a bez zakrytí produktu. Bez textu, bez logotypů, bez grafických overlayů. Výsledek musí vypadat jako fotografie možné realizace se SKUTEČNÝM PRODUKTEM, nikoli jako nový koncept inspirovaný produktem.`,
        existing_image_urls: [uploadedUrl, ...productRefs],
      });
      if (!response?.url) throw new Error('Generátor nevrátil výsledný obrázek.');
      setResultUrl(response.url);
    } catch (e) {
      setError(e?.message || 'Vizualizaci se nepodařilo vytvořit. Zkuste to prosím znovu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!autoGeneratePending || optimizing || loading || !file || !selectedProduct?.image_url) return;
    setAutoGeneratePending(false);
    generate();
  }, [autoGeneratePending, optimizing, loading, file, selectedProductId]);

  const sendToQuote = () => {
    const text = [
      'AI vizualizace projektu MLŽIDLA®',
      description.trim() ? `Zadání: ${description.trim()}` : '',
      selectedProduct ? `Vybraný reálný výrobek: ${selectedProduct.name}` : '',
      selectedProduct?.slug ? `Produkt: /produkt/${selectedProduct.slug}` : '',
      resultUrl ? `AI vizualizace: ${resultUrl}` : '',
      sourceUrl ? `Fotografie prostoru: ${sourceUrl}` : '',
    ].filter(Boolean).join('\n\n');
    navigate(`/poptavka?produkt=${encodeURIComponent('AI návrh projektu')}&zprava=${encodeURIComponent(text)}`);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white pt-24 pb-20">
      <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10 lg:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.05] px-3 py-1.5 mb-5">
            <WandSparkles size={14} className="text-teal-300" />
            <span className="font-mono text-[10px] tracking-[.18em] uppercase text-white/65">AI vizualizace MLŽIDLA®</span>
          </div>
          <h1 className="font-heading font-light text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight">{fastMode ? <>Vyfoťte místo.<br/><span className="text-white/45">BENDY se načte automaticky.</span></> : <>Uvidíte mlžítko přímo<br/><span className="text-white/45">ve vašem prostoru.</span></>}</h1>
          <p className="mt-6 max-w-2xl text-base lg:text-lg leading-relaxed text-white/55">{fastMode ? 'Na mobilu otevřeme zadní kameru. Vyfoťte místo, kam chcete produkt umístit — po pořízení snímku se vizualizace spustí automaticky.' : 'Nahrajte fotografii náměstí, parku, školky, sportoviště nebo zahrady. AI zachová scénu a vytvoří orientační vizualizaci vhodného mlžicího prvku.'}</p>
        </div>

        <div className="grid lg:grid-cols-[.86fr_1.14fr] gap-7 lg:gap-10 items-start">
          <div className="rounded-[26px] border border-white/10 bg-white/[.055] p-5 sm:p-6 lg:p-7">
            <p className="font-mono text-[10px] tracking-[.16em] uppercase text-white/40 mb-3">1 · Fotografie prostoru</p>
            <button type="button" onClick={() => fileRef.current?.click()} className="group relative w-full overflow-hidden rounded-2xl border border-dashed border-white/15 bg-black/20 aspect-[4/3] flex items-center justify-center hover:border-teal-300/50 transition-colors">
              {previewUrl || sourceUrl ? (
                <img src={previewUrl || sourceUrl} alt="Nahraný prostor" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="text-center px-6">
                  <div className="mx-auto mb-4 w-12 h-12 rounded-full border border-white/10 bg-white/[.06] flex items-center justify-center"><Camera size={20} className="text-white/60"/></div>
                  <p className="text-sm font-semibold text-white/80">{fastMode ? 'Vyfotit místo' : 'Nahrát fotografii prostoru'}</p>
                  <p className="mt-2 text-xs text-white/35">{fastMode ? 'Použijte zadní kameru telefonu' : 'JPG, PNG nebo WebP · max. 20 MB'}</p>
                  <p className="mt-1 text-[10px] text-white/25">Fotky nad 12 MB automaticky optimalizujeme před nahráním.</p>
                </div>
              )}
              {(previewUrl || sourceUrl) && <div className="absolute bottom-3 right-3 rounded-full bg-slate-950/85 backdrop-blur px-3 py-2 text-xs flex items-center gap-2"><Upload size={13}/> Změnit foto</div>}
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" capture={fastMode ? 'environment' : undefined} className="hidden" onChange={(e) => pickFile(e.target.files?.[0])}/>

            {!fastMode && <>
              <label className="block mt-6 font-mono text-[10px] tracking-[.16em] uppercase text-white/40">2 · Skutečný výrobek</label>
              <select value={selectedProductId} onChange={(e) => { setSelectedProductId(e.target.value); setResultUrl(''); }} disabled={productsLoading} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3.5 text-sm text-white focus:outline-none focus:border-teal-300/50 disabled:opacity-50">
                {productsLoading && <option>Načítám katalog…</option>}
                {products.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </>}
            {selectedProduct && (
              <div className="mt-3 flex gap-3 rounded-xl border border-white/10 bg-black/20 p-3">
                <img src={selectedProduct.image_url} alt={selectedProduct.name} className="h-20 w-20 flex-none rounded-lg bg-white object-contain" />
                <div className="min-w-0 self-center">
                  <p className="text-sm font-semibold text-white/85">{selectedProduct.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/40">{selectedProduct.short_description || selectedProduct.material}</p>
                  <p className="mt-1.5 text-[10px] font-mono uppercase tracking-wider text-teal-300/70">{fastMode ? 'Produkt je vybraný automaticky' : 'Reference výrobku je povinná'}</p>
                </div>
              </div>
            )}

            {!fastMode && <>
              <label className="block mt-6 font-mono text-[10px] tracking-[.16em] uppercase text-white/40">3 · Doplňte záměr</label>
              <textarea value={description} onChange={(e) => updateDescription(e.target.value)} rows={4} placeholder="Např. chceme vytvořit atraktivní ochlazovací místo pro děti i dospělé, vysoká návštěvnost, trvalá instalace…" className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm leading-relaxed text-white placeholder:text-white/25 focus:outline-none focus:border-teal-300/50"/>
            </>}

            {error && <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p>}

            {!fastMode && <button type="button" onClick={generate} disabled={!canGenerate || loading || optimizing} className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-teal-50 disabled:opacity-35 disabled:cursor-not-allowed transition-colors">
              {optimizing ? <><Loader size={16} className="animate-spin"/> Optimalizuji fotografii…</> : loading ? <><Loader size={16} className="animate-spin"/> Vytvářím vizualizaci…</> : <><Sparkles size={16}/> Vytvořit AI vizualizaci</>}
            </button>}
            {fastMode && (optimizing || loading) && <div className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[.05] px-6 py-3.5 text-sm text-white/70"><Loader size={16} className="animate-spin"/>{optimizing ? 'Připravuji fotografii…' : 'Vytvářím vizualizaci…'}</div>}
            <p className="mt-4 text-[11px] leading-relaxed text-white/30">AI používá jako povinnou referenci skutečné fotografie vybraného výrobku z katalogu. Vizualizace je stále koncepční; přesné rozměry, kotvení, trysky a napojení potvrzuje technický návrh HolmTec.</p>
          </div>

          <div className="rounded-[26px] border border-white/10 bg-white/[.04] p-4 sm:p-5 lg:p-6 min-h-[520px] flex flex-col">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="font-mono text-[10px] tracking-[.16em] uppercase text-white/35">Výsledek</p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight">AI koncept realizace</h2>
              </div>
              {resultUrl && <button type="button" onClick={generate} disabled={loading} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-white/65 hover:bg-white/[.06]"><RefreshCw size={13}/> Nová varianta</button>}
            </div>

            <div className="relative flex-1 overflow-hidden rounded-2xl bg-black/20 border border-white/8 min-h-[420px] flex items-center justify-center">
              {resultUrl ? (
                <img src={resultUrl} alt="AI vizualizace mlžítka v prostoru" className="w-full h-full object-contain" />
              ) : loading ? (
                <div className="text-center px-8">
                  <Loader size={28} className="animate-spin mx-auto text-teal-300"/>
                  <p className="mt-4 text-sm text-white/65">AI komponuje mlžítko do fotografie…</p>
                  <p className="mt-2 text-xs text-white/30">Zachovává perspektivu a charakter původního místa.</p>
                </div>
              ) : (
                <div className="text-center px-8 max-w-sm">
                  <ImagePlus size={34} className="mx-auto text-white/20"/>
                  <p className="mt-4 text-sm text-white/55">Výsledná vizualizace se zobrazí zde.</p>
                  <p className="mt-2 text-xs leading-relaxed text-white/28">Pro nejlepší výsledek použijte fotografii focenou přibližně z výšky očí, bez extrémně širokého objektivu.</p>
                </div>
              )}
            </div>

            {resultUrl && (
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button type="button" onClick={sendToQuote} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-teal-400 px-5 py-3.5 text-sm font-bold text-slate-950 hover:bg-teal-300 transition-colors">Poptat tento návrh <ArrowRight size={15}/></button>
                {!fastMode && <Link to={`/poradce?zadani=${encodeURIComponent(description || 'Chci navrhnout řešení podle AI vizualizace prostoru.')}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 px-5 py-3.5 text-sm text-white/70 hover:bg-white/[.06]">Probrat s AI Projektantem</Link>}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
