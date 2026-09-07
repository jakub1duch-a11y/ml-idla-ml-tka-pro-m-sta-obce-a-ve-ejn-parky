import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageSquare } from 'lucide-react';

const PHONE = '+420 774 700 390';

export default function MobileStickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 p-2 sm:hidden">
      <a
        href={`tel:${PHONE.replace(/\s/g, '')}`}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-[#0a1628] py-3 text-sm font-bold text-white shadow-lg"
      >
        <Phone size={16} className="text-cyan-300" /> Zavolat
      </a>
      <Link
        to="/poptavka"
        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#61d5e5] py-3 text-sm font-bold text-[#082934] shadow-lg"
      >
        <MessageSquare size={16} /> Poptat
      </Link>
    </div>
  );
}