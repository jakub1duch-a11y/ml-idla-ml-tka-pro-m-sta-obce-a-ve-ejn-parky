import React, { useState } from 'react';
import { Download, LoaderCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function ProductDatasheetDownload({ product }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const response = await base44.functions.invoke('generateProductDatasheet', { product });
      const { pdf_base64, filename } = response.data;
      const binary = atob(pdf_base64);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsGenerating(false);
    }
  };

  return <button type="button" onClick={handleDownload} disabled={isGenerating} className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 disabled:opacity-60 transition-all">
    {isGenerating ? <LoaderCircle size={15} className="animate-spin" /> : <Download size={15} />}
    {isGenerating ? 'Připravuji PDF…' : 'Stáhnout produktový PDF list'}
  </button>;
}