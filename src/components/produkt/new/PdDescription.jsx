import React from 'react';
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';

export default function PdDescription({ product }) {
  const body = product.description || product.short_description || '';
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(body);
  return (
    <section id="popis" className="scroll-mt-36 bg-card py-12 sm:py-16">
      <div className="mx-auto grid max-w-7xl gap-7 px-5 sm:px-7 lg:grid-cols-[.65fr_1.35fr] lg:gap-16 lg:px-10">
        <div>
          <p className="text-sm font-semibold text-primary">Popis produktu</p>
          <h2 className="mt-3 font-heading text-2xl text-card-foreground sm:text-3xl">{product.name}</h2>
          <p className="mt-4 text-sm text-muted-foreground">Provedení, princip a technické souvislosti pro výběr řešení.</p>
        </div>
        <div className="min-w-0 max-w-prose text-base text-card-foreground [&_p+p]:mt-4 [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-xl [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-lg [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-2 [&_a]:text-primary [&_a]:underline [&_table]:block [&_table]:overflow-x-auto [&_td]:border [&_td]:border-border [&_td]:p-3 [&_th]:border [&_th]:border-border [&_th]:p-3">
          {body ? hasHtml ? <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(body, { ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td'], ALLOWED_ATTR: ['href', 'title'] }) }} /> : <ReactMarkdown>{body}</ReactMarkdown> : <p>Podrobný popis připravujeme. Dostupné technické údaje najdete níže.</p>}
        </div>
      </div>
    </section>
  );
}