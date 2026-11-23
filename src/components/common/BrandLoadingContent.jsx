import React from 'react';
import { LoaderCircle } from 'lucide-react';
import Logo from '@/components/layout/Logo';

export default function BrandLoadingContent() {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-7 px-6 text-secondary-foreground">
      <Logo size="lg" tone="light" className="max-w-full" />
      <div className="flex items-center gap-3 text-sm">
        <LoaderCircle size={18} aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
        <span>Načítání…</span>
      </div>
    </div>
  );
}