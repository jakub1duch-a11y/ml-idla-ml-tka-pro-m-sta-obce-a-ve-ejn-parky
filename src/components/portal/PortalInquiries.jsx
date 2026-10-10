import React, { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { formatDate, statuses } from '@/components/portal/portalUtils';
export default function PortalInquiries({ userId, totals }) {
  const [source, setSource] = useState('standard');
  const query = useInfiniteQuery({ queryKey: ['portal-inquiries', userId, source], initialPageParam: null, queryFn: async ({pageParam}) => (await base44.functions.invoke('loginPortalWithBase44Session', { mode: 'workspace', tab: 'inquiries', source, cursor: pageParam })).data, getNextPageParam: page => page.has_more ? page.next_cursor : undefined });
  return <section className="space-y-4"><h2 className="text-2xl">Historie poptávek</h2><p className="text-sm text-muted-foreground">Poptávky přiřazené k e-mailu vašeho účtu.</p>
    <div className="flex flex-wrap gap-2">{[['standard','Produktové poptávky'],['contact','Kontaktní dotazy']].map(([key,label])=><button key={key} onClick={()=>setSource(key)} aria-pressed={source===key} className={`rounded-lg border px-4 py-3 text-sm ${source===key?'bg-primary text-primary-foreground':'bg-card text-foreground'}`}>{label} ({totals?.[key] ?? '—'})</button>)}</div>
    {query.isPending && <p role="status">Načítám historii…</p>}{query.isError && <div role="alert">Historii se nepodařilo načíst. <button className="underline" onClick={()=>query.refetch()}>Zkusit znovu</button></div>}
    {query.data?.pages[0]?.items.length === 0 && <p className="rounded-lg border border-dashed p-8 text-muted-foreground">V této kategorii zatím nemáte žádnou poptávku.</p>}
    {query.data?.pages.flatMap(page=>page.items).map(item=><article key={item.id} className="rounded-lg border bg-card p-5"><div className="flex flex-wrap justify-between gap-3"><h3 className="text-lg">{item.produkt || 'Kontaktní dotaz'}</h3><span className="badge-brand-accent">{statuses[item.status] || 'Evidováno'}</span></div><p className="mt-3 whitespace-pre-wrap break-words text-sm">{item.zprava || item.message || item.description}</p><p className="mt-4 text-xs text-muted-foreground">Přijato {formatDate(item.created_date)}</p></article>)}
    {query.hasNextPage && <button className="portal-secondary" disabled={query.isFetchingNextPage} onClick={()=>query.fetchNextPage()}>Načíst další poptávky</button>}
  </section>;
}