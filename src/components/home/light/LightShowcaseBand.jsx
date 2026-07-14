import React from 'react';

const IMAGE = 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/df5b375c0_Mlzitko-spirala2.png';

export default function LightShowcaseBand() {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-10 py-4">
      <div className="rounded-2xl overflow-hidden bg-slate-100 aspect-[16/6]">
        <img src={IMAGE} alt="Mlžný systém v parku" className="w-full h-full object-cover" />
      </div>
    </section>
  );
}