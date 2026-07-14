import React from 'react';
import DarkHowItWorks from '@/components/home/darkglass/DarkHowItWorks';
import DarkContactForm from '@/components/home/darkglass/DarkContactForm';

export default function DarkInfoSection() {
  return (
    <section className="bg-slate-950 py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-8 items-start">
        <DarkHowItWorks />
        <DarkContactForm />
      </div>
    </section>
  );
}