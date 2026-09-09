import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';

export default function MobileStickyBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex border-t border-[#0B5EA8]/15 bg-white/95 backdrop-blur-md lg:hidden">
      <a
        href="tel:+420774700390"
        className="flex flex-1 items-center justify-center gap-2 py-4 text-sm font-semibold text-[#0D2F4F]"
      >
        <Phone size={16} className="text-[#0B5EA8]" />
        Zavolat
      </a>
      <Link
        to="/poptavka"
        className="flex flex-1 items-center justify-center bg-[#0B5EA8] py-4 text-sm font-semibold uppercase tracking-wide text-white"
      >
        Poptat
      </Link>
    </div>
  );
}