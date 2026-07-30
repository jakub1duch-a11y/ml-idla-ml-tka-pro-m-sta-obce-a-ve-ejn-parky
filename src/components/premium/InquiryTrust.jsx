import React from 'react';
import { Clock3, PenTool, ShieldCheck } from 'lucide-react';
const items = [[Clock3, 'Odpověď do 24 hodin'], [PenTool, 'Návrh na míru'], [ShieldCheck, 'Česká výroba']];
export default function InquiryTrust() { return <div className="grid sm:grid-cols-3 gap-4 mb-8">{items.map(([Icon, label]) => <div key={label} className="flex items-center gap-3 p-4 border border-slate-200 bg-white"><Icon size={18} className="text-teal-700"/><span className="text-sm text-slate-700">{label}</span></div>)}</div>; }