import React, { useState } from 'react';
import { FileText, Download, Eye, Loader2, Package, AlertCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { safeFileUrl } from '@/components/portal/portalUtils';

export default function PortalProjectDocuments({ project, userId }) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatedDoc, setGeneratedDoc] = useState(null);

  // Dokumenty z projektu (z registeredPortal dat)
  const projectDocs = [
    { type: 'quote', label: 'Cenová nabídka PDF', icon: FileText, url: project.quote_pdf_url, available: Boolean(safeFileUrl(project.quote_pdf_url)) },
    { type: 'presentation', label: 'Prezentace', icon: Eye, url: project.presentation_pdf_url || project.presentation_url, available: Boolean(safeFileUrl(project.presentation_pdf_url || project.presentation_url)) },
    { type: 'confirmation', label: 'Potvrzení objednávky', icon: FileText, url: project.order_confirmation_pdf_url, available: Boolean(safeFileUrl(project.order_confirmation_pdf_url)) },
  ].filter(d => d.available);

  async function generatePackage() {
    setGenerating(true);
    setError('');
    setGeneratedDoc(null);
    try {
      const payload = project.inquiry_id
        ? { inquiry_id: project.inquiry_id }
        : { project_order_id: project.id };
      const { data } = await base44.functions.invoke('generateProjectPackage', payload);
      if (data?.ok) {
        setGeneratedDoc({
          document_id: data.document_id,
          reference: data.reference,
          page_count: data.page_count,
          has_all_prices: data.has_all_prices,
        });
      } else {
        setError(data?.error || 'Generování se nezdařilo.');
      }
    } catch (err) {
      setError(err?.message || 'Generování selhalo. Zkuste to znovu.');
    } finally {
      setGenerating(false);
    }
  }

  return (
    <section className="mt-5 border-t pt-5">
      <h3 className="flex items-center gap-2 text-base font-semibold">
        <Package size={18} /> Projektová dokumentace
      </h3>

      {/* Existující dokumenty z nabídky */}
      {projectDocs.length > 0 && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {projectDocs.map((doc, i) => (
            <div key={i} className="rounded-lg border bg-muted p-4">
              <p className="flex items-center gap-2 break-words text-sm font-semibold">
                <doc.icon size={16} /> {doc.label}
              </p>
              <a href={doc.url} target="_blank" rel="noopener noreferrer" download
                 className="mt-3 inline-flex items-center gap-2 text-sm text-primary underline">
                <Download size={15} /> Otevřít / stáhnout
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Generování projektového balíčku */}
      <div className="mt-4 rounded-lg border border-dashed bg-card p-5">
        <h4 className="text-sm font-semibold">Projektový balíček (PDF)</h4>
        <p className="mt-2 text-sm text-muted-foreground">
          Kompletní dokumentace k vaší poptávce: souhrn zadání, produktové listy, vizuální návrh,
          cenová nabídka a postup spolupráce v jednom PDF.
        </p>

        {generatedDoc ? (
          <div className="mt-4 rounded-lg border bg-muted p-4">
            <div className="flex items-start gap-2">
              <FileText size={18} className="mt-0.5 shrink-0 text-primary" />
              <div className="min-w-0">
                <p className="text-sm font-semibold">Projektový balíček připraven</p>
                <p className="text-xs text-muted-foreground">
                  Reference: {generatedDoc.reference} · {generatedDoc.page_count} stran
                </p>
                {!generatedDoc.has_all_prices && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-amber-600">
                    <AlertCircle size={13} /> Koncept k doplnění — ne všechny ceny jsou potvrzeny z katalogu.
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  Dokument čeká na schválení našim týmem. Po schválení ho najdete zde ke stažení.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={generatePackage}
            disabled={generating}
            className="portal-secondary mt-4"
          >
            {generating ? (
              <><Loader2 size={15} className="animate-spin" /> Generuji balíček…</>
            ) : (
              <><Package size={15} /> Vygenerovat projektový balíček</>
            )}
          </button>
        )}

        {error && (
          <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>
        )}
      </div>

      {/* Dokumenty ke stažení (z MisterDocument, client_visible) */}
      {project.documents && project.documents.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold">Dokumenty ke stažení</h4>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {project.documents.map((doc) => (
              <div key={doc.id} className="rounded-lg border bg-muted p-4">
                <p className="break-words text-sm font-semibold">{doc.title}</p>
                {doc.version && <p className="text-xs text-muted-foreground">Verze {doc.version}</p>}
                {safeFileUrl(doc.file_url) ? (
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer" download
                     className="mt-3 inline-flex items-center gap-2 text-sm text-primary underline">
                    <Download size={15} /> Otevřít / stáhnout
                  </a>
                ) : (
                  <p className="mt-3 text-xs text-muted-foreground">Soubor nyní není dostupný.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}