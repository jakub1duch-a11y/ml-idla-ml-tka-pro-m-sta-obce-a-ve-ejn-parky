import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Camera, ImagePlus, Loader, RefreshCw, Sparkles, Upload, WandSparkles } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { setSEO } from '@/lib/seo';

const solutionTypes = [
  { value: 'auto', label: 'Nechat vybrat AI' },
  { value: 'bendy', label: 'Bendy – městské stéblo' },
  { value: 'city', label: 'CITY / obloukové sestavy' },
  { value: 'linea', label: 'Linea – čistý vertikální prvek' },
  { value: 'custom', label: 'Zakázkové řešení na míru' },
];

const prompts = {
  auto: 'zvol nejvhodnější elegantní městské mlžítko podle prostoru a kompozice',
  bendy: 'použij štíhlé organicky prohnuté nerezové mlžítko Bendy, delší městské provedení připomínající stéblo',
  city: 'použij architektonickou sestavu CITY s nerezovými oblouky nebo víceprvkovým mlžištěm',
  linea: 'použij minimalistický vertikální nerezový prvek Linea, čistý a subtilní',
  custom: 'navrhni originální zakázkovou nerezovou mlžnou instalaci respektující charakter místa',
};

export default function AIVizualizace() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [sourceUrl, setSourceUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [description, setDescription] = useState(searchParams.get('zadani') || '');
  const [solution, setSolution] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setSEO({
      title: 'AI vizualizace mlžítka v prostoru | MLŽIDLA®',
      description: 'Nahrajte fotografii místa a vytvořte orientační AI vizualizaci mlžítka přímo ve vašem prostoru.',
      canonicalPath: '/ai-vizualizace',
    });
  }, []);

  useEffect(() => () => {
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const canGenerate = useMemo(() => Boolean(file || sourceUrl), [file, sourceUrl]);

  const pickFile = (selected) => {
    if (!selected) return;
    if (!selected.type?.startsWith('image/')) {
      setError('Nahrajte prosím fotografii ve formátu JPG, PNG nebo WebP.');
      return;
    }
    if (selected.size > 12 * 1024 * 1024) {
      setError('Fotografie je příliš velká. Maximální velikost je 12 MB.');
      return;
    }
    setError('');
    setFile(selected);
    setSourceUrl('');
    setResultUrl('');
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(selected));
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

      const context = description.trim() || 'veřejný venkovní prostor určený k ochlazení lidí během horkých dnů';
      const response = await base44.integrations.Core.GenerateImage({
        prompt: `Vytvoř fotorealistickou architektonickou AI vizualizaci pro značku MLŽIDLA® HolmTec. ZÁKLAD: zachovej geometrii, perspektivu, budovy, povrchy, zeleň, mobiliář, světlo a celkovou identitu původní fotografie co nejvěrněji. Do stejného prostoru přirozeně integruj profesionální nerezový mlžicí prvek: ${prompts[solution]}. Zadání prostoru: ${context}. Produkt musí působit fyzicky realisticky, správně ukotvený k terénu a v odpovídajícím měřítku. Použij kartáčovanou nerezovou ocel, subtilní prémiový městský design a velmi jemnou chladicí mlhu vycházející z trysek. Mlha nesmí zakrývat scénu ani vytvářet mokré louže. Zachovej lidi a okolí přirozené, bez deformací. Bez textu, bez logotypů, bez grafických overlayů. Výsledek má vypadat jako profesionální vizualizace skutečné realizace, ne jako fantasy koncept.`,
        existing_image_urls: [uploadedUrl],
      });
      if (!response?.url) throw new Error('Generátor nevrátil výsledný obrázek.');
      setResultUrl(response.url);
    } catch (e) {
      setError(e?.message || 'Vizualizaci se nepodařilo vytvořit. Zkuste to prosím znovu.');
    } finally {
      setLoading(false);
    }
  };

  const sendToQuote = () => {
    const text = [
      'AI vizualizace projektu MLŽIDLA®',
      description.trim() ? `Zadání: ${description.trim()}` : '',
      `Preferované řešení: ${solutionTypes.find((item) => item.value === solution)?.label || solution}`,
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
          <h1 className="font-heading font-light text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight">Uvidíte mlžítko přímo<br/><span className="text-white/45">ve vašem prostoru.</span></h1>
          <p className="mt-6 max-w-2xl text-base lg:text-lg leading-relaxed text-white/55">Nahrajte fotografii náměstí, parku, školky, sportoviště nebo zahrady. AI zachová scénu a vytvoří orientační vizualizaci vhodného mlžicího prvku.</p>
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
                  <p className="text-sm font-semibold text-white/80">Nahrát fotografii prostoru</p>
                  <p className="mt-2 text-xs text-white/35">JPG, PNG nebo WebP · max. 12 MB</p>
                </div>
              )}
              {(previewUrl || sourceUrl) && <div className="absolute bottom-3 right-3 rounded-full bg-slate-950/85 backdrop-blur px-3 py-2 text-xs flex items-center gap-2"><Upload size={13}/> Změnit foto</div>}
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => pickFile(e.target.files?.[0])}/>

            <label className="block mt-6 font-mono text-[10px] tracking-[.16em] uppercase text-white/40">2 · Typ řešení</label>
            <select value={solution} onChange={(e) => { setSolution(e.target.value); setResultUrl(''); }} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3.5 text-sm text-white focus:outline-none focus:border-teal-300/50">
              {solutionTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>

            <label className="block mt-6 font-mono text-[10px] tracking-[.16em] uppercase text-white/40">3 · Doplňte záměr</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Např. chceme vytvořit atraktivní ochlazovací místo pro děti i dospělé, vysoká návštěvnost, trvalá instalace…" className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm leading-relaxed text-white placeholder:text-white/25 focus:outline-none focus:border-teal-300/50"/>

            {error && <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-100">{error}</p>}

            <button type="button" onClick={generate} disabled={!canGenerate || loading} className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-teal-50 disabled:opacity-35 disabled:cursor-not-allowed transition-colors">
              {loading ? <><Loader size={16} className="animate-spin"/> Vytvářím vizualizaci…</> : <><Sparkles size={16}/> Vytvořit AI vizualizaci</>}
            </button>
            <p className="mt-4 text-[11px] leading-relaxed text-white/30">Vizualizace je koncepční. Přesnou polohu, počet trysek, tlak, průtok, kotvení a napojení potvrzuje technický návrh HolmTec.</p>
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
                <button type="button" onClick={sendToQuote} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-teal-400 px-5 py-3.5 text-sm font-bold text-slate-950 hover:bg-teal-300 transition-colors">Nechat tento návrh nacenit <ArrowRight size={15}/></button>
                <Link to={`/poradce?zadani=${encodeURIComponent(description || 'Chci navrhnout řešení podle AI vizualizace prostoru.')}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 px-5 py-3.5 text-sm text-white/70 hover:bg-white/[.06]">Probrat s AI Projektantem</Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
