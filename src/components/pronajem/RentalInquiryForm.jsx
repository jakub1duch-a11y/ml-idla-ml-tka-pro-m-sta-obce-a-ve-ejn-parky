import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { trackRentalInquiry } from '@/lib/ga4';

export default function RentalInquiryForm({ products }) {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', event: '', date: '', product: params.get('produkt') || '', message: '' });
  const change = (key) => (event) => setForm((value) => ({ ...value, [key]: event.target.value }));
  const submit = async (event) => { event.preventDefault(); setSending(true); try { await base44.entities.ContactInquiry.create({ name: form.name, email: form.email, project_scope: 'event', message: `[PRONÁJEM / ${form.product || 'výběr modelu'} GO] Akce: ${form.event}. Termín: ${form.date}. ${form.message}`, description: form.phone ? `Tel: ${form.phone}` : '', status: 'new' }); trackRentalInquiry(form.product, form.event); base44.analytics.track({ eventName: 'rental_inquiry_submit', properties: { product: form.product || 'nezvoleno', event_type: form.event } }); navigate('/dekujeme?zdroj=pronajem'); } finally { setSending(false); } };
  const field = 'w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-accent';
  return <form id="poptavka" onSubmit={submit} className="rounded-3xl border border-border bg-card p-6 lg:p-10"><div className="grid gap-5 sm:grid-cols-2"><input required placeholder="Jméno a příjmení *" value={form.name} onChange={change('name')} className={field}/><input required type="email" placeholder="E-mail *" value={form.email} onChange={change('email')} className={field}/><input placeholder="Telefon" value={form.phone} onChange={change('phone')} className={field}/><input required placeholder="Typ akce *" value={form.event} onChange={change('event')} className={field}/><input required type="date" value={form.date} onChange={change('date')} className={field}/><select value={form.product} onChange={change('product')} className={field}><option value="">Doporučit vhodný model</option>{products.map((product) => <option key={product.id} value={product.name}>{product.name} GO</option>)}</select></div><textarea placeholder="Místo, počet hostů a další požadavky" value={form.message} onChange={change('message')} rows={4} className={`${field} mt-5 resize-none`}/><button disabled={sending} className="btn-inquiry-pulse mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-bold text-primary-foreground disabled:opacity-60">{sending ? <Loader size={17} className="animate-spin"/> : <>Poptat cenu pronájmu <ArrowRight size={16}/></>}</button></form>;
}