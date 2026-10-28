import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowUpRight } from 'lucide-react';

export default function PdDocuments({ product }) {
  const query = new URLSearchParams({ produkt: product.slug, zprava: `Žádám o technické podklady k produktu ${product.name}.` });
  return (
    <section aria-label="Technické podklady produktu" className="mt-8 border-t border-border pt-7">
      <h3 className="font-heading text-xl text-card-foreground">Technické podklady na vyžádání</h3>
      <p className="mt-3 text-sm text-muted-foreground">Technické listy, výkresy a montážní dokumentaci poskytujeme na základě žádosti přes formulář podle konkrétního produktu a projektu.</p>
      <Link to={`/zadost-o-podklady?${query}`} className="mt-4 inline-flex min-h-14 items-center gap-3 rounded-lg border border-border bg-card p-4 text-sm font-semibold text-primary hover:border-primary focus-visible:ring-2 focus-visible:ring-ring">
        <FileText size={19} aria-hidden="true" /> Vyžádat technické podklady
        <ArrowUpRight size={17} aria-hidden="true" />
      </Link>
    </section>
  );
}