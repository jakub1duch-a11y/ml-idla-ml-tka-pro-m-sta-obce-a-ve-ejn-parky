import React from 'react';
import { ExternalLink, Smartphone } from 'lucide-react';

const apps = [
  { name: 'Tuya Smart', text: 'Hlavní aplikace pro Wi‑Fi ventily, zóny, časové plány a automatické scénáře.', google: 'https://play.google.com/store/apps/details?id=com.tuya.smart', apple: 'https://apps.apple.com/app/tuya-smart/id1034649547' },
  { name: 'Smart Life', text: 'Alternativní aplikace na stejné platformě Tuya s obdobným párováním a ovládáním.', google: 'https://play.google.com/store/apps/details?id=com.tuya.smartlife', apple: 'https://apps.apple.com/app/smart-life-smart-living/id1115101477' },
];

export default function AppDownloadCards() {
  return <div className="grid gap-4 md:grid-cols-2">{apps.map(app => <article key={app.name} className="rounded-2xl border border-slate-200 bg-white p-6"><Smartphone size={23} className="text-techblue" /><h3 className="mt-4 text-xl font-semibold text-slate-900">{app.name}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{app.text}</p><div className="mt-5 flex flex-wrap gap-2"><a href={app.google} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white">Google Play <ExternalLink size={12} /></a><a href={app.apple} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-800">App Store <ExternalLink size={12} /></a></div></article>)}</div>;
}