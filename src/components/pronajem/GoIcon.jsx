import React from 'react';
import { PartyPopper } from 'lucide-react';

export default function GoIcon() {
  return (
    <div className="absolute right-4 top-4 flex h-20 w-20 flex-col items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-accent to-secondary text-accent-foreground shadow-[0_10px_30px_rgba(17,148,168,.45)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" aria-label="Eventová varianta GO">
      <PartyPopper size={23} strokeWidth={2.3} />
      <span className="font-heading text-xl font-extrabold leading-none">GO</span>
    </div>
  );
}