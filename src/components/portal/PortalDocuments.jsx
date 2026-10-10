import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { safeFileUrl } from '@/components/portal/portalUtils';
export default function PortalDocuments({ project, userId }) {
  const query = useInfiniteQuery({ queryKey: ['portal-documents',userId,project.id], initialPageParam:null, queryFn:async({pageParam})=>(await base44.functions.invoke('loginPortalWithBase44Session',{mode:'workspace',tab:'documents',project_id:project.id,cursor:pageParam})).data, getNextPageParam:page=>page.has_more?page.next_cursor:undefined, staleTime:0 });
  return <section className="mt-5 border-t pt-5"><h3 className="text-base font-semibold">Technická dokumentace</h3>
    {query.isPending && <p role="status" className="mt-3 text-sm">Načítám dokumenty…</p>}
    {query.isError && <p role="alert" className="mt-3 text-sm text-destructive">Dokumenty se nepodařilo načíst. <button className="underline" onClick={()=>query.refetch()}>Zkusit znovu</button></p>}
    {query.data?.pages[0]?.items.length===0 && <p className="mt-3 text-sm text-muted-foreground">K tomuto systému zatím nebyla přidána dokumentace pro zákazníka.</p>}
    <div className="mt-3 grid gap-3 sm:grid-cols-2">{query.data?.pages.flatMap(p=>p.items).map(doc=><div key={doc.id} className="rounded-lg border bg-muted p-4"><p className="break-words text-sm font-semibold">{doc.title}</p>{doc.version && <p className="text-xs text-muted-foreground">Verze {doc.version}</p>}{safeFileUrl(doc.file_url)?<a href={safeFileUrl(doc.file_url)} target="_blank" rel="noopener noreferrer" download className="mt-3 inline-flex items-center gap-2 text-sm text-primary underline"><Download size={15}/>Otevřít / stáhnout</a>:<p className="text-xs text-muted-foreground">Soubor nyní není dostupný.</p>}</div>)}</div>
    {query.hasNextPage && <button className="portal-secondary mt-4" disabled={query.isFetchingNextPage} onClick={()=>query.fetchNextPage()}>Další dokumenty</button>}
  </section>;
}