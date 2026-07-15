import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const IMG = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop';

export default function FeatureCardsRow6() {
  return (
    <section className="relative bg-black pb-24 px-6 lg:px-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-3xl bg-white/5 border border-white/10 p-7 flex flex-col justify-between min-h-[260px]">
          <div>
            <h3 className="text-white text-xl font-heading font-medium mb-3">Zakázková výroba</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs">Nerez 316L</span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs">CNC výroba</span>
            </div>
          </div>
          <Link to="/poptavka" className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-xs font-semibold rounded-full w-fit hover:bg-white/90 transition-colors">
            Nezávazná poptávka <ArrowUpRight size={13} />
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.08 }}
          className="relative rounded-3xl overflow-hidden min-h-[260px] group">
          <img src={IMG} alt="Chytré ovládání mlžení" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-end p-7">
            <p className="text-white text-lg font-heading font-medium">Chytré ovládání</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.16 }}
          className="rounded-3xl bg-violet-600/20 border border-violet-400/20 p-7 flex flex-col justify-between min-h-[260px]">
          <div className="flex items-center justify-between">
            <p className="text-xs text-white/50">Úspora vody</p>
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-violet-300 text-xs">%</span>
          </div>
          <div>
            <p className="text-4xl font-heading font-semibold text-white mb-1">99,7 %</p>
            <p className="text-white/50 text-sm">Recyklovaná voda v systému</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}