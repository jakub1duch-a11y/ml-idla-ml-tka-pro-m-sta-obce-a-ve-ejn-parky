import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function NozzleVariantsTable({ variants }) {
  if (!variants || variants.length === 0) return null;

  return (
    <section className="py-16 lg:py-20 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 max-w-2xl">
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-4">Varianty trysek</p>
          <h2 className="font-heading font-light text-3xl lg:text-4xl text-slate-900 tracking-tight mb-4">
            Nízkotlaké trysky<br /><span className="text-slate-400">a jejich průtoky dle tlaku.</span>
          </h2>
          <p className="text-slate-500 text-base font-light leading-relaxed">
            Vyberte variantu podle požadovaného průtoku a tlaku ve vašem systému. Standardně dodáváme variantu označenou jako doporučenou.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-4 text-xs font-mono tracking-widest uppercase text-slate-400">Varianta</th>
                <th className="text-left px-4 py-4 text-xs font-mono tracking-widest uppercase text-slate-400">5 bar</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v, i) => (
                <tr key={v.code} className={`border-b border-slate-100 last:border-b-0 ${v.is_standard ? 'bg-slate-900/[0.03]' : i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{v.code}</span>
                      {v.is_standard && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold tracking-wide uppercase">
                          <CheckCircle2 size={10} /> Standard
                        </span>
                      )}
                    </div>
                    {v.material && <p className="text-xs text-slate-400 font-light mt-0.5">{v.material}</p>}
                  </td>
                  <td className="px-4 py-4 text-slate-700">{v.flow_5bar || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}