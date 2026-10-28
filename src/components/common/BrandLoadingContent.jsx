import React from 'react';
import { LoaderCircle } from 'lucide-react';
import MlzidlaLogoSvg from '@/components/brand/MlzidlaLogoSvg';

export default function BrandLoadingContent() {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-7 px-6 text-secondary-foreground">
      <MlzidlaLogoSvg className="h-auto w-60 max-w-full sm:w-72" />
      <div className="flex items-center gap-3 text-sm">
        <LoaderCircle size={18} aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
        <span>Načítání…</span>
      </div>
    </div>
  );
}