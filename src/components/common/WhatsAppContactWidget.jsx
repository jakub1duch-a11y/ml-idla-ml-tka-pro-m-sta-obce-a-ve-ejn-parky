import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Popover from '@radix-ui/react-popover';
import { ArrowUpRight, MessageCircle, Phone, Send, X } from 'lucide-react';
import '@/styles/contact-and-navigation.css';

const PHONE = '420774700390';
const DEFAULT_MESSAGE = 'Dobrý den, rád/a bych se poradil/a o mlžení pro náš prostor.';
const TOPICS = [
  ['Výběr mlžítka', 'Dobrý den, potřebuji poradit s výběrem mlžítka pro náš prostor.'],
  ['Návrh zóny', 'Dobrý den, zajímá mě návrh rozmístění mlžítek a mlžných zón.'],
  ['Instalace', 'Dobrý den, potřebuji konzultovat kotvení a přívod vody k mlžítku.'],
];

export default function WhatsAppContactWidget() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 1023px)');
    const update = () => setMobile(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  useEffect(() => { setOpen(false); }, [location.pathname]);
  if (location.pathname.startsWith('/admin')) return null;
  const href = `https://wa.me/${PHONE}?text=${encodeURIComponent(message.trim() || DEFAULT_MESSAGE)}`;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" className="whatsapp-side-trigger" aria-label="Otevřít kontakt přes WhatsApp s Ing. Radkem Medunou">
          <MessageCircle size={25} aria-hidden="true" /><span className="whatsapp-side-label">WhatsApp</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content side={mobile ? 'top' : 'left'} align={mobile ? 'end' : 'center'} sideOffset={14} collisionPadding={16} aria-label="WhatsApp kontakt — Ing. Radek Meduna"
          className="whatsapp-contact-panel z-[60] max-h-[min(calc(100dvh-2rem),var(--radix-popover-content-available-height))] w-[min(340px,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-[1.75rem] bg-white text-[#17394C] shadow-[0_24px_80px_rgba(5,32,45,.24)] focus:outline-none">
          <div className="relative bg-[#082C3F] p-5 text-white">
            <Popover.Close aria-label="Zavřít WhatsApp kontakt" className="absolute right-2.5 top-2.5 flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-cyan-200"><X size={18} /></Popover.Close>
            <p className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.18em] text-[#BCE8E7]"><MessageCircle size={14} /> Osobní konzultace</p>
            <div className="flex items-center gap-3 pr-2">
              <img src="/media/avatars/radek-meduna-support.webp" alt="Avatar Ing. Radka Meduny" width="64" height="64" className="h-16 w-16 shrink-0 rounded-full bg-white object-cover" />
              <div><p className="font-heading text-lg font-semibold leading-tight">Ing. Radek Meduna</p><p className="mt-1 text-xs leading-5 text-[#CAE0E9]">Výběr mlžítka a technické řešení</p></div>
            </div>
          </div>
          <div className="p-5">
            <p className="text-sm leading-6 text-[#365366]">Pošlete nám fotografii místa, půdorys nebo svůj dotaz. Pomůžeme s návrhem i instalací.</p>
            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Téma konzultace">
              {TOPICS.map(([label, text]) => <button key={label} type="button" onClick={() => setMessage(text)} className="min-h-10 rounded-full bg-[#EDF6F7] px-3 text-xs font-semibold text-[#235568] hover:bg-[#D9ECEF] focus-visible:ring-2 focus-visible:ring-[#087C91]">{label}</button>)}
            </div>
            <label htmlFor="whatsapp-contact-message" className="mt-4 block text-xs font-semibold text-[#17394C]">Vaše zpráva</label>
            <textarea id="whatsapp-contact-message" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={1200} rows={3} placeholder={DEFAULT_MESSAGE}
              className="mt-2 w-full resize-y rounded-2xl border-0 bg-[#F0F5F7] p-3 text-sm leading-6 text-[#17394C] placeholder:text-[#5A737F] focus:outline-none focus:ring-2 focus:ring-[#087C91]" />
            <a href={href} target="_blank" rel="noopener noreferrer" className="mt-3 flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#167C49] px-4 text-sm font-bold text-white transition-colors hover:bg-[#106039] focus-visible:ring-2 focus-visible:ring-[#167C49] focus-visible:ring-offset-2"><MessageCircle size={19} /> Pokračovat na WhatsApp <ArrowUpRight size={15} /></a>
            <p className="mt-2 text-center text-[11px] leading-5 text-[#5A737F]">Zprávu odešlete až ve WhatsAppu.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href={`tel:+${PHONE}`} className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#F0F5F7] text-xs font-semibold text-[#235568]"><Phone size={14} /> Zavolat</a>
              <Link to="/poptavka" className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#F0F5F7] text-xs font-semibold text-[#235568]"><Send size={14} /> Poptávka</Link>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
