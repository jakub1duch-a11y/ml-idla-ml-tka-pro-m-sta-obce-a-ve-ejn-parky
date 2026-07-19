import React, { useState } from 'react';
import { Download, FileCog, FileText, LoaderCircle, Wrench } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const documents = [
  { id: 'datasheet', label: 'Technický produktový list', icon: FileText },
  { id: 'installation', label: 'Instalační manuál', icon: FileCog },
  { id: 'maintenance', label: 'Manuál údržby', icon: Wrench },
];

export default function ProductPdfDownloads({ product }) {
  const [loading, setLoading] = useState('');
  const download = async (type) => {
    setLoading(type);
    try {
      const response = type === 'datasheet' ? await base44.functions.invoke('generateProductDatasheet', { product }) : await base44.functions.invoke('generateProductManual', { product, documentType: type });
      const binary = atob(response.data.pdf_base64); const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' })); const link = document.createElement('a');
      link.href = url; link.download = response.data.filename; link.click(); URL.revokeObjectURL(url);
    } finally { setLoading(''); }
  };
  return <div className="grid gap-3 sm:grid-cols-3">{documents.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => download(id)} disabled={Boolean(loading)} className="group flex min-h-32 flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-900 disabled:opacity-60"><Icon size={22} className="text-techblue" /><span className="mt-4 text-sm font-bold text-slate-900">{label}</span><span className="mt-3 inline-flex items-center gap-2 text-xs text-slate-500">{loading === id ? <LoaderCircle size={13} className="animate-spin" /> : <Download size={13} />} {loading === id ? 'Připravuji PDF…' : 'Stáhnout PDF'}</span></button>)}</div>;
}