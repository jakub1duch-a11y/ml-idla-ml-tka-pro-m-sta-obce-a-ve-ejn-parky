import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { setSEO } from '@/lib/seo';
import DocumentRequestForm from '@/components/documents/DocumentRequestForm';

export default function ZadostOPodklady() {
  const [params] = useSearchParams();
  useEffect(() => {
    setSEO({ title: 'Žádost o technické podklady | MLŽIDLA.cz', description: 'Vyžádejte si technické listy, výkresy a montážní dokumentaci pro konkrétní produkt a projekt.', canonicalPath: '/zadost-o-podklady' });
  }, []);
  const initialValues = {
    name: '', email: '', company: '', consent: false, details: '',
    product: (params.get('produkt') || '').slice(0, 200),
    document: (params.get('dokument') || params.get('zprava') || '').slice(0, 1000),
  };
  return (
    <div className="min-h-screen bg-background px-5 pb-20 pt-[calc(var(--site-header-height)+2rem)] text-foreground sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/ke-stazeni" className="text-sm font-semibold text-primary underline underline-offset-4">Přehled podkladů</Link>
        <header className="mb-8 mt-6">
          <h1 className="font-heading text-3xl sm:text-4xl">Žádost o technické podklady</h1>
          <p className="mt-4 text-muted-foreground">Napište, jaké dokumenty potřebujete. Technické listy, výkresy a montážní podklady poskytujeme individuálně podle produktu a účelu použití.</p>
        </header>
        <DocumentRequestForm key={params.toString()} initialValues={initialValues} />
      </div>
    </div>
  );
}