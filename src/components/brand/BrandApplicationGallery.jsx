import React from 'react';

const ITEMS = [
  ['Katalog','https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/937e9976c_katalog.PNG'],
  ['Sociální sítě','https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/c777d2b8d_facebook-instagram.PNG'],
  ['Veletržní stánek','https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/47ca0affa_veletrh.PNG'],
  ['Oblečení týmu','https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/046393468_brandmarch.PNG'],
  ['Firemní složka','https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/d3908f8aa_firemnislozka.PNG'],
  ['Označení produktu','https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/55ad64b81_laserstitky.PNG']
];

export default function BrandApplicationGallery() {
  return <section id="ukazky" className="scroll-mt-32 bg-background py-20 lg:py-28"><div className="mx-auto max-w-7xl px-6 lg:px-10">
    <p className="font-mono text-[11px] uppercase tracking-[.18em] text-secondary">05 · Ukázky použití</p><h2 className="mt-4 font-heading text-4xl lg:text-5xl">Značka musí držet pohromadě v každém kontaktu.</h2>
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{ITEMS.map(([label,image]) => <figure key={label} className="overflow-hidden rounded-2xl border border-border bg-card"><img src={image} alt={`Ukázka značky: ${label}`} className="aspect-[4/3] w-full object-cover"/><figcaption className="flex items-center justify-between px-5 py-4"><span className="font-semibold">{label}</span><span className="font-mono text-[10px] uppercase tracking-widest text-secondary">Doporučený náhled</span></figcaption></figure>)}</div>
    <div className="mt-12 grid gap-5 rounded-2xl bg-primary p-8 text-primary-foreground md:grid-cols-3"><div><p className="font-mono text-xs text-accent">Kontrolní bod 01</p><p className="mt-3">Je hlavní sdělení pochopitelné do tří sekund?</p></div><div><p className="font-mono text-xs text-accent">Kontrolní bod 02</p><p className="mt-3">Je použitá jen jedna výzva k akci?</p></div><div><p className="font-mono text-xs text-accent">Kontrolní bod 03</p><p className="mt-3">Působí výstup jistě, odborně a osvěžujícím dojmem?</p></div></div>
  </div></section>;
}