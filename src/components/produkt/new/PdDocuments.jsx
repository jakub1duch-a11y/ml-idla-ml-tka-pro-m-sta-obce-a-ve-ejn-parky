import React from 'react';
import { FileText, ArrowUpRight } from 'lucide-react';

export default function PdDocuments({ urls = [] }) {
  const documents = [...new Set(urls)].filter((url) => typeof url === 'string' && (/^https:\/\//i.test(url) || /^\/(?!\/)/.test(url)));
  if (!documents.length) return null;
  return (
    <section aria-label="Technické podklady produktu" className="mt-8 border-t border-border pt-7">
      <h3 className="font-heading text-xl text-card-foreground">Technické podklady ke stažení</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {documents.map((url, index) => (
          <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="flex min-h-14 items-center gap-3 rounded-lg border border-border bg-card p-4 text-sm font-semibold text-primary hover:border-primary focus-visible:ring-2 focus-visible:ring-ring">
            <FileText size={19} aria-hidden="true" />
            <span>Technický podklad {index + 1}<span className="sr-only"> (otevře se v nové záložce)</span></span>
            <ArrowUpRight size={17} className="ml-auto shrink-0" aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}