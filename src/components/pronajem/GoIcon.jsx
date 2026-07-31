import React from 'react';
import { PartyPopper } from 'lucide-react';

export default function GoIcon({ variant = 'card' }) {
  const size = variant === 'button'
    ? 'right-2 top-1/2 h-16 w-16 -translate-y-1/2 translate-x-5 group-hover:-translate-y-1/2 group-hover:translate-x-4'
    : 'right-4 top-4 h-20 w-20 group-hover:scale-110';
  return (
    <div className={`absolute flex flex-col items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-accent to-secondary text-accent-foreground shadow-[0_10px_30px_rgba(17,148,168,.45)] transition-all duration-300 group-hover:rotate-3 ${size}`} aria-label="Eventová varianta GO">
      <PartyPopper size={variant === 'button' ? 18 : 23} strokeWidth={2.3} />
      <span className={`${variant === 'button' ? 'text-base' : 'text-xl'} font-heading font-extrabold leading-none`}>GO</span>
    </div>
  );
}