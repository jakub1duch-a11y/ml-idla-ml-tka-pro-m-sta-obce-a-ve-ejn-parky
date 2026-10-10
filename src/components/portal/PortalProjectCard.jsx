import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { statuses, formatDate, money, safeFileUrl } from '@/components/portal/portalUtils';
import PortalOrderAction from '@/components/portal/PortalOrderAction';
import PortalDocuments from '@/components/portal/PortalDocuments';
import PortalProjectDocuments from '@/components/portal/PortalProjectDocuments';
export default function PortalProjectCard({ project, documents=false, userId }) {
  const [showDocs,setShowDocs]=useState(false);
  const draft=['draft','pending_approval'].includes(project.status);
  return <article id={`project-${project.id}`} className="min-w-0 rounded-lg border bg-card p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><p className="mb-2 text-xs text-muted-foreground">{project.quote_number || `Založeno ${formatDate(project.created_date)}`}</p><h3 className="break-words text-xl">{project.project_name || project.product_name || 'Váš projekt'}</h3></div><span className="badge-brand-accent">{statuses[project.status]||'Evidováno'}</span></div>
    {project.description&&<p className="mt-4 whitespace-pre-wrap break-words text-sm text-muted-foreground">{project.description}</p>}
    {!draft&&<div className="my-5 flex flex-wrap gap-x-10 gap-y-3"><div><p className="text-xs text-muted-foreground">Cena nabídky bez DPH</p><p className="text-xl font-semibold">{money(project.total_price)}</p></div>{project.valid_until&&<div><p className="text-xs text-muted-foreground">Platnost nabídky</p><p>{formatDate(project.valid_until)}</p></div>}{project.completion_date&&<div><p className="text-xs text-muted-foreground">Plánované dokončení</p><p>{formatDate(project.completion_date)}</p></div>}</div>}
    {draft?<p className="mt-4 text-sm text-muted-foreground">Na řešení pracujeme. Cenu a podklady zde najdete po dokončení nabídky.</p>:<div className="mt-4 flex flex-wrap items-center gap-4">{safeFileUrl(project.quote_pdf_url)&&<a href={safeFileUrl(project.quote_pdf_url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary underline"><FileText size={16}/>Cenová nabídka PDF</a>}<Link className="text-sm text-primary underline" to={`/klientska-sekce?view=detail&quote=${encodeURIComponent(project.quote_number||'')}`}>Detail a komunikace s týmem</Link></div>}
    {!documents&&<PortalOrderAction project={project}/>}
    {documents&&<><button className="portal-secondary mt-4" aria-expanded={showDocs} onClick={()=>setShowDocs(!showDocs)}>{showDocs?'Skrýt dokumentaci':'Zobrazit dokumentaci'}</button>{showDocs&&<PortalDocuments project={project} userId={userId}/>}</>}
    {!documents&&<PortalProjectDocuments project={project} userId={userId}/>}
  </article>;
}