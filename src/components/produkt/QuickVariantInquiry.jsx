import React, { useEffect, useRef, useState } from 'react';

/**
 * Reusable product variant inquiry UI. The caller MUST supply a server-backed
 * onSubmit(payload) implementation; this component never claims success itself.
 * variants: [{ id, name, differences: {label:value}, technicalSheetUrl? }]
 */
export default function QuickVariantInquiry({ product, variants = [], onSubmit }) {
  const [selection, setSelection] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const fields = Array.from(new Set(variants.flatMap(v => Object.keys(v.differences || {}))));
  const close = () => { if (!busy) { setSelection(null); setError(''); triggerRef.current?.focus(); } };
  useEffect(() => {
    if (!selection) return;
    const dialog = dialogRef.current;
    const previous = document.activeElement;
    dialog?.querySelector('input')?.focus();
    const onKey = e => {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key !== 'Tab' || !dialog) return;
      const nodes = [...dialog.querySelectorAll('button:not([disabled]),input:not([disabled]),textarea:not([disabled])')];
      if (!nodes.length) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = oldOverflow; previous?.focus?.(); };
  }, [selection, busy]);

  const open = (value, event) => { triggerRef.current = event.currentTarget; setSelection(value); setError(''); };
  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    if (typeof onSubmit !== 'function') { setError('Odesílání poptávky není momentálně dostupné.'); return; }
    const data = new FormData(e.currentTarget);
    const photos = data.getAll('photos').filter(file => file instanceof File && file.size);
    if (photos.length > 5 || photos.some(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024)) {
      setError('Přiložte nejvýše 5 fotografií JPG, PNG nebo WebP do 8 MB za soubor.'); return;
    }
    const ids = selection === 'all' ? variants.map(v => v.id) : [selection];
    setBusy(true); setError('');
    try {
      await onSubmit({
        productId: product.id, productSlug: product.slug,
        variantIds: ids, selectionMode: selection === 'all' ? 'all' : 'single',
        firstName: String(data.get('firstName') || '').trim(),
        lastName: String(data.get('lastName') || '').trim(),
        email: String(data.get('email') || '').trim(),
        phone: String(data.get('phone') || '').trim(),
        city: String(data.get('city') || '').trim(),
        installationSite: String(data.get('installationSite') || '').trim(),
        note: String(data.get('note') || '').trim(),
        sourceUrl: window.location.href, photos,
      });
      setSelection(null);
    } catch (err) { setError('Poptávku se nepodařilo odeslat. Zkuste to prosím znovu.'); }
    finally { setBusy(false); }
  }
  if (!product || !variants.length) return null;
  return <section aria-labelledby="variant-inquiry-heading" className="mx-auto max-w-5xl px-5 py-8">
    <h2 id="variant-inquiry-heading" className="text-xl font-semibold text-[#0D2F4F]">Porovnání variant</h2>
    <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-slate-50"><tr><th scope="col" className="p-3">Parametr</th>{variants.map(v => <th scope="col" className="p-3" key={v.id}>{v.name}</th>)}</tr></thead>
        <tbody>
          {fields.map(label => <tr className="border-t" key={label}><th scope="row" className="p-3 font-medium">{label}</th>{variants.map(v => <td className="p-3" key={v.id}>{v.differences?.[label] ?? '—'}</td>)}</tr>)}
          <tr className="border-t"><th scope="row" className="p-3">Technický list</th>{variants.map(v => <td className="p-3" key={v.id}>{v.technicalSheetUrl ? <a href={v.technicalSheetUrl} target="_blank" rel="noopener noreferrer" className="underline">Otevřít PDF</a> : <span className="text-slate-500">Na vyžádání</span>}</td>)}</tr>
          <tr className="border-t"><th scope="row" className="p-3">Cena</th>{variants.map(v => <td className="p-3" key={v.id}><button type="button" onClick={e => open(v.id,e)} className="rounded-full bg-[#0B5EA8] px-4 py-2 font-semibold text-white">Zjistit cenu</button></td>)}</tr>
        </tbody>
      </table>
    </div>
    {variants.length > 1 && <button type="button" onClick={e => open('all',e)} className="mt-4 rounded-full border border-[#0B5EA8] px-5 py-3 font-semibold text-[#0B5EA8]">Poptat cenu všech variant</button>}
    {selection && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3" onMouseDown={e => { if (e.target === e.currentTarget) close(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="quick-inquiry-title" className="max-h-[95vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
        <div className="flex items-start justify-between gap-4"><h2 id="quick-inquiry-title" className="text-xl font-bold">Zjistit cenu: {product.name}</h2><button type="button" onClick={close} aria-label="Zavřít formulář" className="p-2">✕</button></div>
        <p className="my-3 text-sm text-slate-600">{selection === 'all' ? 'Všechny varianty' : variants.find(v => v.id === selection)?.name}</p>
        <form onSubmit={submit} className="grid gap-3">
          {[['firstName','Jméno','text'],['lastName','Příjmení','text'],['email','E-mail','email'],['phone','Telefon','tel']].map(([name,label,type]) => <label key={name} className="text-sm font-medium">{label} *<input name={name} type={type} required maxLength={120} autoComplete={{firstName:'given-name',lastName:'family-name',email:'email',phone:'tel'}[name]} className="mt-1 w-full rounded-lg border border-slate-300 p-3" /></label>)}
          <label className="text-sm">Město (nepovinné)<input name="city" maxLength={150} className="mt-1 w-full rounded-lg border p-3" /></label>
          <label className="text-sm">Místo instalace (nepovinné)<input name="installationSite" maxLength={250} className="mt-1 w-full rounded-lg border p-3" /></label>
          <label className="text-sm">Co nám chcete doplnit? (nepovinné)<textarea name="note" rows={3} maxLength={3000} className="mt-1 w-full rounded-lg border p-3" /></label>
          <label className="text-sm">Fotografie prostoru (nepovinné)<input name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple className="mt-1 block w-full text-sm" /></label>
          <p className="text-xs text-slate-600">Údaje použijeme pro vyřízení poptávky. Podrobnosti najdete v zásadách ochrany osobních údajů.</p>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button disabled={busy} type="submit" className="rounded-full bg-[#0B5EA8] px-6 py-3 font-bold text-white disabled:opacity-60">{busy ? 'Odesílání…' : 'Odeslat nezávaznou poptávku'}</button>
        </form>
      </div>
    </div>}
  </section>;
}
