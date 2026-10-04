import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export default function MediaDialog({ open, onOpenChange, title, children }) {
  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[150] bg-[#04111e]/95 backdrop-blur-sm" />
      <Dialog.Content aria-describedby={undefined} className="fixed left-1/2 top-1/2 z-[151] w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 -translate-y-1/2 text-white focus:outline-none">
        <div className="mb-3 flex items-center justify-between gap-4">
          <Dialog.Title className="text-base font-semibold">{title}</Dialog.Title>
          <Dialog.Close aria-label="Zavřít" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/40 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"><X size={22}/></Dialog.Close>
        </div>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
