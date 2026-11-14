import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, ExternalLink, Package, RefreshCw, ShieldCheck } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const HUBSPOT_PORTAL_ID = 149032244;
const HUBSPOT_PRODUCTS_URL = `https://app-eu1.hubspot.com/contacts/${HUBSPOT_PORTAL_ID}/objects/0-7`;
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1m-NObbjCYDYG6Sg3B-2g-TcLZkkqGzejDFfCKjqQyUE/edit';

export default function HubspotCatalogSync() {
  const [report, setReport] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [approved, setApproved] = useState(false);

  const run = async (action) => {
    if (action === 'import' && (!approved || !report?.can_import)) return;
    setBusy(true);
    setError('');
    try {
      const payload = action === 'import' ? {
        action: 'import', confirm: 'NAHRAT_DO_HUBSPOT',
        portal_id: HUBSPOT_PORTAL_ID, expected_pending_count: report.pending_count,
      } : { action: 'preview' };
      const response = await base44.functions.invoke('hubspotProductCatalogSync', payload);
      const result = response?.data;
      if (!result?.ok) throw new Error(result?.error || 'hubspot_sync_unavailable');
      setReport(result);
      setApproved(false);
    } catch (err) {
      const code = err?.response?.data?.error || err?.message || 'hubspot_sync_unavailable';
      setError(code === 'hubspot_wrong_portal'
        ? 'HubSpot je připojený k jinému účtu. Import byl bezpečně zablokován. Správný portál HolmTec: 149032244.'
        : code === 'hubspot_oauth_missing'
          ? 'Chybí autorizace HubSpot v konektoru Base44.'
          : code === 'hubspot_portal_unverified'
            ? 'Nepodařilo se ověřit identitu portálu HubSpot. Žádný produkt se nepřenáší.'
            : code === 'import_requires_fresh_preview_and_confirmation'
              ? 'Data se změnila. Spusťte nejprve novou kontrolu katalogu.'
              : `Spojení s HubSpotem nelze ověřit (${String(code).slice(0, 80)}). Zápis nebyl potvrzen.`);
      setApproved(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6" aria-labelledby="hubspot-products-title">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#008ea5]">MLŽIDLA.cz / HubSpot</p>
          <h2 id="hubspot-products-title" className="mt-1 flex items-center gap-2 text-xl font-bold text-[#102b3a]">
            <Package size={21} className="text-[#008ea5]" /> Produktový katalog v HubSpot CRM
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Načíst platné produkty z administrace Base44 a bezpečně je zapsat do knihovny produktů HubSpot.
            Před importem systém ověří portál, archivní varianty, existující názvy a SKU.
            Existující záznamy nepřepisuje; e-maily neodesílá.
          </p>
        </div>
        <button type="button" disabled={busy} onClick={() => run('preview')}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#102b3a] px-4 text-sm font-semibold text-white disabled:opacity-50">
          <RefreshCw size={16} className={busy ? 'animate-spin' : ''} /> Ověřit katalog a portál
        </button>
      </div>

      <p className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <ShieldCheck size={16} className="text-[#008ea5]" />
        Cíl: HolmTec HubSpot, portál {HUBSPOT_PORTAL_ID}. Ceny se z Base44 nepřenášejí: až po ověření Kalkulace mlžítka 2026.
      </p>
      <nav className="mt-3 flex flex-wrap gap-4 text-sm font-semibold text-[#007b92]">
        <a href={HUBSPOT_PRODUCTS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
          Otevřít produkty v HubSpotu <ExternalLink size={14} />
        </a>
        <a href={SHEET_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
          Hlavní evidence kontaktů <ExternalLink size={14} />
        </a>
      </nav>

      {error && <p role="alert" className="mt-4 flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <AlertTriangle size={18} className="shrink-0" />{error}
      </p>}

      {report && <>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ['Produktů Base44', report.source_count],
            ['Platných položek', report.eligible_count],
            ['Již v HubSpotu', report.existing_count],
            ['K importu', report.pending_count],
          ].map(([label,value]) => <div key={label} className="rounded-xl border border-slate-200 bg-[#f7fbfc] p-3">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-[#102b3a]">{value}</p>
          </div>)}
        </div>

        {report.action === 'import' && <p role="status" className="mt-4 rounded-xl border border-slate-200 p-4 text-sm text-[#102b3a]">
          <CheckCircle2 size={18} className="mr-2 inline text-[#008ea5]"/>
          V HubSpotu založeno {report.created_count || 0} produktů.
          {(report.errors?.length || 0) > 0 && ` Chyb: ${report.errors.length}. Zkontrolujte záznamy a proveďte novou kontrolu před pokračováním.`}
        </p>}

        <div className="mt-4 max-h-64 overflow-y-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-[#f2f7f9] text-[#102b3a]"><tr><th className="p-3">Produkt</th><th className="p-3">SKU</th><th className="p-3">Cena</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {(report.pending || []).map((p) => <tr key={p.sku}>
                <td className="p-3">{p.name}</td><td className="p-3 font-mono">{p.sku}</td><td className="p-3">K ověření</td>
              </tr>)}
            </tbody>
          </table>
        </div>
        {(report.archived_or_invalid || []).length > 0 && <p className="mt-3 text-xs text-slate-500">
          Vynecháno {report.archived_or_invalid.length} archivních nebo neúplných produktů.
        </p>}
        {report.action !== 'import' && report.can_import && <div className="mt-4 rounded-xl border border-slate-200 bg-[#f7fbfc] p-4">
          <label className="flex items-start gap-3 text-sm text-[#102b3a]">
            <input type="checkbox" checked={approved} onChange={(e) => setApproved(e.target.checked)}
              className="mt-1 h-4 w-4 accent-[#008ea5]" disabled={busy}/>
            Potvrzuji import pouze {report.pending_count} nových produktů do ověřeného portálu HolmTec.
            Existující produkty a ceny zůstanou beze změny.
          </label>
          <button type="button" onClick={() => run('import')} disabled={!approved || busy}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#008ea5] px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
            <ShieldCheck size={17}/> Nahrát nové produkty do HubSpotu
          </button>
        </div>}
      </>}

      <p className="mt-5 border-t border-slate-200 pt-4 text-xs leading-5 text-slate-500">
        Další obchodní workflow: kontakty párovat podle e-mailu, firmy podle domény/IČO;
        webové poptávky podle unikátního ID případu a nabídky dle potvrzené varianty a ceny.
        Vizuály mají samostatné schvalování MASTER a Canva. Tato funkce zatím synchronizuje pouze katalog produktů.
      </p>
    </section>
  );
}
