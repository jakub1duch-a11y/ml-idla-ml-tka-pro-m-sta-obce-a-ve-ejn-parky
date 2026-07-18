import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

export default function SolutionInquiryForm({ product }) {
  const [form, setForm] = useState({ jmeno: '', email: '', firma: '', zprava: '' });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });
  const submit = async (event) => {
    event.preventDefault(); setSending(true); setError('');
    try { await base44.entities.Poptavka.create({ ...form, produkt: product, status: 'nova', landing_page: window.location.pathname }); navigate('/dekujeme?zdroj=reseni'); } catch { setError('Poptávku se nepodařilo odeslat. Zkuste to prosím znovu.'); } finally { setSending(false); }
  };
  return <form onSubmit={submit} className="grid gap-4 border border-slate-200 bg-white p-6 sm:grid-cols-2"><input required placeholder="Jméno a příjmení" value={form.jmeno} onChange={update('jmeno')} className="border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0070F3]" /><input required type="email" placeholder="E-mail" value={form.email} onChange={update('email')} className="border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0070F3]" /><input placeholder="Firma / organizace" value={form.firma} onChange={update('firma')} className="border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0070F3] sm:col-span-2" /><textarea required rows="4" placeholder="Popište stručně váš projekt." value={form.zprava} onChange={update('zprava')} className="border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0070F3] sm:col-span-2" />{error && <p className="text-sm text-red-600 sm:col-span-2">{error}</p>}<button disabled={sending} className="bg-[#0070F3] px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-900 disabled:opacity-60 sm:col-span-2">{sending ? 'Odesílám...' : 'Odeslat poptávku'}</button></form>;
}