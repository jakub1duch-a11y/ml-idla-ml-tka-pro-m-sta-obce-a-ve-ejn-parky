import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Heart, ShoppingBag, UsersRound, Wind } from 'lucide-react';
import WindMistOverlay from '@/components/home/premium/WindMistOverlay';

const BENEFITS = [
{ Icon: Heart, text: 'Příjemnější pobyt na náměstích, terasách a promenádách' },
{ Icon: UsersRound, text: 'Vyšší komfort pro návštěvníky všech věkových skupin' },
{ Icon: Wind, text: 'Jemná mlha pomáhá vázat část polétavého prachu a pylu' },
{ Icon: Building2, text: 'Vhodné pro veřejný prostor, areály i pobytové zóny' },
{ Icon: ShoppingBag, text: 'Příjemnější mikroklima může podpořit delší pobyt návštěvníků' }];


export default function UrbanCoolingImpact() {
  const [temperature, setTemperature] = useState(34);
  useEffect(() => {
    const timer = setInterval(() => setTemperature((value) => value > 24 ? value - 1 : 34), 480);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-primary py-16 text-primary-foreground sm:py-20 lg:py-24">
      <WindMistOverlay />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 sm:gap-14 lg:grid-cols-2 lg:gap-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-white/70">Dopad na veřejný prostor</p>
            <h2 className="mb-5 font-heading text-[clamp(2rem,8vw,2.6rem)] leading-[1.08] tracking-[-0.035em] text-white md:text-4xl">Veřejný prostor, kde se pobyt i v horku</h2>
            <p className="max-w-md text-base leading-relaxed text-white/80">Jemná mlha okamžitě ochlazuje okolí a prodlužuje pobyt návštěvníků na náměstích, v parcích i na terasách.</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {BENEFITS.map((b, i) =>
              <motion.div key={b.text} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="flex items-center gap-2 text-sm text-white/90">
                  <b.Icon size={16} className="shrink-0 text-accent" />
                  {b.text}
                </motion.div>
              )}
            </div>

            <Link to="/mlzidla-mlzitka" className="btn-metallic-mist mt-8 inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold">
              Prohlédnout mlžítka <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mx-auto flex h-56 w-56 flex-col items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 text-center backdrop-blur sm:h-64 sm:w-64">
            <span className="font-heading text-6xl tabular-nums text-white sm:text-7xl">{temperature}°</span>
            <span className="mt-2 max-w-[16rem] font-mono text-[10px] uppercase leading-4 tracking-[.14em] text-white/70 sm:text-xs sm:tracking-widest">ILUSTRACE POCITOVÉHO OCHLAZENÍ</span>
          </motion.div>
        </div>
      </div>
    </section>);

}