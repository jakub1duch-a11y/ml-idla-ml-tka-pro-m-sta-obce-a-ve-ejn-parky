import React from 'react';

const PARTNERS = ['Město Trutnov', 'ZOO Praha', 'Aquapark Babylon', 'Sportcentrum', 'Development Group', 'Krajský úřad'];

export default function LightPartners() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
      <h2 className="font-heading font-bold text-2xl text-slate-900 mb-6">Partnerství</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {PARTNERS.map((p) => (
          <div key={p} className="flex items-center justify-center px-4 py-6 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-sm font-semibold text-slate-400 text-center">{p}</span>
          </div>
        ))}
      </div>
    </section>
  );
}