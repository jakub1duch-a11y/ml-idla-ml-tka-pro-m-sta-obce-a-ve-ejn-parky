import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ExternalLink, FileText, FolderOpen, RefreshCw, ShieldCheck, Palette } from 'lucide-react';
import { base44 } from '@/api/base44Client';

// Editor references only. Do not put ADMIN_PRICE or client quote URLs in this frontend.
// Every record below is a draft; publication is an explicit, separate admin approval.
const CANVA_FOLDER = 'https://www.canva.com/folder/FAHa8FvAb_Q';
const DRIVE_FOLDER = 'https://drive.google.com/drive/folders/1l4iK1YrsDCJaaz-yIMMM6Ep-GSlnvn2M';
const WORKFLOW_DOCUMENT = 'https://drive.google.com/file/d/1u-vuL4G40ADM--3QFR_VixU0uzFCLVuu/view';
const PREPARED_TEMPLATES = [
  { title: 'Nabídka produktu · originální značková kopie', url: 'https://www.canva.com/d/_-XHlZkPRAv5TED', kind: 'Obchodní nabídka' },
  { title: 'Nabídka z webové poptávky · pracovní kopie', url: 'https://www.canva.com/d/JdrLNA-i6MI11sg', kind: 'Poptávka' },
  { title: 'Veřejná brožura · V2', url: 'https://www.canva.com/d/AFZsLOFSJ9SK9z_', kind: 'Bez cen' },
  { title: 'Katalog produktů a variant · koncept', url: 'https://www.canva.com/d/A6XqzAokKLx9DzG', kind: 'Bez cen' },
  { title: 'Montáž a údržba · pracovní manuál', url: 'https://www.canva.com/d/YxDqgJ5sGwKg2le', kind: 'Technická kontrola' },
];

const isPublicCandidate = (doc) => ['proposal', 'maintenance', 'installation', 'other'].includes(doc.document_type)
  && doc.client_visible === false
  && !/cenov.{0,15}katalog|internal|intern.{0,12}cen/i.test(doc.title || '');

export default function AdminBrandDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // MisterDocument is protected by Base44 admin RLS.
      const result = await base44.entities.MisterDocument.filter(
        { client_visible: false },
        { sort: '-created_date', limit: 100 }
      );
      setDocuments(Array.isArray(result) ? result : (result?.items || []));
    } catch {
      setError('Administrátorskou evidenci nelze načíst. Zkontrolujte přihlášení a oprávnění.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  const candidates = useMemo(() => documents.filter(isPublicCandidate), [documents]);
  return (
    <section aria-labelledby="brand-documents-heading" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#008ea5]">MLŽIDLA.cz / Canva / PDF</p>
          <h2 id="brand-documents-heading" className="mt-1 flex items-center gap-2 text-xl font-bold text-[#102b3a]">
            <FolderOpen size={21} className="text-[#008ea5]" aria-hidden="true" /> Dokumentace a obchodní šablony
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Pracovní brožury, technické listy a editovatelné vzory pro vizuální nabídky.
            Schválení, cena a přístupová práva se kontrolují před každým zveřejněním nebo odesláním.
          </p>
        </div>
        <button type="button" onClick={refresh} disabled={loading}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-[#102b3a] disabled:opacity-50">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Obnovit evidenci
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { label: 'Otevřít Canva podklady', url: CANVA_FOLDER, Icon: Palette },
          { label: 'MLŽNÝ DISK · návrhy PDF', url: DRIVE_FOLDER, Icon: FolderOpen },
          { label: 'Pravidla nabídek (.md)', url: WORKFLOW_DOCUMENT, Icon: FileText },
        ].map(({ label, url, Icon }) => (
          <a key={label} href={url} target="_blank" rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-[#102b3a] hover:border-[#008ea5]">
            <Icon size={15} />{label}<ExternalLink size={13} />
          </a>
        ))}
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {PREPARED_TEMPLATES.map(({ title, url, kind }) => (
          <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-200 bg-[#f6fafb] p-4 hover:border-[#008ea5]">
            <span className="text-[10px] font-bold uppercase tracking-wide text-[#008ea5]">{kind}</span>
            <strong className="mt-2 flex items-start justify-between gap-2 text-sm text-[#102b3a]">{title}<ExternalLink size={14} className="shrink-0" /></strong>
            <span className="mt-1 block text-xs text-slate-600">Upravit v Canvě · ještě neschváleno</span>
          </a>
        ))}
      </div>
      <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <ShieldCheck size={19} className="shrink-0 text-amber-700" aria-hidden="true" />
        <p className="text-xs leading-5 text-amber-900">
          <strong>Bezpečný režim:</strong> veřejný web ani Gmail nepřebírají tyto návrhy automaticky.
          Interní ceny se neukazují ve veřejných odkazech. Oprávnění k cenové složce na Google Disku
          zatím nebylo nezávisle ověřeno. Produktové parametry a fotografie vyžadují revizi.
        </p>
      </div>
      {error && <p role="alert" className="mt-3 flex items-center gap-2 text-sm text-red-700"><AlertTriangle size={16} />{error}</p>}
      <div className="mt-5">
        <h3 className="text-sm font-bold text-[#102b3a]">Evidované podklady ke kontrole ({candidates.length})</h3>
        <div className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200">
          {candidates.length === 0 && <p className="p-4 text-sm text-slate-600">{loading ? 'Načítám dokumenty…' : 'Žádné neschválené podklady v aktuálním seznamu.'}</p>}
          {candidates.map((doc) => (
            <div key={doc.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#102b3a]">{doc.title}</p>
                <p className="mt-1 text-xs text-slate-600">Interní evidence · {doc.version || 'bez verze'} · nezveřejněno</p>
              </div>
              {doc.file_url?.startsWith('https://drive.google.com/file/d/') && (
                <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-[#007b92]">
                  Podklad ke kontrole <ExternalLink size={13} />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
