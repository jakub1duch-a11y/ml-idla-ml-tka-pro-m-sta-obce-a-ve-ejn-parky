import React from 'react';

const FAQS = [
{ q: 'O kolik peníze ušetřím oproti běžnému mlžení?', a: 'Automatické cyklování dle senzorů teploty a vlhkosti šetří v průměru 35 % vody a 40 % elektřiny oproti manuálnímu provozu.' },
{ q: 'Lze Smart modul doplnit i na stávající mlžítko?', a: 'Ano, Smart modul lze dodatečně instalovat téměř na jakékoliv naše mlžítko bez zásahu do konstrukce.' },
{ q: 'Funguje automatika i bez neustálého dohledu obsluhy?', a: 'Ano, systém běží plně automaticky podle nastavených scénářů a senzorů, obsluha jen sleduje historii v aplikaci.' }];


export default function SmartFaq() {
  return (
    <div className="space-y-5">
      {FAQS.map((item) =>
      <div key={item.q} className="border-b border-slate-200 pb-5">
          <p className="text-sm font-semibold text-slate-900 mb-1.5">{item.q}</p>
          <p className="text-sm text-slate-500 leading-relaxed">{item.a}</p>
        </div>
      )}
    </div>);

}