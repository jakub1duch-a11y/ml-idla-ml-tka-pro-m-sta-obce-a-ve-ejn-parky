import React from 'react';
import { ExternalLink, Play } from 'lucide-react';

const MATERIALS = [
  ['Obálka', 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/c9fd83e15_obalka.PNG'],
  ['Katalog', 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/937e9976c_katalog.PNG'],
  ['Oblečení týmu', 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/046393468_brandmarch.PNG'],
  ['Laserové štítky', 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/55ad64b81_laserstitky.PNG'],
  ['Veletržní stánek', 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/47ca0affa_veletrh.PNG'],
  ['Firemní složka', 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/d3908f8aa_firemnislozka.PNG'],
  ['Vizitka', 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/42ce8c67d_vizitka.PNG'],
  ['Sociální sítě', 'https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/c777d2b8d_facebook-instagram.PNG']
];

const LINKS = [
  ['Město Polná', 'https://www.facebook.com/100086835253566/posts/990017113902788/'],
  ['Polenský zpravodaj', 'https://www.mesto-polna.cz/polensky-zpravodaj/ms-63762'],
  ['Instagram @mlzidla', 'https://www.instagram.com/mlzidla/'],
  ['Facebook HolmTec', 'https://www.facebook.com/holmtec/']
];

export default function BrandShowcase() {
  return <>
    <section className="bg-white"><div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.1fr_.9fr] lg:px-10 lg:py-24">
      <div><p className="font-mono text-[11px] tracking-[.18em] uppercase text-secondary">Základ identity</p><h2 className="mt-4 font-heading text-4xl text-foreground lg:text-5xl">Barvy, znak a typografie, které drží značku pohromadě.</h2><p className="mt-5 max-w-xl text-muted-foreground">MLŽIDLA® spojují průmyslovou přesnost, autorskou tvorbu a péči o výsledek. Vizuální systém působí jistě, odborně a svěže.</p><div className="mt-8 grid grid-cols-5 overflow-hidden rounded-lg border border-slate-200">{[['#0A1628','Navy Core'], ['#1A85B0','Clear Blue'], ['#2BBFCF','Fresh Cyan'], ['#91A6B5','Steel Mist'], ['#F7F9FB','White Space']].map(([color, name]) => <div key={name}><div className="h-16" style={{ backgroundColor: color }}/><p className="p-2 text-[9px] font-mono uppercase text-slate-500">{name}</p></div>)}</div></div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8"><img src="https://media.base44.com/images/public/6a3ee88c10959cd3588c4d68/314f4a3ac_mlzidla_logo_bez_pozadi.png" alt="Logo MLŽIDLA" className="mx-auto h-24 w-auto max-w-full object-contain"/><div className="mt-8 border-t border-slate-200 pt-6"><p className="font-mono text-[11px] tracking-[.18em] uppercase text-secondary">Typografie</p><p className="mt-3 font-heading text-2xl text-foreground">Manrope — titulky</p><p className="text-muted-foreground">Inter — texty · JetBrains Mono — technická data</p></div><div className="mt-6 overflow-hidden rounded-xl bg-primary"><video className="aspect-video w-full object-cover" src="https://media.base44.com/videos/public/6a3ee88c10959cd3588c4d68/e93fc3844_mist-animatedicon02.mp4" autoPlay muted loop playsInline /><span className="sr-only"><Play/> Animace značky MLŽIDLA</span></div></div>
    </div></section>
    <section className="bg-slate-50"><div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24"><p className="font-mono text-[11px] tracking-[.18em] uppercase text-secondary">Propagační materiály</p><h2 className="mt-4 font-heading text-4xl text-foreground lg:text-5xl">Značka v prostoru, na produktu i v rukou zákazníka.</h2><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{MATERIALS.map(([label, image]) => <figure key={label} className="overflow-hidden rounded-xl border border-slate-200 bg-white"><img src={image} alt={label} className="aspect-[4/3] w-full object-cover"/><figcaption className="px-4 py-3 text-sm font-semibold text-foreground">{label}</figcaption></figure>)}</div></div></section>
    <section className="bg-white"><div className="mx-auto max-w-7xl px-6 py-16 lg:px-10"><p className="font-mono text-[11px] tracking-[.18em] uppercase text-secondary">Ohlasy a kanály</p><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{LINKS.map(([label, url]) => <a key={label} href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between border border-slate-200 px-5 py-4 text-sm font-semibold text-foreground transition-colors hover:border-secondary hover:text-secondary">{label}<ExternalLink size={15}/></a>)}</div></div></section>
  </>;
}