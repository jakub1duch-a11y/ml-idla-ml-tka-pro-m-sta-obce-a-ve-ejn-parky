import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import DocumentRequestFields from '@/components/documents/DocumentRequestFields';
import useDocumentRequest from '@/components/documents/useDocumentRequest';
import '@/components/documents/document-request.css';

export default function DocumentRequestForm({ initialValues }) {
  const { values, change, submit, sending, sent, error } = useDocumentRequest(initialValues);
  const confirmation = useRef(null);
  useEffect(() => { if (sent) confirmation.current?.focus(); }, [sent]);
  if (sent) return (
    <div ref={confirmation} tabIndex={-1} role="status" className="rounded-lg border border-border bg-card p-6 sm:p-9">
      <CheckCircle2 className="mb-4 text-primary" size={32} aria-hidden="true" />
      <h2 className="font-heading text-2xl">Žádost o podklady jsme přijali.</h2>
      <p className="mt-4 text-muted-foreground">Náš tým posoudí požadované dokumenty a naváže na uvedený e-mail. Podklady se nezpřístupňují automaticky.</p>
      <Link to="/ke-stazeni" className="mt-6 inline-block font-semibold text-primary underline underline-offset-4">Zpět na přehled podkladů</Link>
    </div>
  );
  return (
    <form onSubmit={submit} aria-busy={sending} className="rounded-lg border border-border bg-card p-6 sm:p-9">
      <fieldset disabled={sending}>
        <legend className="sr-only">Žádost o technické podklady</legend>
        <DocumentRequestFields values={values} onChange={change} />
        <label className="mt-6 flex items-start gap-3 text-sm text-muted-foreground">
          <input type="checkbox" name="consent" required checked={values.consent} onChange={change} className="mt-1 h-4 w-4 shrink-0 accent-primary" />
          <span>Souhlasím se zpracováním kontaktních údajů pro vyřízení této žádosti a zaslání podkladů. <Link to="/gdpr" className="text-primary underline underline-offset-4">Ochrana osobních údajů</Link></span>
        </label>
        {error && <p role="alert" className="mt-5 text-sm text-destructive">{error}</p>}
        <button type="submit" disabled={sending} className="document-request-submit mt-6 inline-flex min-h-12 items-center justify-center gap-2">
          {sending && <Loader2 size={17} className="animate-spin" aria-hidden="true" />}
          {sending ? 'Odesílám žádost…' : 'Odeslat žádost o podklady'}
        </button>
      </fieldset>
      <p className="mt-4 text-xs text-muted-foreground">Tato žádost není objednávkou ani žádostí o cenovou nabídku.</p>
    </form>
  );
}