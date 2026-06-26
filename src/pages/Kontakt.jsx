import React from 'react';
import ContactSection from '@/components/home/ContactSection';

export default function Kontakt() {
  return (
    <div className="pt-20">
      <div className="bg-ink py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="font-mono text-[9px] tracking-widest uppercase text-white/30 mb-3">Kontakt</p>
          <h1 className="font-heading font-light text-4xl lg:text-6xl text-white tracking-tight">Ozvěte se nám</h1>
          <p className="mt-4 text-white/40 text-base">Rádi připravíme nezávaznou nabídku na míru.</p>
        </div>
      </div>
      <ContactSection />
    </div>
  );
}