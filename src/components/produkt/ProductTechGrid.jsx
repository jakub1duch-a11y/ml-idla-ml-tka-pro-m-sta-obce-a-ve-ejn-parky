import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Thermometer, Droplets, Wallet } from 'lucide-react';

const WATER_PRICE_PER_M3 = 90; // Kč
const OPERATING_HOURS_PER_DAY = 8;

export default function ProductTechGrid({ product }) {
  const litersPerHour = useMemo(() => {
    const match = (product?.water_consumption || '').match(/[\d.,]+/);
    return match ? parseFloat(match[0].replace(',', '.')) : 8;
  }, [product?.water_consumption]);

  const dailyLiters = litersPerHour * OPERATING_HOURS_PER_DAY;
  const dailyCost = dailyLiters / 1000 * WATER_PRICE_PER_M3;

  const items = [
    { icon: Thermometer, title: 'Ochlazení okolí', value: 'až −9 °C', desc: 'Při tlaku 4 bar' },
    { icon: Droplets, title: 'Spotřeba vody', value: `${dailyLiters.toFixed(0)} L/den`, desc: `Při ${OPERATING_HOURS_PER_DAY}h provozu` },
    { icon: Wallet, title: 'Denní náklady', value: `${dailyCost.toFixed(1)} Kč`, desc: 'Odhad ceny vody' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6 }}
      className="backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-sm bg-white/10"
    >
      <p className="font-mono tracking-widest uppercase text-white/60 text-xs mb-4">Technické parametry</p>
      <div className="grid grid-cols-3 gap-3">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            whileHover={{ scale: 1.06 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
              className="mb-2"
            >
              <item.icon size={18} className="text-cyan" />
            </motion.div>
            <p className="text-sm text-white font-medium leading-tight">{item.value}</p>
            <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1 leading-tight">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}