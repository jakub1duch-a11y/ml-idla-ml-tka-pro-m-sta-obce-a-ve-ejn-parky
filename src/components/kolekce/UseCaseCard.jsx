import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { quoteForSpace } from '@/lib/spacePresentation';

export default function UseCaseCard({ item, index, reduceMotion }) {
  const { icon: Icon, code, title, text, image } = item;
  return <motion.article className="space-use-card" initial={reduceMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: reduceMotion ? 0 : .45, delay: reduceMotion ? 0 : (index % 4) * .05 }}>
    <img src={image} alt={`Ukázka mlžení v prostoru: ${title}`} width="720" height="960" loading="lazy" decoding="async" /><div className="space-use-shade" aria-hidden="true" /><div className="space-use-copy"><div className="space-use-icon"><Icon size={20} strokeWidth={1.6} aria-hidden="true" /><span>{code}</span></div><h3>{title}</h3><p>{text}</p><Link className="space-use-quote" to={quoteForSpace(title)}>Poptat podobné řešení <ArrowRight size={16} aria-hidden="true" /></Link></div>
  </motion.article>;
}
