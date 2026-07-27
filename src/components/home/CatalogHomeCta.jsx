import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CatalogHomeCta() {
  return <section className="py-20 sm:py-28"><div className="site-container"><div className="rounded-lg border border-border bg-card p-8 sm:p-14"><p className="content-eyebrow">Řešení na míru</p><div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]"><div><h2 className="mb-4 text-3xl [font-family:'Plus_Jakarta_Sans',_'Helvetica_Neue',_Helvetica,_Arial,_sans-serif] font-medium">Váš prostor má vlastní rytmus.</h2><p className="content-lead max-w-2xl">Navrhneme mlžný prvek podle místa, provozu i architektonického záměru.</p></div><Link to="/poptavka" className="inline-flex items-center justify-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-85">Začít nezávaznou poptávku <ArrowRight size={17} /></Link></div></div></div></section>;
}