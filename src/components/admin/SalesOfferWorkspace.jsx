import React, { useEffect, useMemo, useState } from 'react';
import { ExternalLink, FileText, ImageIcon, Loader2, Mail, RefreshCw, Save, ShieldCheck, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// Každá zakázka čte existující Base44 entity. Nezakládá druhou databázi.
// Všechny záznamy i náhled e-mailu jsou chráněny admin rolí / RLS.
const MASTER_CANVA_URL = 'https://www.canva.com/d/irLIi_qRKLPfptC';
const MONEY = (n) => new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(Number(n) || 0);
const button = 'inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-xs font-semibold text-white/85 hover:bg-white/10';
const validHttps = (value) => { try { const u = new URL(String(value || '')); return u.protocol === 'https:' ? u.href : ''; } catch { return ''; } };
const validDriveLink = (value) => { const url = validHttps(value); return url && new URL(url).hostname === 'drive.google.com' ? url : ''; };
const flatten = (data) => Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];

function PdfLink({ href, label }) {
  const safe = validHttps(href);
  return safe ? <a target="_blank" rel="noopener noreferrer" className={button} href={safe}><FileText size={15}/>{label}<ExternalLink size={13}/></a> : null;
}

export default function SalesOfferWorkspace({ order, product, onClose }) {
  const [loading, setLoading] = useState(true);
  const [variants, setVariants] = useState([]);
  const [assets, setAssets] = useState([]);
  const [freshOrder, setFreshOrder] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [canvaUrl, setCanvaUrl] = useState('');
  const [savingCanva, setSavingCanva] = useState(false);
  const [exportKind, setExportKind] = useState('pdf');
  const [exportUrl, setExportUrl] = useState('');
  const [savingExport, setSavingExport] = useState(false);
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const refresh = async () => {
    if (!order?.id) return;
    setLoading(true); setError('');
    try {
      const [v, a, current] = await Promise.all([
        base44.entities.OfferVariant.filter({ project_order_id: order.id }),
        base44.entities.OfferAsset.filter({ project_order_id: order.id }),
        base44.entities.ProjectOrder.get(order.id),
      ]);
      setFreshOrder(current);
      const nextAssets = flatten(a);
      setVariants(flatten(v).sort((one, two) => Number(one.sort_order || 0) - Number(two.sort_order || 0)));
      setAssets(nextAssets);
      const design = nextAssets.find(x => x.description === 'canva_design' && validHttps(x.file_url));
      setCanvaUrl(design?.file_url || '');
    } catch (e) {
      setError(e?.message || 'Přílohy a cenové varianty se nepodařilo načíst.');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    setPreview(null); setMessage(''); setCanvaUrl(''); setAssets([]); setVariants([]); setFreshOrder(null);
    refresh();
  }, [order?.id]);

  const displayedOrder = freshOrder?.id === order?.id ? freshOrder : order;
  const archivedPdf = validDriveLink(displayedOrder?.quote_drive_file_url) || validDriveLink(displayedOrder?.quote_pdf_url);
  const archivedFolder = validDriveLink(displayedOrder?.drive_case_folder_url);
  const linkedCanvaAsset = assets.find(x => x.description === 'canva_design' && validHttps(x.file_url));
  const imageAssets = useMemo(() => assets.filter(a => (a.file_type || '').startsWith('image/') && validHttps(a.file_url))
    .filter(a => a.selected_for_offer === true || a.asset_type === 'product_reference').slice(0, 8), [assets]);
  const selectedPrice = variants.find(v => v.recommended && Number(v.total_price) > 0);
  const total = Number(selectedPrice?.total_price || order?.total_price || 0);
  const documentAssets = assets.filter(a => (a.file_type || '').includes('pdf') || a.asset_type === 'quote_pdf' || a.asset_type === 'presentation_pdf');

  const saveCanva = async () => {
    const u = validHttps(canvaUrl);
    if (!u || !/^(www\.)?canva\.com$/i.test(new URL(u).hostname)) {
      setError('Vložte platný HTTPS odkaz na upravitelný návrh z canva.com.'); return;
    }
    setSavingCanva(true); setError(''); setMessage('');
    try {
      if (linkedCanvaAsset) await base44.entities.OfferAsset.update(linkedCanvaAsset.id, { file_url: u });
      else await base44.entities.OfferAsset.create({
        inquiry_id: order.inquiry_id || 'manual-' + order.id,
        ...(order.inquiry_type ? { inquiry_type: order.inquiry_type } : {}),
        project_order_id: order.id,
        file_url: u,
        file_name: 'Canva – upravitelná nabídka',
        file_type: 'text/uri-list',
        asset_type: 'other',
        title: 'Canva – pracovní návrh',
        description: 'canva_design',
        selected_for_offer: false,
        generated_by_ai: false,
        sort_order: 1,
      });
      setMessage('Canva podklad je uložen u této nabídky. Žádný e-mail se neodeslal.');
      await refresh();
    } catch (e) { setError(e?.message || 'Odkaz na Canvu se nepodařilo uložit.'); }
    finally { setSavingCanva(false); }
  };

  const saveExport = async () => {
    const safe = validHttps(exportUrl);
    if (!safe) { setError('Zadejte platný HTTPS odkaz na exportované PDF nebo WebP.'); return; }
    const isPdf = exportKind === 'pdf';
    if (assets.some(a => a.file_url === safe)) { setError('Tento export už je u nabídky připojený.'); return; }
    setSavingExport(true); setError(''); setMessage('');
    try {
      await base44.entities.OfferAsset.create({
        inquiry_id: order.inquiry_id || 'manual-' + order.id,
        ...(order.inquiry_type ? { inquiry_type: order.inquiry_type } : {}),
        project_order_id: order.id,
        file_url: safe,
        file_name: (order.quote_number || 'MLZIDLA') + (isPdf ? '_nabidka.pdf' : '_nabidka.webp'),
        file_type: isPdf ? 'application/pdf' : 'image/webp',
        asset_type: isPdf ? 'quote_pdf' : 'other',
        title: isPdf ? 'Kompletní nabídka PDF' : 'Obrazová nabídka WebP',
        description: 'Přiložený schválený export grafické nabídky; před odesláním ověřit obsah a QR.',
        selected_for_offer: true,
        generated_by_ai: false,
        sort_order: 2,
      });
      setExportUrl(''); setMessage('Export nabídky byl připojen k zakázce. Žádný e-mail nebyl odeslán.');
      await refresh();
    } catch (e) { setError(e?.message || 'Uložení exportu selhalo.'); }
    finally { setSavingExport(false); }
  };

  const loadEmail = async () => {
    setPreviewLoading(true); setError('');
    try {
      const result = await base44.functions.invoke('previewClientOfferEmail', { project_id: order.id });
      if (!result.data?.ok) throw new Error(result.data?.error || 'Náhled není dostupný.');
      setPreview(result.data);
    } catch (e) { setError(e?.response?.data?.error || e?.message || 'Náhled e-mailu se nepodařilo získat.'); }
    finally { setPreviewLoading(false); }
  };

  return <section className="rounded-2xl border border-cyan/35 bg-[#102532] p-4 text-white sm:p-6" aria-label="Detail obchodní nabídky">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-widest text-cyan">Kompletní nabídka · {order.quote_number || 'pracovní koncept'}</p>
        <h3 className="mt-1 text-xl font-semibold">{order.project_name || order.client_name}</h3>
        <p className="mt-1 text-sm text-white/60">{order.client_name} · {order.client_company || order.client_email}</p>
      </div>
      <button type="button" onClick={onClose} className="rounded-lg border border-white/20 p-2" aria-label="Zavřít detail"><X size={19}/></button>
    </div>
    {error && <p role="alert" className="mt-3 rounded-lg border border-rose-400/40 p-3 text-sm text-rose-200">{error}</p>}
    {message && <p role="status" className="mt-3 rounded-lg border border-emerald-400/35 p-3 text-sm text-emerald-100">{message}</p>}
    {loading && <p className="mt-4 flex items-center gap-2 text-sm text-white/60"><Loader2 size={16} className="animate-spin"/> Načítám související podklady…</p>}

    <div className="mt-5 grid gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
        <h4 className="font-semibold">Cenová nabídka a varianty</h4>
        {!loading && !variants.length && <p className="mt-3 text-sm text-amber-200">Zatím chybí položkové ocenění. Je nutné potvrdit cenu v ceníku MLŽIDLA.</p>}
        {variants.map(v => <div key={v.id} className="mt-3 border-b border-white/10 pb-3 text-sm">
          <div className="flex items-start justify-between gap-3">
            <span>{v.label || v.product_name} {v.recommended ? '· doporučeno' : ''}</span>
            <strong className="shrink-0">{Number(v.total_price) > 0 ? MONEY(v.total_price) : 'k ověření'}</strong>
          </div>
          <p className="mt-1 text-xs text-white/50">{v.quantity || 1} ks · {Number(v.unit_price) > 0 ? MONEY(v.unit_price) + ' / ks bez DPH' : 'jednotková cena nepotvrzena'} · {v.price_status === 'manual_required' ? 'ruční kontrola ceny' : 'cena z evidence'}</p>
        </div>)}
        {total > 0 && <div className="mt-4 rounded-lg bg-white/[0.06] p-3 text-sm">
          <p>Vybraná cena bez DPH: <strong>{MONEY(total)}</strong></p>
          <p className="mt-1 text-white/70">S 21% DPH: {MONEY(Math.round(total * 1.21))}</p>
        </div>}
        <p className="mt-3 text-xs leading-5 text-white/45">Varianty jsou alternativy, nesčítají se. Ceny z historických záznamů je před odesláním nutné ověřit proti aktuální tabulce „Mlžítko“. SUPLA, šachta, montáž a doprava musí být zahrnuty pouze tehdy, jsou-li výslovně oceněné.</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
        <h4 className="font-semibold">Grafické podklady, PDF a Canva</h4>
        <div className="mt-3 flex flex-wrap gap-2">
          <PdfLink href={order.quote_pdf_url} label="Cenová nabídka PDF"/>
          <PdfLink href={order.presentation_pdf_url} label="Obrázková prezentace PDF"/>
          <PdfLink href={order.inquiry_pdf_url} label="Původní poptávka PDF"/>
          {documentAssets.map((doc) => <PdfLink key={doc.id} href={doc.file_url} label={doc.title || doc.file_name || 'Další PDF'}/>)}
          {archivedPdf && <PdfLink href={archivedPdf} label="PDF na Mlžném disku"/>}
          {archivedFolder && <PdfLink href={archivedFolder} label="Složka zakázky na Mlžném disku"/>}
        </div>
        {!loading && !archivedPdf && <p className="mt-3 text-xs text-amber-200">PDF zatím není propojené s archivem na Mlžném disku. Zkontrolujte vytvoření a uložení nabídky.</p>}
        <a href={MASTER_CANVA_URL} target="_blank" rel="noopener noreferrer" className={button + ' mt-3'}>
          Otevřít hlavní Canva šablonu <ExternalLink size={14}/>
        </a>
        <label className="mt-4 block text-xs text-white/70">Konkrétní upravitelný návrh v Canvě</label>
        <div className="mt-1 flex flex-col gap-2 sm:flex-row">
          <input type="url" value={canvaUrl} onChange={e => setCanvaUrl(e.target.value)}
            placeholder="https://www.canva.com/design/…" aria-label="Odkaz na Canva návrh"
            className="min-w-0 flex-1 rounded-lg border border-white/20 bg-[#0b1d27] px-3 py-2 text-sm text-white"/>
          <button onClick={saveCanva} type="button" disabled={savingCanva} className={button}>
            {savingCanva ? <Loader2 size={14} className="animate-spin"/> : <Save size={14}/>} Uložit odkaz
          </button>
        </div>
        {validHttps(linkedCanvaAsset?.file_url) && <a href={linkedCanvaAsset.file_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-cyan underline">Upravit návrh v Canvě <ExternalLink size={12}/></a>}
        <div className="mt-4 border-t border-white/10 pt-3">
          <label className="block text-xs text-white/70">Připojit hotový export obrazové nabídky</label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <select value={exportKind} onChange={e => setExportKind(e.target.value)} className="rounded-lg border border-white/20 bg-[#0b1d27] px-2 py-2 text-sm" aria-label="Typ exportu">
              <option value="pdf">PDF</option><option value="webp">WebP</option>
            </select>
            <input type="url" value={exportUrl} onChange={e => setExportUrl(e.target.value)}
              placeholder="Odkaz na exportovaný soubor na Google Disku" aria-label="Odkaz na hotový export"
              className="min-w-0 flex-1 rounded-lg border border-white/20 bg-[#0b1d27] px-3 py-2 text-sm text-white"/>
            <button onClick={saveExport} disabled={savingExport} type="button" className={button}><Save size={14}/> Připojit export</button>
          </div>
        </div>
        <p className="mt-3 text-xs text-white/45">Canva návrh je upravitelný zdroj. Hotové PDF a WebP uložte na Disk a sem připojte jejich odkazy. Tato akce soubory negeneruje ani neodesílá.</p>
      </div>
    </div>

    <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <h4 className="flex items-center gap-2 font-semibold"><ImageIcon size={17}/> Vizualizace a obrazová nabídka</h4>
      {imageAssets.length ? <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {imageAssets.map(asset => <a key={asset.id} href={asset.file_url} target="_blank" rel="noopener noreferrer" className="overflow-hidden rounded-lg border border-white/10">
          <img src={asset.file_url} alt={asset.title || asset.file_name || 'Produktová vizualizace'} loading="lazy" className="h-36 w-full bg-white object-cover"/>
          <p className="line-clamp-2 p-2 text-xs text-white/75">{asset.title || asset.file_name}</p>
        </a>)}
      </div> : <p className="mt-2 text-sm text-white/50">{product?.image_url ? 'Pro tuto zakázku zatím není vybraná schválená vizualizace.' : 'Zatím nejsou připojené vizualizace.'}</p>}
      {!imageAssets.length && validHttps(product?.image_url) && <img src={product.image_url} alt={product.name} className="mt-3 h-36 rounded-lg bg-white object-contain"/>}
    </div>

    <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h4 className="flex items-center gap-2 font-semibold"><Mail size={17}/> Náhled e-mailu před odesláním</h4>
          <p className="mt-1 text-xs text-white/55">Příjemce: {order.client_email || 'není vyplněn'} · bez automatického odesílání</p></div>
        <button onClick={loadEmail} disabled={previewLoading} type="button" className={button}>
          {previewLoading ? <Loader2 size={15} className="animate-spin"/> : <RefreshCw size={15}/>} Načíst náhled e-mailu
        </button>
      </div>
      {preview && <div className="mt-4 overflow-hidden rounded-xl border border-white/15 bg-white text-[#123]">
        <div className="space-y-1 border-b border-slate-200 bg-slate-50 p-3 text-xs">
          <p><strong>Komu:</strong> {preview.recipient}</p>
          <p><strong>Předmět:</strong> {preview.subject}</p>
          <p><strong>Přílohy:</strong> {preview.attachments?.length || 0} · <strong>Vizualizace:</strong> {preview.visualizations_count || 0}</p>
        </div>
        <iframe title="Náhled obchodního e-mailu" srcDoc={preview.html || ''} sandbox="" referrerPolicy="no-referrer" className="h-[480px] w-full border-0"/>
      </div>}
    </div>
    <p className="mt-4 flex gap-2 text-xs leading-5 text-white/55"><ShieldCheck size={15} className="shrink-0"/> Kompletní podklady jsou viditelné pouze přihlášenému administrátorovi. Finální cenu, text, přílohy a QR kód je nutné ověřit před samostatným schválením a odesláním.</p>
  </section>;
}
