import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader, CheckCircle, ArrowRight } from 'lucide-react';

export default function CategoryInquiryForm({ category, projectScope = 'urban' }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    await base44.entities.ContactInquiry.create({
      name: form.name,
      email: form.email,
      project_scope: projectScope,
      message: `[${category}] ${form.message}${form.phone ? ` | Tel: ${form.phone}` : ''}`
    });
    setStatus('sent');
  };

  if (status === 'sent') {
    return (
      <div className="text-center py-6">
        <CheckCircle size={26} className="text-slate-900 mx-auto mb-3" />
        <p className="text-slate-900 font-medium">Děkujeme za poptávku!</p>
        <p className="text-slate-500 text-sm mt-1">Ozveme se vám do 24 hodin.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="Jméno a příjmení" className="px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-slate-900 bg-white" />
      <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="E-mail" className="px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-slate-900 bg-white" />
      <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="Telefon (nepovinné)" className="px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-slate-900 bg-white sm:col-span-2" />
      <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
        placeholder="Popište váš záměr..." rows={3} className="px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-slate-900 bg-white sm:col-span-2 resize-none" />
      <button type="submit" disabled={status === 'sending'}
        className="btn-inquiry-pulse sm:col-span-2 justify-center rounded-full bg-primary px-8 py-4 text-sm font-bold text-primary-foreground disabled:opacity-60">
        {status === 'sending' ? <Loader size={16} className="animate-spin" /> : <>Odeslat poptávku <ArrowRight size={15} /></>}
      </button>
    </form>
  );
}