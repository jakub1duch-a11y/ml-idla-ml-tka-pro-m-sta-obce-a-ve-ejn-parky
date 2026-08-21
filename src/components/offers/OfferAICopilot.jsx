import React, { useEffect, useMemo, useState } from 'react';
import { Bot, Check, FileImage, FileText, ImagePlus, Loader2, Send, Sparkles, UploadCloud } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { createOfferAttachmentName, SOBESLAV_OFFER_STANDARD } from '@/lib/offer-standard';

const isImage = (file) => String(file?.file_type || '').startsWith('image/') || /\.(png|jpe?g|webp|gif)(\?|$)/i.test(String(file?.file_url || ''));
const short = (value, max = 180) => String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
const errorMessage = (error) => error?.response?.data?.error || error?.message || 'Akci se nepodařilo dokončit.';

const QUICK_PROMPTS = [
  'Navrhni nejlepší řešení této poptávky ve 3 stručných variantách a doporuč jednu.',
  'Připrav klientské shrnutí projektu bez interních poznámek a bez vymyšlených parametrů.',
  'Navrhni osnovu profesionální prezentace pro klienta v 8–10 slidech.',
  'Zkontroluj, co ještě chybí k bezpečné a profesionální cenové nabídce.',
];

export default function OfferAICopilot({ inquiry, product, attachments = [], onAttachmentsChange, quoteContext, onPrepareOffer, prepareBusy, onAutoPrepareFromText, autoPrepareBusy }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatBusy, setChatBusy] = useState(false);
  const [visualBusy, setVisualBusy] = useState(false);
  const [assets, setAssets] = useState([]);
  const [sourceUrl, setSourceUrl] = useState('');
  const [learningFeedback, setLearningFeedback] = useState([]);
  const [feedbackForm, setFeedbackForm] = useState({ feedback_type: 'critique', category: 'visual_style', feedback_text: '', priority: 4 });
  const [feedbackBusy, setFeedbackBusy] = useState(false);
  const [feedbackSaved, setFeedbackSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMessages([{ role: 'assistant', text: `Mám otevřenou poptávku ${inquiry?.name || 'klienta'}. Můžu připravit klientské shrnutí, návrh řešení, vizualizaci i strukturu prezentace.` }]);
    setSourceUrl('');
    setError('');
    if (!inquiry?.id) { setAssets([]); return; }
    let active = true;
    base44.entities.OfferAsset.list('-created_date', 200)
      .then((rows) => {
        if (!active) return;
        const linked = (rows || []).filter((item) => item.inquiry_id === inquiry.id);
        setAssets(linked);
        const preferred = linked.find((item) => item.asset_type === 'source_photo') || linked.find(isImage);
        if (preferred?.file_url) setSourceUrl(preferred.file_url);
      })
      .catch(() => { if (active) setAssets([]); });
    base44.entities.OfferLearningFeedback.list('-created_date', 250)
      .then((rows) => { if (active) setLearningFeedback((rows || []).filter((item) => item.active !== false)); })
      .catch(() => { if (active) setLearningFeedback([]); });
    return () => { active = false; };
  }, [inquiry?.id]);

  const imageAssets = useMemo(() => {
    const merged = [...assets, ...attachments].filter(isImage);
    const seen = new Set();
    return merged.filter((item) => {
      if (!item?.file_url || seen.has(item.file_url)) return false;
      seen.add(item.file_url);
      return true;
    });
  }, [assets, attachments]);

  const activeLearningRules = useMemo(() => [...learningFeedback]
    .sort((a, b) => Number(b.priority || 3) - Number(a.priority || 3))
    .slice(0, 24), [learningFeedback]);
  const learningContext = useMemo(() => activeLearningRules.length
    ? activeLearningRules.map((item) => `- P${item.priority || 3} [${item.category || 'other'} / ${item.feedback_type || 'feedback'}] ${item.lesson || item.feedback_text}`).join('\n')
    : '- Zatím nejsou uložená žádná aktivní naučená pravidla.', [activeLearningRules]);
  const visualLearningContext = useMemo(() => activeLearningRules
    .filter((item) => ['visual_style','product_geometry','presentation','technical_accuracy'].includes(item.category))
    .slice(0, 12)
    .map((item) => `- ${item.lesson || item.feedback_text}`)
    .join('\n'), [activeLearningRules]);

  const contextPrompt = (request) => `Jsi AI obchodní a návrhový asistent značky MLŽIDLA.cz by HolmTec. Pracuješ pouze pro interní přípravu profesionální nabídky, ale všechny texty označené jako klientské musí být rovnou použitelné pro zákazníka.

PRAVIDLA:
- U technických produktových dat vždy dodrž: use null when unknown / do not infer. Neznámou hodnotu nehádej ani nedoplňuj z podobného produktu.
- Nevymýšlej technické parametry, spotřebu, tlak, cenu ani reference, které nejsou v podkladech.
- Nepiš klientovi interní poznámky, ID, workflow, zdroje e-mailu ani instrukce pro obchodníka.
- Návrhy mlžítek musí být minimalistické, čisté, reálně vyrobitelné z nerezové trubky a bez zbytečné geometrie.
- U BENDY zachovej jeden čistý plynulý profil; žádné výhonky, větve, přídavná ramena, hadice ani kabely vycházející z těla produktu.
- Pokud něco není potvrzené, označ to jako bod k technickému upřesnění.
- Piš česky, profesionálně, stručně a konkrétně.
- Dodržuj závazný standard ${SOBESLAV_OFFER_STANDARD.source} v${SOBESLAV_OFFER_STANDARD.version}: ${SOBESLAV_OFFER_STANDARD.structure.join(', ')}.
- Přílohy vždy označuj podle ${SOBESLAV_OFFER_STANDARD.attachmentRule}; fotografii nebo vizualizaci nezaměňuj za technický výkres či cenovou nabídku.
- U více kusů vždy vyžádej nebo zkontroluj samostatné nacenění, projektovou cenu a úsporu v Kč i procentech.

KLIENT: ${inquiry?.name || ''}
ORGANIZACE: ${inquiry?.firma || inquiry?.company || ''}
POPTÁVKA: ${inquiry?.message || ''}
VYBRANÝ PRODUKT: ${product?.name || inquiry?.product || 'zatím neurčen'}
CENOVÝ KONTEXT: ${quoteContext || 'zatím bez ceny'}

AKTIVNÍ NAUČENÁ PRAVIDLA Z HUB NABÍDEK:
${learningContext}

ÚKOL: ${request}`;

  const sendChat = async (request = input) => {
    const cleanRequest = String(request || '').trim();
    if (!cleanRequest || chatBusy) return;
    setInput(''); setError(''); setChatBusy(true);
    setMessages((current) => [...current, { role: 'user', text: cleanRequest }]);
    try {
      const response = await base44.integrations.Core.InvokeLLM({ prompt: contextPrompt(cleanRequest) });
      const text = typeof response === 'string' ? response : response?.text || response?.output_text || JSON.stringify(response, null, 2);
      setMessages((current) => [...current, { role: 'assistant', text }]);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setChatBusy(false);
    }
  };

  const saveLearningFeedback = async () => {
    const feedbackText = String(feedbackForm.feedback_text || '').trim();
    if (!feedbackText || feedbackBusy) return;
    setFeedbackBusy(true);
    setFeedbackSaved(false);
    setError('');
    try {
      const created = await base44.entities.OfferLearningFeedback.create({
        inquiry_id: inquiry?.id || '',
        feedback_type: feedbackForm.feedback_type,
        category: feedbackForm.category,
        feedback_text: feedbackText,
        lesson: feedbackText,
        priority: Number(feedbackForm.priority || 3),
        active: true,
        source: 'sales_hub',
        applied_count: 0,
      });
      setLearningFeedback((current) => [created, ...current]);
      setFeedbackForm((current) => ({ ...current, feedback_text: '' }));
      setFeedbackSaved(true);
      setMessages((current) => [...current, { role: 'assistant', text: 'Připomínku jsem uložil jako aktivní pravidlo. Při dalších návrzích v Hub nabídky ji budu zahrnovat do kontextu.' }]);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setFeedbackBusy(false);
    }
  };

  const uploadSource = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !inquiry?.id) return;
    setError('');
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      const isSourcePhoto = file.type?.startsWith('image/');
      const typeLabel = isSourcePhoto ? 'FOTO_MISTA' : 'PODKLAD';
      const standardizedName = createOfferAttachmentName({
        clientName: inquiry?.firma || inquiry?.company || inquiry?.name,
        type: typeLabel,
        index: assets.filter((item) => item.asset_type === (isSourcePhoto ? 'source_photo' : 'source_document')).length + 1,
        originalName: file.name,
      });
      const asset = await base44.entities.OfferAsset.create({
        inquiry_id: inquiry.id,
        inquiry_type: inquiry.type,
        file_url: result.file_url,
        file_name: standardizedName,
        file_type: file.type || 'application/octet-stream',
        asset_type: isSourcePhoto ? 'source_photo' : 'source_document',
        title: isSourcePhoto ? 'Fotografie místa pro vizualizaci' : 'Projektový podklad',
        description: `Původní název souboru: ${file.name}`,
        selected_for_offer: true,
        generated_by_ai: false,
      });
      setAssets((current) => [asset, ...current]);
      if (isImage(asset)) setSourceUrl(asset.file_url);
      onAttachmentsChange?.([...attachments.filter((item) => item.file_url !== asset.file_url), asset]);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      event.target.value = '';
    }
  };

  const generateVisualization = async () => {
    if (!inquiry?.id || !product?.name || !sourceUrl || visualBusy) {
      if (!sourceUrl) setError('Nejdříve vyberte nebo nahrajte fotografii prostoru.');
      else if (!product?.name) setError('Nejdříve vyberte produkt pro nabídku.');
      return;
    }
    setError(''); setVisualBusy(true);
    try {
      const refs = [product.image_url, ...(product.gallery_urls || [])].filter(Boolean).filter((url, i, all) => all.indexOf(url) === i).slice(0, 4);
      const mistVariants = [
        'Téměř bezvětří: mlha zůstává krátce kompaktní u trysek a pak se jemně rozpouští.',
        'Lehký vítr zleva doprava: mlha se přirozeně stáčí do strany, ale vychází přesně z trysek.',
        'Lehký vítr zprava doleva: jemná mlha je mírně nesymetrická a realisticky unášená.',
        'Proměnlivý slabý vánek: část mlhy se drží u produktu a část se lehce rozptyluje do pobytové zóny.',
      ];
      const mistBehavior = mistVariants[Math.floor(Math.random() * mistVariants.length)];
      const isBendy = /bendy/i.test(`${product.name || ''} ${product.slug || ''}`);
      const productRule = isBendy
        ? `BENDY LOCK: Referenční produkt BENDY musí zůstat konstrukčně čistý jako na produktové fotografii. Jedna samostatná nerezová trubka tvoří rovný svislý dřík a nahoře přechází do jediného plynulého oblouku. ŽÁDNÉ výhonky, větvičky, boční trubky, hadice, kabely, sekundární oblouky ani dekorativní přídavky. Mlžicí trysky jsou malé samostatné kovové trysky přímo osazené v hlavní trubce a pouze z nich vystupuje jemná mlha. Nevytvářej žádné hadičky vedoucí k tryskám. Zachovej štíhlé proporce, broušený nerezový povrch a jednoduché kotvení.`
        : `PRODUCT LOCK: Zachovej přesně rozpoznatelnou siluetu, hlavní konstrukci, proporce, materiál a charakter produktu podle produktových referencí. Produkt kreativně nepřepracovávej a nepřidávej nové konstrukční části.`;
      const response = await base44.integrations.Core.GenerateImage({
        prompt: `Vytvoř fotorealistickou architektonickou vizualizaci pro obchodní nabídku MLŽIDLA.cz.

PRVNÍ obrázek je prostor klienta. Zachovej jeho kompozici, architekturu, cestu, lavičky, zeleň, perspektivu, denní dobu a všechny stávající prvky. Nepřestavuj místo. Do prostoru pouze realisticky osaď vybraný produkt podle dalších referenčních obrázků.

${productRule}

NAUČENÁ VIZUÁLNÍ A TECHNICKÁ PRAVIDLA Z HUBU:
${visualLearningContext || '- žádná další pravidla'}

Projekt klienta: ${short(inquiry.message, 900)}
Produkt: ${product.name}.
Umístění navrhni bezpečně v návaznosti na pěší trasu a pobytová místa, nikoli jako překážku. Měřítko odvoď z laviček, dveří, dlažby a dalších prvků scény. Přidej jemnou realistickou vodní mlhu pouze z viditelných kovových trysek. CHOVÁNÍ MLHY PRO TENTO RENDER: ${mistBehavior} Mlha musí respektovat proudění vzduchu, perspektivu a přirozené rozptýlení; žádné symetrické CGI obláčky, kouř ani mléčná stěna. Bez louží, bez dramatického efektu, bez textů, bez loga a bez grafických overlayů. Výsledek musí působit jako profesionální fotografie hotové realizace stejného prostoru, ne jako 3D render.`,
        existing_image_urls: [sourceUrl, ...refs],
      });
      if (!response?.url) throw new Error('Generátor nevrátil vizualizaci.');
      const fileName = `${product.slug || 'mlzitko'}-${inquiry.id.slice(-6)}-vizualizace-${Date.now()}.webp`;
      const asset = await base44.entities.OfferAsset.create({
        inquiry_id: inquiry.id,
        inquiry_type: inquiry.type,
        file_url: response.url,
        file_name: fileName,
        file_type: 'image/webp',
        asset_type: 'generated_visualization',
        title: `Vizualizace ${product.name}`,
        description: 'AI vizualizace vytvořená z fotografie prostoru a reálných produktových referencí.',
        selected_for_offer: true,
        generated_by_ai: true,
      });
      setAssets((current) => [asset, ...current]);
      onAttachmentsChange?.([...attachments.filter((item) => item.file_url !== asset.file_url), asset]);
      setMessages((current) => [...current, { role: 'assistant', text: `Vizualizace ${product.name} je připravená a označená pro vložení do nabídky a prezentace.` }]);
      try {
        await base44.functions.invoke('archiveGeneratedMediaToDrive', {
          fileUrl: response.url,
          fileName,
          mimeType: 'image/webp',
          productSlug: product.slug || '',
          mediaRole: 'offer_visualization',
        });
      } catch (_) {}
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setVisualBusy(false);
    }
  };

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-cyan-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-cyan-100 bg-[#0d2d38] px-5 py-4 text-white lg:flex-row lg:items-center lg:justify-between">
        <div><p className="flex items-center gap-2 text-xs font-semibold text-[#61d5e5]"><Bot size={15}/> AI asistent + Learning Hub</p><p className="mt-1 text-sm text-white/70">Pomáhá s návrhem řešení, kontrolou podkladů, vizualizací a klientskými texty. Uložená pravidla se promítají do dalších návrhů.</p></div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={onAutoPrepareFromText} disabled={autoPrepareBusy || !inquiry?.message} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#61d5e5]/50 bg-white/5 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50"><Bot size={14}/>{autoPrepareBusy ? 'AI připravuje nabídku…' : 'Automaticky připravit vše'}</button>
          <button type="button" onClick={onPrepareOffer} disabled={prepareBusy || !product} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#61d5e5] px-4 py-2.5 text-xs font-bold text-[#0d2d38] disabled:opacity-50"><Sparkles size={14}/>{prepareBusy ? 'Generuji PDF…' : 'Vytvořit čisté PDF'}</button>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.05fr_.95fr]">
        <details className="border-b border-cyan-100 p-5 lg:border-b-0 lg:border-r">
          <summary className="cursor-pointer list-none text-xs font-semibold text-slate-700">AI asistent · texty, kontrola a návrh řešení <span className="ml-1 text-slate-400">(volitelné)</span></summary>
          <div className="mt-4">
          <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
            {messages.map((message, index) => <div key={`${message.role}-${index}`} className={`rounded-xl px-4 py-3 text-sm leading-6 ${message.role === 'assistant' ? 'bg-slate-50 text-slate-700' : 'ml-8 bg-cyan-50 text-slate-800'}`}><div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{message.role === 'assistant' ? 'AI asistent' : 'Vy'}</div><div className="whitespace-pre-line">{message.text}</div></div>)}
            {chatBusy && <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500"><Loader2 size={14} className="animate-spin"/> Připravuji odpověď…</div>}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">{QUICK_PROMPTS.map((prompt, index) => <button key={index} type="button" onClick={() => sendChat(prompt)} className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-600 hover:border-cyan-300 hover:text-cyan-800">{index === 0 ? 'Navrhnout řešení' : index === 1 ? 'Klientské shrnutí' : index === 2 ? 'Osnova prezentace' : 'Kontrola nabídky'}</button>)}</div>
          <div className="mt-4 flex gap-2"><textarea value={input} onChange={(e) => setInput(e.target.value)} rows={2} placeholder="Napište, co má AI připravit k této poptávce…" className="min-h-20 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-cyan-400"/><button type="button" onClick={() => sendChat()} disabled={chatBusy || !input.trim()} className="self-end rounded-xl bg-[#0e5b67] p-3 text-white disabled:opacity-40" aria-label="Odeslat AI asistentovi"><Send size={17}/></button></div>

          <div className="mt-5 rounded-xl border border-violet-200 bg-violet-50/60 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[.14em] text-violet-700">Learning Hub</p><h4 className="mt-1 text-sm font-semibold text-slate-900">Učit obchodní nabídky z vašich požadavků a kritiky</h4><p className="mt-1 text-[11px] leading-5 text-slate-600">Uložená pravidla se automaticky přidávají do kontextu AI textů i vizualizací. Technická fakta se z kritiky nikdy nedovozují — neznámé hodnoty zůstávají null a nic se nedopočítává odhadem.</p></div><span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-violet-700 ring-1 ring-violet-200">{activeLearningRules.length} aktivních</span></div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <select value={feedbackForm.feedback_type} onChange={(e) => setFeedbackForm((current) => ({ ...current, feedback_type: e.target.value }))} className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-xs text-slate-700"><option value="critique">Kritika / oprava</option><option value="user_requirement">Požadavek</option><option value="approved_pattern">Schválený vzor</option><option value="rejected_pattern">Zakázaný vzor</option></select>
              <select value={feedbackForm.category} onChange={(e) => setFeedbackForm((current) => ({ ...current, category: e.target.value }))} className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-xs text-slate-700"><option value="visual_style">Vizuální styl</option><option value="product_geometry">Geometrie produktu</option><option value="technical_accuracy">Technická přesnost</option><option value="pricing">Ceny</option><option value="copy">Texty</option><option value="presentation">Prezentace</option><option value="workflow">Workflow</option><option value="conversion">Výsledek / konverze</option><option value="other">Ostatní</option></select>
              <select value={feedbackForm.priority} onChange={(e) => setFeedbackForm((current) => ({ ...current, priority: Number(e.target.value) }))} className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-xs text-slate-700"><option value={5}>Priorita 5 · kritické</option><option value={4}>Priorita 4 · vysoká</option><option value={3}>Priorita 3 · standard</option><option value={2}>Priorita 2 · nízká</option></select>
            </div>
            <textarea value={feedbackForm.feedback_text} onChange={(e) => { setFeedbackForm((current) => ({ ...current, feedback_text: e.target.value })); setFeedbackSaved(false); }} rows={3} placeholder="Např. Nabídky musí mít větší dominantní vizualizaci a méně technického textu na první straně." className="mt-2 w-full rounded-lg border border-violet-200 bg-white px-3 py-2.5 text-xs leading-5 text-slate-800 outline-none focus:border-violet-400"/>
            <div className="mt-2 flex flex-wrap items-center gap-2"><button type="button" onClick={saveLearningFeedback} disabled={feedbackBusy || !feedbackForm.feedback_text.trim()} className="rounded-full bg-violet-700 px-4 py-2 text-[11px] font-bold text-white disabled:opacity-40">{feedbackBusy ? 'Ukládám pravidlo…' : 'Uložit jako dovednost'}</button>{feedbackSaved && <span className="text-[11px] font-semibold text-emerald-700">Uloženo a aktivní pro další generování.</span>}</div>
            {activeLearningRules.length > 0 && <div className="mt-3 space-y-1 border-t border-violet-100 pt-3">{activeLearningRules.slice(0, 3).map((item) => <p key={item.id} className="text-[10px] leading-4 text-slate-500"><strong className="text-violet-700">P{item.priority || 3}</strong> · {item.lesson || item.feedback_text}</p>)}</div>}
          </div>
          </div>
        </details>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold text-slate-900">Vizualizace projektu</p><p className="mt-1 text-xs leading-5 text-slate-500">Vyberte reálnou fotografii prostoru. AI zachová perspektivu a produktovou geometrii, mlha se při každém renderu chová přirozeně trochu jinak podle větru.</p></div><label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-cyan-200 px-3 py-2 text-[11px] font-semibold text-cyan-800"><UploadCloud size={13}/> Nahrát podklad<input type="file" accept="image/*,.pdf" className="hidden" onChange={uploadSource}/></label></div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {imageAssets.slice(0, 9).map((asset) => <button key={asset.file_url} type="button" onClick={() => setSourceUrl(asset.file_url)} className={`group relative aspect-[4/3] overflow-hidden rounded-xl border ${sourceUrl === asset.file_url ? 'border-cyan-500 ring-2 ring-cyan-100' : 'border-slate-200'}`} title={asset.file_name || asset.title}><img src={asset.file_url} alt={asset.title || asset.file_name || 'Podklad'} className="h-full w-full object-contain bg-slate-50"/>{sourceUrl === asset.file_url && <span className="absolute right-1.5 top-1.5 rounded-full bg-cyan-500 p-1 text-white"><Check size={11}/></span>}<span className="absolute inset-x-0 bottom-0 truncate bg-black/50 px-2 py-1 text-left text-[9px] text-white">{asset.title || asset.file_name || 'Obrázek'}</span></button>)}
            {imageAssets.length === 0 && <div className="col-span-3 flex min-h-28 items-center justify-center rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400"><FileImage size={18} className="mr-2"/> Nahrajte fotografii prostoru.</div>}
          </div>

          <button type="button" onClick={generateVisualization} disabled={visualBusy || !sourceUrl || !product} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0e5b67] px-4 py-3 text-sm font-bold text-white disabled:opacity-40"><ImagePlus size={16}/>{visualBusy ? 'Generuji vizualizaci…' : 'Vygenerovat vizualizaci z podkladů'}</button>

          <div className="mt-4 space-y-2">
            {assets.filter((asset) => asset.asset_type === 'generated_visualization').slice(0, 3).map((asset) => <div key={asset.id || asset.file_url} className="flex items-center gap-3 rounded-xl border border-slate-200 p-2"><img src={asset.file_url} alt={asset.title || 'Vizualizace'} className="h-14 w-20 rounded-lg bg-slate-50 object-contain"/><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-slate-800">{asset.title || 'AI vizualizace'}</p><p className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700"><Check size={11}/> Připraveno pro nabídku</p></div></div>)}
          </div>
          {error && <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
        </div>
      </div>
    </section>
  );
}
